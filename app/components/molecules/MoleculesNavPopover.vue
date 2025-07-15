<template>
  <div v-if="hasMenuItems" class="m-menu-wrapper">
    <!-- Menu Toggle Button -->
    <button 
      type="button" 
      class="m-burger-menu-toggle" 
      :class="{ hidden: menuOpen }" 
      @click="toggleMenu"
      aria-label="Toggle menu" 
      :aria-expanded="menuOpen"
    >
      <div class="m-burger-menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    <!-- Menu Overlay -->
    <div 
      class="m-menu-overlay" 
      :class="{ active: menuOpen }" 
      @click="closeMenu"
    ></div>

    <!-- Menu Container -->
    <div class="m-menu-container" :class="{ open: menuOpen }">
      <div class="m-menu-container-header">
        <h2 class="body-sm font-bold">Menu</h2>
        <button 
          type="button" 
          class="m-menu-close-button" 
          @click="closeMenu" 
          aria-label="Close menu"
        >
          <AtomsIcon width="20" height="20" icon="cross" />
        </button>
      </div>
      
      <div v-for="(group, index) in options" :key="`menu-${index}`" class="m-menu-group">
        <button 
          @click="toggleGroup(index)" 
          class="m-menu-header" 
          :class="{ expanded: expandedGroups[index] }"
          type="button" 
          :aria-expanded="expandedGroups[index] ? 'true' : 'false'"
          :aria-controls="`menu-group-${index}`"
        >
          <AtomsIcon width="24" height="24" :icon="group.icon" class="m-menu-icon" />
          <h3 class="body-sm font-bold">{{ group.title }}</h3>
          <AtomsIcon width="16" height="16" icon="arrow-right" class="m-menu-chevron" />
        </button>
        
        <ul 
          :id="`menu-group-${index}`" 
          class="m-menu-list" 
          :class="{ expanded: expandedGroups[index] }"
          v-show="expandedGroups[index]"
        >
          <li v-for="(item, idx) in group.items" :key="`menu-item-${idx}`" class="m-menu-item">
            <AtomsIcon :name="item.icon" :icon="item.icon" height="22" width="22" class="m-menu-item-icon" />
            
            <NuxtLink v-if="!item.action" :to="item.url" class="m-menu-link body-sm">
              {{ item.name }}
              <span v-if="item.countKey && getAggregateCount(item.countKey)" class="body-xs font-bold">
                ({{ getAggregateCount(item.countKey) }})
              </span>
            </NuxtLink>
            
            <button v-else @click="handleMenuNavAction(item.action)" class="m-menu-link body-sm">
              {{ item.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";

// Props
const props = defineProps({
  options: {
    type: Array as PropType<NavigationGroup[]>,
    required: true,
  },
});

// Composables
const config = useRuntimeConfig();
const { data } = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection");
const { clear } = useUserSession();
const { fetchUserItemsAggregates, getAggregateCount, handleAggregateUpdate } = useNotifications();
const { handleOutgoingMessages } = useWebSocketServer();

// State
const menuOpen = ref(false);
const expandedGroups = ref<Record<number, boolean>>({});

// Computed
const hasMenuItems = computed(() => {
  return Array.isArray(props.options) && props.options.length > 0;
});

// WebSocket Events
const navigationWebSocketEvents = {
  onAggregateUpdate: ({ 
    aggregateType, 
    operation 
  }: { 
    aggregateType: keyof UserItemsAggregates; 
    operation: "add" | "remove" | "update" 
  }) => {
    handleAggregateUpdate({ 
      type: "aggregate_update",
      aggregateType, 
      operation,
      to: 0,
      timestamp: new Date().toISOString()
    });
  },
};

// WebSocket Message Handlers
watchEffect(() => {
  if (data.value) {
    handleOutgoingMessages(data.value, navigationWebSocketEvents);
  }
});

// Lifecycle
onMounted(() => {
  fetchUserItemsAggregates();
  
  // Set all menu groups to expanded by default
  if (props.options?.length) {
    props.options.forEach((_, index) => {
      expandedGroups.value[index] = true;
    });
  }
});

// Menu Functions
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  document.body.style.overflow = menuOpen.value ? "hidden" : "";
}

function closeMenu() {
  menuOpen.value = false;
  document.body.style.overflow = "";
}

function toggleGroup(index: number) {
  expandedGroups.value = {
    ...expandedGroups.value,
    [index]: !expandedGroups.value[index],
  };
}

function handleMenuNavAction(action: string) {
  handleNavAction(action);
  closeMenu();
}

// Navigation Actions
async function logout() {
  await clear();
  
  // Only redirect to homepage if currently on /account routes
  const route = useRoute();
  if (route.path.startsWith('/account')) {
    navigateTo("/");
  }
}

async function deleteAccount() {
  try {
    await $fetch("/auth/delete", { method: "DELETE" });
    await clear();
    navigateTo("/");
  } catch (error) {
    console.error("Error deleting account:", error);
  }
}

function handleNavAction(action: string) {
  switch (action) {
    case "logout":
      logout();
      break;
    case "delete":
      deleteAccount();
      break;
    default:
      console.warn(`Action '${action}' not implemented`);
  }
}
</script>

<style scoped lang="scss">
@use "#styles/_utils/functions" as fn;

.m-menu-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--size-16);
  margin: 0;
  padding: 0;
  position: relative;
}

