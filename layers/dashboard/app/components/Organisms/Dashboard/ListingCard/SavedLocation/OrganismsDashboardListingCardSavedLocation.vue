<template>
  <UPageCard
    variant="naked"
    class="p-4 border border-accented/50 bg-elevated/30 rounded-lg h-full flex flex-col transition-all duration-300 hover:border-accented"
    :ui="{
      header: 'mb-0 w-full',
      title: 'my-1',
      description: 'text-(--foreground-100) w-full flex-1 flex flex-col justify-between',
      footer: 'mt-1 pt-0 w-full',
      body: 'w-full flex flex-col flex-1',
    }"
  >
    <!-- Icon and Name Header -->
    <template #header>
      <div class="flex items-start gap-3 w-full">
        <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-map-pin" class="w-5 h-5 text-secondary" />
        </div>
        <div class="flex flex-col gap-1 min-w-0 flex-1">
          <h3 class="title-sm m-0! truncate">{{ location.name }}</h3>
          <p class="body-xs text-muted-foreground m-0!">{{ location.location }}</p>
        </div>
        <!-- Date badge - top right -->
        <UBadge 
          icon="i-lucide-calendar" 
          size="md" 
          color="secondary" 
          variant="subtle"
          class="shrink-0"
        >
          Added {{ formatDate(location.createdAt) }}
        </UBadge>
      </div>
    </template>

    <template #description>
      <div class="flex flex-col gap-3 h-full">
        <!-- Actions -->
        <div class="flex flex-wrap gap-2 mt-auto pt-2">
          <UButton
            variant="subtle"
            size="xs"
            color="secondary"
            class="font-semibold flex-1 justify-center"
            icon="i-lucide-search"
            label="Search"
            @click="handleSearch"
          />
          <UButton
            variant="subtle"
            size="xs"
            color="secondary"
            class="font-semibold flex-1 justify-center"
            icon="i-lucide-pencil"
            label="Edit"
            @click="handleEdit"
          />
          <UButton
            variant="subtle"
            size="xs"
            color="error"
            class="font-semibold flex-1 justify-center cursor-pointer"
            icon="i-lucide-trash-2"
            label="Delete"
            :disabled="isDeleting"
            @click="openDeleteDialog"
          />
        </div>
      </div>
    </template>

    <!-- Delete Confirmation Dialog -->
    <OrganismsDashboardConfirmDialog
      ref="deleteDialog"
      title="Delete Location"
      message="Are you sure you want to delete this saved location? This action cannot be undone."
      confirm-label="Delete"
      type="danger"
      :loading="isDeleting"
      @confirm="handleDeleteConfirm"
    />
  </UPageCard>
</template>

<script setup lang="ts">
import OrganismsDashboardConfirmDialog from '~~/layers/dashboard/app/components/Organisms/Dashboard/OrganismsDashboardConfirmDialog.vue';

interface Props {
  location: UserSavedLocation;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'edit': [location: UserSavedLocation];
  'delete': [id: number];
  'search': [location: UserSavedLocation];
}>();

const isDeleting = ref(false);
const deleteDialog = ref<InstanceType<typeof OrganismsDashboardConfirmDialog> | null>(null);

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function handleSearch() {
  emit('search', props.location);
}

function handleEdit() {
  emit('edit', props.location);
}

function openDeleteDialog() {
  deleteDialog.value?.open();
}

async function handleDeleteConfirm() {
  isDeleting.value = true;
  try {
    emit('delete', props.location.id);
    deleteDialog.value?.close();
  } finally {
    isDeleting.value = false;
  }
}
</script>
