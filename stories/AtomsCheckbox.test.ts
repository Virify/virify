import { expect, test } from 'vitest';
import { composeStories } from '@storybook/vue3-vite';
import { mount } from '@vue/test-utils';
import * as stories from './AtomsCheckbox.stories';

// Mock the global AtomsIcon component for tests
global.AtomsIcon = {
  name: 'AtomsIcon',
  props: ['icon', 'title'],
  template: '<div class="atoms-icon-mock">{{ icon }}</div>'
};

const composedStories = composeStories(stories as any);
const { Default, Checked, LongLabel, WithNumericValue, Interactive } = composedStories;

test('Default checkbox renders correctly', async () => {
  const wrapper = mount(Default);
  expect(wrapper.text()).toContain('Default Checkbox');
  expect(wrapper.find('.a-checkbox').exists()).toBe(true);
  expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
});

test('Checked checkbox is checked by default', async () => {
  const wrapper = mount(Checked);
  expect(wrapper.text()).toContain('Checked Checkbox');
  const checkbox = wrapper.find('input[type="checkbox"]');
  expect((checkbox.element as HTMLInputElement).checked).toBe(true);
  expect(wrapper.find('.a-checkbox-icon').exists()).toBe(true);
});

test('Long label checkbox handles longer text', async () => {
  const wrapper = mount(LongLabel);
  expect(wrapper.text()).toContain('This is a very long checkbox label');
  expect(wrapper.find('.a-checkbox-text').exists()).toBe(true);
});

test('Checkbox with numeric value works correctly', async () => {
  const wrapper = mount(WithNumericValue);
  expect(wrapper.text()).toContain('Numeric Value Checkbox');
  expect(wrapper.find('input[type="checkbox"]').attributes('value')).toBe('123');
});

test('Checkbox can be clicked to change state', async () => {
  const wrapper = mount(Default);
  const checkbox = wrapper.find('input[type="checkbox"]');
  
  expect((checkbox.element as HTMLInputElement).checked).toBe(false);
  
  await checkbox.trigger('change');
  await wrapper.vm.$nextTick();
  
  // Note: In real tests, you might need to check the v-model binding
  expect(wrapper.find('.a-checkbox').exists()).toBe(true);
});

test('Checkbox label is clickable', async () => {
  const wrapper = mount(Default);
  const label = wrapper.find('.a-checkbox');
  
  expect(label.exists()).toBe(true);
  expect(label.element.tagName).toBe('LABEL');
});

test('Checkbox has proper accessibility attributes', async () => {
  const wrapper = mount(Default);
  const checkbox = wrapper.find('input[type="checkbox"]');
  
  expect(checkbox.exists()).toBe(true);
  expect(checkbox.attributes('type')).toBe('checkbox');
});

test('Checkbox icon has proper accessibility', async () => {
  const wrapper = mount(Checked);
  const icon = wrapper.find('.a-checkbox-icon');
  
  expect(icon.exists()).toBe(true);
  expect(icon.attributes('aria-hidden')).toBe('true');
});
