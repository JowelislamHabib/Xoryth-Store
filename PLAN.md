# Xoryth Store — Frontend Implementation Plan

**Backend:** Express + Prisma at `http://localhost:5000/api/v1` (see `prisma-neon-pgsql/FRONTEND_API.md`)
**Stack:** Next.js 16.3.0 (App Router), React 19, Tailwind v4, shadcn base-nova (@base-ui), pnpm

## Core decisions

- **Pattern A — server-side proxy.** Backend has no CORS; only httpOnly cookie auth (no Bearer). Next Route Handlers/Server Actions forward the `Cookie` header verbatim.
- **Types** copied from `FRONTEND_API.md` §4 → `src/lib/types.ts`.
- **No cart endpoint on backend** → cart is client-side (Context + `localStorage`); checkout = `POST /orders`.
- **Next 16 gotchas:** `params`/`searchParams`/`cookies()` are async Promises; use `PageProps<'/x'>`, `LayoutProps<'/x'>`, `RouteContext<'/x'>` helpers.
- **Response envelope** `{status, message, data}`; errors always `status: 500` → branch on `status >= 400`, show `message`.
- **Auth state:** login server-action sets `accessToken` httpOnly cookie (same as backend). A separate non-httpOnly `session` cookie holds `{id, name, email, role}` for client-side role gating. Server guards use `cookies().has("accessToken")`.
- `.env.local` is gitignored → commit `.env.example` with `API_URL` / `NEXT_PUBLIC_API_URL`.
- **Verification per phase:** `pnpm lint` + `pnpm build`; backend must run on `:5000` for runtime smoke tests.
- **UI:** shadcn components added via `pnpm dlx shadcn@latest add <name>` — base-nova style already configured.

## Commits (each pushed to origin)

1. `docs: add frontend implementation plan` — `PLAN.md`.
2. `chore: add api env and type definitions` — `.env.example`; `src/lib/types.ts` (User, Category, Product, Order, OrderItem, Review, LoginResponse, ApiResponse, enums); `src/lib/api.ts` server fetch helper (forwards cookie, parses envelope).
3. `feat: add server-side api proxy` — `app/api/proxy/[...path]/route.ts` (catch-all, forwards Cookie + passes through Set-Cookie for login); `src/lib/client-api.ts` thin wrapper. Client mutations go through `/api/proxy/...`.
4. `feat: add auth actions and session guard` — `src/lib/actions/auth.ts` (signup+auto-login, login, logout via `cookies().set/delete`), `src/lib/session.ts` (read session cookie, current-user helpers), `redirectIfNotAuthed` guard.
5. `feat: add login and signup pages` — `/login`, `/signup` with shadcn form components (card, input, label, button); `?next=` support; redirect authed users away.
6. `feat: add storefront shell` — rework `layout.tsx` metadata; header (logo, nav, cart button, user menu) + footer; add ui: badge, sheet, dropdown-menu, avatar, separator.
7. `feat: add home page` — hero + category chips + featured products (`GET /products`, `GET /categories`) via server components.
8. `feat: add product catalog` — `/products` grid with category filter + search via `searchParams`; ui: card, skeleton, select.
9. `feat: add product detail with reviews` — `/products/[id]`: product info, `GET /reviews/product/:id`, review form (`POST /reviews`), average rating; ui: textarea, rating display.
10. `feat: add client-side cart` — `CartProvider` + `localStorage`, cart sheet/drawer + `/cart` page, quantity/remove, subtotal.
11. `feat: add checkout and order placement` — `/checkout` (authed only): address/phone via `PATCH /users/:id`, confirm → `POST /orders` (client proxy), success redirect to `/orders/[id]`.
12. `feat: add order detail page` — `/orders/[id]`: items, totals, status badge (`GET /orders/:id`, customer = own only).
13. `feat: add user account area` — `/account`: profile edit (name/image/address/phone), my orders list (`GET /orders/my`), my reviews; ui: tabs, table.
14. `chore: final verification` — `pnpm lint`, `pnpm build`; fix warnings; final commit.

## Scope guardrails

- No admin screens (no DB role changes). Admin-only calls out of scope.
- No image upload UI — `image` field accepted as URL string (backend stores string).
- No pagination API support needed (backend returns full lists); catalog shows all returned products.

## Endpoint map (backend view)

| Resource | Base | Notes |
| --- | --- | --- |
| Users | `POST /users/signup`, `POST /users/login`, `PATCH /users/:id` (CUSTOMER/ADMIN) | signup always CUSTOMER; profile update only |
| Categories | `GET /categories`, `GET /categories/:id` | public reads |
| Products | `GET /products`, `GET /products/:id` | public reads |
| Orders | `POST /orders` (CUSTOMER/ADMIN), `GET /orders/my`, `GET /orders/:id` (own only) | creates order, validates stock, decrements stock |
| Reviews | `POST /reviews`, `GET /reviews/product/:productId`, `PATCH /reviews/:id`, `DELETE /reviews/:id` | one review per user per product |
