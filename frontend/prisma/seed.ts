import { PrismaClient, ChapterType, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: "Разработка" }, update: {}, create: { name: "Разработка" } }),
    prisma.category.upsert({ where: { name: "Дизайн" }, update: {}, create: { name: "Дизайн" } }),
    prisma.category.upsert({ where: { name: "Бизнес" }, update: {}, create: { name: "Бизнес" } }),
    prisma.category.upsert({ where: { name: "Маркетинг" }, update: {}, create: { name: "Маркетинг" } }),
    prisma.category.upsert({ where: { name: "Анализ данных" }, update: {}, create: { name: "Анализ данных" } }),
    prisma.category.upsert({ where: { name: "IT и ПО" }, update: {}, create: { name: "IT и ПО" } }),
    prisma.category.upsert({ where: { name: "Личностный рост" }, update: {}, create: { name: "Личностный рост" } }),
    prisma.category.upsert({ where: { name: "Фотография" }, update: {}, create: { name: "Фотография" } }),
  ]);

  const [devCat, designCat, bizCat, marketingCat, dataCat] = categories;

  // Demo instructor
  const hashedPw = await bcrypt.hash("password123", 10);
  const instructor = await prisma.user.upsert({
    where: { email: "instructor@ustadplatform.com" },
    update: {},
    create: {
      email: "instructor@ustadplatform.com",
      name: "Алексей Петров",
      password: hashedPw,
      role: Role.INSTRUCTOR,
    },
  });

  // Demo student
  const student = await prisma.user.upsert({
    where: { email: "student@ustadplatform.com" },
    update: {},
    create: {
      email: "student@ustadplatform.com",
      name: "Анна Михайлова",
      password: hashedPw,
      role: Role.STUDENT,
    },
  });

  // Courses
  const courseData = [
    {
      slug: "python-s-nulya-do-pro",
      title: "Python с нуля до профессионала",
      description: "Полный курс по Python для начинающих и продвинутых разработчиков. Вы изучите основы языка, объектно-ориентированное программирование, работу с файлами, базами данных и создание веб-приложений.",
      categoryId: devCat.id,
      chapters: [
        { title: "Введение в Python", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw", isFree: true, position: 1 },
        { title: "Переменные и типы данных", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw", isFree: true, position: 2 },
        { title: "Условия и циклы", type: ChapterType.ARTICLE, content: "## Условия в Python\n\nОператор `if` позволяет выполнять код в зависимости от условия.\n\n```python\nx = 10\nif x > 5:\n    print('Больше 5')\nelif x == 5:\n    print('Равно 5')\nelse:\n    print('Меньше 5')\n```\n\n## Циклы\n\nЦикл `for` перебирает элементы коллекции:\n\n```python\nfor i in range(10):\n    print(i)\n```\n\nЦикл `while` выполняется пока условие истинно:\n\n```python\nn = 0\nwhile n < 10:\n    n += 1\n```", position: 3 },
        { title: "Функции и модули", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw", position: 4 },
        { title: "Объектно-ориентированное программирование", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw", position: 5 },
        { title: "Работа с файлами", type: ChapterType.ARTICLE, content: "## Чтение и запись файлов\n\nДля работы с файлами в Python используется встроенная функция `open()`.\n\n```python\n# Чтение файла\nwith open('file.txt', 'r', encoding='utf-8') as f:\n    content = f.read()\n\n# Запись файла\nwith open('output.txt', 'w', encoding='utf-8') as f:\n    f.write('Hello, World!')\n```", position: 6 },
      ],
    },
    {
      slug: "react-i-nextjs-polnoe-rukovodstvo",
      title: "React и Next.js: Полное руководство",
      description: "Изучите React и Next.js с нуля. Создавайте современные веб-приложения с использованием хуков, Server Components, API Routes и многого другого.",
      categoryId: devCat.id,
      chapters: [
        { title: "Введение в React", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", isFree: true, position: 1 },
        { title: "JSX и компоненты", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", isFree: true, position: 2 },
        { title: "useState и useEffect", type: ChapterType.ARTICLE, content: "## Хук useState\n\nХук `useState` позволяет добавить состояние в функциональный компонент:\n\n```tsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Клик: {count}\n    </button>\n  );\n}\n```\n\n## Хук useEffect\n\nИспользуется для побочных эффектов — загрузка данных, подписки, изменение DOM:\n\n```tsx\nuseEffect(() => {\n  fetch('/api/data')\n    .then(r => r.json())\n    .then(setData);\n}, []); // [] означает запуск только при монтировании\n```", position: 3 },
        { title: "Next.js App Router", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", position: 4 },
        { title: "Server Components vs Client Components", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", position: 5 },
      ],
    },
    {
      slug: "ui-ux-dizajn-figma",
      title: "UI/UX Дизайн с нуля: Figma",
      description: "Научитесь создавать красивые и удобные интерфейсы в Figma. Курс охватывает основы UI/UX дизайна, прототипирование, компонентную систему и подготовку макетов для разработчиков.",
      categoryId: designCat.id,
      chapters: [
        { title: "Что такое UI/UX дизайн", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", isFree: true, position: 1 },
        { title: "Знакомство с Figma", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", isFree: true, position: 2 },
        { title: "Основы композиции и цвета", type: ChapterType.ARTICLE, content: "## Принципы хорошей композиции\n\n1. **Контраст** — помогает выделить важные элементы\n2. **Выравнивание** — создаёт порядок и структуру\n3. **Близость** — группирует связанные элементы\n4. **Повторение** — создаёт единый стиль\n\n## Теория цвета\n\nЦветовые модели: RGB для экранов, HSL удобна для работы в коде.\n\nПри выборе цветов придерживайтесь правила 60-30-10:\n- 60% — основной цвет (обычно нейтральный)\n- 30% — вторичный цвет\n- 10% — акцентный цвет", position: 3 },
        { title: "Компоненты и Auto Layout", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", position: 4 },
        { title: "Прототипирование", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", position: 5 },
      ],
    },
    {
      slug: "analiz-dannyh-python-pandas",
      title: "Анализ данных с Python и Pandas",
      description: "Полный курс по анализу данных. Изучите NumPy, Pandas, Matplotlib и Seaborn для работы с реальными данными, создания визуализаций и построения аналитических отчётов.",
      categoryId: dataCat.id,
      chapters: [
        { title: "Введение в анализ данных", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg", isFree: true, position: 1 },
        { title: "NumPy: массивы и вычисления", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg", isFree: true, position: 2 },
        { title: "Pandas: работа с DataFrame", type: ChapterType.ARTICLE, content: "## Создание DataFrame\n\n```python\nimport pandas as pd\n\ndf = pd.DataFrame({\n    'name': ['Анна', 'Борис', 'Вера'],\n    'age': [25, 30, 28],\n    'salary': [80000, 120000, 95000]\n})\n```\n\n## Основные операции\n\n```python\ndf.head()          # первые 5 строк\ndf.describe()      # статистика\ndf['age'].mean()   # среднее\ndf[df['age'] > 27] # фильтрация\n```", position: 3 },
        { title: "Визуализация с Matplotlib и Seaborn", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg", position: 4 },
      ],
    },
    {
      slug: "digital-marketing-seo-smm",
      title: "Digital Marketing: SEO и SMM",
      description: "Освойте инструменты цифрового маркетинга: SEO-оптимизацию, SMM, контент-маркетинг, таргетированную рекламу и email-маркетинг. Практический курс с реальными кейсами.",
      categoryId: marketingCat.id,
      chapters: [
        { title: "Основы digital marketing", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=bixR-KIJKYM", isFree: true, position: 1 },
        { title: "SEO: основы поисковой оптимизации", type: ChapterType.ARTICLE, content: "## Что такое SEO?\n\nSEO (Search Engine Optimization) — комплекс мер по улучшению позиций сайта в поисковых системах.\n\n## Основные факторы ранжирования\n\n1. **Контент** — качественный, уникальный, отвечающий на запрос\n2. **Технические факторы** — скорость загрузки, мобильная версия, HTTPS\n3. **Внешние ссылки** — авторитетные сайты, ссылающиеся на ваш\n4. **Поведенческие факторы** — время на сайте, отказы, кликабельность\n\n## Ключевые слова\n\nПодбирайте ключевые слова с помощью: Google Keyword Planner, Яндекс Вордстат, Ahrefs.", position: 2 },
        { title: "Продвижение в социальных сетях", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=bixR-KIJKYM", position: 3 },
        { title: "Таргетированная реклама", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=bixR-KIJKYM", position: 4 },
      ],
    },
    {
      slug: "osnovy-biznesa-i-predprinimatelstva",
      title: "Основы бизнеса и предпринимательства",
      description: "Курс для начинающих предпринимателей. Узнайте, как запустить бизнес с нуля: от идеи и бизнес-плана до первых продаж и масштабирования.",
      categoryId: bizCat.id,
      chapters: [
        { title: "Как найти бизнес-идею", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=Yw9YfQuqQHU", isFree: true, position: 1 },
        { title: "Исследование рынка", type: ChapterType.ARTICLE, content: "## Анализ рынка\n\nПеред запуском бизнеса важно понять:\n\n1. **Кто ваши клиенты?** — составьте портрет целевой аудитории\n2. **Кто ваши конкуренты?** — проведите SWOT-анализ\n3. **Какой объём рынка?** — оцените потенциальную выручку\n\n## Методы исследования\n\n- Интервью с потенциальными клиентами (custdev)\n- Анализ конкурентов\n- Опросы и анкеты\n- Анализ поисковых запросов", position: 2 },
        { title: "Бизнес-план и финансовая модель", type: ChapterType.VIDEO, videoUrl: "https://www.youtube.com/watch?v=Yw9YfQuqQHU", position: 3 },
      ],
    },
  ];

  for (const course of courseData) {
    const { chapters, ...courseInfo } = course;
    const created = await prisma.course.upsert({
      where: { slug: courseInfo.slug },
      update: { isPublished: true },
      create: {
        ...courseInfo,
        isPublished: true,
        instructorId: instructor.id,
      },
    });

    for (const chapter of chapters) {
      await prisma.chapter.upsert({
        where: {
          id: `${created.id}-${chapter.position}`,
        },
        update: {},
        create: {
          id: `${created.id}-${chapter.position}`,
          ...chapter,
          isPublished: true,
          courseId: created.id,
        },
      });
    }
  }

  // Enroll demo student in first course
  const firstCourse = await prisma.course.findUnique({ where: { slug: "python-s-nulya-do-pro" } });
  if (firstCourse) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student.id, courseId: firstCourse.id } },
      update: {},
      create: { userId: student.id, courseId: firstCourse.id },
    });
  }

  console.log("Seed complete!");
  console.log("Demo instructor: instructor@ustadplatform.com / password123");
  console.log("Demo student:    student@ustadplatform.com / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