/* Burger Menu Styles */
.m-burger-menu-toggle {
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  z-index: 1001;
  transition: opacity 0.2s ease-out, visibility 0.2s ease-out;

  &.hidden {
    opacity: 0;
    visibility: hidden;
  }
}

.m-burger-menu-icon {
  width: 30px;
  height: 24px;
  position: relative;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: var(--foreground-100);
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: 0px;
    }

    &:nth-child(2) {
      top: 10px;
    }

    &:nth-child(3) {
      top: 20px;
    }
  }
}

/* Menu Overlay */
.m-menu-overlay {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--animation-fast) ease-out;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

/* Menu Container */
.m-menu-container {
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  max-width: 300px;
  background-color: var(--background-200);
  z-index: 1000;
  padding: var(--size-16);
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform var(--animation-fast) ease-out;

  &.open {
    transform: translateX(0);
  }
}

.m-menu-container-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--size-16);
  padding-bottom: var(--size-12);
  border-bottom: 1px solid var(--border-color, #eee);
}

.m-menu-close-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color var(--animation-fast);
  color: var(--foreground-100);
  position: relative;
  z-index: 1002;

  &:hover {
    background-color: var(--background-100);
  }
}

/* Menu Groups */
.m-menu-group {
  margin-bottom: var(--size-16);
  padding-bottom: var(--size-16);
  border-bottom: 1px solid var(--border-color, #eee);

  &:last-child {
    border-bottom: none;
  }
}

.m-menu-header {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  margin-bottom: var(--size-8);
  padding: var(--size-2);
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  position: relative;
  border-radius: var(--border-radius-md);

  &:hover {
    background-color: var(--background-100);
  }

  &.expanded {
    .m-menu-chevron {
      transform: rotate(90deg);
    }
  }

  h3 {
    margin: 0;
    flex-grow: 1;
  }
}

.m-menu-chevron {
  transition: transform 0.3s ease;
  margin-left: auto;
  color: var(--foreground-80, #666);
}

.m-menu-icon {
  display: block;
  width: var(--size-28);
  height: var(--size-28);
}

/* Menu Items */
.m-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.m-menu-item {
  display: flex;
  align-items: center;
  gap: var(--size-5);
  color: var(--foreground-100);
  padding-left: var(--size-6);
  width: 100%;
  margin: var(--size-2) 0;
  border-radius: var(--border-radius-md);

  &:hover {
    background: var(--background-100);
  }
}

.m-menu-item-icon {
  width: var(--size-20);
  height: var(--size-20);
  flex-shrink: 0;
}

.m-menu-link {
  display: block;
  padding: var(--size-6) var(--size-14);
  white-space: nowrap;
  text-decoration: none;
  border-radius: var(--border-radius-md);
  background: transparent;
  transition: background-color var(--animation-fast);
  color: var(--foreground-100);
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}
</style>