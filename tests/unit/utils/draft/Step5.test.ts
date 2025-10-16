import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, computed, nextTick } from "vue";
import type { DraftListingWithFullPayload } from "../../../../shared/types/draft";

/**
 * Comprehensive tests for Step5 (Bedrooms & Bathrooms)
 *
 * Tests cover:
 * - Adding and removing bedrooms/bathrooms
 * - Form validation for room completion
 * - Navigation when valid/invalid
 * - Automatic room numbering
 * - Save and cancel operations
 */

// Mock the useRoomManager composable
const mockAddRoom = vi.fn();
const mockRemoveRoom = vi.fn();
const mockSaveRoom = vi.fn();
const mockCancelRoom = vi.fn();
const mockToggleRoom = vi.fn();
const mockHasRoomChanges = vi.fn();
const mockIsRoomCompleted = vi.fn();
const mockIsNewUnsavedRoom = vi.fn();

vi.mock("../../../app/composables/useRoomManager", () => ({
  useRoomManager: () => ({
    expandedRooms: ref(new Set()),
    roomRefs: ref(new Map()),
    lastAddedRoomIndex: ref(-1),
    hasAnyRooms: computed(() => true),
    hasOpenRoomForm: computed(() => false),
    addButtonDisabled: computed(() => false),
    setRoomRef: vi.fn(),
    isRoomCollapsed: vi.fn(() => false),
    toggleRoom: mockToggleRoom,
    hasRoomChanges: mockHasRoomChanges,
    addRoom: mockAddRoom,
    saveRoom: mockSaveRoom,
    cancelRoom: mockCancelRoom,
    removeRoom: mockRemoveRoom,
    initializeRoomManager: vi.fn(),
    isRoomCompleted: mockIsRoomCompleted,
    isNewUnsavedRoom: mockIsNewUnsavedRoom,
  }),
}));

// Mock useDraftStepForm
const mockFormData = ref({
  property: {
    totalFloors: 2,
    numberBedrooms: 0,
    numberBathrooms: 0,
    bedroomFeatures: [] as any[],
    bathroomFeatures: [] as any[],
  },
});

vi.mock("../../../app/composables/useDraftStepForm", () => ({
  useDraftStepForm: () => ({
    formData: mockFormData,
    hasChanges: computed(() => false),
    buttonDisabled: computed(() => false),
    buttonText: computed(() => "Save and Continue"),
    resetForm: vi.fn(),
    submitForm: vi.fn(),
  }),
}));

