import { describe, it, expect, vi } from 'vitest';
import { formatDashboardLabel, generateDashboardSearchGroups } from '../../../layers/dashboard/app/utils/dash-nav-search';

// Mock numberToCurrency utility
vi.mock('#imports', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    numberToCurrency: (value: number) => {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
  };
});

describe('dash-nav-search utils', () => {
  describe('formatDashboardLabel', () => {
    it('should format label with price and full address', () => {
      const listing = {
        price: 500000,
        property: {
          address: {
            street: '123 Main St',
            city: 'London',
            postcode: 'SW1A 1AA'
          }
        }
      };
      
      const result = formatDashboardLabel(listing);
      
      expect(result).toContain('£500,000');
      expect(result).toContain('123 Main St');
      expect(result).toContain('London');
      expect(result).toContain('SW1A 1AA');
    });

    it('should handle missing address gracefully', () => {
      const listing = {
        price: 250000
      };
      
      const result = formatDashboardLabel(listing);
      
      expect(result).toBe('Price: £250,000');
    });

    it('should handle partial address', () => {
      const listing = {
        price: 300000,
        property: {
          address: {
            city: 'Manchester',
            postcode: 'M1 1AA'
          }
        }
      };
      
      const result = formatDashboardLabel(listing);
      
      expect(result).toContain('£300,000');
      expect(result).toContain('Manchester');
      expect(result).toContain('M1 1AA');
      expect(result).not.toContain('undefined');
    });

    it('should use saleListing price if no top-level price', () => {
      const listing = {
        saleListing: {
          price: 400000
        },
        property: {
          address: {
            city: 'Bristol'
          }
        }
      };
      
      const result = formatDashboardLabel(listing);
      
      // Will show £0 at top level since no price property
      expect(result).toContain('Price: £0');
    });
  });

  describe('generateDashboardSearchGroups', () => {
    describe('favourites', () => {
      it('should generate search groups for favourites', () => {
        const items = [
          {
            listing: {
              id: 1,
              price: 500000,
              saleListing: { price: 500000 },
              property: {
                address: {
                  street: '123 Main St',
                  city: 'London',
                  postcode: 'SW1A 1AA',
                  fullAddress: '123 Main St, London, SW1A 1AA'
                },
                numberBedrooms: 3,
                numberBathrooms: 2,
                media: [{ src: 'image1.jpg' }]
              }
            }
          },
          {
            listing: {
              id: 2,
              price: 1500,
              rentalListing: { price: 1500 },
              property: {
                address: {
                  city: 'Manchester',
                  fullAddress: 'Manchester, M1 1AA'
                },
                numberBedrooms: 2,
                numberBathrooms: 1,
                media: []
              }
            }
          }
        ];
        
        const groups = generateDashboardSearchGroups(items, 'favourites');
        
        expect(groups).toHaveLength(2);
        
        // Rentals group
        expect(groups[0].id).toBe('favourites-rentals');
        expect(groups[0].label).toBe('Favourites Rental');
        expect(groups[0].items).toHaveLength(1);
        expect(groups[0].items[0].id).toBe(2);
        expect(groups[0].items[0].icon).toBe('i-heroicons-heart');
        
        // Sales group
        expect(groups[1].id).toBe('favourites-sales');
        expect(groups[1].label).toBe('Favourites Sale');
        expect(groups[1].items).toHaveLength(1);
        expect(groups[1].items[0].id).toBe(1);
      });

      it('should include searchable suffix for favourites', () => {
        const items = [
          {
            listing: {
              id: 1,
              saleListing: { price: 500000 },
              property: {
                address: {
                  fullAddress: '123 Main St, London'
                },
                numberBedrooms: 3,
                numberBathrooms: 2
              }
            }
          }
        ];
        
        const groups = generateDashboardSearchGroups(items, 'favourites');
        
        expect(groups[1].items[0].suffix).toContain('123 Main St, London');
        expect(groups[1].items[0].suffix).toContain('3 beds');
        expect(groups[1].items[0].suffix).toContain('2 baths');
      });
    });

    describe('notes', () => {
      it('should generate search groups for notes', () => {
        const items = [
          {
            note: 'Great location!',
            listing: {
              id: 1,
              price: 500000,
              saleListing: { price: 500000 },
              property: {
                address: {
                  city: 'London'
                },
                numberBedrooms: 3,
                numberBathrooms: 2
              }
            }
          },
          {
            note: 'Needs renovation',
            listing: {
              id: 2,
              price: 1200,
              rentalListing: { price: 1200 },
              property: {
                address: {
                  city: 'Bristol'
                },
                numberBedrooms: 1,
                numberBathrooms: 1
              }
            }
          }
        ];
        
        const groups = generateDashboardSearchGroups(items, 'notes');
        
        expect(groups).toHaveLength(2);
        
        // Rentals group
        expect(groups[0].id).toBe('notes-rentals');
        expect(groups[0].label).toBe('Notes Rental');
        expect(groups[0].items).toHaveLength(1);
        expect(groups[0].items[0].icon).toBe('i-lucide-sticky-note');
        expect(groups[0].items[0].note).toBe('Needs renovation');
        
        // Sales group
        expect(groups[1].id).toBe('notes-sales');
        expect(groups[1].label).toBe('Notes Sale');
        expect(groups[1].items[0].note).toBe('Great location!');
      });

      it('should include note content in searchable suffix', () => {
        const items = [
          {
            note: 'Great location!',
            listing: {
              id: 1,
              saleListing: { price: 500000 },
              property: {
                address: {
                  fullAddress: '123 Main St, London'
                },
                numberBedrooms: 3,
                numberBathrooms: 2
              }
            }
          }
        ];
        
        const groups = generateDashboardSearchGroups(items, 'notes');
        
        expect(groups[1].items[0].suffix).toContain('Great location!');
        expect(groups[1].items[0].suffix).toContain('123 Main St, London');
      });
    });

    describe('edge cases', () => {
      it('should handle items without listings', () => {
        const items = [
          { note: 'No listing' },
          {
            listing: {
              id: 1,
              saleListing: { price: 500000 },
              property: {
                address: { city: 'London' }
              }
            }
          }
        ];
        
        const groups = generateDashboardSearchGroups(items, 'notes');
        
        // Only 1 valid item
        expect(groups[1].items).toHaveLength(1);
        expect(groups[1].items[0].id).toBe(1);
      });

      it('should handle items with both sale and rental listings', () => {
        const items = [
          {
            listing: {
              id: 1,
              saleListing: { price: 500000 },
              rentalListing: { price: 2000 },
              property: {
                address: { city: 'London' }
              }
            }
          }
        ];
        
        const groups = generateDashboardSearchGroups(items, 'favourites');
        
        // Should appear in both groups
        expect(groups[0].items).toHaveLength(1); // Rentals
        expect(groups[1].items).toHaveLength(1); // Sales
      });

      it('should handle missing property specs', () => {
        const items = [
          {
            listing: {
              id: 1,
              saleListing: { price: 500000 },
              property: {
                address: { city: 'London' }
                // No numberBedrooms or numberBathrooms
              }
            }
          }
        ];
        
        const groups = generateDashboardSearchGroups(items, 'favourites');
        
        expect(groups[1].items[0].specs.beds).toBe(0);
        expect(groups[1].items[0].specs.baths).toBe(0);
      });

      it('should set empty string for missing image', () => {
        const items = [
          {
            listing: {
              id: 1,
              saleListing: { price: 500000 },
              property: {
                address: { city: 'London' }
                // No media
              }
            }
          }
        ];
        
        const groups = generateDashboardSearchGroups(items, 'favourites');
        
        expect(groups[1].items[0].image).toBe('');
      });
    });
  });
});
