/**
 * Manage reusable price-paid fetch state for listing and postcode searches.
 */
export function usePricePaidData() {
  const pricePaidData = ref<PricePaidResponse | null>(null);
  const ppdGroups = ref<PricePaidGroup[] | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch sale history and market context for a single listing address.
   */
  const fetchListingPricePaidData = async (input: {
    listingId: number;
    address: PricePaidListingAddress;
  }) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<PricePaidResponse>(`/api/price-paid/${input.listingId}`, {
        method: "POST",
        body: input,
      });

      pricePaidData.value = response;
      return response;
    } catch (err) {
      error.value = "Price paid data isn't available right now. Please try again later.";
      pricePaidData.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch grouped PPD sale rows for a postcode and optional street.
   */
  const fetchPricePaidGroups = async (input: {
    postcode: string;
    street?: string | null;
  }) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ data: PricePaidGroup[] }>("/api/price-paid/", {
        method: "POST",
        body: {
          postcode: input.postcode,
          street: input.street ?? undefined,
        },
      });

      ppdGroups.value = response.data ?? null;
      return response.data ?? [];
    } catch (err) {
      error.value = "Price paid data isn't available right now. Please try again later.";
      ppdGroups.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Clear fetched price-paid state and errors.
   */
  const reset = () => {
    pricePaidData.value = null;
    ppdGroups.value = null;
    error.value = null;
  };

  return {
    pricePaidData,
    ppdGroups,
    loading,
    error,
    fetchListingPricePaidData,
    fetchPricePaidGroups,
    reset,
  };
}
