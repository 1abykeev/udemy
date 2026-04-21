@AGENTS.md

# Устад — Online Learning Platform

**Status: COMPLETE** — Final university project. A Russian-language Udemy-style demo platform.

## What This Is

Устад is a full-stack online learning platform built with Next.js 16 (App Router), React 19, Prisma 7, and PostgreSQL. It supports two active roles — **Student** and **Instructor** — and demonstrates a full course lifecycle: create → publish → enroll → learn → review.

All courses are free. There is no payment flow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.2 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5 |
| ORM | Prisma 7.6.0 with `@prisma/adapter-pg` |
| Database | PostgreSQL |
| Auth | JWT via `jose` (Edge-compatible) + `bcryptjs` |
| Font | Geist |

---

## Route Map

### Public (no auth)
| Route | Description |
|---|---|
| `/` | Homepage — hero, stats, categories, featured courses, testimonials |
| `/login` | Login form (client component, `useActionState`) |
| `/register` | Register form with role toggle (STUDENT / INSTRUCTOR) |
| `/courses` | Browse all published courses, filter by category + search |
| `/courses/[slug]` | Course detail — chapters list, reviews, enroll CTA |

### Student (auth required, role: STUDENT)
| Route | Description |
|---|---|
| `/dashboard` | Enrolled courses with progress bars and review option |
| `/learn/[courseSlug]/[chapterPosition]` | Chapter player — VIDEO (YouTube embed or MP4) or ARTICLE |

### Instructor (auth required, role: INSTRUCTOR)
| Route | Description |
|---|---|
| `/instructor/dashboard` | All instructor courses with stats |
| `/instructor/courses/new` | Create course form |
| `/instructor/courses/[courseId]` | Edit metadata, publish/unpublish, delete |
| `/instructor/courses/[courseId]/chapters` | Manage chapters — create, reorder, delete |
| `/instructor/courses/[courseId]/chapters/[chapterId]` | Edit chapter content |

---

## Data Model

```
User            id, email, name, password (bcrypt), role (STUDENT|INSTRUCTOR|ADMIN), avatar
Category        id, name (unique)
Course          id, slug (unique), title, description, price (default 0), thumbnail, isPublished
                → belongs to User (instructor), Category
Chapter         id, title, type (VIDEO|ARTICLE), videoUrl, content, position, isPublished, isFree
                → belongs to Course (cascade delete)
Enrollment      userId + courseId (unique pair)
UserProgress    userId + chapterId (unique pair), isCompleted
Review          userId + courseId (unique pair), rating (Int), comment
Purchase        userId + courseId (unique pair), price — exists but unused (no payment flow)
```

All foreign keys use `onDelete: Cascade`.

---

## Server Actions

### Auth — `src/app/actions/auth.ts`
- `register(formData)` — hash password, create user, set JWT cookie
- `login(formData)` — verify credentials, set JWT cookie
- `logout()` — delete cookie, redirect home

### Student — `src/app/actions/courses.ts`
- `enrollInCourse(courseId, courseSlug)` — upsert Enrollment, redirect to chapter 1
- `markChapterComplete(chapterId, courseSlug, position, isCompleted)` — upsert UserProgress
- `submitReview(courseId, courseSlug, rating, comment)` — upsert Review (one per user per course)

### Instructor — `src/app/actions/instructor.ts`
- `createCourse(formData)` — create with auto-generated slug, redirect to edit page
- `updateCourse(courseId, formData)` — update metadata
- `toggleCoursePublish(courseId, isPublished)` — flip publish state
- `deleteCourse(courseId)` — hard delete (cascade)
- `createChapter(courseId, formData)` — auto-assigns next position
- `updateChapter(chapterId, courseId, formData)` — update content/type/flags
- `deleteChapter(chapterId, courseId)` — delete
- `reorderChapter(chapterId, courseId, "up"|"down")` — atomic position swap via transaction

All mutations call `revalidatePath()` to bust Next.js cache.

---

## Auth & Session Flow

1. Login/register submits to Server Action
2. Action validates, creates JWT (`jose`, HS256, 7-day expiry) stored as httpOnly cookie named `session`
3. `src/proxy.ts` reads `session` cookie on every request and enforces redirects:
   - Unauthenticated → `/login` for protected routes
   - STUDENT accessing `/instructor/*` → `/dashboard`
   - INSTRUCTOR accessing `/dashboard` → `/instructor/dashboard`
   - Authenticated users visiting `/login` or `/register` → their dashboard
4. Individual pages/actions call `getSession()` for user identity and ownership checks

Session payload: `{ id, email, name, role }`

---

## Key Files

| File | Purpose |
|---|---|
| `src/proxy.ts` | Route guard — reads JWT, enforces redirects |
| `src/lib/session.ts` | JWT encrypt/decrypt, cookie read/write |
| `src/lib/prisma.ts` | Prisma singleton with PrismaPg adapter |
| `src/app/actions/auth.ts` | Login / register / logout |
| `src/app/actions/courses.ts` | Student mutations |
| `src/app/actions/instructor.ts` | Instructor CRUD |
| `prisma/schema.prisma` | Full data model |
| `prisma/seed.ts` | Demo seed data |

---

## Demo Seed Data

Run with `npm run seed`.

- **5 Categories**: Разработка, Дизайн, Бизнес, Маркетинг, Анализ данных
- **6 Courses**: Python, React/Next.js, UI/UX Figma, Data Analysis, Digital Marketing, Business Basics
- **30+ Chapters**: Mix of VIDEO (YouTube) and ARTICLE types
- **Demo accounts** (password: `password123`):
  - Instructor: `instructor@ustadplatform.com`
  - Student: `student@ustadplatform.com` (pre-enrolled in Python course)

---

## Design System

- **Primary**: `#a435f0` (purple)
- **Rating color**: `#e59819` (gold)
- **Dark UI**: `#1c1d1f` / `#2d2f31` (used in learning view)
- **Course card gradients**: 8 distinct color pairs (fallback when no thumbnail)
- **Responsive**: mobile-first, `lg:` breakpoint at 1024px

---

## Critical Rules

- **Route guard**: `src/proxy.ts` — NOT `middleware.ts` (deprecated in Next.js 16)
- **`cookies()`**: always `await cookies()` — it's async in Next.js 16
- **Route params**: always `await params` before destructuring
- **JWT**: use `jose`, not `jsonwebtoken` — must be Edge-compatible for proxy.ts
- **Mutations**: Server Actions only — no direct DB calls in Route Handlers
- **Navigation after action**: `redirect()` from `next/navigation`, never `router.push()`
- **Cache**: call `revalidatePath()` after every mutation
- **Ownership**: instructor actions verify `course.instructorId === session.id` before mutating
- **No payment**: enrollment is free and open — Purchase model exists but is unused

---

## Special Behaviors

- **YouTube embed**: `getYouTubeEmbedUrl()` converts `watch?v=`, `youtu.be/`, and embed URLs; falls back to HTML5 `<video>` for direct MP4
- **Free preview**: chapters with `isFree: true` are visible to unenrolled users
- **Slug generation**: `slugify(title) + "-" + Date.now().toString(36)` — guarantees uniqueness
- **Chapter reorder**: swaps `position` fields atomically in a Prisma `$transaction`
- **Review**: one review per user per course, upserted on resubmit
