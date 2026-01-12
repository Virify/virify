<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Account"
        :ui="{
          title: 'title-sm m-0!',
        }"
      />
      <UNavigationMenu highlight variant="pill" :items="accountNavigationItems" class="hidden sm:flex ml-4" color="secondary" />
    </template>

    <template #body>
      <AtomsDashboardFormContainer>
        <UForm :schema="profileSchema" :state="state" @submit="onSubmit">
          <OrganismsDashboardAccountHeroCard
            title="Edit Your Profile"
            description="Update your profile information to keep your account up to date. We use this information to personalize your experience and for verification."
            label="Save Changes" />

          <AtomsDashboardForm>
            <UFormField label="First Name" name="firstName" required orientation="horizontal" description="Only your username will be displayed" class="">
              <template #error="{ error }">
                <p>{{ error }}</p>
              </template>
              <UInput
                v-model="state.firstName"
                type="text"
                variant="subtle"
                icon="i-lucide-user-pen"
                placeholder="First Name"
                :loading="pending"
                color="secondary"
                class="w-full md:w-80"
                :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50'
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Last Name" name="lastName" required orientation="horizontal" description="Your family name">
              <UInput
                v-model="state.lastName"
                variant="subtle"
                type="text"
                icon="i-lucide-user-pen"
                placeholder="Last Name"
                :loading="pending"
                color="secondary"
                class="w-full md:w-80"
                :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50'
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Username" name="username" required orientation="horizontal" description="Your public username">
              <UInput
                v-model="state.username"
                type="text"
                icon="i-lucide-contact"
                placeholder="Username"
                variant="subtle"
                :loading="pending"
                color="secondary"
                class="w-full md:w-80"
                :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50'
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <OrganismsDashboardProfileAddressLookup v-model="state.address" :pending="pending" />

            <USeparator class="my-4" />

            <UFormField label="Phone Number" name="phoneNumber" orientation="horizontal" description="Your contact phone number">
              <UInput
                v-model="state.phoneNumber"
                type="tel"
                icon="i-lucide-phone"
                placeholder="Phone Number"
                variant="subtle"
                :loading="pending"
                color="secondary"
                class="w-full md:w-80"
                :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50'
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Avatar" name="avatar" orientation="horizontal" description="URL to your profile picture">
              <UInput
                v-model="state.avatar"
                type="url"
                placeholder="avatar"
                variant="subtle"
                :loading="pending"
                color="secondary"
                class="w-full md:w-80"
                :ui="{
                  base: 'pl-16 placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50'
                }"
              >
                <template #leading>
                  <p class="body-sm">https://</p>
                </template>
              </UInput>
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Bio" name="bio" orientation="horizontal" description="A short description of yourself">
              <UTextarea
                v-model="state.bio"
                type="text"
                placeholder="Describe yourself..."
                variant="subtle"
                :loading="pending"
                color="secondary"
                class="w-full md:w-80"
                :ui="{
                  base: 'text-sm placeholder:text-(--foreground-200)/50!',
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Your Intent" name="intents" description="Please enter your site interests and intent" help="You can select multiple" orientation="horizontal">
              <USelect
                v-model="state.intents"
                :items="intents"
                multiple
                variant="subtle"
                placeholder="Select your intent"
                :loading="pending"
                color="secondary"
                :ui="{
                  base: 'w-full! md:w-80!',
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Interests" name="interests" description="Please enter your personal interests" help="Remove tags by clicking the 'x' on each" orientation="horizontal">
              <UInputTags
                v-model="state.interests"
                variant="subtle"
                multiple
                color="secondary"
                :highlight="false"
                :ui="{
                  root: 'w-full! md:w-80! outline-0!',
                  input: 'outline-0!',
                }"
                label="Interests"
                name="interests"
                orientation="horizontal"
              />
            </UFormField>
          </AtomsDashboardForm>
        </UForm>
      </AtomsDashboardFormContainer>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { z } from "zod";
import { UserIntent } from "~~/layers/database/server/database/prisma/generated/enums";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  middleware: ["authenticated"],
  layout: "dashboard",
});

const { data: fullUser, pending } = await useAsyncData("fullUser", () => useRequestFetch()<UserWithAddress>(`/api/user/profile`));

const { accountNavigationItems } = useDashboardNavigation();

type Schema = z.output<typeof profileSchema>;

const state = reactive<Schema>({
  firstName: fullUser.value?.firstName || "",
  lastName: fullUser.value?.lastName || "",
  username: fullUser.value?.username || "",
  email: fullUser.value?.email || "",
  address: fullUser.value?.address || {
    number: null,
    flat: null,
    name: null,
    street: "",
    city: "",
    locality: null,
    county: null,
    district: null,
    country: null,
    postcode: "",
    fullAddress: null,
    lat: null,
    lon: null,
  },
  avatar: fullUser.value?.avatar || "",
  bio: fullUser.value?.bio || "",
  intents: fullUser.value?.intents || [],
  interests: fullUser.value?.interests?.length ? fullUser.value.interests : ["property"],
  phoneNumber: fullUser.value?.phoneNumber || "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // TODO: Handle form submission
  try {
    const response = await $fetch<Schema>("/api/user/profile", {
      method: "PATCH",
      body: event.data,
    });

    if (response) {
      useToast().add({ title: "Success", description: "Profile updated successfully", color: "success" });
      console.log(response);
    }
  } catch (error: any) {
    // proppagate to form
  }
}

const intents: { value: UserIntent; label: string }[] = [
  { value: UserIntent.BUYING, label: "Buying" },
  { value: UserIntent.SELLING, label: "Selling" },
  { value: UserIntent.RENTING, label: "Renting" },
  { value: UserIntent.LANDLORD, label: "Landlord" },
];
</script>
