import Link from 'next/link';

export default function QuietDesk({ title, body }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20">
      <p className="text-xs uppercase tracking-[0.2em] muted">Local fixtures</p>
      <h1 className="display mt-3 text-4xl">{title}</h1>
      <p className="mt-4 text-sm leading-relaxed muted">{body}</p>
      <Link href="/properties" className="chip mt-8 inline-flex rounded-full px-4 py-2 text-sm" data-active="true">
        Return to the catalog
      </Link>
    </section>
  );
}
