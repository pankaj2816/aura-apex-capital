import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const guarded = withAuth({
  pages: { signIn: '/' },
});

function authReady() {
  const secret = process.env.NEXTAUTH_SECRET || '';
  const google = process.env.GOOGLE_CLIENT_ID || '';
  if (!secret || !google) return false;
  if (secret.includes('ADD_YOUR_OWN') || google.includes('ADD_YOUR_OWN')) return false;
  return true;
}

export default function middleware(request, event) {
  if (!authReady()) return NextResponse.next();
  return guarded(request, event);
}

export const config = {
  matcher: ['/properties/add', '/profile', '/properties/saved', '/messages'],
};
