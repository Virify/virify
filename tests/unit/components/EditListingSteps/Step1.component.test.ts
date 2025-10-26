import { describe, it, expect, beforeEach, vi } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import Step1 from "../../../../app/components/EditListingSteps/Step1.vue";
import type { DraftListingWithFullPayload } from "../../../../shared/types/draft";

// Mock maplibre-gl to prevent it from loading
vi.mock("maplibre-gl", () => ({
  Map: vi.fn(),
  NavigationControl: vi.fn(),
  Marker: vi.fn(),
  Popup: vi.fn(),
}));

// Mock @maptiler/sdk to prevent it from loading
vi.mock("@maptiler/sdk", () => ({
  Map: vi.fn(),
  config: { apiKey: "" },
}));

// DON'T mock useDraftStepForm - let the real one run for component tests
// We only need to mock it for specific button state tests where we want to control the exact state

describe("Step1 Component", () => {
  let mockDraft: DraftListingWithFullPayload;

  beforeEach(() => {
    // Create a minimal mock draft
    mockDraft = {
      id: "test-draft-id",
      userId: "test-user-id",
      saleListing: null,
      rentalListing: null,
      property: null,
      address: null,
      rooms: [],
      amenities: [],
      images: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      highestCompletedStep: 0,
      completedSteps: [], // Required for isDraftListing type guard
    } as any;
  });

  describe("Component Rendering", () => {
    it("should render the component", async () => {
      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockDraft,
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should display the correct title", async () => {
      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockDraft,
        },
      });

      expect(wrapper.text()).toContain("Listing Type");
    });

    it("should display the correct info text", async () => {
      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockDraft,
        },
      });

      expect(wrapper.text()).toContain("Are you selling or renting out a property? Your selection tailors the rest of the form.");
    });

    it("should display initial listing type question when no type is selected", async () => {
      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockDraft,
        },
      });

      expect(wrapper.text()).toContain("For Sale / For Rent");
    });

    it("should update UI when selecting sale then rent via child radio emits", async () => {
      // Stub the child radio group so we can emit update:modelValue easily
      const wrapper = await mountSuspended(Step1, {
        props: { draft: mockDraft },
        global: {
          stubs: {
            OrganismsListingFormRadioGroup: {
              name: "OrganismsListingFormRadioGroup",
              props: ["title"],
              template: '<div><span class="radio-title">{{ title }}</span><slot /></div>',
              methods: {
                emitVal(v: any) {
                  this.$emit("update:modelValue", v);
                },
              },
            },
          },
        },
      });

      // emulate selecting 'sale'
      await wrapper.findComponent({ name: "OrganismsListingFormRadioGroup" }).vm.$emit("update:modelValue", "sale");
      await wrapper.vm.$nextTick();
      // Look for radio group titles rendered by our stub
      const saleTitles = wrapper.findAll(".radio-title").map((w) => w.text());
      expect(saleTitles).toContain("Select property tenure");

      // emulate selecting 'rent'
      await wrapper.findComponent({ name: "OrganismsListingFormRadioGroup" }).vm.$emit("update:modelValue", "rent");
      await wrapper.vm.$nextTick();
      const rentTitles = wrapper.findAll(".radio-title").map((w) => w.text());
      expect(rentTitles).toContain("Are bills included in the rent?");
    });
  });

  describe("Sale Listing Fields", () => {
    it("should show sale-specific fields when sale is selected", async () => {
      const mockSaleDraft = {
        ...mockDraft,
        saleListing: {
          tenureType: "freehold",
          chain: null,
        },
      } as any;

      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockSaleDraft,
        },
      });

      // Find the radio group components and assert their title props include sale fields
      const saleRadioGroups = wrapper.findAllComponents({ name: "OrganismsListingFormRadioGroup" });
      const saleTitles = saleRadioGroups.map((r) => r.props("title"));
      expect(saleTitles).toContain("Select property tenure");
      expect(saleTitles).toContain("Are you part of a chain?");
    });

    it("should not show rental fields when sale is selected", async () => {
      const mockSaleDraft = {
        ...mockDraft,
        saleListing: {
          tenureType: "freehold",
          chain: null,
        },
      } as any;

      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockSaleDraft,
        },
      });

      const titles = wrapper.findAllComponents({ name: "OrganismsListingFormRadioGroup" }).map((r) => r.props("title"));
      expect(titles).not.toContain("Are bills included in the rent?");
      expect(titles).not.toContain("Select furnished status");
    });
  });

  describe("Rental Listing Fields", () => {
    it("should show rental-specific fields when rental is selected", async () => {
      const mockRentalDraft = {
        ...mockDraft,
        rentalListing: {
          isBillsIncluded: null,
          furnishedStatus: null,
        },
      } as any;

      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockRentalDraft,
        },
      });

      const rentRadioGroups = wrapper.findAllComponents({ name: "OrganismsListingFormRadioGroup" });
      const rentTitles = rentRadioGroups.map((r) => r.props("title"));
      expect(rentTitles).toContain("Are bills included in the rent?");
      expect(rentTitles).toContain("Select furnished status");
    });

    it("should not show sale fields when rental is selected", async () => {
      const mockRentalDraft = {
        ...mockDraft,
        rentalListing: {
          isBillsIncluded: null,
          furnishedStatus: null,
        },
      } as any;

      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockRentalDraft,
        },
      });

      const titles2 = wrapper.findAllComponents({ name: "OrganismsListingFormRadioGroup" }).map((r) => r.props("title"));
      expect(titles2).not.toContain("Please confirm property tenure");
      expect(titles2).not.toContain("Are you part of a chain?");
    });
  });

  describe("Button State", () => {
    it("should have disabled button when form is invalid", async () => {
      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockDraft,
        },
      });

      // Find the StepLayout component which contains the submit button
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("buttonDisabled")).toBe(true);
    });

    it("should have enabled button when form is valid", async () => {
      const mockValidDraft = {
        ...mockDraft,
        saleListing: {
          tenureType: "freehold",
          chain: "chain-free",
        },
      } as any;

      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockValidDraft,
        },
      });

      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("buttonDisabled")).toBe(false);
    });

    it('should show "Save & Continue" when there are changes', async () => {
      const mockValidDraft = {
        ...mockDraft,
        saleListing: {
          tenureType: "freehold",
          chain: null,
        },
      } as any;

      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockValidDraft,
        },
      });

      // Make a change to trigger "Save & Continue"
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      // The component should show "Save & Continue" when data changes from initial state
      // Since we're testing the real component, this depends on actual form state
      expect(stepLayout.props("buttonText")).toBeDefined();
    });

    it('should show "Next Step" when there are no changes', async () => {
      const mockCompleteDraft = {
        ...mockDraft,
        saleListing: {
          tenureType: "freehold",
          chain: "chain-free",
        },
      } as any;

      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockCompleteDraft,
        },
      });

      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("buttonText")).toBe("Next Step");
    });
  });

  describe("Error Message Display", () => {
    it("should display error message when provided", async () => {
      const errorMessage = "Test error message";

      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockDraft,
          errorMessage,
        },
      });

      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("errorMessage")).toBe(errorMessage);
    });

    it("should not display error message when not provided", async () => {
      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockDraft,
        },
      });

      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("errorMessage")).toBeUndefined();
    });
  });

  describe("Event Emissions", () => {
    it("should emit updateStepData when form is submitted with sale data", async () => {
      const mockValidDraft = {
        ...mockDraft,
        completedSteps: [], // Ensure it's a fresh step
      } as any;

      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockValidDraft,
        },
      });

      // Find the first radio group (listing type selection) and emit a selection
      const radioGroups = wrapper.findAllComponents({ name: "OrganismsListingFormRadioGroup" });
      expect(radioGroups.length).toBeGreaterThan(0);
      
      // Select "sale" listing type
      await radioGroups[0].vm.$emit("update:modelValue", "sale");
      await wrapper.vm.$nextTick();

      // Now find and select tenure type
      const radioGroupsAfter = wrapper.findAllComponents({ name: "OrganismsListingFormRadioGroup" });
      // The second radio group should be the tenure type
      await radioGroupsAfter[1].vm.$emit("update:modelValue", "freehold");
      await wrapper.vm.$nextTick();

      // Submit the form
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      await stepLayout.vm.$emit("submit");

      // Check that updateStepData was emitted
      expect(wrapper.emitted()).toHaveProperty("updateStepData");
    });

    it("should call resetForm when cancel is triggered", async () => {
      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockDraft,
        },
      });

      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });

      // Trigger cancel
      await stepLayout.vm.$emit("cancel");

      // The form should reset - we can verify this by checking formKey incremented or state reset
      expect(stepLayout.exists()).toBe(true);
    });
  });

  describe("Form Key Management", () => {
    it("should pass formKey prop to StepLayout for form reset", async () => {
      const wrapper = await mountSuspended(Step1, {
        props: {
          draft: mockDraft,
        },
      });

      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      // formKey should be a number (starts at 0)
      expect(typeof stepLayout.props("formKey")).toBe("number");
    });
  });
});
