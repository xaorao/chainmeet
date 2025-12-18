import Link from 'next/link'
import { Video, Shield, Zap, Users, Globe, MessageSquare } from 'lucide-react'

export default function About() {
  return (
    <main className="min-h-screen relative">
      {/* Navbar */}
      <nav className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-primary font-bold text-xl">ChainMeet</div>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Beta</span>
            </Link>
            <Link href="/" className="btn-secondary text-sm px-4 py-2">
              Try ChainMeet
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The Story Behind
            <span className="text-primary block">ChainMeet</span>
          </h1>
          <p className="text-xl text-gray-400">
            Random video chat built specifically for the crypto community.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">The Problem We're Solving</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Crypto is a social industry. We spend hours on Twitter, Discord, and Telegram
              talking about airdrops, NFTs, DeFi, and the next big thing. But it's mostly
              text. Anonymous handles. No real human connection.
            </p>
            <p>
              Discord calls need scheduling. Twitter Spaces are broadcasts, not conversations.
              And most crypto people you'd want to meet? You'll never cross paths with them.
            </p>
            <p>
              <strong className="text-white">What if you could just click a button and instantly
              meet another crypto person?</strong>
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">How ChainMeet Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Wallet-Verified Identity</h3>
                <p className="text-gray-400">
                  Connect your wallet to prove you're a real crypto person. We show wallet age,
                  NFT holdings, and on-chain activity - so you know you're talking to someone legit.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Smart Matching</h3>
                <p className="text-gray-400">
                  Tell us your role (Airdrop Hunter, NFT Trader, Builder, etc.) and interests.
                  We match you with people who share your crypto interests - not random strangers.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <Video className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Video, Voice, or Text</h3>
                <p className="text-gray-400">
                  Choose how you want to connect. Face-to-face video, voice-only for multitasking,
                  or text for quick convos. Hit "Next" anytime to meet someone new.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Who It's For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold mb-2">Airdrop Hunters</h3>
              <p className="text-gray-400 text-sm">
                Share strategies, discuss new projects, find farming buddies.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">NFT Traders</h3>
              <p className="text-gray-400 text-sm">
                Discuss alpha, share mints, connect with fellow collectors.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Builders</h3>
              <p className="text-gray-400 text-sm">
                Network with other devs, find collaborators, debug together.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Content Creators</h3>
              <p className="text-gray-400 text-sm">
                Meet your audience, collaborate on content, find guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">The Team</h2>
          <p className="text-gray-400 mb-8">
            ChainMeet is built by crypto natives who were tired of not having a good way
            to meet other people in the space. We're building in public and iterating fast
            based on community feedback.
          </p>

          <div className="inline-flex items-center gap-4 bg-card rounded-xl px-6 py-4 border border-border">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="font-bold text-primary">CM</span>
            </div>
            <div>
              <div className="font-bold">ChainMeet Team</div>
              <div className="text-sm text-gray-500">Building the future of crypto social</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to try it?</h2>
          <p className="text-gray-400 mb-8">
            No signup required. Jump in and meet some crypto people.
          </p>
          <Link
            href="/"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            <Video className="w-5 h-5" />
            Start Matching
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">ChainMeet</span>
              <span className="text-gray-500 text-sm">Beta</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">
                Terms
              </Link>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
