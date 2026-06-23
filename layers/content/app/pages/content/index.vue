<template>
  <div>
    <OrganismsBannerHero
      class="container"
      caption="Stay informed"
      compact
      description="Browse all our content across topics — from platform announcements to helpful information."
    >
      <template #title> Virify Content </template>
    </OrganismsBannerHero>

    <div class="container py-12">
      <div class="flex flex-wrap gap-12">
        <div
          v-for="category in categories"
          :key="category._id"
          class="flex-1 basis-[calc(50%-3rem)] min-w-60"
        >
          <nuxt-link
            :to="`/content/${category.slug}`"
            class="block mb-2 font-bold text-primary hover:underline"
          >
            {{ category.title }}
          </nuxt-link>
          <p
            v-if="category.description"
            class="mb-2 text-sm max-w-prose"
          >
            {{ category.description }}
          </p>
          <ul class="flex flex-col list-none mt-2">
            <li
              v-for="page in category.pages"
              :key="page._id"
            >
              <UButton
                :label="page.title"
                variant="link"
                :to="`/content/${category.slug}/${page.slug}`"
                icon="i-lucide-file"
                class="pl-0"
                :ui="{
                  base: 'p-0',
                  label: 'underline decoration-secondary',
                  leadingIcon: 'text-secondary',
                }"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { data: categories } = await useSanityQuery<SanityPageCategory[]>(
    allContentCategoriesQuery,
  );

  useSeoMeta({
    title: "Content | Virify",
    description:
      "Browse all our content across topics — from platform announcements to helpful information.",
    ogTitle: "Content | Virify",
    ogDescription:
      "Browse all our content across topics — from platform announcements to helpful information.",
    ogType: "website",
    twitterCard: "summary_large_image",
  });
</script>
