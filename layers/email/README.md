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
- Welcome emails
- Password reset
- Email verification
- Property notifications
- System alerts

### Email Components
```vue
<template>
  <VEmail>
    <VColumn>
      <VText>Welcome to Virify</VText>
      <VButton href="https://virify.com/login">
        Get Started
      </VButton>
    </VColumn>
  </VEmail>
</template>
```

### Preview Tool
Access the email preview tool at `/email-preview-tool` to:
- Test email templates
- Preview on different screen sizes
- Verify email content
- Debug template issues

## Best Practices
- Design mobile-first email templates
- Test across email clients
- Use semantic HTML structure
- Include plain text versions
- Follow email deliverability best practices
- Handle email sending errors gracefully
