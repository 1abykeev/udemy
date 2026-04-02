"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavbarClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/courses?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
      <div className="flex items-center border border-gray-800 rounded-full overflow-hidden hover:border-[#a435f0] transition-colors">
        <button type="submit" className="px-4 py-2.5 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Найдите любой курс"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 py-2.5 pr-4 text-sm outline-none bg-white text-gray-800 placeholder-gray-400"
        />
      </div>
    </form>
  );
}
