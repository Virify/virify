import { createSharedComposable } from "@vueuse/core";
import type { DraftListing } from "~~/layers/database/server/database/prisma/generated/client";
import { ListingTier } from "~~/layers/database/server/database/prisma/generated/enums";
import { redactDeep } from "~~/shared/utils/redactContactInfo";

/**
 * useCreateListingSteps - Shared composable for managing the 10-step listing creation flow
 *
 * ## Architecture
 * This composable manages the complete state for creating a listing, including:
 * - Step navigation and locking (linear progression, unlock next step on completion)
 * - Draft listing persistence (API interactions for create/update)
 * - Local step data cache (form state between steps)
 * - Modal states (for multi-step form UI)
 *
 * ## Draft Listing Flow
 * 1. User starts creating a listing → no draft exists yet (`draftListingId = null`)
 * 2. User completes Step 1 and clicks "Save" or "Next"
 * 3. `saveStep()` is called:
 *    a. If no draft exists → POST `/api/draft-listings/create/` with tier
 *    b. Draft created → `draftListingId` is set
 *    c. PATCH to step-specific endpoint (e.g. `/api/listings/update/steps/one/`)
 *    d. Step data saved locally and step marked complete
 * 4. Subsequent steps use the existing `draftListingId`
 *
 * ## API Endpoints Used
 * - POST `/api/draft-listings/create/` - Create new draft (returns DraftListing)
 * - PATCH `/api/listings/update/steps/one/` - Update step 1 data (works for both draft and live listings)
 * - PATCH `/api/listings/update/steps/two/` - Update step 2 data (etc.)
 * - GET `/api/draft-listings/[id]/` - Load existing draft for editing
 *
 * ## Usage
 * ```ts
 * const {
 *   draftListingId,
 *   saveStep,
 *   getStepData,
 *   currentStep
 * } = useCreateListingSteps()
 *
 * // Save step data (creates draft if needed, then updates step)
 * await saveStep(1, '/api/listings/update/steps/one/', stepData, advance)
 * ```
 */

