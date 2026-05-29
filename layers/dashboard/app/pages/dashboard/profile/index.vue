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
        <UForm ref="formRef" :schema="profileSchema" :state="state" @submit="onSubmit">
          <OrganismsDashboardAccountHeroCard title="Setup your profile" description="Create your profile information to fully act" label="Save Changes" :loading="isModerating" />

          <AtomsDashboardForm>
            <UFormField label="First Name" name="firstName" required orientation="horizontal" description="Not publicly displayed" class="" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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

            <UFormField label="Last Name" name="lastName" required orientation="horizontal" description="Not publicly displayed" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
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

            <UFormField label="Avatar" name="avatar" orientation="horizontal" description="Upload your profile picture (JPEG, PNG or WebP, max 2MB)" :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
              <UFileUpload v-slot="{ open, removeFile }" v-model="avatarFile" accept="image/jpeg,image/jpg,image/png,image/webp">
                <div class="flex flex-wrap items-center gap-3">
                  <UAvatar
                    size="lg"
                    :src="avatarPreview || state.avatar || undefined"
                    icon="i-lucide-image"
                    :as="{ img: 'img' }"
                  />
                  <UButton
                    :label="avatarModerating ? 'Moderating...' : state.avatar ? 'Change image' : 'Upload image'"
                    color="neutral"
                    variant="outline"
                    :loading="avatarUploading || avatarModerating"
                    :disabled="avatarUploading || avatarModerating || !isProfileValid"
                    :title="!isProfileValid ? 'Please complete the required profile fields before uploading an avatar' : undefined"
                    @click="open()"
                  />
                </div>
                <div v-if="avatarFile || state.avatar" class="flex items-center justify-between w-full mt-1.5">
                  <p class="text-xs text-muted">{{ avatarFile?.name ?? 'Current avatar' }}</p>
                  <UButton
                    icon="i-lucide-trash"
                    color="secondary"
                    variant="solid"
                    size="xs"
                    class="text-white!"
                    :loading="avatarRemoving"
                    :disabled="avatarRemoving"
                    @click="removeAvatar(removeFile)"
                  />
                </div>
              </UFileUpload>
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

      <AtomsDashboardFormContainer v-if="isRegularUser">
        <UAlert
          title="Upgrade to a Professional Agent Account"
          icon="i-lucide-building-2"
          color="info"
          :ui="{
            root: 'rounded-lg',
            title: 'title-xs mb-1',
            description: 'body-sm font-normal',
          }"
        >
          <template #description>
            <p>
              To upgrade to a professional agent account, please email our support team at
              <a href="mailto:support@virify.co.uk" class="font-medium underline underline-offset-2">support@virify.co.uk</a>.
            </p>
          </template>
        </UAlert>
      </AtomsDashboardFormContainer>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'
import { profileIntents } from "~~/layers/dashboard/app/composables/useProfileForm";

definePageMeta({
  middleware: ["authenticated"],
  layout: "dashboard",
});

const { accountNavigationItems } = useDashboardNavigation();
const { user } = useUserSession();

const formRef = useTemplateRef<{ setErrors: (errors: FormError[]) => void }>('formRef')
const { state, pending, onSubmit, profileSchema, isModerating } = await useProfileForm(formRef);
const intents = profileIntents;

const isProfileValid = computed(() => profileSchema.safeParse(state).success);

const { avatarFile, avatarPreview, avatarUploading, avatarModerating, avatarRemoving, removeAvatar } = useAvatarUpload(state);

const isRegularUser = computed(() => user.value?.role === 'USER' || !user.value?.role);
</script>
