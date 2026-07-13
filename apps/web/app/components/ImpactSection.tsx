const IMPACT_AREAS = [
  ['Artisan livelihoods', 'Production that values specialist skill and creates meaningful work around heritage craft.'],
  ['Women’s skilling', 'Practical making opportunities designed to support underprivileged women as they build capability and independence.'],
  ['Craft preservation', 'Contemporary demand gives traditional knowledge a role beyond archives and exhibitions.'],
  ['Responsible production', 'A made-to-order model avoids treating handmade goods like anonymous, mass-produced inventory.'],
] as const

export default function ImpactSection() {
  return (
    <section id="impact" className="bg-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-editorial text-gold">Our impact</p>
            <h2 className="balance mt-4 font-serif text-4xl leading-tight sm:text-6xl">Purpose, without performance.</h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-brown/65 sm:text-base">Our role is to help making remain viable: supporting skilled work, creating routes for women to learn and earn, and producing only when an object has a home to go to.</p>
          </div>

          <div className="grid sm:grid-cols-2">
            {IMPACT_AREAS.map(([title, copy], index) => (
              <article key={title} className={`min-h-56 border-b border-brown/15 py-7 sm:p-8 ${index % 2 === 1 ? 'sm:border-l' : ''} ${index < 2 ? 'sm:border-t' : ''}`}>
                <span className="font-serif text-2xl text-gold" aria-hidden="true">0{index + 1}</span>
                <h3 className="mt-8 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-brown/60">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
