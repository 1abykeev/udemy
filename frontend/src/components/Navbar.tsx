import Link from "next/link";
import { getSession } from "@/lib/session";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1340px] mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="text-2xl font-bold text-[#a435f0]">Устад</span>
        </Link>

        {/* Categories */}
        <Link
          href="/courses"
          className="hidden lg:block flex-shrink-0 text-sm font-medium text-gray-800 hover:text-[#a435f0] transition-colors whitespace-nowrap"
        >
          Курсы
        </Link>

        {/* Search bar */}
        <NavbarClient />

        {/* Right nav */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0 ml-auto">
          {session ? (
            <>
              {session.role === "INSTRUCTOR" ? (
                <Link
                  href="/instructor/dashboard"
                  className="text-sm font-medium text-gray-800 hover:text-[#a435f0] transition-colors"
                >
                  Мои курсы
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-800 hover:text-[#a435f0] transition-colors"
                >
                  Моё обучение
                </Link>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#a435f0] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {session.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700">{session.name}</span>
              </div>
              <form
                action={async () => {
                  "use server";
                  const { logout } = await import("@/app/actions/auth");
                  await logout();
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="text-sm font-medium text-gray-800 hover:text-[#a435f0] transition-colors whitespace-nowrap"
              >
                Стать преподавателем
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-bold border border-gray-800 text-gray-800 hover:bg-gray-100 transition-colors rounded"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-bold bg-gray-900 text-white hover:bg-gray-700 transition-colors rounded"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden ml-auto p-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
