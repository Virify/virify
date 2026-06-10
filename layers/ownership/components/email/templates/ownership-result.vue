<script setup lang="ts">
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
  } from "@vue-email/components";

  defineProps<{
    approved: boolean;
    draftListingId: number;
    dashboardUrl: string;
  }>();
</script>

<template>
  <Html lang="en">
    <Head />
    <Preview
      >{{
        approved ?
          "Your ownership has been verified"
        : "Your ownership documents could not be verified"
      }}
      — Virify</Preview
    >
    <Body
      style="
        background-color: #f5f5f5;
        font-family:
          -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto,
          &quot;Helvetica Neue&quot;, Arial, sans-serif;
        margin: 0;
        padding: 0;
      "
    >
      <Container style="max-width: 600px; margin: 0 auto; padding: 40px 20px">
        <!-- Header -->
        <Section
          style="
            background-color: #2d2d4f;
            background: linear-gradient(135deg, #2d2d4f 0%, #fc7239 100%);
            border-radius: 12px 12px 0 0;
            padding: 40px 32px;
            text-align: center;
          "
        >
          <Heading
            style="
              color: #ffffff;
              font-size: 32px;
              font-weight: 700;
              margin: 0 0 16px 0;
              letter-spacing: -0.5px;
            "
          >
            Virify
          </Heading>
          <Text style="color: #ffffff; font-size: 18px; margin: 0; opacity: 0.95">
            {{ approved ? "Ownership Verified" : "Ownership Denied" }}
          </Text>
        </Section>

        <!-- Main Content -->
        <Section
          style="
            background-color: #ffffff;
            padding: 40px 32px;
            border-radius: 0 0 12px 12px;
          "
        >
          <!-- Icon row -->
          <div style="text-align: center; margin: 0 0 28px 0">
            <div
              :style="`display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 50%; background-color: ${approved ? '#dcfce7' : '#fee2e2'};`"
            >
              <Text :style="`font-size: 36px; margin: 0; line-height: 1;`">{{
                approved ? "✅" : "❌"
              }}</Text>
            </div>
          </div>

          <!-- Heading -->
          <Heading
            :style="`color: ${approved ? '#16a34a' : '#dc2626'}; font-size: 22px; font-weight: 700; text-align: center; margin: 0 0 16px 0;`"
          >
            {{
              approved ?
                "Your ownership has been verified!"
              : "Your ownership documents could not be verified."
            }}
          </Heading>

          <!-- Body text -->
          <Text
            style="
              color: #4b5563;
              font-size: 15px;
              line-height: 1.6;
              margin: 0 0 24px 0;
              text-align: center;
            "
          >
            <template v-if="approved">
              Your submitted documents for listing
              <strong style="color: #1a1a1a">#{{ draftListingId }}</strong> have been
              reviewed and approved. Your listing is now fully verified — you can proceed
              to publish it from your dashboard.
            </template>
            <template v-else>
              Your submitted documents for listing
              <strong style="color: #1a1a1a">#{{ draftListingId }}</strong> could not be
              verified. Please re-submit with valid proof of ownership from your
              dashboard.
            </template>
          </Text>

          <!-- CTA -->
          <Section style="text-align: center; margin: 0 0 32px 0">
            <Link
              :href="dashboardUrl"
              style="
                background-color: #fc7239;
                color: #ffffff;
                text-decoration: none;
                font-size: 16px;
                font-weight: 600;
                padding: 14px 32px;
                border-radius: 8px;
                display: inline-block;
              "
            >
              Go to Dashboard
            </Link>
          </Section>

          <Hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0" />

          <Text
            style="
              color: #6b7280;
              font-size: 13px;
              line-height: 1.5;
              margin: 0;
              text-align: center;
            "
          >
            <strong style="color: #2d2d4f">Virify</strong> — The UK's first private
            property marketplace
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
