import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Protected Routes (যেকোনো লগইন করা ইউজার এক্সেস করতে পারবে)
  const protectedRoutes = ['/checkout', '/profile', '/wishlist', '/cart'];
  
  // 2. Admin Routes (মিডলওয়্যার শুধু চেক করবে লগইন আছে কিনা, রোল চেক করবে ক্লায়েন্ট সাইড AdminRoute)
  const adminRoutes = ['/dashboard'];

  // চেক করুন বর্তমান পাথটি প্রোটেক্টেড কিনা
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // 3. যদি ইউজার লগইন না থাকে এবং প্রোটেক্টেড পেজে যেতে চায় -> লগইন পেজে পাঠাও
  if ((isProtectedRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. যদি ইউজার লগইন থাকে এবং লগইন/সাইনআপ পেজে যেতে চায় -> হোম পেজে পাঠাও
  const authRoutes = ['/login', '/signup'];
  if (authRoutes.includes(pathname) && token) {
     return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/checkout/:path*', 
    '/profile/:path*',
    '/wishlist/:path*',
    '/cart/:path*',
    '/login',
    '/signup'
  ],
};