import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes yang membutuhkan autentikasi untuk transaksi
const protectedTransactionRoutes = [
  '/marketplace/checkout',
  '/marketplace/cart',
  '/marketplace/orders',
  '/komunitas/create-post',
  '/komunitas/create-comment'
];

// Routes yang hanya bisa diakses ketika belum login
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Jika mencoba akses protected transaction route tanpa login
  if (protectedTransactionRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login, redirect dari auth routes ke home
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectedTransactionRoutes, ...authRoutes],
}; 