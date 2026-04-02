import Link from "next/link";

export default function InstructorCTA() {
  return (
    <section className="bg-gradient-to-r from-[#1c1d1f] to-[#2d2f31] py-16">
      <div className="max-w-[1340px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-3">Станьте преподавателем</h2>
            <p className="text-gray-300 max-w-lg leading-relaxed">
              Делитесь своими знаниями с миллионами студентов. Создавайте курсы и стройте свой бренд эксперта. Присоединитесь к более чем 850 преподавателям на платформе.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold rounded transition-colors whitespace-nowrap text-center"
            >
              Начать обучать
            </Link>
            <Link
              href="/courses"
              className="px-8 py-3.5 border border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded transition-colors whitespace-nowrap text-center"
            >
              Смотреть курсы
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-700">
          {[
            { icon: "🎓", title: "Учите по всему миру", desc: "Ваши курсы доступны студентам из 190+ стран" },
            { icon: "💳", title: "Зарабатывайте стабильно", desc: "Получайте доход от каждой продажи курса" },
            { icon: "🛠️", title: "Инструменты для роста", desc: "Аналитика, маркетинг и поддержка на каждом этапе" },
          ].map((b) => (
            <div key={b.title} className="flex gap-4">
              <span className="text-2xl flex-shrink-0">{b.icon}</span>
              <div>
                <h3 className="font-bold text-white mb-1">{b.title}</h3>
                <p className="text-sm text-gray-400">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
