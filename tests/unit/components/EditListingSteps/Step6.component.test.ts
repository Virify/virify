import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Step6 from "../../../../app/components/EditListingSteps/Step6.vue";

describe("Step6 Component", () => {
  let mockDraft: any;

  beforeEach(() => {
    mockDraft = {
      id: "test-draft-id",
      userId: "test-user-id",
      property: {
        type: { id: 1 },
        classification: { id: 1 },
        description: "Test",
        totalFloors: 2,
        bedroomFeatures: [{ floor: 1 }],
      },
      saleListing: { tenureType: "freehold", priceType: "offers-over", price: 250000 },
      rentalListing: null,
      address: { propertyNumber: "123", street: "Main St", city: "London", postcode: "SW1A 1AA", latitude: 51.5, longitude: -0.1 },
      rooms: [],
      amenities: [],
      images: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      highestCompletedStep: 4,
    };
  });

  describe("Component Rendering", () => {
    it("renders the component with correct title", async () => {
      const wrapper = await mountSuspended(Step6, { props: { draft: mockDraft } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain("Kitchens, Receptions & Other Rooms");
    });

    it("renders kitchens section", async () => {
      const wrapper = await mountSuspended(Step6, { props: { draft: mockDraft } });
      expect(wrapper.text()).toContain("Kitchens");
    });

    it("renders receptions section", async () => {
      const wrapper = await mountSuspended(Step6, { props: { draft: mockDraft } });
      expect(wrapper.text()).toContain("Receptions");
    });

    it("renders other rooms section", async () => {
      const wrapper = await mountSuspended(Step6, { props: { draft: mockDraft } });
      expect(wrapper.text()).toContain("Other Rooms");
    });
  });

  describe("Button State", () => {
    it("has button state controlled by StepLayout", async () => {
      const wrapper = await mountSuspended(Step6, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("buttonDisabled")).toBeDefined();
    });
  });

  describe("Event Emissions", () => {
    it("emits updateStepData when form is submitted", async () => {
      const validDraft = {
        ...mockDraft,
        completedSteps: [1, 2, 3, 4, 5], // Steps 1-5 completed, but not Step 6
        // Step 6 is optional (rooms), so empty data is valid
      };
      const wrapper = await mountSuspended(Step6, { props: { draft: validDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      await stepLayout.vm.$emit("submit");
      expect(wrapper.emitted()).toHaveProperty("updateStepData");
    });

    it("emits previousStep when previous button is clicked", async () => {
      const wrapper = await mountSuspended(Step6, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      await stepLayout.vm.$emit("previous");
      expect(wrapper.emitted()).toHaveProperty("previousStep");
    });
  });

  describe("StepLayout Integration", () => {
    it("passes showPrevious prop to StepLayout", async () => {
      const wrapper = await mountSuspended(Step6, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("showPrevious")).toBe(true);
    });
  });
});
