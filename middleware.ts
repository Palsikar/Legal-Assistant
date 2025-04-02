import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the request is for the API
  if (path.startsWith("/api/")) {
    // Clone the request headers
    const requestHeaders = new Headers(request.headers)

    // Add CORS headers to the response
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/:path*"],
}

