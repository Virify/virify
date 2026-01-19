<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Setup Your Profile"
        :ui="{
          title: 'title-sm m-0!',
        }"
      />
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <AtomsDashboardFormContainer>
        <UForm :schema="schema" :state="state" @submit="onSubmit">
          <OrganismsDashboardAccountHeroCard title="Complete your profile" description="Complete your profile information to fully activate your account" label="Save Changes" />

          <AtomsDashboardForm>
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
                  leadingIcon: 'text-(--foreground-200)/50',
                }"
              />
            </UFormField>

            <div v-if="!hasPassword">
              <USeparator class="my-4" />
              <div class="body-sm pb-5">
                <p>Create your password</p>
                <p class="text-(--foreground-200)/50 body-xs pt-1">Create your account password below. Passwords need to be at least 8 characters long and include a mix of letters, numbers, and special characters.</p>
                <p class="text-(--foreground-200)/50 body-xs pt-1">We will send a confirmation email to your registered email address.</p>
              </div>
              <div class="flex flex-col gap-4">
                <UFormField label="New Password" name="newPassword" orientation="horizontal" required description="Enter your new password" eagerValidation>
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
                      trailing: 'pe-1',
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

                <UFormField label="Confirm New Password" name="confirmNewPassword" orientation="horizontal" required description="Re-enter your new password to confirm" eagerValidation>
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
                      trailing: 'pe-1',
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
            </div>
          </AtomsDashboardForm>
        </UForm>
      </AtomsDashboardFormContainer>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
const toast = useToast();
const { user, fetch } = useUserSession(); 

definePageMeta({
  middleware: ["authenticated"],
  layout: "dashboard",
});

const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);
const { data: fullUser, pending } = await useAsyncData("fullUser", () => useRequestFetch()<UserWithAddress>(`/api/user/profile/`));

const state = reactive({
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
  try {
    const response = await $fetch<Schema>("/api/user/profile", {
      method: "POST",
      body: event.data,
      query: {
        schema: schema.value === profileCreateUsernameSchema ? "username" : "createProfile",
      }
    });

    if (response) {
      await fetch()
      toast.add({ title: "Success", description: "Profile updated successfully", color: "success" });
      navigateTo('/dashboard');
    }
  } catch (error: any) {
    toast.add({ title: "Error", description: error?.statusText || "An error occurred while updating profile", color: "error" });
  }
}
</script>