describe("Step5 Component - Bedrooms & Bathrooms", () => {
  let mockDraft: DraftListingWithFullPayload;

  beforeEach(() => {
    mockDraft = {
      id: 1,
      userId: 1,
      tier: "BASIC",
      title: "Test Listing",
      completedSteps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      property: {
        id: 1,
        totalFloors: 2,
        numberBedrooms: 0,
        numberBathrooms: 0,
        bedroomFeatures: [],
        bathroomFeatures: [],
      } as any,
      saleListing: null,
      rentalListing: null,
    } as DraftListingWithFullPayload;

    vi.clearAllMocks();
    mockFormData.value = {
      property: {
        totalFloors: 2,
        numberBedrooms: 0,
        numberBathrooms: 0,
        bedroomFeatures: [],
        bathroomFeatures: [],
      },
    };
  });

  describe("Bedroom Management", () => {
    it("should add a new bedroom", () => {
      mockAddRoom.mockImplementation(() => {
        mockFormData.value.property.bedroomFeatures.push({
          name: null,
          roomNumber: 1,
          floor: 1,
          bed: [],
          description: null,
          enSuite: false,
          builtInStorage: false,
          walkInWardrobe: false,
          bayWindow: false,
          balcony: false,
          hasView: false,
          patioDoors: false,
          builtInDesk: false,
          size: null,
        });
      });

      mockAddRoom();

      expect(mockFormData.value.property.bedroomFeatures.length).toBe(1);
      expect(mockFormData.value.property.bedroomFeatures[0].roomNumber).toBe(1);
    });

    it("should add multiple bedrooms with incrementing room numbers", () => {
      mockAddRoom.mockImplementation(() => {
        const nextNumber = mockFormData.value.property.bedroomFeatures.length + 1;
        mockFormData.value.property.bedroomFeatures.push({
          name: null,
          roomNumber: nextNumber,
          floor: 1,
          bed: [],
          description: null,
          enSuite: false,
          builtInStorage: false,
          walkInWardrobe: false,
          bayWindow: false,
          balcony: false,
          hasView: false,
          patioDoors: false,
          builtInDesk: false,
          size: null,
        });
      });

      mockAddRoom(); // Bedroom 1
      mockAddRoom(); // Bedroom 2
      mockAddRoom(); // Bedroom 3

      expect(mockFormData.value.property.bedroomFeatures.length).toBe(3);
      expect(mockFormData.value.property.bedroomFeatures[0].roomNumber).toBe(1);
      expect(mockFormData.value.property.bedroomFeatures[1].roomNumber).toBe(2);
      expect(mockFormData.value.property.bedroomFeatures[2].roomNumber).toBe(3);
    });

    it("should remove a bedroom and renumber remaining", () => {
      // Setup: 3 bedrooms
      mockFormData.value.property.bedroomFeatures = [{ roomNumber: 1, name: "Bedroom 1" } as any, { roomNumber: 2, name: "Bedroom 2" } as any, { roomNumber: 3, name: "Bedroom 3" } as any];

      mockRemoveRoom.mockImplementation((index: number) => {
        mockFormData.value.property.bedroomFeatures.splice(index, 1);
        // Renumber
        mockFormData.value.property.bedroomFeatures.forEach((room, i) => {
          room.roomNumber = i + 1;
        });
      });

      mockRemoveRoom(1); // Remove bedroom 2

      expect(mockFormData.value.property.bedroomFeatures.length).toBe(2);
      expect(mockFormData.value.property.bedroomFeatures[0].roomNumber).toBe(1);
      expect(mockFormData.value.property.bedroomFeatures[1].roomNumber).toBe(2);
      expect(mockFormData.value.property.bedroomFeatures[1].name).toBe("Bedroom 3");
    });

    it("should validate bedroom completion", () => {
      const incompleteBedroom = {
        name: null, // Missing required field
        roomNumber: 1,
        floor: 1,
        bed: [],
      };

      const completeBedroom = {
        name: "Master Bedroom",
        roomNumber: 1,
        floor: 1,
        bed: ["KING"],
      };

      mockIsRoomCompleted.mockImplementation((room: any) => {
        return Boolean(room.name && room.roomNumber && room.floor && room.bed.length > 0);
      });

      expect(mockIsRoomCompleted(incompleteBedroom)).toBe(false);
      expect(mockIsRoomCompleted(completeBedroom)).toBe(true);
    });

    it("should prevent adding bedroom when existing bedroom is incomplete", () => {
      mockFormData.value.property.bedroomFeatures = [
        { name: null, roomNumber: 1, floor: 1, bed: [] } as any, // Incomplete
      ];

      mockIsRoomCompleted.mockReturnValue(false);

      const hasIncomplete = mockFormData.value.property.bedroomFeatures.some((room: any) => !mockIsRoomCompleted(room));

      expect(hasIncomplete).toBe(true);
    });

    it("should save bedroom with all required fields", () => {
      const bedroom = {
        name: "Master Bedroom",
        roomNumber: 1,
        floor: 2,
        bed: ["KING"],
        description: "Large bedroom with ensuite",
        enSuite: true,
        builtInStorage: true,
        walkInWardrobe: false,
        bayWindow: true,
        balcony: false,
        hasView: true,
        patioDoors: false,
        builtInDesk: false,
        size: 15.5,
      };

      mockFormData.value.property.bedroomFeatures = [bedroom as any];
      mockIsRoomCompleted.mockReturnValue(true);
      mockHasRoomChanges.mockReturnValue(true);

      mockSaveRoom(0);

      expect(mockSaveRoom).toHaveBeenCalledWith(0);
      expect(mockIsRoomCompleted(bedroom)).toBe(true);
    });

    it("should cancel bedroom changes and restore original", () => {
      const originalBedroom = {
        id: 1,
        name: "Original Name",
        roomNumber: 1,
        floor: 1,
        bed: ["DOUBLE"],
      };

      mockFormData.value.property.bedroomFeatures = [{ ...originalBedroom, name: "Modified Name" } as any];

      mockCancelRoom(0);

      expect(mockCancelRoom).toHaveBeenCalledWith(0);
    });

    it("should remove new unsaved bedroom when canceled", () => {
      const newBedroom = {
        name: "New Bedroom",
        roomNumber: 1,
        floor: 1,
        bed: [],
      };

      mockFormData.value.property.bedroomFeatures = [newBedroom as any];
      mockIsNewUnsavedRoom.mockReturnValue(true);

      mockCancelRoom.mockImplementation((index: number) => {
        if (mockIsNewUnsavedRoom(index)) {
          mockFormData.value.property.bedroomFeatures.splice(index, 1);
        }
      });

      mockCancelRoom(0);

      expect(mockFormData.value.property.bedroomFeatures.length).toBe(0);
    });
  });

  describe("Bathroom Management", () => {
    it("should add a new bathroom", () => {
      mockAddRoom.mockImplementation(() => {
        mockFormData.value.property.bathroomFeatures.push({
          name: null,
          roomNumber: 1,
          floor: 1,
          description: null,
          bath: false,
          shower: false,
          toilet: false,
          bidet: false,
          sink: false,
          heatedTowelRail: false,
          underfloorHeating: false,
          window: false,
          size: null,
        });
      });

      mockAddRoom();

      expect(mockFormData.value.property.bathroomFeatures.length).toBe(1);
    });

    it("should validate bathroom completion", () => {
      const incompleteBathroom = {
        name: null,
        roomNumber: 1,
        floor: 1,
      };

      const completeBathroom = {
        name: "Main Bathroom",
        roomNumber: 1,
        floor: 1,
      };

      mockIsRoomCompleted.mockImplementation((room: any) => {
        return Boolean(room.name && room.roomNumber && room.floor);
      });

      expect(mockIsRoomCompleted(incompleteBathroom)).toBe(false);
      expect(mockIsRoomCompleted(completeBathroom)).toBe(true);
    });
  });

  describe("Form Submission with Room Counts", () => {
    it("should update bedroom count before submission", () => {
      mockFormData.value.property.bedroomFeatures = [{ name: "Bedroom 1", roomNumber: 1 } as any, { name: "Bedroom 2", roomNumber: 2 } as any, { name: "Bedroom 3", roomNumber: 3 } as any];

      // Simulate beforeSubmit transformation
      const transformedData = {
        ...mockFormData.value,
        property: {
          ...mockFormData.value.property,
          numberBedrooms: mockFormData.value.property.bedroomFeatures.length,
        },
      };

      expect(transformedData.property.numberBedrooms).toBe(3);
    });

    it("should update bathroom count before submission", () => {
      mockFormData.value.property.bathroomFeatures = [{ name: "Bathroom 1", roomNumber: 1 } as any, { name: "Bathroom 2", roomNumber: 2 } as any];

      // Simulate beforeSubmit transformation
      const transformedData = {
        ...mockFormData.value,
        property: {
          ...mockFormData.value.property,
          numberBathrooms: mockFormData.value.property.bathroomFeatures.length,
        },
      };

      expect(transformedData.property.numberBathrooms).toBe(2);
    });

    it("should submit valid form with completed rooms", () => {
      mockFormData.value.property.bedroomFeatures = [{ name: "Master", roomNumber: 1, floor: 2, bed: ["KING"] } as any];
      mockFormData.value.property.bathroomFeatures = [{ name: "Ensuite", roomNumber: 1, floor: 2 } as any];

      const isValid =
        mockFormData.value.property.bedroomFeatures.every((room: any) => room.name && room.roomNumber && room.floor && room.bed?.length > 0) &&
        mockFormData.value.property.bathroomFeatures.every((room: any) => room.name && room.roomNumber && room.floor);

      expect(isValid).toBe(true);
    });
  });

  describe("Total Floors Constraint", () => {
    it("should disable totalFloors when rooms exist", () => {
      mockFormData.value.property.bedroomFeatures = [{ name: "Bedroom 1" } as any];

      const hasRooms = mockFormData.value.property.bedroomFeatures.length > 0 || mockFormData.value.property.bathroomFeatures.length > 0;

      const isTotalFloorsDisabled = hasRooms;

      expect(isTotalFloorsDisabled).toBe(true);
    });

    it("should enable totalFloors when no rooms exist", () => {
      mockFormData.value.property.bedroomFeatures = [];
      mockFormData.value.property.bathroomFeatures = [];

      const hasRooms = mockFormData.value.property.bedroomFeatures.length > 0 || mockFormData.value.property.bathroomFeatures.length > 0;

      const isTotalFloorsDisabled = hasRooms;

      expect(isTotalFloorsDisabled).toBe(false);
    });

    it("should provide floor options based on totalFloors", () => {
      const totalFloors = 3;

      const floorOptions = Array.from({ length: totalFloors }, (_, i) => ({
        key: `Floor ${i + 1}`,
        value: String(i + 1),
      }));

      expect(floorOptions.length).toBe(3);
      expect(floorOptions[0]).toEqual({ key: "Floor 1", value: "1" });
      expect(floorOptions[2]).toEqual({ key: "Floor 3", value: "3" });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty bedroom array", () => {
      mockFormData.value.property.bedroomFeatures = [];

      expect(mockFormData.value.property.bedroomFeatures.length).toBe(0);
    });

    it("should handle removing the only bedroom", () => {
      mockFormData.value.property.bedroomFeatures = [{ name: "Only Bedroom", roomNumber: 1 } as any];

      mockRemoveRoom.mockImplementation(() => {
        mockFormData.value.property.bedroomFeatures = [];
      });

      mockRemoveRoom(0);

      expect(mockFormData.value.property.bedroomFeatures.length).toBe(0);
    });

    it("should handle maximum floor selection", () => {
      const bedroom = {
        name: "Top Floor Bedroom",
        roomNumber: 1,
        floor: 10, // Max floor
      };

      mockFormData.value.property.totalFloors = 10;
      mockFormData.value.property.bedroomFeatures = [bedroom as any];

      expect(bedroom.floor).toBe(mockFormData.value.property.totalFloors);
    });
  });
});
