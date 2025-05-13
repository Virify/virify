<template>
  <div class="o-searchform-flex" role="presentation">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-searchform-flex {
  display: block;
  container-type: inline-size;

  @include mq.small-tablet {
    display: flex;
    align-items: center;
    gap: var(--flow-gap);
  }
}
</style>