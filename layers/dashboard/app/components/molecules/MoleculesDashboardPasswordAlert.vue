<template>
  <UAlert v-if="!isVerified(user)" title="Warning:" orientation="horizontal"
    :actions="[
      {
        label: 'Set Password',
        to: '/dashboard/security',
        color: 'secondary',
        variant: 'solid',
        size: 'xl',
      }
    ]" 
    icon="i-lucide-octagon-x" color="warning" :ui="{
      root: 'text-black rounded-none',
      title: 'title-xs mb-0! ',
      description: 'body-sm font-normal',
      icon: ' size-8 self-start',
    }">
    <template #description>
      <p>You currently don't have a password set. Your account will be limited. If you log out without setting a password, you will have to do the password reset process to regain access.</p>
    </template>
  </UAlert>
</template>
<script lang="ts" setup>
const { user } = useUserSession();
</script>