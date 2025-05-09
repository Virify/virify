<template>
  <TooltipProvider delay-duration="2000">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot></slot>
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent :side-offset="5" class="a-tooltip-popover | body-sm lineheight-sm">
          <slot name="tooltip"></slot>
          <TooltipArrow :width="10" :height="5" class="a-tooltip-arrow" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script setup>
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow } from 'reka-ui';

</script>

<style>
.a-tooltip-popover {
  z-index: 2;
  background: var(--monochrome-100);
  color: var(--monochrome-900);
  padding: var(--size-8) var(--size-12);
  border-radius: var(--border-radius-lg);
  transform-origin: var(--reka-tooltip-content-transform-origin);
  animation: fadeTooltipUp var(--animation-slow) var(--ease-out);
}

@keyframes fadeTooltipUp {
  from {
    opacity: 0;
    transform: translateY(var(--size-12));
  }
}
</style>