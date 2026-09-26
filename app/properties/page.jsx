import CatalogDesk from '@/components/catalog/CatalogDesk';
import { isHostile } from '@/lib/sanitize';

export const metadata = {
  title: 'Catalog · Aura & Apex Capital',
  description: 'Villas, sky penthouses, fractional notes, and commercial assets.',
};

const PropertiesPage = ({ searchParams }) => {
  const rawQuery = searchParams?.q || '';
  const blocked = isHostile(rawQuery) || searchParams?.blocked === '1';
  const amenities = String(searchParams?.amenity || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <CatalogDesk
      initial={{
        className: searchParams?.class,
        district: searchParams?.district,
        q: blocked ? '' : rawQuery,
        min: searchParams?.min,
        max: searchParams?.max,
        view: searchParams?.view,
        amenities,
        blocked,
      }}
    />
  );
};

export default PropertiesPage;
