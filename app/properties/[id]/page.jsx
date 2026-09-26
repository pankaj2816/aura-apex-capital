import { notFound } from 'next/navigation';
import PropertyDossier from '@/components/catalog/PropertyDossier';
import { propertyById } from '@/data/fixtures';

export function generateMetadata({ params }) {
  const property = propertyById(params.id);
  if (!property) return { title: 'Asset not on the book' };
  return {
    title: `${property.name} · Aura & Apex Capital`,
    description: property.summary,
  };
}

const PropertyPage = ({ params }) => {
  const property = propertyById(params.id);
  if (!property) notFound();
  return <PropertyDossier property={property} />;
};

export default PropertyPage;
