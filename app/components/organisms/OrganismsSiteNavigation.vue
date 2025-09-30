<template>
  <nav class="o-site-navigation">
    <div class="o-site-navigation__wrapper">
      <!-- Left: Brand -->
      <nuxt-link to="/" class="o-site-navigation__brand" aria-label="Virify Home">
        <AtomsIcon icon="logo/horizontal-colour" width="140" height="42" />
      </nuxt-link>

      <!-- Center: Guides (mega menu) -->
      <div class="o-site-navigation__center">
        <ul class="o-site-navigation-list o-site-navigation-list--center">
          <OrganismsMegaMenu
            v-for="item in centerItems"
            :key="item.id"
            :item="item"
            :dropdown="dropdown"
          />
        </ul>
      </div>

      <!-- Right: Auth / Account and burger -->
      <div class="o-site-navigation__actions">
        <ul class="o-site-navigation-list o-site-navigation-list--actions">
          <template v-for="item in actionItems" :key="item.id">
            <li v-if="item.type === 'link' && item.href">
              <nuxt-link 
                :to="item.href" 
                class="o-site-navigation-link | button button-ghost button-sm">
                {{ item.label }}
              </nuxt-link>
            </li>
            <li v-else-if="item.type === 'button'">
              <button @click.prevent="item.action && item.action()"
                :class="`o-site-navigation-link | button ${item.buttonClass || 'button-ghost'} button-sm`">
                {{ item.label }}
              </button>
            </li>
          </template>
        </ul>

        <!-- Mobile burger button -->
        <button
          type="button"
          :class="['o-site-navigation__burger', { 'is-active': isMobileMenuOpen }]"
          aria-label="Open menu"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-nav-drawer"
          @click="handleBurgerClick"
        >
          <span class="o-site-navigation__burger-box" aria-hidden="true">
            <span class="o-site-navigation__burger-line"></span>
            <span class="o-site-navigation__burger-line"></span>
            <span class="o-site-navigation__burger-line"></span>
          </span>
        </button>
      </div>

      <!-- Mobile drawer -->
      <OrganismsMobileDrawer
        :open="isMobileMenuOpen"
        :primary-items="centerItems"
        :action-items="actionItems"
        @close="closeMobileMenu"
      />
    </div>
  </nav>

</template>
<script setup lang="ts">

const { useNavigationData } = useSanity()
const { data: navigationData } = await useNavigationData()

const {
  centerItems,
  actionItems,
  isMobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
  dropdown,
} = useNavigation(navigationData)

function handleBurgerClick() {
  toggleMobileMenu()
}
</script>

<style lang="scss">
@use "#styles/_utils/media.scss" as mq;

.o-site-navigation {
  color: var(--monochrome-900);
  background-color: var(--background-400);
  width: 100%;

  ul,
  li {
    margin: 0;
    list-style: none;
  }

  &__wrapper {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    justify-self: start;
  }

  &__center {
    justify-self: center;
    display: flex;
    align-items: center;
    height: 100%;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-self: end;
  }

  &__burger {
    display: none;
    margin-right: var(--size-6);
    padding: 0;
    width: 44px;
    height: 44px;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  &__burger:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }

  &__burger-box {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    width: 24px;
    height: 18px;
  }

  &__burger-line {
    display: block;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    border-radius: 999px;
    transition: transform 220ms ease, opacity 180ms ease;
  }

  &__burger.is-active .o-site-navigation__burger-line:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  &__burger.is-active .o-site-navigation__burger-line:nth-child(2) {
    opacity: 0;
  }

  &__burger.is-active .o-site-navigation__burger-line:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  &-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: var(--size-8);

    @include mq.desktop {
      gap: var(--size-8);
    }
  }

  &-list--center {
    justify-content: center;
  }

  &-list--actions {
    justify-content: flex-end;
  }

  &-link {
    white-space: nowrap;
    text-decoration: none;
    color: inherit;
  }
}

/* Mobile behavior: show burger and collapse nav list */
@include mq.mobile-and-small-tablet {
  .o-site-navigation {
    &__wrapper {
      grid-template-columns: 1fr auto;
    }

    &__center {
      display: none;
    }

    &__actions {
      justify-content: flex-end;
    }

    &__actions>.o-site-navigation-list {
      display: none;
    }

    &__burger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    &-list {
      display: none;
      flex-direction: column;
      gap: var(--size-4);

      &.is-open {
        display: flex;
      }
    }
  }
}
</style>
