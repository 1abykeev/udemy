"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function enrollInCourse(courseId: string, courseSlug: string) {
  const session = await getSession();
  if (!session) redirect("/login");

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.id, courseId } },
    update: {},
    create: { userId: session.id, courseId },
  });

  revalidatePath(`/courses/${courseSlug}`);
  redirect(`/learn/${courseSlug}/1`);
}

export async function markChapterComplete(
  chapterId: string,
  courseSlug: string,
  position: number,
  isCompleted: boolean
) {
  const session = await getSession();
  if (!session) redirect("/login");

  await prisma.userProgress.upsert({
    where: { userId_chapterId: { userId: session.id, chapterId } },
    update: { isCompleted },
    create: { userId: session.id, chapterId, isCompleted },
  });

  revalidatePath(`/learn/${courseSlug}/${position}`);
}

export async function submitReview(
  courseId: string,
  courseSlug: string,
  rating: number,
  comment: string
) {
  const session = await getSession();
  if (!session) redirect("/login");

  const review = await prisma.review.upsert({
    where: { userId_courseId: { userId: session.id, courseId } },
    update: { rating, comment },
    create: { userId: session.id, courseId, rating, comment },
    include: { user: { select: { name: true } } },
  });

  revalidatePath(`/courses/${courseSlug}`);
  return review;
}
