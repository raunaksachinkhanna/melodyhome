export default function ProductFallback({
  category,
  className = '',
}: {
  category: string
  className?: string
}) {
  const isTextile = category === 'textile' || category === 'growbag'

  return (
    <div className={`hammered-surface relative isolate grid min-h-64 place-items-center overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-5 border border-cream/10" />
      {isTextile ? (
        <div className="relative h-[48%] w-[58%] rotate-[-7deg] border border-gold/65 bg-cream/10 shadow-[16px_18px_0_rgba(201,145,58,0.18)]">
          <div className="absolute inset-x-0 top-1/3 h-px bg-gold/30" />
          <div className="absolute inset-y-0 left-1/3 w-px bg-gold/30" />
          <div className="absolute -bottom-4 left-3 right-3 flex justify-between">
            {[0, 1, 2, 3, 4, 5].map((line) => <span key={line} className="h-5 w-px bg-gold/70" />)}
          </div>
        </div>
      ) : (
        <div className="relative h-[52%] w-[52%] max-w-56 rounded-[50%_50%_38%_38%] border border-gold/70 bg-gradient-to-br from-gold/55 via-gold/15 to-cream/5 shadow-[inset_-18px_-14px_40px_rgba(62,14,0,0.65),0_24px_60px_rgba(62,14,0,0.35)]">
          <div className="absolute -top-[9%] left-[15%] right-[15%] h-[18%] rounded-[50%] border border-gold/70 bg-brown" />
          <div className="absolute inset-[12%] rounded-[50%] border border-cream/10" />
        </div>
      )}
      <span className="absolute bottom-8 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-cream/45">Image coming soon</span>
    </div>
  )
}
