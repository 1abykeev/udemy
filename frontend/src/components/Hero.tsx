"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const popularTags = ["Python", "Веб-разработка", "UI/UX Дизайн", "Анализ данных"];

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/courses");
    }
  }

  return (
    <section className="relative bg-gradient-to-r from-[#1c1d1f] via-[#2d2f31] to-[#3e4143] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-[#a435f0] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-[1340px] mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Учитесь без<br />ограничений
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Более 10 000 курсов от лучших преподавателей. Начните обучение сегодня и откройте новые возможности.
          </p>
          <form onSubmit={handleSearch} className="flex bg-white rounded overflow-hidden shadow-lg max-w-lg">
            <input
              type="text"
              placeholder="Чему хотите научиться?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3.5 text-sm text-gray-800 outline-none"
            />
            <button type="submit" className="px-6 py-3.5 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold text-sm transition-colors whitespace-nowrap">
              Найти
            </button>
          </form>
          <p className="text-gray-400 text-sm mt-4">
            Популярно:{" "}
            {popularTags.map((tag) => (
              <Link
                key={tag}
                href={`/courses?q=${encodeURIComponent(tag)}`}
                className="underline hover:text-white transition-colors mr-2"
              >
                {tag}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
