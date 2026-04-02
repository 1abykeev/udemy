const footerLinks = [
  {
    heading: "Платформа",
    links: ["О нас", "Карьера", "Блог", "Пресс-центр", "Партнёры"],
  },
  {
    heading: "Обучение",
    links: ["Стать преподавателем", "Мобильное приложение", "Студенческий блог", "Для бизнеса", "Сертификаты"],
  },
  {
    heading: "Поддержка",
    links: ["Центр помощи", "Свяжитесь с нами", "Политика возврата", "Правила доступности", "Партнёрская программа"],
  },
  {
    heading: "Правовая информация",
    links: ["Условия использования", "Политика конфиденциальности", "Политика cookies", "Карта сайта", "Отказ от ответственности"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1c1d1f] text-gray-400">
      <div className="max-w-[1340px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <span className="text-2xl font-bold text-[#a435f0]">Устад</span>
            <p className="text-sm mt-3 leading-relaxed">
              Лучшая онлайн-платформа для обучения на русском языке. Развивайтесь вместе с нами.
            </p>
            <div className="flex gap-4 mt-4">
              {["fb", "tw", "in", "yt"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 bg-gray-700 hover:bg-[#a435f0] rounded-full flex items-center justify-center transition-colors text-xs font-bold text-white">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white font-bold text-sm mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2024 Устад. Все права защищены.</p>
          <p className="text-xs">Сделано с ❤️ для русскоязычных студентов</p>
        </div>
      </div>
    </footer>
  );
}
