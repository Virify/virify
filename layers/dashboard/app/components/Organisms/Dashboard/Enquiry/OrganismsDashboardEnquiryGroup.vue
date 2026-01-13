<template>
  <UPageCard
    variant="subtle"
    :to="`/dashboard/enquiries/${group.listing?.id}`"
    :ui="{
      root: 'cursor-pointer gap-2! h-full bg-elevated transition-colors duration-150 group',
      header: 'body-sm w-full flex justify-between items-center mb-2',
      body: 'w-full flex-1 transition-colors duration-150',
      container: 'p-4!',
    }"
  >
    <template #body>
      <div class="flex flex-col gap-2 w-full h-full">
        <!-- Listing Card -->
        <OrganismsDashboardListingCardEnquiry v-if="group.listing" :listing="group.listing" />

        <!-- Summary Stats -->
        <MoleculesDashboardEnquiryGroupSummary
          :conversations="group.conversations"
          :listing-id="group.listing?.id"
          :user-id="user?.id"
        />
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
import type { User } from "#auth-utils";
import type { ConversationWithUserAndMessages } from "~~/shared/types/conversation";
import { getUnreadCount } from "~/utils/conversation";

// Define input prop for the group
interface EnquiryGroup {
  listing: any;
  conversations: ConversationWithUserAndMessages[];
}

const props = defineProps<{
  group: EnquiryGroup;
  user: User | null;
}>();

defineEmits<{
  (e: "click", listingId?: number): void;
}>();
</script>
