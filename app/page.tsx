'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
   Mic as MicIcon, MicOff as MicOffIcon, Video as VideoIcon, VideoOff as VideoOffIcon,
   Send as SendIcon, MessageSquare as MessageSquareIcon, Monitor as MonitorIcon,
   X as XIcon, Hash as HashIcon, User as UserIcon, Zap as ZapIcon, Shield as ShieldIcon,
   Globe as GlobeIcon, Square as SquareIcon, ChevronDown as ChevronDownIcon,
   MoreHorizontal as MoreHorizontalIcon, RefreshCw as RefreshCwIcon, LogOut as LogOutIcon,
   AlertCircle as AlertCircleIcon, Volume2 as VolumeIcon, VolumeX as VolumeMuteIcon,
   Flag as FlagIcon, Download as DownloadIcon, Eye as EyeIcon, EyeOff as EyeOffIcon,
   Wifi as WifiIcon, WifiOff as WifiOffIcon, Loader2 as LoaderIcon, Check as CheckIcon,
   Sparkles as SparklesIcon, Heart as HeartIcon, MessageCircle as MessageCircleIcon,
   Users as UsersIcon, Wallet as WalletIcon, ArrowLeft as ArrowLeftIcon
} from 'lucide-react';

import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useOnlineCount } from '@/hooks/useOnlineCount';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

// ============================================
// PREMIUM UI COMPONENTS
// ============================================

