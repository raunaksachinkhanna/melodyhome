const TRUST_ITEMS = [
  { icon: 'hands', title: 'Small-batch handmade', detail: 'Made with close attention' },
  { icon: 'circle', title: 'Made to order', detail: 'Production begins for you' },
  { icon: 'shield', title: 'Secure payments', detail: 'Protected by Razorpay' },
  { icon: 'hammer', title: 'Artisan-led', detail: 'Heritage skill at the centre' },
  { icon: 'sun', title: '~7 days to dispatch', detail: 'Time for considered making' },
] as const

export default function TrustBanner() {
  return (
    <section aria-label="Melody Home promises" className="border-y border-gold/30 bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-3 lg:grid-cols-5 lg:px-8">
        {TRUST_ITEMS.map((item, index) => (
          <div key={item.title} className={`py-6 ${index % 2 === 0 ? 'pr-4' : 'border-l border-brown/10 pl-4'} md:border-l md:border-brown/10 md:px-5 md:first:border-l-0 lg:py-7`}>
            <TrustIcon name={item.icon} />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em]">{item.title}</p>
            <p className="mt-1 text-[0.68rem] leading-4 text-brown/55">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function TrustIcon({ name }: { name: (typeof TRUST_ITEMS)[number]['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold" aria-hidden="true">
      {name === 'hands' && <><path {...common} d="M3 13.5V8.8c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4v3.1-5c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4v4.3-5.7c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4v5.7-4.3c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4v6.4"/><path {...common} d="M14.2 10.5c1.4-1.7 3-2 3.8-1.3.7.7.2 1.8-.7 3.2l-3.1 4.5c-.8 1.2-2.2 1.9-3.7 1.9H8c-2.8 0-5-2.3-5-5.2"/></>}
      {name === 'circle' && <><circle {...common} cx="12" cy="12" r="8.5"/><path {...common} d="M12 7.5v5l3 1.8"/></>}
      {name === 'shield' && <><path {...common} d="M12 3.5 19 6v5.4c0 4.2-2.8 7.6-7 9.1-4.2-1.5-7-4.9-7-9.1V6l7-2.5Z"/><path {...common} d="m8.8 12 2.1 2.1 4.4-4.5"/></>}
      {name === 'hammer' && <><path {...common} d="m14.5 4.2 5.3 5.3-2.4 2.4-5.3-5.3zM13 7.8 5 15.9c-.8.8-.8 2 0 2.8s2 .8 2.8 0l8.1-8"/><path {...common} d="m11.7 3 3-1 6.3 6.3-1 3"/></>}
      {name === 'sun' && <><circle {...common} cx="12" cy="12" r="3.5"/><path {...common} d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/></>}
    </svg>
  )
}
