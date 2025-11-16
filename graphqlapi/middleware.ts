// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ログイン必須ページ
  const protectedPaths = [
    '/dashboard',
    '/user',
    '/ingredient-nutrients',
    '/admin', // 管理者専用ページも対象
  ];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  console.log('aa')
  if (isProtected) {
    const token = req.cookies.get('idToken')?.value;
    if (!token) {
       console.log('bb')
      return NextResponse.redirect(new URL('/login', req.url));
    }
    console.log('cc')

    // if (pathname.startsWith('/admin') && !user.isAdmin) {
    //   return NextResponse.rewrite(new URL('/not-found', req.url));
    // }
  }

  return NextResponse.next();
}

// 適用範囲
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/user/:path*',
    '/ingredient-nutrients/:path*',
    '/admin/:path*', // 管理者専用ページも対象
  ],
};
