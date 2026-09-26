import Link from 'next/link';
import { DISTRICTS, PROPERTIES, districtById } from '@/data/fixtures';
import { coverPhoto, districtPhoto } from '@/data/photos';
import { formatMoney } from '@/lib/format';
import PropertyPhoto from './catalog/PropertyPhoto';

export default function AtlasHome() {
  const featured = PROPERTIES.filter((property) => property.class === 'villa').slice(0, 3);
  const hero = coverPhoto('monolith-villa');
  return (
    <div>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] muted">District 01 · Neo Haven</p>
          <h1 className="display mt-3 text-4xl leading-tight sm:text-6xl">
            Spatial Architecture. Algorithmic Real Estate. Curated Living.
          </h1>
          <p className="mt-5 max-w-xl text-base muted">
            Aura & Apex Capital keeps a private book of villas, sky residences, fractional notes, and commercial halls. Every district on this desk is fictional. The marks are a demonstration, not an offer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/studio" className="chip rounded-full px-5 py-2.5 text-sm" data-active="true">
              Enter the studio
            </Link>
            <Link href="/markets" className="chip rounded-full px-5 py-2.5 text-sm">
              Open the ledger
            </Link>
          </div>
        </div>
        <div className="panel overflow-hidden rounded-3xl">
          <div className="h-72 md:h-96">
            <PropertyPhoto src={hero?.src} alt={hero?.alt || 'Monolith Villa'} />
          </div>
          <div className="flex items-end justify-between gap-3 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] muted">Reference twin</p>
              <p className="display text-2xl">Monolith Villa</p>
            </div>
            <p className="text-sm">{formatMoney(18400000)}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <h2 className="display text-2xl">Five districts</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {DISTRICTS.map((district) => {
            const photo = districtPhoto(district.id);
            return (
              <Link key={district.id} href={`/properties?district=${district.id}`} className="panel overflow-hidden rounded-2xl">
                <div className="h-28">
                  <PropertyPhoto src={photo?.src} alt={photo?.alt || district.name} />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.14em] muted">{district.label}</p>
                  <p className="mt-2 text-sm">{district.name}</p>
                  <p className="mt-2 text-xs muted">{district.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="display text-2xl">Villas on the book</h2>
          <Link href="/properties" className="text-sm text-accent">
            Full catalog
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((property) => {
            const photo = coverPhoto(property.id);
            return (
            <Link key={property.id} href={`/properties/${property.id}`} className="panel overflow-hidden rounded-3xl">
              <div className="h-40">
                <PropertyPhoto src={photo?.src} alt={photo?.alt || property.name} />
              </div>
              <div className="p-4">
                <p className="text-xs muted">{districtById(property.districtId).name}</p>
                <p className="display text-xl">{property.name}</p>
                <p className="mt-1 text-sm">{formatMoney(property.price)}</p>
              </div>
            </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
