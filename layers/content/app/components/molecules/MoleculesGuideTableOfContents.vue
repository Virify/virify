<template>
  <aside class="table-of-contents">
    <nav class="guide-toc">
      <h3 class="guide-toc__title | title-lg">Table of Contents</h3>
      <ul class="guide-toc__list">
        <li v-for="heading in tableOfContents" :key="heading.id" :class="['guide-toc__item', `guide-toc__item--${heading.level}`]">
          <a :href="`#${heading.id}`" :class="['guide-toc__link | body-sm', { active: activeHeading === heading.id }]" @click.prevent="scrollToSection(heading.id)">
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  content: any[]
}>()

// Extract headings from Sanity content blocks
const tableOfContents = computed((): TableOfContentsItem[] => {
  return props.content
    .filter(block => block._type === 'block' && /^h[1-6]$/.test(block.style))
    .map(block => {
      const level = parseInt(block.style.charAt(1))
      const text = block.children?.map((child: any) => child.text).join('') || ''
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'heading'
      return { id, text, level }
    })
})

// Active heading tracking
const activeHeading = ref('')

// Smooth scroll to section with header offset
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    // Use a fixed offset for the header + some padding
    const offset = 120 // Approximate header height + padding
    const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

// Set up scroll spy with VueUse
onMounted(() => {
  setTimeout(() => {
    const contentEl = document.querySelector('.sanity-content')
    contentEl?.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      if (heading.id) {
        useIntersectionObserver(
          heading as HTMLElement,
          ([entry]) => {
            if (entry?.isIntersecting) {
              activeHeading.value = (entry.target as HTMLElement).id
            }
          },
          { 
            rootMargin: '-120px 0px -70% 0px', // Adjust top margin for header offset
            threshold: 0.1 
          }
        )
      }
    })
  }, 100)
})
</script>

<style scoped lang="scss">
@use "#styles/_utils/media" as mq;

.table-of-contents {
  display: none;

  @include mq.desktop {
    display: block;
    position: sticky;
    top: calc(var(--header-height) + var(--size-32));
    height: fit-content;
    max-height: calc(100vh - var(--size-64));
    overflow-y: auto;
  }
}

.guide-toc {
  background: var(--background-100);
  border-left: 1px solid var(--monochrome-600);
  margin-top: var(--size-32);
  padding: 0 var(--size-32);

  &__title {
    margin-bottom: var(--size-16);
    color: var(--foreground-200);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {

    &--2 {
      padding-left: var(--size-16);
    }

    &--3 {
      padding-left: var(--size-32);
    }

    &--4,
    &--5,
    &--6 {
      padding-left: var(--size-48);
    }
  }

  &__link {
    color: var(--foreground-200);
    text-decoration: none;
    display: block;
    padding: var(--size-4) 0;
    border-radius: var(--border-radius-md);
    transition: all 0.2s ease;

    &:hover {
      color: var(--secondary-500);
    }

    &.active {
      color: var(--foreground-200);
      font-weight: var(--font-semibold);
    }
  }
}
</style>
