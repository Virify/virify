import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Step2 from "../../../../app/components/EditListingSteps/Step2.vue";

// Mock the step-two utils module to avoid top-level $fetch calls
vi.mock("~/utils/listing/step-two", () => ({
  propertyTypeSelectOptions: [
    { value: 1, key: "House", info: "House" },
    { value: 2, key: "Flat", info: "Flat" },
  ],
  getPropertyClassifications: vi.fn((typeId: number) => {
    if (typeId === 1) return [{ value: 1, key: "Detached", info: "Detached" }];
    if (typeId === 2) return [{ value: 2, key: "Studio", info: "Studio" }];
    return [];
  }),
  constructionOptions: [{ value: "standard", key: "Standard", info: "Property is of Construction: Standard" }],
  yearBuiltOptions: [
    { value: "0", key: "Select Year Built" },
    { value: 2024, key: "2024" },
  ],
  sizeOptions: [
    { value: "meter", key: "Square Meters" },
    { value: "feet", key: "Square Feet" },
  ],
  convertFeetToMeters: vi.fn((feet: number) => feet * 0.3048),
  createInitialStepTwoValues: vi.fn((draft: any) => ({
    property: {
      type: draft.property?.type?.id || null,
      classification: draft.property?.classification?.id || null,
      constructionType: draft.property?.constructionType || null,
      yearBuilt: draft.property?.yearBuilt || "0",
      size: draft.property?.size || null,
      description: draft.property?.description || null,
      totalFloors: draft.property?.totalFloors || 1,
    },
  })),
  stepTwoValidation: {
    isStepTwoValid: vi.fn((data: any) => !!(data.property.type && data.property.classification && data.property.description && data.property.totalFloors)),
    hasExistingStepTwoData: vi.fn((draft: any) => !!(draft.property?.type && draft.property?.classification && draft.property?.description && draft.property?.totalFloors)),
  },
}));

describe("Step2 Component", () => {
  let mockDraft: any;

  beforeEach(() => {
    mockDraft = {
      id: "test-draft-id",
      userId: "test-user-id",
      property: null,
      saleListing: null,
      rentalListing: null,
      address: null,
      rooms: [],
      amenities: [],
      images: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      highestCompletedStep: 0,
      completedSteps: [1], // Step 1 completed
    };
  });

  describe("Component Rendering", () => {
    it("renders the component with correct title and info", async () => {
      const wrapper = await mountSuspended(Step2, { props: { draft: mockDraft } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain("Property Basics");
      expect(wrapper.text()).toContain("Please provide the basic details about the property");
    });

    it("renders property type radio group", async () => {
      const wrapper = await mountSuspended(Step2, { props: { draft: mockDraft } });
      const radioGroups = wrapper.findAllComponents({ name: "OrganismsListingFormRadioGroup" });
      const titles = radioGroups.map((r) => r.props("title"));
      expect(titles).toContain("What type of property are you listing?");
    });

    it("shows classification field when property type is selected", async () => {
      const draftWithType = {
        ...mockDraft,
        property: {
          type: { id: 1, name: "House" },
          classification: null,
          description: null,
          totalFloors: 1,
        },
      };
      const wrapper = await mountSuspended(Step2, { props: { draft: draftWithType } });
      const radioGroups = wrapper.findAllComponents({ name: "OrganismsListingFormRadioGroup" });
      const titles = radioGroups.map((r) => r.props("title"));
      expect(titles).toContain("What is the classification of the property?");
    });

    it("renders description text field", async () => {
      const wrapper = await mountSuspended(Step2, { props: { draft: mockDraft } });
      const textGroups = wrapper.findAllComponents({ name: "OrganismsListingFormTextGroup" });
      const titles = textGroups.map((t) => t.props("title"));
      expect(titles).toContain("Please provide a short description of the property - your property features speak for themselves!");
    });

    it("renders total floors number field", async () => {
      const wrapper = await mountSuspended(Step2, { props: { draft: mockDraft } });
      const numberGroups = wrapper.findAllComponents({ name: "OrganismsListingFormNumberGroup" });
      const titles = numberGroups.map((n) => n.props("title"));
      expect(titles).toContain("How many total floors does the property have (including the ground floor)?");
    });
  });

  describe("Button State", () => {
    it("has disabled button when form is invalid (missing required fields)", async () => {
      const wrapper = await mountSuspended(Step2, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("buttonDisabled")).toBe(true);
    });

    it("has enabled button when form is valid", async () => {
      const validDraft = {
        ...mockDraft,
        property: {
          type: { id: 1, name: "House" },
          classification: { id: 1, key: "Detached" },
          description: "A beautiful property",
          totalFloors: 2,
          constructionType: null,
          yearBuilt: null,
          size: null,
        },
      };
      const wrapper = await mountSuspended(Step2, { props: { draft: validDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("buttonDisabled")).toBe(false);
    });
  });

  describe("Event Emissions", () => {
    it("emits updateStepData when form is submitted with valid data", async () => {
      const validDraft = {
        ...mockDraft,
        completedSteps: [1], // Step 1 completed, but not Step 2 - so needsCompletion = true for step 2
        property: {
          type: { id: 1, name: "House" },
          classification: { id: 1, key: "Detached" },
          description: "A beautiful property",
          totalFloors: 2,
        },
      };
      const wrapper = await mountSuspended(Step2, { props: { draft: validDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      await stepLayout.vm.$emit("submit");
      expect(wrapper.emitted()).toHaveProperty("updateStepData");
    });

    it("emits previousStep when previous button is clicked", async () => {
      const wrapper = await mountSuspended(Step2, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      await stepLayout.vm.$emit("previous");
      expect(wrapper.emitted()).toHaveProperty("previousStep");
    });
  });

  describe("Error Message Display", () => {
    it("displays error message when provided", async () => {
      const errorMessage = "Test error message";
      const wrapper = await mountSuspended(Step2, { props: { draft: mockDraft, errorMessage } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("errorMessage")).toBe(errorMessage);
    });

    it("does not display error message when not provided", async () => {
      const wrapper = await mountSuspended(Step2, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("errorMessage")).toBeUndefined();
    });
  });

  describe("StepLayout Integration", () => {
    it("passes showPrevious prop to StepLayout", async () => {
      const wrapper = await mountSuspended(Step2, { props: { draft: mockDraft } });
      const stepLayout = wrapper.findComponent({ name: "EditListingStepsStepLayout" });
      expect(stepLayout.props("showPrevious")).toBe(true);
    });
  });
});
