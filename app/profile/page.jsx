import connectDB, { mongoConfigured } from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import ProfileProperties from '@/components/ProfileProperties';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import QuietDesk from '@/components/QuietDesk';

const ProfilePage = async () => {
  if (!mongoConfigured()) {
    return (
      <QuietDesk
        title="Profiles stay quiet"
        body="This desk runs on local fixtures. Profiles open only when a database and sign-in are configured. The catalog, studio, and ledger do not need them."
      />
    );
  }

  const ready = await connectDB();
  if (!ready) {
    return (
      <QuietDesk
        title="Profiles stay quiet"
        body="The database did not answer. The public desk is still available from the catalog."
      />
    );
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    return (
      <QuietDesk
        title="Sign in to open a profile"
        body="No session is active on this desk."
      />
    );
  }

  const propertiesDocs = await Property.find({ owner: sessionUser.userId }).lean();
  const properties = propertiesDocs.map(convertToSerializeableObject);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="display text-3xl">Your profile</h1>
      <p className="mt-2 text-sm">{sessionUser.user?.name}</p>
      <p className="text-sm muted">{sessionUser.user?.email}</p>
      <h2 className="mt-8 text-xl">Your listings</h2>
      {properties.length === 0 ? (
        <p className="mt-3 text-sm muted">No listings are attached to this profile.</p>
      ) : (
        <ProfileProperties properties={properties} />
      )}
    </section>
  );
};

export default ProfilePage;
