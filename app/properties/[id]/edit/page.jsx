import PropertyEditForm from '@/components/PropertyEditForm';
import QuietDesk from '@/components/QuietDesk';
import connectDB, { mongoConfigured } from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';

const PropertyEditPage = async ({ params }) => {
  if (!mongoConfigured()) {
    return (
      <QuietDesk
        title="Editing is closed"
        body="The catalog is a fixed book of fixtures. Listings are not written from this desk unless a database is configured."
      />
    );
  }

  const ready = await connectDB();
  if (!ready) {
    return (
      <QuietDesk
        title="Editing is closed"
        body="The database did not answer."
      />
    );
  }

  const propertyDoc = await Property.findById(params.id).lean();
  const property = convertToSerializeableObject(propertyDoc);

  if (!property) {
    return (
      <h1 className='text-center text-2xl font-bold mt-10'>
        Property Not Found
      </h1>
    );
  }

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <PropertyEditForm property={property} />
        </div>
      </div>
    </section>
  );
};

export default PropertyEditPage;
