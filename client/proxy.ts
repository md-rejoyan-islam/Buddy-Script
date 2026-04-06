import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getMe } from "./app/actions/auth";
import { deleteAuthCookies } from "./lib/api";

const protectedRoutes = ["/", "/feed"];
const authRoutes = ["/login", "/registration"];

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  if (token) {
    const user = await getMe();
    if (!user.success) {
      await deleteAuthCookies();
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If user is on a protected route without a token → redirect to login
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is on auth routes with a token → redirect to home
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/feed",
    "/login",
    "/registration",
    "/((?!_next/static|_next/image|.*\\.png$).*)",
  ],
};
