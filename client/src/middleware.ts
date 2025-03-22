import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const normalToken = req.cookies.get('access_token')?.value;
    const secret = process.env.NEXTAUTH_SECRET;
    const socialToken = await getToken({ req, secret });

    console.log('Normal Token:', normalToken);
    console.log('Social Token:', socialToken);
    console.log('Request URL:', req.url);

    if (!normalToken && !socialToken) {
        console.log('No token found, redirecting to home page');
        const homeUrl = new URL('/', req.url);
        const redirectResponse = NextResponse.redirect(homeUrl);
        redirectResponse.headers.set('access_token', 'no-cache');
        return redirectResponse;
    }

    console.log('Token found, allowing access');
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/checkout/:path*', '/orders/:path*', '/courses/:path*/learn']
};
