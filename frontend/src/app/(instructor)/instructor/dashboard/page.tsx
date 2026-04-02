import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function InstructorDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const courses = await prisma.course.findMany({
    where: { instructorId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true, chapters: true } },
      category: { select: { name: true } },
    },
  });

  const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0);
  const publishedCount = courses.filter((c) => c.isPublished).length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-[1340px] mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Кабинет преподавателя</h1>
              <p className="text-gray-500 mt-1">Добро пожаловать, {session.name}</p>
            </div>
            <Link
              href="/instructor/courses/new"
              className="px-5 py-3 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-lg transition-colors text-sm"
            >
              + Создать курс
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Всего курсов", value: courses.length },
              { label: "Опубликовано", value: publishedCount },
              { label: "Студентов", value: totalStudents },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Courses list */}
          {courses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <p className="text-4xl mb-4">🎓</p>
              <h2 className="text-xl font-bold text-gray-900 mb-2">У вас ещё нет курсов</h2>
              <p className="text-gray-500 mb-6">Создайте первый курс и поделитесь своими знаниями</p>
              <Link
                href="/instructor/courses/new"
                className="inline-block px-6 py-3 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-lg transition-colors"
              >
                Создать курс
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Мои курсы</h2>
              {courses.map((course) => (
                <div key={course.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{course.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${course.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {course.isPublished ? "Опубликован" : "Черновик"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {course.category?.name ?? "Без категории"} •{" "}
                      {course._count.chapters} уроков •{" "}
                      {course._count.enrollments} студентов
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/instructor/courses/${course.id}/chapters`}
                      className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:border-[#a435f0] hover:text-[#a435f0] transition-colors"
                    >
                      Уроки
                    </Link>
                    <Link
                      href={`/instructor/courses/${course.id}`}
                      className="px-4 py-2 text-sm bg-[#a435f0] hover:bg-[#8710d8] text-white font-medium rounded-lg transition-colors"
                    >
                      Редактировать
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
