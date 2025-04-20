<template>
  <div class="page-storybook | container flow flow-2xl">
    <h1 class="| title-xl">Demo Page</h1>

    <p>This page is a demo page to test different components visually...</p>

    <h2 class="| title-md">Buttons</h2>

    <div class="page-storybook-buttons">
      <button class="| button">Button (Default)</button>
      <button class="| button button-secondary">Button (Secondary)</button>
      <button class="| button button-ghost">Button (Ghost)</button>
      <button class="| button button-quiet">Button (Quiet)</button>
      <button class="| button button-overlay">Button (Overlay)</button>
      <button class="| button button-bordered">Button (Bordered)</button>
      <button class="| button button-monochrome">Button (Monochrome)</button>
    </div>

    <h2 class="| title-md">Icon Button</h2>

    <div class="page-storybook-buttons">
      <button class="| button">
        <AtomsIcon title="Profile icon" icon="profile" />
        Icon before
      </button>

      <button class="| button">
        Icon after
        <AtomsIcon title="Profile icon" icon="arrow-right" />
      </button>
    </div>

    <h2 class="| title-md">Button Sizes</h2>

    <div class="page-storybook-buttons">
      <button class="| button button-xs">Primary Button (xs)</button>
      <button class="| button button-sm">Primary Button (sm)</button>
      <button class="| button">Primary Button (md)</button>
      <button class="| button button-lg">Primary Button (lg)</button>
    </div>
  </div>
</template>

<style>
.page-storybook-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-12);
  align-items: center;
}
</style>