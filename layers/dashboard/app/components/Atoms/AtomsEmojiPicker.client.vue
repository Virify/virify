<template>
  <div ref="pickerRef" />
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'emojiSelect', emoji: string): void;
}>();

const pickerRef = ref<HTMLDivElement | null>(null);
const colorMode = useColorMode();

async function createPicker() {
  const { Picker } = await import('emoji-mart');
  const { default: data } = await import('@emoji-mart/data');

  if (pickerRef.value) {
    pickerRef.value.innerHTML = '';
  }

  const picker = new Picker({
    data,
    onEmojiSelect: (emoji: { native: string }) => {
      emit('emojiSelect', emoji.native);
    },
    theme: colorMode.value === 'dark' ? 'dark' : 'light',
    set: 'native',
    previewPosition: 'none',
    skinTonePosition: 'none',
  });

  pickerRef.value?.appendChild(picker as unknown as HTMLElement);
}

onMounted(createPicker);
watch(() => colorMode.value, createPicker);
</script>
