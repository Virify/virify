# Virify — splash

Temporary holding page for virify.co.uk while the service is offline.

This branch is deliberately stripped down:

- No database, Prisma, Redis, or any external service — nothing to decommission or keep alive.
- No auth, sign-up, dashboard, admin, search, API routes, or navigation.
- One page. Every other path 302-redirects to `/`, and errors render the same splash.
- `noindex, nofollow` on every response.

## Run

```bash
pnpm install
pnpm dev        # local
pnpm build && pnpm start   # production (node .output/server/index.mjs)
```

No environment variables are required.

## Files

- `app/components/SplashScreen.vue` — logo, headline, message (edit copy here)
- `app/pages/index.vue` — homepage
- `app/pages/[...slug].vue` — catch-all redirect to `/`
- `app/error.vue` — errors render the splash
- `nuxt.config.ts` — head tags, fonts, robots headers
