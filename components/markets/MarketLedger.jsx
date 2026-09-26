'use client';

import { useEffect, useMemo, useState } from 'react';
import { PROPERTIES, districtById } from '@/data/fixtures';
import { bestFuzzyScore } from '@/lib/fuzzy';
import { isHostile, toPlainText } from '@/lib/sanitize';
import { downloadText, toCsv } from '@/lib/csv';
import { formatCompact, formatMoney, formatPlainPercent } from '@/lib/format';
import { useDesk } from '@/context/DeskContext';

const COLUMNS = [
  { id: 'name', label: 'Asset', value: (row) => row.name },
  { id: 'ticker', label: 'Ticker', value: (row) => `$${row.ticker}` },
  { id: 'district', label: 'District', value: (row) => row.district },
  { id: 'class', label: 'Class', value: (row) => row.class },
  { id: 'mark', label: 'Mark', value: (row) => row.price },
  { id: 'yieldPct', label: 'Yield', value: (row) => row.yieldPct },
  { id: 'status', label: 'Status', value: (row) => row.status },
  { id: 'volume', label: 'Volume', value: (row) => row.volume },
  { id: 'spread', label: 'Spread', value: (row) => row.spread },
  { id: 'updated', label: 'Updated', value: (row) => row.updated },
];

const DEFAULT_VISIBLE = ['name', 'ticker', 'district', 'class', 'mark', 'yieldPct', 'status', 'volume'];

const SCHEMA = [
  { field: 'id', type: 'string', notes: 'Stable desk id' },
  { field: 'ticker', type: 'string', notes: 'APEX, AURA, TWIN, or SOLR' },
  { field: 'name', type: 'string', notes: 'Instrument or asset name' },
  { field: 'district', type: 'string', notes: 'Fictional district' },
  { field: 'class', type: 'enum', notes: 'villa, penthouse, reit, commercial' },
  { field: 'mark', type: 'number', notes: 'Last mark in USD' },
  { field: 'yieldPct', type: 'number', notes: 'Trailing distribution yield' },
  { field: 'status', type: 'enum', notes: 'Open, Reserved, Settling, Archived' },
  { field: 'volume', type: 'number', notes: 'Units in the last session' },
  { field: 'spread', type: 'number', notes: 'High minus low of the session' },
  { field: 'updated', type: 'date', notes: 'ISO session date' },
];

function rowsFromFixtures() {
  return PROPERTIES.map((property, index) => ({
    id: property.id,
    ticker: property.ticker,
    name: property.name,
    district: districtById(property.districtId).name,
    class: property.class,
    price: property.price,
    yieldPct: property.yieldPct,
    status: property.status,
    volume: property.volume,
    spread: property.spread,
    updated: `2026-09-${String(12 + (index % 14)).padStart(2, '0')}`,
  }));
}

function pillClass(status) {
  if (status === 'Reserved') return 'pill pill-reserved';
  if (status === 'Settling') return 'pill pill-settling';
  if (status === 'Archived') return 'pill pill-archived';
  return 'pill pill-open';
}

