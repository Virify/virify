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
  }
}
</script>

<style scoped>
.sanity-content {
  max-width: 100%;
}

.content-block {
  margin-bottom: 1rem;
}

.content-image {
  margin: 2rem 0;
  text-align: center;
}

.content-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.image-caption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}

.content-table {
  margin: 2rem 0;
  overflow-x: auto;
}

.content-table table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e5e5;
}

.content-table th,
.content-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #e5e5e5;
}

.content-table th {
  background-color: #f9fafb;
  font-weight: 600;
}

.content-table caption {
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-align: left;
}

.callout {
  margin: 2rem 0;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.callout--info {
  background-color: #eff6ff;
  border-left-color: #3b82f6;
  color: #1e40af;
}

.callout--warning {
  background-color: #fef3c7;
  border-left-color: #f59e0b;
  color: #92400e;
}

.callout--success {
  background-color: #ecfdf5;
  border-left-color: #10b981;
  color: #065f46;
}

.callout--error {
  background-color: #fef2f2;
  border-left-color: #ef4444;
  color: #991b1b;
}

.callout--tip {
  background-color: #f0f9ff;
  border-left-color: #06b6d4;
  color: #0e7490;
}

.callout-content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>