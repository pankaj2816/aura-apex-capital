import PropertyAddForm from '@/components/PropertyAddForm';
import QuietDesk from '@/components/QuietDesk';
import { mongoConfigured } from '@/config/database';

const PropertyAddPage = () => {
  if (!mongoConfigured()) {
    return (
      <QuietDesk
        title="New listings are not accepted here"
        body="The demonstration book is local. Adding an asset needs a configured database, which this desk does not require."
      />
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <PropertyAddForm />
    </section>
  );
};

export default PropertyAddPage;
