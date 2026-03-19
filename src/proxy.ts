import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PROTECTED_PATHS = ['/admin'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Verificar autenticação em rotas protegidas
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  
  if (isProtected) {
    const token = request.cookies.get('inatro_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // 2. Adicionar headers anti-cache para páginas HTML
  const response = NextResponse.next();
  
  if (!pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
