'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { propertyById } from '@/data/fixtures';

const DeskContext = createContext(null);

export function DeskProvider({ children }) {
  const [symbol, setSymbol] = useState('APEX');
  const [activeId, setActiveIdState] = useState('monolith-villa');
  const [compare, setCompare] = useState([]);
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(noticeTimer.current);
  }, []);

  const flash = (message) => {
    window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3200);
  };

  const setActiveId = (id) => {
    const property = propertyById(id);
    if (!property) return;
    setActiveIdState(property.id);
    setSymbol(property.ticker);
  };

  const addCompare = (id) => {
    const property = propertyById(id);
    if (!property) return;
    setCompare((current) => {
      if (current.includes(property.id)) return current;
      if (current.length >= 3) {
        flash('The compare dock holds three assets.');
        return current;
      }
      return [...current, property.id];
    });
  };

  const removeCompare = (id) => {
    setCompare((current) => current.filter((item) => item !== id));
  };

  const clearCompare = () => setCompare([]);

  const value = useMemo(
    () => ({
      symbol,
      setSymbol,
      activeId,
      setActiveId,
      compare,
      addCompare,
      removeCompare,
      clearCompare,
      notice,
    }),
    [symbol, activeId, compare, notice]
  );

  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>;
}

export function useDesk() {
  const ctx = useContext(DeskContext);
  if (!ctx) {
    throw new Error('useDesk must be used inside DeskProvider');
  }
  return ctx;
}
