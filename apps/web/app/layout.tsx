import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './components/cart/CartProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://melodyhome.in'),
  title: {
    default: 'Melody Home — Craft, carried forward',
    template: '%s | Melody Home',
  },
  description:
    'Contemporary objects shaped by the UNESCO-recognised ठठेरा craft of Jandiala Guru and artisan-led making in Punjab.',
  openGraph: {
    title: 'Melody Home — Craft, carried forward',
    description:
      'Made-to-order objects shaped by hand, heritage, and contemporary Indian design.',
    type: 'website',
    siteName: 'Melody Home',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
