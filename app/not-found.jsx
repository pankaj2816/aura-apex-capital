import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] muted">404</p>
      <h1 className="display mt-3 text-4xl">That page is not on the desk</h1>
      <p className="mt-3 text-sm muted">The atlas, studio, markets, and catalog are the routes this book keeps open.</p>
      <Link href="/" className="chip mt-8 inline-flex rounded-full px-4 py-2 text-sm" data-active="true">
        Return to the atlas
      </Link>
    </section>
  );
};

export default NotFoundPage;
