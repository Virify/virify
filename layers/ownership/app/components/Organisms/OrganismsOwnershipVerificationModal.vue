<template>
  <UModal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{ content: 'max-w-lg' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-primary" />
        <span class="font-semibold text-base">Ownership Verification</span>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          icon="i-lucide-info"
          color="info"
          variant="soft"
          title="Why we need this"
          description="To protect buyers and renters, private sellers must verify ownership before publishing a listing."
        />

        <UAlert
          icon="i-lucide-alert-triangle"
          color="secondary"
          variant="soft"
          title="Important guidelines"
          description="Please upload clear and legible documents that show proof of ownership, such as a recent utility bill, property tax statement, or deed. One document MUST be a form of ID that includes your name and the property address."
        />

        <!-- Document 1 -->
        <div class="flex flex-col gap-1">
          <p class="text-sm font-medium">
            Document 1 <span class="text-error">*</span>
          </p>
          <UFileUpload
            v-model="fileOne"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            icon="i-lucide-file-text"
            label="Drop your document here"
            description="PDF, Word, or image — max 10 MB"
            color="neutral"
            :disabled="uploadingOne"
            :ui="{ base: 'min-h-28' }"
            @update:model-value="onFileOneSelected"
          />
          <div
            v-if="uploadingOne"
            class="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <UIcon name="i-lucide-loader" class="animate-spin w-3 h-3" />
            Uploading…
          </div>
          <div
            v-else-if="docOne"
            class="flex items-center gap-1.5 text-xs text-green-600"
          >
            <UIcon name="i-lucide-check-circle" class="w-3 h-3" />
            Uploaded successfully
          </div>
        </div>

        <!-- Document 2 -->
        <div class="flex flex-col gap-1">
          <p class="text-sm font-medium">
            Document 2 <span class="text-error">*</span>
          </p>
          <UFileUpload
            v-model="fileTwo"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            icon="i-lucide-file-text"
            label="Drop your document here"
            description="PDF, Word, or image — max 10 MB"
            color="neutral"
            :disabled="uploadingTwo"
            :ui="{ base: 'min-h-28' }"
            @update:model-value="onFileTwoSelected"
          />
          <div
            v-if="uploadingTwo"
            class="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <UIcon name="i-lucide-loader" class="animate-spin w-3 h-3" />
            Uploading…
          </div>
          <div
            v-else-if="docTwo"
            class="flex items-center gap-1.5 text-xs text-green-600"
          >
            <UIcon name="i-lucide-check-circle" class="w-3 h-3" />
            Uploaded successfully
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between gap-2 w-full">
        <UButton
          color="neutral"
          variant="ghost"
          @click="close"
          size="xs"
          class="body-sm"
          >Cancel</UButton
        >
        <UButton
          color="neutral"
          :disabled="!canSubmit"
          :loading="submitting"
          @click="handleSubmit"
          variant="outline"
          class="body-sm"
        >
          Submit for review
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ draftListingId: number }>();
const isOpen = ref(false);
const emit = defineEmits<{ submitted: [] }>();
const { uploadDoc, submit } = useOwnershipVerification(
  computed(() => props.draftListingId),
);
const toast = useToast();

const fileOne = ref<File | null>(null);
const fileTwo = ref<File | null>(null);

const docOne = ref<{ key: string; originalName: string } | null>(null);
const docTwo = ref<{ key: string; originalName: string } | null>(null);

const uploadingOne = ref(false);
const uploadingTwo = ref(false);
const submitting = ref(false);

const canSubmit = computed(
  () =>
    !!(
      docOne.value &&
      docTwo.value &&
      !uploadingOne.value &&
      !uploadingTwo.value
    ),
);

function open() {
  fileOne.value = null;
  fileTwo.value = null;
  docOne.value = null;
  docTwo.value = null;
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

async function onFileOneSelected(file: File | null | undefined) {
  if (!file) {
    docOne.value = null;
    return;
  }
  uploadingOne.value = true;
  docOne.value = await uploadDoc(file);
  uploadingOne.value = false;
}

async function onFileTwoSelected(file: File | null | undefined) {
  if (!file) {
    docTwo.value = null;
    return;
  }
  uploadingTwo.value = true;
  docTwo.value = await uploadDoc(file);
  uploadingTwo.value = false;
}

async function handleSubmit() {
  if (!docOne.value || !docTwo.value) return;
  submitting.value = true;
  const ok = await submit(
    docOne.value.key,
    docOne.value.originalName,
    docTwo.value.key,
    docTwo.value.originalName,
  );
  submitting.value = false;
  if (ok) {
    emit("submitted");
    toast.add({
      title: "Documents submitted",
      description:
        "Your ownership documents have been sent for review. We'll notify you once a decision is made.",
      color: "success",
      icon: "i-lucide-check-circle",
    });
    close();
  }
}

defineExpose({ open, close });
</script>
