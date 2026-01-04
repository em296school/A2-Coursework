import { NextRequest, NextResponse } from 'next/server';
import { rootDomain } from './config/constants';

// RegEX expression which tells NextJS what formats will trigger middleware routing.
export const config = {
    matcher: "/((?!api|_next|_static|_vercel)[\\w-]+\\.\\w+)",
};

// Necessary middleware function where we handle routing with subdomains
// to allow GreenGlide access to user dashboards.
export default function middleware(req: NextRequest) {
    const url = req.nextUrl;
    let hostName = req.headers.get('host') || '';

    // Define the main domain (without www or https://)
    const isLocalhost = hostName.includes('localhost');

    let subdomain = '';
    if (!isLocalhost && hostName.endsWith(`.${rootDomain}`)) {
        // Extract subdomain (xxx.greenglide-airlines.com) from the full domain.
        subdomain = hostName.replace(`.${rootDomain}`, '').split('.')[0];
    }

    // Handle main domain routing
    if (
        !subdomain ||
        subdomain === 'www' ||
        hostName === rootDomain ||
        isLocalhost
    ) {
        return NextResponse.rewrite(new URL('/home', req.url));
    }

    // Rewrite subdomains to /apps/[sbd]
    return NextResponse.rewrite(new URL(`/apps/${subdomain}`, req.url));
}