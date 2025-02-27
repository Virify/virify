<script setup lang="ts">
import { Html, Text, Button, Container, Section, Heading } from "@vue-email/components";
defineProps<{ token: string, userEmail: string, baseUrl: string }>();
</script>

<template>
  <Html lang="en">
    <Container style="background-color: #f3f4f6; padding: 20px;">
      <Section style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center;">
        <Heading style="color: #6b46c1; font-size: 24px; margin-bottom: 20px;">Welcome to Virify!</Heading>
        <Text style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
          Thank you for signing up. Please click the button below to activate your account:
        </Text>
        <Button :href="baseUrl + `/activate/` + token + `?email=` + userEmail" style="background-color: #6b46c1; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none;">
          Activate Account
        </Button>
        <Text style="color: #4a5568; font-size: 14px; margin-top: 20px;">
          If you did not sign up for this account, please ignore this email.
        </Text>
      </Section>
    </Container>
  </Html>
</template>