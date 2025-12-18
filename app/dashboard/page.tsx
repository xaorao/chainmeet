'use client'

import { useAccount, useEnsName, useEnsAvatar } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Video, Users, Star, TrendingUp, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined })

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  return (
    <main className="min-h-screen relative">
      {/* Navbar */}
      <nav className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-primary font-bold text-xl cursor-pointer" onClick={() => router.push('/')}>
                ChainMeet
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back{ensName ? `, ${ensName}` : ''}!
          </h1>
          <p className="text-gray-400">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">0</div>
            </div>
            <div className="text-sm text-gray-400">Total Matches</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary">0h</div>
            </div>
            <div className="text-sm text-gray-400">Time Spent</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-success" />
              </div>
              <div className="text-2xl font-bold text-success">—</div>
            </div>
            <div className="text-sm text-gray-400">Avg Rating</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div className="text-2xl font-bold text-warning">New</div>
            </div>
            <div className="text-sm text-gray-400">Account Status</div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Start Matching Card */}
          <div className="card card-hover border-primary/30 p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Start Matching</h2>
            <p className="text-gray-400 mb-6">
              Connect with crypto people worldwide. Smart matching based on your interests and role.
            </p>
            <button
              onClick={() => router.push('/match')}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" />
              Find Match
            </button>
          </div>

          {/* Setup Profile Card */}
          <div className="card card-hover border-secondary/30 p-8">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
              <Settings className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Setup Profile</h2>
            <p className="text-gray-400 mb-6">
              Choose your role, interests, and blockchain preferences for better matches.
            </p>
            <button className="btn-secondary w-full text-lg py-4 flex items-center justify-center gap-2">
              <Settings className="w-5 h-5" />
              Setup Profile
            </button>
          </div>
        </div>

        {/* Profile Setup Notice */}
        <div className="card bg-primary/5 border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Complete Your Profile</h3>
              <p className="text-gray-400 mb-4">
                Set up your profile to unlock smart matching and connect with people who share your interests in crypto.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-gray-600">○</span>
                  <span className="text-gray-400">Choose your role (Airdrop Hunter, NFT Trader, Builder, etc.)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-600">○</span>
                  <span className="text-gray-400">Select your favorite blockchains</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-600">○</span>
                  <span className="text-gray-400">Add your interests and what you're looking for</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-600">○</span>
                  <span className="text-gray-400">Optional: Set NFT as profile picture</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
