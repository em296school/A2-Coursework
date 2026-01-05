import { NextRequest, NextResponse } from 'next/server';
import { RootDomain } from './config/constants';

export const config = {
  matcher: '/((?!api|_next|_static|_vercel|favicon.ico).*)',
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Allow direct access to /apps/* routes on localhost for testing
  if (url.pathname.startsWith('/apps/')) {
    return NextResponse.next();
  }

  // Strip port if present (e.g. "sub.domain.com:443")
  const host = (req.headers.get('host') || '').split(':')[0];
  const isLocalhost = host.includes('localhost');

  let subdomain = '';
  if (!isLocalhost && host.endsWith(`.${RootDomain}`)) {
    subdomain = host.replace(`.${RootDomain}`, '').split('.')[0];
  }

  // Main domain or localhost -> /home
  if (!subdomain || subdomain === 'www' || host === RootDomain || isLocalhost) {
    url.pathname = '/home';
    return NextResponse.rewrite(url);
  }

  // Subdomain -> /apps/[subdomain]
  url.pathname = `/apps/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}
