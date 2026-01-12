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
        <UForm :schema="schema" :state="state" @error="(event: FormErrorEvent) => errors = event" @submit="onSubmit" :validateOn="['input']">
          <OrganismsDashboardAccountHeroCard
            :disable="disableButton"
            title="Enhance Your Account Security"
            description="Protect your account by updating your security settings. Enable two-factor authentication and review recent activity to keep your account safe."
            label="Save Changes"
          />
          <AtomsDashboardForm>
            <UFormField label="Email" name="email" orientation="horizontal" description="Your registered email address" help="We will send out and email to verify its you" eagerValidation>
              <UInput
                type="email"
                variant="subtle"
                icon="i-lucide-mail"
                placeholder="Email"
                color="secondary"
                class="w-full md:w-80"
                v-model="state.email"
                :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50',
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <div class="body-sm pb-5">
              <p>Reset your password</p>
              <p class="text-(--foreground-200)/50 body-xs pt-1">You will need your current password to set a new one. Passwords need to be at least 8 characters long and include a mix of letters, numbers, and special characters.</p>
              <p class="text-(--foreground-200)/50 body-xs pt-1">We will send a confirmation email to your registered email address.</p>
            </div>
            <div class="flex flex-col gap-4">
              <UFormField
              label="Current Password"
              name="currentPassword"
              orientation="horizontal"
              :required="isChangingPassword"
              description="You will need your current password"
              eagerValidation
              >
              <UInput
                :type="showCurrentPassword ? 'text' : 'password'"
                variant="subtle"
                icon="i-lucide-lock"
                placeholder="Current Password"
                color="secondary"
                class="w-full md:w-80"
                v-model="state.currentPassword"
                :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50',
                  trailing: 'pe-1'
                }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showCurrentPassword ? 'Hide password' : 'Show password'"
                    :aria-pressed="showCurrentPassword"
                    aria-controls="currentPassword"
                    @click="showCurrentPassword = !showCurrentPassword"
                  />
                </template>
              </UInput>
            </UFormField>

            <UFormField
              label="New Password"
              name="newPassword"
              orientation="horizontal"
              :required="isChangingPassword"
              description="Enter your new password"
              eagerValidation
              >
              <UInput
                :type="showNewPassword ? 'text' : 'password'"
                variant="subtle"
                icon="i-lucide-lock"
                placeholder="New Password"
                color="secondary"
                class="w-full md:w-80"
                v-model="state.newPassword"
                :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50',
                  trailing: 'pe-1'
                }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showNewPassword ? 'Hide password' : 'Show password'"
                    :aria-pressed="showNewPassword"
                    aria-controls="newPassword"
                    @click="showNewPassword = !showNewPassword"
                  />
                </template>
              </UInput>
            </UFormField>

            <UFormField
              label="Confirm New Password"
              name="confirmNewPassword"
              orientation="horizontal"
              :required="isChangingPassword"
              description="Re-enter your new password to confirm"
              eagerValidation
              >
              <UInput
                :type="showConfirmNewPassword ? 'text' : 'password'"
                variant="subtle"
                icon="i-lucide-lock"
                placeholder="Confirm New Password"
                color="secondary"
                class="w-full md:w-80"
                v-model="state.confirmNewPassword"
                :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50',
                  trailing: 'pe-1'
                }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="showConfirmNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showConfirmNewPassword ? 'Hide password' : 'Show password'"
                    :aria-pressed="showConfirmNewPassword"
                    aria-controls="confirmNewPassword"
                    @click="showConfirmNewPassword = !showConfirmNewPassword"
                  />
                </template>
              </UInput>
            </UFormField>
            </div>
            
          </AtomsDashboardForm>
        </UForm>
      </AtomsDashboardFormContainer>
    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
import { securitySchema, securitySchemaBase } from '~~/shared/utils/securitySchema';
import { z } from "zod";
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui';

definePageMeta({
  middleware: ["authenticated"],
  layout: "dashboard",
});

const { accountNavigationItems } = useDashboardNavigation();

type Schema = z.output<typeof securitySchemaBase>;
const errors = ref<FormErrorEvent | null>(null);

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);

const state = reactive<Schema>({
  email: "",
  currentPassword: null,
  newPassword: null,
  confirmNewPassword: null,
});


const isChangingPassword = computed(() => {
  return !!state.currentPassword || !!state.newPassword || !!state.confirmNewPassword
});

const schema = computed(() => {
  if (isChangingPassword.value) {
    return securitySchema;
  }
  return securitySchemaBase;
});

const disableButton = computed(() => {
    const result = schema.value.safeParse(state);
    return !result.success;
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
      // Handle form submission logic here
      console.log('Form submitted with data:', event.data);
    // You can add your API call or other logic here
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}

</script>
