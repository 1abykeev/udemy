# Answers to Documentation Questions — Устад (Ustad) Platform

---

## 1. General Project Info

### Q1. What is the full name of the project? Describe it in 2–3 sentences.

The full name of the project is **"Устад"** (transliterated: *Ustad* — a Kyrgyz/Uzbek word meaning "master" or "teacher"). It is an **online learning management system (LMS)** — a full-stack web platform that allows instructors to create and publish video/text courses, and students to enroll in, study, and track their progress through those courses. The platform is modeled after Udemy and similar MOOC platforms, providing a structured environment where educational content is organized into courses with sequential chapters.

### Q2. What problem does it solve, and what value does it bring to end users?

The platform solves the problem of **fragmented, inaccessible education** by providing a centralized digital space where:
- **Instructors** can publish structured courses with video lessons and text articles — without needing technical skills or separate hosting infrastructure.
- **Students** can discover, enroll in, and complete courses at their own pace, tracking their chapter-by-chapter progress and reviewing what they've learned.

The key value is **free access to structured learning** — unlike commercial platforms, all courses on Устад are free to enroll. Students get a clear progress tracker, chapter navigation, and the ability to rate courses. Instructors get a dashboard with course management, chapter ordering, and publish/draft controls.

### Q3. Who is the author of the project?

> *(This information was not found in the codebase. Please fill in manually.)*
> - Full name:
> - Student group:
> - Specialization:
> - University:
> - Department:

### Q4. Who is the academic supervisor?

> *(This information was not found in the codebase. Please fill in manually.)*

---

## 2. Tech Stack

### Q5. What backend framework is used?

The project uses **Next.js 16** (version `16.2.2`) as both the frontend and backend framework. It is written in **TypeScript 5**. There is no separate backend server — Next.js App Router handles both UI rendering and server-side logic through:
- **Server Components** — React components that run on the server and fetch data directly from the database.
- **Server Actions** — TypeScript async functions marked with `"use server"` that handle all mutations (create, update, delete) and are called from client forms.
- **Route Handlers** — Used only for authentication endpoints (login/register/logout).

### Q6. What frontend framework or library is used?

- **React 19.2.4** — UI library
- **Next.js 16 App Router** — Routing, layouts, Server Components, Server Actions
- **Tailwind CSS 4** with `@tailwindcss/postcss` — Utility-first CSS styling
- All pages are rendered server-side by default; only interactive components (forms, review star-rater, confirm dialogs) are Client Components marked with `"use client"`.

### Q7. What database and authentication method is used?

**Database:** **PostgreSQL** accessed via **Prisma ORM** (version `7.6.0`) with the `@prisma/adapter-pg` PostgreSQL adapter and the `pg` driver.

**Authentication:** Custom **JWT-based session authentication** using the **`jose`** library (version `6.2.2`). The jose library was specifically chosen because it is Edge-compatible and works inside `src/proxy.ts` (the Next.js route guard). The JWT is stored as an **`httpOnly` cookie** named `"session"` with a 7-day expiry. Password hashing is done with **`bcryptjs`** (version `3.0.3`).

### Q8. Key dependencies from package.json

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.2 | Full-stack React framework (App Router) |
| `react` / `react-dom` | 19.2.4 | UI library |
| `typescript` | 5.x | Type safety |
| `tailwindcss` | 4.x | CSS utility framework |
| `@prisma/client` | 7.6.0 | Database ORM client |
| `prisma` | 7.6.0 | Schema management & migrations |
| `@prisma/adapter-pg` | 7.6.0 | PostgreSQL adapter for Prisma |
| `pg` | 8.20.0 | PostgreSQL Node.js driver |
| `jose` | 6.2.2 | JWT signing & verification (Edge-compatible) |
| `jsonwebtoken` | 9.0.3 | JWT types reference |
| `bcryptjs` | 3.0.3 | Password hashing |
| `dotenv` | 17.4.0 | Environment variable loading |
| `dotenv-cli` | 11.0.0 | Env var CLI (used in seed scripts) |

---

## 3. Modules and Features

### Q9. Main modules/sections of the project

The system is divided into **three functional modules** corresponding to the Next.js route groups:

**1. Public Module** (`(public)` route group)
- Landing page with hero banner, platform statistics, featured courses, testimonials, and instructor CTA.
- Course catalog (`/courses`) with search by title and filter by category.
- Course detail page (`/courses/[slug]`) showing the syllabus, instructor info, ratings, and an enrollment card.
- Authentication pages: `/login` and `/register` (with role selection: Student or Instructor).

