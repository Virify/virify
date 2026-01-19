<template>
  <TooltipProvider :delay-duration="delayDuration">
    <TooltipRoot :open="open" @update:open="onUpdateOpen">
      <TooltipTrigger as-child>
        <span @click="handleClick" style="display: inline-flex; align-items: center;">
          <slot></slot>
        </span>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent 
          :side-offset="5" 
          class="a-tooltip-popover | body-sm lineheight-sm"
          :class="{ 'a-tooltip-popover--responsive': responsive }"
        >
          <slot name="tooltip"></slot>
          <TooltipArrow :width="10" :height="5" class="a-tooltip-arrow" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow } from 'reka-ui';

interface Props {
  delayDuration?: number;
  responsive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  delayDuration: 500,
  responsive: false,
});

const open = ref(false);

function handleClick(event: Event) {
  open.value = !open.value;
  // Prevent clicks from bubbling to parent handlers which might close modals etc.
  event.stopPropagation();
}

function onUpdateOpen(val: boolean) {
  open.value = val;
}
</script>

<style lang="scss">
.a-tooltip-popover {
  z-index: 10;
  background: var(--background-200);
  color: var(--foreground-200);
  border: 1px solid var(--background-300);
  padding: var(--size-8) var(--size-12);
  border-radius: var(--border-radius-lg);
  transform-origin: var(--reka-tooltip-content-transform-origin);
  animation: fadeTooltipUp var(--animation-slow) var(--ease-out);
  max-width: min(600px, var(--reka-tooltip-content-available-width));
  max-height: var(--reka-tooltip-content-available-height);
  white-space: pre-line;
  
  @media (max-width: 768px) {
    max-width: calc(100vw - 32px);
    margin-left: var(--size-16);
    margin-right: var(--size-16);
  }
  
  @media (max-width: 480px) {
    max-width: calc(100vw - 24px);
    margin-left: var(--size-12);
    margin-right: var(--size-12);
  }
  
  &--responsive {
    min-width: var(--reka-tooltip-trigger-width, 200px);
    max-width: min(400px, var(--reka-tooltip-content-available-width));
    white-space: normal;
    word-wrap: break-word;
    
    @media (max-width: 768px) {
      min-width: 250px;
      max-width: calc(100vw - 48px); 
      margin: 0 var(--size-16);
    }
    
    @media (max-width: 480px) {
      min-width: 200px;
      max-width: calc(100vw - 40px);
      margin: 0 var(--size-16);
      padding: var(--size-12) var(--size-16);
    }
  }
}

.a-tooltip-arrow {
  fill: var(--background-100);
}

.a-tooltip-popover {
  // Style common HTML elements in tooltip content
  h4 {
    font-size: var(--font-sm);
    font-weight: 600;
    margin-bottom: var(--size-8);
    color: var(--foreground-100);
  }


  p {
    font-size: var(--font-sm);
    margin-bottom: var(--size-8);
    line-height: var(--lineheight-md);
    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    font-weight: 600;
    color: var(--foreground-100);
  }

  ul, ol {
    margin: var(--size-8) 0;
    padding-left: var(--size-20);
    
    li {
      font-size: var(--font-sm);
      margin-bottom: var(--size-4);
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.a-tooltip-popover[data-side="bottom"] {
  animation-name: fadeTooltipDown;
}

@keyframes fadeTooltipUp {
  from {
    opacity: 0;
    transform: translateY(0.5em);
  }
}

@keyframes fadeTooltipDown {
  from {
    opacity: 0;
    transform: translateY(-0.5em)
  }
}
</style>