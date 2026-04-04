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
        <UForm :schema="notificationPreferencesSchema" :state="state" @submit="onSubmit">
          <OrganismsDashboardAccountHeroCard title="Adjust your notification settings" description="Manage how you receive notifications from our platform" label="Save Changes" :loading="saving" />

          <AtomsDashboardForm>
            <UFormField
              label="Email Notifications"
              name="receiveEmailNotifications"
              orientation="horizontal"
              description="Receive notifications via email"
              :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }"
            >
              <USwitch
                v-model="state.receiveEmailNotifications"
                color="secondary"
                size="xl"
                :ui="{
                  base: 'data-[state=checked]:bg-secondary/80 data-[state=unchecked]:bg-primary/20 dark:data-[state=unchecked]:bg-(--foreground-100)/50 w-10 transition-colors',
                  container: 'w-11! h-6 p-0.5',
                  wrapper: 'w-20! h-6 p-0.5',
                  thumb: 'border border-elevated'
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField
              label="Push Notifications"
              name="receivePushNotifications"
              orientation="horizontal"
              description="Receive push notifications on your device"
              :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }"
            >
              <USwitch
                v-model="state.receivePushNotifications"
                color="secondary"
                size="xl"
                :ui="{
                  base: 'data-[state=checked]:bg-secondary/80 data-[state=unchecked]:bg-primary/20 dark:data-[state=unchecked]:bg-(--foreground-100)/50 w-10 transition-colors',
                  container: 'w-11! h-6 p-0.5',
                  wrapper: 'w-20! h-6 p-0.5',
                  thumb: 'border border-elevated'
                }"
              />
            </UFormField>

            <USeparator class="my-4" />

            <UFormField
              label="Desktop Notifications"
              name="receiveDesktopNotifications"
              orientation="horizontal"
              :description="browserPermission === 'denied' ? 'Blocked by your browser — enable in site settings' : browserPermission === 'granted' ? 'Receive notifications on your desktop' : 'Receive notifications on your desktop'"
              :ui="{ root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0', error: 'w-full md:w-80 body-xs', help: 'body-xs text-(--foreground-200)/60 self-center mt-1' }"
            >
              <USwitch
                v-model="state.receiveDesktopNotifications"
                color="secondary"
                size="xl"
                :ui="{
                  base: 'data-[state=checked]:bg-secondary/80 data-[state=unchecked]:bg-primary/20 dark:data-[state=unchecked]:bg-(--foreground-100)/50 w-10 transition-colors',
                  container: 'w-11! h-6 p-0.5',
                  wrapper: 'w-20! h-6 p-0.5',
                  thumb: 'border border-elevated'
                }"
              />
            </UFormField>

          </AtomsDashboardForm>
        </UForm>
      </AtomsDashboardFormContainer>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  layout: "dashboard",
});

const { accountNavigationItems } = useDashboardNavigation();

const { state, saving, onSubmit, notificationPreferencesSchema, browserPermission } = useNotificationPreferences();
</script>
