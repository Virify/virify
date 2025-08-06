<template>
  <div>
    <!-- Mobile hamburger menu -->
    <div class="mobile-nav-bar" :class="{ 'hidden': isMobileMenuOpen }">
      <button class="mobile-burger" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <div class="burger-lines">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
      </button>
    </div>

    <!-- Mobile navigation overlay -->
    <div class="mobile-nav-overlay" :class="{ 'open': isMobileMenuOpen }" @click="isMobileMenuOpen = false">
      <aside class="mobile-sidebar" @click.stop>
        <div class="sidebar-content">
          <div class="mobile-nav-header">
            <button class="close-btn" @click="isMobileMenuOpen = false">
              <AtomsIcon icon="cross" size="24" />
            </button>
          </div>
          <slot name="navigation">
            <div class="navigation">
              <div class="nav-container">
                <template v-for="(group, groupIndex) in navigationGroups" :key="group.title">
                  <!-- Group header -->
                  <div class="icon-cell tooltip-trigger" :class="{ 'last-visible': isLastVisibleGroup(groupIndex) }" @click="toggleGroup(groupIndex)">
                    <div class="icon-btn">
                      <AtomsIcon :icon="group.icon" size="32" />
                    </div>
                  </div>
                  <div class="text-cell group-header body-md" :class="{ 'last-visible': isLastVisibleGroup(groupIndex) }" @click="toggleGroup(groupIndex)">
                    <span>{{ group.title }}</span>
                    <AtomsIcon 
                      :icon="'chevron-down'" 
                      size="20" 
                      :class="{ 'rotated': groupStates[groupIndex] }" 
                      class="chevron-icon" 
                    />
                  </div>

                  <!-- Group items -->
                  <template v-for="(item, itemIndex) in group.items" :key="item.name">
                    <NuxtLink 
                      v-if="groupStates[groupIndex]"
                      :to="item.url" 
                      class="icon-cell group-item tooltip-trigger"
                      @click="handleNavClick(item); isMobileMenuOpen = false"
                    >
                      <div class="icon-btn">
                        <AtomsIcon :icon="item.icon" size="22" />
                      </div>
                    </NuxtLink>
                    <div 
                      v-if="groupStates[groupIndex]"
                      class="text-cell group-item body-sm"
                    >
                      <NuxtLink :to="item.url" @click="handleNavClick(item); isMobileMenuOpen = false">
                        {{ item.name }}
                      </NuxtLink>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </slot>
        </div>
      </aside>
    </div>

    <aside class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
      <div class="sidebar-content">
        <!-- Sidebar toggle button -->
        <button class="sidebar-toggle" @click="isSidebarCollapsed = !isSidebarCollapsed">
          <AtomsIcon :icon="isSidebarCollapsed ? 'chevron-right' : 'chevron-left'" size="20" />
        </button>
        <slot name="navigation">
          <div class="navigation">
            <div class="nav-container">
            
              <template v-for="(group, groupIndex) in navigationGroups" :key="group.title">
         
                <div class="icon-cell tooltip-trigger" :class="{ 'last-visible': isLastVisibleGroup(groupIndex) }" @click="toggleGroup(groupIndex)" :data-tooltip="group.title">
                  <div class="icon-btn">
                    <AtomsIcon :icon="group.icon" size="32" />
                  </div>
                </div>
                <div class="text-cell group-header body-md" :class="{ 'last-visible': isLastVisibleGroup(groupIndex), 'collapsed-hidden': isSidebarCollapsed }" @click="toggleGroup(groupIndex)">
                  <span>{{ group.title }}</span>
                  <AtomsIcon 
                    :icon="'chevron-down'" 
                    size="20" 
                    :class="{ 'rotated': groupStates[groupIndex] }" 
                    class="chevron-icon" 
                  />
                </div>

            
                <template v-for="(item, itemIndex) in group.items" :key="item.name">
                  <NuxtLink 
                    :to="item.url" 
                    class="icon-cell group-item tooltip-trigger" 
                    :style="{ 
                      maxHeight: groupStates[groupIndex] ? '50px' : '0px',
                      opacity: groupStates[groupIndex] ? 1 : 0
                    }"
                    @click="handleNavClick(item)" 
                    :data-tooltip="item.name"
                  >
                    <div class="icon-btn">
                      <AtomsIcon :icon="item.icon" size="22" />
                    </div>
                  </NuxtLink>
                  <div 
                    class="text-cell group-item body-sm" 
                    :class="{ 'collapsed-hidden': isSidebarCollapsed }"
                    :style="{ 
                      maxHeight: groupStates[groupIndex] ? '50px' : '0px',
                      opacity: groupStates[groupIndex] ? 1 : 0
                    }"
                  >
                    <NuxtLink :to="item.url" @click="handleNavClick(item)">
                      {{ item.name }}
                    </NuxtLink>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </slot>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { navigationGroups } from '~/utils/account/navigation';

// Sidebar collapse state (works on desktop and mobile)
const isSidebarCollapsed = ref(false);

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Group accordion states - start with first group open
const groupStates = ref([true, false, false]);

function toggleGroup(index: number) {
  groupStates.value[index] = !groupStates.value[index];
}