const GlassCard = ({ children, className = '', glow = false }: { children: React.ReactNode, className?: string, glow?: boolean }) => (
   <div className={`relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden ${glow ? 'shadow-indigo-500/10' : ''} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
   </div>
);

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, loading = false }: any) => {
   const baseStyle = "relative font-semibold transition-all duration-300 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
   const variants: any = {
      primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5",
      secondary: "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] hover:border-white/[0.2]",
      danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25",
      ghost: "text-zinc-400 hover:text-white hover:bg-white/[0.05]",
      stop: "bg-zinc-800/80 text-white hover:bg-zinc-700 border border-zinc-700/50",
      really: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30 animate-pulse",
      new: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
   };
   const sizes: any = {
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg font-bold"
   };

   return (
      <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}>
         {loading ? <LoaderIcon size={16} className="animate-spin" /> : children}
      </button>
   );
};

const Tag = ({ label, onRemove }: { label: string, onRemove?: () => void }) => (
   <span className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-300 border border-indigo-500/30 transition-all hover:border-indigo-400/50">
      <HashIcon size={10} className="text-indigo-400" /> {label}
      {onRemove && (
         <button onClick={onRemove} className="ml-1 opacity-50 hover:opacity-100 hover:text-white transition-opacity">
            <XIcon size={12} />
         </button>
      )}
   </span>
);

const TypingIndicator = () => (
   <div className="flex items-center gap-1 text-zinc-500 text-xs">
      <span>Stranger is typing</span>
      <span className="flex gap-0.5">
         <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
         <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
         <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </span>
   </div>
);

const ConnectionQuality = ({ quality }: { quality: 'good' | 'medium' | 'poor' | 'unknown' }) => {
   const colors = { good: 'bg-emerald-500', medium: 'bg-yellow-500', poor: 'bg-red-500', unknown: 'bg-zinc-500' };
   return (
      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
         <WifiIcon size={12} className={quality === 'poor' ? 'text-red-400' : quality === 'medium' ? 'text-yellow-400' : 'text-emerald-400'} />
         <div className="flex gap-0.5">
            <div className={`w-1 h-2 rounded-full ${quality !== 'poor' ? colors.good : colors.poor}`} />
            <div className={`w-1 h-3 rounded-full ${quality === 'good' || quality === 'medium' ? colors[quality] : 'bg-zinc-700'}`} />
            <div className={`w-1 h-4 rounded-full ${quality === 'good' ? colors.good : 'bg-zinc-700'}`} />
         </div>
      </div>
   );
};

const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => (
   <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
         {text}
      </div>
   </div>
);

// ============================================
// SELECTORS & MODALS
// ============================================

const RoleSelector = ({ selected, onSelect }: any) => {
   const [isOpen, setIsOpen] = useState(false);
   const roles = [
      { id: 'trader', label: 'Day Trader', icon: '📈', desc: 'Charts & alpha' },
      { id: 'dev', label: 'Developer', icon: '👨‍💻', desc: 'Build the future' },
      { id: 'defi', label: 'DeFi Worker', icon: '🏦', desc: 'Yield farming pro' },
      { id: 'ambassador', label: 'Ambassador', icon: '🎯', desc: 'Community builder' },
      { id: 'collector', label: 'NFT Collector', icon: '🖼️', desc: 'Art & culture' },
      { id: 'dao', label: 'DAO Member', icon: '🏛️', desc: 'Governance & voting' },
      { id: 'degen', label: 'Degen', icon: '🦍', desc: 'High risk, high reward' },
      { id: 'whale', label: 'Whale', icon: '🐋', desc: 'Big moves only' },
      { id: 'hunter', label: 'Airdrop Hunter', icon: '🪂', desc: 'Free money seeker' },
      { id: 'researcher', label: 'Researcher', icon: '🔬', desc: 'Deep dive analyst' },
      { id: 'meme', label: 'Meme Lord', icon: '🐸', desc: 'Pepe connoisseur' },
      { id: 'newbie', label: 'Crypto Newbie', icon: '🌱', desc: 'Learning the ropes' },
   ];
   const currentRole = roles.find(r => r.id === selected) || roles[0];

   return (
      <div className="relative z-50">
         <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2 block">Your Persona</label>
         <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-black/30 hover:bg-black/40 border border-white/[0.08] hover:border-white/[0.15] rounded-xl px-4 py-3 flex items-center justify-between text-white transition-all">
            <span className="flex items-center gap-3">
               <span className="text-2xl">{currentRole.icon}</span>
               <span className="text-left">
                  <span className="block font-medium">{currentRole.label}</span>
                  <span className="text-[10px] text-zinc-500">{currentRole.desc}</span>
               </span>
            </span>
            <ChevronDownIcon size={16} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
         </button>
         {isOpen && (
            <>
               <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
               <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d10] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {roles.map(role => (
                     <button key={role.id} onClick={() => { onSelect(role.id); setIsOpen(false); }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/[0.03] transition-colors ${role.id === selected ? 'bg-indigo-500/10' : ''}`}>
                        <span className="text-xl">{role.icon}</span>
                        <span>
                           <span className={`block text-sm ${role.id === selected ? 'text-indigo-300' : 'text-zinc-300'}`}>{role.label}</span>
                           <span className="text-[10px] text-zinc-600">{role.desc}</span>
                        </span>
                        {role.id === selected && <CheckIcon size={14} className="ml-auto text-indigo-400" />}
                     </button>
                  ))}
               </div>
            </>
         )}
      </div>
   );
};

