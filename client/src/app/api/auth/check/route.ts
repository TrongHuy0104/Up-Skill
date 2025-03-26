// app/api/auth/check/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        console.log('Cookies being forwarded:', req.cookies);

        // Forward the request to your backend's protected endpoint
        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/user/me`, {
            credentials: 'include',
            headers: {
                // FORWARD THE COOKIES! This is the key.
                Cookie: req.headers.get('cookie') || '' // Forward cookies (App Router way)
            }
        });

        console.log('Backend Response Status (from /api/auth/check):', backendRes.status); // Add this log

        if (backendRes.ok) {
            // Backend says user is authenticated
            return NextResponse.json({ authenticated: true });
        } else {
            // Backend says user is NOT authenticated
            return NextResponse.json({ authenticated: false }, { status: 401 }); // Set status explicitly
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return NextResponse.json({ authenticated: false }, { status: 500 }); // Set status explicitly
    }
}
