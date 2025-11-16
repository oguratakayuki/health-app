import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard')
   || pathname.startsWith('/user')
   || pathname.startsWith('/ingredient-nutrients')) {

    const token = req.cookies.get('idToken')?.value;

    if (!token) {
      return NextResponse.rewrite(new URL('/not-found', req.url));
    }
  }

  return NextResponse.next();
}

// 適用範囲
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/user/:path*',
    '/ingredient-nutrients/:path*',
  ],
};