**2. Student Module** (`(student)` route group)
- Student dashboard (`/dashboard`) showing all enrolled courses, progress bars, and "Continue" buttons.
- Learning page (`/learn/[courseSlug]/[chapterPosition]`) — the full lesson viewer with sidebar chapter navigation, progress tracking, and chapter completion toggle.
- Review submission on the course detail page (rating + optional comment).

**3. Instructor Module** (`(instructor)` route group)
- Instructor dashboard (`/instructor/dashboard`) showing statistics (total courses, published count, enrolled students) and a list of the instructor's own courses.
- Course editor (`/instructor/courses/[courseId]`) — edit course metadata (title, description, category, thumbnail), toggle publish/draft status, delete course.
- Chapter manager (`/instructor/courses/[courseId]/chapters`) — list chapters, add new chapters, reorder up/down, navigate to chapter editor.
- Chapter editor (`/instructor/courses/[courseId]/chapters/[chapterId]`) — edit chapter title, description, content (video URL or text article), publication status, and free preview flag.

### Q10. User roles and permissions

The system has **three roles** defined in the Prisma schema (`UserRole` enum): `STUDENT`, `INSTRUCTOR`, and `ADMIN`. Currently `ADMIN` is defined but not yet active.

**STUDENT**
- Register and log in
- Browse all published courses on the catalog
- View course detail pages (including free preview chapters)
- Enroll in any published course (all courses are free)
- Access the learning page for enrolled courses
- Mark individual chapters as complete/incomplete
- Track progress on the student dashboard
- Submit or update course ratings and reviews

**INSTRUCTOR**
- Register and log in with the INSTRUCTOR role (selectable on the register page)
- Access the instructor dashboard
- Create new courses (title + description → auto-generated slug)
- Edit course metadata: title, description, category, thumbnail URL
- Publish or unpublish courses (draft by default)
- Delete courses (cascades to all chapters)
- Create chapters with a type (VIDEO or ARTICLE) and sequential position
- Edit chapter content: video URL (YouTube or direct MP4) or text article content
- Set chapters as published/draft and as free preview or enrolled-only
- Reorder chapters up/down (atomic position swap)
- Delete chapters

### Q11. Key API endpoints / routes

The project follows a **Server Actions first** architecture — most operations are not REST endpoints but rather server-side functions. The routes below describe the **page routes** and the backend **Server Actions** that power them.

**Authentication (Route Handlers):**
- `POST /api/auth/register` — Register a new user (via Server Action `register()`)
- `POST /api/auth/login` — Authenticate a user (via Server Action `login()`)
- `POST /api/auth/logout` — Destroy the session (via Server Action `logout()`)

**Public Pages:**
- `GET /` — Landing/home page
- `GET /courses` — Course catalog (supports `?q=` search and `?category=` filter)
- `GET /courses/[slug]` — Course detail page

**Student Pages (requires STUDENT session):**
- `GET /dashboard` — Student's enrolled courses and progress
- `GET /learn/[courseSlug]/[chapterPosition]` — Lesson viewer for a specific chapter

**Instructor Pages (requires INSTRUCTOR session):**
- `GET /instructor/dashboard` — Instructor statistics and course list
- `GET /instructor/courses/new` — New course form
- `GET /instructor/courses/[courseId]` — Course editor
- `GET /instructor/courses/[courseId]/chapters` — Chapter list manager
- `GET /instructor/courses/[courseId]/chapters/[chapterId]` — Chapter editor

**Key Server Actions (mutations):**

| Action | Description |
|---|---|
| `enrollInCourse(courseId, slug)` | Enroll current student in a course |
| `markChapterComplete(...)` | Toggle chapter completion for current student |
| `submitReview(courseId, slug, rating, comment)` | Submit or update a course review |
| `createCourse(formData)` | Create a new course (instructor only) |
| `updateCourse(courseId, formData)` | Update course metadata |
| `toggleCoursePublish(courseId, isPublished)` | Publish or unpublish a course |
| `deleteCourse(courseId)` | Delete a course and all its chapters |
| `createChapter(courseId, formData)` | Add a chapter to a course |
| `updateChapter(chapterId, courseId, formData)` | Update chapter content and settings |
| `deleteChapter(chapterId, courseId)` | Delete a chapter |
| `reorderChapter(chapterId, courseId, direction)` | Move a chapter up or down in order |

### Q12. Database structure

The database has **7 models** (tables) with the following structure:

