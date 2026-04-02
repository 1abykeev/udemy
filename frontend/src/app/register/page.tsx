"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { register } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined);
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#a435f0]">
            Устад
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Создать аккаунт</h1>
          <p className="text-gray-500 text-sm mt-1">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-[#a435f0] hover:underline font-medium">
              Войти
            </Link>
          </p>
        </div>

        {/* Role toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              role === "STUDENT"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Я студент
          </button>
          <button
            type="button"
            onClick={() => setRole("INSTRUCTOR")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              role === "INSTRUCTOR"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Я преподаватель
          </button>
        </div>

        <form action={action} className="space-y-4">
          <input type="hidden" name="role" value={role} />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ваше имя"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
            />
          </div>

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
              placeholder="Минимум 6 символов"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {state.error}
            </p>
          )}

          {role === "INSTRUCTOR" && (
            <p className="text-xs text-gray-500 bg-purple-50 border border-purple-100 rounded-lg px-4 py-2.5">
              Как преподаватель, вы сможете создавать и публиковать курсы на платформе.
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-[#a435f0] hover:bg-[#8710d8] disabled:opacity-60 text-white font-bold rounded-lg transition-colors text-sm"
          >
            {pending ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}
