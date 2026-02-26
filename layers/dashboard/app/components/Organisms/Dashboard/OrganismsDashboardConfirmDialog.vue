<template>
  <UModal
    v-model:open="isOpen"
    :ui="{
      overlay: 'backdrop-blur-sm',
      content: 'max-w-md',
    }"
  >
    <template #title>
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center"
          :class="iconContainerClass"
        >
          <UIcon :name="iconName" class="w-5 h-5" />
        </div>
        <h2 class="title-sm m-0!">{{ title }}</h2>
      </div>
    </template>
    
    <template #body>
      <p class="body-sm text-muted-foreground m-0!">{{ message }}</p>
    </template>
    
    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          size="sm"
          variant="outline"
          color="neutral"
          class="body-sm"
          :label="cancelLabel"
          @click="handleCancel"
        />
        <UButton
          size="sm"
          :variant="confirmVariant"
          :color="confirmColor"
          :label="confirmLabel"
          :loading="loading"
          class="body-sm text-white! bg-red-600! hover:bg-red-700!"
          @click="handleConfirm"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  type: 'danger',
  loading: false,
});

const emit = defineEmits<{
  'confirm': [];
  'cancel': [];
}>();

const isOpen = ref(false);

const iconName = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'i-lucide-trash-2';
    case 'warning':
      return 'i-lucide-alert-triangle';
    case 'info':
      return 'i-lucide-info';
    default:
      return 'i-lucide-alert-triangle';
  }
});

const iconContainerClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    case 'warning':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
    case 'info':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
  }
});

const confirmColor = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'primary';
    default:
      return 'error';
  }
});

const confirmVariant = computed(() => 'solid' as const);

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  close();
  emit('cancel');
}

defineExpose({
  open,
  close,
  isOpen,
});
</script>