function handleNavClick(item: any) {
  if (item.action === 'logout') {
    // Handle logout action
    console.log('Logout clicked');
  }
}

function isLastVisibleGroup(groupIndex: number) {
  // If this group is expanded, it's never the last visible (its items are)
  if (groupStates.value[groupIndex]) {
    return false;
  }
  
  // If this group is collapsed, check if it's the last collapsed group
  // or if all groups after it are also collapsed
  for (let i = groupIndex + 1; i < navigationGroups.length; i++) {
    // If we find any group after this one that has visible content (header or items)
    return false;
  }
  
  return true;
}
</script>

<style lang="scss" scoped>
// Mobile navigation bar
.mobile-nav-bar {
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 80px;
    left: 20px;
    z-index: 1001;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  &.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .mobile-burger {
    background: var(--blue-400);
    border: 2px solid var(--background-100);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }

    .burger-lines {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .line {
        width: 20px;
        height: 2px;
        background: white;
        border-radius: 1px;
        transition: all 0.3s ease;
      }
    }

    &:hover .burger-lines .line {
      background: rgba(255, 255, 255, 0.8);
    }
  }
}

// Mobile navigation overlay
.mobile-nav-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &.open {
    opacity: 1;
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    display: block;
  }

  .mobile-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 80vw;
    max-width: 320px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    .sidebar-content {
      height: 100vh;
      overflow-y: auto;
    }

    .mobile-nav-header {
      padding: var(--size-16);
      display: flex;
      justify-content: flex-end;

      .close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        :deep(svg) {
          color: white;
        }
      }
    }
  }

  &.open .mobile-sidebar {
    transform: translateX(0);
  }
}

.sidebar {
  height: fit-content;
  z-index: 1000;
  width: auto;
  transition: width 0.3s ease;
  position: relative;

  &.collapsed {
    .nav-container {
      grid-template-columns: auto;
    }
  }

  @media (max-width: 768px) {
    display: none !important; // Hide desktop sidebar on mobile
  }
}

.sidebar-content {
  background: var(--blue-400);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 0;
  }

  .sidebar-toggle {
    position: absolute;
    top: var(--size-8);
    right: var(--size-8);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    z-index: 20;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    :deep(svg) {
      color: white;
    }
  }
}

.navigation {
  padding: var(--size-16);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .nav-container {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0;

    @media (max-width: 768px) {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }


    .icon-cell {
      background: var(--secondary-400);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: opacity 0.2s ease;
      text-decoration: none;
      color: inherit;
      position: relative;

      &:hover {
        opacity: 0.8;
      }

      &:first-child {
        border-top-left-radius: var(--border-radius-xl);
        border-top-right-radius: var(--border-radius-xl);
      }

      &.last-visible {
        border-bottom-left-radius: var(--border-radius-xl);
        border-bottom-right-radius: var(--border-radius-xl);
      }

      &:nth-last-child(2) {
        border-bottom-left-radius: var(--border-radius-xl);
        border-bottom-right-radius: var(--border-radius-xl);
      }

      .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--size-12) var(--size-16);
        cursor: pointer;
        transition: opacity 0.2s ease;
        text-decoration: none;
        color: inherit;
        width: 100%;
        position: relative;

        &:hover {
          opacity: 0.8;
        }

        :deep(svg) {
          color: white;
        }

      }

      // Make group header icons larger
      &.group-header-icon {
        .icon-btn {
          :deep(svg) {
            width: 32px;
            height: 32px;
          }
        }
      }
    }

    .text-cell {
      background: var(--blue-400);
      display: flex;
      align-items: center;
      padding: 0 var(--size-16);
      color: var(--monochrome-900);
      font-weight: 500;

      &.last-visible {
        border-bottom-right-radius: var(--border-radius-xl);
      }

      &.group-header {
        font-weight: 600;
      }

      &.group-header {
        font-weight: 600;
        cursor: pointer;
        justify-content: space-between;
        transition: background 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .chevron-icon {
          transition: transform 0.3s ease;
          
          &.rotated {
            transform: rotate(180deg);
          }
          
          :deep(svg) {
            width: 16px;
            height: 16px;
          }
        }
      }

      &.group-item {
        transition: all 0.3s ease;
        transform-origin: top;
      }

      a {
        color: inherit;
        padding: 0 var(--size-8);
        text-decoration: none;
        border-radius: var(--border-radius-md);
        transition: background 0.2s ease;
        width: 100%;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }

    // Collapsed sidebar text hiding
    .collapsed-hidden {
      display: none !important;
    }

    // Accordion animation for group items
    .icon-cell.group-item,
    .text-cell.group-item {
      transition: max-height 0.3s ease, opacity 0.3s ease;
      
      &.icon-cell {
        overflow: visible; // Allow tooltips to show
      }
      
      &.text-cell {
        overflow: hidden; // Keep text cells clipped
      }
    }
  }
}

// Global tooltip styles (outside nested selectors)
.sidebar.collapsed {
  .tooltip-trigger:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: var(--size-8);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: var(--size-4) var(--size-8);
    border-radius: var(--border-radius-sm);
    font-size: 12px;
    white-space: nowrap;
    z-index: 9999;
    pointer-events: none;
  }
}
</style>