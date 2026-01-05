<template>
  <MoleculesInput
    type="text"
    v-model="searchQuery"
    :placeholder="placeholder"
    :icon="icon"
    :iconTitle="iconTitle"
    @update:model-value="onInput"
    :deleteble="true"
  />
</template>
<script lang="ts" setup generic="T extends { title: string }">
interface Props {
  guides: T[];
  placeholder?: string;
  iconTitle?: string;
  icon?: string;
  deleteble?: boolean;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'filter', value: T[]): void;
}>();
const searchQuery = ref('');

function onInput(val: string) {
  searchQuery.value = val;
}

const filteredGuides = computed(() => {
  const allGuides = props.guides || [];
  if (!searchQuery.value) return allGuides;
  
  return allGuides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  ) as T[]
});

watch(filteredGuides, newVal => emits('filter', newVal), { immediate: true })
</script>