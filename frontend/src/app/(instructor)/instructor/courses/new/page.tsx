"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCourse } from "@/app/actions/instructor";

export default function NewCoursePage() {
  const [state, action, pending] = useActionState(createCourse, undefined);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/instructor/dashboard" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            ← Назад к курсам
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Новый курс</h1>

          <form action={action} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название курса <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                placeholder="Например: Python с нуля до профессионала"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Расскажите, чему научатся студенты на вашем курсе..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена (сом) <span className="text-gray-400 font-normal">— 0 = бесплатно</span>
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="1"
                defaultValue="0"
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {state.error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={pending}
                className="flex-1 py-3 bg-[#a435f0] hover:bg-[#8710d8] disabled:opacity-60 text-white font-bold rounded-lg transition-colors"
              >
                {pending ? "Создаём..." : "Создать курс"}
              </button>
              <Link
                href="/instructor/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
