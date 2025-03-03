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
  baseUrl: string;
}>();
</script>

<template>
  <Html lang="en">
    <Container style="background-color: #f3f4f6; padding: 20px;">
      <Section style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center;">
        <Heading style="color: #e3342f; font-size: 24px; margin-bottom: 20px;"><strong>Your Account Has Been Denied</strong></Heading>
        <Text style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
          <strong>We regret to inform you that your account has been denied. If you have any questions or need further information, please contact our support team.</strong>
        </Text>
        <Text style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
          <strong>This is the information we used to do our review:</strong>
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
        <Text style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
          You can reach us at <a href="mailto:support@virify.com" style="color: #22c55e;">support@virify.com</a>.
        </Text>
        <Text style="color: #4a5568; font-size: 14px; margin-top: 20px;">
          <strong>If you did not sign up for this account, please ignore this email.</strong>
        </Text>
      </Section>
    </Container>
  </Html>
</template>