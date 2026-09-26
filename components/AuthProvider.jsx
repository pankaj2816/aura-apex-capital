'use client';
import { SessionProvider } from 'next-auth/react';

const AuthProvider = ({ children, enabled }) => {
  if (!enabled) return children;
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
