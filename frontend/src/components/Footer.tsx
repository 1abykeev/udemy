import Link from "next/link";

const footerLinks = [
  {
    heading: "Платформа",
    links: [
      { label: "О нас", href: "/about" },
    ],
  },
  {
    heading: "Обучение",
    links: [
      { label: "Все курсы", href: "/courses" },
      { label: "Стать преподавателем", href: "/register" },
    ],
  },
  {
    heading: "Правовая информация",
    links: [
      { label: "Условия использования", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1c1d1f] text-gray-400">
      <div className="max-w-[1340px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-[#a435f0]">Устад</Link>
            <p className="text-sm mt-3 leading-relaxed">
              Лучшая онлайн-платформа для обучения на русском языке. Развивайтесь вместе с нами.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white font-bold text-sm mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 Устад. Все права защищены.</p>
          <p className="text-xs">Сделано с ❤️ для русскоязычных студентов</p>
        </div>
      </div>
    </footer>
  );
}
