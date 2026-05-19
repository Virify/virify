<template>
  <ClientOnly>
    <UPopover
      v-model:open="open"
      :ui="{ content: 'p-3 w-72' }"
      :content="{ align: 'end' }"
    >
      <UButton
        variant="ghost"
        color="neutral"
        size="xs"
        icon="i-lucide-share-2"
        :padded="false"
        title="Share listing"
      />

      <template #content>
        <p class="body-sm text-muted pb-2 font-medium">Share listing</p>

        <!-- Social grid -->
        <div class="grid grid-cols-3 gap-1 mb-2">
          <UButton
            v-for="platform in platforms"
            :key="platform.label"
            variant="subtle"
            color="neutral"
            size="xs"
            class="flex flex-col items-center gap-1 h-auto py-3 px-1"
            @click="share(platform)"
          >
            <UTooltip :text="`Open on ${platform.label}`">
              <UIcon
                :name="platform.icon"
                class="w-4 h-4 shrink-0"
                :style="{ color: platform.color }"
              />
            </UTooltip>
          </UButton>
        </div>

        <USeparator class="mb-2" />

        <!-- Copy link -->
        <UButton
          variant="subtle"
          color="neutral"
          size="xs"
          icon="i-lucide-copy"
          class="w-full justify-start body-sm"
          :label="copied ? 'Copied!' : 'Copy link'"
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          @click="copyLink"
        />
      </template>
    </UPopover>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  url: string;
  title?: string;
}

const props = defineProps<Props>();

const open = ref(false);
const copied = ref(false);

const platforms = [
  {
    label: "Facebook",
    icon: "i-simple-icons-facebook",
    color: "#1877F2",
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "X",
    icon: "i-simple-icons-x",
    color: "currentColor",
    href: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: "WhatsApp",
    icon: "i-simple-icons-whatsapp",
    color: "#25D366",
    href: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
  },
  {
    label: "Reddit",
    icon: "i-simple-icons-reddit",
    color: "#FF4500",
    href: (url: string, title: string) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    label: "Pinterest",
    icon: "i-simple-icons-pinterest",
    color: "#E60023",
    href: (url: string, title: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
  },
  {
    label: "LinkedIn",
    icon: "i-simple-icons-linkedin",
    color: "#0A66C2",
    href: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

function share(platform: (typeof platforms)[number]) {
  window.open(
    platform.href(props.url, props.title ?? ""),
    "_blank",
    "noopener,noreferrer,width=600,height=500",
  );
  open.value = false;
}

async function copyLink() {
  await navigator.clipboard.writeText(props.url);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
    open.value = false;
  }, 1500);
}
</script>
