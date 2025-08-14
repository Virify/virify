<template>
  <button class="m-price-marker" :class="{
    'm-price-marker--featured': tier === 'FEATURED',
    'm-price-marker--premium': tier === 'PREMIUM',
  }" aria-label="Expand property card">
    <nuxt-img v-if="image && tier === 'PREMIUM'" :src="image" class="m-price-marker__image" />

    <div class="m-price-marker__content">
      <span class="m-price-marker__price | body-xs font-semibold" aria-hidden="true">
        {{ priceDisplay }}
      </span>

      <AtomsFavouriteButton v-if="id" @click.stop :listing-id="Number(id)" />
      <AtomsNoteButton v-if="id" @click.stop :listing-id="Number(id)" />
    </div>

  </button>
</template>

<script setup lang="ts">
interface MarkerProps {
  id: string | number | null
  price: number | null
  image?: string
  hasNote?: boolean | null
  isFavorite?: boolean | null
  tier?: "FEATURED" | "BASIC" | "PREMIUM"
  priceType?: string | null
}

const props = defineProps<MarkerProps>();

// Format price based on property type (sale vs rental)
const priceDisplay = computed(() => {
  if (props.price === null || props.price === undefined) {
    return "";
  }

  // Check if it's a rental property based on priceType
  const isRental =
    props.priceType &&
    (props.priceType.toLowerCase().includes("month") ||
      props.priceType.toLowerCase().includes("week") ||
      props.priceType.toLowerCase().includes("pcm") ||
      props.priceType.toLowerCase().includes("pw"));

  if (isRental) {
    // For rentals, just remove pennies (round to nearest pound)
    return `£${Math.round(props.price).toLocaleString()}`;
  } else {
    // For sales, use higher threshold (£10000+ becomes £10k)
    return props.price >= 10000
      ? `£${Math.round(props.price / 1000)}k`
      : `£${props.price.toLocaleString()}`;
  }
});

</script>

<style lang="scss">
.m-price-marker {
  --marker-background: var(--blue-400);
  --marker-foreground: var(--monochrome-900);
  --marker-border: var(--blue-300);

  position: relative;
  background: var(--marker-background);
  color: var(--marker-foreground);
  border-radius: var(--border-radius-md);
  border: 2px solid var(--marker-border);
  padding: var(--size-2);
  margin: 0;

  .a-note-button {
    --notes-active-color: var(--monochrome-900);
  }

  &--featured {
    --marker-background: var(--secondary-400);
    --marker-border: var(--secondary-300);

    .a-favourite-button {
      --favourite-colour: var(--monochrome-900);
    }

    .a-note-button {
      --notes-dot-color: var(--monochrome-900);
    }
  }

  &--premium {
    --marker-foreground: var(--primary-500);

    min-width: 17ch;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: calc(50% - 3px);
    transform: rotate(45deg);
    width: 6px;
    height: 6px;
    background: var(--marker-background);
    border-right: 2px solid var(--marker-border);
    border-bottom: 2px solid var(--marker-border);
    border-bottom-right-radius: 2px;
  }

  &__image {
    display: block;
    background: var(--marker-border);
    width: 17ch;
    aspect-ratio: 4/3;
    margin-bottom: var(--size-4);
    border-radius: var(--border-radius-sm);
    object-fit: cover;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--size-2);
  }

  &__price {
    display: block;
    padding: 0 var(--size-8) 0 var(--size-4);
  }

  .a-favourite-button,
  .a-note-button {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--size-20);
    height: var(--size-20);

    .a-icon {
      width: var(--size-18);
      height: var(--size-18);
    }
  }
}
</style>
