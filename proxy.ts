import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth/login', '/auth/signup'];

export default function proxy(req: NextRequest) {
  const token = req.cookies.get('auth_token');
  const pathname = req.nextUrl.pathname;

  const isPublic = PUBLIC_PATHS.some((p) =>
    pathname.startsWith(p)
  );

  // ❌ Not logged in & trying to access protected route
  if (!token && !isPublic) {
    return NextResponse.redirect(
      new URL('/auth/login', req.url)
    );
  }

  // ✅ Logged in & trying to access auth pages
  if (token && isPublic) {
    return NextResponse.redirect(
      new URL('/', req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};