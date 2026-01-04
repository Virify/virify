<script setup lang="ts">
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Hr, Link } from "@vue-email/components";

defineProps<{
  name: string;
  email: string;
  telephone: string;
  enquiry: string;
}>();
</script>

<template>
  <Html lang="en">
    <Head />
    <Preview>New contact enquiry from {{ name }}</Preview>
    <Body style="background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0;">
      <Container style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header with Logo -->
        <Section style="background-color: #2D2D4F; background: linear-gradient(135deg, #2D2D4F 0%, #FC7239 100%); border-radius: 12px 12px 0 0; padding: 40px 32px; text-align: center;">
          <Heading style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: -0.5px;">
            Virify
          </Heading>
          <Text style="color: #ffffff; font-size: 18px; margin: 0; opacity: 0.95;">
            New Contact Enquiry 📬
          </Text>
        </Section>

        <!-- Main Content -->
        <Section style="background-color: #ffffff; padding: 40px 32px; border-radius: 0 0 12px 12px;">
          
          <Text style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">
            New enquiry received
          </Text>

          <!-- Contact Details Section -->
          <Section style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 0 0 32px 0;">
            <Heading style="color: #2D2D4F; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">
              Contact Details
            </Heading>

            <table style="width: 100%; margin: 0; padding: 0;">
              <tbody>
                <tr>
                  <td style="padding: 8px 0;">
                    <Text style="color: #6b7280; font-size: 14px; margin: 0;">
                      <strong style="color: #2D2D4F;">Name:</strong>
                    </Text>
                  </td>
                  <td style="padding: 8px 0;">
                    <Text style="color: #1a1a1a; font-size: 15px; margin: 0;">
                      {{ name }}
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <Text style="color: #6b7280; font-size: 14px; margin: 0;">
                      <strong style="color: #2D2D4F;">Email:</strong>
                    </Text>
                  </td>
                  <td style="padding: 8px 0;">
                    <Text style="color: #1a1a1a; font-size: 15px; margin: 0;">
                      <Link :href="`mailto:${email}`" style="color: #FC7239; text-decoration: none;">{{ email }}</Link>
                    </Text>
                  </td>
                </tr>
                <tr v-if="telephone">
                  <td style="padding: 8px 0;">
                    <Text style="color: #6b7280; font-size: 14px; margin: 0;">
                      <strong style="color: #2D2D4F;">Telephone:</strong>
                    </Text>
                  </td>
                  <td style="padding: 8px 0;">
                    <Text style="color: #1a1a1a; font-size: 15px; margin: 0;">
                      <Link :href="`tel:${telephone}`" style="color: #FC7239; text-decoration: none;">{{ telephone }}</Link>
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <!-- Enquiry Section -->
          <Section style="margin: 0 0 32px 0;">
            <Heading style="color: #2D2D4F; font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">
              Enquiry
            </Heading>
            <Section style="background-color: #f9fafb; border-left: 4px solid #FC7239; border-radius: 4px; padding: 20px 24px;">
              <Text style="color: #1a1a1a; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">{{ enquiry }}</Text>
            </Section>
          </Section>

          <Hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

          <!-- Footer -->
          <Text style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0; text-align: center;">
            This enquiry was submitted via the Virify contact form
          </Text>

          <Text style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">
            <strong style="color: #2D2D4F;">Virify</strong> - The UK's first private property marketplace<br/>
            Skip the estate agent. Save thousands.
          </Text>
        </Section>

      </Container>
    </Body>
  </Html>
</template>
