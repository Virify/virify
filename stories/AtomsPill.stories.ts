import type { StoryObj } from '@storybook/vue3';
import AtomsPill from '../app/components/atoms/AtomsPill.vue';

const meta = {
  title: 'Atoms/Pill',
  component: AtomsPill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { AtomsPill },
    template: '<AtomsPill>Default Pill</AtomsPill>',
  }),
};

export const Primary: Story = {
  render: () => ({
    components: { AtomsPill },
    template: '<AtomsPill style="background: var(--primary-400); color: var(--monochrome-100);">Primary Pill</AtomsPill>',
  }),
};

export const Secondary: Story = {
  render: () => ({
    components: { AtomsPill },
    template: '<AtomsPill style="background: var(--secondary-400); color: var(--monochrome-900);">Secondary Pill</AtomsPill>',
  }),
};

export const Tertiary: Story = {
  render: () => ({
    components: { AtomsPill },
    template: '<AtomsPill style="background: var(--tertiary-700); color: var(--monochrome-100);">Tertiary Pill</AtomsPill>',
  }),
};

export const Blue: Story = {
  render: () => ({
    components: { AtomsPill },
    template: '<AtomsPill style="background: var(--blue-400); color: var(--monochrome-900);">Blue Pill</AtomsPill>',
  }),
};

export const Error: Story = {
  render: () => ({
    components: { AtomsPill },
    template: '<AtomsPill style="background: var(--error-background); color: var(--error-foreground);">Error Pill</AtomsPill>',
  }),
};

export const LongText: Story = {
  render: () => ({
    components: { AtomsPill },
    template: '<AtomsPill style="max-width: 200px;">This is a pill with much longer text to show how it handles wrapping</AtomsPill>',
  }),
};

export const WithIcon: Story = {
  render: () => ({
    components: { AtomsPill },
    template: `
      <AtomsPill>
        <span style="display: flex; align-items: center; gap: 4px;">
          <span style="width: 8px; height: 8px; background: currentColor; border-radius: 50%;"></span>
          Pill with Icon
        </span>
      </AtomsPill>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: { AtomsPill },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; max-width: 600px;">
        <AtomsPill>Default</AtomsPill>
        <AtomsPill style="background: var(--primary-400); color: var(--monochrome-100);">Primary</AtomsPill>
        <AtomsPill style="background: var(--secondary-400); color: var(--monochrome-900);">Secondary</AtomsPill>
        <AtomsPill style="background: var(--tertiary-700); color: var(--monochrome-100);">Tertiary</AtomsPill>
        <AtomsPill style="background: var(--blue-400); color: var(--monochrome-900);">Blue</AtomsPill>
        <AtomsPill style="background: var(--error-background); color: var(--error-foreground);">Error</AtomsPill>
        <AtomsPill style="background: var(--favourite-colour); color: var(--monochrome-900);">Favourite</AtomsPill>
      </div>
    `,
  }),
};

export const RealWorldExample: Story = {
  render: () => ({
    components: { AtomsPill },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; max-width: 400px;">
        <AtomsPill style="background: var(--blue-400); color: var(--monochrome-900);">Construction Type: Brick</AtomsPill>
        <AtomsPill style="background: var(--primary-400); color: var(--monochrome-100);">Chain Free</AtomsPill>
        <AtomsPill style="background: var(--secondary-400); color: var(--monochrome-900);">Built in 1950</AtomsPill>
        <AtomsPill style="background: var(--tertiary-700); color: var(--monochrome-100);">1,200 sq ft</AtomsPill>
        <AtomsPill style="background: var(--error-background); color: var(--error-foreground);">Reduced Price</AtomsPill>
      </div>
    `,
  }),
};
