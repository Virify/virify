import { describe, it, expect } from 'vitest'
import { stepFourValidation } from '../../../../app/utils/draft/step-four'
import type { DraftListingWithFullPayload, StepFour } from '../../../../shared/types/draft'

describe('Step4 - Address Validation', () => {
  describe('isAddressValid', () => {
    it('should validate complete address', () => {
      const address = {
        number: '123',
        street: 'Main Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'UK',
      }

      const result = stepFourValidation.isAddressValid(address)
      expect(result).toBe(true)
    })

    it('should invalidate address without number', () => {
      const address = {
        number: null,
        street: 'Main Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'UK',
      }

      const result = stepFourValidation.isAddressValid(address)
      expect(result).toBe(false)
    })

    it('should invalidate address without street', () => {
      const address = {
        number: '123',
        street: null,
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'UK',
      }

      const result = stepFourValidation.isAddressValid(address)
      expect(result).toBe(false)
    })

    it('should invalidate address without city', () => {
      const address = {
        number: '123',
        street: 'Main Street',
        city: null,
        postcode: 'SW1A 1AA',
        country: 'UK',
      }

      const result = stepFourValidation.isAddressValid(address)
      expect(result).toBe(false)
    })

    it('should invalidate address without postcode', () => {
      const address = {
        number: '123',
        street: 'Main Street',
        city: 'London',
        postcode: null,
        country: 'UK',
      }

      const result = stepFourValidation.isAddressValid(address)
      expect(result).toBe(false)
    })

    it('should invalidate address without country', () => {
      const address = {
        number: '123',
        street: 'Main Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: null,
      }

      const result = stepFourValidation.isAddressValid(address)
      expect(result).toBe(false)
    })
  })

  describe('isStepFourValid', () => {
    it('should validate step with complete address', () => {
      const data: StepFour = {
        property: {
          address: {
            number: '42',
            street: 'Baker Street',
            city: 'London',
            postcode: 'NW1 6XE',
            country: 'UK',
            county: null,
            flat: null,
            name: null,
            locality: null,
            district: null,
            fullAddress: null,
            lat: null,
            lon: null,
          },
        },
      }

      const result = stepFourValidation.isStepFourValid(data)
      expect(result).toBe(true)
    })

    it('should invalidate step with incomplete address', () => {
      const data: StepFour = {
        property: {
          address: {
            number: '42',
            street: null,
            city: 'London',
            postcode: 'NW1 6XE',
            country: 'UK',
            county: null,
            flat: null,
            name: null,
            locality: null,
            district: null,
            fullAddress: null,
            lat: null,
            lon: null,
          },
        },
      }

      const result = stepFourValidation.isStepFourValid(data)
      expect(result).toBe(false)
    })
  })

  describe('hasExistingStepFourData', () => {
    it('should return true when draft has complete address', () => {
      const mockDraft = {
        property: {
          address: {
            number: '10',
            street: 'Downing Street',
            city: 'London',
            postcode: 'SW1A 2AA',
            country: 'UK',
          },
        },
      } as DraftListingWithFullPayload

      const result = stepFourValidation.hasExistingStepFourData(mockDraft)
      expect(result).toBe(true)
    })

    it('should return false when address is incomplete', () => {
      const mockDraft = {
        property: {
          address: {
            number: '10',
            street: null,
            city: 'London',
            postcode: 'SW1A 2AA',
            country: 'UK',
          },
        },
      } as DraftListingWithFullPayload

      const result = stepFourValidation.hasExistingStepFourData(mockDraft)
      expect(result).toBe(false)
    })

    it('should return false when property is null', () => {
      const mockDraft = {
        property: null,
      } as DraftListingWithFullPayload

      const result = stepFourValidation.hasExistingStepFourData(mockDraft)
      expect(result).toBe(false)
    })
  })
})
