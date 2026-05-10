import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sum Goals — Mina',
  description: 'Calm financial recovery. Understand your debt. Know your options. Take the right step.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
