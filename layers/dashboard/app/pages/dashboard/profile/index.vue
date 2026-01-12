<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Account"
        :ui="{
          title: 'title-sm m-0!',
        }"
      />
      <UNavigationMenu highlight variant="pill" :items="accountNavigationItems" class="hidden sm:flex" />
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-4 lg:gap-4 w-full lg:max-w-2xl mx-auto pt-6">
        <UPageCard
          orientation="horizontal"
          title="Edit Your Profile"
          description="Update your profile information to keep your account up to date."
          variant="ghost"
          :ui="{
            container: 'p-2! justify-between!',
            title: 'title-sm',
            description: 'body-sm',
          }"
        >
          <div class="w-full flex lg:justify-end justify-start">
            <UButton
              variant="solid"
              color="secondary"
              label="Save Changes"
              size="md"
              :ui="{
                label: 'text-(--monochrome-900) body-sm',
                base: 'self-start!',
              }"
            />
          </div>
        </UPageCard>
        <UForm :schema="schema" :state="state">
          <div class="bg-elevated dark:bg-elevated/40 w-full p-6 sm:p-6 rounded-lg border-0!">
            <UFormField
              label="First Name"
              required
              orientation="horizontal"
              description="Only your username will be displayed"
              :ui="{
                label: 'body-sm text-(--foreground-100) font-semibold',
                description: 'body-xs text-(--foreground-200)/60',
                root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center pb-4 gap-2 md:gap-0',
              }"
            >
              <UInput v-model="state.firstName" type="text" variant="subtle" placeholder="First Name" :loading="pending" color="secondary" class="w-full md:w-80" />
            </UFormField>

            <UFormField
              label="Last Name"
              required
              orientation="horizontal"
              description="Your family name"
              :ui="{
                label: 'body-sm text-(--foreground-100) font-semibold',
                description: 'body-xs text-(--foreground-200)/60',
                root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center pb-4 gap-2 md:gap-0',
              }"
            >
              <UInput v-model="state.lastName" variant="subtle" type="text" placeholder="Last Name" :loading="pending" color="secondary" class="w-full md:w-80" />
            </UFormField>

            <UFormField
              label="Username"
              required
              orientation="horizontal"
              description="Your public username"
              :ui="{
                label: 'body-sm text-(--foreground-100) font-semibold',
                description: 'body-xs text-(--foreground-200)/60',
                root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center pb-4 gap-2 md:gap-0',
              }"
            >
              <UInput v-model="state.username" type="text" placeholder="Username" variant="subtle" :loading="pending" color="secondary" class="w-full md:w-80" />
            </UFormField>

            <UFormField
              label="Avatar"
              orientation="horizontal"
              description="URL to your profile picture"
              :ui="{
                label: 'body-sm text-(--foreground-100) font-semibold',
                description: 'body-xs text-(--foreground-200)/60',
                root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center pb-4 gap-2 md:gap-0',
              }"
            >
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
                }"
              >
                <template #leading>
                  <p class="body-sm">https://</p>
                </template>
              </UInput>
            </UFormField>

            <UFormField
              label="Bio"
              orientation="horizontal"
              description="A short description of yourself"
              :ui="{
                label: 'body-sm text-(--foreground-100) font-semibold',
                description: 'body-xs text-(--foreground-200)/60',
                root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start pb-4 gap-2 md:gap-0',
              }"
            >
              <UTextarea
                v-model="state.bio"
                type="text"
                placeholder="Describe yourself..."
                variant="subtle"
                :loading="pending"
                color="secondary"
                class="w-full md:w-80"
                :ui="{
                  base: 'body-sm placeholder:text-(--foreground-200)/50',
                }"
              />
            </UFormField>

            <UFormField
              label="Your Intent"
              description="Please enter your interests and intent"
              help="You can select multiple"
              orientation="horizontal"
              :ui="{
                label: 'body-sm text-(--foreground-100) font-semibold',
                description: 'body-xs text-(--foreground-200)/60',
                root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start pb-4 gap-2 md:gap-0',
                help: 'body-xs text-(--foreground-200)/60 self-center mt-1',
              }"
            >
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
          </div>
        </UForm>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { z } from "zod";
import { UserIntent } from "~~/layers/database/server/database/prisma/generated/enums";
definePageMeta({
  middleware: ["authenticated"],
  layout: "dashboard",
});

const { data: fullUser, refresh, pending } = await useAsyncData("fullUser", () => useRequestFetch()<FullUser>(`/api/user`));

const { accountNavigationItems } = useDashboardNavigation();

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Must be a valid email").optional(),
  address: z.any(),
  avatar: z.url("Must be a valid URL").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  intents: z.array(z.enum(Object.values(UserIntent))).optional(),
  interests: z.array(z.string()).optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  firstName: fullUser.value?.firstName || "",
  lastName: fullUser.value?.lastName || "",
  username: fullUser.value?.username || "",
  email: fullUser.value?.email || "",
  address: fullUser.value?.address || "",
  avatar: fullUser.value?.avatar || "",
  bio: fullUser.value?.bio || "",
  intents: fullUser.value?.intents || [],
  interests: fullUser.value?.interests || [],
});

const intents: { value: UserIntent; label: string }[] = [
  { value: UserIntent.BUYING, label: "Buying" },
  { value: UserIntent.SELLING, label: "Selling" },
  { value: UserIntent.RENTING, label: "Renting" },
  { value: UserIntent.LANDLORD, label: "Landlord" },
];
</script>
