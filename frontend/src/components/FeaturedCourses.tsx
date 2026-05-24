import Link from "next/link";
import { prisma } from "@/lib/prisma";

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-[#e59819]" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function FeaturedCourses() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true } },
      category: { select: { name: true } },
      _count: { select: { enrollments: true, reviews: true, chapters: true } },
      reviews: { select: { rating: true } },
    },
  });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1340px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Популярные курсы</h2>
          <Link href="/courses" className="text-sm font-bold text-[#a435f0] hover:text-[#8710d8] transition-colors">
            Все курсы →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => {
            const avgRating = course.reviews.length
              ? course.reviews.reduce((s, r) => s + r.rating, 0) / course.reviews.length
              : 0;

            return (
              <Link key={course.id} href={`/courses/${course.slug}`} className="group cursor-pointer">
                <div className={`relative w-full aspect-video rounded-lg overflow-hidden mb-3 ${gradients[i % gradients.length]} flex items-center justify-center`}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {i < 3 && (
                    <span className="absolute top-2 left-2 bg-[#eceb98] text-[#3d3c0a] text-xs font-bold px-2 py-0.5 rounded">
                      Популярное
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-[#a435f0] transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">{course.instructor.name}</p>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-bold text-[#b4690e]">{avgRating.toFixed(1)}</span>
                      <StarRating rating={avgRating} />
                      <span className="text-xs text-gray-500">({course._count.reviews})</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mb-2">
                    {course._count.chapters} уроков • {course.category?.name ?? ""}
                  </p>
                  <span className="text-sm font-bold text-[#a435f0]">Бесплатно</span>
                  <span className="text-xs text-gray-500 ml-2">{course._count.enrollments} студентов</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
