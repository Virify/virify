import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Step3 from "../../../../app/components/EditListingSteps/Step3.vue";

describe("Step3 Component", () => {
  let mockDraft: any;

  beforeEach(() => {
    mockDraft = {
      id: "test-draft-id",
      userId: "test-user-id",
      property: { type: { id: 1 }, classification: { id: 1 }, description: "Test", totalFloors: 1 },
      saleListing: null,
      rentalListing: null,
      address: null,
      rooms: [],
      amenities: [],
      images: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      highestCompletedStep: 1,
    };
  });

  describe("Component Rendering", () => {
    it("renders the component with correct title", async () => {
      const wrapper = await mountSuspended(Step3, { props: { draft: mockDraft } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain("Price");
    });

    it('renders price type field', async () => {
      const saleDraft = {
        ...mockDraft,
        saleListing: { tenureType: 'freehold', priceType: null },
      };
      const wrapper = await mountSuspended(Step3, { props: { draft: saleDraft } });
      const radioGroups = wrapper.findAllComponents({ name: 'OrganismsListingFormRadioGroup' });
      const titles = radioGroups.map(r => r.props('title'));
      expect(titles).toContain('Price type:');
    });
  });

  describe('Sale Listing Fields', () => {
    it('shows sale-specific price fields when sale listing exists', async () => {
      const saleDraft = {
        ...mockDraft,
        saleListing: { tenureType: 'freehold', chain: null, priceType: null, price: null },
      };
      const wrapper = await mountSuspended(Step3, { props: { draft: saleDraft } });
      const radioGroups = wrapper.findAllComponents({ name: 'OrganismsListingFormRadioGroup' });
      const titles = radioGroups.map(r => r.props('title'));
      expect(titles).toContain('Price type:');
    });
  });

  describe("Rental Listing Fields", () => {
    it("shows rental-specific price fields when rental listing exists", async () => {
      const rentalDraft = {
        ...mockDraft,
        rentalListing: { isBillsIncluded: true, furnishedStatus: "furnished", rentFrequency: null, price: null },
      };
      const wrapper = await mountSuspended(Step3, { props: { draft: rentalDraft } });
      const radioGroups = wrapper.findAllComponents({ name: "OrganismsListingFormRadioGroup" });
      const titles = radioGroups.map((r) => r.props("title"));
      expect(titles).toContain("What is the rent frequency for this listing?");
    });
  });

  describe("Button State", () => {
    it("has disabled button when form is invalid", async () => {
      const wrapper = await mountSuspended(Step3, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("buttonDisabled")).toBe(true);
    });

    it('has enabled button when sale form is valid', async () => {
      const validSaleDraft = {
        ...mockDraft,
        saleListing: { tenureType: 'freehold', chain: null, priceType: 'offers-over' },
        price: 250000,
      };
      const wrapper = await mountSuspended(Step3, { props: { draft: validSaleDraft } });
      const stepLayout = wrapper.findComponent({ name: 'EditListingStepsStepLayout' });
      expect(stepLayout.props('buttonDisabled')).toBe(false);
    });
  });

  describe('Event Emissions', () => {
    it('emits updateStepData when form is submitted', async () => {
      const validDraft = {
        ...mockDraft,
        completedSteps: [1, 2], // Steps 1-2 completed, but not Step 3
        price: 250000, // Price at root level
        saleListing: { tenureType: 'freehold', chain: null, priceType: 'offers-over' },
      };
      const wrapper = await mountSuspended(Step3, { props: { draft: validDraft } });
      const stepLayout = wrapper.findComponent({ name: 'EditListingStepsStepLayout' });
      await stepLayout.vm.$emit('submit');
      expect(wrapper.emitted()).toHaveProperty('updateStepData');
    });

    it("emits previousStep when previous button is clicked", async () => {
      const wrapper = await mountSuspended(Step3, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      await stepLayout.vm.$emit("previous");
      expect(wrapper.emitted()).toHaveProperty("previousStep");
    });
  });

  describe("StepLayout Integration", () => {
    it("passes showPrevious prop to StepLayout", async () => {
      const wrapper = await mountSuspended(Step3, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("showPrevious")).toBe(true);
    });
  });
});
