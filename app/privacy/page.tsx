import Link from 'next/link'

export default function Privacy() {
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
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: December 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">What We Collect</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              ChainMeet is designed with privacy in mind. We collect minimal data needed to provide the service:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong className="text-white">Wallet Address:</strong> When you connect your wallet, we store your public address for identity verification</li>
              <li><strong className="text-white">Profile Data:</strong> Your chosen role, interests, and chain preferences</li>
              <li><strong className="text-white">Usage Data:</strong> Basic analytics like session duration and match counts</li>
              <li><strong className="text-white">Guest Names:</strong> Temporary display names for guest users (not stored permanently)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">What We Don't Collect</h2>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>We never store video or audio recordings</li>
              <li>We don't access your wallet balances or transactions</li>
              <li>Chat messages are peer-to-peer and not stored on our servers</li>
              <li>We don't sell any data to third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">On-Chain Verification</h2>
            <p className="text-gray-400 leading-relaxed">
              When you connect your wallet, we may read publicly available on-chain data to display your
              wallet age, NFT holdings, and other public blockchain information. This is read-only access
              to public data - we never request transaction signing permissions beyond authentication.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Storage</h2>
            <p className="text-gray-400 leading-relaxed">
              Your data is stored securely using industry-standard encryption. You can request deletion
              of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p className="text-gray-400 leading-relaxed">
              Questions about privacy? Reach out on Twitter or open an issue on our GitHub.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/" className="text-primary hover:underline">
            ← Back to ChainMeet
          </Link>
        </div>
      </div>
    </main>
  )
}
