<template>
  <div>
    <div class="hv2__overflow">
      <HomepageSectionSignup class="| container" />
    </div>

    <div class="hv2__spacer">
      Spacer
    </div>

    <HomepageSectionAiScroller class="| container" />
    <HomepageSectionMapScroller class="| container" />

    <div class="hv2__spacer">
      Spacer
    </div>
  </div>
</template>


<style lang="scss">
.hv2 {

  &__overflow {
    overflow: hidden;
  }

  &__spacer {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: var(--background-300);
    font-weight: bold;
  }
}
</style>