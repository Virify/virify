import type { StoryObj } from '@storybook/vue3';
import AtomsButton from '../app/components/atoms/AtomsButton.vue';

const meta = {
  title: 'Atoms/Button',
  component: AtomsButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    pending: {
      control: { type: 'boolean' },
      description: 'Shows loading state with animated dots'
    },
    size: {
      control: { type: 'select' },
      options: ['', 'button-xs', 'button-sm', 'button-lg'],
      description: 'Button size'
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pending: false,
    size: '',
  } as any,
  render: (args) => ({
    components: { AtomsButton },
    template: '<AtomsButton :pending="args.pending" :class="args.size">Default Button</AtomsButton>',
    data() {
      return { args };
    }
  }),
};

export const Secondary: Story = {
  args: {
    pending: false,
    size: '',
  } as any,
  render: (args) => ({
    components: { AtomsButton },
    template: '<AtomsButton :pending="args.pending" :class="[\'button-secondary\', args.size]">Secondary Button</AtomsButton>',
    data() {
      return { args };
    }
  }),
};

export const Tertiary: Story = {
  args: {
    pending: false,
    size: '',
  } as any,
  render: (args) => ({
    components: { AtomsButton },
    template: '<AtomsButton :pending="args.pending" :class="[\'button-tertiary\', args.size]">Tertiary Button</AtomsButton>',
    data() {
      return { args };
    }
  }),
};

export const Ghost: Story = {
  args: {
    pending: false,
    size: '',
  } as any,
  render: (args) => ({
    components: { AtomsButton },
    template: '<AtomsButton :pending="args.pending" :class="[\'button-ghost\', args.size]">Ghost Button</AtomsButton>',
    data() {
      return { args };
    }
  }),
};

export const Pending: Story = {
  args: {
    pending: true,
  },
  render: (args) => ({
    components: { AtomsButton },
    template: '<AtomsButton :pending="args.pending">Loading...</AtomsButton>',
    data() {
      return { args };
    }
  }),
};

export const Disabled: Story = {
  args: {
    pending: false,
  },
  render: () => ({
    components: { AtomsButton },
    template: '<AtomsButton :pending="false" disabled>Disabled</AtomsButton>',
  }),
};

export const SmallButton: Story = {
  args: {
    pending: false,
    size: '',
  } as any,
  render: (args) => ({
    components: { AtomsButton },
    template: '<AtomsButton :pending="args.pending" :class="[\'button-sm\', args.size]">Small Button</AtomsButton>',
    data() {
      return { args };
    }
  }),
};

export const LargeButton: Story = {
  args: {
    pending: false,
    size: '',
  } as any,
  render: (args) => ({
    components: { AtomsButton },
    template: '<AtomsButton :pending="args.pending" :class="[\'button-lg\', args.size]">Large Button</AtomsButton>',
    data() {
      return { args };
    }
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: { AtomsButton },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; max-width: 800px;">
        <AtomsButton :pending="false">Default</AtomsButton>
        <AtomsButton :pending="false" class="button-secondary">Secondary</AtomsButton>
        <AtomsButton :pending="false" class="button-tertiary">Tertiary</AtomsButton>
        <AtomsButton :pending="false" class="button-ghost">Ghost</AtomsButton>
        <AtomsButton :pending="false" class="button-quiet">Quiet</AtomsButton>
        <AtomsButton :pending="false" class="button-bordered">Bordered</AtomsButton>
        <AtomsButton :pending="false" class="button-delete">Delete</AtomsButton>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { AtomsButton },
    template: `
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <AtomsButton :pending="false" class="button-xs">Extra Small</AtomsButton>
        <AtomsButton :pending="false" class="button-sm">Small</AtomsButton>
        <AtomsButton :pending="false">Default</AtomsButton>
        <AtomsButton :pending="false" class="button-lg">Large</AtomsButton>
      </div>
    `,
  }),
};