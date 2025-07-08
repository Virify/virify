<template>
  <div class="| container">
    <h1 class="| title-md">Component Testing Sandbox</h1>

    <div class="listing-grid">
      <MoleculesListingCardNew listing_tier="FEATURED" />
      <MoleculesListingCardNew />
      <MoleculesListingCardNew listing_tier="FEATURED" />
      <MoleculesListingCardNew />
      <MoleculesListingCardNew />
      <MoleculesListingCardNew listing_tier="FEATURED" />
      <MoleculesListingCardNew />
      <MoleculesListingCardNew />
    </div>

    <AtomsDivider />

    <div class="| flow">
      <p>Test various UI components and their functionality.</p>
    </div>

    <h2 class="| title-sm">Form Components Test</h2>

    <MoleculesMultiselect :options="options" v-model="selected" @all-unselected="allUnselected"
      @all-selected="allSelected" />

    <h2 class="| title-sm">Accordion multi-select</h2>

    <MoleculesAccordionMultiselect title="House" :options="options" v-model="accordionSelected"
      @expanded="toggleExpanded" />

    <AtomsDivider />

    <h2 class="| title-xs">Debug</h2>

  </div>
</template>

<script setup lang="ts">

// Form component testing
const selected = ref([])
const accordionSelected = ref([])

const options = [
  { key: 'option1', value: 'Option 1' },
  { key: 'option2', value: 'Option 2' },
  { key: 'option3', value: 'Option 3' },
  { key: 'option4', value: 'Option 4' },
  { key: 'option5', value: 'Option 5' },
]

function allUnselected() {
  console.log('Unselected')
}

function allSelected() {
  console.log('Selected')
}

function toggleExpanded(newValue: any) {
  console.log('Accordion expanded', newValue)
}
</script>

<style scoped>
.flow {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.radio-group input[type="radio"] {
  margin: 0;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.location-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #0ea5e9;
}

/* Loading styles */
.loading-section {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  margin: 2rem 0;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-section h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.loading-text {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.loading-details {
  margin-top: 1rem;
}

.loading-query {
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-style: italic;
}

/* Search button loading state */
.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Applied Filters styles */
.applied-filters-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.filters-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.75rem 0;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.filter-chip {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filter-label {
  font-weight: 500;
  color: #64748b;
  margin-right: 0.25rem;
}

.filter-label::after {
  content: ':';
}

.filter-value {
  color: #1e293b;
  font-weight: 600;
  margin-right: 0.5rem;
}

.filter-remove {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  line-height: 1;
  transition: background-color 0.2s;
}

.filter-remove:hover {
  background: #dc2626;
}

.clear-all-button {
  background: #64748b;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.clear-all-button:hover {
  background: #475569;
}

.location-note {
  font-size: 0.875rem;
  color: #0369a1;
  margin: 0;
  text-align: center;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.search-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.example-searches {
  margin-top: 1rem;
}

.example-button {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.example-button:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.example-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-section {
  margin: 2rem 0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detected-type {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-badge.type-sale {
  background-color: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.type-badge.type-rental {
  background-color: #dbeafe;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.type-badge.type-both {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.detected-price {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.price-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #fef3c7;
  color: #d97706;
  border: 1px solid #fed7aa;
}

.results-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.result-card {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

.listing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

@media (max-width: 768px) {
  .listing-grid {
    grid-template-columns: 1fr;
  }
}

pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
}

.no-results {
  background-color: #fef3c7;
  border: 1px solid #fbbf24;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
}

.no-results h3 {
  color: #92400e;
  margin: 0 0 0.5rem 0;
}

.no-results p {
  color: #78350f;
  margin: 0.5rem 0;
}

.no-results .suggestions {
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  text-align: left;
}

.suggestions-list {
  text-align: left;
  margin: 0;
  padding-left: 1.5rem;
  color: #78350f;
}

.suggestions-list li {
  margin: 0.25rem 0;
}

/* Feature styles */
.result-features {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.features-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.features-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  background-color: #ede9fe;
  color: #6b46c1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
}

.demo-nav {
  margin-top: var(--size-16);
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.button {
  display: inline-block;
  padding: 10px 16px;
  background-color: #3388ff;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #2779e4;
}

/* Search Suggestions Tab Styles */
.search-suggestions {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.suggestion-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 1rem;
  border-radius: 6px;
  background-color: #e5e7eb;
  padding: 2px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>