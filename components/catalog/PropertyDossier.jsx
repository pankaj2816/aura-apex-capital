'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AMENITIES, districtById } from '@/data/fixtures';
import { formatMoney, formatPlainPercent } from '@/lib/format';
import { useDesk } from '@/context/DeskContext';
import PropertyPhoto from './PropertyPhoto';
import { propertyPhotos } from '@/data/photos';
import FloorPlan from './FloorPlan';
import Calculator from './Calculator';
import TourForm from './TourForm';

const TwinStage = dynamic(() => import('@/components/studio/StudioDesk'), {
  ssr: false,
  loading: () => <p className="p-6 text-sm muted">Preparing the spatial twin.</p>,
});

const TABS = [
  { id: 'photos', label: 'Photographs' },
  { id: 'twin', label: 'Digital twin' },
  { id: 'plan', label: 'Floor plan' },
];

export default function PropertyDossier({ property, variant = 'page', onClose }) {
  const district = districtById(property.districtId);
  const { addCompare } = useDesk();
  const [tab, setTab] = useState('photos');
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    if (variant !== 'modal') return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [variant, onClose]);

  const amenityLabels = property.amenities
    .map((id) => AMENITIES.find((item) => item.id === id)?.label)
    .filter(Boolean);
  const shots = propertyPhotos(property.id);
  const current = shots[photo] || shots[0];

  const body = (
    <div className={variant === 'modal' ? 'grid gap-6 lg:grid-cols-[1.3fr_0.9fr]' : 'grid gap-6 lg:grid-cols-[1.3fr_0.9fr]'}>
      <div>
        <div className="seg mb-3 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip rounded-full px-3 py-1 text-xs"
              aria-pressed={tab === item.id}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="panel overflow-hidden rounded-3xl">
          {tab === 'photos' && (
            <div>
              <div className="h-64 md:h-80">
                <PropertyPhoto src={current?.src} alt={current?.alt || property.name} />
              </div>
              <div className="flex gap-2 p-3">
                {shots.map((shot, index) => (
                  <button
                    key={shot.src}
                    type="button"
                    className="h-16 w-24 overflow-hidden rounded-xl"
                    onClick={() => setPhoto(index)}
                    aria-label={shot.alt}
                    aria-pressed={photo === index}
                  >
                    <PropertyPhoto src={shot.src} alt="" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {tab === 'twin' && <TwinStage compact />}
          {tab === 'plan' && (
            <div className="h-80 md:h-96">
              <FloorPlan />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] muted">
            {district.label} · {district.name}
          </p>
          <h2 className="display mt-1 text-3xl">{property.name}</h2>
          <p className="mt-2 text-sm">{property.story}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs muted">Mark</dt>
            <dd>{formatMoney(property.price)}</dd>
          </div>
          <div>
            <dt className="text-xs muted">Yield</dt>
            <dd>{formatPlainPercent(property.yieldPct)}</dd>
          </div>
          <div>
            <dt className="text-xs muted">Ticker</dt>
            <dd>${property.ticker}</dd>
          </div>
          <div>
            <dt className="text-xs muted">Status</dt>
            <dd>{property.status}</dd>
          </div>
          {property.sqft > 0 && (
            <div>
              <dt className="text-xs muted">Floor</dt>
              <dd>{property.sqft.toLocaleString('en-US')} sq ft</dd>
            </div>
          )}
          {property.beds > 0 && (
            <div>
              <dt className="text-xs muted">Rooms</dt>
              <dd>
                {property.beds} beds · {property.baths} baths
              </dd>
            </div>
          )}
        </dl>
        <ul className="flex flex-wrap gap-2">
          {amenityLabels.map((label) => (
            <li key={label} className="chip rounded-full px-3 py-1 text-xs">
              {label}
            </li>
          ))}
        </ul>
        <button type="button" className="chip rounded-full px-4 py-2 text-sm" onClick={() => addCompare(property.id)}>
          Add to compare
        </button>
        <div className="panel rounded-3xl p-4">
          <h3 className="display text-xl">Mortgage and yield</h3>
          <div className="mt-3">
            <Calculator property={property} />
          </div>
        </div>
        <div className="panel rounded-3xl p-4">
          <h3 className="display text-xl">Private tour</h3>
          <div className="mt-3">
            <TourForm propertyName={property.name} />
          </div>
        </div>
        {variant === 'page' && (
          <Link href="/properties" className="inline-block text-sm text-accent">
            Back to the catalog
          </Link>
        )}
      </div>
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-2 sm:items-center sm:p-6" role="presentation" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-title"
          className="modal-scroll panel max-h-[92vh] w-full max-w-6xl overflow-auto rounded-3xl p-4 md:p-6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <p id="dossier-title" className="text-sm tracking-[0.14em]">
              {property.name}
            </p>
            <button type="button" className="chip rounded-full px-3 py-1 text-sm" onClick={onClose}>
              Close
            </button>
          </div>
          {body}
        </div>
      </div>
    );
  }

  return <article className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{body}</article>;
}
