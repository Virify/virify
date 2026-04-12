# Email Layer

## Overview

The email layer handles all transactional email delivery for Virify. Templates are built as Vue single-file components with `@vue-email/components`, server-side rendered to HTML, and sent via AWS SES (`@aws-sdk/client-ses`).

A preview tool at `/email-preview-tool` lets you visually inspect all templates in development.

## Directory Structure

```
layers/email/
├── components/email/templates/       # Vue Email SFC templates (7 templates)
│   ├── contact-enquiry.vue           # Contact form response
│   ├── enquiry-notification.vue      # New enquiry / enquiry reply
│   ├── password-reset.vue            # Password reset OTP + link
│   ├── support-request.vue           # Support ticket confirmation
│   ├── user-activation.vue           # Account activation OTP + link
│   ├── viewing-notification.vue      # Viewing request / confirmation
│   └── waiting-list-confirmation.vue # Waiting list sign-up confirmation
├── server/
│   ├── email/                        # Per-template send functions
│   │   ├── send-contact-enquiry.ts
│   │   ├── send-enquiry-notification.ts
│   │   ├── send-password-reset.ts
│   │   ├── send-support-request.ts
│   │   ├── send-user-activation.ts
│   │   ├── send-viewing-notification.ts
│   │   └── send-waiting-list-confirmation.ts
│   └── utils/
│       └── ses-sender.ts             # Core AWS SES sender
└── tests/
    ├── email-send.test.ts
    ├── email-templates.test.ts
    └── email-templates-extended.test.ts
```

## Email Templates

| Template | Trigger | Key Props |
|----------|---------|-----------|
| `user-activation.vue` | Account sign-up | `token`, `otpCode` |
| `password-reset.vue` | Forgot password | `passwordToken` |
| `enquiry-notification.vue` | New enquiry / reply | `senderName`, `message`, `listingAddress`, `listingImage`, `isReply` |
| `contact-enquiry.vue` | Contact form submission | `name`, `email`, `message` |
| `support-request.vue` | Support form submission | `ticketNumber`, `subject`, `message` |
| `viewing-notification.vue` | Viewing request/confirmation | `listingAddress`, `proposedDate`, `status` |
| `waiting-list-confirmation.vue` | Waiting list sign-up | `email` |

## How Email Sending Works

Templates are Vue SFCs that use `@vue-email/components` (`Html`, `Body`, `Section`, `Text`, `Button`, `Img`, etc.). The server-side send function:

1. Calls `render(TemplateName, props)` from `@vue-email/render` to produce HTML.
2. Passes the HTML to `ses-sender.ts` which creates an `SES.SendEmailCommand`.
3. SES delivers from `no-reply@virify.co.uk` (region: `eu-west-2`).

```ts
// server/email/send-enquiry-notification.ts (pattern)
import { render } from "@vue-email/render"
import EnquiryNotification from "../../components/email/templates/enquiry-notification.vue"

export async function sendEnquiryNotificationEmail(options: EnquiryNotificationOptions) {
  const html = await render(EnquiryNotification, options)
  await sesSender({ to: options.recipientEmail, subject: "New enquiry on your listing", html })
}
```

Each send function is a named Nitro auto-import available to any server endpoint.

## Environment Variables

```bash
# AWS SES credentials (server-side only)
SES_ACCESS_KEY_ID=AKIA...
SES_SECRET_ACCESS_KEY=...

# Base URL injected into email links and images
EMAIL_BASE_URL=https://virify.co.uk   # public
INTERNAL_EMAIL=team@virify.co.uk      # public — internal recipient
```

## Email Preview Tool

Navigate to `/email-preview-tool` in development to see a live render of any template. The preview middleware (`app/middleware/email-test.ts`) guards this route.

## Testing

Tests use Vitest with a mocked AWS SES client:
- `email-send.test.ts` — verifies the SES `SendEmailCommand` is called with correct parameters
- `email-templates.test.ts` — renders `user-activation` and `password-reset` templates and asserts HTML output
- `email-templates-extended.test.ts` — covers remaining 5 templates
- **Follow email deliverability best practices**: Avoid spam triggers
- **Handle email sending errors gracefully**: Retry logic and error logging
- **Track email metrics**: Open rates, click rates, bounces
- **Personalize content**: Use user data for relevant messaging
