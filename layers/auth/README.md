# Auth Layer

Handles user authentication, session management, and account lifecycle for Virify. Built on top of `nuxt-auth-utils`.

---

## Features

- Login with email + password
- Signup with email verification (OTP)
- Account activation via tokenised email link
- Password reset via email token
- Admin password update (hashed via Nitro plugin, not seed script)
- Account deletion
- Route protection middleware (`authenticated`, `login`)
- TypeScript-typed session (`auth.d.ts`)

---

## Directory Structure

```
layers/auth/
├── nuxt.config.ts
├── server/
│   ├── routes/auth/
│   │   ├── login.post.ts             # Authenticate user, create session
│   │   ├── signup.post.ts            # Register new user, send OTP
│   │   ├── verify-otp.post.ts        # Verify OTP code from signup email
│   │   ├── activate-account.get.ts   # Activate account via email link token
│   │   ├── password-reset.get.ts     # Validate password reset token
│   │   ├── password-reset.post.ts    # Apply new password from reset token
│   │   ├── update-password.post.ts   # Change password for logged-in user
│   │   ├── update-admin-password.get.ts  # Hash admin password (task endpoint)
│   │   └── delete.delete.ts          # Delete user account
│   └── utils/
│       ├── login-user.ts             # Find user, verify password, create session
│       ├── authenticate-user.ts      # Verify credentials
│       ├── handle-user-signup.ts     # New user creation + OTP send
│       ├── handle-existing-user.ts   # Handle re-signup of existing users
│       ├── should-reject-signup.ts   # Validation: blocked domains, bad-words, etc.
│       ├── verify-otp-code.ts        # OTP validation logic
│       ├── update-user-password.ts   # bcrypt hash + DB update
│       ├── validate-activation-token.ts
│       └── validate-password-token.ts
└── tests/
    ├── auth-utils.test.ts
    └── user.test.ts
```

---

## Auth Flow

### Signup

1. User submits email + password + username
2. `should-reject-signup` validates: no blocked domains, username passes moderation, password strength
3. `handle-user-signup` creates user record (unverified) + sends OTP email
4. User enters OTP → `verify-otp` marks account as verified
5. Redirect to dashboard (session created)

### Login

1. User submits email + password
2. `authenticate-user` looks up user, verifies bcrypt hash
3. Session created via `nuxt-auth-utils` `setUserSession()`
4. Redirect to original destination (via `redirectCookieName` cookie)

### Password Reset

1. User requests reset → email sent with signed token
2. User clicks link → `password-reset.get.ts` validates token
3. User submits new password → `password-reset.post.ts` hashes + updates

### Admin Password

Admin passwords are seeded as plain text and hashed **on server startup** by the Nitro plugin at `layers/seed/server/plugins/update-admin-password.ts`. For remote updates without a restart, call the task endpoint via `pnpm db:update-admin-password`.

---

## Route Middleware

### `authenticated` (app/middleware/authenticated.ts)

Redirects unauthenticated users to `/?showLogin=true`. Used on all `/dashboard/*` routes.

```ts
definePageMeta({ middleware: ['authenticated'] })
```

### `login` (app/middleware/login.ts)

Redirects already-authenticated users away from `/login` and `/signup`.

### `draft-owner` (app/middleware/draft-owner.ts)

Ensures the current user is the owner of the draft listing being edited.

---

## Session Type

Defined in `auth.d.ts` and used via `useUserSession()` (from `nuxt-auth-utils`):

```ts
interface UserSession {
  user: {
    id: number
    email: string
    username: string | null
    avatar: string | null
    isAdmin: boolean
    isVerified: boolean
  }
}
```

Access anywhere:
```ts
const { user, loggedIn } = useUserSession()
```

---

## Runtime Config

```ts
// nuxt.config.ts (auth layer)
runtimeConfig: {
  TASK_SECRET: process.env.TASK_SECRET,        // For admin task endpoints
  public: {
    redirectCookieName: "redirect",             // Cookie name for post-login redirect
    loginUrl: "/login",
    DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV,
  }
}
```

---

## Security Notes

- Passwords hashed with bcrypt (via `nuxt-auth-utils` `hashPassword`)
- OTP codes are time-limited and single-use
- Password reset tokens are signed and expire
- Admin task endpoint protected by `TASK_SECRET` query param + optional Cloudflare Access on staging
- `should-reject-signup` runs bad-words moderation on username
