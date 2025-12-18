const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);

// CORS origin from environment variable
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// Waiting queue for users looking for matches
const waitingQueue = [];
// Active connections map: socketId -> { socket, role, interests, partnerId }
const activeUsers = new Map();
// Rate limiting for queue operations
const queueJoinCooldown = new Map(); // socketId -> timestamp
// Connection limits per IP
const connectionsByIP = new Map();
const MAX_CONNECTIONS_PER_IP = 5;

// Connection limit middleware
io.use((socket, next) => {
  const ip = socket.handshake.address;
  const current = connectionsByIP.get(ip) || 0;
  
  if (current >= MAX_CONNECTIONS_PER_IP) {
    console.log(`Connection rejected from ${ip}: too many connections`);
    return next(new Error('Too many connections from your IP'));
  }
  
  connectionsByIP.set(ip, current + 1);
  socket.on('disconnect', () => {
    const count = connectionsByIP.get(ip) || 1;
    if (count <= 1) {
      connectionsByIP.delete(ip);
    } else {
      connectionsByIP.set(ip, count - 1);
    }
  });
  
  next();
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Store user connection
  activeUsers.set(socket.id, {
    socket,
    role: null,
    interests: [],
    partnerId: null
  });

  // User joins the matching queue
  socket.on('join_queue', ({ role, interests }) => {
    // Rate limiting - 1 second cooldown
    const lastJoin = queueJoinCooldown.get(socket.id) || 0;
    if (Date.now() - lastJoin < 1000) {
      socket.emit('error', { message: 'Too fast. Please wait.' });
      return;
    }
    queueJoinCooldown.set(socket.id, Date.now());

    console.log(`User ${socket.id} joining queue:`, { role, interests });

    const user = activeUsers.get(socket.id);
    if (!user) return;
    
    user.role = role;
    user.interests = interests || [];

    // Remove from queue if already present (prevent duplicates)
    const existingIndex = waitingQueue.findIndex(u => u.socketId === socket.id);
    if (existingIndex !== -1) {
      waitingQueue.splice(existingIndex, 1);
    }

    // Try to find a match
    const match = findMatch(socket.id, role, user.interests);

    if (match) {
      // Match found - connect the two users
      const partner = activeUsers.get(match);
      user.partnerId = match;
      partner.partnerId = socket.id;

      // Notify both users
      socket.emit('match_found', { partnerId: match });
      partner.socket.emit('match_found', { partnerId: socket.id });

      console.log(`Match created: ${socket.id} <-> ${match}`);
    } else {
      // No match found - add to waiting queue
      waitingQueue.push({
        socketId: socket.id,
        role,
        interests: user.interests,
        timestamp: Date.now()
      });

      socket.emit('searching');
      console.log(`User ${socket.id} added to queue. Queue size: ${waitingQueue.length}`);
    }
  });

  // Leave the matching queue
  socket.on('leave_queue', () => {
    const index = waitingQueue.findIndex(u => u.socketId === socket.id);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
      console.log(`User ${socket.id} left queue. Queue size: ${waitingQueue.length}`);
    }
  });

  // Request next match (skip current partner)
  socket.on('next_match', () => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    if (user.partnerId) {
      // Notify partner that user disconnected
      const partner = activeUsers.get(user.partnerId);
      if (partner) {
        partner.socket.emit('partner_disconnected');
        partner.partnerId = null;
      }

      user.partnerId = null;
    }

    // Remove from queue if present
    const index = waitingQueue.findIndex(u => u.socketId === socket.id);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
    }

    // Rejoin queue with same preferences
    if (user.role) {
      const match = findMatch(socket.id, user.role, user.interests);

      if (match) {
        const partner = activeUsers.get(match);
        user.partnerId = match;
        partner.partnerId = socket.id;

        socket.emit('match_found', { partnerId: match });
        partner.socket.emit('match_found', { partnerId: socket.id });

        console.log(`New match created: ${socket.id} <-> ${match}`);
      } else {
        waitingQueue.push({
          socketId: socket.id,
          role: user.role,
          interests: user.interests,
          timestamp: Date.now()
        });

        socket.emit('searching');
        console.log(`User ${socket.id} searching again. Queue size: ${waitingQueue.length}`);
      }
    }
  });

  // Unified WebRTC signaling relay
  socket.on('signal', ({ target, type, sdp, candidate }) => {
    console.log(`Relaying signal [${type}] from ${socket.id} to ${target}`);
    const partner = activeUsers.get(target);
    if (partner) {
      partner.socket.emit('signal', { 
        sender: socket.id, 
        type, 
        sdp, 
        candidate 
      });
    }
  });

  // Chat message relay
  socket.on('chat_message', ({ message, to }) => {
    const partner = activeUsers.get(to);
    if (partner) {
      partner.socket.emit('chat_message', { message, from: socket.id });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Clean up rate limiting
    queueJoinCooldown.delete(socket.id);

    const user = activeUsers.get(socket.id);

    if (user && user.partnerId) {
      // Notify partner
      const partner = activeUsers.get(user.partnerId);
      if (partner) {
        partner.socket.emit('partner_disconnected');
        partner.partnerId = null;
      }
    }

    // Remove from waiting queue
    const index = waitingQueue.findIndex(u => u.socketId === socket.id);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
    }

    // Remove from active users
    activeUsers.delete(socket.id);

    console.log(`Active users: ${activeUsers.size}, Queue: ${waitingQueue.length}`);
  });
});

// Matching algorithm - Omegle style (random with optional interest matching)
function findMatch(socketId, role, interests) {
  if (waitingQueue.length === 0) {
    return null;
  }

  // Try to find match with common interests first
  if (interests && interests.length > 0) {
    const interestMatch = waitingQueue.find(user => {
      if (user.socketId === socketId) return false;

      // Check for common interests
      const commonInterests = interests.filter(interest =>
        user.interests.includes(interest)
      );

      return commonInterests.length > 0;
    });

    if (interestMatch) {
      const index = waitingQueue.indexOf(interestMatch);
      waitingQueue.splice(index, 1);
      return interestMatch.socketId;
    }
  }

  // No interest match - just get first available user (random matching)
  const randomMatch = waitingQueue.find(user => user.socketId !== socketId);

  if (randomMatch) {
    const index = waitingQueue.indexOf(randomMatch);
    waitingQueue.splice(index, 1);
    return randomMatch.socketId;
  }

  return null;
}

// Health check endpoint with online count
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    activeUsers: activeUsers.size,
    queueLength: waitingQueue.length,
    onlineCount: activeUsers.size
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`ChainMeet matching server running on port ${PORT}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
