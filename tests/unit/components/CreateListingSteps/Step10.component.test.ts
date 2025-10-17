import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Step10 from "../../../../app/components/CreateListingSteps/Step10.vue";

describe("Step10 Component", () => {
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
      highestCompletedStep: 8,
    };
  });

  describe("Component Rendering", () => {
    it("renders the component with correct title", async () => {
      const wrapper = await mountSuspended(Step10, { props: { draft: mockDraft } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain("Property Images");
    });

    it("renders upload images section", async () => {
      const wrapper = await mountSuspended(Step10, { props: { draft: mockDraft } });
      expect(wrapper.text()).toContain("Upload Images");
    });
  });

  describe('Button State', () => {
    it('has disabled button when no images are uploaded', async () => {
      const wrapper = await mountSuspended(Step10, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: 'CreateListingStepsStepLayout' });
      expect(stepLayout.props('buttonDisabled')).toBe(true);
    });

    it('has enabled button when images are uploaded', async () => {
      const draftWithImages = {
        ...mockDraft,
        property: {
          ...mockDraft.property,
          media: [{ image: 'test.jpg', metadata: null }],
        },
      };
      const wrapper = await mountSuspended(Step10, { props: { draft: draftWithImages } });
      const stepLayout = wrapper.findComponent({ name: 'CreateListingStepsStepLayout' });
      expect(stepLayout.props('buttonDisabled')).toBe(false);
    });
  });

  describe('Event Emissions', () => {
    it('emits updateStepData when form is submitted', async () => {
      const draftWithImages = {
        ...mockDraft,
        property: {
          ...mockDraft.property,
          media: [{ image: 'test.jpg', metadata: null }],
        },
      };
      const wrapper = await mountSuspended(Step10, { props: { draft: draftWithImages } });
      const stepLayout = wrapper.findComponent({ name: 'CreateListingStepsStepLayout' });
      await stepLayout.vm.$emit('submit');
      expect(wrapper.emitted()).toHaveProperty('updateStepData');
    });

    it("emits previousStep when previous button is clicked", async () => {
      const wrapper = await mountSuspended(Step10, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "CreateListingStepsStepLayout" });
      await stepLayout.vm.$emit("previous");
      expect(wrapper.emitted()).toHaveProperty("previousStep");
    });
  });

  describe("StepLayout Integration", () => {
    it("passes showPrevious prop to StepLayout", async () => {
      const wrapper = await mountSuspended(Step10, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "CreateListingStepsStepLayout" });
      expect(stepLayout.props("showPrevious")).toBe(true);
    });
  });
});
