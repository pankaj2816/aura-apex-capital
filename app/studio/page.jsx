import dynamic from 'next/dynamic';

const StudioDesk = dynamic(() => import('@/components/studio/StudioDesk'), {
  ssr: false,
  loading: () => <p className="px-6 py-16 text-sm muted">Opening the studio.</p>,
});

export const metadata = {
  title: 'Studio · Aura & Apex Capital',
  description: 'Orbit the monolith villa or the district skyline.',
};

export default function StudioPage() {
  return <StudioDesk />;
}
