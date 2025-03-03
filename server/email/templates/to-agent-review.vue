<script setup lang="ts">
import { Html, Text, Container, Section, Heading } from "@vue-email/components";
defineProps<{
  email: string;
  businessName: string;
  mainContact: string;
  addressLine: string;
  city: string;
  county: string;
  country: string;
  postcode: string;
  registrationNumber: string;
}>();
</script>

<template>
  <Html lang="en">
    <Container style="background-color: #f3f4f6; padding: 20px;">
      <Section style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center;">
        <Heading style="color: #22c55e; font-size: 24px; margin-bottom: 20px;"><strong>Thank You for Signing Up!</strong></Heading>
        <Text style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
          <strong>We are currently reviewing the information you have provided during signup. We will be in touch with you soon.</strong>
        </Text>
        <Text>
          <strong>Business Name:</strong> {{ businessName }}
        </Text>
        <Text>
          <strong>Main Contact:</strong> {{ mainContact }}
        </Text>
        <Text>
          <strong>Address:</strong> {{ addressLine }}, {{ city }}, {{ county }}, {{ country }}, {{ postcode }}
        </Text>
        <Text>
          <strong>Registration Number:</strong> {{ registrationNumber }}
        </Text>
        <Text style="color: #4a5568; font-size: 14px; margin-top: 20px;">
          <strong>This is for internal use only. If you did not sign up for this account, please ignore this email.</strong>
        </Text>
      </Section>
    </Container>
  </Html>
</template>