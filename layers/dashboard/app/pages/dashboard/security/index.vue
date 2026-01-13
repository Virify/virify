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
      <MoleculesDashboardPasswordAlert />
    </template>
    <template #body>
      <AtomsDashboardFormContainer>
        <UForm :schema="schema" :state="state" @error="(event: FormErrorEvent) => errors = event" @submit="onSubmit" :validateOn="['input']">
          <OrganismsDashboardAccountHeroCard
            :disable="isValidSubmission ? false : true"
            title="Enhance Your Account Security"
            description="Protect and update your account. Here you can change your email address and update your password to keep your account secure."
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
                v-if="isUserVerified"
                label="Current Password"
                name="currentPassword"
                orientation="horizontal"
                :required="isChangingPassword"
                description="You will need your current password"
                eagerValidation
                :error="submitErrors?.find(e => e.name === 'currentPassword')?.message"
                >
              <UInput
                :type="showCurrentPassword ? 'text' : 'password'"
                variant="subtle"
                icon="i-lucide-lock"
                placeholder="Current Password"
                color="secondary"
                class="w-full md:w-80"
                v-model="state.currentPassword"
                @focus="clearSubmitErrors"
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
import { securitySchema, securitySchemaBase, securitySchemaSetPassword } from '~~/shared/utils/securitySchema';
import { z } from "zod";
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui';

definePageMeta({
  middleware: ["authenticated"],
  layout: "dashboard",
});

const { accountNavigationItems } = useDashboardNavigation();
const { user, fetch } = useUserSession();
const toast = useToast();

type Schema = z.output<typeof securitySchemaBase>;
const errors = ref<FormErrorEvent | null>(null);
const submitErrors = ref<FormError[] | null>(null);

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);

const state = reactive<Schema>({
  email: user.value?.email || '',
  currentPassword: null,
  newPassword: null,
  confirmNewPassword: null,
});

const isUserVerified = computed(() => isVerified(user.value));

const isChangingPassword = computed(() => {
  return !!state.currentPassword || !!state.newPassword || !!state.confirmNewPassword
});

const schema = computed(() => {
  if (!isUserVerified.value) {
    return securitySchemaSetPassword;
  }
  if (isChangingPassword.value) {
    return securitySchema;
  }
  return securitySchemaBase;
});

const isValidSubmission = computed(() => {
  const isEmailChanged = state.email !== user.value?.email;

  // For unverified users, we require they set a password IF they are interacting with it, or maybe always?
  // Based on schema, strict validation implies they MUST set it if utilizing that schema.
  if (!isUserVerified.value && !state.newPassword && !isEmailChanged) {
      return false;
  }

  if (isUserVerified.value && !isEmailChanged && !isChangingPassword.value) {
    return false;
  }

  const result = schema.value.safeParse(state);
  return result.success;
});

function clearSubmitErrors() {
  submitErrors.value = null;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitErrors.value = null;
  
  const querySchema = !isUserVerified.value ? 'set-password' : (isChangingPassword.value ? 'full' : 'base');

  try {
    const response = await $fetch<Schema>("/api/user/security", {
      method: "PATCH",
      body: event.data,
      query: {
        schema: querySchema,
      }
    });

    if(response) {
      toast.add({
        title: 'Success',
        description: 'Your security settings have been updated.',
        color: 'success',
      })
      await fetch();
    }

  } catch (error: any) {
    if(error.status === 400) {
      submitErrors.value = [{
        name: 'newPassword',
        message: 'New password must not be the same as the current password.',
      }]
    }
    if (error.status === 401) {
      submitErrors.value = [{
        name: 'currentPassword',
        message: 'Current password is incorrect.',
      }]
    }
    toast.add({
      title: 'Error',
      description: error.statusText,
      color: 'error',
    })
  }
}

</script>
