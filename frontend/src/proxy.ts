import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const studentRoutes = ["/dashboard", "/learn"];
const instructorRoutes = ["/instructor"];
const authRoutes = ["/login", "/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = req.cookies.get("session")?.value;
  const session = token ? await decrypt(token) : null;

  const isStudentRoute = studentRoutes.some((r) => path.startsWith(r));
  const isInstructorRoute = instructorRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));

  // Redirect unauthenticated users away from protected routes
  if ((isStudentRoute || isInstructorRoute) && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Students can't access instructor routes
  if (isInstructorRoute && session?.role !== "INSTRUCTOR") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Instructors going to /dashboard → instructor dashboard
  if (path === "/dashboard" && session?.role === "INSTRUCTOR") {
    return NextResponse.redirect(new URL("/instructor/dashboard", req.nextUrl));
  }

  // Logged-in users don't need auth pages
  if (isAuthRoute && session) {
    if (session.role === "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/instructor/dashboard", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
