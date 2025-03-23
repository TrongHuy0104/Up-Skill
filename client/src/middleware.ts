// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(req: NextRequest) {
//     const normalToken = req.cookies.get('access_token')?.value;
//     const secret = process.env.NEXTAUTH_SECRET;
//     const socialToken = await getToken({ req, secret });

//     console.log('Normal Token:', normalToken);
//     console.log('Social Token:', socialToken);
//     console.log('Request URL:', req.url);

//     if (!normalToken && !socialToken) {
//         console.log('No token found, redirecting to home page');
//         const homeUrl = new URL('/', req.url);
//         const redirectResponse = NextResponse.redirect(homeUrl);
//         redirectResponse.headers.set('access_token', 'no-cache');
//         return redirectResponse;
//     }

//     console.log('Token found, allowing access');
//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/dashboard/:path*', '/checkout/:path*', '/orders/:path*', '/courses/:path*/learn']
// };

// middleware.ts (App Router - using API route)
// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(req: NextRequest) {
//     const secret = process.env.NEXTAUTH_SECRET;
//     const socialToken = await getToken({ req, secret });
//     const url = req.nextUrl.clone(); // Clone for modification
//     console.log('urlurl', url.origin);

//     // If next-auth token is present, allow access
//     if (socialToken) {
//         return NextResponse.next();
//     }

//     // If no social token, check with our API route
//     if (url.pathname.match(/\/dashboard|\/checkout|\/orders|\/courses\/.+\/learn/)) {
//         try {
//             const authRes = await fetch(`${url.origin}/api/auth/check`); // Use url.origin
//             const authData = await authRes.json();

//             if (!authData.authenticated) {
//                 console.log('Not authenticated, redirecting to home page');
//                 url.pathname = '/'; // Redirect to home
//                 return NextResponse.redirect(url);
//             }
//         } catch (error) {
//             console.error('Error checking authentication in middleware:', error);
//             url.pathname = '/'; // Redirect to home on error
//             return NextResponse.redirect(url);
//         }
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/dashboard/:path*', '/checkout/:path*', '/orders/:path*', '/courses/:path*/learn']
// };

// middleware.ts (App Router - with detailed logging)
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET;
    const socialToken = await getToken({ req, secret });
    const url = req.nextUrl.clone();

    console.log('--- Middleware Start ---');
    console.log('Request URL:', url.pathname);
    console.log('Cookies (from request):', req.cookies.getAll()); // Log *all* cookies

    if (socialToken) {
        console.log('Social Token Present, allowing access');
        console.log('--- Middleware End (Social Token) ---');
        return NextResponse.next();
    }

    if (url.pathname.match(/\/dashboard|\/checkout|\/orders|\/courses\/.+\/learn/)) {
        try {
            console.log('Checking authentication with API route...');
            const authRes = await fetch(`${url.origin}/api/auth/check`, {
                credentials: 'include',
                headers: {
                    // FORWARD THE COOKIES! This is the key.
                    Cookie: req.headers.get('cookie') || '' // Forward cookies (App Router way)
                }
            });
            console.log('API Response Status:', authRes.status);
            const authData = await authRes.json();
            console.log('API Response Data:', authData);

            if (!authData.authenticated) {
                console.log('Not authenticated, redirecting to home page');
                url.pathname = '/';
                console.log('--- Middleware End (Redirect) ---');
                return NextResponse.redirect(url);
            } else {
                console.log('Authenticated, allowing access');
                console.log('--- Middleware End (Authenticated) ---');
                return NextResponse.next();
            }
        } catch (error) {
            console.error('Error checking authentication in middleware:', error);
            url.pathname = '/';
            console.log('--- Middleware End (Error) ---');
            return NextResponse.redirect(url);
        }
    }

    console.log('--- Middleware End (No Match) ---');
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/checkout/:path*', '/orders/:path*', '/courses/:path*/learn']
};
