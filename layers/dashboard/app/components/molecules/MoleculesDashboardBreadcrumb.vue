<template>
  <UBreadcrumb :items="breadcrumbItems" :ui="{
    linkLeadingIcon: 'text-secondary',
    link: 'text-foreground',
  }">
    <template #separator>
      <UIcon name="i-lucide-chevron-right" class="text-secondary" :ui="{

      }" />
    </template>
  </UBreadcrumb>
</template>

<script lang="ts" setup>
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    {
      label: 'Home',
      icon: 'i-lucide-home',
      to: '/dashboard',
    },
  ]

  // Map route paths to labels
  const routeLabels: Record<string, { label: string; icon?: string }> = {
    'favourites': { label: 'Favourites', icon: 'i-lucide-heart' },
    'notes': { label: 'Notes', icon: 'i-lucide-sticky-note' },
    'enquiries': { label: 'Enquiries', icon: 'i-lucide-mail' },
    'my-listings': { label: 'My Listings', icon: 'i-lucide-building-2' },
  }

  // Get path segments after /dashboard/
  const path = route.path.replace('/dashboard/', '').replace('/dashboard', '')
  const segments = path.split('/').filter(Boolean)

  let currentPath = '/dashboard'
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const routeInfo = routeLabels[segment]
    
    if (routeInfo) {
      items.push({
        label: routeInfo.label,
        icon: routeInfo.icon,
        to: index === segments.length - 1 ? undefined : currentPath,
      })
    } else {
      // Fallback for unknown segments - capitalize and format
      items.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        to: index === segments.length - 1 ? undefined : currentPath,
      })
    }
  })

  return items
})
</script>
