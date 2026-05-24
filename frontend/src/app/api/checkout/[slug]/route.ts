import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });

  const { slug } = await params;

  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return NextResponse.json({ error: "Курс не найден" }, { status: 404 });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.id, courseId: course.id } },
    update: {},
    create: { userId: session.id, courseId: course.id },
  });

  return NextResponse.json({ ok: true });
}
