<template>
  <div>
    <h1>Property ID: {{ id }}</h1>
    <div v-if="property">
      <h2>{{ property?.title }}</h2>
      <p>{{ property?.description }}</p>
      <p>Price: {{ property?.value }}</p>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Property } from '@prisma/client';
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const propertyId = route.params.id as string

// have to seperate for TS depth errors
const url: string = `/api/property/${propertyId}`

const { data: property } = await useAsyncData('property', () =>
  $fetch<Property>(url)
)
</script>
