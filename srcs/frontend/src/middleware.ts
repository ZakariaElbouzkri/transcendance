import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // Get the "refresh_token" from cookies
    const refreshToken = req.cookies.get('refresh_token')?.value;

    // Get the current URL path
    const { pathname } = req.nextUrl;

    // If there is a refresh token and user is trying to access signup or signin, redirect to /users/home
    if (refreshToken && (pathname.startsWith('/auth/signup') || pathname.startsWith('/auth/signin'))) {
        return NextResponse.redirect(new URL('/users/home', req.url));
    }

    // If there is no refresh token and user is trying to access /users/home, redirect to /auth/signin
    if (!refreshToken && pathname.startsWith('/users/home')) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Otherwise, let the request continue
    return NextResponse.next();
}

// Apply this middleware to the specific routes
export const config = {
    matcher: ['/auth/signup', '/auth/signin', '/users/home'],  // Check these routes
};
