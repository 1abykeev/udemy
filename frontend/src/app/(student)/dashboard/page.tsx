import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";

const gradients = [
  "bg-gradient-to-br from-blue-500 to-indigo-700",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-orange-400 to-red-500",
  "bg-gradient-to-br from-yellow-400 to-orange-500",
  "bg-gradient-to-br from-green-500 to-teal-600",
];

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          chapters: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
            select: { id: true, position: true, title: true },
          },
          reviews: { where: { userId: session.id } },
        },
      },
    },
  });

  const allChapterIds = enrollments.flatMap((e) => e.course.chapters.map((c) => c.id));
  const allProgress = await prisma.userProgress.findMany({
    where: { userId: session.id, chapterId: { in: allChapterIds } },
  });
  const completedSet = new Set(allProgress.filter((p) => p.isCompleted).map((p) => p.chapterId));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-[1340px] mx-auto px-4 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Моё обучение</h1>
            <p className="text-gray-500 mt-1">Привет, {session.name}! Продолжайте обучение.</p>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <p className="text-4xl mb-4">📚</p>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Вы ещё не записаны ни на один курс</h2>
              <p className="text-gray-500 mb-6">Найдите интересный курс и начните обучение прямо сейчас</p>
              <Link
                href="/courses"
                className="inline-block px-6 py-3 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-lg transition-colors"
              >
                Найти курсы
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.map((enrollment, i) => {
                const { course } = enrollment;
                const totalChapters = course.chapters.length;
                const completed = course.chapters.filter((c) => completedSet.has(c.id)).length;
                const pct = totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0;
                const nextChapter = course.chapters.find((c) => !completedSet.has(c.id)) ?? course.chapters[0];
                const userReview = course.reviews[0];

                return (
                  <div key={enrollment.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`w-full h-24 ${gradients[i % gradients.length]} flex items-center justify-center`}>
                      <svg className="w-10 h-10 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-1 leading-snug">{course.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{course.instructor.name}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{completed} из {totalChapters} уроков</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#a435f0] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {nextChapter && (
                          <Link
                            href={`/learn/${course.slug}/${nextChapter.position}`}
                            className="flex-1 py-2.5 bg-[#a435f0] hover:bg-[#8710d8] text-white text-sm font-bold rounded-lg text-center transition-colors"
                          >
                            {pct === 0 ? "Начать" : pct === 100 ? "Повторить" : "Продолжить"}
                          </Link>
                        )}
                        <Link
                          href={`/courses/${course.slug}`}
                          className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-[#a435f0] hover:text-[#a435f0] transition-colors"
                        >
                          О курсе
                        </Link>
                      </div>

                      {/* Review section */}
                      {pct > 0 && !userReview && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <ReviewForm courseId={course.id} courseSlug={course.slug} />
                        </div>
                      )}
                      {userReview && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Ваша оценка:{" "}
                            {"★".repeat(userReview.rating)}{"☆".repeat(5 - userReview.rating)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
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
