<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :ui="{
          title: 'title-sm m-0!',
        }"
      >
        <template #title>
          <MoleculesDashboardBreadcrumb />
        </template>

        <template #right>
          <OrganismsDashboardNotificationButton />
        </template>

      </UDashboardNavbar>
      <UNavigationMenu highlight variant="pill" :items="accountNavigationItems" class="hidden sm:flex ml-4" color="secondary" />
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <AtomsDashboardFormContainer>
        <UForm :schema="profileSchema" :state="state" @submit="onSubmit">
          <OrganismsDashboardAccountHeroCard title="Setup your profile" description="Create your profile information to fully act" label="Save Changes" />

          <AtomsDashboardForm>
            <UFormField label="First Name" name="firstName" required orientation="horizontal" description="Only your username will be displayed" class="" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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
                  leadingIcon: 'text-(--foreground-200)/50',
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Last Name" name="lastName" required orientation="horizontal" description="Your family name" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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
                  leadingIcon: 'text-(--foreground-200)/50',
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Username" name="username" required orientation="horizontal" description="Your public username" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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
                  leadingIcon: 'text-(--foreground-200)/50',
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <OrganismsDashboardProfileAddressLookup v-model="state.address" :pending="pending" />

            <USeparator class="my-4" />

            <UFormField label="Phone Number" name="phoneNumber" orientation="horizontal" description="Your contact phone number" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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
                  leadingIcon: 'text-(--foreground-200)/50',
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Avatar" name="avatar" orientation="horizontal" description="URL to your profile picture" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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
                  leadingIcon: 'text-(--foreground-200)/50',
                }"
              >
                <template #leading>
                  <p class="body-sm">https://</p>
                </template>
              </UInput>
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Bio" name="bio" orientation="horizontal" description="A short description of yourself" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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

            <UFormField label="Your Intent" name="intents" description="Please enter your site interests and intent" help="You can select multiple" orientation="horizontal" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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

            <UFormField label="Interests" name="interests" description="Please enter your personal interests" help="Remove tags by clicking the 'x' on each" orientation="horizontal" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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
import { profileIntents } from "~~/layers/dashboard/app/composables/useProfileForm";

definePageMeta({
  middleware: ["authenticated"],
  layout: "dashboard",
});

const { accountNavigationItems } = useDashboardNavigation();

const { state, pending, onSubmit, profileSchema } = await useProfileForm();
const intents = profileIntents;

</script>
