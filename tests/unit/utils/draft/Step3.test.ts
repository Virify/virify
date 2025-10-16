import { describe, it, expect } from 'vitest'
import { stepThreeValidation } from '../../../../app/utils/draft/step-three'
import type { DraftListingWithFullPayload, StepThree } from '../../../../shared/types/draft'

describe('Step3 - Price Validation', () => {
  describe('Sale Price Validation', () => {
    it('should validate complete sale price data', () => {
      const saleData = {
        priceType: 'ASKING_PRICE' as any,
      }

      const result = stepThreeValidation.isSalePriceValid(saleData)
      expect(result).toBe(true)
    })

    it('should invalidate sale price without priceType', () => {
      const saleData = {
        priceType: null,
      }

      const result = stepThreeValidation.isSalePriceValid(saleData)
      expect(result).toBe(false)
    })
  })

  describe('Rental Price Validation', () => {
    it('should validate complete rental price data', () => {
      const rentalData = {
        rentFrequency: 'MONTHLY' as any,
        deposit: 1200,
        holdingDeposit: 300,
        rentalLength: 12,
      }

      const result = stepThreeValidation.isRentalPriceValid(rentalData)
      expect(result).toBe(true)
    })

    it('should invalidate rental price without rentFrequency', () => {
      const rentalData = {
        rentFrequency: null,
        deposit: 1200,
        holdingDeposit: 300,
        rentalLength: 12,
      }

      const result = stepThreeValidation.isRentalPriceValid(rentalData)
      expect(result).toBe(false)
    })

    it('should invalidate rental price without deposit', () => {
      const rentalData = {
        rentFrequency: 'MONTHLY' as any,
        deposit: null,
        holdingDeposit: 300,
        rentalLength: 12,
      }

      const result = stepThreeValidation.isRentalPriceValid(rentalData)
      expect(result).toBe(false)
    })

    it('should invalidate rental price without holdingDeposit', () => {
      const rentalData = {
        rentFrequency: 'MONTHLY' as any,
        deposit: 1200,
        holdingDeposit: null,
        rentalLength: 12,
      }

      const result = stepThreeValidation.isRentalPriceValid(rentalData)
      expect(result).toBe(false)
    })

    it('should invalidate rental price without rentalLength', () => {
      const rentalData = {
        rentFrequency: 'MONTHLY' as any,
        deposit: 1200,
        holdingDeposit: 300,
        rentalLength: null,
      }

      const result = stepThreeValidation.isRentalPriceValid(rentalData)
      expect(result).toBe(false)
    })
  })

  describe('isStepThreeValid', () => {
    it('should validate complete sale listing price', () => {
      const data: StepThree = {
        price: 250000,
        saleListing: {
          priceType: 'OFFERS_OVER' as any,
        },
      }

      const draft = {
        saleListing: {},
      } as DraftListingWithFullPayload

      const result = stepThreeValidation.isStepThreeValid(data, draft)
      expect(result).toBe(true)
    })

    it('should validate complete rental listing price', () => {
      const data: StepThree = {
        price: 1500,
        rentalListing: {
          rentFrequency: 'MONTHLY' as any,
          deposit: 1500,
          holdingDeposit: 350,
          rentalLength: 12,
        },
      }

      const draft = {
        rentalListing: {},
      } as DraftListingWithFullPayload

      const result = stepThreeValidation.isStepThreeValid(data, draft)
      expect(result).toBe(true)
    })

    it('should invalidate when price is missing', () => {
      const data: StepThree = {
        price: null,
        saleListing: {
          priceType: 'ASKING_PRICE' as any,
        },
      }

      const draft = {
        saleListing: {},
      } as DraftListingWithFullPayload

      const result = stepThreeValidation.isStepThreeValid(data, draft)
      expect(result).toBe(false)
    })

    it('should invalidate sale listing when priceType is missing', () => {
      const data: StepThree = {
        price: 300000,
        saleListing: {
          priceType: null,
        },
      }

      const draft = {
        saleListing: {},
      } as DraftListingWithFullPayload

      const result = stepThreeValidation.isStepThreeValid(data, draft)
      expect(result).toBe(false)
    })
  })

  describe('hasExistingStepThreeData', () => {
    it('should return true when draft has complete sale price data', () => {
      const mockDraft = {
        price: 275000,
        saleListing: {
          priceType: 'ASKING_PRICE',
        },
      } as DraftListingWithFullPayload

      const result = stepThreeValidation.hasExistingStepThreeData(mockDraft)
      expect(result).toBe(true)
    })

    it('should return true when draft has complete rental price data', () => {
      const mockDraft = {
        price: 1200,
        rentalListing: {
          rentFrequency: 'MONTHLY',
          deposit: 1200,
          holdingDeposit: 300,
          rentalLength: 12,
        },
      } as DraftListingWithFullPayload

      const result = stepThreeValidation.hasExistingStepThreeData(mockDraft)
      expect(result).toBe(true)
    })

    it('should return false when price is missing', () => {
      const mockDraft = {
        price: null,
        saleListing: {
          priceType: 'ASKING_PRICE',
        },
      } as DraftListingWithFullPayload

      const result = stepThreeValidation.hasExistingStepThreeData(mockDraft)
      expect(result).toBe(false)
    })
  })
})
