<script setup lang="ts">
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Hr, Link, Img } from "@vue-email/components";

defineProps<{
  senderName: string;
  message: string;
  conversationUrl: string;
  listingAddress?: string;
  listingPrice?: string;
  listingImage?: string;
  isReply?: boolean;
}>();
</script>

<template>
  <Html lang="en">
    <Head />
    <Preview>{{ isReply ? `${senderName} replied to your enquiry` : `New enquiry from ${senderName}` }}</Preview>
    <Body style="background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0;">
      <Container style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

        <!-- Header -->
        <Section style="background-color: #2D2D4F; background: linear-gradient(135deg, #2D2D4F 0%, #FC7239 100%); border-radius: 12px 12px 0 0; padding: 40px 32px; text-align: center;">
          <Heading style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: -0.5px;">
            Virify
          </Heading>
          <Text style="color: #ffffff; font-size: 18px; margin: 0; opacity: 0.95;">
            {{ isReply ? 'New Reply 💬' : 'New Enquiry 📬' }}
          </Text>
        </Section>

        <!-- Main Content -->
        <Section style="background-color: #ffffff; padding: 40px 32px; border-radius: 0 0 12px 12px;">

          <Text style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">
            {{ isReply ? `${senderName} has replied to your enquiry.` : `You have a new enquiry from ${senderName}.` }}
          </Text>

          <!-- Message -->
          <Section style="background-color: #f9fafb; border-left: 4px solid #FC7239; border-radius: 4px; padding: 20px 24px; margin: 0 0 32px 0;">
            <Text style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px 0;">
              {{ isReply ? 'Their reply' : 'Their message' }}
            </Text>
            <Text style="color: #1a1a1a; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">{{ message }}</Text>
          </Section>

          <!-- Listing details (if applicable) -->
          <Section v-if="listingAddress" style="background-color: #f9fafb; border-radius: 8px; padding: 20px 24px; margin: 0 0 32px 0;">
            <Text style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px 0;">
              Property
            </Text>
            <Img v-if="listingImage" :src="listingImage" alt="Property image" width="536" style="border-radius: 6px; margin: 0 0 12px 0; max-width: 100%;" />
            <Text style="color: #2D2D4F; font-size: 15px; font-weight: 600; margin: 0 0 4px 0;">{{ listingAddress }}</Text>
            <Text v-if="listingPrice" style="color: #FC7239; font-size: 16px; font-weight: 700; margin: 0;">{{ listingPrice }}</Text>
          </Section>

          <!-- CTA -->
          <Section style="text-align: center; margin: 0 0 32px 0;">
            <Link
              :href="conversationUrl"
              style="background-color: #FC7239; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; display: inline-block;"
            >
              View Conversation
            </Link>
          </Section>

          <Hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

          <Text style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 8px 0; text-align: center;">
            You received this email because you have email notifications enabled.
          </Text>
          <Text style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">
            <strong style="color: #2D2D4F;">Virify</strong> — The UK's first private property marketplace
          </Text>
        </Section>

      </Container>
    </Body>
  </Html>
</template>
