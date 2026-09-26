'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AMENITIES,
  CLASSES,
  DISTRICTS,
  PROPERTIES,
  districtById,
} from '@/data/fixtures';
import { allowOne, isHostile, readBoundNumber, toPlainText } from '@/lib/sanitize';
import { formatMoney, formatPlainPercent } from '@/lib/format';
import PropertyPhoto from './PropertyPhoto';
import { coverPhoto } from '@/data/photos';
import DistrictMap from './DistrictMap';
import PropertyDossier from './PropertyDossier';

const VIEWS = ['grid', 'list', 'map'];

function moneyLabel(value, edge) {
  if (edge === 'max' && value >= 50000000) return '$50M+';
  return formatMoney(value);
}

export default function CatalogDesk({ initial }) {
  const router = useRouter();
  const blocked = Boolean(initial?.blocked);
  const [assetClass, setAssetClass] = useState(allowOne(initial?.className, CLASSES.map((item) => item.id), 'villa'));
  const [district, setDistrict] = useState(allowOne(initial?.district, ['all', ...DISTRICTS.map((item) => item.id)], 'all'));
  const [amenities, setAmenities] = useState(
    Array.isArray(initial?.amenities)
      ? initial.amenities.filter((id) => AMENITIES.some((item) => item.id === id))
      : []
  );
  const [minPrice, setMinPrice] = useState(readBoundNumber(initial?.min, 1000000, 50000000, 1000000));
  const [maxPrice, setMaxPrice] = useState(readBoundNumber(initial?.max, 1000000, 50000000, 50000000));
  const [query, setQuery] = useState(blocked ? '' : toPlainText(initial?.q || '', 80));
  const [view, setView] = useState(allowOne(initial?.view, VIEWS, 'grid'));
  const [openId, setOpenId] = useState(null);
  const [localBlocked, setLocalBlocked] = useState(blocked);

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return PROPERTIES.filter((property) => {
      if (property.class !== assetClass) return false;
      if (district !== 'all' && property.districtId !== district) return false;
      if (property.price < minPrice) return false;
      if (maxPrice < 50000000 && property.price > maxPrice) return false;
      if (amenities.length && !amenities.some((id) => property.amenities.includes(id))) return false;
      if (!q) return true;
      const districtName = districtById(property.districtId).name.toLowerCase();
      return (
        property.name.toLowerCase().includes(q) ||
        districtName.includes(q) ||
        property.ticker.toLowerCase().includes(q)
      );
    });
  }, [assetClass, district, amenities, minPrice, maxPrice, query]);

  const pushQuery = (next) => {
    const params = new URLSearchParams();
    params.set('class', next.className || assetClass);
    if ((next.district || district) !== 'all') params.set('district', next.district || district);
    if ((next.q ?? query) && !localBlocked) params.set('q', next.q ?? query);
    params.set('min', String(next.min ?? minPrice));
    params.set('max', String(next.max ?? maxPrice));
    params.set('view', next.view || view);
    const amenityList = next.amenities || amenities;
    if (amenityList.length) params.set('amenity', amenityList.join(','));
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  };

  const onSearch = (value) => {
    if (isHostile(value)) {
      setLocalBlocked(true);
      setQuery('');
      return;
    }
    const clean = toPlainText(value, 80);
    setLocalBlocked(false);
    setQuery(clean);
  };

  const open = PROPERTIES.find((property) => property.id === openId) || null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] muted">Curated book</p>
        <h1 className="display text-3xl md:text-5xl">Catalog</h1>
        <p className="mt-2 max-w-2xl text-sm muted">
          Villas, sky residences, fractional notes, and commercial halls across five fictional districts. Marks run from $1M to $50M and beyond.
        </p>
      </header>

      <div className="seg flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Asset class">
        {CLASSES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={assetClass === item.id}
            aria-pressed={assetClass === item.id}
            className="chip shrink-0 rounded-full px-4 py-2 text-sm"
            onClick={() => {
              setAssetClass(item.id);
              pushQuery({ className: item.id });
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <label className="text-xs">
          <span className="muted">Search</span>
          <input
            value={query}
            maxLength={80}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Name, district, or ticker"
            className="chip mt-1 w-full rounded-2xl px-4 py-3 text-sm"
          />
        </label>
        <label className="text-xs">
          <span className="muted">District</span>
          <select
            value={district}
            onChange={(event) => {
              setDistrict(event.target.value);
              pushQuery({ district: event.target.value });
            }}
            className="chip mt-1 w-full rounded-2xl px-3 py-3 text-sm"
          >
            <option value="all">All districts</option>
            {DISTRICTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="seg flex items-end gap-2">
          {VIEWS.map((item) => (
            <button
              key={item}
              type="button"
              className="chip flex-1 rounded-full px-3 py-2 text-sm capitalize"
              aria-pressed={view === item}
              onClick={() => {
                setView(item);
                pushQuery({ view: item });
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs muted">
          <span>{moneyLabel(minPrice, 'min')}</span>
          <span>{moneyLabel(maxPrice, 'max')}</span>
        </div>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label>
            <span className="sr-only">Minimum price</span>
            <input
              type="range"
              min={1000000}
              max={50000000}
              step={500000}
              value={Math.min(minPrice, maxPrice)}
              onChange={(event) => {
                const next = Number(event.target.value);
                const bounded = Math.min(next, maxPrice);
                setMinPrice(bounded);
                pushQuery({ min: bounded });
              }}
            />
          </label>
          <label>
            <span className="sr-only">Maximum price</span>
            <input
              type="range"
              min={1000000}
              max={50000000}
              step={500000}
              value={maxPrice}
              onChange={(event) => {
                const next = Number(event.target.value);
                const bounded = Math.max(next, minPrice);
                setMaxPrice(bounded);
                pushQuery({ max: bounded });
              }}
            />
          </label>
        </div>
      </div>

      <fieldset className="mt-4 flex flex-wrap gap-2">
        <legend className="sr-only">Amenities</legend>
        {AMENITIES.map((item) => {
          const on = amenities.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className="chip rounded-full px-3 py-1 text-xs"
              data-active={on}
              aria-pressed={on}
              onClick={() => {
                const next = on ? amenities.filter((id) => id !== item.id) : [...amenities, item.id];
                setAmenities(next);
                pushQuery({ amenities: next });
              }}
            >
              {item.label}
            </button>
          );
        })}
      </fieldset>

      {localBlocked && (
        <p className="mt-4 text-sm" role="status">
          The desk refused that search. Markup is not a query.
        </p>
      )}

      {!localBlocked && list.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-[rgb(var(--line)/var(--line-alpha))] px-4 py-16 text-center">
          <p className="display text-2xl">No assets in this cut</p>
          <p className="mt-2 text-sm muted">Widen the price band or clear a district filter.</p>
        </div>
      )}

      {view === 'map' && !localBlocked && (
        <div className="mt-6">
          <DistrictMap properties={list} onOpen={setOpenId} />
        </div>
      )}

      {view === 'grid' && !localBlocked && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((property) => {
            const photo = coverPhoto(property.id);
            return (
            <article key={property.id} className="panel overflow-hidden rounded-3xl">
              <button type="button" className="block h-44 w-full" onClick={() => setOpenId(property.id)}>
                <PropertyPhoto src={photo?.src} alt={photo?.alt || property.name} />
              </button>
              <div className="p-4">
                <p className="text-xs muted">{districtById(property.districtId).name}</p>
                <h2 className="display text-xl">{property.name}</h2>
                <p className="mt-1 text-sm">{property.summary}</p>
                <p className="mt-3 text-sm">
                  {formatMoney(property.price)} · {formatPlainPercent(property.yieldPct)} · ${property.ticker}
                </p>
                <button type="button" className="chip mt-3 rounded-full px-3 py-1.5 text-sm" onClick={() => setOpenId(property.id)}>
                  Open dossier
                </button>
              </div>
            </article>
            );
          })}
        </div>
      )}

      {view === 'list' && !localBlocked && (
        <div className="mt-6 space-y-3">
          {list.map((property) => {
            const photo = coverPhoto(property.id);
            return (
            <article key={property.id} className="panel flex flex-col gap-3 rounded-3xl p-3 sm:flex-row">
              <div className="h-28 w-full overflow-hidden rounded-2xl sm:w-40">
                <PropertyPhoto src={photo?.src} alt={photo?.alt || property.name} />
              </div>
              <div className="flex-1">
                <p className="text-xs muted">{districtById(property.districtId).label}</p>
                <h2 className="display text-xl">{property.name}</h2>
                <p className="text-sm muted">{property.summary}</p>
                <p className="mt-2 text-sm">
                  {formatMoney(property.price)} · {formatPlainPercent(property.yieldPct)}
                </p>
              </div>
              <button type="button" className="chip h-fit rounded-full px-3 py-2 text-sm" onClick={() => setOpenId(property.id)}>
                Open
              </button>
            </article>
            );
          })}
        </div>
      )}

      {open && <PropertyDossier property={open} variant="modal" onClose={() => setOpenId(null)} />}
    </div>
  );
}
