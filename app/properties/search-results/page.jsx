import { redirect } from 'next/navigation';
import { isHostile, toPlainText } from '@/lib/sanitize';

const SearchResultsPage = ({ searchParams }) => {
  const location = searchParams?.location || '';
  const propertyType = searchParams?.propertyType || '';
  if (isHostile(location) || isHostile(propertyType)) {
    redirect('/properties?blocked=1');
  }
  const query = toPlainText(location, 80);
  redirect(query ? `/properties?q=${encodeURIComponent(query)}` : '/properties');
};

export default SearchResultsPage;
