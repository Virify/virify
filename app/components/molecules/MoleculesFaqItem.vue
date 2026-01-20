<template>
  <div class="m-faq-item" @click="isActive = !isActive">
    <div class="m-faq-item__question">
      <h3 class="m-faq-item__question--title | title-xs">{{ question }}</h3>
      <AtomsIcon class="m-faq-item__question--icon" :class="{ 'is-active': isActive }" icon="chevron-down" />
    </div>
    <p v-show="isActive" class="m-faq-item__answer | body-md">{{ answer }}</p>
    <AtomsDivider class="m-faq-item__divider" />
  </div>
</template>
<script lang="ts" setup>
interface Props {
  question: string;
  answer: string;
  active?: boolean;
}

const props = defineProps<Props>();
const isActive = ref(props.active ?? false);
</script>
<style lang="scss">
@use "#styles/_utils/media" as mq;

.m-faq-item {
  padding: var(--size-12) 0;

  @include mq.tablet {
    padding: var(--size-16) var(--size-32);
  }

  &__question {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-weight: 500;
    cursor: pointer;

    &--title {
      margin: 0;
    }

    &--icon {
      flex-shrink: 0;
      transition: transform 0.3s ease;

      &.is-active {
        transform: rotate(180deg);
      }
    }
  }

  &__answer {
    margin-top: var(--size-8);
    line-height: 1.6;
  }

  &__divider {
    margin: var(--size-16) 0 0 0;
  }
}
</style>
