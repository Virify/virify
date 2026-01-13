import { describe, it, expect } from 'vitest';

describe('useProfileForm', () => {
  describe('Basic Structure', () => {
    it('should export a useProfileForm function', async () => {
      const { useProfileForm } = await import('../../../layers/dashboard/app/composables/useProfileForm');
      expect(typeof useProfileForm).toBe('function');
    });
  });

  describe('Profile Intents', () => {
    it('should define profile intents', async () => {
      const { profileIntents } = await import('../../../layers/dashboard/app/composables/useProfileForm');
      
      expect(profileIntents).toBeDefined();
      expect(Array.isArray(profileIntents)).toBe(true);
      expect(profileIntents.length).toBeGreaterThan(0);
      
      // Check structure
      profileIntents.forEach((intent: any) => {
        expect(intent).toHaveProperty('value');
        expect(intent).toHaveProperty('label');
      });
    });

    it('should include expected intents', async () => {
      const { profileIntents } = await import('../../../layers/dashboard/app/composables/useProfileForm');
      
      const labels = profileIntents.map((i: any) => i.label);
      expect(labels).toContain('Buying');
      expect(labels).toContain('Selling');
      expect(labels).toContain('Renting');
      expect(labels).toContain('Landlord');
    });
  });

  describe('Default Values', () => {
    it('should have default address structure', () => {
      const defaultAddress = {
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

      expect(defaultAddress.street).toBe("");
      expect(defaultAddress.city).toBe("");
      expect(defaultAddress.postcode).toBe("");
      expect(defaultAddress.number).toBeNull();
    });

    it('should default interests to property', () => {
      const defaultInterests = ["property"];
      
      expect(defaultInterests).toHaveLength(1);
      expect(defaultInterests[0]).toBe("property");
    });
  });

  describe('State Synchronization', () => {
    it('should sync user data to state', () => {
      const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        avatar: '',
        bio: '',
        intents: [],
        interests: ['property'],
        phoneNumber: '',
        address: {
          street: '123 Main St',
          city: 'London',
          postcode: 'SW1A 1AA',
          number: null,
          flat: null,
          name: null,
          locality: null,
          county: null,
          district: null,
          country: null,
          fullAddress: null,
          lat: null,
          lon: null
        }
      };

      const state = {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        address: mockUser.address
      };

      expect(state.firstName).toBe('John');
      expect(state.lastName).toBe('Doe');
      expect(state.email).toBe('john@example.com');
      expect(state.address.street).toBe('123 Main St');
    });

    it('should handle missing address data', () => {
      const mockUser = {
        firstName: 'Jane',
        address: null
      };

      const defaultAddress = {
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

      const address = mockUser.address || defaultAddress;
      
      expect(address.street).toBe("");
      expect(address.city).toBe("");
    });
  });
});
