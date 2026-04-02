import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const gradients = [
  "bg-gradient-to-br from-blue-500 to-indigo-700",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-orange-400 to-red-500",
  "bg-gradient-to-br from-yellow-400 to-orange-500",
  "bg-gradient-to-br from-green-500 to-teal-600",
  "bg-gradient-to-br from-purple-500 to-violet-700",
  "bg-gradient-to-br from-slate-500 to-gray-700",
];

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function CoursesPage({ searchParams }: Props) {
  const { q, category } = await searchParams;

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      ...(category ? { category: { name: category } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true } },
      category: { select: { name: true } },
      _count: { select: { enrollments: true, chapters: true, reviews: true } },
      reviews: { select: { rating: true } },
    },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#1c1d1f] py-10">
          <div className="max-w-[1340px] mx-auto px-4">
            <h1 className="text-3xl font-bold text-white mb-2">Все курсы</h1>
            <p className="text-gray-400">Найдено: {courses.length} курсов</p>
          </div>
        </div>

        <div className="max-w-[1340px] mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/courses"
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                !category ? "bg-[#a435f0] text-white border-[#a435f0]" : "border-gray-300 text-gray-700 hover:border-[#a435f0] hover:text-[#a435f0]"
              }`}
            >
              Все
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/courses?category=${encodeURIComponent(cat.name)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  category === cat.name ? "bg-[#a435f0] text-white border-[#a435f0]" : "border-gray-300 text-gray-700 hover:border-[#a435f0] hover:text-[#a435f0]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Search info */}
          {q && (
            <p className="text-gray-600 mb-6">
              Результаты поиска по запросу: <strong>&ldquo;{q}&rdquo;</strong>
              {" — "}
              <Link href="/courses" className="text-[#a435f0] hover:underline">сбросить</Link>
            </p>
          )}

          {/* Grid */}
          {courses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400 mb-4">Курсы не найдены</p>
              <Link href="/courses" className="text-[#a435f0] hover:underline">Показать все курсы</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course, i) => {
                const avgRating = course.reviews.length
                  ? course.reviews.reduce((s, r) => s + r.rating, 0) / course.reviews.length
                  : 0;

                return (
                  <Link key={course.id} href={`/courses/${course.slug}`} className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className={`w-full aspect-video ${gradients[i % gradients.length]} flex items-center justify-center`}>
                      <svg className="w-12 h-12 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-[#a435f0] transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{course.instructor.name}</p>
                      {avgRating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-xs font-bold text-[#b4690e]">{avgRating.toFixed(1)}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <svg key={s} className={`w-3 h-3 ${s <= Math.round(avgRating) ? "text-[#e59819]" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{course._count.chapters} уроков</span>
                        <span className="text-sm font-bold text-[#a435f0]">Бесплатно</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
