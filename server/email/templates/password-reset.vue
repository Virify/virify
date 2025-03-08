<script setup lang="ts">
import { Html, Text, Button, Container, Section, Heading } from "@vue-email/components";
defineProps<{ token: string, baseUrl: string }>();
</script>

<template>
  <Html lang="en">
    <Container style="background-color: #f3f4f6; padding: 20px;">
      <Section style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center;">
        <Heading style="color: #22c55e; font-size: 24px; margin-bottom: 20px;">Password Reset Request! Virify!</Heading>
        <Text style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
          So you have forgtotten your password? No problem! Please click the button below to reset your password:
        </Text>
        <Button :href="baseUrl + `/password/reset/` + token" style="background-color: #22c55e; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none;">
          Reset Password
        </Button>
        <Text style="color: #4a5568; font-size: 14px; margin-top: 20px;">
          If you did not sign up for this account, please ignore this email.
        </Text>
      </Section>
    </Container>
  </Html>
</template>