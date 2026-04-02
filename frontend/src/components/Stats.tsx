const stats = [
  { value: "67 000+", label: "Курсов" },
  { value: "75 млн", label: "Студентов по всему миру" },
  { value: "213", label: "Языков обучения" },
  { value: "850+", label: "Преподавателей-экспертов" },
];

export default function Stats() {
  return (
    <section className="bg-[#f7f9fa] border-y border-gray-200 py-12">
      <div className="max-w-[1340px] mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
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
