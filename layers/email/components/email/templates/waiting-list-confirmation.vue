<script setup lang="ts">
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Hr, Img, Link } from "@vue-email/components";
defineProps<{ email: string }>();
</script>

<template>
  <Html lang="en">
    <Head />
    <Preview>You're on the Virify waiting list! Get ready for early access to the UK's first open property marketplace.</Preview>
    <Body style="background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0;">
      <Container style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
                <!-- Header with Logo -->
        <Section style="background-color: #2D2D4F; background: linear-gradient(135deg, #2D2D4F 0%, #FC7239 100%); border-radius: 12px 12px 0 0; padding: 40px 32px; text-align: center;">
          <Heading style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: -0.5px;">
            Virify
          </Heading>
          <Text style="color: #ffffff; font-size: 18px; margin: 0; opacity: 0.95;">
            You're on the list! 🎉
          </Text>
        </Section>

        <!-- Main Content -->
        <Section style="background-color: #ffffff; padding: 40px 32px; border-radius: 0 0 12px 12px;">
          
          <Text style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">
            Hi,
          </Text>

          <Text style="color: #1a1a1a; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for joining the Virify waiting list! You're now part of an exclusive group who will be the first to experience the UK's first open property marketplace.
          </Text>

          <Text style="color: #1a1a1a; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
            Virify is AI-powered, data-driven, and brutally honest. It's property marketing, made easy.
          </Text>

          <!-- Benefits Section -->
          <Section style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 0 0 32px 0;">
            <Heading style="color: #2D2D4F; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">
              So What's Next?
            </Heading>

            <table style="width: 100%; margin: 0; padding: 0;">
              <tbody>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <Text style="color: #FC7239; font-size: 20px; margin: 0; padding-right: 12px;">✓</Text>
                  </td>
                  <td style="padding: 8px 0;">
                    <Text style="color: #1a1a1a; font-size: 15px; line-height: 1.5; margin: 0;">
                      <strong style="color: #2D2D4F;">Early Access</strong> - Be the first to use our platform before public launch
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <Text style="color: #FC7239; font-size: 20px; margin: 0; padding-right: 12px;">✓</Text>
                  </td>
                  <td style="padding: 8px 0;">
                    <Text style="color: #1a1a1a; font-size: 15px; line-height: 1.5; margin: 0;">
                      <strong style="color: #2D2D4F;">Special Benefits</strong> - Reduced fees and priority support for early members
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <Text style="color: #FC7239; font-size: 20px; margin: 0; padding-right: 12px;">✓</Text>
                  </td>
                  <td style="padding: 8px 0;">
                    <Text style="color: #1a1a1a; font-size: 15px; line-height: 1.5; margin: 0;">
                      <strong style="color: #2D2D4F;">Shape the Platform</strong> - Your feedback helps us build the best experience
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Text style="color: #1a1a1a; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
            We're working hard to launch soon. Keep an eye on your inbox - we'll send you updates and your exclusive early access invitation.
          </Text>

          <Hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

          <!-- Footer -->
          <Text style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0; text-align: center;">
            This email was sent to <strong>{{ email }}</strong>
          </Text>

          <Text style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">
            <strong style="color: #2D2D4F;">Virify</strong> - The UK's first open property marketplace.<br/>
            Take control. Save thousands.
          </Text>
        </Section>

        <!-- Footer Links -->
        <Section style="text-align: center; padding: 24px 0 0 0;">
          <Text style="color: #9ca3af; font-size: 12px; margin: 0;">
            <Link href="https://virify.co.uk" style="color: #FC7239; text-decoration: none;">Visit Website</Link>
            {' • '}
            <Link href="https://virify.co.uk/privacy" style="color: #FC7239; text-decoration: none;">Privacy Policy</Link>
            {' • '}
            <Link href="https://virify.co.uk/terms" style="color: #FC7239; text-decoration: none;">Terms</Link>
          </Text>
        </Section>

      </Container>
    </Body>
  </Html>
</template>
