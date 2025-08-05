import { expect, test } from 'vitest';
import { composeStories } from '@storybook/vue3-vite';
import { mount } from '@vue/test-utils';
import * as stories from './AtomsButton.stories';

const composedStories = composeStories(stories as any);
const { Default, Secondary, Pending, Disabled } = composedStories;

test('Default button renders correctly', async () => {
  const wrapper = mount(Default);
  expect(wrapper.text()).toContain('Default Button');
  expect(wrapper.find('button').exists()).toBe(true);
});

test('Secondary button has correct class', async () => {
  const wrapper = mount(Secondary);
  expect(wrapper.text()).toContain('Secondary Button');
  expect(wrapper.find('button').classes()).toContain('button-secondary');
});

test('Pending button shows loading state', async () => {
  const wrapper = mount(Pending);
  expect(wrapper.text()).toContain('Loading...');
  expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  expect(wrapper.find('button').classes()).toContain('button-pending');
});

test('Disabled button is disabled', async () => {
  const wrapper = mount(Disabled);
  expect(wrapper.text()).toContain('Disabled');
  expect(wrapper.find('button').attributes('disabled')).toBeDefined();
});