<template>
  <UPricingTable
    :tiers="table"
    :sections="tableSections"
    class="max-w-5xl m-auto"
    :ui="{
      th: 'body-md! p-2',
      td: 'body-xs! p-0!',
    }"
  >
    <!-- Basic Title/Price -->
    <template #basic-title="{ tier }">
      <span class="title-sm mb-0 text-(--foreground-100)">{{ tier.title }}</span>
    </template>

    <template #basic-discount="{ tier }">
      <h4>{{ tier.discount }}</h4>
    </template>

    <template #basic-price="{ tier }">
      <p class="title-md mt-3! mb-0! text-(--foreground-100)">
        {{ tier.price}}
        <span class="body-xs font-normal! italic text-(--foreground-100) line-clamp-1">{{ tier["billing-cycle"] }}</span>
      </p>
      
    </template>

    <!-- Premium Title/Price -->
    <template #premium-title="{ tier }">
      <span class="title-sm mb-0 text-primary dark:text-(--blue-600)">{{ tier.title }}</span>
    </template>

    <template #premium-discount="{ tier }">
      {{ tier.discount }}
    </template>

    <template #premium-price="{ tier }">
      <p class="title-md mt-3! mb-0! text-primary dark:text-(--blue-600)">{{ tier.price }}
        <span class="body-xs font-normal! italic text-(--foreground-100) line-clamp-1">{{ tier["billing-cycle"] }}</span>
      </p>
    </template>

    <!-- Professional Title/Price -->
    <template #professional-title="{ tier }">
      <span class="title-sm mb-0! text-secondary">{{ tier.title }}</span>
    </template>

    <template #professional-discount="{ tier }">
      {{ tier.discount }}
    </template>

    <template #professional-price="{ tier }">
      <p class="title-md mt-3! mb-0! text-secondary">{{ tier.price }}
        <span class="body-xs font-normal! italic text-(--foreground-100) line-clamp-1">{{ tier["billing-cycle"] }}</span>
      </p>
    </template>

    <!-- Generic Description -->
    <template #description="{ tier }">
      <p class="body-sm text-foreground">{{ tier.description }}</p>
    </template>

    <!-- Features -->
    <template #feature-value="{ feature, tier }">
      <UIcon
        v-if="feature.tiers?.[tier.id] === true"
        name="i-lucide-circle-check"
        class="size-5 shrink-0 mx-auto"
        :class="[tier.id === 'basic' && 'text-(--foreground-100)', tier.id === 'premium' && 'text-primary dark:text-(--blue-600)', tier.id === 'professional' && 'text-secondary']"
      />
      <UIcon v-else-if="feature.tiers?.[tier.id] === false" name="i-lucide-minus" class="size-5 shrink-0 text-muted mx-auto" />
      <span v-else class="text-sm text-muted block text-center">{{ feature.tiers?.[tier.id] }}</span>
    </template>

    <!-- Buttons -->
    <template #basic-button="{ tier }">
      <UButton  @click="$emit('create-listing', 'BASIC')" :label="tier?.button?.label" block class="body-sm cursor-pointer text-center" color="neutral" variant="outline" :disabled="!showButtons" />
    </template>

    <template #premium-button="{ tier }">
      <UButton @click="$emit('create-listing', 'PREMIUM')" :label="tier?.button?.label" block class="body-sm cursor-pointer text-white!" :disabled="!showButtons" />
    </template>
    
    <template #professional-button="{ tier }">
      <UButton @click="$emit('create-listing', 'FEATURED')" :label="tier?.button?.label" block class="body-sm cursor-pointer text-white!" color="secondary" variant="solid" :disabled="!showButtons" />
    </template>
  </UPricingTable>
</template>

<script setup lang="ts">
import type { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums'

interface Props {
  table?: Array<any>
  showButtons?: boolean
}

withDefaults(defineProps<Props>(), {
  table: () => tableTiers.value,
  showButtons: true,
})

defineEmits<{
  'create-listing': [tier: ListingTier]
}>();
</script>
