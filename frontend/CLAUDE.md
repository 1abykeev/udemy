@AGENTS.md

# Устад — Project Rules for Claude

See PROJECT.md for full architecture reference.

## Critical Rules

- **Proxy file**: Route guard is `src/proxy.ts` — NOT `middleware.ts` (deprecated in Next.js 16)
- **cookies()** from `next/headers` is async — always `await cookies()`
- **Route Handler params**: `context.params` is a Promise — always `await params` before accessing fields
- **Session**: Use `jose` (not `jsonwebtoken`) for JWT — it's Edge-compatible and works in proxy.ts
- **Mutations**: Use Server Actions for everything (enroll, progress, reviews, course CRUD)
- **Route Handlers**: Only for auth (login/register/logout)
- **Navigation after Server Action**: Use `redirect()` from `next/navigation`, NOT `router.push()`
- **Data fetching**: Server Components fetch directly with `prisma` — no extra API layer
- **After mutations**: Call `revalidatePath()` or `revalidateTag()` to refresh data

## File Locations

- Session helper: `src/lib/session.ts`
- Auth actions: `src/app/actions/auth.ts`
- Prisma client: `src/lib/prisma.ts`
- Route groups: `(public)`, `(student)`, `(instructor)`

## No payment flow — all courses free to enroll
