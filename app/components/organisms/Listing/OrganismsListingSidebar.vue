<template>
  <section role="presentation" class="o-listing-sidebar | flow flow-lg">
    <div class="o-listing-sidebar__icons | body-sm">
      Icons
    </div>

    <h2 v-if="priceFormatted" class="| title-lg">
      <div role="presentation" class="| body-md">
        123 House, Somewhere Street
      </div>

      {{ priceFormatted }}
    </h2>

    <p class="| body-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore blanditiis debitis, unde
      autem
      est quia
      voluptatibus explicabo tenetur porro atque et. Fugiat aliquam ipsa tempora illo esse cum, sapiente incidunt?</p>

    <div class="o-listing-sidebar__agent-details | body-sm">
      Estate agent info
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  price?: number
}

const props = defineProps<Props>()

const priceFormatted = computed(() => {
  const { price } = props

  return isNumber(price) ? numberToCurrency(price) : ''
})
</script>

<style lang="scss">
.o-listing-sidebar {

  &__icons {
    background: var(--background-300);
    border-radius: var(--border-radius-2xl);
    padding: var(--size-16) var(--size-24);
  }

  &__agent-details {
    background: var(--blue-300);
    color: var(--monochrome-900);
    border-radius: var(--border-radius-2xl);
    padding: var(--size-16) var(--size-24);
  }
}
</style>