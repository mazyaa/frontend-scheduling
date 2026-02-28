import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { IJWTExtended } from "./types/Auth";

export const middleware = async (request: NextRequest) => {
  const token: IJWTExtended | null = await getToken({
    // getToken from next-auth/jwt to retrieve the JWT token from the request
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // if user has been authenticated and tries to access the login page, redirect them to the home page
  if (pathname === "/login" && token) {
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (token.role === "direktur") {
      return NextResponse.redirect(new URL("/direktur/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      const url = new URL("/login", request.url); // redirect to login page if user is not authenticated or does not have the admin role

      url.searchParams.set("callbackUrl", request.url); // set the callbackUrl after successful login

      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname.startsWith("/direktur")) {
    if (!token || token.role !== "direktur") {
      const url = new URL("/login", request.url); // redirect to login page if user is not authenticated or does not have the admin role

      url.searchParams.set("callbackUrl", request.url); // set the callbackUrl after successful login

      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/direktur") {
    return NextResponse.redirect(new URL("/direktur/dashboard", request.url));
  }
};

export const config = {
  matcher: ["/admin/:path*", "/direktur/:path*", "/login"],
};
