<template>
  <div class="sanity-content">
    <PortableText 
      :value="blocks" 
      :components="customComponents"
    />
  </div>
</template>

<script setup lang="ts">
import { PortableText } from '@portabletext/vue'

defineProps<{
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

// Custom components for different block types
const customComponents = {
  types: {
    // Custom image component
    image: (props: any) => {
      return h('figure', { class: 'content-image' }, [
        h('img', {
          src: props.value.asset?.url,
          alt: props.value.alt || '',
          loading: 'lazy'
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
    }
  },

  marks: {
    // Custom link component
    link: (props: any) => {
      return h('a', {
        href: props.value?.href,
        target: props.value?.href?.startsWith('http') ? '_blank' : undefined,
        rel: props.value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined
      }, props.children)
    }
  },

}
</script>

<style lang="scss">
.sanity-content {
  max-width: 100%;

  // Typography elements
  h1, h2, h3, h4, h5, h6 {
    margin-top: var(--size-32);
    margin-bottom: var(--size-16);
    font-weight: var(--font-bold);
    color: var(--secondary-400);
  }

  h1 {
    font-size: var(--font-3xl);
  }

  h2 {
    font-size: var(--font-2xl);
  }

  h3 {
    font-size: var(--font-xl);
    margin-bottom: var(--size-8);
  }

  h4 {
    font-size: var(--font-lg);
    margin-bottom: var(--size-8);
  }

  h5 {
    font-size: var(--font-md);
    margin-bottom: var(--size-8);
  }

  h6 {
    font-size: var(--font-sm);
    margin-bottom: var(--size-8);
  }

  p {
    margin-bottom: var(--size-16);
    font-size: var(--font-md);
    line-height: var(--lineheight-lg);
    color: var(--foreground-100);

    // Paragraphs immediately after headings get tighter spacing
    h1 + &, h2 + &, h3 + &, h4 + &, h5 + &, h6 + & {
      margin-top: var(--size-16);
    }
  }

  // Lists
  ul, ol {
    margin-bottom: var(--size-32);
    padding-left: var(--size-32);
    
    li {
      margin-bottom: var(--size-12);
      line-height: var(--lineheight-lg);
      color: var(--foreground-100);
      font-size: var(--font-md);
    }

    // Nested lists get tighter spacing
    ul, ol {
      margin-top: var(--size-8);
      margin-bottom: var(--size-16);
    }
  }

  // Blockquotes
  blockquote {
    border-left: var(--size-4) solid var(--primary-400);
    padding-left: var(--size-16);
    margin: var(--size-32) 0;
    font-style: italic;
    color: var(--foreground-100);
    background-color: var(--background-100);
    padding: var(--size-16);
    border-radius: var(--border-radius-sm);
  }

  // Links
  a {
    color: var(--blue-600);
    text-decoration: underline;
    
    &:hover {
      color: var(--blue-700);
    }
  }

  // Code elements
  code {
    background-color: var(--background-100);
    padding: var(--size-2) var(--size-4);
    border-radius: var(--border-radius-sm);
    font-family: monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: var(--background-100);
    padding: var(--size-16);
    border-radius: var(--border-radius-md);
    overflow-x: auto;
    margin: var(--size-24) 0;

    code {
      background: none;
      padding: 0;
    }
  }

  // Images
  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius-md);
    margin: var(--size-32) 0;
  }

  // Horizontal rules
  hr {
    border: none;
    border-top: var(--size-1) solid var(--background-300);
    margin: var(--size-48) 0;
  }

  // Strong and emphasis
  strong {
    font-weight: var(--font-bold);
  }

  em {
    font-style: italic;
  }
}

.content-block {
  margin-bottom: var(--size-16);
}

.content-image {
  margin: var(--size-32) 0;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius-md);
  }
}

.image-caption {
  margin-top: var(--size-8);
  color: var(--foreground-100);
  font-style: italic;
}

.content-table {
  margin: var(--size-32) 0;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    border: var(--size-1) solid var(--background-300);
  }

  th,
  td {
    padding: var(--size-12);
    text-align: left;
    border: var(--size-1) solid var(--background-300);
  }

  th {
    background-color: var(--background-100);
    font-weight: var(--font-semibold);
  }

  caption {
    margin-bottom: var(--size-8);
    font-weight: var(--font-semibold);
    text-align: left;
  }
}

.callout {
  margin: var(--size-32) 0;
  padding: var(--size-16) var(--size-24);
  border-radius: var(--border-radius-md);
  border-left: var(--size-4) solid;

  &--info {
    background-color: var(--blue-900);
    border-left-color: var(--blue-600);
    color: var(--blue-300);
  }

  &--warning {
    background-color: var(--secondary-900);
    border-left-color: var(--secondary-500);
    color: var(--secondary-200);
  }

  &--success {
    background-color: var(--primary-900);
    border-left-color: var(--primary-500);
    color: var(--primary-200);
  }

  &--error {
    background-color: var(--error-background);
    border-left-color: var(--error-foreground);
    color: var(--error);
  }

  &--tip {
    background-color: var(--tertiary-900);
    border-left-color: var(--tertiary-700);
    color: var(--tertiary-300);
  }
}

.callout-content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>