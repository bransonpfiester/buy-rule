import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '48-Hour Buy Rule',
  description: 'Beat impulse purchases and save money with the 48-hour rule',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
