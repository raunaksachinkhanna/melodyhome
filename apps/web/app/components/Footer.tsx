import Link from 'next/link'
import { NAV_ITEMS } from '../../lib/nav'

export default function Footer() {
  const year = new Date().getUTCFullYear()

  return (
    <footer id="footer-contact" className="bg-brown text-cream">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid gap-12 border-b border-cream/15 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.9fr]">
          <div className="max-w-lg">
            <p className="font-serif text-3xl sm:text-4xl">Melody Home</p>
            <p className="mt-5 max-w-md text-sm leading-7 text-cream/70">
              Contemporary objects made with heritage skills in Punjab—supporting artisan livelihoods, women&apos;s skilling, and the continuity of craft.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-editorial text-gold">Explore</p>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_ITEMS.map((link) => (
                <li key={link.href}>
                  <Link className="text-cream/75 transition-colors hover:text-gold" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-editorial text-gold">Contact & policies</p>
            <p className="mt-5 text-sm leading-6 text-cream/75">
              Customer contact details are being configured before launch.
            </p>
            <p className="mt-3 text-xs leading-5 text-cream/50">
              Shipping, returns, privacy, and social links will appear here once approved by the business owner.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Melody Home. All rights reserved.</p>
          <p className="text-cream/75">Made with purpose in Punjab</p>
        </div>
      </div>
    </footer>
  )
}
