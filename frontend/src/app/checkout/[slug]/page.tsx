"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export default function CheckoutPage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [error, setError] = useState("");

  function formatCard(value: string) {
    return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    const digits = card.number.replace(/\s/g, "");
    if (digits.length < 16) { setError("Введите корректный номер карты"); return; }
    if (card.expiry.length < 5) { setError("Введите срок действия карты"); return; }
    if (card.cvv.length < 3) { setError("Введите CVV код"); return; }
    if (!card.name.trim()) { setError("Введите имя держателя карты"); return; }

    setError("");
    setLoading(true);

    const { slug } = await params;
    const res = await fetch(`/api/checkout/${slug}`, { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      router.push(`/learn/${slug}/1`);
    } else {
      setError(data.error ?? "Ошибка оплаты");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/courses" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-6">
          ← Назад к курсам
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Оплата курса</h1>
          <p className="text-gray-500 text-sm mb-6">Безопасная оплата через защищённое соединение</p>

          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Номер карты</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0] tracking-widest"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Срок действия</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="•••"
                  maxLength={3}
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя держателя карты</label>
              <input
                type="text"
                placeholder="IVAN IVANOV"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0] uppercase"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#a435f0] hover:bg-[#8710d8] disabled:opacity-60 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? "Обработка платежа..." : "Оплатить"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Защищено SSL-шифрованием
          </div>
        </div>
      </div>
    </div>
  );
}
