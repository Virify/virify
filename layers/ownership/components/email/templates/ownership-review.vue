<template>
  <Html lang="en">
    <Container style="background-color: #f3f4f6; padding: 20px">
      <Section
        style="background-color: #ffffff; border-radius: 8px; padding: 20px"
      >
        <Heading style="color: #1a202c; font-size: 22px; margin-bottom: 16px">
          Ownership Verification Request
        </Heading>

        <Text style="color: #4a5568; font-size: 15px">
          A user has submitted ownership documents for review.
        </Text>

        <Hr
          style="margin: 16px 0; border: none; border-top: 1px solid #e2e8f0"
        />

        <Section style="margin-bottom: 12px">
          <Text
            style="
              color: #2d3748;
              font-weight: bold;
              font-size: 13px;
              margin-bottom: 2px;
            "
            >User</Text
          >
          <Text style="color: #4a5568; font-size: 15px; margin: 0 0 2px">
            <strong>First name:</strong> {{ firstName ?? "—" }}
          </Text>
          <Text style="color: #4a5568; font-size: 15px; margin: 0 0 2px">
            <strong>Last name:</strong> {{ lastName ?? "—" }}
          </Text>
          <Text style="color: #4a5568; font-size: 15px; margin: 0">
            <strong>Email:</strong> {{ userEmail }}
          </Text>
        </Section>

        <Section style="margin-bottom: 12px">
          <Text
            style="
              color: #2d3748;
              font-weight: bold;
              font-size: 13px;
              margin-bottom: 4px;
            "
            >Documents</Text
          >
          <Text style="color: #4a5568; font-size: 14px; margin: 0 0 4px">
            1.
            <Link :href="docOneUrl" style="color: #2563eb">{{
              docOneName
            }}</Link>
          </Text>
          <Text style="color: #4a5568; font-size: 14px; margin: 0">
            2.
            <Link :href="docTwoUrl" style="color: #2563eb">{{
              docTwoName
            }}</Link>
          </Text>
        </Section>

        <Hr
          style="margin: 16px 0; border: none; border-top: 1px solid #e2e8f0"
        />

        <Section style="margin-top: 8px">
          <Button
            :href="approveUrl"
            style="
              background-color: #16a34a;
              color: #ffffff;
              padding: 10px 24px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: bold;
              text-decoration: none;
              display: inline-block;
              margin-right: 12px;
            "
          >
            Approve
          </Button>
          <Button
            :href="denyUrl"
            style="
              background-color: #dc2626;
              color: #ffffff;
              padding: 10px 24px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: bold;
              text-decoration: none;
              display: inline-block;
            "
          >
            Deny
          </Button>
        </Section>

        <Hr
          style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0"
        />
        <Text style="color: #718096; font-size: 12px">
          This email was generated automatically by the Virify platform.
        </Text>
      </Section>
    </Container>
  </Html>
</template>
<script setup lang="ts">
import {
  Html,
  Text,
  Container,
  Section,
  Heading,
  Hr,
  Button,
  Link,
} from "@vue-email/components";
defineProps<{
  firstName: string | null;
  lastName: string | null;
  userEmail: string;
  draftListingId: number;
  docOneUrl: string;
  docOneName: string;
  docTwoUrl: string;
  docTwoName: string;
  approveUrl: string;
  denyUrl: string;
}>();
</script>