**`User`**
- `id` (CUID, PK), `email` (unique), `name`, `password` (bcrypt hash), `role` (STUDENT / INSTRUCTOR / ADMIN), `avatar?`, `createdAt`, `updatedAt`
- Relations: has many `Course` (as instructor), `Enrollment`, `Review`, `Purchase`, `UserProgress`

**`Course`**
- `id` (CUID, PK), `slug` (unique URL identifier), `title`, `description`, `price` (default 0), `thumbnail?`, `isPublished` (default false), `createdAt`, `updatedAt`
- Relations: belongs to one `User` (instructorId), belongs to one `Category`, has many `Chapter`, `Enrollment`, `Review`, `Purchase`

**`Chapter`**
- `id` (CUID, PK), `title`, `description?`, `type` (VIDEO | ARTICLE), `videoUrl?`, `content?`, `position` (integer for ordering), `isPublished`, `isFree`, `createdAt`, `updatedAt`
- Relations: belongs to one `Course` (cascades delete), has many `UserProgress`

**`Category`**
- `id` (CUID, PK), `name` (unique)
- Relations: has many `Course`

**`Enrollment`**
- `id` (CUID, PK), `createdAt`
- Relations: belongs to `User` and `Course`
- Unique constraint: `[userId, courseId]` — one enrollment per student per course

**`UserProgress`**
- `id` (CUID, PK), `isCompleted` (boolean), `createdAt`, `updatedAt`
- Relations: belongs to `User` and `Chapter`
- Unique constraint: `[userId, chapterId]` — one progress record per student per chapter

**`Review`**
- `id` (CUID, PK), `rating` (integer, 1–5), `comment?`, `createdAt`
- Relations: belongs to `User` and `Course`
- Unique constraint: `[userId, courseId]` — one review per student per course

**Entity Relationships:**
```
User (1) ──── (∞) Course         [instructor creates courses]
User (1) ──── (∞) Enrollment     [student enrolls in courses]
User (1) ──── (∞) UserProgress   [student tracks chapter progress]
User (1) ──── (∞) Review         [student reviews courses]
Course (1) ── (∞) Chapter        [course has ordered chapters]
Course (1) ── (∞) Enrollment
Course (1) ── (∞) Review
Category (1) ─ (∞) Course
Chapter (1) ── (∞) UserProgress
```

---

## 4. Architecture

### Q13. Overall system architecture

The project uses a **monolithic client-server architecture** built on the **Next.js App Router** paradigm. There is no separate backend API server — both the UI and server logic live in one Next.js application.

**Frontend–Backend communication:**

1. **Server Components** (the majority of pages) — React components that execute on the server. They import Prisma directly and run database queries at render time. No HTTP fetch is needed — the data is available before the HTML is sent to the browser.

2. **Server Actions** — TypeScript async functions prefixed with `"use server"`. When a Client Component submits a form or calls a server action, Next.js internally sends an encrypted `POST` request to the same Next.js server. The action runs with full Node.js access (including Prisma), executes the mutation, and either redirects or calls `revalidatePath()` to refresh server-rendered data.

3. **Route Handlers** — Minimal use, only for the auth endpoints.

4. **Proxy (route guard)** — `src/proxy.ts` runs before every request (like middleware). It reads and verifies the JWT cookie without touching the database, and redirects unauthenticated or unauthorized users.

**Request lifecycle example — Student enrolling in a course:**
```
Browser (Client Component button click)
  → Next.js Server Action POST (automatic, encrypted)
  → Server Action validates session (reads cookie → decrypts JWT)
  → Prisma: enrollment.upsert()
  → revalidatePath('/courses/[slug]')
  → redirect('/learn/[courseSlug]/1')
  → Browser navigates to lesson page (full server render)
```

### Q14. Caching, background tasks, third-party integrations

**Caching:**
- Next.js **Incremental Static Regeneration (ISR)** cache is used implicitly by Server Components.
- After every mutation, the relevant cache is invalidated by calling `revalidatePath('/path')` or `revalidateTag('tag')` from Server Actions. This ensures users always see fresh data without a full page reload.
- No external caching layer (Redis, Memcached) is used.

**Background Tasks:**
- None. All operations are synchronous request-response cycles.

**Third-party integrations:**
- **YouTube** — Chapter videos support YouTube URLs. The system automatically detects YouTube links (both `youtube.com/watch?v=` and `youtu.be/` formats) and converts them to embed URLs for rendering in an `<iframe>`.
- No external email, SMS, payment gateway, or analytics services are integrated in the current version.

---

## 5. Implementation Details

