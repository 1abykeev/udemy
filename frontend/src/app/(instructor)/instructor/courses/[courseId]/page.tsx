import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { updateCourse, toggleCoursePublish, deleteCourse } from "@/app/actions/instructor";
import Navbar from "@/components/Navbar";
import ConfirmButton from "@/components/ConfirmButton";

type Props = { params: Promise<{ courseId: string }> };

export default async function EditCoursePage({ params }: Props) {
  const { courseId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const [course, categories] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId, instructorId: session.id },
      include: { category: true, _count: { select: { enrollments: true, chapters: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!course) notFound();

  const updateAction = updateCourse.bind(null, courseId);
  const publishAction = toggleCoursePublish.bind(null, courseId, !course.isPublished);
  const deleteAction = deleteCourse.bind(null, courseId);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link href="/instructor/dashboard" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
              ← Назад
            </Link>
            <div className="flex gap-2">
              <Link
                href={`/instructor/courses/${courseId}/chapters`}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:border-[#a435f0] hover:text-[#a435f0] transition-colors"
              >
                Управление уроками
              </Link>
              <form action={publishAction}>
                <button
                  type="submit"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    course.isPublished
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {course.isPublished ? "Снять с публикации" : "Опубликовать"}
                </button>
              </form>
            </div>
          </div>

          {/* Status banner */}
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${course.isPublished ? "bg-green-50 text-green-700 border border-green-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}>
            <span>{course.isPublished ? "✓ Курс опубликован" : "⚠ Черновик — курс не виден студентам"}</span>
            <span className="ml-auto">{course._count.chapters} уроков • {course._count.enrollments} студентов</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактировать курс</h1>

            <form action={updateAction} className="space-y-5" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input
                  name="title"
                  defaultValue={course.title}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  name="description"
                  defaultValue={course.description}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  name="categoryId"
                  defaultValue={course.categoryId ?? ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] bg-white"
                >
                  <option value="">Без категории</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Обложка курса (необязательно)</label>
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt="Обложка"
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-gray-200"
                  />
                )}
                <input
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#a435f0] file:text-white hover:file:bg-[#8710d8] cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — рекомендуется 1280×720</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-lg transition-colors"
              >
                Сохранить изменения
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-red-600 mb-3">Опасная зона</h3>
              <form action={deleteAction}>
                <ConfirmButton
                  message="Удалить курс? Это действие необратимо."
                  className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Удалить курс
                </ConfirmButton>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
