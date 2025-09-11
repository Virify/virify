<template>
  <div class="p-pre-dock">
    <div class="p-pre-dock__banner">
      <div class="p-pre-dock__banner-content | flow flow-xl">
        <h1 class="| title-xl">Find your perfect property</h1>
        <OrganismsDockBanner />
      </div>
    </div>

    <div class="p-pre-dock__content | container container-sm flow flow-xl">
      <h2 class="| title-lg">This is test content</h2>

      <p style="margin-top: 1em" v-for="i of 10">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium incidunt, quo consequuntur unde quae
        deleniti officia, cupiditate tempore nobis, earum minus? Illum enim voluptates doloremque nihil ullam dolore,
        facere modi?
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.p-pre-dock {

  &__banner {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    padding: var(--size-64) var(--size-32);
    box-sizing: border-box;
    background: #27da9b;
    text-align: center;
  }

  &__banner-content {
    max-width: min(100%, 45rem);
    margin: 0 auto;
    flex: 1 0;
  }

  &__content {
    padding: var(--size-40) 0;
  }
}
</style>