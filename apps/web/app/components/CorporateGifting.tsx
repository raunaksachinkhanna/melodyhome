import Link from 'next/link'

const OCCASIONS = ['Festive gifting', 'Wedding gifting', 'Institutional gifting', 'Bespoke artisan collections']

export default function CorporateGifting() {
  return (
    <section id="corporate-gifting" className="bg-gold px-4 py-20 text-brown sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl border-y border-brown/30 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-editorial">Corporate & occasion gifting</p>
            <h2 className="balance mt-5 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-6xl">Gifts with a story worth retelling.</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-brown/75 sm:text-base">Thoughtful artisan collections for organisations, celebrations, and institutions. We can shape the assortment and production timeline around the occasion.</p>
          </div>
          <div className="lg:text-right">
            <Link href="#footer-contact" className="inline-flex min-h-12 items-center justify-center bg-brown px-7 text-sm font-bold text-cream transition-colors hover:bg-cream hover:text-brown">
              Discuss a collection
            </Link>
            <p className="mt-3 text-xs text-brown/65">Enquiry contact is being configured for launch.</p>
          </div>
        </div>
        <ul className="mt-12 grid border-t border-brown/25 sm:grid-cols-2 lg:grid-cols-4">
          {OCCASIONS.map((occasion, index) => <li key={occasion} className={`py-5 text-sm font-semibold ${index > 0 ? 'sm:border-l sm:border-brown/25 sm:px-5' : ''}`}>{occasion}</li>)}
        </ul>
      </div>
    </section>
  )
}
