# UI Layer

## Overview
The UI layer provides a comprehensive design system and reusable component library for the Virify platform. It follows atomic design principles with atoms, molecules, and organisms, ensuring consistent user interface patterns throughout the application.

## Features
- 🎨 Atomic design system (atoms, molecules, organisms)
- 🎯 Consistent design tokens and styling
- ♿ Accessible components with ARIA support
- 📱 Responsive design patterns
- 🔧 Customizable component variants
- 🎪 Interactive component showcase
- 🎨 SCSS-based styling system
- ⚡ Performance-optimized components

## Directory Structure
```
layers/ui/
├── assets/                    # UI assets and styles
│   ├── scss/                  # SCSS stylesheets
│   │   ├── abstracts/         # Variables, mixins, functions
│   │   ├── base/              # Base styles and resets
│   │   ├── components/        # Component-specific styles
│   │   └── utilities/         # Utility classes
├── components/                # Reusable UI components
│   ├── atoms/                 # Basic building blocks
│   │   ├── AtomsButton.vue
│   │   ├── AtomsInput.vue
│   │   ├── AtomsIcon.vue
│   │   └── ...
│   ├── molecules/             # Combinations of atoms
│   │   ├── MoleculesCard.vue
│   │   ├── MoleculesForm.vue
│   │   └── ...
│   └── organisms/             # Complex UI sections
│       ├── OrganismsHeader.vue
│       ├── OrganismsNavigation.vue
│       └── ...
├── modules/                   # Nuxt modules for UI
├── utils/                     # UI utility functions
└── nuxt.config.ts            # Layer configuration
```

## Component Categories

### Atoms (Basic Building Blocks)
- **AtomsButton**: Primary, secondary, and utility buttons
- **AtomsInput**: Text inputs, email, password, search
- **AtomsIcon**: SVG icon system with size variants
- **AtomsText**: Typography components with semantic sizes
- **AtomsDivider**: Visual separators and spacers
- **AtomsImage**: Responsive image component
- **AtomsLink**: Navigation and external links

### Molecules (Component Combinations)
- **MoleculesCard**: Property cards, info cards, media cards
- **MoleculesForm**: Form groups and validation
- **MoleculesDropdown**: Select menus and dropdowns
- **MoleculesModal**: Dialog and popup components
- **MoleculesPagination**: Page navigation controls
- **MoleculesSearchBar**: Search input with suggestions
- **MoleculesTooltip**: Contextual help and information

### Organisms (Complex UI Sections)
- **OrganismsHeader**: Site header with navigation
- **OrganismsFooter**: Site footer with links
- **OrganismsPropertyGrid**: Property listing grid
- **OrganismsFilterPanel**: Advanced search filters
- **OrganismsUserProfile**: User profile sections
- **OrganismsChat**: Messaging interface components

## Design Tokens

### Colors
```scss
// Primary palette
$primary-50: #f0f9ff;
$primary-500: #3b82f6;
$primary-900: #1e3a8a;

// Semantic colors
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;
$info: #3b82f6;
```

### Typography
```scss
// Font sizes
$text-xs: 0.75rem;    // 12px
$text-sm: 0.875rem;   // 14px
$text-base: 1rem;     // 16px
$text-lg: 1.125rem;   // 18px
$text-xl: 1.25rem;    // 20px

// Font weights
$font-light: 300;
$font-normal: 400;
$font-medium: 500;
$font-semibold: 600;
$font-bold: 700;
```

### Spacing
```scss
// Spacing scale
$space-1: 0.25rem;    // 4px
$space-2: 0.5rem;     // 8px
$space-4: 1rem;       // 16px
$space-6: 1.5rem;     // 24px
$space-8: 2rem;       // 32px
```

## Usage Examples

### Basic Button Usage
```vue
<template>
  <AtomsButton 
    variant="primary"
    size="lg"
    :disabled="isLoading"
    @click="handleSubmit"
  >
    Submit Property
  </AtomsButton>
</template>
```