const GenderSelector = ({ selected, onSelect }: { selected: string, onSelect: (v: string) => void }) => {
   const options = [
      { id: 'any', label: 'Anyone', icon: '👥' },
      { id: 'male', label: 'Male', icon: '👨' },
      { id: 'female', label: 'Female', icon: '👩' },
   ];
   return (
      <div>
         <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2 block">Prefer to Match With</label>
         <div className="flex gap-2">
            {options.map(opt => (
               <button key={opt.id} onClick={() => onSelect(opt.id)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${selected === opt.id ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-black/20 border-white/[0.08] text-zinc-400 hover:border-white/[0.15]'}`}>
                  <span className="mr-1.5">{opt.icon}</span>{opt.label}
               </button>
            ))}
         </div>
      </div>
   );
};

const ReportModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (reason: string) => void }) => {
   const [reason, setReason] = useState('');
   const reasons = ['Inappropriate content', 'Harassment', 'Spam/Bot', 'Underage user', 'Other'];
   return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
         <div className="bg-[#0d0d10] border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FlagIcon size={20} className="text-red-400" />
               </div>
               <div>
                  <h3 className="font-semibold text-white">Report User</h3>
                  <p className="text-xs text-zinc-500">Help keep ChainMeet safe</p>
               </div>
            </div>
            <div className="space-y-2 mb-4">
               {reasons.map(r => (
                  <button key={r} onClick={() => setReason(r)}
                     className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${reason === r ? 'bg-red-500/20 border-red-500/50 text-red-300 border' : 'bg-black/20 text-zinc-400 hover:bg-black/30'}`}>
                     {r}
                  </button>
               ))}
            </div>
            <div className="flex gap-2">
               <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
               <Button variant="danger" onClick={() => { if (reason) onSubmit(reason); }} disabled={!reason} className="flex-1">Submit Report</Button>
            </div>
         </div>
      </div>
   );
};

const TermsModal = ({ onAccept }: { onAccept: () => void }) => (
   <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d0d10] border border-white/[0.08] rounded-2xl p-6 max-w-md w-full shadow-2xl">
         <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldIcon size={24} className="text-indigo-400" />
         </div>
         <h3 className="text-xl font-bold text-white text-center mb-2">Community Guidelines</h3>
         <p className="text-sm text-zinc-400 text-center mb-4">Before you start chatting, please agree to our guidelines:</p>
         <ul className="space-y-2 text-sm text-zinc-300 mb-6">
            <li className="flex items-start gap-2"><CheckIcon size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" /> Be respectful and kind to other users</li>
            <li className="flex items-start gap-2"><CheckIcon size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" /> No explicit, harmful, or illegal content</li>
            <li className="flex items-start gap-2"><CheckIcon size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" /> You must be 18 years or older</li>
            <li className="flex items-start gap-2"><CheckIcon size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" /> Report inappropriate behavior immediately</li>
         </ul>
         <Button variant="primary" onClick={onAccept} className="w-full" size="lg">I Agree & Continue</Button>
      </div>
   </div>
);

// ============================================
// MAIN APP
// ============================================

export default function ChainMeetPremium() {
   // Views & UI State
   const [view, setView] = useState<'landing' | 'chatting'>('landing');
   const [mode, setMode] = useState<'video' | 'text'>('video');
   const [showTerms, setShowTerms] = useState(false);
   const [showReport, setShowReport] = useState(false);
   const [termsAccepted, setTermsAccepted] = useState(false);
   const [strangerRevealed, setStrangerRevealed] = useState(false);

   // User Preferences
   const [role, setRole] = useState('trader');
   const [genderPref, setGenderPref] = useState('any');
   const [interests, setInterests] = useState<string[]>([]);
   const [tagInput, setTagInput] = useState('');

   // Chat State
   const [messages, setMessages] = useState<any[]>([]);
   const [inputText, setInputText] = useState('');
   const [buttonState, setButtonState] = useState<'stop' | 'really' | 'new'>('stop');
   const [isStrangerTyping, setIsStrangerTyping] = useState(false);
   const [connectionQuality, setConnectionQuality] = useState<'good' | 'medium' | 'poor' | 'unknown'>('unknown');

   // Hooks
   const { socket, socketId, isConnected, isConnectError, isSearching, isMatched, partnerId, connect, disconnect, joinQueue, leaveQueue, nextMatch, sendChatMessage, onChatMessage, offChatMessage } = useSocket();
   const { stream: localStream, cameraEnabled, micEnabled, toggleCamera, toggleMic, startVideo, resetMedia, error: mediaError } = useMediaStream();
   const { remoteStream, connectionState, initializePeer, closePeer } = useWebRTC(socket);
   const { count: onlineCount } = useOnlineCount();
   const { playMatch, playMessage, playDisconnect, isMuted, toggleMute } = useSoundEffects();
   const { address, isConnected: isWalletConnected } = useAccount();

   // Refs
   const localVideoRef = useRef<HTMLVideoElement>(null);
   const remoteVideoRef = useRef<HTMLVideoElement>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   // Derived State
   const sessionStatus = useMemo(() => {
      if (!isConnected) return 'IDLE';
      if (isSearching) return 'SEARCHING';
      if (isMatched && connectionState === 'connected') return 'CONNECTED';
      if (isMatched) return 'CONNECTING';
      return 'DISCONNECTED';
   }, [isConnected, isSearching, isMatched, connectionState]);

   // ============================================
   // HANDLERS
   // ============================================

   const handleAddTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim()) {
         e.preventDefault();
         const val = tagInput.trim().toLowerCase();
         if (!interests.includes(val) && interests.length < 5) {
            setInterests([...interests, val]);
         }
         setTagInput('');
      }
   };

   const startChat = useCallback(async (selectedMode: 'video' | 'text') => {
      if (!termsAccepted) {
         setShowTerms(true);
         return;
      }
      setMode(selectedMode);
      setView('chatting');
      setButtonState('stop');
      setMessages([]);
      setStrangerRevealed(false);
      if (!isConnected) connect();
      if (selectedMode === 'video') await startVideo();
   }, [termsAccepted, isConnected, connect, startVideo]);

   const handleTermsAccept = () => {
      setTermsAccepted(true);
      setShowTerms(false);
   };

   // Join queue when connected
   useEffect(() => {
      if (isConnected && view === 'chatting' && !isSearching && !isMatched) {
         joinQueue(role, interests);
      }
   }, [isConnected, view, isSearching, isMatched, role, interests, joinQueue]);

   // Initialize WebRTC on match
   useEffect(() => {
      if (isMatched && partnerId && localStream && socketId) {
         playMatch();
         setMessages([{ id: 'sys-match', type: 'system', text: "🎉 You're connected! Say hi!" }]);
         if (interests.length > 0) {
            setMessages(prev => [...prev, { id: 'sys-interest', type: 'system', text: `✨ You both like: ${interests.join(', ')}` }]);
         }
         const initiator = socketId < partnerId;
         initializePeer(partnerId, initiator, localStream);
      }
   }, [isMatched, partnerId, localStream, socketId, initializePeer, playMatch, interests]);

   // Attach streams
   useEffect(() => {
      if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
   }, [localStream]);

   useEffect(() => {
      if (remoteVideoRef.current && remoteStream) {
         remoteVideoRef.current.srcObject = remoteStream;
         setConnectionQuality('good');
      }
   }, [remoteStream]);

   // Handle messages
   useEffect(() => {
      const handleMessage = ({ message }: { message: string }) => {
         playMessage();
         setMessages(prev => [...prev, { id: Date.now(), sender: 'them', text: message, time: new Date() }]);
         setIsStrangerTyping(false);
      };
      onChatMessage(handleMessage);
      return () => offChatMessage(handleMessage);
   }, [onChatMessage, offChatMessage, playMessage]);

   // Handle disconnect
   useEffect(() => {
      if (!isMatched && view === 'chatting' && sessionStatus === 'DISCONNECTED') {
         playDisconnect();
         setMessages(prev => {
            if (prev.some(m => m.text?.includes('disconnected'))) return prev;
            return [...prev, { id: Date.now(), type: 'system', text: '👋 Stranger has disconnected.' }];
         });
         setButtonState('new');
      }
   }, [isMatched, view, sessionStatus, playDisconnect]);

   // Auto-scroll
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   // Typing indicator
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(e.target.value);
      // Could emit typing event here
   };

   const handleStop = () => {
      if (buttonState === 'stop') setButtonState('really');
      else if (buttonState === 'really') {
         closePeer();
         if (isMatched) nextMatch();
         setMessages(prev => [...prev, { id: Date.now(), type: 'system', text: "You disconnected." }]);
         setButtonState('new');
      } else {
         closePeer();
         setMessages([]);
         setButtonState('stop');
         setStrangerRevealed(false);
         joinQueue(role, interests);
      }
   };

   const handleCancelSearch = () => {
      leaveQueue();
      exitToLanding();
   };

   const sendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim() || sessionStatus !== 'CONNECTED') return;
      setMessages(prev => [...prev, { id: Date.now(), sender: 'me', text: inputText, time: new Date() }]);
      sendChatMessage(inputText);
      setInputText('');
   };

   const exitToLanding = () => {
      closePeer();
      leaveQueue();
      resetMedia();
      disconnect();
      setView('landing');
      setMessages([]);
      setButtonState('stop');
      setStrangerRevealed(false);
   };

   const downloadChat = () => {
      const text = messages
         .filter(m => m.sender)
         .map(m => `[${m.sender === 'me' ? 'You' : 'Stranger'}]: ${m.text}`)
         .join('\n');
      const blob = new Blob([`ChainMeet Chat - ${new Date().toLocaleString()}\n\n${text}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chainmeet-chat-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
   };

   const handleReport = (reason: string) => {
      console.log('Reported user:', partnerId, 'Reason:', reason);
      setShowReport(false);
      setMessages(prev => [...prev, { id: Date.now(), type: 'system', text: '🚩 Report submitted. Thank you for keeping ChainMeet safe.' }]);
   };

   // ============================================
   // CHATTING VIEW
   // ============================================
   if (view === 'chatting') {
      return (
         <div className="h-screen w-full bg-[#08080a] text-white font-sans flex flex-col lg:flex-row overflow-hidden relative">
            {/* Ambient BG */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute top-[-30%] left-[-20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />
               <div className="absolute bottom-[-30%] right-[-20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
            </div>

            {/* Modals */}
            {showReport && <ReportModal onClose={() => setShowReport(false)} onSubmit={handleReport} />}

            {/* Connection Error */}
            {isConnectError && (
               <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-full text-red-400 text-sm">
                     <WifiOffIcon size={16} /> Connection lost. Reconnecting...
                  </div>
               </div>
            )}

            {/* Media Error Modal */}
            {mediaError && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-30">
                  <GlassCard className="p-6 max-w-sm text-center">
                     <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <VideoOffIcon size={32} className="text-red-400" />
                     </div>
                     <h3 className="text-lg font-bold mb-2">Camera Access Required</h3>
                     <p className="text-zinc-400 text-sm mb-4">Please allow camera and microphone access to use video chat.</p>
                     <Button variant="secondary" onClick={exitToLanding}>Go Back</Button>
                  </GlassCard>
               </div>
            )}

            {/* Connection Failed Modal */}
            {connectionState === 'failed' && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-30">
                  <GlassCard className="p-6 max-w-sm text-center">
                     <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                        <RefreshCwIcon size={32} className="text-yellow-400" />
                     </div>
                     <h3 className="text-lg font-bold mb-2">Connection Failed</h3>
                     <p className="text-zinc-400 text-sm mb-4">Could not establish peer connection.</p>
                     <Button variant="primary" onClick={() => { closePeer(); nextMatch(); setButtonState('stop'); }}>Find New Match</Button>
                  </GlassCard>
               </div>
            )}

            {/* VIDEO SECTION */}
            <div className={`relative flex flex-col ${mode === 'video' ? 'flex-1 lg:w-2/3' : 'hidden'}`}>
               {/* Top Bar */}
               <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center gap-3">
                     <button onClick={exitToLanding} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                        <ArrowLeftIcon size={18} />
                     </button>
                     <span className="font-bold text-lg bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">ChainMeet</span>
                     {sessionStatus === 'CONNECTED' && <ConnectionQuality quality={connectionQuality} />}
                  </div>
                  <div className="flex items-center gap-2">
                     <Tooltip text={isMuted ? 'Unmute sounds' : 'Mute sounds'}>
                        <button onClick={toggleMute} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                           {isMuted ? <VolumeMuteIcon size={18} /> : <VolumeIcon size={18} />}
                        </button>
                     </Tooltip>
                     <Tooltip text="Report user">
                        <button onClick={() => setShowReport(true)} disabled={!isMatched} className="p-2 rounded-full bg-black/40 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-30">
                           <FlagIcon size={18} />
                        </button>
                     </Tooltip>
                     <Tooltip text="More options">
                        <button className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                           <MoreHorizontalIcon size={18} />
                        </button>
                     </Tooltip>
                  </div>
               </div>

               {/* Main Video Area */}
               <div className="flex-1 bg-black relative flex items-center justify-center">
                  {sessionStatus === 'SEARCHING' ? (
                     <div className="text-center animate-in fade-in duration-500">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                           <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
                           <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
                           <div className="absolute inset-3 rounded-full bg-indigo-500/10 flex items-center justify-center">
                              <UsersIcon size={28} className="text-indigo-400" />
                           </div>
                        </div>
                        <p className="text-indigo-300 font-medium mb-2">Looking for someone...</p>
                        <p className="text-zinc-500 text-sm mb-4">{onlineCount || 0} people online</p>
                        <Button variant="secondary" size="sm" onClick={handleCancelSearch}>
                           <XIcon size={14} /> Cancel
                        </Button>
                     </div>
                  ) : sessionStatus === 'CONNECTING' ? (
                     <div className="text-center animate-in fade-in">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                           <LoaderIcon size={32} className="text-emerald-400 animate-spin" />
                        </div>
                        <p className="text-emerald-300 font-medium">Connecting to peer...</p>
                     </div>
                  ) : buttonState === 'new' && !isMatched ? (
                     <div className="text-center animate-in fade-in">
                        <p className="text-zinc-500 font-medium mb-4">Session Ended</p>
                        <Button variant="new" onClick={() => { setButtonState('stop'); joinQueue(role, interests); }}>
                           <RefreshCwIcon size={16} /> Find New Match
                        </Button>
                     </div>
                  ) : (
                     <div className="w-full h-full relative">
                        <video ref={remoteVideoRef} autoPlay playsInline className={`w-full h-full object-cover transition-all duration-500 ${!strangerRevealed ? 'blur-2xl scale-105' : ''}`} />
                        {!remoteStream && (
                           <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                              <div className="text-center opacity-60">
                                 <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-3 animate-pulse">
                                    <UserIcon size={48} className="text-indigo-400" />
                                 </div>
                                 <p className="text-sm text-zinc-400">Waiting for video...</p>
                              </div>
                           </div>
                        )}
                        {!strangerRevealed && remoteStream && (
                           <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                              <div className="text-center">
                                 <EyeOffIcon size={32} className="mx-auto mb-3 text-zinc-400" />
                                 <p className="text-sm text-zinc-400 mb-3">Video is blurred for privacy</p>
                                 <Button variant="primary" size="sm" onClick={() => setStrangerRevealed(true)}>
                                    <EyeIcon size={14} /> Reveal Video
                                 </Button>
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div>

               {/* Self View PIP */}
               {mode === 'video' && localStream && (
                  <div className="absolute bottom-4 right-4 w-32 md:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-20 group transition-transform hover:scale-105">
                     <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${!cameraEnabled ? 'hidden' : ''}`} />
                     {!cameraEnabled && (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                           <VideoOffIcon size={24} />
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2 gap-2">
                        <button onClick={toggleMic} className={`p-1.5 rounded-full ${!micEnabled ? 'bg-red-500' : 'bg-white/20'}`}>
                           {micEnabled ? <MicIcon size={14} /> : <MicOffIcon size={14} />}
                        </button>
                        <button onClick={toggleCamera} className={`p-1.5 rounded-full ${!cameraEnabled ? 'bg-red-500' : 'bg-white/20'}`}>
                           {cameraEnabled ? <VideoIcon size={14} /> : <VideoOffIcon size={14} />}
                        </button>
                     </div>
                  </div>
               )}
            </div>

            {/* CHAT SECTION */}
            <div className={`flex flex-col bg-[#0a0a0c] border-l border-white/[0.05] relative z-10 ${mode === 'video' ? 'w-full lg:w-80 xl:w-96 h-1/2 lg:h-full' : 'flex-1'}`}>
               {/* Text mode header */}
               {mode === 'text' && (
                  <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <button onClick={exitToLanding} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                           <ArrowLeftIcon size={18} />
                        </button>
                        <span className="font-semibold">Text Chat</span>
                        {sessionStatus === 'CONNECTED' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">Connected</span>}
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => setShowReport(true)} disabled={!isMatched} className="p-2 rounded-full hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30"><FlagIcon size={16} /></button>
                        <button onClick={downloadChat} disabled={messages.filter(m => m.sender).length === 0} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30"><DownloadIcon size={16} /></button>
                     </div>
                  </div>
               )}

               {/* Messages */}
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => {
                     if (msg.type === 'system') {
                        return (
                           <div key={msg.id} className="text-center py-2 animate-in fade-in">
                              <span className="text-xs text-zinc-500 bg-white/[0.03] px-4 py-1.5 rounded-full">{msg.text}</span>
                           </div>
                        );
                     }
                     const isMe = msg.sender === 'me';
                     return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                           <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-br-md' : 'bg-white/[0.05] text-zinc-200 rounded-bl-md border border-white/[0.05]'
                              }`}>
                              {msg.text}
                           </div>
                        </div>
                     );
                  })}
                  {isStrangerTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
               </div>

               {/* Controls */}
               <div className="p-4 bg-black/40 border-t border-white/[0.05]">
                  <div className="flex gap-2 mb-3">
                     <Button variant={buttonState} onClick={handleStop} className="flex-1 py-3">
                        {buttonState === 'stop' && <><SquareIcon size={16} /> Stop</>}
                        {buttonState === 'really' && 'Really?'}
                        {buttonState === 'new' && <><RefreshCwIcon size={16} /> New Chat</>}
                     </Button>
                     {buttonState === 'really' && (
                        <Button variant="ghost" onClick={() => setButtonState('stop')} className="px-4">Cancel</Button>
                     )}
                  </div>
                  <form onSubmit={sendMessage} className="relative">
                     <input
                        type="text"
                        placeholder={sessionStatus === 'CONNECTED' ? "Type a message..." : "Waiting for connection..."}
                        className="w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-600 disabled:opacity-40"
                        value={inputText}
                        onChange={handleInputChange}
                        disabled={sessionStatus !== 'CONNECTED'}
                     />
                     <button type="submit" disabled={!inputText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-400 disabled:text-zinc-700">
                        <SendIcon size={18} />
                     </button>
                  </form>
                  <div className="flex justify-between items-center mt-3 px-1 text-[10px] text-zinc-600">
                     <button onClick={exitToLanding} className="flex items-center gap-1 hover:text-zinc-400"><LogOutIcon size={10} /> Exit</button>
                     {mode === 'video' && <button onClick={downloadChat} disabled={!messages.some(m => m.sender)} className="flex items-center gap-1 hover:text-zinc-400 disabled:opacity-30"><DownloadIcon size={10} /> Save Chat</button>}
                     <span>End-to-End Encrypted</span>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // ============================================
   // LANDING VIEW
   // ============================================
   return (
      <div className="min-h-screen w-full bg-[#08080a] text-white font-sans relative overflow-hidden">
         {showTerms && <TermsModal onAccept={handleTermsAccept} />}

         {/* Premium Ambient Background */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-40%] left-[-30%] w-[1000px] h-[1000px] bg-violet-900/20 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-40%] right-[-30%] w-[1000px] h-[1000px] bg-indigo-900/20 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-fuchsia-900/10 rounded-full blur-[150px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#08080a_70%)]" />
         </div>

         {/* Header */}
         <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-20">
            <div className="flex items-center gap-2">
               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <GlobeIcon size={18} />
               </div>
               <span className="font-bold text-xl tracking-tight">ChainMeet</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.05]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span>{onlineCount !== null ? onlineCount.toLocaleString() : '--'} online</span>
               </div>
               <ConnectButton.Custom>
                  {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                     const connected = mounted && account && chain;
                     return (
                        <button
                           onClick={connected ? openAccountModal : openConnectModal}
                           className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium transition-all"
                        >
                           <WalletIcon size={16} className={connected ? 'text-emerald-400' : 'text-zinc-400'} />
                           {connected ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Connect'}
                        </button>
                     );
                  }}
               </ConnectButton.Custom>
            </div>
         </header>

         {/* Main Content */}
         <main className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-24 pb-16">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
               {/* Hero */}
               <div className="space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-sm text-indigo-300">
                     <SparklesIcon size={14} className="text-indigo-400" />
                     <span>The Omegle for Web3</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
                     Talk to<br />
                     <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        Strangers
                     </span>
                  </h1>
                  <p className="text-lg md:text-xl text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                     Connect your wallet, choose your crypto persona, and meet verified degens worldwide.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                     {[
                        { icon: ShieldIcon, text: 'No Logs', color: 'text-emerald-400' },
                        { icon: ZapIcon, text: 'Instant', color: 'text-yellow-400' },
                        { icon: HeartIcon, text: 'Free Forever', color: 'text-pink-400' },
                     ].map(item => (
                        <div key={item.text} className="flex items-center gap-2 text-sm text-zinc-500">
                           <item.icon size={16} className={item.color} />
                           {item.text}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Control Panel */}
               <GlassCard className="p-1" glow>
                  <div className="bg-[#0a0a0c]/90 rounded-xl p-6 md:p-8 space-y-6">
                     <RoleSelector selected={role} onSelect={setRole} />
                     <GenderSelector selected={genderPref} onSelect={setGenderPref} />

                     {/* Interests */}
                     <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2 block">Interests (Optional)</label>
                        <div className="bg-black/30 border border-white/[0.08] rounded-xl p-3 focus-within:border-indigo-500/40 transition-colors">
                           <div className="flex flex-wrap gap-2 mb-2">
                              {interests.map(tag => <Tag key={tag} label={tag} onRemove={() => setInterests(interests.filter(i => i !== tag))} />)}
                           </div>
                           <input
                              type="text"
                              placeholder={interests.length === 0 ? "e.g. ETH, DeFi, NFTs, Solana..." : "Add more..."}
                              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-zinc-600"
                              value={tagInput}
                              onChange={e => setTagInput(e.target.value)}
                              onKeyDown={handleAddTag}
                           />
                        </div>
                        <p className="text-[10px] text-zinc-600 mt-1.5">Press Enter to add • Better matches with shared interests</p>
                     </div>

                     <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                     {/* Start Buttons */}
                     <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-3 block">Start Chatting</label>
                        <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => startChat('text')} className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 p-4 text-left transition-all">
                              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="relative">
                                 <div className="mb-3 w-11 h-11 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                                    <MessageSquareIcon size={22} />
                                 </div>
                                 <div className="font-semibold text-sm">Text Chat</div>
                                 <div className="text-[11px] text-zinc-500 mt-0.5">Classic anonymous chat</div>
                              </div>
                           </button>
                           <button onClick={() => startChat('video')} className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 p-4 text-left transition-all">
                              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="relative">
                                 <div className="mb-3 w-11 h-11 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 group-hover:text-violet-400 group-hover:bg-violet-500/20 transition-all">
                                    <MonitorIcon size={22} />
                                 </div>
                                 <div className="font-semibold text-sm">Video Chat</div>
                                 <div className="text-[11px] text-zinc-500 mt-0.5">Face-to-face connection</div>
                              </div>
                           </button>
                        </div>
                     </div>
                  </div>
               </GlassCard>
            </div>
         </main>

         {/* Footer */}
         <footer className="absolute bottom-0 left-0 right-0 p-4 text-center">
            <p className="text-[11px] text-zinc-600">
               By using ChainMeet you agree to our{' '}
               <a href="#" className="text-zinc-500 hover:text-zinc-400 underline">Terms</a> &{' '}
               <a href="#" className="text-zinc-500 hover:text-zinc-400 underline">Privacy Policy</a>
            </p>
         </footer>
      </div>
   );
}
