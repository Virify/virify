<template>
  <div>
    <button @click="toggle('add')">
      <Icon name="healthicons:heart-outline-24px" />
    </button>
    <button @click="toggle('remove')">
      <Icon name="material-symbols:delete" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  listingId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'toggle', listingId: number, action: 'add' | 'remove'): void;
}>();

const toggle = (action: 'add' | 'remove') => {
  emit('toggle', props.listingId, action);
};
</script>
