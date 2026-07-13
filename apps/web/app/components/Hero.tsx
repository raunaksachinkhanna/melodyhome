import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '../../lib/types'
import { validProductImages } from '../../lib/product'
import ProductFallback from './ProductFallback'

export default function Hero({ featuredProduct }: { featuredProduct?: Product }) {
  const featuredImage = featuredProduct
    ? validProductImages(featuredProduct.images)[0]
    : undefined

  return (
    <section className="relative isolate min-h-[48rem] overflow-hidden bg-brown text-cream lg:min-h-[52rem]">
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <div className="absolute -left-48 top-36 h-96 w-96 rounded-full border border-gold/40" />
        <div className="absolute -left-24 top-48 h-96 w-96 rounded-full border border-gold/20" />
        <div className="absolute bottom-[-18rem] right-[-8rem] h-[42rem] w-[42rem] rounded-full border border-cream/15" />
      </div>

      <div className="mx-auto grid min-h-[48rem] max-w-7xl items-center gap-12 px-4 pb-16 pt-32 sm:px-6 lg:min-h-[52rem] lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:pb-20 lg:pt-36">
        <div className="relative z-10 max-w-3xl">
          <p className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold sm:text-xs">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            UNESCO-recognised ठठेरा craft · Jandiala Guru
          </p>
          <h1 className="balance mt-7 font-serif text-[clamp(3.25rem,8vw,6.8rem)] leading-[0.91] tracking-[-0.035em]">
            Craft, carried <span className="italic text-gold">forward.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-cream/75 sm:text-lg sm:leading-8">
            Objects for contemporary homes, shaped by hands that hold generations of knowledge. Each piece helps heritage skill remain a living practice.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="#collection" className="inline-flex min-h-12 items-center justify-center bg-gold px-7 text-sm font-bold text-brown transition-colors hover:bg-cream">
              Explore the collection
            </Link>
            <Link href="#the-craft" className="inline-flex min-h-12 items-center justify-center border border-cream/40 px-7 text-sm font-semibold text-cream transition-colors hover:border-gold hover:text-gold">
              Discover the craft
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs tracking-wide text-cream/60">
            <span className="text-gold" aria-hidden="true">✦</span>
            Made to order in small batches · approximately 7 days before dispatch
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[31rem] lg:mr-0">
          <div className="absolute -inset-5 border border-gold/25 sm:-inset-8" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden border border-cream/15 bg-cream/5">
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt={featuredProduct?.name ?? 'Melody Home artisan object'}
                fill
                priority
                sizes="(min-width: 1024px) 36vw, 80vw"
                className="object-cover"
              />
            ) : (
              <ProductFallback category={featuredProduct?.category ?? 'brass'} className="h-full" />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brown/90 to-transparent px-5 pb-5 pt-20">
              <p className="text-xs uppercase tracking-editorial text-gold">An object with a lineage</p>
              <p className="mt-2 font-serif text-2xl">Made by hand. Made for use.</p>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-4 grid h-24 w-24 place-items-center rounded-full border border-gold bg-brown text-center text-[0.6rem] font-semibold uppercase leading-4 tracking-[0.15em] text-gold sm:-left-12 sm:h-28 sm:w-28">
            Small batch<br />making
          </div>
        </div>
      </div>
    </section>
  )
}
