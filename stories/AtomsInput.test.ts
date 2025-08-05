import { expect, test } from 'vitest';
import { composeStories } from '@storybook/vue3-vite';
import { mount } from '@vue/test-utils';
import * as stories from './AtomsInput.stories';

const composedStories = composeStories(stories as any);
const { Default, Email, Password, Number, Disabled, WithPrefixSlot, WithSuffixSlot } = composedStories;

test('Default input renders correctly', async () => {
  const wrapper = mount(Default);
  expect(wrapper.find('.a-input').exists()).toBe(true);
  expect(wrapper.find('input.text-input').exists()).toBe(true);
  expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text...');
});

test('Email input has correct type', async () => {
  const wrapper = mount(Email);
  expect(wrapper.find('input').attributes('type')).toBe('email');
  expect(wrapper.find('input').attributes('required')).toBeDefined();
});

test('Password input has correct type', async () => {
  const wrapper = mount(Password);
  expect(wrapper.find('input').attributes('type')).toBe('password');
  expect(wrapper.find('input').attributes('required')).toBeDefined();
});

test('Number input has correct type and attributes', async () => {
  const wrapper = mount(Number);
  expect(wrapper.find('input').attributes('type')).toBe('number');
  expect(wrapper.find('input').attributes('min')).toBe('0');
  expect(wrapper.find('input').attributes('max')).toBe('100');
});

test('Disabled input is properly disabled', async () => {
  const wrapper = mount(Disabled);
  expect(wrapper.find('input').attributes('disabled')).toBeDefined();
});

test('Input with prefix slot renders prefix content', async () => {
  const wrapper = mount(WithPrefixSlot);
  expect(wrapper.find('.a-input').exists()).toBe(true);
  expect(wrapper.text()).toContain('🔍');
});

test('Input with suffix slot renders suffix content', async () => {
  const wrapper = mount(WithSuffixSlot);
  expect(wrapper.find('.a-input').exists()).toBe(true);
  expect(wrapper.text()).toContain('£');
});

test('Input can receive focus', async () => {
  const wrapper = mount(Default);
  const input = wrapper.find('input');
  
  await input.trigger('focus');
  expect(document.activeElement).toBe(input.element);
});

test('Input can be typed in', async () => {
  const wrapper = mount(Default);
  const input = wrapper.find('input');
  
  await input.setValue('Hello World');
  expect((input.element as HTMLInputElement).value).toBe('Hello World');
});

test('Input wrapper has proper role', async () => {
  const wrapper = mount(Default);
  expect(wrapper.find('.a-input').attributes('role')).toBe('presentation');
});
