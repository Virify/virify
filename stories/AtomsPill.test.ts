import { expect, test } from 'vitest';
import { composeStories } from '@storybook/vue3-vite';
import { mount } from '@vue/test-utils';
import * as stories from './AtomsPill.stories';

const composedStories = composeStories(stories as any);
const { Default, Primary, Secondary, Blue, Error, LongText, WithIcon } = composedStories;

test('Default pill renders correctly', async () => {
  const wrapper = mount(Default);
  expect(wrapper.text()).toContain('Default Pill');
  expect(wrapper.find('.a-pill').exists()).toBe(true);
});

test('Primary pill has correct styling', async () => {
  const wrapper = mount(Primary);
  expect(wrapper.text()).toContain('Primary Pill');
  expect(wrapper.find('.a-pill').exists()).toBe(true);
  // Check if style attribute contains the primary color
  expect(wrapper.find('.a-pill').attributes('style')).toContain('var(--primary-400)');
});

test('Secondary pill has correct styling', async () => {
  const wrapper = mount(Secondary);
  expect(wrapper.text()).toContain('Secondary Pill');
  expect(wrapper.find('.a-pill').exists()).toBe(true);
  expect(wrapper.find('.a-pill').attributes('style')).toContain('var(--secondary-400)');
});

test('Blue pill has correct styling', async () => {
  const wrapper = mount(Blue);
  expect(wrapper.text()).toContain('Blue Pill');
  expect(wrapper.find('.a-pill').exists()).toBe(true);
  expect(wrapper.find('.a-pill').attributes('style')).toContain('var(--blue-400)');
});

test('Error pill has correct styling', async () => {
  const wrapper = mount(Error);
  expect(wrapper.text()).toContain('Error Pill');
  expect(wrapper.find('.a-pill').exists()).toBe(true);
  expect(wrapper.find('.a-pill').attributes('style')).toContain('var(--error-background)');
});

test('Long text pill renders with max-width constraint', async () => {
  const wrapper = mount(LongText);
  expect(wrapper.text()).toContain('This is a pill with much longer text');
  expect(wrapper.find('.a-pill').exists()).toBe(true);
  expect(wrapper.find('.a-pill').attributes('style')).toContain('max-width: 200px');
});

test('Pill with icon renders correctly', async () => {
  const wrapper = mount(WithIcon);
  expect(wrapper.text()).toContain('Pill with Icon');
  expect(wrapper.find('.a-pill').exists()).toBe(true);
  // Check that the icon span exists
  expect(wrapper.find('span span').exists()).toBe(true);
});

test('Pill accepts slot content', async () => {
  const wrapper = mount(Default);
  expect(wrapper.find('.a-pill').exists()).toBe(true);
  expect(wrapper.text()).toBeTruthy();
});
