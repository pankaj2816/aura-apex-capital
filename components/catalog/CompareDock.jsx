'use client';

import Link from 'next/link';
import { propertyById, districtById } from '@/data/fixtures';
import { formatMoney, formatPlainPercent } from '@/lib/format';
import { useDesk } from '@/context/DeskContext';

export default function CompareDock() {
  const { compare, removeCompare, clearCompare, notice } = useDesk();
  if (compare.length === 0 && !notice) return null;
  const rows = compare.map((id) => propertyById(id)).filter(Boolean);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 md:px-6">
      <div className="panel mx-auto max-w-5xl rounded-2xl p-3">
        {notice && <p className="mb-2 text-xs">{notice}</p>}
        {rows.length > 0 && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.16em] muted">Compare · {rows.length} of 3</p>
              <button type="button" className="text-xs" onClick={clearCompare}>
                Clear
              </button>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {rows.map((property) => (
                <div key={property.id} className="chip rounded-xl px-3 py-2 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/properties/${property.id}`} className="font-medium">
                      {property.name}
                    </Link>
                    <button type="button" aria-label={`Remove ${property.name}`} onClick={() => removeCompare(property.id)}>
                      ×
                    </button>
                  </div>
                  <p className="text-xs muted">
                    {districtById(property.districtId).name} · {formatMoney(property.price)} · {formatPlainPercent(property.yieldPct)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
