import { prisma } from "@/lib/prisma";

export default async function Stats() {
  const [courses, students, instructors] = await Promise.all([
    prisma.course.count({ where: { isPublished: true } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
  ]);

  const stats = [
    { value: courses.toString(), label: "Курсов" },
    { value: students.toString(), label: "Студентов" },
    { value: instructors.toString(), label: "Преподавателей" },
  ];

  return (
    <section className="bg-[#f7f9fa] border-y border-gray-200 py-12">
      <div className="max-w-[1340px] mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
