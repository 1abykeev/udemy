import Link from "next/link";
import { prisma } from "@/lib/prisma";

const categoryIcons: Record<string, string> = {
  "Разработка": "💻",
  "Бизнес": "📈",
  "Финансы": "💰",
  "IT и ПО": "🖥️",
  "Дизайн": "🎨",
  "Маркетинг": "📣",
  "Личностный рост": "🧠",
  "Фотография": "📷",
  "Анализ данных": "📊",
};

export default async function Categories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <section className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-[1340px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Изучайте по категориям</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg hover:border-[#a435f0] hover:shadow-md transition-all cursor-pointer"
            >
              <span className="text-3xl mb-2">{categoryIcons[cat.name] ?? "📚"}</span>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-[#a435f0] transition-colors leading-tight">
                {cat.name}
              </span>
              <span className="text-xs text-gray-500 mt-1">{cat._count.courses} курсов</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
