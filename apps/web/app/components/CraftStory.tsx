const PROCESS = [
  ['01', 'Forming', 'Metal is shaped into a useful form through practiced, physical knowledge.'],
  ['02', 'Hammering', 'Rhythmic hand-hammering creates the distinctive surface and strengthens the object.'],
  ['03', 'Finishing', 'Each piece is refined by hand, with small variations left as a truthful record of its making.'],
] as const

export default function CraftStory() {
  return (
    <section id="the-craft" className="overflow-hidden bg-brown text-cream">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="relative flex min-h-[34rem] items-center justify-center border-b border-cream/10 px-8 py-20 lg:min-h-[50rem] lg:border-b-0 lg:border-r">
          <div className="absolute inset-10 border border-gold/20" aria-hidden="true" />
          <div className="absolute h-80 w-80 rounded-full border border-gold/30 sm:h-[27rem] sm:w-[27rem]" aria-hidden="true" />
          <div className="absolute h-64 w-64 rounded-full border border-cream/10 sm:h-[21rem] sm:w-[21rem]" aria-hidden="true" />
          <div className="relative max-w-md text-center">
            <p className="font-serif text-[clamp(4.8rem,14vw,9rem)] leading-none text-gold">ठठेरा</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-cream/65">A living metalworking tradition</p>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-7 text-cream/60">Not a motif or a finish, but knowledge carried through hands, tools, rhythm, and repetition.</p>
          </div>
        </div>

        <div className="px-4 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-editorial text-gold">The craft</p>
          <h2 className="balance mt-4 font-serif text-4xl leading-tight sm:text-6xl">A rhythm of hammer and hand.</h2>
          <div className="mt-8 space-y-6 text-sm leading-7 text-cream/70 sm:text-base sm:leading-8">
            <p>ठठेरा is the traditional craft of hand-forming and hammering metal vessels. In Jandiala Guru, Punjab, this practice belongs to a community whose skills have been recognised by UNESCO as intangible cultural heritage.</p>
            <p>The marks across the surface are not decoration added at the end. They are evidence of the making itself: each strike controlled, repeated, and adjusted through experience.</p>
            <p>Preservation matters when it keeps knowledge in practice. Choosing a contemporary object made through this tradition gives the skill a place in the present—and a reason to be carried into the future.</p>
          </div>

          <ol className="mt-12 border-t border-cream/15">
            {PROCESS.map(([number, title, copy]) => (
              <li key={number} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-cream/15 py-6">
                <span className="font-serif text-xl text-gold">{number}</span>
                <div><h3 className="font-serif text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 text-cream/60">{copy}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
