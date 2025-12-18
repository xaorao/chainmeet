import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ChainMeet - Random Video Chat for Crypto People',
  description: 'Connect with airdrop hunters, NFT traders, content creators, and builders. Smart matching for the crypto community.',
  openGraph: {
    title: 'ChainMeet - Random Video Chat for Crypto',
    description: 'Connect with crypto people worldwide through smart matching and video chat.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChainMeet - Random Video Chat for Crypto',
    description: 'Connect with crypto people worldwide through smart matching and video chat.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
