import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Условия использования</h1>
          <p className="text-gray-400 text-sm mb-10">Последнее обновление: 1 января 2025 г.</p>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Принятие условий</h2>
              <p>
                Используя платформу Устад, вы соглашаетесь с настоящими условиями использования.
                Если вы не согласны с условиями, пожалуйста, не используйте платформу.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Регистрация и аккаунт</h2>
              <p>
                Для доступа к курсам необходимо создать аккаунт. Вы несёте ответственность за
                сохранность данных вашего аккаунта и за все действия, совершённые под вашей учётной записью.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Использование контента</h2>
              <p>
                Все материалы курсов предназначены исключительно для личного обучения.
                Копирование, распространение или коммерческое использование контента без разрешения запрещено.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Правила поведения</h2>
              <p>
                Пользователи обязуются не размещать оскорбительный, незаконный или вводящий в заблуждение контент.
                Платформа вправе заблокировать аккаунт при нарушении данных правил.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Изменение условий</h2>
              <p>
                Устад оставляет за собой право изменять настоящие условия. Об изменениях мы уведомим
                пользователей по электронной почте или через уведомление на платформе.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Контакты</h2>
              <p>
                По вопросам, связанным с условиями использования, обращайтесь:{" "}
                <a href="mailto:support@ustadplatform.com" className="text-[#a435f0] hover:underline">
                  support@ustadplatform.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
