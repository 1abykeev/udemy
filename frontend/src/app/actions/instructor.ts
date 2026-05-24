"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ChapterType } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function requireInstructor() {
  const session = await getSession();
  if (!session || session.role !== "INSTRUCTOR") redirect("/login");
  return session;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80) + "-" + Date.now().toString(36);
}

// ── Courses ──────────────────────────────────────────────

export async function createCourse(_state: { error?: string } | undefined, formData: FormData) {
  const session = await requireInstructor();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const categoryId = formData.get("categoryId") as string;
  const price = parseFloat(formData.get("price") as string) || 0;

  if (!title || !description) return { error: "Заполните название и описание" };

  const course = await prisma.course.create({
    data: {
      title,
      description,
      slug: slugify(title),
      instructorId: session.id,
      categoryId: categoryId || null,
      price: Math.max(0, price),
    },
  });

  redirect(`/instructor/courses/${course.id}`);
}

export async function updateCourse(courseId: string, formData: FormData) {
  const session = await requireInstructor();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const categoryId = formData.get("categoryId") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const thumbnailFile = formData.get("thumbnail") as File | null;

  if (!title || !description) return;

  let thumbnail: string | null | undefined = undefined;

  if (thumbnailFile && thumbnailFile.size > 0) {
    const bytes = await thumbnailFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = thumbnailFile.name.split(".").pop() ?? "jpg";
    const filename = `${courseId}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "courses");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);
    thumbnail = `/uploads/courses/${filename}`;
  }

  await prisma.course.update({
    where: { id: courseId, instructorId: session.id },
    data: {
      title,
      description,
      price: Math.max(0, price),
      categoryId: categoryId || null,
      ...(thumbnail !== undefined && { thumbnail }),
    },
  });

  revalidatePath(`/instructor/courses/${courseId}`);
  revalidatePath("/instructor/dashboard");
}

export async function toggleCoursePublish(courseId: string, isPublished: boolean) {
  const session = await requireInstructor();
  await prisma.course.update({
    where: { id: courseId, instructorId: session.id },
    data: { isPublished },
  });
  revalidatePath(`/instructor/courses/${courseId}`);
}

export async function deleteCourse(courseId: string) {
  const session = await requireInstructor();
  await prisma.course.delete({ where: { id: courseId, instructorId: session.id } });
  revalidatePath("/instructor/dashboard");
  redirect("/instructor/dashboard");
}

// ── Chapters ─────────────────────────────────────────────

export async function createChapter(courseId: string, formData: FormData) {
  const session = await requireInstructor();
  const title = (formData.get("title") as string)?.trim();
  const type = (formData.get("type") as string) === "ARTICLE" ? ChapterType.ARTICLE : ChapterType.VIDEO;

  if (!title) return;

  const lastChapter = await prisma.chapter.findFirst({
    where: { courseId },
    orderBy: { position: "desc" },
  });
  const position = (lastChapter?.position ?? 0) + 1;

  // Verify ownership
  await prisma.course.findFirstOrThrow({ where: { id: courseId, instructorId: session.id } });

  await prisma.chapter.create({
    data: { title, type, courseId, position },
  });

  revalidatePath(`/instructor/courses/${courseId}/chapters`);
}

export async function updateChapter(chapterId: string, courseId: string, formData: FormData) {
  const session = await requireInstructor();
  const title = (formData.get("title") as string)?.trim();
  const videoUrl = (formData.get("videoUrl") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim();
  const isFree = formData.get("isFree") === "on";
  const isPublished = formData.get("isPublished") === "on";
  const description = (formData.get("description") as string)?.trim();

  if (!title) return;

  await prisma.course.findFirstOrThrow({ where: { id: courseId, instructorId: session.id } });

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { title, videoUrl, content: content || null, isFree, isPublished, description: description || null },
  });

  revalidatePath(`/instructor/courses/${courseId}/chapters`);
  redirect(`/instructor/courses/${courseId}/chapters`);
}

export async function deleteChapter(chapterId: string, courseId: string) {
  const session = await requireInstructor();
  await prisma.course.findFirstOrThrow({ where: { id: courseId, instructorId: session.id } });
  await prisma.chapter.delete({ where: { id: chapterId } });
  revalidatePath(`/instructor/courses/${courseId}/chapters`);
  redirect(`/instructor/courses/${courseId}/chapters`);
}

export async function reorderChapter(chapterId: string, courseId: string, direction: "up" | "down") {
  const session = await requireInstructor();
  await prisma.course.findFirstOrThrow({ where: { id: courseId, instructorId: session.id } });

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!chapter) return;

  const swapPosition = direction === "up" ? chapter.position - 1 : chapter.position + 1;
  const swapChapter = await prisma.chapter.findFirst({ where: { courseId, position: swapPosition } });
  if (!swapChapter) return;

  await prisma.$transaction([
    prisma.chapter.update({ where: { id: chapter.id }, data: { position: swapPosition } }),
    prisma.chapter.update({ where: { id: swapChapter.id }, data: { position: chapter.position } }),
  ]);

  revalidatePath(`/instructor/courses/${courseId}/chapters`);
}
