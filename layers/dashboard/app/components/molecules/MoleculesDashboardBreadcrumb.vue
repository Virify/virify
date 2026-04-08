<template>
  <UBreadcrumb
    :items="breadcrumbItems"
    class="text-xs"
    :ui="{
      linkLeadingIcon: 'text-secondary',
      link: 'text-foreground',
    }"
  >
    <template #separator>
      <UIcon name="i-lucide-chevron-right" class="text-secondary" />
    </template>
  </UBreadcrumb>
</template>

<script lang="ts" setup>
import type { BreadcrumbItem } from "@nuxt/ui";

const route = useRoute();
const router = useRouter();

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    {
      label: "Home",
      icon: "i-lucide-home",
      to: "/dashboard",
    },
  ];

  // Get path segments after /dashboard/
  const path = route.path.replace("/dashboard/", "").replace("/dashboard", "");
  const segments = path.split("/").filter(Boolean);

  let currentPath = "/dashboard";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Default label: capitalize and format
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    let icon: string | undefined;

    // Resolve the route for this segment to get its meta
    const resolved = router.resolve(currentPath);

    // Check if the resolved route is valid (not 404) and matches the current segment depth
    // We check matches.length to ensure we found a real route
    if (resolved && resolved.matched.length > 0) {
      // Ideally we check matched[matched.length-1] for the specific segment's component
      // But accessing resolved.meta merges metas.
      // However, resolved.meta might be the meta of the CHILD if we are just partial matching?
      // No, router.resolve('/dashboard/tiers') matches the Tiers page specifically.
      // router.resolve('/dashboard/tiers/123') matches the child.

      // Try 'head' property first (our convention)
      const head = resolved.meta.head as { title?: string; icon?: string } | undefined;
      if (head?.title) {
        label = head.title;
        icon = head.icon;
      }
      // Fallback to top-level title if present (some pages use that)
      else if (resolved.meta.title) {
        label = resolved.meta.title as string;
      }
    }

    // Custom override for IDs (fallback if no meta title found or it's just a generic id)
    // If the resolved title is just "Listing Enquiries" for ID '123', maybe we want that?
    // As per user request "SHOULD BE THE ONLY SOURCE", we trust the resolved meta.

    items.push({
      label: label,
      icon: icon,
      to: index === segments.length - 1 ? undefined : currentPath,
    });
  });

  return items;
});
</script>
