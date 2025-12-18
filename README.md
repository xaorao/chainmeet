# ChainMeet

> Random video chat for crypto people. Find your next alpha buddy.

**ChainMeet** connects crypto enthusiasts through smart matching and real-time video/voice/text chat. Built for airdrop hunters, NFT traders, content creators, builders, and ambassadors.

## 🎨 Design Philosophy

ChainMeet features a **Cyber Terminal** aesthetic:
- Pure black background with electric cyan (#00FFD4), lime (#CCFF00), and hot pink (#FF006E) accents
- Monospace headers (Space Mono) + geometric sans body (Manrope)
- Scanline effects, glowing borders, and terminal-inspired UI
- Designed to stand out on Crypto Twitter and go viral

## ✨ Features

- **Smart Matching**: Match by role, blockchain preference, and interests
- **Wallet Verified**: RainbowKit integration with on-chain credibility
- **Multi-Mode Chat**: Video, voice, or text - switch anytime
- **Global Network**: Connect with crypto people worldwide
- **Instant Connect**: < 2 second matching with skip button
- **Alpha Sharing**: Screen share, code snippets, portfolio reveals

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** (App Router, Turbopack)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **RainbowKit + Wagmi v2** for wallet auth
- **Socket.io-client** for real-time
- **simple-peer** for WebRTC
- **Zustand** for state management

### Backend (To Build)
- **PostgreSQL** (Supabase or Neon) for database
- **Prisma** ORM
- **Redis** (Upstash) for matching queue
- **Node.js + Socket.io** WebSocket server
- **NextAuth.js v5** for Twitter OAuth

### Real-time
- **WebRTC** (P2P) for video/voice
- **STUN** (Google) + **TURN** (Xirsys free tier)
- **Socket.io** for signaling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase or Neon)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chainmeet.git
cd chainmeet
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your environment variables:
```bash
cp .env.example .env
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
chainmeet/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles (cyber terminal theme)
├── components/            # React components (to build)
├── lib/                   # Utilities and configs
├── hooks/                 # Custom React hooks
├── stores/                # Zustand state stores
├── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma      # Database schema
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Tailwind config
└── package.json
```

## 🗄️ Database Schema

Key models:
- **User**: Wallet address, Twitter, profile, preferences, stats
- **Match**: Two users, chat mode, duration, status
- **Rating**: 1-5 stars feedback after matches
- **Report**: Moderation system for bad actors

Enums:
- **Role**: AIRDROP_HUNTER, NFT_TRADER, CONTENT_CREATOR, BUILDER, AMBASSADOR, DEGEN
- **Chain**: ETHEREUM, SOLANA, BASE, ARBITRUM, OPTIMISM, POLYGON, etc.
- **Interest**: DEFI, NFTS, AIRDROPS, MEMECOINS, GAMING, AI_AGENTS, etc.

## 🎯 Roadmap

### Phase 1: Foundation (Week 1) ✅
- [x] Next.js project setup
- [x] Stunning landing page with cyber terminal aesthetic
- [x] Prisma database schema
- [ ] RainbowKit wallet authentication
- [ ] Profile system with NFT support

### Phase 2: Matching (Week 2)
- [ ] WebSocket server setup (Fly.io or Supabase Realtime)
- [ ] Redis-based matching algorithm (3-tier: exact/relaxed/wildcard)
- [ ] Queue management with < 2 second match time
- [ ] Presence system (online/offline)

### Phase 3: WebRTC (Week 3)
- [ ] WebRTC signaling via Socket.io
- [ ] Video chat component
- [ ] Voice chat (audio-only)
- [ ] Text chat (data channel)
- [ ] Connection timeout & error handling

### Phase 4: Launch (Week 4)
- [ ] Rating system
- [ ] Report/moderation system
- [ ] Twitter OAuth integration
- [ ] Auto-tweet feature for virality
- [ ] Analytics (PostHog)
- [ ] Error tracking (Sentry)
- [ ] Production deployment (Vercel + Fly.io)

## 🆓 100% Free Deployment Stack

- **Frontend**: Vercel (free tier)
- **WebSocket**: Fly.io (3 free VMs) OR Supabase Realtime (free)
- **Database**: Supabase (500 MB free)
- **Redis**: Upstash (10K commands/day free)
- **TURN**: Xirsys (50 GB/month free)
- **RPC**: Alchemy (300M compute units/month free)

**Total Cost: $0/month** until you outgrow free tiers! 🎉

## 🔒 Environment Variables

See `.env.example` for all required environment variables:
- Database URL (Supabase/Neon)
- WalletConnect Project ID
- Alchemy API key
- NextAuth secret
- Twitter OAuth credentials (optional)
- WebSocket server URL
- TURN server credentials

## 📝 Development Notes

### Cyber Terminal Theme Colors
```css
--cyan: #00FFD4      /* Primary accent, borders, glow */
--lime: #CCFF00      /* Secondary accent, highlights */
--pink: #FF006E      /* CTAs, alerts */
--background: #000000 /* Pure black */
--foreground: #F0F0F0 /* Off-white text */
```

### Custom Animations
- Scanline effect (body::before)
- Grid overlay (body::after)
- Terminal cursor blink
- Glow effects on hover
- Staggered fade-in animations

## 🤝 Contributing

Contributions are welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Live Demo](https://chainmeet.app) (coming soon)
- [Twitter](https://twitter.com/chainmeet)
- [GitHub](https://github.com/yourusername/chainmeet)

---

**Built for crypto people, by crypto people.** 🚀

Made with ❤️ and ⚡ by the ChainMeet team
