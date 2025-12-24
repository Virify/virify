<template>
  <div class="feature-tile" :class="tileClasses">
    <!-- Header with icon and text side by side -->
    <div class="feature-tile__header">
      <div class="feature-tile__icon">
        <span v-if="icon" class="feature-tile__emoji">{{ icon }}</span>
        <AtomsIcon v-else-if="iconName" :icon="iconName" :size="32" />
      </div>
      <div class="feature-tile__header-text">
        <h3 :class="{
          'title-xs': size === 'xs',
          'title-sm': size === 'sm',
          'title-md': size === 'md',
        }">{{ title }}</h3>
        <p v-if="subtitle" :class="{
          'body-xs': size === 'xs' || size === 'sm',
          'body-md': size === 'sm',
        }">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Content below header -->
    <p v-if="description" class="feature-tile__description" :class="{
      'body-xs': size === 'xs',
      'body-sm': size === 'sm' || size === 'md',
    }">{{ description }}</p>
    <div v-if="pills && pills.length" class="feature-tile__pills">
      <AtomsPill v-for="(pill, index) in pills" :key="index" class="feature-tile__pill | body-sm">
        {{ pill }}
      </AtomsPill>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  icon?: string
  iconName?: string
  title: string
  subtitle?: string
  description?: string
  pills?: string[]
  variant?: 'default' | 'primary' | 'blue' | 'secondary' | 'tertiary'
  hasBackgroundImage?: boolean
  layout?: 'vertical' | 'horizontal'
  size?: 'xs' | 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  hasBackgroundImage: false,
  layout: 'vertical',
  size: 'sm',
})

const tileClasses = computed(() => {
  const classes = [`feature-tile--${props.variant}`, `feature-tile--${props.layout}`]
  if (props.hasBackgroundImage) {
    classes.push('feature-tile--with-background')
  }
  return classes
})
</script>

<style lang="scss" scoped>
@use "#styles/_utils/functions" as fn;

.feature-tile {
  border-radius: var(--border-radius-xl);
  padding: var(--size-24);
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: var(--monochrome-900);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: var(--size-12);
  }

  // Layout variants
  &--horizontal {
    flex-direction: row;
    align-items: center;
    gap: var(--size-20);

    .feature-tile__header {
      flex: 1;
    }

    .feature-tile__pills {
      margin-top: var(--size-8);
    }
  }

  &--vertical {
    flex-direction: column;
  }

  &__icon {
    display: flex;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-lg);
    padding: var(--size-24);
    align-items: center;
    justify-content: center;

    .a-icon {
      color: var(--monochrome-900);
    }
  }

  &__emoji {
    font-size: 2rem;
  }


  &__header-text {
    flex: 1;

    h4 {
      margin: 0;
      color: inherit;
    }

    p {
      margin: 0;
      color: inherit;
      opacity: 0.9;
    }
  }

  &__pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
  }

  &__pill {
    background: rgba(255, 255, 255, 0.2);
    color: inherit;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &__description {
    color: inherit;
    line-height: 1.5;
    margin: 0;
  }

  // Background variants
  &--with-background {
    background-image: url('/img/logo-background.svg');
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: auto 150%;
  }

  // Color variants
  &--default {
    background-color: fn.faded-color(12%, var(--monochrome-600));
    color: var(--monochrome-900);

    &:hover {
      background-color: fn.faded-color(24%, var(--monochrome-600));
    }

    .feature-tile__icon {
      background: rgba(255, 255, 255, 0.1);

      .a-icon {
        color: var(--secondary-500);
      }
    }

    .feature-tile__header-text {
      h4 {
        color: var(--secondary-500);
      }
    }

    &.feature-tile--with-background {
      background-color: fn.faded-color(12%, var(--monochrome-600));

      &:hover {
        background-color: fn.faded-color(24%, var(--monochrome-600));
      }
    }
  }

  &--primary {
    background-color: var(--primary-400);

    .feature-tile__icon {
      background: rgba(255, 255, 255, 0.1);

      .a-icon {
        color: var(--secondary-500);
      }
    }

    .feature-tile__header-text {
      h4 {
        color: var(--secondary-500);
      }
    }

    &.feature-tile--with-background {
      background-image: url('/img/logo-background.svg'), linear-gradient(135deg, var(--primary-400), var(--primary-500));
    }
  }

  &--blue {
    background: linear-gradient(135deg, var(--blue-400), var(--blue-500));

    .feature-tile__icon {
      background: rgba(255, 255, 255, 0.1);

      .a-icon {
        color: var(--secondary-500);
      }
    }

    .feature-tile__header-text {
      h4 {
        color: var(--secondary-500);
      }
    }

    &.feature-tile--with-background {
      position: relative;
      background: linear-gradient(135deg, var(--blue-400), var(--blue-500));

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: url('/img/call-out-bg.svg');
        background-repeat: no-repeat;
        background-position: right;
        background-size: auto 150%;
        opacity: 0.3;
        pointer-events: none;
      }
    }
  }

  &--secondary {
    background: linear-gradient(135deg, var(--secondary-400), var(--secondary-300));
    color: var(--monochrome-900);

    .a-icon {
      color: var(--monochrome-900);
    }

    &.feature-tile--with-background {
      position: relative;
      background: linear-gradient(135deg, var(--secondary-400), var(--secondary-300));

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: url('/img/call-out-bg.svg');
        background-repeat: no-repeat;
        background-position: right;
        background-size: auto 150%;
        opacity: 0.3;
        pointer-events: none;
      }
    }
  }

  &--tertiary {
    background-color: var(--tertiary-400);

    &.feature-tile--with-background {
      background-image: url('/img/logo-background.svg'), linear-gradient(135deg, var(--tertiary-400), var(--tertiary-500));
    }
  }

}
</style>