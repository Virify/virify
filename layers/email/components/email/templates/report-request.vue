<script setup lang="ts">
  import { Html, Text, Container, Section, Heading, Hr } from "@vue-email/components";
  defineProps<{
    email: string;
    type: string;
    details: string;
    listingId?: number;
    conversationId?: number;
    userId?: number;
    messageId?: number;
    message?: string;
  }>();
</script>

<template>
  <Html lang="en">
    <Container style="background-color: #f3f4f6; padding: 20px">
      <Section style="background-color: #ffffff; border-radius: 8px; padding: 20px">
        <Heading style="color: #dc2626; font-size: 24px; margin-bottom: 20px">
          New Report Request
        </Heading>

        <Text style="color: #4a5568; font-size: 16px; margin-bottom: 20px">
          A new report request has been submitted via the website help form.
        </Text>

        <Hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0" />

        <Section style="margin-bottom: 15px">
          <Text
            style="color: #2d3748; font-weight: bold; margin-bottom: 5px; font-size: 14px"
          >
            Email:
          </Text>
          <Text style="color: #4a5568; font-size: 16px; margin: 0">
            {{ email }}
          </Text>
        </Section>

        <Section style="margin-bottom: 15px">
          <Text
            style="color: #2d3748; font-weight: bold; margin-bottom: 5px; font-size: 14px"
          >
            Type:
          </Text>
          <Text style="color: #4a5568; font-size: 16px; margin: 0">
            {{ type }}
          </Text>
        </Section>

        <Section style="margin-bottom: 20px">
          <Text
            style="color: #2d3748; font-weight: bold; margin-bottom: 5px; font-size: 14px"
          >
            Details:
          </Text>
          <Text style="color: #4a5568; font-size: 16px; margin: 0; white-space: pre-line">
            {{ details }}
          </Text>
        </Section>

        <Section
          style="margin-bottom: 15px"
          v-if="listingId"
        >
          <Text
            style="color: #2d3748; font-weight: bold; margin-bottom: 5px; font-size: 14px"
          >
            Listing ID:
          </Text>
          <Text style="color: #4a5568; font-size: 16px; margin: 0">
            {{ listingId }}
          </Text>
        </Section>

        <Section
          style="margin-bottom: 15px"
          v-if="conversationId"
        >
          <Text
            style="color: #2d3748; font-weight: bold; margin-bottom: 5px; font-size: 14px"
          >
            Conversation ID:
          </Text>
          <Text style="color: #4a5568; font-size: 16px; margin: 0">
            {{ conversationId }}
          </Text>
        </Section>

        <Section
          style="margin-bottom: 15px"
          v-if="messageId"
        >
          <Text
            style="color: #2d3748; font-weight: bold; margin-bottom: 5px; font-size: 14px"
          >
            Message ID:
          </Text>
          <Text style="color: #4a5568; font-size: 16px; margin: 0">
            {{ messageId }}
          </Text>
        </Section>

        <Section
          style="margin-bottom: 15px"
          v-if="message"
        >
          <Text
            style="color: #2d3748; font-weight: bold; margin-bottom: 5px; font-size: 14px"
          >
            Message Content:
          </Text>
          <Text style="color: #4a5568; font-size: 16px; margin: 0">
            {{ message }}
          </Text>
        </Section>

        <Section
          style="margin-bottom: 15px"
          v-if="userId"
        >
          <Text
            style="color: #2d3748; font-weight: bold; margin-bottom: 5px; font-size: 14px"
          >
            User ID:
          </Text>
          <Text style="color: #4a5568; font-size: 16px; margin: 0">
            {{ userId }}
          </Text>
        </Section>

        <Hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0" />

        <Text style="color: #718096; font-size: 12px; margin-top: 20px">
          This email was automatically generated from the Virify website support form.
        </Text>
      </Section>
    </Container>
  </Html>
</template>
