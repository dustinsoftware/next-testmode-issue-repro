import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Skip validation for health check endpoints
    if (request.nextUrl.pathname.startsWith('/api/health')) {
      return NextResponse.next();
    }

    const oloRequestHeader = request.headers.get('fetch-request');

    if (oloRequestHeader !== '1') {
      // Reject the request if the header is missing or has the wrong value
      return new NextResponse(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Missing or invalid fetch-request header',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // Continue with the request if validation passes
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/api/:path*',
  runtime: 'nodejs',
};
