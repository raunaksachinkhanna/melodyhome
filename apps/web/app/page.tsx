import { getProducts } from '../lib/api'
import Hero from './components/Hero'
import TrustBanner from './components/TrustBanner'
import ProductCatalogue from './components/ProductCatalogue'
import CraftStory from './components/CraftStory'
import ImpactSection from './components/ImpactSection'
import CorporateGifting from './components/CorporateGifting'
import type { Product } from '../lib/types'

export default async function HomePage() {
  let products: Product[] = []
  let loadFailed = false

  try {
    products = await getProducts()
  } catch {
    loadFailed = true
  }

  return (
    <main id="main-content" className="min-h-screen bg-cream text-brown">
      <Hero featuredProduct={products.find((product) => product.images.length > 0) ?? products[0]} />
      <TrustBanner />
      {loadFailed ? (
        <section id="collection" className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-editorial text-gold">The collection</p>
          <h2 className="mt-4 font-serif text-4xl">The workshop doors are momentarily closed.</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-brown/60">We couldn&apos;t load the collection right now. Please refresh the page, or return shortly.</p>
        </section>
      ) : (
        <ProductCatalogue products={products} />
      )}
      <CraftStory />
      <ImpactSection />
      <CorporateGifting />
    </main>
  )
}
