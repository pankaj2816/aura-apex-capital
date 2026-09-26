'use client';

import Link from 'next/link';

const ErrorPage = ({ reset }) => {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] muted">Interrupted</p>
      <h1 className="display mt-3 text-4xl">The desk could not finish that view</h1>
      <p className="mt-3 text-sm muted">Nothing was written. You can try the view again or return to the atlas.</p>
      <div className="mt-8 flex justify-center gap-3">
        <button type="button" className="chip rounded-full px-4 py-2 text-sm" onClick={() => reset()}>
          Try again
        </button>
        <Link href="/" className="chip rounded-full px-4 py-2 text-sm" data-active="true">
          Atlas
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
