import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // List of protected routes
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];

    // Check if the route is protected
    if (protectedRoutes.includes(pathname)) {
        // Fetch the user token (e.g., using NextAuth.js)
        const normalToken = req.cookies.get('access_token')?.value; // Adjust based on your auth system

        const secret = process.env.NEXTAUTH_SECRET;
        const socialToken = await getToken({ req, secret });

        // If the user is not logged in, redirect to the home page with a query parameter to open the modal
        if (!normalToken && !socialToken) {
            const homeUrl = new URL('/', req.url);
            // homeUrl.searchParams.set('showLoginModal', 'true'); // Add a query parameter to trigger the modal
            return NextResponse.redirect(homeUrl);
        } else if (!socialToken) {
        }
    }

    // Allow the request to continue if the user is logged in or the route is not protected
    return NextResponse.next();
}
