<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Setup Your Profile" :ui="{
        title: 'title-sm m-0!',
      }">
        <template #title>
          <MoleculesDashboardBreadcrumb />
        </template>
      </UDashboardNavbar>

      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <AtomsDashboardFormContainer>
          <UForm ref="form" :schema="schema" :state="state" @submit="onSubmit">
          <OrganismsDashboardAccountHeroCard title="Complete your profile"
            description="Complete your profile information to fully activate your account" label="Save Changes" />

          <AtomsDashboardForm>
            <UFormField label="Username" name="username" required orientation="horizontal"
              description="Your public username"
              :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
              <UInput v-model="state.username" type="text" icon="i-lucide-contact" placeholder="Username"
                variant="subtle" :loading="pending || checkingUsername" color="secondary" class="w-full md:w-80" :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50',
                }" @blur="checkUsernameAvailability" />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="First Name" name="firstName" required orientation="horizontal"
              description="Your first name"
              :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
              <UInput v-model="state.firstName" type="text" icon="i-lucide-user-pen" placeholder="First Name"
                variant="subtle" :loading="pending" color="secondary" class="w-full md:w-80" :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50',
                }" />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField label="Last Name" name="lastName" required orientation="horizontal" description="Your last name"
              :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
              <UInput v-model="state.lastName" type="text" icon="i-lucide-user-pen" placeholder="Last Name"
                variant="subtle" :loading="pending" color="secondary" class="w-full md:w-80" :ui="{
                  base: 'placeholder:text-(--foreground-200)/50!',
                  leadingIcon: 'text-(--foreground-200)/50',
                }" />
            </UFormField>

            <div v-if="!hasPassword">
              <USeparator class="my-4" />
              <div class="body-sm pb-5">
                <p>Create your password</p>
                <p class="text-(--foreground-200)/50 body-xs pt-1">Create your account password below. Passwords need to
                  be at least 8 characters long and include a mix of letters, numbers, and special characters.</p>
                <p class="text-(--foreground-200)/50 body-xs pt-1">We will send a confirmation email to your registered
                  email address.</p>
              </div>
              <div class="flex flex-col gap-4">
                <UFormField label="New Password" name="newPassword" orientation="horizontal" required
                  description="Enter your new password" eagerValidation
                  :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
                  <UInput :type="showNewPassword ? 'text' : 'password'" variant="subtle" icon="i-lucide-lock"
                    placeholder="New Password" color="secondary" class="w-full md:w-80" v-model="state.newPassword" :ui="{
                      base: 'placeholder:text-(--foreground-200)/50!',
                      leadingIcon: 'text-(--foreground-200)/50',
                      trailing: 'pe-1',
                    }">
                    <template #trailing>
                      <UButton color="neutral" variant="link" size="sm"
                        :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="showNewPassword ? 'Hide password' : 'Show password'"
                        :aria-pressed="showNewPassword" aria-controls="newPassword"
                        @click="showNewPassword = !showNewPassword" />
                    </template>
                  </UInput>
                </UFormField>

                <UFormField label="Confirm New Password" name="confirmNewPassword" orientation="horizontal" required
                  description="Re-enter your new password to confirm" eagerValidation
                  :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }">
                  <UInput :type="showConfirmNewPassword ? 'text' : 'password'" variant="subtle" icon="i-lucide-lock"
                    placeholder="Confirm New Password" color="secondary" class="w-full md:w-80"
                    v-model="state.confirmNewPassword" :ui="{
                      base: 'placeholder:text-(--foreground-200)/50!',
                      leadingIcon: 'text-(--foreground-200)/50',
                      trailing: 'pe-1',
                    }">
                    <template #trailing>
                      <UButton color="neutral" variant="link" size="sm"
                        :icon="showConfirmNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="showConfirmNewPassword ? 'Hide password' : 'Show password'"
                        :aria-pressed="showConfirmNewPassword" aria-controls="confirmNewPassword"
                        @click="showConfirmNewPassword = !showConfirmNewPassword" />
                    </template>
                  </UInput>
                </UFormField>
              </div>
            </div>
          </AtomsDashboardForm>
        </UForm>
      </AtomsDashboardFormContainer>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, Form } from "@nuxt/ui";
import { z } from "zod";
const toast = useToast();
const { user, fetch } = useUserSession();
const form = ref<Form<Schema>>();
const checkingUsername = ref(false);
const { checkText } = useModeration();

async function checkUsernameAvailability() {
  const username = state.username?.trim();
  if (!username || username === fullUser.value?.username) return;

  checkingUsername.value = true;
  try {
    const { available } = await useRequestFetch()<{ available: boolean }>('/api/user/profile/username-check', {
      query: { username },
    });
    if (!available) {
      form.value?.setErrors([{ name: 'username', message: 'That username is already taken.' }]);
    }
  } catch {
    // silently ignore network errors during availability check
  } finally {
    checkingUsername.value = false;
  }
}

definePageMeta({
  middleware: ["authenticated"],
  layout: "dashboard",
});

const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);
const { data: fullUser, pending } = await useAsyncData("fullUser", () => useRequestFetch()<UserWithAddress>(`/api/user/profile/`));

const state = reactive({
  firstName: fullUser.value?.firstName || "",
  lastName: fullUser.value?.lastName || "",
  username: fullUser.value?.username || "",
  newPassword: "",
  confirmNewPassword: "",
});

type Schema = z.output<typeof schema.value>;

const hasPassword = computed(() => {
  return !!fullUser.value?.password;
});

const schema = computed(() => {
  return hasPassword.value ? profileCreateUsernameSchema : profileCreateSchema;
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Check name fields for profanity before submitting
  const fieldsToCheck = [
    { name: 'firstName', value: event.data.firstName },
    { name: 'lastName', value: event.data.lastName },
    { name: 'username', value: event.data.username },
  ].filter((f): f is { name: string; value: string } => !!f.value?.trim())

  const results = await Promise.all(fieldsToCheck.map(async (f) => ({ name: f.name, ...(await checkText(f.value)) })))
  const failed = results.filter(r => !r.safe)

  if (failed.length > 0) {
    form.value?.setErrors(failed.map(r => ({
      name: r.name,
      message: 'This field contains inappropriate language. Please choose something else.',
    })))
    return
  }

  try {
    const response = await useRequestFetch()<Schema>("/api/user/profile", {
      method: "POST",
      body: event.data,
      query: {
        schema: schema.value === profileCreateUsernameSchema ? "username" : "createProfile",
      }
    });

    if (response) {
      await fetch()
      toast.add({ title: "Success", description: "Profile updated successfully", color: "success", icon: 'i-lucide-user-check' });
      navigateTo('/dashboard');
    }
  } catch (error: any) {
    const message = error?.data?.statusMessage || error?.statusMessage || 'An error occurred while updating profile';
    if (message.toLowerCase().includes('username')) {
      form.value?.setErrors([{ name: 'username', message }]);
    } else {
      toast.add({ title: 'Error', description: message, color: 'error', icon: 'i-lucide-circle-x' });
    }
  }
}
</script>
