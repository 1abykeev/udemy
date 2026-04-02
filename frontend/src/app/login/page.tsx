"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#a435f0]">
            Устад
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Вход в аккаунт</h1>
          <p className="text-gray-500 text-sm mt-1">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-[#a435f0] hover:underline font-medium">
              Зарегистрироваться
            </Link>
          </p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-[#a435f0] hover:bg-[#8710d8] disabled:opacity-60 text-white font-bold rounded-lg transition-colors text-sm"
          >
            {pending ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
