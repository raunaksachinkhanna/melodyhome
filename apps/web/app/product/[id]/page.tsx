import type { Metadata } from 'next'
import Link from 'next/link'
import { getProduct } from '../../../lib/api'
import { categoryLabel, validProductImages, variantLabel } from '../../../lib/product'
import ProductGallery from '../../components/ProductGallery'
import ProductPurchase from '../../components/ProductPurchase'

interface ProductPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProduct(params.id)
    if (!product) return { title: 'Product not found' }
    const images = validProductImages(product.images)
    const description = product.description ?? `Discover ${product.name}, made to order by Melody Home.`
    return {
      title: product.name,
      description,
      openGraph: {
        title: product.name,
        description,
        type: 'website',
        images: images.map((url) => ({ url, alt: product.name })),
      },
    }
  } catch {
    return { title: 'Melody Home' }
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  let product = null
  let loadFailed = false

  try {
    product = await getProduct(params.id)
  } catch {
    loadFailed = true
  }

  if (loadFailed) {
    return (
      <main id="main-content" className="grid min-h-[70vh] place-items-center bg-cream px-4 pt-24 text-center text-brown">
        <div><p className="text-xs font-bold uppercase tracking-editorial text-gold">Collection unavailable</p><h1 className="mt-4 font-serif text-4xl">The workshop connection was interrupted.</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-brown/60">We couldn&apos;t load this piece right now. Please refresh, or return to the collection.</p><Link href="/#collection" className="mt-7 inline-block border-b border-brown pb-1 text-sm font-bold">Back to collection</Link></div>
      </main>
    )
  }

  if (!product) {
    return (
      <main id="main-content" className="grid min-h-[70vh] place-items-center bg-cream px-4 pt-24 text-center text-brown">
        <div><p className="text-xs font-bold uppercase tracking-editorial text-gold">Piece not found</p><h1 className="mt-4 font-serif text-4xl">This object is no longer on the shelf.</h1><Link href="/#collection" className="mt-7 inline-block border-b border-brown pb-1 text-sm font-bold">Explore the collection</Link></div>
      </main>
    )
  }

  const dimensions = Array.from(new Set(product.variants.map((variant) => variant.size).filter((size): size is string => Boolean(size))))
  const images = validProductImages(product.images)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    category: categoryLabel(product.category),
    ...(product.description ? { description: product.description } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    offers: product.variants.length > 0
      ? product.variants.map((variant) => ({
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: variant.price,
          sku: variant.sku,
          url: `https://melodyhome.in/product/${product.id}`,
        }))
      : {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.base_price,
          url: `https://melodyhome.in/product/${product.id}`,
        },
  }

  return (
    <main id="main-content" className="min-h-screen bg-cream pt-[4.75rem] text-brown">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-7 sm:px-6 lg:px-8 lg:pb-28">
        <Link href="/#collection" className="inline-flex items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.12em] text-brown/65 transition-colors hover:text-gold"><span aria-hidden="true">←</span> Back to collection</Link>

        <div className="mt-5 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <ProductGallery product={product} />
          <ProductPurchase product={product} />
        </div>

        <div className="mt-20 grid border-t border-brown/20 pt-10 lg:mt-28 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-editorial text-gold">Details</p>
            <dl className="mt-5 divide-y divide-brown/15 border-t border-brown/15 text-sm">
              {product.material && <div className="grid grid-cols-2 py-4"><dt className="text-brown/55">Material</dt><dd>{product.material}</dd></div>}
              {dimensions.length > 0 && <div className="grid grid-cols-2 py-4"><dt className="text-brown/55">Dimensions / size</dt><dd>{dimensions.join(', ')}</dd></div>}
              <div className="grid grid-cols-2 py-4"><dt className="text-brown/55">Making time</dt><dd>Approximately {product.lead_time_days} days</dd></div>
              {product.variants.length > 1 && <div className="grid grid-cols-2 py-4"><dt className="text-brown/55">Options</dt><dd>{product.variants.map(variantLabel).join(', ')}</dd></div>}
            </dl>
          </div>

          <div className="mt-12 lg:mt-0">
            <p className="text-xs font-bold uppercase tracking-editorial text-gold">The story behind the piece</p>
            <h2 className="balance mt-4 font-serif text-4xl leading-tight sm:text-5xl">Made slowly enough to carry a human trace.</h2>
            {product.description && <p className="mt-7 text-base leading-8 text-brown/70">{product.description}</p>}
            {product.artisan_story && <p className="mt-5 whitespace-pre-line text-base leading-8 text-brown/70">{product.artisan_story}</p>}
            {!product.description && !product.artisan_story && <p className="mt-7 text-base leading-8 text-brown/70">This made-to-order piece is shaped through artisan-led production in Punjab, with the time and attention that handmade work requires.</p>}
            <aside className="mt-8 border-l-2 border-gold pl-5 text-sm leading-7 text-brown/65">
              <strong className="block text-brown">A note on variation</strong>
              Small differences in surface, tone, or form are part of hand-making. They are not defects; they are the quiet signature of the person and process behind your piece.
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
