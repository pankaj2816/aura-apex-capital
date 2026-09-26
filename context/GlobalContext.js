'use client';
import getUnreadMessageCount from '@/app/actions/getUnreadMessageCount';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext({
  unreadCount: 0,
  setUnreadCount: () => {},
});

function AuthedGlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    let active = true;
    if (session && session.user) {
      getUnreadMessageCount().then((res) => {
        if (active && res?.count) setUnreadCount(res.count);
      });
    }
    return () => {
      active = false;
    };
  }, [session]);

  return (
    <GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function GlobalProvider({ children, enabled }) {
  if (!enabled) {
    return <GlobalContext.Provider value={{ unreadCount: 0, setUnreadCount: () => {} }}>{children}</GlobalContext.Provider>;
  }
  return <AuthedGlobalProvider>{children}</AuthedGlobalProvider>;
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
