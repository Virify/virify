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

const hasUsername = computed(() => !!user.value?.username);
const hasFirstName = computed(() => !!user.value?.firstName);
const hasLastName = computed(() => !!user.value?.lastName);
const hasNames = computed(() => hasFirstName.value && hasLastName.value);
const verified = computed(() => isVerified(user.value));

const status = computed(() => {
  if (!verified.value && !hasUsername.value) {
    return "Please complete your profile to fully activate your account. If you do not set a password you will need to use the forgot password feature to access your account in the future.";
  }
  if (!verified.value && hasUsername.value) {
    return "Please create a password to fully activate your account. If you do not set a password you will need to use the forgot password feature to access your account in the future.";
  }
  if (verified.value && !hasUsername.value) {
    return "Please create a username to fully activate your account.";
  }
  if (verified.value && hasUsername.value && !hasNames.value) {
    return "Please add your first and last name to complete your profile.";
  }
});

const showAlert = computed(() => {
  return !verified.value || !hasUsername.value || !hasNames.value;
});
</script>
