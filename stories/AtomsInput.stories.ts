import type { StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import AtomsInput from '../app/components/atoms/AtomsInput.vue';

const meta = {
  title: 'Atoms/Input',
  component: AtomsInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    wrapperClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the wrapper'
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const value = ref('');
      return { value };
    },
    template: `
      <AtomsInput 
        v-model="value" 
        placeholder="Enter text..."
        type="text"
      />
    `,
  }),
};

export const Email: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const email = ref('');
      return { email };
    },
    template: `
      <AtomsInput 
        v-model="email" 
        placeholder="Enter your email..."
        type="email"
        required
      />
    `,
  }),
};

export const Password: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const password = ref('');
      return { password };
    },
    template: `
      <AtomsInput 
        v-model="password" 
        placeholder="Enter password..."
        type="password"
        required
      />
    `,
  }),
};

export const Number: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const numberValue = ref('');
      return { numberValue };
    },
    template: `
      <AtomsInput 
        v-model="numberValue" 
        placeholder="Enter a number..."
        type="number"
        min="0"
        max="100"
      />
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const value = ref('Some disabled value');
      return { value };
    },
    template: `
      <AtomsInput 
        v-model="value" 
        placeholder="This input is disabled"
        type="text"
        disabled
      />
    `,
  }),
};

export const WithPrefixSlot: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const searchValue = ref('');
      return { searchValue };
    },
    template: `
      <AtomsInput 
        v-model="searchValue" 
        placeholder="Search..."
        type="search"
      >
        <template #prefix>
          <span style="
            display: flex; 
            align-items: center; 
            padding: 0 12px; 
            background: #f0f0f0; 
            border-radius: 4px 0 0 4px;
            font-size: 14px;
          ">
            🔍
          </span>
        </template>
      </AtomsInput>
    `,
  }),
};

export const WithSuffixSlot: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const amount = ref('');
      return { amount };
    },
    template: `
      <AtomsInput 
        v-model="amount" 
        placeholder="Enter amount..."
        type="number"
      >
        <template #suffix>
          <span style="
            display: flex; 
            align-items: center; 
            padding: 0 12px; 
            background: #f0f0f0; 
            border-radius: 0 4px 4px 0;
            font-size: 14px;
            font-weight: 600;
          ">
            £
          </span>
        </template>
      </AtomsInput>
    `,
  }),
};

export const WithBothSlots: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const url = ref('');
      return { url };
    },
    template: `
      <AtomsInput 
        v-model="url" 
        placeholder="Enter website URL..."
        type="url"
      >
        <template #prefix>
          <span style="
            display: flex; 
            align-items: center; 
            padding: 0 8px; 
            background: #e0e0e0; 
            font-size: 12px;
            font-weight: 500;
          ">
            https://
          </span>
        </template>
        <template #suffix>
          <span style="
            display: flex; 
            align-items: center; 
            padding: 0 8px; 
            background: #e0e0e0; 
            font-size: 12px;
            color: #666;
          ">
            .com
          </span>
        </template>
      </AtomsInput>
    `,
  }),
};

export const WithCustomValidation: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const username = ref('');
      const customValidation = {
        minLength: 3,
        pattern: /^[a-zA-Z0-9_]+$/,
        customMessage: 'Username must be at least 3 characters and contain only letters, numbers, and underscores'
      };
      return { username, customValidation };
    },
    template: `
      <AtomsInput 
        v-model="username" 
        placeholder="Enter username (min 3 chars)..."
        type="text"
        required
        :custom-validation="customValidation"
      />
    `,
  }),
};

export const FormExample: Story = {
  render: () => ({
    components: { AtomsInput },
    setup() {
      const formData = ref({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
      return { formData };
    },
    template: `
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Contact Form</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <AtomsInput 
            v-model="formData.firstName" 
            placeholder="First name" 
            type="text"
            required
          />
          <AtomsInput 
            v-model="formData.lastName" 
            placeholder="Last name" 
            type="text"
            required
          />
        </div>
        
        <AtomsInput 
          v-model="formData.email" 
          placeholder="Email address" 
          type="email"
          required
        />
        
        <AtomsInput 
          v-model="formData.phone" 
          placeholder="Phone number" 
          type="tel"
        />
        
        <div style="margin-top: 8px; padding: 12px; background: #f8f9fa; border-radius: 6px; font-size: 12px;">
          <strong>Form Data:</strong><br>
          First Name: {{ formData.firstName }}<br>
          Last Name: {{ formData.lastName }}<br>
          Email: {{ formData.email }}<br>
          Phone: {{ formData.phone }}
        </div>
      </div>
    `,
  }),
};

export const Playground: Story = {
  args: {
    wrapperClass: '',
  },
  render: (args) => ({
    components: { AtomsInput },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: `
      <AtomsInput 
        v-model="value" 
        placeholder="Try typing here..."
        type="text"
        :wrapper-class="args.wrapperClass"
      />
    `,
  }),
};
