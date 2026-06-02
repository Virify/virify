<template>
  <div class="sanity-content">
    <PortableText :value="blocks" :components="customComponents" />
  </div>
</template>

<script setup lang="ts">
import { PortableText } from '@portabletext/vue'
import AtomsDivider from '~/components/atoms/AtomsDivider.vue';

const props = defineProps<{
  blocks: PortableTextContent[]
}>()

// Add IDs to headings after component mounts for table of contents
onMounted(() => {
  const contentEl = document.querySelector('.sanity-content')
  if (!contentEl) return

  const headings = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6')

  headings.forEach((heading) => {
    if (!heading.id) {
      // Create slug from heading text
      const text = heading.textContent || ''
      const slug = text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      heading.id = slug || 'heading'
    }
  })
})

// Helper to check if string is a Cloudflare image ID
const isCloudflareId = (str: string | undefined): boolean => {
  if (!str) return false
  // Cloudflare IDs are UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

// Custom components for different block types
const customComponents = {
  types: {
    // Custom image component (handles both Sanity images and Cloudflare IDs)
    image: (props: any) => {
      const srcRef = props.value?.asset?._ref || props.value?.asset?.url
      const alt = props.value?.alt || props.value?.caption || 'Guide content image'

      // Check if this is a Cloudflare ID
      if (isCloudflareId(srcRef)) {
        const CloudFlareImage = resolveComponent('AtomsCloudFlareImage') as any
        return h('figure', { class: 'content-image' }, [
          h(CloudFlareImage, {
            src: srcRef,
            alt,
            variant: 'marketing',
            placeholder: true,
            class: 'content-image__img'
          }),
          props.value.caption ? h('figcaption', { class: 'image-caption' }, props.value.caption) : null
        ].filter(Boolean))
      }

      // Otherwise use Sanity image
      const NuxtImg = resolveComponent('NuxtImg') as any
      const width = props.value?.metadata?.dimensions?.width
      const height = props.value?.metadata?.dimensions?.height
      return h('figure', { class: 'content-image' }, [
        h(NuxtImg, {
          provider: 'sanity',
          src: srcRef,
          alt,
          width,
          height,
          loading: 'lazy',
          class: 'content-image__img',
          placeholder: '/img/preload.svg'
        }),
        props.value.caption ? h('figcaption', { class: 'image-caption' }, props.value.caption) : null
      ].filter(Boolean))
    },

    // Custom table component
    table: (props: any) => {
      return h('div', { class: 'content-table' }, [
        h('table', [
          props.value.caption ? h('caption', props.value.caption) : null,
          h('tbody', props.value.rows?.map((row: any, rowIndex: number) =>
            h('tr', { key: rowIndex }, row.cells?.map((cell: string, cellIndex: number) =>
              h(row.isHeader ? 'th' : 'td', { key: cellIndex }, cell)
            ))
          ))
        ].filter(Boolean))
      ])
    },

    // Custom callout component
    callout: (props: any) => {
      return h('div', {
        class: `callout callout--${props.value.type || 'info'}`
      }, [
        h('div', { class: 'callout-content' }, [
          props.value.content ? h(PortableText, {
            value: props.value.content,
            components: customComponents
          }) : null
        ])
      ])
    },

    // Custom divider component
    divider: () => {
      return h(AtomsDivider)
    }
  },

  marks: {
    // Custom link component (external)
    link: (props: any) => {
      const href = props.value?.href || '#'
      const target = (props.value?.blank || href?.startsWith('http')) ? '_blank' : undefined
      const rel = target ? 'noopener noreferrer' : undefined
      const linkText = props.text
      return h('a', { href, target, rel }, linkText)
    },

    // Internal link to another guide (reference expanded in API)
    internalLink: (props: any) => {
      const val = props.value || {}
      // possible shapes:
      // { reference: { slug: 'my-slug' } }
      // { reference: { slug: { current: 'my-slug' } } }
      // { slug: 'my-slug' }
      const raw = val.reference?.slug || val.slug || val.reference?._ref
      const slug = typeof raw === 'string' ? raw : (raw && raw.current) ? raw.current : undefined
      const children = typeof props.children === 'function' ? props.children() : (props.children || [])
      if (slug) {
        const categorySlug = val.reference?.category?.slug
        const href = categorySlug ? `/guides/${categorySlug}/${slug}` : `/guides/${slug}`
        // if children empty, use reference title or slug as link text
        const text = (Array.isArray(children) && children.length > 0)
          ? children
          : (val.reference?.title || slug)
        const NuxtLink = resolveComponent('NuxtLink') as any
        return h(NuxtLink, { to: href }, { default: () => (Array.isArray(children) && children.length > 0 ? children : text) })
      }
      return h('span', {}, children)
    }
  }

}
</script>

<style lang="scss">
.sanity-content {

  // Typography elements with modern spacing
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 700;
    color: var(--foreground-100);
    letter-spacing: -0.02em;
    line-height: 1.2;
    scroll-margin-top: var(--size-96);

    &+* {
      margin-top: var(--size-16);
    }
  }

  h1 {
    font-size: clamp(1.5rem, 4vw, 2rem);
    margin-top: var(--size-64);
    margin-bottom: var(--size-24);

    &:first-child {
      margin-top: 0;
    }
  }

  h2 {
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    margin-top: var(--size-56);
    margin-bottom: var(--size-20);
    padding-bottom: var(--size-8);
    border-bottom: 1px solid color-mix(in srgb, var(--foreground-100) 15%, transparent);

    &:first-child {
      margin-top: 0;
    }
  }

  h3 {
    font-size: clamp(1.125rem, 2.5vw, 1.25rem);
    margin-top: var(--size-48);
    margin-bottom: var(--size-16);

    &:first-child {
      margin-top: 0;
    }
  }

  h4 {
    font-size: clamp(1rem, 2vw, 1.125rem);
    margin-top: var(--size-40);
    margin-bottom: var(--size-12);
  }

  h5 {
    font-size: var(--font-md);
    margin-top: var(--size-32);
    margin-bottom: var(--size-12);
  }

  h6 {
    font-size: var(--font-sm);
    margin-top: var(--size-32);
    margin-bottom: var(--size-8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--foreground-200);
  }

  p {
    margin-bottom: var(--size-20);
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    line-height: 1.75;
    color: var(--foreground-100);
  }

  // Lists with better visual hierarchy
  ul,
  ol {
    margin-bottom: var(--size-32);
    padding-left: 0;
    list-style: none;

    li {
      position: relative;
      margin-bottom: var(--size-12);
      padding-left: var(--size-32);
      line-height: 1.75;
      color: var(--foreground-100);
      font-size: clamp(0.875rem, 1.5vw, 1rem);

      &::before {
        position: absolute;
        left: 0;
        color: var(--primary-400);
        font-weight: 600;
      }
    }

    // Nested lists
    ul,
    ol {
      margin-top: var(--size-12);
      margin-bottom: var(--size-16);
    }
  }

  ul {
    li::before {
      content: '•';
      font-size: 1.5em;
      line-height: 1;
    }
  }

  ol {
    counter-reset: list-counter;

    li {
      counter-increment: list-counter;

      &::before {
        content: counter(list-counter) '.';
      }
    }
  }

  // Modern blockquotes
  blockquote {
    position: relative;
    margin: var(--size-40) 0;
    padding: var(--size-24) var(--size-32);
    background: linear-gradient(135deg, var(--background-200) 0%, var(--background-100) 100%);
    border-left: 4px solid var(--primary-400);
    border-radius: var(--border-radius-lg);
    font-style: italic;
    font-size: var(--font-md);
    color: var(--foreground-100);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    p:last-child {
      margin-bottom: 0;
    }

    &::before {
      content: '"';
      position: absolute;
      top: var(--size-12);
      left: var(--size-16);
      font-size: 4rem;
      line-height: 1;
      color: var(--primary-400);
      opacity: 0.2;
    }
  }

  // Enhanced links
  a {
    color: var(--primary-400);
    text-decoration: none;
    position: relative;
    font-weight: 500;
    transition: color 0.2s ease;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 2px;
      background: var(--primary-400);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
    }

    &:hover {
      color: var(--primary-500);

      &::after {
        transform: scaleX(1);
        transform-origin: left;
      }
    }
  }

  // Modern code blocks
  code {
    background: linear-gradient(135deg, var(--background-100) 0%, var(--background-200) 100%);
    padding: var(--size-2) var(--size-8);
    border-radius: var(--border-radius-sm);
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.875em;
    color: var(--primary-400);
    border: 1px solid var(--background-300);
  }

  pre {
    background: linear-gradient(135deg, var(--background-100) 0%, var(--background-200) 100%);
    padding: var(--size-24);
    border-radius: var(--border-radius-lg);
    overflow-x: auto;
    margin: var(--size-32) 0;
    border: 1px solid var(--background-300);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    code {
      background: none;
      padding: 0;
      border: none;
      color: var(--foreground-100);
    }
  }

  // Enhanced images
  .content-image__img,
  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius-lg);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }
  }

  // Modern horizontal rules
  hr {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--background-300), transparent);
    margin: var(--size-56) 0;
    position: relative;

    &::after {
      content: '§';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: var(--background-500);
      padding: 0 var(--size-16);
      color: var(--foreground-300);
      font-size: var(--font-lg);
    }
  }

  // Text formatting
  strong {
    font-weight: 700;
    color: var(--foreground-100);
  }

  em {
    font-style: italic;
  }
}

