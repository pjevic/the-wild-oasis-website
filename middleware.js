/** @format */

// import { NextResponse } from "next/server";

// Read and set cookies and headers
// --> authentication, authorization
// --> Server-side analytics
// --> Redirect based on geolocatio
// --> A/B testing ...
// Middleware needs to produce a response

// export function middleware(request) {
//   console.log(request);

//   return NextResponse.redirect(new URL("/about", request.url));
// }

import { auth } from "@/app/_lib/auth";

export const middleware = auth;

export const config = {
  matcher: ["/account"],
};