### Form Components
```vue
<template>
  <form @submit.prevent="onSubmit">
    <MoleculesFormGroup>
      <AtomsLabel for="property-title">Property Title</AtomsLabel>
      <AtomsInput
        id="property-title"
        v-model="form.title"
        type="text"
        placeholder="Enter property title"
        :error="errors.title"
        required
      />
      <AtomsFieldError>{{ errors.title }}</AtomsFieldError>
    </MoleculesFormGroup>
    
    <AtomsButton type="submit" variant="primary">
      Save Property
    </AtomsButton>
  </form>
</template>
```

### Card Components
```vue
<template>
  <MoleculesPropertyCard
    :property="property"
    :show-favorite="true"
    :show-notes="true"
    @favorite-toggle="handleFavorite"
    @note-click="openNotes"
  />
</template>
```

## Styling Architecture

### SCSS Organization
```scss
// abstracts/_variables.scss
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px
);

// base/_reset.scss
*,
*::before,
*::after {
  box-sizing: border-box;
}

// components/_button.scss
.button {
  @include button-base;
  
  &--primary {
    @include button-variant($primary-500, white);
  }
  
  &--secondary {
    @include button-variant(transparent, $gray-600);
  }
}
```

### Responsive Design
```scss
// Mobile-first approach
.component {
  padding: $space-4;
  
  @media (min-width: map-get($breakpoints, 'md')) {
    padding: $space-6;
  }
  
  @media (min-width: map-get($breakpoints, 'lg')) {
    padding: $space-8;
  }
}
```

## Accessibility Features

### ARIA Support
All components include proper ARIA attributes:
- `aria-label` for screen readers
- `aria-describedby` for error messages
- `aria-expanded` for collapsible content
- `role` attributes for semantic meaning

### Keyboard Navigation
- Tab order management
- Enter and Space key handlers
- Escape key for modals and dropdowns
- Arrow key navigation for lists

### Focus Management
- Visible focus indicators
- Focus trapping in modals
- Logical focus order
- Skip links for navigation

## Performance Optimization

### Component Lazy Loading
```vue
<script setup>
// Lazy load heavy components
const OrganismsPropertyGrid = defineAsyncComponent(
  () => import('~/layers/ui/components/organisms/OrganismsPropertyGrid.vue')
);
</script>
```

### CSS Optimization
- Purged unused CSS in production
- Critical CSS inlining
- Component-scoped styles
- Efficient selector usage

## Testing

### Component Testing
```typescript
// Example component test
import { mount } from '@vue/test-utils';
import AtomsButton from '~/layers/ui/components/atoms/AtomsButton.vue';

describe('AtomsButton', () => {
  it('renders with correct variant class', () => {
    const wrapper = mount(AtomsButton, {
      props: { variant: 'primary' }
    });
    
    expect(wrapper.classes()).toContain('button--primary');
  });
});
```

## Best Practices

### Component Development
- **Single Responsibility**: Each component should have one clear purpose
- **Prop Validation**: Use TypeScript interfaces for prop validation
- **Event Naming**: Use descriptive event names with kebab-case
- **Slot Usage**: Provide flexible content slots where appropriate
- **Default Values**: Provide sensible defaults for optional props

### Styling Guidelines
- **BEM Methodology**: Use Block-Element-Modifier naming convention
- **Mobile First**: Start with mobile styles, enhance for larger screens
- **Semantic Colors**: Use semantic color names rather than specific hues
- **Consistent Spacing**: Use the spacing scale for margins and padding
- **Performance**: Avoid deep CSS selectors and complex animations

### Accessibility Standards
- **WCAG 2.1 AA**: Meet accessibility guidelines
- **Color Contrast**: Ensure sufficient contrast ratios
- **Keyboard Support**: All interactive elements must be keyboard accessible
- **Screen Readers**: Test with screen reader software
- **Focus Indicators**: Provide clear visual focus indicators