export const useCreateListingSteps = createSharedComposable(() => {
  const currentStep = ref(1);
  const toast = useToast();

  // Selected tier for new draft (set before opening modal)
  const selectedTier = ref<ListingTier>("BASIC");

  // Static data - fetched once and cached globally
  // Property types for Step 2 (non-blocking, lazy fetch)
  const { data: propertyTypes, status: propertyTypesStatus } = useAsyncData(
    "create-listing-property-types",
    () => $fetch<PropertyTypeWithOptions[]>("/api/property-type/"),
    { lazy: true },
  );

  // Current draft listing being edited
  const draftListingId = ref<number | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const loadError = ref<string | null>(null);

  // Define all steps with initial state (all locked except step 1)
  // Note: Address is now part of Step 2 (Property Basics)
  const steps = ref<CreateListingStep[]>([
    {
      id: 1,
      title: "Listing Type",
      content: "Sale or rental details",
      slot: "step1",
      value: "1",
      completed: false,
      locked: false,
      icon: "i-lucide-home",
    },
    {
      id: 2,
      title: "Property Basics",
      content: "Address, type and description",
      slot: "step2",
      value: "2",
      completed: false,
      locked: true,
      icon: "i-lucide-info",
    },
    {
      id: 3,
      title: "Price",
      content: "Pricing details",
      slot: "step3",
      value: "3",
      completed: false,
      locked: true,
      icon: "i-lucide-pound-sterling",
    },
    {
      id: 4,
      title: "Bedrooms & Bathrooms",
      content: "Room details",
      slot: "step4",
      value: "4",
      completed: false,
      locked: true,
      icon: "i-lucide-bed",
    },
    {
      id: 5,
      title: "Living Spaces",
      content: "Kitchens, receptions & other rooms",
      slot: "step5",
      value: "5",
      completed: false,
      locked: true,
      icon: "i-lucide-sofa",
    },
    {
      id: 6,
      title: "Outdoor & Utilities",
      content: "Gardens and outdoor space",
      slot: "step6",
      value: "6",
      completed: false,
      locked: true,
      icon: "i-lucide-trees",
    },
    {
      id: 7,
      title: "Additional Features",
      content: "Parking, security & storage",
      slot: "step7",
      value: "7",
      completed: false,
      locked: true,
      icon: "i-lucide-sparkles",
    },
    {
      id: 8,
      title: "Energy & Costs",
      content: "EPC and running costs",
      slot: "step8",
      value: "8",
      completed: false,
      locked: true,
      icon: "i-lucide-zap",
    },
    {
      id: 9,
      title: "Description & Media",
      content: "Describe your property and upload photos",
      slot: "step9",
      value: "9",
      completed: false,
      locked: true,
      icon: "i-lucide-image",
    },
  ]);

  // Modal states - using a Map for cleaner access
  const modalStates = ref<Map<number, boolean>>(
    new Map(steps.value.map((step) => [step.id, false])),
  );

  // Form data for each step (current state)
  // Note: Now 9 steps after merging Address into Property Basics
  const stepData = ref<Record<number, any>>({
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
  });

  // Last saved data for each step (for dirty checking)
  // Note: Now 9 steps after merging Address into Property Basics
  const lastSavedStepData = ref<Record<number, any>>({
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
  });

  // Track which steps have been visited (for lazy mounting)
  const visitedSteps = ref(new Set<number>([1])); // Step 1 always visited initially
  const pendingEditsByStep = ref<Record<number, boolean>>({});

  function setStepPendingEdits(stepNumber: number, hasPendingEdits: boolean) {
    pendingEditsByStep.value[stepNumber] = hasPendingEdits;
  }

  function hasCurrentStepPendingEdits() {
    return Boolean(pendingEditsByStep.value[currentStep.value]);
  }

  function notifyPendingEditsBlocked() {
    toast.add({
      title: "Unsaved changes",
      description: "Please save your progress before leaving this step.",
      color: "warning",
      duration: 2500,
      icon: "i-lucide-triangle-alert",
    });
  }

  function getFriendlySaveErrorMessage(error: any): string {
    const raw = String(
      error?.data?.message ||
        error?.data?.statusMessage ||
        error?.statusMessage ||
        error?.message ||
        "",
    ).trim();

    if (!raw) {
      return "We couldn't save your changes. Please try again.";
    }

    // Common noisy transport format: [PATCH] "/api/...": 400 Bad Request
    const looksLikeTransportNoise =
      raw.includes("/api/") ||
      /^\[\w+\]/.test(raw) ||
      /^\d{3}\s+/i.test(raw) ||
      /Bad Request/i.test(raw);

    if (looksLikeTransportNoise) {
      return "Please check the highlighted fields and try again.";
    }

    return raw;
  }

  /**
   * Check if step data has changed since last save.
   * Compares current data with last saved snapshot.
   */
  const isStepDirty = (stepNumber: number, currentData: Record<string, any>): boolean => {
    const lastSaved = lastSavedStepData.value[stepNumber];
    if (!lastSaved || Object.keys(lastSaved).length === 0) {
      return false;
    }
    return JSON.stringify(currentData) !== JSON.stringify(lastSaved);
  };

  const primeStepSnapshot = (stepNumber: number, currentData: Record<string, any>) => {
    // Always sync the baseline to the mounted step's current submission shape.
    // This prevents false-dirty states when loaded draft data shape differs slightly
    // from the wrapper's getSubmissionData() shape.
    lastSavedStepData.value[stepNumber] = JSON.parse(JSON.stringify(currentData));
  };

  // Computed: Current accordion/stepper value
  const currentStepValue = computed({
    get: () => {
      return currentStep.value.toString(); // Convert to string for accordion/stepper
    },
    set: (value: string | undefined) => {
      if (value !== undefined) {
        const requestedStep = parseInt(value);
        if (requestedStep !== currentStep.value && hasCurrentStepPendingEdits()) {
          notifyPendingEditsBlocked();
          return;
        }
        currentStep.value = requestedStep; // Convert back to number
      }
    },
  });

  // Computed: Modal states as boolean array for child components
  const modalStatesArray = computed(() =>
    steps.value.map((step) => modalStates.value.get(step.id) ?? false),
  );

  // Computed: Check if we have an active draft
  const hasActiveDraft = computed(() => draftListingId.value !== null);

  // Computed: Get the first incomplete step
  const firstIncompleteStep = computed(() => {
    const incomplete = steps.value.find((s) => !s.completed && !s.locked);
    return incomplete?.id ?? 1;
  });

  // Computed: Check if all steps are completed
  const allStepsCompleted = computed(() => {
    return steps.value.every((s) => s.completed);
  });

  // Load draft listing data from API
  const loadDraftListing = async (id: number) => {
    isLoading.value = true;
    loadError.value = null;

    try {
      // GET /api/draft-listings/:id returns the draft directly (not wrapped)
      const draft = await useRequestFetch()<DraftListingWithFullPayload>(
        `/api/draft-listings/${id}/`,
        { method: "GET" },
      );

      if (draft?.id) {
        draftListingId.value = draft.id;

        // Set the tier from the draft
        if (draft.listingTier) {
          selectedTier.value = draft.listingTier as ListingTier;
        }

        // Use stored completedSteps from database
        const completedSteps = draft.completedSteps || [];

        steps.value.forEach((step) => {
          step.completed = completedSteps.includes(step.id);
          // Unlock step if previous step is completed OR it's step 1
          step.locked = step.id === 1 ? false : !completedSteps.includes(step.id - 1);
        });

        // Populate step data from the draft
        populateStepDataFromDraft(draft);

        // Snapshot loaded data so dirty-checking doesn't treat it as unsaved
        Object.keys(stepData.value).forEach((key) => {
          const step = Number(key);
          lastSavedStepData.value[step] = JSON.parse(
            JSON.stringify(stepData.value[step]),
          );
        });

        // Set current step: if all complete, go to last step (9); otherwise first incomplete
        currentStep.value = allStepsCompleted.value ? 9 : firstIncompleteStep.value;
      }
    } catch (error: any) {
      console.error("Failed to load draft listing:", error);
      loadError.value = error?.data?.message || "Failed to load draft listing";
    } finally {
      isLoading.value = false;
    }
  };

  // Track if we're editing a live listing (vs a draft)
  const editingListingId = ref<number | null>(null);

  // Load a published listing for editing
  const loadListing = async (id: number) => {
    isLoading.value = true;
    loadError.value = null;

    try {
      // GET /api/listing/:id returns { listing: FullListing }
      const response = await useRequestFetch()<{ listing: any }>(`/api/listing/${id}/`, {
        method: "GET",
      });

      if (response?.listing) {
        const listing = response.listing;
        editingListingId.value = listing.id;
        // For live listings, we don't have a draftListingId - we're editing directly
        draftListingId.value = null;

        // Set the tier from the live listing
        if (listing.listingTier) {
          selectedTier.value = listing.listingTier as ListingTier;
        }

        // All steps are complete for a published listing
        steps.value.forEach((step) => {
          step.completed = true;
          step.locked = false;
        });

        // Populate step data from the listing (same structure as draft)
        populateStepDataFromDraft(listing);

        // Go to last step for editing published listings (all steps complete)
        currentStep.value = 9;
      }
    } catch (error: any) {
      console.error("Failed to load listing:", error);
      loadError.value = error?.data?.message || "Failed to load listing";
    } finally {
      isLoading.value = false;
    }
  };

  // Populate local step data from draft listing response
  const populateStepDataFromDraft = (listing: EditableListing) => {
    const loadedSteps = populateAllSteps(listing);
    Object.entries(loadedSteps).forEach(([stepNum, data]) => {
      stepData.value[Number(stepNum)] = data;
    });
  };

  /**
   * Ensure a draft listing exists, creating one if needed.
   * Uses the `selectedTier` value set when opening the modal.
   * @returns The draft listing ID (existing or newly created)
   */
  const ensureDraftExists = async (): Promise<number | null> => {
    if (draftListingId.value) {
      return draftListingId.value;
    }

    try {
      const response = await useRequestFetch()<DraftListing>(
        "/api/draft-listings/create/",
        {
          method: "POST",
          body: { tier: selectedTier.value },
        },
      );

      if (response?.id) {
        draftListingId.value = response.id;
        return response.id;
      }
      return null;
    } catch (error: any) {
      console.error("Failed to create draft listing:", error);
      loadError.value = error?.data?.message || "Failed to create draft listing";
      return null;
    }
  };

  /**
   * Save step data to the API and optionally advance to next step
   * This is the main method for persisting step data.
   *
   * Flow:
   * 1. Ensure draft exists (creates one if not, with specified tier)
   * 2. PATCH step data to the step-specific endpoint
   * 3. Save data locally
   * 4. If advancing, mark step complete and unlock next
   *
   * @param stepNumber - The step being saved (1-10)
   * @param apiEndpoint - The PATCH endpoint for this step (draft endpoint - will be converted to listing endpoint if editing live)
   * @param stepData - The form data to save
   * @param advance - Whether to mark complete and move to next step
   * @returns Success boolean or { success: true, draftComplete: true } for step 9 completion
   */
  const saveStep = async (
    stepNumber: number,
    apiEndpoint: string,
    stepFormData: Record<string, any>,
    advance: boolean = false,
    dirtySnapshot: Record<string, any> = stepFormData,
  ): Promise<boolean | { success: boolean; draftComplete: boolean }> => {
    if (isSaving.value) return false;

    // Check if data actually changed
    const isDirty = isStepDirty(stepNumber, stepFormData);

    // If not dirty and step already complete, just navigate (no POST needed)
    const step = steps.value.find((s) => s.id === stepNumber);
    if (!isDirty && step?.completed) {
      if (advance) {
        // Step 9 is the final step - signal completion
        if (stepNumber === 9) {
          const isLiveListing = editingListingId.value !== null;
          toast.add({
            title: isLiveListing ? "Listing Updated" : "Draft Complete!",
            icon: "i-lucide-check-circle-2",
            description:
              isLiveListing ?
                "Your changes have been saved"
              : "Your draft listing is ready to publish",
            color: "success",
            duration: 3000,
          });
          return { success: true, draftComplete: true };
        }
        goToStep(stepNumber + 1);
        toast.add({
          title: "Moving to next step",
          icon: "i-lucide-arrow-right",
          color: "info",
          duration: 2000,
        });
      } else {
        const stepTitle =
          steps.value.find((s) => s.id === stepNumber)?.title || `Step ${stepNumber}`;
        toast.add({
          title: `${stepTitle} saved`,
          icon: "i-lucide-check-circle-2",
          description: "Your progress has been saved",
          color: "success",
          duration: 2000,
        });
      }
      return true;
    }

    isSaving.value = true;

    try {
      // Determine if we're editing a live listing or a draft
      const isEditingLiveListing = editingListingId.value !== null;

      let submissionData: Record<string, any>;

      if (isEditingLiveListing) {
        // Live listing - pass listingId (same endpoint handles both)
        submissionData = {
          ...stepFormData,
          listingId: editingListingId.value,
        };
      } else {
        // Draft flow - ensure draft exists first
        const currentDraftId = await ensureDraftExists();
        if (!currentDraftId) {
          throw new Error("Failed to create draft listing");
        }
        submissionData = {
          ...stepFormData,
          draftId: currentDraftId,
        };
      }

      // Redact any phone numbers / email addresses from free-text fields before persisting
      submissionData = redactDeep(submissionData);

      // PATCH to update the step (same endpoint handles both draft and live)
      const response = await useRequestFetch()<DraftListing>(apiEndpoint, {
        method: "PATCH",
        body: submissionData,
      });

      if (!response?.id) {
        throw new Error("Failed to save step data");
      }

      // Step 3: Save to local state and snapshot for dirty checking
      saveStepData(stepNumber, stepFormData);
      lastSavedStepData.value[stepNumber] = JSON.parse(JSON.stringify(dirtySnapshot));
      setStepPendingEdits(stepNumber, false);

      // Step 4: Mark step complete and unlock next (regardless of advance flag)
      // This allows users to navigate to next step after saving progress
      markStepComplete(stepNumber);

      // Get step title for toast
      const stepTitle =
        steps.value.find((s) => s.id === stepNumber)?.title || `Step ${stepNumber}`;

      // Step 5: Handle advancement (navigate to next step or complete draft)
      if (advance) {
        // Step 9 is the final step - show completion message
        if (stepNumber === 9) {
          toast.add({
            title: isEditingLiveListing ? "Listing Updated" : "Draft Complete!",
            icon: "i-lucide-check-circle-2",
            description:
              isEditingLiveListing ?
                "Your changes have been saved"
              : "Your draft listing is ready to publish",
            color: "success",
            duration: 3000,
          });
          // Signal that the draft is complete (caller should close modal)
          return { success: true, draftComplete: true };
        } else {
          goToStep(stepNumber + 1);
          toast.add({
            title: `${stepTitle} completed`,
            icon: "i-lucide-check-circle-2",
            description: "Moving to next step",
            color: "success",
            duration: 2000,
          });
        }
      } else {
        toast.add({
          title: `${stepTitle} saved`,
          icon: "i-lucide-check-circle-2",
          description: "Your progress has been saved",
          color: "success",
          duration: 2000,
        });
      }

      return true;
    } catch (error: any) {
      console.error(`Failed to save step ${stepNumber}:`, error);
      toast.add({
        title: "Error",
        description: getFriendlySaveErrorMessage(error),
        color: "error",
        duration: 3000,
        icon: "i-lucide-circle-x",
      });
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  /**
   * Save room data and optionally show a success toast.
   * Used when saving individual rooms in Step 4/5 slideovers
   */
  const saveRoomData = async (
    stepNumber: number,
    apiEndpoint: string,
    stepFormData: Record<string, any>,
    successMessage?: string,
    dirtySnapshot: Record<string, any> = stepFormData,
  ): Promise<boolean> => {
    if (isSaving.value) return false;

    isSaving.value = true;

    try {
      // Determine if we're editing a live listing or a draft
      const isEditingLiveListing = editingListingId.value !== null;

      let submissionData: Record<string, any>;

      if (isEditingLiveListing) {
        // Live listing - pass listingId (same endpoint handles both)
        submissionData = {
          ...stepFormData,
          listingId: editingListingId.value,
        };
      } else {
        const currentDraftId = await ensureDraftExists();
        if (!currentDraftId) {
          throw new Error("Failed to create draft listing");
        }
        submissionData = {
          ...stepFormData,
          draftId: currentDraftId,
        };
      }

      // Redact any phone numbers / email addresses from free-text fields before persisting
      submissionData = redactDeep(submissionData);

      // Same endpoint handles both draft and live
      const response = await useRequestFetch()<DraftListing>(apiEndpoint, {
        method: "PATCH",
        body: submissionData,
      });

      if (!response?.id) {
        throw new Error("Failed to save room data");
      }

      // Save to local state
      saveStepData(stepNumber, stepFormData);
      lastSavedStepData.value[stepNumber] = JSON.parse(JSON.stringify(dirtySnapshot));
      setStepPendingEdits(stepNumber, false);

      if (successMessage) {
        toast.add({
          title: successMessage,
          icon: "i-lucide-check-circle-2",
          color: "success",
          duration: 2000,
        });
      }

      return true;
    } catch (error: any) {
      console.error(`Failed to save room data:`, error);
      // Still show error toast for failures
      toast.add({
        title: "Error",
        description: getFriendlySaveErrorMessage(error),
        color: "error",
        duration: 3000,
        icon: "i-lucide-circle-x",
      });
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  // Create a new draft listing (legacy method - prefer ensureDraftExists or saveStep)
  const createDraftListing = async () => {
    isLoading.value = true;
    loadError.value = null;

    try {
      const response = await useRequestFetch()<DraftListing>(
        "/api/draft-listings/create/",
        {
          method: "POST",
          body: { tier: selectedTier.value },
        },
      );

      if (response?.id) {
        draftListingId.value = response.id;
        return response.id;
      }
      return null;
    } catch (error: any) {
      console.error("Failed to create draft listing:", error);
      loadError.value = error?.data?.message || "Failed to create draft listing";
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Open a specific step's modal
  const openStepModal = (stepId: number) => {
    if (canNavigateToStep(stepId)) {
      modalStates.value.set(stepId, true);
    }
  };

  // Close a specific step's modal
  const closeStepModal = (stepId: number) => {
    modalStates.value.set(stepId, false);
  };

  // Update modal state
  const updateModalState = (stepId: number, open: boolean) => {
    modalStates.value.set(stepId, open);
  };

  // Check if user can navigate to a specific step
  const canNavigateToStep = (stepId: number): boolean => {
    const step = steps.value.find((s) => s.id === stepId);
    if (!step) return false;
    if (stepId !== currentStep.value && hasCurrentStepPendingEdits()) return false;
    return !step.locked;
  };

  /**
   * Mark a step as completed and unlock the next step.
   * Does NOT navigate - just updates completion state.
   */
  const markStepComplete = (stepId: number) => {
    const step = steps.value.find((s) => s.id === stepId);
    if (step) {
      step.completed = true;

      // Unlock the next step
      if (stepId < steps.value.length) {
        const nextStepObj = steps.value.find((s) => s.id === stepId + 1);
        if (nextStepObj) {
          nextStepObj.locked = false;
        }
      }
    }
  };

  /**
   * Navigate to a specific step (if allowed).
   */
  const goToStep = (stepId: number) => {
    if (stepId !== currentStep.value && hasCurrentStepPendingEdits()) {
      notifyPendingEditsBlocked();
      return;
    }

    if (stepId >= 1 && stepId <= steps.value.length) {
      const step = steps.value.find((s) => s.id === stepId);
      if (step && !step.locked) {
        currentStep.value = stepId;
        visitedSteps.value.add(stepId);
      }
    }
  };

  // Mark a step as completed and unlock next step (legacy - combines mark + navigate)
  const completeStep = async (stepId: number) => {
    markStepComplete(stepId);
    goToStep(stepId + 1);
  };

  // Save step data
  const saveStepData = (stepId: number, data: any) => {
    stepData.value[stepId] = data;
  };

  // Get step data
  const getStepData = (stepId: number) => {
    return stepData.value[stepId] || {};
  };

  // Validate a specific step
  const validateStep = (stepId: number): boolean => {
    // Add validation logic here based on step
    // For now, return true
    return true;
  };

  // Go to next step
  const nextStep = () => {
    if (currentStep.value < steps.value.length) {
      const canProceed = validateStep(currentStep.value);
      if (canProceed) {
        completeStep(currentStep.value);
      }
    }
  };

  // Go to previous step
  const previousStep = () => {
    if (hasCurrentStepPendingEdits()) {
      notifyPendingEditsBlocked();
      return;
    }

    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  // Reset all steps (for starting fresh)
  const resetSteps = () => {
    currentStep.value = 1;
    draftListingId.value = null;
    editingListingId.value = null;
    selectedTier.value = "BASIC";
    loadError.value = null;
    steps.value.forEach((step) => {
      step.completed = false;
      // Only step 1 is unlocked by default
      step.locked = step.id !== 1;
    });
    modalStates.value.forEach((_, key) => {
      modalStates.value.set(key, false);
    });
    stepData.value = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {},
    };
    lastSavedStepData.value = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {},
    };
    visitedSteps.value = new Set<number>([1]);
    pendingEditsByStep.value = {};
  };

  // Initialize with an existing draft or create new
  const initializeDraft = async (existingDraftId?: number) => {
    if (existingDraftId) {
      await loadDraftListing(existingDraftId);
    } else {
      resetSteps();
    }
  };

  // Set the draft listing ID (used when step 1 creates a new draft)
  const setDraftListingId = (id: number) => {
    draftListingId.value = id;
  };

  /**
   * Start creating a new listing with the specified tier.
   * Call this when user clicks a "Create Listing" button.
   * @param tier - The listing tier (BASIC, PREMIUM, FEATURED)
   */
  const startNewListing = (tier: ListingTier) => {
    resetSteps();
    selectedTier.value = tier;
  };

  return {
    // State
    currentStep: readonly(currentStep),
    steps,
    currentStepValue,
    modalStatesArray,
    draftListingId: readonly(draftListingId),
    editingListingId: readonly(editingListingId),
    selectedTier: readonly(selectedTier),
    isLoading: readonly(isLoading),
    isSaving: readonly(isSaving),
    loadError: readonly(loadError),
    hasActiveDraft,
    firstIncompleteStep,
    visitedSteps,
    pendingEditsByStep,

    // Static data (cached)
    propertyTypes,
    propertyTypesStatus,

    // Methods - Draft Management
    initializeDraft,
    loadDraftListing,
    loadListing,
    createDraftListing,
    setDraftListingId,
    ensureDraftExists,
    saveStep,
    saveRoomData,
    startNewListing,

    // Methods - Step Navigation
    openStepModal,
    closeStepModal,
    updateModalState,
    canNavigateToStep,
    markStepComplete,
    goToStep,
    completeStep,
    saveStepData,
    getStepData,
    isStepDirty,
    primeStepSnapshot,
    validateStep,
    nextStep,
    previousStep,
    setStepPendingEdits,
    resetSteps,
  };
});
