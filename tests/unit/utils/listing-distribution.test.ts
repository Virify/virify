import { describe, it, expect } from 'vitest'
import { distributePremiumListings } from '../../../app/utils/results/listing-distribution'

// Mock listing data
const createMockListing = (id: number, tier: 'PREMIUM' | 'FEATURED' | 'BASIC') => ({
  id,
  listingTier: tier,
  // Add other required properties as minimal mocks
  property: {},
  user: {},
  createdAt: new Date(),
  updatedAt: new Date(),
} as any) // Using any for simplicity in test

describe('distributePremiumListings', () => {
  it('should maintain the same total number of listings', () => {
    // Create test data: 3 premium, 10 basic/featured
    const mockListings = [
      ...Array.from({ length: 100 }, (_, i) => createMockListing(i, 'PREMIUM')),
      ...Array.from({ length: 90 }, (_, i) => createMockListing(i + 3, 'FEATURED')),
      ...Array.from({ length: 99 }, (_, i) => createMockListing(i + 8, 'BASIC')),
    ]

    const sections = distributePremiumListings(mockListings)
    
    // Count total listings in all sections
    let totalDistributed = 0
    for (const section of sections) {
      if (section.item) {
        totalDistributed += 1
      }
      if (section.items) {
        totalDistributed += section.items.length
      }
    }

    expect(totalDistributed).toBe(mockListings.length)
  })

  it('should handle edge case with no premium listings', () => {
    const mockListings = [
      ...Array.from({ length: 6 }, (_, i) => createMockListing(i, 'BASIC')),
    ]

    const sections = distributePremiumListings(mockListings)
    
    let totalDistributed = 0
    for (const section of sections) {
      if (section.item) {
        totalDistributed += 1
      }
      if (section.items) {
        totalDistributed += section.items.length
      }
    }

    expect(totalDistributed).toBe(mockListings.length)
  })

  it('should handle edge case with only premium listings', () => {
    const mockListings = [
      ...Array.from({ length: 4 }, (_, i) => createMockListing(i, 'PREMIUM')),
    ]

    const sections = distributePremiumListings(mockListings)
    
    let totalDistributed = 0
    for (const section of sections) {
      if (section.item) {
        totalDistributed += 1
      }
      if (section.items) {
        totalDistributed += section.items.length
      }
    }

    expect(totalDistributed).toBe(mockListings.length)
  })

  it('should handle single premium listing correctly', () => {
    const mockListings = [
      createMockListing(1, 'PREMIUM'),
      ...Array.from({ length: 4 }, (_, i) => createMockListing(i + 2, 'BASIC')),
    ]

    const sections = distributePremiumListings(mockListings)
    
    let totalDistributed = 0
    for (const section of sections) {
      if (section.item) {
        totalDistributed += 1
      }
      if (section.items) {
        totalDistributed += section.items.length
      }
    }

    expect(totalDistributed).toBe(mockListings.length)
  })
})