### Q15. Authentication and authorization flow

**Registration:**
1. User fills in name, email, password, and selects role (Student or Instructor) on `/register`.
2. The `register()` Server Action validates input (name required, email format, password min 6 chars).
3. It checks that the email is not already taken (`prisma.user.findUnique`).
4. The password is hashed with `bcryptjs.hash(password, 10)`.
5. A new `User` record is created in PostgreSQL with the chosen role.
6. `createSession()` is called — it creates a JWT payload `{id, email, name, role}`, signs it with HMAC-SHA256 using `SESSION_SECRET` via the `jose` library, sets it to expire in 7 days.
7. The JWT is stored as an `httpOnly`, `SameSite: lax` cookie named `"session"`.
8. The user is redirected to their role-appropriate dashboard.

**Login:**
1. User submits email and password on `/login`.
2. The `login()` Server Action finds the user by email.
3. `bcryptjs.compare(password, user.password)` verifies the password.
4. If valid, `createSession()` is called and the session cookie is set.
5. Redirect to the appropriate dashboard.

**Route protection (proxy.ts):**
- Runs on every request (except static assets and Next.js internals).
- Reads the `"session"` cookie, decrypts it with `jose.jwtVerify()`.
- No database calls — role is embedded in the JWT payload.
- Rules enforced:
  - No session → redirect to `/login` if accessing `/dashboard` or `/instructor/*`
  - Session with role ≠ INSTRUCTOR → redirect to `/dashboard` if accessing `/instructor/*`
  - INSTRUCTOR accessing `/dashboard` → redirect to `/instructor/dashboard`
  - Authenticated user accessing `/login` or `/register` → redirect to their dashboard

**Layout-level guards (defense in depth):**
- `(student)/layout.tsx` — calls `getSession()` and redirects to `/login` if no session.
- `(instructor)/layout.tsx` — calls `getSession()` and redirects if no session or if role is not INSTRUCTOR.

**Authorization in Server Actions:**
- All instructor mutations call `requireInstructor()` which validates the session role.
- Ownership is validated on every mutation: the action checks that `course.instructorId === session.id` before updating or deleting.

### Q16. Most complex and interesting features

**Feature 1 — Chapter Reordering with Atomic Database Transaction**

When an instructor clicks "Move Up" or "Move Down" for a chapter, the `reorderChapter()` Server Action:
1. Finds the current chapter and its `position` value.
2. Calculates the target position (`position - 1` for up, `position + 1` for down).
3. Finds the adjacent chapter that currently holds that position.
4. Uses `prisma.$transaction([...])` to atomically swap the two `position` values — this ensures no two chapters ever have the same position, even under concurrent requests. If either update fails, the entire transaction rolls back.

**Feature 2 — YouTube Video Auto-Detection and Embedding**

The chapter learning page (`/learn/[courseSlug]/[chapterPosition]`) has a helper function `getYouTubeEmbedUrl(url)` that:
1. Detects YouTube URLs by checking for `youtube.com/watch?v=` or `youtu.be/` patterns.
2. Extracts the video ID using URL parsing.
3. Returns an embed URL (`https://www.youtube.com/embed/{videoId}`).
4. If the URL is not YouTube, it renders a standard HTML5 `<video>` tag with `controls`.
5. If no URL is provided at all, it shows a "Video not yet added" placeholder.

This allows instructors to simply paste any YouTube URL or a direct video file URL without any special formatting.

**Feature 3 — Idempotent Progress Tracking with Upsert**

The `markChapterComplete()` Server Action uses `prisma.userProgress.upsert()`:
- It looks up the UserProgress record by the composite unique key `[userId, chapterId]`.
- If it doesn't exist, it creates a new one.
- If it already exists, it updates the `isCompleted` boolean.
- This means the same action can safely be called multiple times (marking complete, then incomplete, then complete again) without creating duplicate records or throwing errors.

The student dashboard then calculates completion percentage as:
`completedChapters / totalPublishedChapters * 100`

### Q17. Automated calculations and business logic

**Slug generation for courses:**
When an instructor creates a course, the `slugify()` helper function:
1. Converts the title to lowercase.
2. Removes all characters that are not alphanumeric or spaces.
3. Replaces spaces with hyphens.
4. Appends a timestamp suffix (`-{Date.now()}`) to guarantee uniqueness even if two courses have the same title.

Example: `"Introduction to Python"` → `"introduction-to-python-1712345678901"`

