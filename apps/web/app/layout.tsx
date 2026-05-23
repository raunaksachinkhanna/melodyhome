import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Melody Home',
  description: 'Handcrafted ठठेरा brass and artisan goods by Melody Home.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
