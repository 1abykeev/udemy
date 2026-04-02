# Устад Platform — Architecture Reference

## What is this?
A Udemy-like demo platform. Instructors create courses with video/article lessons. Students browse and watch for free (no payments).

## Stack
- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind CSS 4
- Prisma 7 + PostgreSQL (adapter: @prisma/adapter-pg)
- jose (session JWT)
- bcryptjs (password hashing)

## Auth Flow
1. User submits register/login form → Server Action in `src/app/actions/auth.ts`
2. Action creates JWT with payload `{ id, role, name, email }`, signs with `SESSION_SECRET`
3. JWT stored as httpOnly cookie `session`, maxAge 7 days
4. `src/lib/session.ts` exports `getSession()` — reads + verifies cookie, returns payload or null
5. `src/proxy.ts` guards route groups by reading cookie (no DB calls in proxy)
6. Protected route group layouts call `getSession()` and redirect if unauthorized

## User Roles
- `STUDENT` — browses courses, enrolls for free, watches lessons, tracks progress, leaves reviews
- `INSTRUCTOR` — creates and manages courses and chapters
- `ADMIN` — not used in demo

## Route Groups
- `(public)` — no auth required: `/`, `/courses`, `/courses/[slug]`, `/login`, `/register`
- `(student)` — requires role STUDENT: `/dashboard`, `/learn/[courseSlug]/[chapterPos]`
- `(instructor)` — requires role INSTRUCTOR: `/instructor/dashboard`, `/instructor/courses/...`

## Data Patterns
- Server Components fetch directly with `prisma` (no API layer)
- Server Actions handle all mutations, call `revalidatePath()` after writes
- Route Handlers only exist for auth

## Chapter Types
- `VIDEO`: has `videoUrl`, rendered as `<video>` tag
- `ARTICLE`: has `content` (plain text), rendered in styled div with react-markdown

## Key Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — secret for signing session JWT (min 32 chars)

## No Payment Flow
- `Purchase` model exists in schema but is unused
- All courses are free to enroll
- Course `price` field exists but is ignored in UI
