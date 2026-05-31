import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding categories...");

  await Promise.all([
    prisma.category.upsert({ where: { name: "Разработка" }, update: {}, create: { name: "Разработка" } }),
    prisma.category.upsert({ where: { name: "Дизайн" }, update: {}, create: { name: "Дизайн" } }),
    prisma.category.upsert({ where: { name: "Бизнес" }, update: {}, create: { name: "Бизнес" } }),
    prisma.category.upsert({ where: { name: "Маркетинг" }, update: {}, create: { name: "Маркетинг" } }),
    prisma.category.upsert({ where: { name: "Анализ данных" }, update: {}, create: { name: "Анализ данных" } }),
    prisma.category.upsert({ where: { name: "IT и ПО" }, update: {}, create: { name: "IT и ПО" } }),
    prisma.category.upsert({ where: { name: "Личностный рост" }, update: {}, create: { name: "Личностный рост" } }),
    prisma.category.upsert({ where: { name: "Фотография" }, update: {}, create: { name: "Фотография" } }),
  ]);

  console.log("Done. Register an instructor account to start adding courses.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
