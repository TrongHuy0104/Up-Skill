import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const isLoginPage = req.nextUrl.pathname === '/login';

    if (token && isLoginPage) {
        console.log('Redirecting from login page');
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!token && isLoginPage) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: []
};
