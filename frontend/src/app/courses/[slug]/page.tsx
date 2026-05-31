import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { enrollInCourse } from "@/app/actions/courses";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await getSession();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true, id: true } },
      category: { select: { name: true } },
      chapters: {
        orderBy: { position: "asc" },
        select: { id: true, title: true, type: true, position: true, isFree: true },
      },
      _count: { select: { enrollments: true } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!course) notFound();

  const enrollment = session
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.id, courseId: course.id } },
      })
    : null;

  const isEnrolled = !!enrollment;
  const avgRating = course.reviews.length
    ? course.reviews.reduce((s, r) => s + r.rating, 0) / course.reviews.length
    : 0;

  const enrollAction = enrollInCourse.bind(null, course.id, course.slug);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className="bg-[#1c1d1f] py-10">
          <div className="max-w-[1340px] mx-auto px-4 flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              {course.category && (
                <Link
                  href={`/courses?category=${encodeURIComponent(course.category.name)}`}
                  className="text-sm text-purple-400 hover:underline mb-2 block"
                >
                  {course.category.name}
                </Link>
              )}
              <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{course.title}</h1>
              <p className="text-gray-300 mb-4 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {avgRating > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="text-[#e59819] font-bold">{avgRating.toFixed(1)} ★</span>
                    <span>({course.reviews.length} отзывов)</span>
                  </span>
                )}
                <span>{course._count.enrollments} студентов</span>
                <span>Преподаватель: <strong className="text-white">{course.instructor.name}</strong></span>
              </div>
            </div>

            {/* Enroll card */}
            <div className="w-full lg:w-80 bg-white rounded-xl p-6 shadow-xl flex-shrink-0">
              <div className="w-full aspect-video bg-gradient-to-br from-purple-500 to-indigo-700 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-white opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {course.price > 0 ? `${course.price.toLocaleString("ky-KG")} сом` : "Бесплатно"}
              </p>
              <p className="text-sm text-gray-500 mb-4">{course.chapters.length} уроков</p>

              {isEnrolled ? (
                <Link
                  href={`/learn/${course.slug}/1`}
                  className="block w-full py-3 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-lg text-center transition-colors"
                >
                  Продолжить обучение →
                </Link>
              ) : session ? (
                course.price > 0 ? (
                  <Link
                    href={`/checkout/${course.slug}`}
                    className="block w-full py-3 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-lg text-center transition-colors"
                  >
                    Купить курс
                  </Link>
                ) : (
                  <form action={enrollAction}>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-lg transition-colors"
                    >
                      Записаться бесплатно
                    </button>
                  </form>
                )
              ) : (
                <Link
                  href="/login"
                  className="block w-full py-3 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-lg text-center transition-colors"
                >
                  Войдите чтобы записаться
                </Link>
              )}

              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Полный доступ к {course.chapters.length} урокам
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Видео и текстовые материалы
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Доступ с любого устройства
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1340px] mx-auto px-4 py-10">
          <div className="max-w-3xl">
            {/* Syllabus */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">Программа курса</h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-10">
              {course.chapters.map((chapter, idx) => (
                <div
                  key={chapter.id}
                  className={`flex items-center gap-4 px-5 py-4 ${idx !== course.chapters.length - 1 ? "border-b border-gray-100" : ""} ${isEnrolled || chapter.isFree ? "bg-white" : "bg-gray-50"}`}
                >
                  <span className="text-lg flex-shrink-0">
                    {chapter.type === "VIDEO" ? "🎬" : "📄"}
                  </span>
                  <span className="flex-1 text-sm text-gray-800">{chapter.title}</span>
                  {isEnrolled || chapter.isFree ? (
                    <Link
                      href={`/learn/${course.slug}/${chapter.position}`}
                      className="text-xs text-[#a435f0] font-medium hover:underline flex-shrink-0"
                    >
                      {chapter.isFree && !isEnrolled ? "Бесплатный просмотр" : "Смотреть"}
                    </Link>
                  ) : (
                    <span className="text-gray-400 flex-shrink-0">🔒</span>
                  )}
                </div>
              ))}
            </div>

            {/* Reviews */}
            <ReviewSection
              courseId={course.id}
              courseSlug={course.slug}
              initialReviews={course.reviews.map((r) => ({
                id: r.id,
                userId: r.userId,
                rating: r.rating,
                comment: r.comment,
                user: r.user,
              }))}
              isEnrolled={isEnrolled}
              currentUserId={session?.id}
              currentUserName={session?.name}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
