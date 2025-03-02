<script setup lang="ts">
import { Html, Text, Button, Container, Section, Heading } from "@vue-email/components";
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
        <Heading style="color: #22c55e; font-size: 24px; margin-bottom: 20px;">Welcome to Virify!</Heading>
        <Text style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
          We have a new Estate Agent signup. Please click the button below once you have reviewed and verified the agent:
        </Text>
        <Button :href="baseUrl + email" style="background-color: #22c55e; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none;">
          Activate Account
        </Button>
        <Text style="color: #4a5568; font-size: 14px; margin-top: 20px;">
          This is for internal use only. If you did not sign up for this account, please ignore this email.
        </Text>
      </Section>
    </Container>
  </Html>
</template>