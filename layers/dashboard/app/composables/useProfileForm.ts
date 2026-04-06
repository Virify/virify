import { z } from "zod";
import { UserIntent } from "~~/layers/database/server/database/prisma/generated/enums";
import { profileSchema } from "~~/shared/utils/profile-schema";
import type { FormError, FormSubmitEvent } from "#ui/types";

// Helper for intents
export const profileIntents = [
  { value: UserIntent.BUYING, label: "Buying" },
  { value: UserIntent.SELLING, label: "Selling" },
  { value: UserIntent.RENTING, label: "Renting" },
  { value: UserIntent.LANDLORD, label: "Landlord" },
];

export async function useProfileForm(formRef: Ref<{ setErrors: (errors: FormError[]) => void } | null>) {
  const toast = useToast();
  const { checkText, isChecking: isModerating } = useModeration();

  // Use useRequestFetch to forward headers if SSR
  const { data: fullUser, pending } = await useAsyncData("fullUser", () => useRequestFetch()<UserWithAddress>(`/api/user/profile`));

  type Schema = z.output<typeof profileSchema>;

  const state = reactive<Schema>({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      address: {
        number: null,
        flat: null,
        name: null,
        street: "",
        city: "",
        locality: null,
        county: null,
        district: null,
        country: null,
        postcode: "",
        fullAddress: null,
        lat: null,
        lon: null,
      },
      avatar: "",
      bio: "",
      intents: [],
      interests: ["property"],
      phoneNumber: "",
  });

  // Sync state with fetched user
  watch(fullUser, (user) => {
      if (user) {
          state.firstName = user.firstName || "";
          state.lastName = user.lastName || "";
          state.username = user.username || "";
          state.email = user.email || "";
          // Ensure address structure is preserved or defaulted
          state.address = user.address || {
            number: null,
            flat: null,
            name: null,
            street: "",
            city: "",
            locality: null,
            county: null,
            district: null,
            country: null,
            postcode: "",
            fullAddress: null,
            lat: null,
            lon: null,
          };
          state.avatar = user.avatar || "";
          state.bio = user.bio || "";
          state.intents = user.intents || [];
          state.interests = user.interests?.length ? user.interests : ["property"];
          state.phoneNumber = user.phoneNumber || "";
      }
  }, { immediate: true });

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    // Clear any previous moderation errors
    formRef.value?.setErrors([])

    // Check text fields for inappropriate content before posting
    const fieldsToCheck = [
      { name: 'firstName', value: event.data.firstName },
      { name: 'lastName', value: event.data.lastName },
      { name: 'username', value: event.data.username },
    ].filter((f): f is { name: string; value: string } => !!f.value?.trim());

    const results = await Promise.all(
      fieldsToCheck.map(async (f) => ({ name: f.name, ...(await checkText(f.value)) }))
    );

    const failed = results.filter((r) => !r.safe);
    if (failed.length > 0) {
      formRef.value?.setErrors(failed.map((r) => ({
        name: r.name,
        message: 'This field contains inappropriate language. Please revise.',
      })));
      return;
    }

    try {
      const response = await $fetch<Schema>("/api/user/profile", {
        method: "PATCH",
        body: event.data,
      });

      if (response) {
        toast.add({ title: "Success", description: "Profile updated successfully", color: "success", icon: 'i-lucide-user-check' });
      }
    } catch (error: any) {
      toast.add({ title: "Error", description: error?.message || "An error occurred while updating profile", color: "error", icon: 'i-lucide-user-x' });
    }
  }

  return {
      state,
      pending,
      onSubmit,
      profileSchema,
      isModerating,
  };
}
