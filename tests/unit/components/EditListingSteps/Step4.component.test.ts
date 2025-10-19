import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Step4 from "../../../../app/components/EditListingSteps/Step4.vue";

describe("Step4 Component", () => {
  let mockDraft: any;

  beforeEach(() => {
    mockDraft = {
      id: "test-draft-id",
      userId: "test-user-id",
      property: { type: { id: 1 }, classification: { id: 1 }, description: "Test", totalFloors: 1 },
      saleListing: { tenureType: "freehold", priceType: "offers-over", price: 250000 },
      rentalListing: null,
      address: null,
      rooms: [],
      amenities: [],
      images: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      highestCompletedStep: 2,
    };
  });

  describe("Component Rendering", () => {
    it("renders the component with correct title", async () => {
      const wrapper = await mountSuspended(Step4, { props: { draft: mockDraft } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain("Address");
    });

    it('renders address input fields', async () => {
      const wrapper = await mountSuspended(Step4, { props: { draft: mockDraft } });
      const inputs = wrapper.findAllComponents({ name: 'OrganismsDraftFormTextGroup' });
      const titles = inputs.map(i => i.props('title'));
      expect(titles).toContain('Property Number');
      expect(titles).toContain('Street Name');
      expect(titles).toContain('City');
      expect(titles).toContain('Postcode');
    });
  });

  describe('Button State', () => {
    it('has disabled button when form is invalid', async () => {
      const wrapper = await mountSuspended(Step4, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: 'EditListingStepsStepLayout' });
      expect(stepLayout.props('buttonDisabled')).toBe(true);
    });

    it('has enabled button when form is valid', async () => {
      const validDraft = {
        ...mockDraft,
        address: {
          propertyNumber: '123',
          street: 'Main St',
          city: 'London',
          postcode: 'SW1A 1AA',
          country: 'United Kingdom',
          latitude: 51.5,
          longitude: -0.1,
        },
        property: {
          ...mockDraft.property,
          address: {
            number: '123',
            street: 'Main St',
            city: 'London',
            postcode: 'SW1A 1AA',
            country: 'United Kingdom',
            lat: 51.5,
            lon: -0.1,
          },
        },
      };
      const wrapper = await mountSuspended(Step4, { props: { draft: validDraft } });
      const stepLayout = wrapper.findComponent({ name: 'EditListingStepsStepLayout' });
      expect(stepLayout.props('buttonDisabled')).toBe(false);
    });
  });

  describe('Event Emissions', () => {
    it('emits updateStepData when form is submitted', async () => {
      const validDraft = {
        ...mockDraft,
        address: {
          propertyNumber: '123',
          street: 'Main St',
          city: 'London',
          postcode: 'SW1A 1AA',
          country: 'United Kingdom',
          latitude: 51.5,
          longitude: -0.1,
        },
        property: {
          ...mockDraft.property,
          address: {
            number: '123',
            street: 'Main St',
            city: 'London',
            postcode: 'SW1A 1AA',
            country: 'United Kingdom',
            lat: 51.5,
            lon: -0.1,
          },
        },
      };
      const wrapper = await mountSuspended(Step4, { props: { draft: validDraft } });
      const stepLayout = wrapper.findComponent({ name: 'EditListingStepsStepLayout' });
      await stepLayout.vm.$emit('submit');
      expect(wrapper.emitted()).toHaveProperty('updateStepData');
    });

    it("emits previousStep when previous button is clicked", async () => {
      const wrapper = await mountSuspended(Step4, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      await stepLayout.vm.$emit("previous");
      expect(wrapper.emitted()).toHaveProperty("previousStep");
    });
  });

  describe("StepLayout Integration", () => {
    it("passes showPrevious prop to StepLayout", async () => {
      const wrapper = await mountSuspended(Step4, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("showPrevious")).toBe(true);
    });
  });
});
