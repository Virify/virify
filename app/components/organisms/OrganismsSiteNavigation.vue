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
              <nuxt-link :to="item.href" class="o-site-navigation-link | button button-ghost button-sm">{{
                item.label }}</nuxt-link>
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
        <button class="o-site-navigation__burger button button-monochrome button-sm" aria-label="Open menu"
          :aria-expanded="isMobileMenuOpen" aria-controls="mobile-nav-drawer" @click="toggleMobileMenu">
          ☰
        </button>
      </div>

      <!-- Mobile drawer -->
      <OrganismsNavigationMobileDrawer
        v-if="typeof isMobileMenuOpen === 'boolean'"
        :open="isMobileMenuOpen"
        :primary-items="centerItems"
        :action-items="actionItems"
        @close="toggleMobileMenu"
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
  dropdown,
} = useNavigation(navigationData)
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
@include mq.mobile-only {
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
