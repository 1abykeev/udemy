import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { markChapterComplete } from "@/app/actions/courses";

type Props = { params: Promise<{ courseSlug: string; chapterPosition: string }> };

export default async function LearnPage({ params }: Props) {
  const { courseSlug, chapterPosition } = await params;
  const position = parseInt(chapterPosition, 10);
  const session = await getSession();
  if (!session) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
      instructor: { select: { name: true } },
    },
  });

  if (!course) notFound();

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId: course.id } },
  });

  if (!enrollment) redirect(`/courses/${courseSlug}`);

  const chapter = course.chapters.find((c) => c.position === position);
  if (!chapter) notFound();

  const progress = await prisma.userProgress.findUnique({
    where: { userId_chapterId: { userId: session.id, chapterId: chapter.id } },
  });

  const allProgress = await prisma.userProgress.findMany({
    where: { userId: session.id, chapterId: { in: course.chapters.map((c) => c.id) } },
  });

  const completedIds = new Set(allProgress.filter((p) => p.isCompleted).map((p) => p.chapterId));
  const isCompleted = !!progress?.isCompleted;
  const prevChapter = course.chapters.find((c) => c.position === position - 1);
  const nextChapter = course.chapters.find((c) => c.position === position + 1);

  const markAction = markChapterComplete.bind(null, chapter.id, courseSlug, position, !isCompleted);

  return (
    <div className="flex h-screen bg-[#1c1d1f] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#2d2f31] flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <Link href={`/courses/${courseSlug}`} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2">
            ← К курсу
          </Link>
          <h2 className="text-sm font-bold text-white leading-snug">{course.title}</h2>
          <p className="text-xs text-gray-400 mt-1">
            {completedIds.size} / {course.chapters.length} уроков
          </p>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#a435f0] rounded-full transition-all"
              style={{ width: `${(completedIds.size / course.chapters.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex-1">
          {course.chapters.map((ch) => (
            <Link
              key={ch.id}
              href={`/learn/${courseSlug}/${ch.position}`}
              className={`flex items-start gap-3 px-4 py-3 border-b border-gray-700 hover:bg-gray-700 transition-colors ${ch.position === position ? "bg-gray-700 border-l-2 border-l-[#a435f0]" : ""}`}
            >
              <span className="mt-0.5 flex-shrink-0">
                {completedIds.has(ch.id) ? (
                  <span className="w-5 h-5 rounded-full bg-[#a435f0] flex items-center justify-center text-white text-xs">✓</span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center">
                    {ch.type === "VIDEO" ? (
                      <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <span className="text-gray-400 text-xs">A</span>
                    )}
                  </span>
                )}
              </span>
              <span className={`text-xs leading-snug ${ch.position === position ? "text-white font-medium" : "text-gray-400"}`}>
                {ch.title}
              </span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        {/* Top bar */}
        <div className="bg-[#1c1d1f] px-6 py-3 flex items-center justify-between flex-shrink-0">
          <span className="text-sm text-gray-300">{chapter.title}</span>
          <form action={markAction}>
            <button
              type="submit"
              className={`flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                isCompleted
                  ? "bg-[#a435f0] text-white"
                  : "border border-gray-500 text-gray-300 hover:border-white hover:text-white"
              }`}
            >
              {isCompleted ? "✓ Выполнено" : "Отметить выполненным"}
            </button>
          </form>
        </div>

        {/* Content area */}
        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
          {chapter.type === "VIDEO" ? (
            <div className="mb-8">
              {chapter.videoUrl ? (
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <video
                    key={chapter.videoUrl}
                    controls
                    className="w-full h-full"
                    preload="metadata"
                  >
                    <source src={chapter.videoUrl} />
                    Ваш браузер не поддерживает видео.
                  </video>
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400">Видео ещё не добавлено</p>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 prose prose-sm max-w-none">
              {chapter.content ? (
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">
                  {chapter.content}
                </div>
              ) : (
                <p className="text-gray-400">Содержание ещё не добавлено</p>
              )}
            </div>
          )}

          {/* Chapter header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{chapter.title}</h1>
          {chapter.description && (
            <p className="text-gray-600 mb-6">{chapter.description}</p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            {prevChapter ? (
              <Link
                href={`/learn/${courseSlug}/${prevChapter.position}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#a435f0] transition-colors"
              >
                ← {prevChapter.title}
              </Link>
            ) : (
              <span />
            )}
            {nextChapter ? (
              <Link
                href={`/learn/${courseSlug}/${nextChapter.position}`}
                className="flex items-center gap-2 text-sm font-medium text-[#a435f0] hover:text-[#8710d8] transition-colors"
              >
                {nextChapter.title} →
              </Link>
            ) : (
              <Link
                href={`/courses/${courseSlug}`}
                className="text-sm font-medium text-[#a435f0] hover:underline"
              >
                Завершить курс →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