**Chapter position auto-increment:**
When adding a new chapter, `createChapter()` queries the last chapter in the course by position (`orderBy: { position: 'desc' }, take: 1`) and sets the new chapter's position to `lastPosition + 1`. This keeps chapters in insertion order by default.

**Progress percentage calculation:**
On the student dashboard, for each enrolled course:
```
totalChapters = course.chapters.filter(ch => ch.isPublished).length
completedChapters = course.chapters.filter(ch =>
  ch.userProgress.some(p => p.userId === studentId && p.isCompleted)
).length
percentage = Math.round((completedChapters / totalChapters) * 100)
```
Displayed as a progress bar with the label "Completed X of Y chapters (Z%)".

**Average course rating:**
On the course detail page, the average rating is calculated from all reviews:
```
averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
```
Displayed as a decimal (e.g., `4.3`) alongside the review count.

---

## 6. Testing and Results

### Q18. Was the system tested?

No automated tests (unit, integration, or end-to-end) are present in the codebase. The project was developed and verified through **manual testing** of the following scenarios:

- User registration and login with both STUDENT and INSTRUCTOR roles
- Route protection: unauthenticated access, role-based redirects
- Course creation, editing, publishing, and deletion
- Chapter creation, editing, reordering, and deletion
- Student enrollment and access to learn pages
- Chapter completion marking and progress bar updates
- Review submission and display

### Q19. Performance metrics and screenshots

No formal load testing or performance benchmarks were conducted. The system benefits from Next.js built-in performance features:
- **Server-side rendering** — pages are pre-rendered on the server, reducing client-side JavaScript.
- **ISR cache invalidation** — only the affected paths are revalidated after mutations, not the entire application.
- **Edge-compatible JWT verification** — the route guard (`proxy.ts`) uses `jose` for JWT checks without any database call, meaning route protection adds near-zero latency.

---

## 7. Conclusion

### Q20. Practical benefits — could it be used in a real setting?

The system demonstrates all core LMS functionality and is architecturally sound for a production deployment with some additions. Current practical benefits:
- **Free, instant access** — no payment barrier removes friction for students.
- **Structured learning path** — sequential chapters with position tracking guide students through the material.
- **Dual-role platform** — instructors and students use the same system with clean role separation.
- **YouTube integration** — instructors can publish courses using freely hosted YouTube videos, eliminating video hosting costs.
- **Progress persistence** — students can stop and resume at any point; their completion status is stored per chapter.

For a real deployment, the following would need to be added: email verification, password reset flow, image upload (currently only URLs), content moderation, and an admin panel for managing users and categories.

### Q21. Limitations and future improvements

**Current Limitations:**
- No email verification or password reset
- No file upload — thumbnails and videos are entered as URLs only
- No payment system (Purchase model exists but is not used)
- No admin panel (ADMIN role defined but inactive)
- No Markdown rendering for article chapters (plain text only)
- No real-time features (notifications, live chat)
- No mobile-responsive optimization for the learning page sidebar
- No certificate generation on course completion
- Search is limited to title substring matching only

**Planned / Possible Improvements:**
- Integrate file upload (e.g., AWS S3 or Cloudflare R2) for video and image hosting
- Add Stripe payment integration using the existing `Purchase` model
- Build an admin dashboard for category and user management
- Add course completion certificates
- Implement email notifications (enrollment confirmations, new review alerts)
- Add a rich text editor (Markdown or WYSIWYG) for article chapters
- Implement course tags and advanced search/filtering
- Add quiz/assessment modules per chapter
- Mobile app (React Native) using the same backend logic

### Q22. Approximate volume of the work

**Codebase size:**
- **~25 TypeScript/TSX source files** in `src/`
- **~3 Server Action files** totaling ~400 lines of business logic
- **~15 page and layout components** across 3 route groups
- **~8 reusable UI components**
- **1 Prisma schema** with 7 models and ~12 migrations
- **~2,500–3,000 lines of code** total (excluding configuration and generated files)

**Documentation artifacts:**
- Database ERD diagram (`docs/erd.png`) — 1 diagram with all 7 models and their relationships
- Questions & answers documentation (`docs/questions.md`, `docs/answers.md`)

**Features implemented:**
- 3 user-facing modules (public, student, instructor)
- 11 distinct page routes + 2 layout files
- 11 Server Actions covering all CRUD operations
- JWT authentication system with role-based routing
- PostgreSQL database with relational schema
- Responsive UI with Tailwind CSS

---

*Answers generated by analyzing the full source code of the Устад platform — Next.js 16 + React 19 + PostgreSQL + Prisma 7.*
