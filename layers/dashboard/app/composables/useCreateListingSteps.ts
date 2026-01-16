import { createSharedComposable } from "@vueuse/core"
import type { DraftListing } from '~~/layers/database/server/database/prisma/generated/client'
import { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums'

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
 *    c. PATCH to step-specific endpoint (e.g. `/api/draft-listings/update/steps/one/`)
 *    d. Step data saved locally and step marked complete
 * 4. Subsequent steps use the existing `draftListingId`
 * 
 * ## API Endpoints Used
 * - POST `/api/draft-listings/create/` - Create new draft (returns DraftListing)
 * - PATCH `/api/draft-listings/update/steps/one/` - Update step 1 data
 * - PATCH `/api/draft-listings/update/steps/two/` - Update step 2 data (etc.)
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
 * await saveStep(1, '/api/draft-listings/update/steps/one/', stepData, advance)
 * ```
 */

// Types for step data mapping
interface DraftListingData {
  id: number
  completedSteps: number[]
  // Step 1 data
  rentalListing?: {
    furnishedStatus: string
    isBillsIncluded: boolean
  } | null
  saleListing?: {
    tenureType: string
    chain: boolean
    sharedOwnership: boolean
  } | null
  // Step 2 data (property basics)
  property?: {
    description?: string
    type?: { id: number; name: string }
    classification?: { id: number; name: string }
  } | null
  // Step 3 data
  price?: number | null
  // Step 4 data
  address?: {
    line1?: string
    line2?: string
    city?: string
    postcode?: string
  } | null
  // Additional step data will be added as we build them
}

export const useCreateListingSteps = createSharedComposable(() => {
  const currentStep = ref(1)
  const toast = useToast()
  
  // Selected tier for new draft (set before opening modal)
  const selectedTier = ref<ListingTier>('BASIC')
  
  // Static data - fetched once and cached globally
  // Property types for Step 2 (non-blocking, lazy fetch)
  const { data: propertyTypes, status: propertyTypesStatus } = useAsyncData(
    'create-listing-property-types',
    () => $fetch<PropertyTypeWithOptions[]>('/api/property-type/'),
    { lazy: true }
  )
  
  // Current draft listing being edited
  const draftListingId = ref<number | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const loadError = ref<string | null>(null)
  
  // Define all steps with initial state (all locked except step 1)
  const steps = ref<CreateListingStep[]>([
    { id: 1, title: "Listing Type", content: "This is step 1", slot: "step1", value: '1', completed: false, locked: false },
    { id: 2, title: "Property Basics", content: "Type and description", slot: "step2", value: '2', completed: false, locked: true },
    { id: 3, title: "Price", content: "Pricing details", slot: "step3", value: '3', completed: false, locked: true },
    { id: 4, title: "Address", content: "Property location", slot: "step4", value: '4', completed: false, locked: true },
    { id: 5, title: "Bedrooms & Bathrooms", content: "Room details", slot: "step5", value: '5', completed: false, locked: true },
    { id: 6, title: "Living Spaces", content: "Kitchens, receptions & other rooms", slot: "step6", value: '6', completed: false, locked: true },
    { id: 7, title: "Outdoor & Utilities", content: "Gardens and outdoor space", slot: "step7", value: '7', completed: false, locked: true },
    { id: 8, title: "Additional Features", content: "Parking, security & storage", slot: "step8", value: '8', completed: false, locked: true },
    { id: 9, title: "Energy & Costs", content: "EPC and running costs", slot: "step9", value: '9', completed: false, locked: true },
    { id: 10, title: "Property Images", content: "Upload photos", slot: "step10", value: '10', completed: false, locked: true },
  ])

  // Modal states - using a Map for cleaner access
  const modalStates = ref<Map<number, boolean>>(new Map(
    steps.value.map(step => [step.id, false])
  ))

  // Form data for each step (current state)
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
    10: {},
  })

  // Last saved data for each step (for dirty checking)
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
    10: {},
  })

  // Track which steps have been visited (for lazy mounting)
  const visitedSteps = ref(new Set<number>([1])) // Step 1 always visited initially

  /**
   * Check if step data has changed since last save.
   * Compares current data with last saved snapshot.
   */
  const isStepDirty = (stepNumber: number, currentData: Record<string, any>): boolean => {
    const lastSaved = lastSavedStepData.value[stepNumber]
    if (!lastSaved || Object.keys(lastSaved).length === 0) {
      // Never saved before - always dirty
      return true
    }
    return JSON.stringify(currentData) !== JSON.stringify(lastSaved)
  }

  // Computed: Current accordion/stepper value
  const currentStepValue = computed({
    get: () => {
      return currentStep.value.toString() // Convert to string for accordion/stepper
    },
    set: (value: string | undefined) => {
      if (value !== undefined) {
        currentStep.value = parseInt(value) // Convert back to number
      }
    }
  })

  // Computed: Modal states as boolean array for child components
  const modalStatesArray = computed(() => 
    steps.value.map(step => modalStates.value.get(step.id) ?? false)
  )

  // Computed: Check if we have an active draft
  const hasActiveDraft = computed(() => draftListingId.value !== null)

  // Computed: Get the first incomplete step
  const firstIncompleteStep = computed(() => {
    const incomplete = steps.value.find(s => !s.completed && !s.locked)
    return incomplete?.id ?? 1
  })

  // Load draft listing data from API
  const loadDraftListing = async (id: number) => {
    isLoading.value = true
    loadError.value = null
    
    try {
      const response = await useRequestFetch()<{ success: boolean; data: DraftListingData }>(
        `/api/listing/draft/${id}`,
        { method: 'GET' }
      )
      
      if (response.success && response.data) {
        draftListingId.value = response.data.id
        
        // Update step completion status from database
        const completedSteps = response.data.completedSteps || []
        steps.value.forEach(step => {
          step.completed = completedSteps.includes(step.id)
          // Unlock step if previous step is completed OR it's step 1
          step.locked = step.id === 1 ? false : !completedSteps.includes(step.id - 1)
        })
        
        // Populate step data from the draft
        populateStepDataFromDraft(response.data)
        
        // Set current step to first incomplete
        currentStep.value = firstIncompleteStep.value
      }
    } catch (error: any) {
      console.error('Failed to load draft listing:', error)
      loadError.value = error?.data?.message || 'Failed to load draft listing'
    } finally {
      isLoading.value = false
    }
  }

  // Populate local step data from draft listing response
  const populateStepDataFromDraft = (draft: DraftListingData) => {
    // Step 1: Listing Type
    if (draft.saleListing) {
      stepData.value[1] = {
        selectedType: 'sale',
        saleListing: draft.saleListing,
        rentalListing: null
      }
    } else if (draft.rentalListing) {
      stepData.value[1] = {
        selectedType: 'rent',
        saleListing: null,
        rentalListing: draft.rentalListing
      }
    }
    
    // Step 2: Property Basics
    if (draft.property) {
      stepData.value[2] = {
        description: draft.property.description,
        propertyTypeId: draft.property.type?.id,
        propertyClassificationId: draft.property.classification?.id
      }
    }
    
    // Step 3: Price
    if (draft.price !== null && draft.price !== undefined) {
      stepData.value[3] = {
        price: draft.price
      }
    }
    
    // Step 4: Address
    if (draft.address) {
      stepData.value[4] = { ...draft.address }
    }
    
    // Additional steps can be populated as we build them
  }

  /**
   * Ensure a draft listing exists, creating one if needed.
   * Uses the `selectedTier` value set when opening the modal.
   * @returns The draft listing ID (existing or newly created)
   */
  const ensureDraftExists = async (): Promise<number | null> => {
    if (draftListingId.value) {
      return draftListingId.value
    }
    
    try {
      const response = await useRequestFetch()<DraftListing>('/api/draft-listings/create/', {
        method: 'POST',
        body: { tier: selectedTier.value }
      })
      
      if (response?.id) {
        draftListingId.value = response.id
        return response.id
      }
      return null
    } catch (error: any) {
      console.error('Failed to create draft listing:', error)
      loadError.value = error?.data?.message || 'Failed to create draft listing'
      return null
    }
  }

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
   * @param apiEndpoint - The PATCH endpoint for this step
   * @param stepData - The form data to save
   * @param advance - Whether to mark complete and move to next step
   * @returns Success boolean
   */
  const saveStep = async (
    stepNumber: number, 
    apiEndpoint: string, 
    stepFormData: Record<string, any>,
    advance: boolean = false
  ): Promise<boolean> => {
    if (isSaving.value) return false
    
    // Check if data actually changed
    const isDirty = isStepDirty(stepNumber, stepFormData)
    
    // If not dirty and step already complete, just navigate (no POST needed)
    const step = steps.value.find(s => s.id === stepNumber)
    if (!isDirty && step?.completed) {
      if (advance) {
        goToStep(stepNumber + 1)
        toast.add({
          title: 'Moving to next step',
          icon: 'i-lucide-arrow-right',
          color: 'info'
        })
      }
      return true
    }
    
    isSaving.value = true
    
    try {
      // Step 1: Ensure draft exists (creates with selectedTier if new)
      const currentDraftId = await ensureDraftExists()
      if (!currentDraftId) {
        throw new Error('Failed to create draft listing')
      }
      
      // Step 2: PATCH to update the step
      const submissionData = {
        ...stepFormData,
        draftId: currentDraftId
      }
      
      const response = await useRequestFetch()<DraftListing>(apiEndpoint, {
        method: 'PATCH',
        body: submissionData
      })
      
      if (!response?.id) {
        throw new Error('Failed to save step data')
      }
      
      // Step 3: Save to local state and snapshot for dirty checking
      saveStepData(stepNumber, stepFormData)
      lastSavedStepData.value[stepNumber] = JSON.parse(JSON.stringify(stepFormData))
      
      // Step 4: Mark step complete and unlock next (regardless of advance flag)
      // This allows users to navigate to next step after saving progress
      markStepComplete(stepNumber)
      
      // Get step title for toast
      const stepTitle = steps.value.find(s => s.id === stepNumber)?.title || `Step ${stepNumber}`
      
      // Step 5: Handle advancement (navigate to next step)
      if (advance) {
        goToStep(stepNumber + 1)
        toast.add({
          title: `${stepTitle} completed`,
          icon: 'i-lucide-check-circle-2',
          description: 'Moving to next step',
          color: 'success'
        })
      } else {
        toast.add({
          title: `${stepTitle} saved`,
          icon: 'i-lucide-check-circle-2',
          description: 'Your progress has been saved',
          color: 'success'
        })
      }
      
      return true
    } catch (error: any) {
      console.error(`Failed to save step ${stepNumber}:`, error)
      toast.add({
        title: 'Error',
        description: error?.data?.message || error?.message || 'Failed to save progress',
        color: 'error'
      })
      return false
    } finally {
      isSaving.value = false
    }
  }

  // Create a new draft listing (legacy method - prefer ensureDraftExists or saveStep)
  const createDraftListing = async () => {
    isLoading.value = true
    loadError.value = null
    
    try {
      const response = await useRequestFetch()<DraftListing>(
        '/api/draft-listings/create/',
        { 
          method: 'POST',
          body: { tier: selectedTier.value }
        }
      )
      
      if (response?.id) {
        draftListingId.value = response.id
        return response.id
      }
      return null
    } catch (error: any) {
      console.error('Failed to create draft listing:', error)
      loadError.value = error?.data?.message || 'Failed to create draft listing'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Open a specific step's modal
  const openStepModal = (stepId: number) => {
    if (canNavigateToStep(stepId)) {
      modalStates.value.set(stepId, true)
    }
  }

  // Close a specific step's modal
  const closeStepModal = (stepId: number) => {
    modalStates.value.set(stepId, false)
  }

  // Update modal state
  const updateModalState = (stepId: number, open: boolean) => {
    modalStates.value.set(stepId, open)
  }

  // Check if user can navigate to a specific step
  const canNavigateToStep = (stepId: number): boolean => {
    const step = steps.value.find(s => s.id === stepId)
    if (!step) return false
    return !step.locked
  }

  /**
   * Mark a step as completed and unlock the next step.
   * Does NOT navigate - just updates completion state.
   */
  const markStepComplete = (stepId: number) => {
    const step = steps.value.find(s => s.id === stepId)
    if (step) {
      step.completed = true
      
      // Unlock the next step
      if (stepId < steps.value.length) {
        const nextStepObj = steps.value.find(s => s.id === stepId + 1)
        if (nextStepObj) {
          nextStepObj.locked = false
        }
      }
    }
  }

  /**
   * Navigate to a specific step (if allowed).
   */
  const goToStep = (stepId: number) => {
    if (stepId >= 1 && stepId <= steps.value.length) {
      const step = steps.value.find(s => s.id === stepId)
      if (step && !step.locked) {
        currentStep.value = stepId
        visitedSteps.value.add(stepId)
      }
    }
  }

  // Mark a step as completed and unlock next step (legacy - combines mark + navigate)
  const completeStep = async (stepId: number) => {
    markStepComplete(stepId)
    goToStep(stepId + 1)
  }

  // Save step data
  const saveStepData = (stepId: number, data: any) => {
    stepData.value[stepId] = data
  }

  // Get step data
  const getStepData = (stepId: number) => {
    return stepData.value[stepId] || {}
  }

  // Validate a specific step
  const validateStep = (stepId: number): boolean => {
    // Add validation logic here based on step
    // For now, return true
    return true
  }

  // Go to next step
  const nextStep = () => {
    if (currentStep.value < steps.value.length) {
      const canProceed = validateStep(currentStep.value)
      if (canProceed) {
        completeStep(currentStep.value)
      }
    }
  }

  // Go to previous step
  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  // Reset all steps (for starting fresh)
  const resetSteps = () => {
    currentStep.value = 1
    draftListingId.value = null
    loadError.value = null
    steps.value.forEach(step => {
      step.completed = false
      // Only step 1 is unlocked by default
      step.locked = step.id !== 1
    })
    modalStates.value.forEach((_, key) => {
      modalStates.value.set(key, false)
    })
    stepData.value = {
      1: {}, 2: {}, 3: {}, 4: {}, 5: {},
      6: {}, 7: {}, 8: {}, 9: {}, 10: {},
    }
    lastSavedStepData.value = {
      1: {}, 2: {}, 3: {}, 4: {}, 5: {},
      6: {}, 7: {}, 8: {}, 9: {}, 10: {},
    }
    visitedSteps.value = new Set<number>([1])
  }

  // Initialize with an existing draft or create new
  const initializeDraft = async (existingDraftId?: number) => {
    if (existingDraftId) {
      await loadDraftListing(existingDraftId)
    } else {
      resetSteps()
    }
  }

  // Set the draft listing ID (used when step 1 creates a new draft)
  const setDraftListingId = (id: number) => {
    draftListingId.value = id
  }

  /**
   * Start creating a new listing with the specified tier.
   * Call this when user clicks a "Create Listing" button.
   * @param tier - The listing tier (BASIC, PREMIUM, FEATURED)
   */
  const startNewListing = (tier: ListingTier) => {
    resetSteps()
    selectedTier.value = tier
  }

  return {
    // State
    currentStep: readonly(currentStep),
    steps,
    currentStepValue,
    modalStatesArray,
    draftListingId: readonly(draftListingId),
    selectedTier: readonly(selectedTier),
    isLoading: readonly(isLoading),
    isSaving: readonly(isSaving),
    loadError: readonly(loadError),
    hasActiveDraft,
    firstIncompleteStep,
    visitedSteps,
    
    // Static data (cached)
    propertyTypes,
    propertyTypesStatus,
    
    // Methods - Draft Management
    initializeDraft,
    loadDraftListing,
    createDraftListing,
    setDraftListingId,
    ensureDraftExists,
    saveStep,
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
    validateStep,
    nextStep,
    previousStep,
    resetSteps,
  }
})
