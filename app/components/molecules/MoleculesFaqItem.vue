<template>
  <div class="m-faq-item" @click="isActive = !isActive">
    <div class="m-faq-item__question">
      <h2 class="m-faq-item__question--title | title-sm">{{ question }}</h2>
      <AtomsIcon 
        class="m-faq-item__question--icon" 
        :class="{ 'is-active': isActive }"
        icon="chevron-down" 
      />
    </div>
    <p v-show="isActive" class="m-faq-item__answer | body-md">{{ answer }}</p>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  question: string;
  answer: string;
  active?: boolean;
}

const props = defineProps<Props>()
const isActive = ref(props.active ?? false)
</script>
<style lang="scss">
@use "#styles/_utils/media" as mq;
.m-faq-item {
  padding: var(--size-16) 0;

  @include mq.desktop {
    padding: var(--size-8) 0;
  }

  &__question {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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
}
</style>