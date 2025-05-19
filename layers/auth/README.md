# Auth Layer

## Overview
The authentication layer provides secure user authentication and authorization functionality for the Virify platform. It integrates with Nuxt Auth Utils for session management and includes custom middleware for route protection.

## Features
- 🔐 Secure authentication with login and signup flows
- 🔑 Password reset functionality
- 🛡️ Protected route middleware
- 📝 User registration with email verification
- 🔒 Type-safe authentication utilities

## Directory Structure
- `auth.d.ts`: TypeScript type declarations for auth
- `server/`: Server-side authentication logic
  - API routes for authentication
  - Password reset handlers
  - User verification endpoints
- `tests/`: Test suites for auth functionality

## Setup
The auth layer is automatically configured through the Nuxt module system. Ensure your `.env` includes the necessary authentication-related variables.

## Usage

### Protected Routes
Use the auth middleware to protect routes that require authentication:

```ts
// In your page component
definePageMeta({
  middleware: ['auth-redirect']
})
```

### Login Page Integration
```vue
<template>
  <form @submit.prevent="handleLogin">
    <AtomsInput 
      v-model="email" 
      type="email" 
      required 
    />
    <AtomsInput 
      v-model="password" 
      type="password" 
      required 
    />
    <AtomsButton type="submit">
      Log In
    </AtomsButton>
  </form>
</template>
```

### Password Reset Flow
The auth layer provides a complete password reset flow including:
- Reset request page
- Token validation
- Password update functionality

## Best Practices
- Always use HTTPS in production
- Implement proper error handling for auth failures
- Follow security best practices for password handling
- Use type-safe auth utilities
- Test auth flows thoroughly
- Handle edge cases in auth redirects
