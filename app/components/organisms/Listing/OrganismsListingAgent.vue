<template>
  <section class="o-listing-sidebar-agent | body-sm">
    <div class="o-listing-sidebar-agent__logo">
      <NuxtImg
        v-if="agent?.avatar"
        :src="agent.avatar"
        :alt="`${agent.username}'s avatar`"
        :width="20"
        :height="20"
        class="o-listing-sidebar-agent__logo-image"
      />
      <AtomsIcon
        v-else
        icon="profile"
        class="o-listing-sidebar-agent__logo-icon"
        aria-hidden="true"
        :size="40"
      />
    </div>

    <div
      role="presentation"
      class="o-listing-sidebar-agent__details | flow flow-3xs"
    >
      <h3 class="o-listing-sidebar-agent__name | title-xs">
        {{ agent?.username }}
      </h3>
      <!-- <p class="| body-xs">123 Agent Street, SM1 TWN</p> -->
      <p class="| body-xs">{{ memberSince }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  agent?: {
    username?: string | null;
    email?: string | null;
    id?: number | null;
    createdAt?: Date | String | null;
    avatar?: string | null;
  };
}
const props = defineProps<Props>();

const memberSince = computed(() => {
  if (!props.agent?.createdAt) return undefined;
  const formattedDate = new Date(
    props.agent?.createdAt?.toString()
  ).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return "Member since " + formattedDate;
});
</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;

.o-listing-sidebar-agent {
  --estate-agent-brand-background: var(--blue-400);
  --estate-agent-brand-foreground: var(--monochrome-900);

  background: var(--estate-agent-brand-background);
  color: var(--estate-agent-brand-foreground);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-16);
  display: grid;
  grid-template-columns: 5em auto;
  gap: var(--size-16);
  align-items: flex-start;
  text-align: left;
  flex: 1 0 auto;

  &__logo {
    height: 100%;
    width: 100%;
    border-radius: var(--border-radius-lg);
    background: #{fn.faded-color(80%)};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__logo-image {
    border-radius: var(--border-radius-lg);
    object-fit: cover;
    height: 100%;
    width: 100%;
  }

  &__logo-icon {
    color: var(--blue-400);
    height: 100%;
    
  }

  &__name {
    margin: 0;
  }
}
</style>
