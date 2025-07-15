# Email Layer

## Overview
The email layer manages all transactional email communications in the Virify platform. It utilizes Vue Email for component-based email templates and AWS SES (Simple Email Service) for reliable email delivery.

## Features
- 📧 Vue Email for component-based templates
- ⚡ AWS SES integration for reliable delivery
- 🎨 Responsive email templates
- 🔍 Email preview and testing tools
- 📝 Reusable email components

## Directory Structure
- `components/`: Email template components
  - Reusable email layout components
  - Transactional email templates
- `server/`: Email sending logic and AWS SES integration
- `tests/`: Email testing and validation

## Setup

### Prerequisites
- AWS SES credentials
- AWS SES verified email addresses

### Configuration
Add AWS credentials to your `.env`:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_aws_region
```

## Email Templates
The email layer includes templates for:
- **Welcome emails**: New user onboarding
- **Password reset**: Secure password recovery
- **Email verification**: Account verification flow
- **Property notifications**: New listing alerts
- **System alerts**: Important system communications
- **Account updates**: Profile and setting changes

### Email Components
```vue
<template>
  <VEmail>
    <VHead>
      <VTitle>Welcome to Virify</VTitle>
    </VHead>
    <VBody>
      <VContainer>
        <VSection>
          <VText>Welcome to the future of property management</VText>
          <VButton href="https://virify.com/login">
            Get Started
          </VButton>
        </VSection>
      </VContainer>
    </VBody>
  </VEmail>
</template>
```

### Sending Emails
```typescript
// Server-side email sending
import { sendEmail } from "~~/layers/email/server/utils/send-email";

await sendEmail({
  to: user.email,
  subject: "Welcome to Virify",
  template: "welcome",
  props: {
    userName: user.name,
    loginUrl: "https://virify.com/login"
  }
});
```
  </VEmail>
</template>
```

### Preview Tool
Access the email preview tool at `/email-preview-tool` to:
- **Test email templates**: Preview all email types
- **Preview on different screen sizes**: Desktop, mobile, tablet
- **Verify email content**: Check formatting and links
- **Debug template issues**: Identify rendering problems
- **Test with sample data**: Use realistic test data
- **Export HTML**: Get compiled email HTML

## AWS SES Configuration

### Verified Identities
Ensure your sending email addresses are verified in AWS SES:
1. Log into AWS SES Console
2. Navigate to "Verified identities"
3. Add and verify your domain or email addresses
4. Configure DKIM authentication for better deliverability

### Production Setup
For production deployments:
- Move out of AWS SES sandbox mode
- Set up proper SPF, DKIM, and DMARC records
- Monitor bounce and complaint rates
- Configure SNS notifications for delivery events

## Best Practices
- **Design mobile-first**: Ensure templates work on all devices
- **Test across email clients**: Gmail, Outlook, Apple Mail, etc.
- **Use semantic HTML structure**: Proper heading hierarchy and accessibility
- **Include plain text versions**: For better deliverability
- **Follow email deliverability best practices**: Avoid spam triggers
- **Handle email sending errors gracefully**: Retry logic and error logging
- **Track email metrics**: Open rates, click rates, bounces
- **Personalize content**: Use user data for relevant messaging