.content-block {
  margin-bottom: var(--size-32);
}

.content-image {
  margin: var(--size-48) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius-lg);
    display: block;
    margin: 0 auto;
  }
}

.image-caption {
  margin-top: var(--size-12);
  text-align: center;
  color: var(--foreground-200);
  font-style: italic;
  font-size: var(--font-sm);
  line-height: 1.5;
}

.content-table {
  margin: var(--size-40) 0;
  overflow-x: auto;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid var(--background-300);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
  }

  th,
  td {
    padding: var(--size-16) var(--size-20);
    text-align: left;
    border-bottom: 1px solid var(--background-300);
    border-right: 1px solid var(--background-300);

    &:last-child {
      border-right: none;
    }
  }

  tr:last-child {
    td {
      border-bottom: none;
    }
  }

  th {
    background: linear-gradient(135deg, var(--background-100) 0%, var(--background-200) 100%);
    font-weight: 700;
    color: var(--foreground-100);
    text-transform: uppercase;
    font-size: var(--font-sm);
    letter-spacing: 0.05em;
  }

  tbody tr {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--background-200);
    }
  }

  caption {
    margin-bottom: var(--size-16);
    font-weight: 600;
    text-align: left;
    color: var(--foreground-100);
    font-size: var(--font-lg);
  }
}

.callout {
  margin: var(--size-40) 0;
  padding: var(--size-24) var(--size-28);
  border-radius: var(--border-radius-lg);
  border-left: 4px solid;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);

  &--info {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
    border-left-color: var(--blue-500);
  }

  &--warning {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%);
    border-left-color: var(--primary-500);
  }

  &--success {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
    border-left-color: var(--secondary--500);
  }

  &--error {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
    border-left-color: var(--error);
  }

  &--tip {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
    border-left-color: var(--tertiary-500);
  }
}

.callout-content {
  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin-top: 0;
    margin-bottom: var(--size-12);
  }
}
</style>