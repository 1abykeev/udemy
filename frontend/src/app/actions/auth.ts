"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { Role } from "@prisma/client";

type ActionState = { error?: string } | undefined;

export async function register(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) === "INSTRUCTOR" ? Role.INSTRUCTOR : Role.STUDENT;

  if (!name || !email || !password) {
    return { error: "Заполните все поля" };
  }
  if (password.length < 6) {
    return { error: "Пароль должен быть не менее 6 символов" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Пользователь с таким email уже существует" };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
  });

  await createSession({ id: user.id, email: user.email, name: user.name, role: user.role });

  if (role === Role.INSTRUCTOR) {
    redirect("/instructor/dashboard");
  } else {
    redirect("/dashboard");
  }
}

export async function login(
  _state: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Заполните все поля" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Неверный email или пароль" };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: "Неверный email или пароль" };
  }

  await createSession({ id: user.id, email: user.email, name: user.name, role: user.role });

  if (user.role === Role.INSTRUCTOR) {
    redirect("/instructor/dashboard");
  } else {
    redirect("/dashboard");
  }
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/");
}
