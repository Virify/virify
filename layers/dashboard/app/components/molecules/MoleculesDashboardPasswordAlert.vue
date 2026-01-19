<template>
  <UAlert
    v-if="showAlert && loggedIn"
    title="Warning:"
    orientation="horizontal"
    :actions="[
      {
        label: 'Complete Profile',
        to: '/dashboard/profile/setup-profile',
        color: 'secondary',
        variant: 'solid',
        size: 'xl',
      },
    ]"
    icon="i-lucide-octagon-x"
    color="warning"
    :ui="{
      root: 'text-black rounded-none',
      title: 'title-xs mb-0! ',
      description: 'body-sm font-normal',
      icon: ' size-8 self-start',
    }"
  >
    <template #description>
      <p>{{ status }}</p>
    </template>
  </UAlert>
</template>
<script lang="ts" setup>
const { user, loggedIn } = useUserSession();

const status = computed(() => {
  if (!isVerified(user.value) && !user.value?.username) {
    return "Please complete your profile to fully activate your account.";
  }
  if (!isVerified(user.value) && user.value?.username) {
    return "Please create a password to fully activate your account.";
  }
  if (isVerified(user.value) && !user.value?.username) {
    return "Please create a username to fully activate your account.";
  }
});

const showAlert = computed(() => {
  return (!isVerified(user.value) && !user.value?.username) || (!isVerified(user.value) && user.value?.username) || (isVerified(user.value) && !user.value?.username);
});
</script>
