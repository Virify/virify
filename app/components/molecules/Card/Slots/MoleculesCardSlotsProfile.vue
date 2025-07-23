<template>
  <p class="m-card-slots-footer | body-xs font-semibold">
    <AtomsIcon icon="cards/verified" />

    <span class="m-card-slots-footer__author">
      Sold by {{ username }}
    </span>
  </p>
</template>

<script setup lang="ts">
interface Props {
  user: Record<string, unknown>
}

const props = defineProps<Props>()

/**
 *  Get username from props
 */
const username = computed(() => {
  const { username } = asObject(props.user)

  return username
})

</script>

<style lang="scss">
.m-card-slots-footer {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  justify-content: flex-start;
  gap: var(--size-6);
  margin: var(--size-10) 0;
  padding: var(--size-8) var(--size-16) var(--size-8) var(--size-12);
  background: var(--card-background-pill);
  border: 1px solid var(--card-border-colour);
  border-radius: var(--border-radius-xl);

  &__author {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .a-icon {
    width: var(--size-20);
    height: var(--size-20);
    flex-shrink: 0;
  }
}
</style>