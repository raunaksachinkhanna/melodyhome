import { getProducts } from '../lib/api'
import Hero from './components/Hero'
import TrustBanner from './components/TrustBanner'
import ProductCatalogue from './components/ProductCatalogue'
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
    <main className="min-h-screen bg-cream text-brown">
      <Hero />
      <TrustBanner />
      {loadFailed ? (
        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-brown/70">
            We couldn&apos;t load the collection right now. Please refresh,
            or check back shortly.
          </p>
        </section>
      ) : (
        <ProductCatalogue products={products} />
      )}
    </main>
  )
}
