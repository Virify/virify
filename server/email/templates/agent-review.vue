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
  token: string;
}>();
</script>

<template>
  <Html lang="en">
    <Container style="background-color: #f3f4f6; padding: 20px;">
      <Section style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center;">
        <Heading style="color: #22c55e; font-size: 24px; margin-bottom: 20px;"><strong>Virify New Estate Agent Review!</strong></Heading>
        <Text style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
          <strong>We have a new Estate Agent signup. Please click the button below once you have reviewed and verified the agent:</strong>
        </Text>
        <Text>
          <strong>Email: </strong> {{ email }}
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
        <Text style="margin-top: 20px;">
          <strong>Click the button below to activate the account:</strong>
        </Text>
        <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
          <Button :href="baseUrl + '/agent/review/' + token + '?approve=true&email=' + email" style="background-color: #22c55e; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none;">
            <strong>Approve Review</strong>
          </Button>
          <Button :href="baseUrl + '/agent/review/' + token + '?approve=false&email=' + email" style="background-color: #e3342f; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none;">
            <strong>Deny Review</strong>
          </Button>
        </div>
        <Text style="color: #4a5568; font-size: 14px; margin-top: 20px;">
          <strong>This is for internal use only. If you did not sign up for this account, please ignore this email.</strong>
        </Text>
      </Section>
    </Container>
  </Html>
</template>