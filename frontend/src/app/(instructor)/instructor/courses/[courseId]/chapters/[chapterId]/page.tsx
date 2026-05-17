import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { updateChapter } from "@/app/actions/instructor";
import Navbar from "@/components/Navbar";

type Props = { params: Promise<{ courseId: string; chapterId: string }> };

export default async function EditChapterPage({ params }: Props) {
  const { courseId, chapterId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: courseId, instructorId: session.id },
  });

  if (!course) notFound();

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId, courseId },
  });

  if (!chapter) notFound();

  const saveAction = updateChapter.bind(null, chapterId, courseId);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href={`/instructor/courses/${courseId}/chapters`}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
            >
              ← Назад к урокам
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{chapter.type === "VIDEO" ? "🎬" : "📄"}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{chapter.title}</h1>
                <p className="text-sm text-gray-500">{chapter.type === "VIDEO" ? "Видеоурок" : "Статья"}</p>
              </div>
            </div>

            <form action={saveAction} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название урока</label>
                <input
                  name="title"
                  defaultValue={chapter.title}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание (необязательно)</label>
                <input
                  name="description"
                  defaultValue={chapter.description ?? ""}
                  placeholder="Чему научатся студенты в этом уроке"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
                />
              </div>

              {chapter.type === "VIDEO" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL видео</label>
                  <input
                    name="videoUrl"
                    type="url"
                    defaultValue={chapter.videoUrl ?? ""}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0]"
                  />
                  <p className="text-xs text-gray-400 mt-1">YouTube ссылки (youtube.com/watch?v=...) и прямые MP4 ссылки</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Содержание статьи</label>
                  <textarea
                    name="content"
                    defaultValue={chapter.content ?? ""}
                    rows={12}
                    placeholder="Напишите содержание урока. Поддерживается Markdown: **жирный**, *курсив*, `код`, ## Заголовок"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#a435f0] focus:ring-1 focus:ring-[#a435f0] resize-none font-mono"
                  />
                </div>
              )}

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    defaultChecked={chapter.isPublished}
                    className="w-4 h-4 accent-[#a435f0]"
                  />
                  <span className="text-sm text-gray-700">Опубликовать урок</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFree"
                    defaultChecked={chapter.isFree}
                    className="w-4 h-4 accent-[#a435f0]"
                  />
                  <span className="text-sm text-gray-700">Бесплатный предпросмотр</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded-lg transition-colors"
              >
                Сохранить урок
              </button>
            </form>

            {/* Preview link */}
            {chapter.isPublished && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/learn/${course.slug}/${chapter.position}`}
                  target="_blank"
                  className="text-sm text-[#a435f0] hover:underline"
                >
                  Открыть урок →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
