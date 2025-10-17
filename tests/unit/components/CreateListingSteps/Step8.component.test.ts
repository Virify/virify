import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Step8 from "../../../../app/components/CreateListingSteps/Step8.vue";

describe("Step8 Component", () => {
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
      highestCompletedStep: 6,
    };
  });

  describe("Component Rendering", () => {
    it("renders the component with correct title", async () => {
      const wrapper = await mountSuspended(Step8, { props: { draft: mockDraft } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain("Property Features");
    });

    it("renders additional features section", async () => {
      const wrapper = await mountSuspended(Step8, { props: { draft: mockDraft } });
      expect(wrapper.text()).toContain("Additional Features");
    });

    it("renders parking section", async () => {
      const wrapper = await mountSuspended(Step8, { props: { draft: mockDraft } });
      expect(wrapper.text()).toContain("Parking");
    });
  });

  describe("Button State", () => {
    it("has button state controlled by StepLayout", async () => {
      const wrapper = await mountSuspended(Step8, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "CreateListingStepsStepLayout" });
      expect(stepLayout.props("buttonDisabled")).toBeDefined();
    });
  });

  describe("Event Emissions", () => {
    it("emits updateStepData when form is submitted", async () => {
      const wrapper = await mountSuspended(Step8, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "CreateListingStepsStepLayout" });
      await stepLayout.vm.$emit("submit");
      expect(wrapper.emitted()).toHaveProperty("updateStepData");
    });

    it("emits previousStep when previous button is clicked", async () => {
      const wrapper = await mountSuspended(Step8, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "CreateListingStepsStepLayout" });
      await stepLayout.vm.$emit("previous");
      expect(wrapper.emitted()).toHaveProperty("previousStep");
    });
  });

  describe("StepLayout Integration", () => {
    it("passes showPrevious prop to StepLayout", async () => {
      const wrapper = await mountSuspended(Step8, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "CreateListingStepsStepLayout" });
      expect(stepLayout.props("showPrevious")).toBe(true);
    });
  });
});