export default function MarketLedger() {
  const { setActiveId, setSymbol } = useDesk();
  const [query, setQuery] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [sort, setSort] = useState({ id: 'mark', dir: 'desc' });
  const [visible, setVisible] = useState(DEFAULT_VISIBLE);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const rows = useMemo(() => rowsFromFixtures(), []);

  useEffect(() => {
    if (!schemaOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setSchemaOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [schemaOpen]);

  const shown = useMemo(() => {
    const q = toPlainText(query, 80);
    const filtered = rows.filter((row) => {
      if (!q || blocked) return !blocked;
      return bestFuzzyScore(q, [row.name, row.ticker, row.district, row.class, row.status]) > 0;
    });
    const column = COLUMNS.find((item) => item.id === sort.id) || COLUMNS[0];
    const sorted = [...filtered].sort((a, b) => {
      const left = column.id === 'mark' ? a.price : column.value(a);
      const right = column.id === 'mark' ? b.price : column.value(b);
      if (typeof left === 'number' && typeof right === 'number') {
        return sort.dir === 'asc' ? left - right : right - left;
      }
      return sort.dir === 'asc'
        ? String(left).localeCompare(String(right))
        : String(right).localeCompare(String(left));
    });
    return blocked ? [] : sorted;
  }, [rows, query, blocked, sort]);

  const activeColumns = COLUMNS.filter((column) => visible.includes(column.id));

  const onQuery = (value) => {
    if (isHostile(value)) {
      setBlocked(true);
      setQuery('');
      return;
    }
    setBlocked(false);
    setQuery(toPlainText(value, 80));
  };

  const toggleSort = (id) => {
    setSort((current) =>
      current.id === id
        ? { id, dir: current.dir === 'asc' ? 'desc' : 'asc' }
        : { id, dir: 'asc' }
    );
  };

  const exportRows = shown.map((row) => ({
    ...row,
    mark: row.price,
  }));

  const downloadCsv = () => {
    const csv = toCsv(exportRows, activeColumns.map((column) => ({
      label: column.label,
      value: (row) => (column.id === 'mark' ? row.price : column.value(row)),
    })));
    downloadText('aura-apex-ledger.csv', csv, 'text/csv;charset=utf-8');
  };

  const downloadJson = () => {
    const json = JSON.stringify(
      exportRows.map((row) => {
        const next = { id: row.id };
        activeColumns.forEach((column) => {
          next[column.id === 'mark' ? 'mark' : column.id] = column.id === 'mark' ? row.price : column.value(row);
        });
        return next;
      }),
      null,
      2
    );
    downloadText('aura-apex-ledger.json', json, 'application/json');
  };

  return (
    <section className="panel rounded-3xl p-4 md:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] muted">Market database</p>
          <h2 className="display text-2xl">Ledger</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="chip rounded-full px-3 py-1.5 text-xs" onClick={() => setColumnsOpen((v) => !v)}>
            Columns
          </button>
          <button type="button" className="chip rounded-full px-3 py-1.5 text-xs" onClick={() => setSchemaOpen(true)}>
            Schema
          </button>
          <button type="button" className="chip rounded-full px-3 py-1.5 text-xs" onClick={downloadCsv}>
            CSV
          </button>
          <button type="button" className="chip rounded-full px-3 py-1.5 text-xs" onClick={downloadJson}>
            JSON
          </button>
        </div>
      </div>

      <label className="mt-4 block text-sm">
        <span className="sr-only">Search the ledger</span>
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search asset, ticker, district"
          className="chip w-full rounded-2xl px-4 py-3"
          maxLength={80}
        />
      </label>

      {columnsOpen && (
        <fieldset className="mt-3 flex flex-wrap gap-2">
          <legend className="sr-only">Visible columns</legend>
          {COLUMNS.map((column) => (
            <label key={column.id} className="chip flex items-center gap-2 rounded-full px-3 py-1 text-xs">
              <input
                type="checkbox"
                checked={visible.includes(column.id)}
                onChange={() =>
                  setVisible((current) => {
                    if (current.includes(column.id)) {
                      return current.length === 1 ? current : current.filter((id) => id !== column.id);
                    }
                    return [...current, column.id];
                  })
                }
              />
              {column.label}
            </label>
          ))}
        </fieldset>
      )}

      {blocked && (
        <p className="mt-4 text-sm" role="status">
          The desk refused that search. Markup is not a query.
        </p>
      )}

      {!blocked && shown.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[rgb(var(--line)/var(--line-alpha))] px-4 py-16 text-center">
          <p className="display text-xl">No rows in view</p>
          <p className="mt-2 text-sm muted">Clear the search to restore the book.</p>
          <button type="button" className="chip mt-4 rounded-full px-4 py-2 text-sm" onClick={() => setQuery('')}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] muted">
                {activeColumns.map((column) => (
                  <th key={column.id} className="px-2 py-2 font-medium">
                    <button type="button" onClick={() => toggleSort(column.id)} className="inline-flex items-center gap-1">
                      {column.label}
                      {sort.id === column.id ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.id} className="border-t border-[rgb(var(--line)/var(--line-alpha))]">
                  {activeColumns.map((column) => (
                    <td key={column.id} className="px-2 py-3">
                      {column.id === 'name' ? (
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => {
                            setActiveId(row.id);
                            setSymbol(row.ticker);
                          }}
                        >
                          {row.name}
                        </button>
                      ) : column.id === 'status' ? (
                        <span className={pillClass(row.status)}>{row.status}</span>
                      ) : column.id === 'mark' ? (
                        formatMoney(row.price)
                      ) : column.id === 'yieldPct' ? (
                        formatPlainPercent(row.yieldPct)
                      ) : column.id === 'volume' ? (
                        formatCompact(row.volume)
                      ) : (
                        column.value(row)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {schemaOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" role="presentation" onClick={() => setSchemaOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="schema-title"
            className="panel max-h-[80vh] w-full max-w-lg overflow-auto rounded-3xl p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 id="schema-title" className="display text-2xl">Ledger schema</h3>
              <button type="button" className="chip rounded-full px-3 py-1 text-sm" onClick={() => setSchemaOpen(false)}>
                Close
              </button>
            </div>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.12em] muted">
                  <th className="py-2">Field</th>
                  <th>Type</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {SCHEMA.map((field) => (
                  <tr key={field.field} className="border-t border-[rgb(var(--line)/var(--line-alpha))]">
                    <td className="py-2 pr-2">{field.field}</td>
                    <td className="pr-2 muted">{field.type}</td>
                    <td>{field.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
