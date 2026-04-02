import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createChapter, reorderChapter, deleteChapter } from "@/app/actions/instructor";
import Navbar from "@/components/Navbar";
import ConfirmButton from "@/components/ConfirmButton";

type Props = { params: Promise<{ courseId: string }> };

export default async function ChaptersPage({ params }: Props) {
  const { courseId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: courseId, instructorId: session.id },
    include: {
      chapters: { orderBy: { position: "asc" } },
    },
  });

  if (!course) notFound();

  const addChapterAction = createChapter.bind(null, courseId);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link href={`/instructor/courses/${courseId}`} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
              ← {course.title}
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">Уроки курса</h1>

            {/* Chapter list */}
            {course.chapters.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Уроков пока нет. Добавьте первый урок ниже.</p>
            ) : (
              <div className="space-y-2 mb-8">
                {course.chapters.map((chapter, idx) => {
                  const moveUpAction = reorderChapter.bind(null, chapter.id, courseId, "up");
                  const moveDownAction = reorderChapter.bind(null, chapter.id, courseId, "down");
                  const deleteAction = deleteChapter.bind(null, chapter.id, courseId);

                  return (
                    <div key={chapter.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                      <span className="text-lg flex-shrink-0">
                        {chapter.type === "VIDEO" ? "🎬" : "📄"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 truncate">{chapter.title}</span>
                          {chapter.isPublished ? (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex-shrink-0">Опубликован</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full flex-shrink-0">Черновик</span>
                          )}
                          {chapter.isFree && (
                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full flex-shrink-0">Бесплатно</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{chapter.type === "VIDEO" ? "Видеоурок" : "Статья"}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <form action={moveUpAction}>
                          <button type="submit" disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors" title="Вверх">↑</button>
                        </form>
                        <form action={moveDownAction}>
                          <button type="submit" disabled={idx === course.chapters.length - 1} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors" title="Вниз">↓</button>
                        </form>
                        <Link
                          href={`/instructor/courses/${courseId}/chapters/${chapter.id}`}
                          className="p-1.5 text-gray-400 hover:text-[#a435f0] transition-colors text-xs font-medium"
                        >
                          Изменить
                        </Link>
                        <form action={deleteAction}>
                          <ConfirmButton
                            message="Удалить урок?"
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            ✕
                          </ConfirmButton>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add chapter form */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-sm font-bold text-gray-700 mb-4">Добавить урок</h2>
              <form action={addChapterAction} className="flex gap-3">
                <input
                  name="title"
                  required
                  placeholder="Название урока"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
                />
                <select
                  name="type"
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#a435f0] bg-white"
                >
                  <option value="VIDEO">🎬 Видео</option>
                  <option value="ARTICLE">📄 Статья</option>
                </select>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#a435f0] hover:bg-[#8710d8] text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Добавить
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
