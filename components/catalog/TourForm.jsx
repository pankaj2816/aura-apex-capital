'use client';

import { useState } from 'react';
import { toPlainText } from '@/lib/sanitize';

const WINDOWS = ['Dawn', 'Noon', 'Golden Hour', 'Midnight'];

function referenceFor(name, slot) {
  const raw = `${name}|${slot}|${Date.now()}`;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `AAC-${(hash >>> 0).toString(16).slice(0, 4).toUpperCase()}`;
}

export default function TourForm({ propertyName }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [slot, setSlot] = useState('Golden Hour');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const submit = (event) => {
    event.preventDefault();
    const cleanName = toPlainText(name, 60);
    const cleanEmail = toPlainText(email, 80);
    const cleanNote = toPlainText(note, 280);
    if (cleanName.length < 2) {
      setError('Add the name the desk should hold the tour under.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Add a plain email so the confirmation has somewhere to sit.');
      return;
    }
    setError('');
    setConfirmation({
      name: cleanName,
      email: cleanEmail,
      slot,
      note: cleanNote,
      ref: referenceFor(cleanName, slot),
      propertyName,
    });
  };

  if (confirmation) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--line)/var(--line-alpha))] p-4" role="status">
        <p className="text-xs uppercase tracking-[0.18em] muted">Tour confirmed</p>
        <h3 className="display mt-2 text-2xl">The hour is held</h3>
        <p className="mt-2 text-sm">
          {confirmation.propertyName} is reserved for {confirmation.name} at {confirmation.slot}. Reference {confirmation.ref}.
        </p>
        <p className="mt-2 text-sm muted">
          A note is queued for {confirmation.email}. This desk does not place a live booking.
        </p>
        {confirmation.note && <p className="mt-3 text-sm">Note: {confirmation.note}</p>}
        <button type="button" className="chip mt-4 rounded-full px-3 py-1.5 text-sm" onClick={() => setConfirmation(null)}>
          Book another hour
        </button>
      </div>
    );
  }

  return (
    <form className="grid gap-3" onSubmit={submit}>
      <label className="text-xs">
        <span className="muted">Name</span>
        <input
          value={name}
          maxLength={60}
          onChange={(event) => setName(toPlainText(event.target.value, 60))}
          className="chip mt-1 w-full rounded-xl px-3 py-2 text-sm"
          autoComplete="name"
        />
      </label>
      <label className="text-xs">
        <span className="muted">Email</span>
        <input
          value={email}
          maxLength={80}
          onChange={(event) => setEmail(toPlainText(event.target.value, 80))}
          className="chip mt-1 w-full rounded-xl px-3 py-2 text-sm"
          autoComplete="email"
          inputMode="email"
        />
      </label>
      <label className="text-xs">
        <span className="muted">Window</span>
        <select
          value={slot}
          onChange={(event) => setSlot(event.target.value)}
          className="chip mt-1 w-full rounded-xl px-3 py-2 text-sm"
        >
          {WINDOWS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="text-xs">
        <span className="muted">Note</span>
        <textarea
          value={note}
          maxLength={280}
          onChange={(event) => setNote(toPlainText(event.target.value, 280))}
          className="chip mt-1 w-full rounded-xl px-3 py-2 text-sm"
          rows={3}
        />
      </label>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button type="submit" className="chip rounded-full px-4 py-2 text-sm" data-active="true">
        Confirm the tour
      </button>
    </form>
  );
}
