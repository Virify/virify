import type { StoryObj } from '@storybook/vue3';
import { ref, computed } from 'vue';
import AtomsCheckbox from '../app/components/atoms/AtomsCheckbox.vue';

const meta = {
  title: 'Atoms/Checkbox',
  component: AtomsCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'The text label for the checkbox'
    },
    value: {
      control: { type: 'text' },
      description: 'The value of the checkbox when checked'
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked by default'
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default Checkbox',
    value: 'default',
    checked: false,
  },
  render: (args) => ({
    components: { AtomsCheckbox },
    setup() {
      const modelValue = ref(args.checked);
      return { args, modelValue };
    },
    template: '<AtomsCheckbox v-model="modelValue" :label="args.label" :value="args.value" />',
  }),
};

export const Checked: Story = {
  args: {
    label: 'Checked Checkbox',
    value: 'checked',
    checked: true,
  },
  render: (args) => ({
    components: { AtomsCheckbox },
    setup() {
      const modelValue = ref(args.checked);
      return { args, modelValue };
    },
    template: '<AtomsCheckbox v-model="modelValue" :label="args.label" :value="args.value" />',
  }),
};

export const LongLabel: Story = {
  args: {
    label: 'This is a very long checkbox label that might wrap to multiple lines to show how the component handles longer text content',
    value: 'long-label',
    checked: false,
  },
  render: (args) => ({
    components: { AtomsCheckbox },
    setup() {
      const modelValue = ref(args.checked);
      return { args, modelValue };
    },
    template: '<AtomsCheckbox v-model="modelValue" :label="args.label" :value="args.value" style="max-width: 300px;" />',
  }),
};

export const WithNumericValue: Story = {
  args: {
    label: 'Numeric Value Checkbox',
    value: 123,
    checked: false,
  },
  render: (args) => ({
    components: { AtomsCheckbox },
    setup() {
      const modelValue = ref(args.checked);
      return { args, modelValue };
    },
    template: '<AtomsCheckbox v-model="modelValue" :label="args.label" :value="args.value" />',
  }),
};

export const Interactive: Story = {
  args: {
    label: 'Interactive Checkbox',
    value: 'interactive',
    checked: false,
  },
  render: (args) => ({
    components: { AtomsCheckbox },
    setup() {
      const modelValue = ref(args.checked);
      const handleChange = () => {
        console.log('Checkbox changed:', modelValue.value);
      };
      return { args, modelValue, handleChange };
    },
    template: `
      <div>
        <AtomsCheckbox 
          v-model="modelValue" 
          :label="args.label" 
          :value="args.value" 
          @change="handleChange"
        />
        <p style="margin-top: 16px; font-size: 14px; color: #666;">
          Current value: {{ modelValue ? 'checked' : 'unchecked' }}
        </p>
      </div>
    `,
  }),
};

export const MultipleCheckboxes: Story = {
  args: {
    label: 'Multiple Checkboxes Example',
  },
  render: () => ({
    components: { AtomsCheckbox },
    setup() {
      const preferences = ref({
        notifications: false,
        newsletter: true,
        updates: false,
        marketing: false,
      });
      return { preferences };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600;">User Preferences</h3>
        <AtomsCheckbox v-model="preferences.notifications" label="Email Notifications" value="notifications" />
        <AtomsCheckbox v-model="preferences.newsletter" label="Weekly Newsletter" value="newsletter" />
        <AtomsCheckbox v-model="preferences.updates" label="Product Updates" value="updates" />
        <AtomsCheckbox v-model="preferences.marketing" label="Marketing Communications" value="marketing" />
        
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 8px; font-size: 12px;">
          <strong>Selected:</strong> {{ Object.entries(preferences).filter(([k, v]) => v).map(([k]) => k).join(', ') || 'None' }}
        </div>
      </div>
    `,
  }),
};

export const FormExample: Story = {
  args: {
    label: 'Form Example',
  },
  render: () => ({
    components: { AtomsCheckbox },
    setup() {
      const formData = ref({
        terms: false,
        privacy: false,
        marketing: false,
      });
      
      const isFormValid = computed(() => formData.value.terms && formData.value.privacy);
      
      return { formData, isFormValid };
    },
    template: `
      <div style="max-width: 400px;">
        <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Registration Form</h3>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <AtomsCheckbox 
            v-model="formData.terms" 
            label="I agree to the Terms and Conditions" 
            value="terms" 
          />
          <AtomsCheckbox 
            v-model="formData.privacy" 
            label="I agree to the Privacy Policy" 
            value="privacy" 
          />
          <AtomsCheckbox 
            v-model="formData.marketing" 
            label="I want to receive marketing communications" 
            value="marketing" 
          />
        </div>
        
        <button 
          style="
            margin-top: 20px; 
            padding: 10px 20px; 
            background: var(--primary-400); 
            color: var(--monochrome-100); 
            border: none; 
            border-radius: 6px; 
            cursor: pointer;
            opacity: 0.5;
          "
          :style="{ opacity: isFormValid ? 1 : 0.5 }"
          :disabled="!isFormValid"
        >
          Submit Registration
        </button>
        
        <div style="margin-top: 12px; font-size: 12px; color: #666;">
          Form valid: {{ isFormValid ? 'Yes' : 'No' }}
        </div>
      </div>
    `,
  }),
};

export const Playground: Story = {
  args: {
    label: 'Edit this checkbox',
    value: 'playground',
    checked: false,
  },
  render: (args) => ({
    components: { AtomsCheckbox },
    setup() {
      const modelValue = ref(args.checked);
      return { args, modelValue };
    },
    template: '<AtomsCheckbox v-model="modelValue" :label="args.label" :value="args.value" />',
  }),
};
