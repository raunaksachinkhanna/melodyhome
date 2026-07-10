import { getProduct } from '../../../lib/api'
import { formatINR } from '../../../lib/format'
import VariantPicker from '../../components/VariantPicker'

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let product = null
  let loadFailed = false

  try {
    product = await getProduct(params.id)
  } catch {
    loadFailed = true
  }

  if (loadFailed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-4 text-center text-brown">
        <p className="text-brown/70">
          We couldn&apos;t load this product right now. Please refresh, or
          check back shortly.
        </p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-4 text-center text-brown">
        <p className="text-brown/70">We couldn&apos;t find that product.</p>
      </main>
    )
  }

  const showMrp = Number(product.mrp) > Number(product.base_price)

  return (
    <main className="min-h-screen bg-cream text-brown">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brown via-brown to-gold/60">
          <span
            className="font-serif text-8xl text-cream/25"
            aria-hidden="true"
          >
            {product.category.charAt(0).toUpperCase()}
          </span>
          <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium tracking-wide text-brown">
            Handmade
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-serif text-3xl text-brown sm:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-brown">
                {formatINR(product.base_price)}
              </span>
              {showMrp && (
                <span className="text-base text-brown/40 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
            </div>
          </div>

          <p className="inline-flex w-fit items-center rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-sm font-medium text-brown">
            Made to order — ships in {product.lead_time_days} days
          </p>

          <VariantPicker
            basePrice={product.base_price}
            variants={product.variants}
          />

          <div className="border-t border-brown/10 pt-6">
            <h2 className="mb-2 text-lg font-semibold text-brown">
              The story behind this piece
            </h2>
            {product.description && (
              <p className="mb-3 text-brown/80">{product.description}</p>
            )}
            {product.artisan_story && (
              <p className="whitespace-pre-line text-brown/80">
                {product.artisan_story}
              </p>
            )}
            {!product.description && !product.artisan_story && (
              <p className="text-brown/80">
                The story for this piece is being written — every Melody
                Home creation is handmade by artisans carrying forward a
                UNESCO-recognised craft.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
