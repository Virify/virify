import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

// Mock composables - must be hoisted before imports
const { mockShowToast, mockMarkStepAsCompleted, mockRequestFetch } = vi.hoisted(() => ({
  mockShowToast: vi.fn(),
  mockMarkStepAsCompleted: vi.fn(),
  mockRequestFetch: vi.fn(),
}))

// Mock composables
vi.mock('../../../app/composables/useToast', () => ({
  default: () => ({
    showToast: mockShowToast,
  }),
  useToast: () => ({
    showToast: mockShowToast,
  }),
}))

vi.mock('../../../app/composables/useDraftListing', () => ({
  useDraftListing: () => ({
    markStepAsCompleted: mockMarkStepAsCompleted
  })
}))

vi.mock('#app', () => ({
  useRequestFetch: () => mockRequestFetch
}))

// Mock utility function
vi.mock('../../../app/utils', () => ({
  objectsEqual: (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)
}))

import { useDraftStepForm } from '../../../app/composables/useDraftStepForm'
import type { DraftStepFormConfig } from '../../../app/composables/useDraftStepForm'
import type { DraftListingWithFullPayload } from '../../../shared/types/draft'

describe('useDraftStepForm', () => {
  let mockDraft: DraftListingWithFullPayload

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    mockDraft = {
      id: 1,
      userId: 1,
      tier: 'BASIC',
      title: 'Test Listing',
      completedSteps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      property: null,
      saleListing: null,
      rentalListing: null,
    } as DraftListingWithFullPayload
  })

  describe('Form State Management', () => {
    it('should initialize form data with provided initial data', () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const { formData } = useDraftStepForm(config, mockDraft)

      expect(formData.value).toEqual({ name: 'Test' })
    })

    it('should detect changes when form data is modified', async () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const { formData, hasChanges } = useDraftStepForm(config, mockDraft)

      expect(hasChanges.value).toBe(false)

      formData.value.name = 'Modified'
      await nextTick()

      expect(hasChanges.value).toBe(true)
    })

    it('should not detect changes when form data is unchanged', () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const { hasChanges } = useDraftStepForm(config, mockDraft)

      expect(hasChanges.value).toBe(false)
    })
  })

  describe('Form Validation', () => {
    it('should validate form correctly when valid', async () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: (data: { name: string }) => data.name.length > 0,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const { formData, isFormValid } = useDraftStepForm(config, mockDraft)

      expect(isFormValid.value).toBe(true)

      formData.value.name = ''
      await nextTick()

      expect(isFormValid.value).toBe(false)
    })

    it('should disable button when form is invalid', () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: '' },
        isValid: (data: { name: string }) => data.name.length > 0,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const { buttonDisabled } = useDraftStepForm(config, mockDraft)

      expect(buttonDisabled.value).toBe(true)
    })

    it('should enable button when form is valid', () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: (data: { name: string }) => data.name.length > 0,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const { buttonDisabled } = useDraftStepForm(config, mockDraft)

      expect(buttonDisabled.value).toBe(false)
    })
  })

  describe('Button Text Logic', () => {
    it('should show "Save and Continue" when form is invalid', () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: '' },
        isValid: (data: { name: string }) => data.name.length > 0,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const { buttonText } = useDraftStepForm(config, mockDraft)

      expect(buttonText.value).toBe('Save and Continue')
    })

    it('should show "Next Step" when form is valid, has existing data, and no changes', () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => true,
        stepNumber: 1
      }

      const { buttonText } = useDraftStepForm(config, mockDraft)

      expect(buttonText.value).toBe('Next Step')
    })

    it('should show "Save and Continue" when form is valid but has changes', async () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => true,
        stepNumber: 1
      }

      const { formData, buttonText } = useDraftStepForm(config, mockDraft)

      formData.value.name = 'Modified'
      await nextTick()

      expect(buttonText.value).toBe('Save and Continue')
    })
  })

  describe('Form Reset', () => {
    it('should reset form data to initial values', async () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const { formData, resetForm, formKey } = useDraftStepForm(config, mockDraft)
      const initialKey = formKey.value

      formData.value.name = 'Modified'
      await nextTick()

      resetForm()
      await nextTick()

      expect(formData.value).toEqual({ name: 'Test' })
      expect(formKey.value).toBe(initialKey + 1)
    })

    it('should increment form key on reset', () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const { formKey, resetForm } = useDraftStepForm(config, mockDraft)
      const initialKey = formKey.value

      resetForm()

      expect(formKey.value).toBe(initialKey + 1)
    })
  })

  describe('Form Submission', () => {
    it('should not submit when form is invalid', async () => {
      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: '' },
        isValid: (data: { name: string }) => data.name.length > 0,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const updateFn = vi.fn()
      const nextStepFn = vi.fn()
      const { submitForm } = useDraftStepForm(config, mockDraft)

      await submitForm(updateFn, nextStepFn)

      expect(updateFn).not.toHaveBeenCalled()
      expect(nextStepFn).not.toHaveBeenCalled()
    })

    it('should call updateFn with transformed data when beforeSubmit is provided', async () => {
      const config: DraftStepFormConfig<{ name: string, age: number }> = {
        initialData: { name: 'Test', age: 30 },
        isValid: () => true,
        hasExistingData: () => false,
        beforeSubmit: (data) => ({ name: data.name, age: data.age + 20 }),
        stepNumber: 1
      }

      const updateFn = vi.fn().mockResolvedValue(undefined)
      const nextStepFn = vi.fn()
      const { submitForm } = useDraftStepForm(config, mockDraft)

      await submitForm(updateFn, nextStepFn)

      expect(updateFn).toHaveBeenCalledWith({ name: 'Test', age: 50 })
    })

    it('should skip API call and go to next step when no changes and step already completed', async () => {
      mockDraft.completedSteps = [1]

      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => true,
        stepNumber: 1
      }

      const updateFn = vi.fn()
      const nextStepFn = vi.fn()
      const { submitForm } = useDraftStepForm(config, mockDraft)

      await submitForm(updateFn, nextStepFn)

      expect(updateFn).not.toHaveBeenCalled()
      expect(nextStepFn).toHaveBeenCalled()
    })

    it('should call updateFn when there are changes on subsequent visits', async () => {
      mockDraft.completedSteps = [1]

      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => true,
        stepNumber: 1
      }

      const updateFn = vi.fn().mockResolvedValue(undefined)
      const nextStepFn = vi.fn()
      const { formData, submitForm } = useDraftStepForm(config, mockDraft)

      formData.value.name = 'Modified'
      await nextTick()

      await submitForm(updateFn, nextStepFn)

      expect(updateFn).toHaveBeenCalledWith({ name: 'Modified' })
      expect(nextStepFn).toHaveBeenCalled()
    })

    it('should block navigation if step completion fails', async () => {
      mockShowToast.mockClear()
      mockRequestFetch.mockRejectedValue(new Error('API Error'))

      const config: DraftStepFormConfig<{ name: string }> = {
        initialData: { name: 'Test' },
        isValid: () => true,
        hasExistingData: () => false,
        stepNumber: 1
      }

      const updateFn = vi.fn().mockResolvedValue(undefined)
      const nextStepFn = vi.fn()
      const { submitForm } = useDraftStepForm(config, mockDraft)

      await submitForm(updateFn, nextStepFn)

      expect(mockShowToast).toHaveBeenCalledWith(
        'Failed to save progress. Please try again.',
        { type: 'error' }
      )
      expect(nextStepFn).not.toHaveBeenCalled()
    })
  })
})
