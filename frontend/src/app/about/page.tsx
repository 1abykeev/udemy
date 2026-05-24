import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">О платформе Устад</h1>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              <strong>Устад</strong> — это современная онлайн-платформа для обучения на русском языке.
              Мы объединяем студентов и преподавателей, чтобы сделать качественное образование доступным для каждого.
            </p>
            <p>
              На платформе вы найдёте курсы по программированию, дизайну, бизнесу, маркетингу и анализу данных.
              Все курсы создаются профессиональными преподавателями и проходят проверку качества.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Наша миссия</h2>
            <p>
              Сделать профессиональное образование доступным для русскоязычных пользователей по всему миру.
              Мы верим, что каждый человек заслуживает возможности учиться и развиваться.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Для студентов</h2>
            <p>
              Записывайтесь на курсы бесплатно, отслеживайте прогресс и получайте знания в удобном темпе.
              Видеоуроки и текстовые статьи доступны в любое время.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Для преподавателей</h2>
            <p>
              Создавайте курсы, управляйте содержанием и делитесь знаниями с тысячами студентов.
              Простой редактор позволяет добавлять видеоуроки и текстовые материалы.
            </p>
            <div className="mt-10 flex gap-4">
              <Link href="/courses" className="px-6 py-3 bg-[#a435f0] text-white font-bold rounded-lg hover:bg-[#8710d8] transition-colors">
                Смотреть курсы
              </Link>
              <Link href="/register" className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Зарегистрироваться
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
