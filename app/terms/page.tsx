import Link from 'next/link'

export default function Terms() {
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: December 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              By using ChainMeet, you agree to these terms. ChainMeet is currently in beta - features
              may change and the service may have downtime.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">What ChainMeet Is</h2>
            <p className="text-gray-400 leading-relaxed">
              ChainMeet is a random video chat platform for the crypto community. We match users
              for video, voice, or text conversations based on shared interests in cryptocurrency,
              NFTs, DeFi, and blockchain technology.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">User Conduct</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              You agree to use ChainMeet responsibly. The following are prohibited:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Harassment, hate speech, or abusive behavior</li>
              <li>Sharing illegal content or engaging in illegal activities</li>
              <li>Scamming, phishing, or deceptive practices</li>
              <li>Impersonating others or misrepresenting your identity</li>
              <li>Spamming or automated/bot usage</li>
              <li>Recording conversations without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Age Requirement</h2>
            <p className="text-gray-400 leading-relaxed">
              You must be at least 18 years old to use ChainMeet. By using the service, you
              confirm you meet this age requirement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Wallet Connection</h2>
            <p className="text-gray-400 leading-relaxed">
              When you connect your wallet, you're authenticating with your blockchain identity.
              We only request signature verification - never transaction signing or fund access.
              You are responsible for the security of your wallet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">No Financial Advice</h2>
            <p className="text-gray-400 leading-relaxed">
              ChainMeet is a social platform. Nothing shared on ChainMeet constitutes financial
              advice. Always DYOR (Do Your Own Research) before making any financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Reporting & Moderation</h2>
            <p className="text-gray-400 leading-relaxed">
              You can report users who violate these terms. We reserve the right to ban users
              who engage in prohibited behavior. Reports are reviewed and appropriate action
              is taken.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p className="text-gray-400 leading-relaxed">
              ChainMeet is provided "as is" without warranties. We are not responsible for
              user-generated content, conversations between users, or any damages arising
              from use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              We may update these terms as the platform evolves. Continued use after changes
              constitutes acceptance of the new terms.
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
