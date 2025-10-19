import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Step5 from "../../../../app/components/EditListingSteps/Step5.vue";

describe("Step5 Component", () => {
  let mockDraft: any;

  beforeEach(() => {
    mockDraft = {
      id: "test-draft-id",
      userId: "test-user-id",
      property: { type: { id: 1 }, classification: { id: 1 }, description: "Test", totalFloors: 2 },
      saleListing: { tenureType: "freehold", priceType: "offers-over", price: 250000 },
      rentalListing: null,
      address: { propertyNumber: "123", street: "Main St", city: "London", postcode: "SW1A 1AA", latitude: 51.5, longitude: -0.1 },
      rooms: [],
      amenities: [],
      images: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      highestCompletedStep: 3,
    };
  });

  describe("Component Rendering", () => {
    it("renders the component with correct title", async () => {
      const wrapper = await mountSuspended(Step5, { props: { draft: mockDraft } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain("Bedrooms & Bathrooms");
    });

    it("renders bedrooms section", async () => {
      const wrapper = await mountSuspended(Step5, { props: { draft: mockDraft } });
      expect(wrapper.text()).toContain("Bedrooms");
    });

    it("renders bathrooms section", async () => {
      const wrapper = await mountSuspended(Step5, { props: { draft: mockDraft } });
      expect(wrapper.text()).toContain("Bathrooms");
    });
  });

  describe('Button State', () => {
    it('button is enabled when no rooms (optional step)', async () => {
      const wrapper = await mountSuspended(Step5, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: 'EditListingStepsStepLayout' });
      // Step5 validation: rooms are optional, so empty is valid
      expect(stepLayout.props('buttonDisabled')).toBe(false);
    });

    it('button is enabled when at least one complete room is added', async () => {
      const validDraft = {
        ...mockDraft,
        property: {
          ...mockDraft.property,
          bedroomFeatures: [{
            name: 'Main Bedroom',
            roomNumber: 1,
            floor: 1,
            bed: ['double']
          }],
          bathroomFeatures: [],
        },
      };
      const wrapper = await mountSuspended(Step5, { props: { draft: validDraft } });
      const stepLayout = wrapper.findComponent({ name: 'EditListingStepsStepLayout' });
      expect(stepLayout.props('buttonDisabled')).toBe(false);
    });
  });

  describe('Event Emissions', () => {
    it('emits updateStepData when form is submitted', async () => {
      const validDraft = {
        ...mockDraft,
        property: {
          ...mockDraft.property,
          bedroomFeatures: [{
            name: 'Main Bedroom',
            roomNumber: 1,
            floor: 1,
            bed: ['double']
          }],
        },
      };
      const wrapper = await mountSuspended(Step5, { props: { draft: validDraft } });
      const stepLayout = wrapper.findComponent({ name: 'EditListingStepsStepLayout' });
      await stepLayout.vm.$emit('submit');
      expect(wrapper.emitted()).toHaveProperty('updateStepData');
    });

    it("emits previousStep when previous button is clicked", async () => {
      const wrapper = await mountSuspended(Step5, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      await stepLayout.vm.$emit("previous");
      expect(wrapper.emitted()).toHaveProperty("previousStep");
    });
  });

  describe("StepLayout Integration", () => {
    it("passes showPrevious prop to StepLayout", async () => {
      const wrapper = await mountSuspended(Step5, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("showPrevious")).toBe(true);
    });
  });
});
