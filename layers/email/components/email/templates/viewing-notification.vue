<script setup lang="ts">
import { computed } from "vue";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Img,
} from "@vue-email/components";

const props = defineProps<{
  senderName: string;
  senderAvatar?: string;
  eventType: "requested" | "accepted" | "rescheduled" | "declined" | "cancelled";
  proposedDates: string[];
  preferredTimes?: string[];
  counterProposedAt?: string;
  notes?: string;
  listingAddress?: string;
  listingPrice?: string;
  listingImage?: string;
  conversationUrl: string;
}>();

const previewText = computed(() => {
  if (props.eventType === "requested") return `${props.senderName} has requested a viewing`;
  if (props.eventType === "accepted") return "Your viewing has been confirmed";
  if (props.eventType === "declined") return "Your viewing request was declined";
  if (props.eventType === "cancelled") return `${props.senderName} has cancelled the viewing`;
  return `${props.senderName} has proposed a new viewing time`;
});

const headingText = computed(() => {
  if (props.eventType === "requested") return "Viewing Request";
  if (props.eventType === "accepted") return "Viewing Confirmed";
  if (props.eventType === "declined") return "Viewing Declined";
  if (props.eventType === "cancelled") return "Viewing Cancelled";
  return "New Viewing Time";
});

const bodyText = computed(() => {
  if (props.eventType === "requested") return `${props.senderName} has requested a viewing.`;
  if (props.eventType === "accepted") return "Your viewing has been confirmed.";
  if (props.eventType === "declined") return "Your viewing request has been declined.";
  if (props.eventType === "cancelled") return `${props.senderName} has cancelled the viewing.`;
  return `${props.senderName} has proposed a new viewing time.`;
});

const ctaLabel = computed(() => {
  if (props.eventType === "accepted") return "View Viewing Details";
  if (props.eventType === "declined" || props.eventType === "cancelled") return "View Viewings";
  return "View Conversation";
});
</script>

<template>
  <Html lang="en">
    <Head />
    <Preview>{{ previewText }}</Preview>
    <Body
      style="background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0;"
    >
      <Container style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

        <!-- Header -->
        <Section
          style="background-color: #2D2D4F; background: linear-gradient(135deg, #2D2D4F 0%, #FC7239 100%); border-radius: 12px 12px 0 0; padding: 40px 32px; text-align: center;"
        >
          <Heading
            style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: -0.5px;"
          >
            Virify
          </Heading>
          <Text style="color: #ffffff; font-size: 18px; margin: 0; opacity: 0.95;">
            {{ headingText }}
          </Text>
        </Section>

        <!-- Main Content -->
        <Section
          style="background-color: #ffffff; padding: 40px 32px; border-radius: 0 0 12px 12px;"
        >

          <!-- Sender identity -->
          <div style="display: flex; align-items: center; gap: 12px; margin: 0 0 24px 0;">
            <Img
              v-if="senderAvatar"
              :src="senderAvatar"
              :alt="senderName"
              width="48"
              height="48"
              style="border-radius: 50%; object-fit: cover; flex-shrink: 0;"
            />
            <div
              v-else
              style="width: 48px; height: 48px; border-radius: 50%; background-color: #FC7239; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
            >
              <Text
                style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; line-height: 1;"
              >
                {{ senderName?.charAt(0)?.toUpperCase() }}
              </Text>
            </div>
            <Text style="color: #1a1a1a; font-size: 18px; line-height: 1.6; margin: 0;">
              {{ bodyText }}
            </Text>
          </div>

          <!-- Proposed dates / time preferences -->
          <Section
            style="background-color: #f9fafb; border-left: 4px solid #FC7239; border-radius: 4px; padding: 20px 24px; margin: 0 0 24px 0;"
          >
            <Text
              style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px 0;"
            >
              {{ eventType === "rescheduled" ? "Original Proposed Dates" : "Proposed Dates" }}
            </Text>
            <Text
              v-for="date in proposedDates"
              :key="date"
              style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 0 0 4px 0;"
            >
              {{ date }}
            </Text>
            <Text
              v-if="preferredTimes && preferredTimes.length"
              style="color: #6b7280; font-size: 14px; margin: 8px 0 0 0;"
            >
              Preferred times: {{ preferredTimes.join(', ') }}
            </Text>
          </Section>

          <!-- Counter-proposed date/time (rescheduled only) -->
          <Section
            v-if="eventType === 'rescheduled' && counterProposedAt"
            style="background-color: #fff7ed; border-left: 4px solid #2D2D4F; border-radius: 4px; padding: 20px 24px; margin: 0 0 24px 0;"
          >
            <Text
              style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px 0;"
            >
              New Proposed Time
            </Text>
            <Text style="color: #1a1a1a; font-size: 16px; font-weight: 600; margin: 0;">
              {{ counterProposedAt }}
            </Text>
          </Section>

          <!-- Notes -->
          <Section
            v-if="notes"
            style="background-color: #f9fafb; border-radius: 4px; padding: 16px 24px; margin: 0 0 24px 0;"
          >
            <Text
              style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px 0;"
            >
              Notes
            </Text>
            <Text
              style="color: #1a1a1a; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;"
            >
              {{ notes }}
            </Text>
          </Section>

          <!-- Listing details -->
          <Section
            v-if="listingAddress"
            style="background-color: #f9fafb; border-radius: 8px; padding: 20px 24px; margin: 0 0 32px 0;"
          >
            <Text
              style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px 0;"
            >
              Property
            </Text>
            <Img
              v-if="listingImage"
              :src="listingImage"
              alt="Property image"
              width="536"
              style="border-radius: 6px; margin: 0 0 12px 0; max-width: 100%;"
            />
            <Text
              style="color: #2D2D4F; font-size: 15px; font-weight: 600; margin: 0 0 4px 0;"
            >
              {{ listingAddress }}
            </Text>
            <Text
              v-if="listingPrice"
              style="color: #FC7239; font-size: 16px; font-weight: 700; margin: 0;"
            >
              {{ listingPrice }}
            </Text>
          </Section>

          <!-- CTA -->
          <Section style="text-align: center; margin: 0 0 32px 0;">
            <Link
              :href="conversationUrl"
              style="background-color: #FC7239; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; display: inline-block;"
            >
              {{ ctaLabel }}
            </Link>
          </Section>

          <Hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

          <Text
            style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 8px 0; text-align: center;"
          >
            You received this email because you have email notifications enabled.
          </Text>
          <Text
            style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;"
          >
            <strong style="color: #2D2D4F;">Virify</strong> — The UK's first private property
            marketplace
          </Text>
        </Section>

      </Container>
    </Body>
  </Html>
</template>
