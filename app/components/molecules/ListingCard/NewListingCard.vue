<template>
  <div class="listing-card">
    <div class="listing-card__image-container">
      <img
        :src="image"
        alt="Listing image"
        class="listing-card__image"
      >
      <div class="listing-card__image-overlay">
        <div class="listing-card__image-counter body-xs">
          1/15
        </div>
        <div class="listing-card__image-actions">
          <button class="listing-card__icon-button">
            <AtomsIcon name="heart" icon="cards/favourite" />
          </button>
          <button class="listing-card__icon-button">
            <AtomsIcon name="edit" icon="cards/notes" />
          </button>
        </div>
        <button class="listing-card__arrow listing-card__arrow--left">
          &lt;
        </button>
        <button class="listing-card__arrow listing-card__arrow--right">
          &gt;
        </button>
      </div>
    </div>
    <div class="listing-card__content">
      <div class="listing-card__details">
        <div class="listing-card__header">
          <p class="listing-card__price title-lg">
            £1,000,000
          </p>
          <p class="listing-card__price-qualifier body-sm faded-text">
            Guide Price
          </p>
        </div>
        <h3 class="listing-card__title title-sm">
          Detached House
        </h3>
        <p class="listing-card__location body-sm faded-text">
          Cardiff, CF15
        </p>
        <div class="listing-card__features">
          <div class="listing-card__feature">
            <AtomsIcon name="bed" icon="property/bedrooms" />
            <span class="body-sm">1</span>
          </div>
          <div class="listing-card__feature">
            <AtomsIcon name="bath" icon="property/bathrooms" />
            <span class="body-sm">2</span>
          </div>
          <div class="listing-card__feature">
            <AtomsIcon name="ruler" icon="property/receptions" />
            <span class="body-sm">3</span>
          </div>
        </div>
        <div class="listing-card__tags">
          <span class="listing-card__tag body-xs">Recently Added</span>
          <span class="listing-card__tag body-xs">Reduced</span>
          <span class="listing-card__tag body-xs">Chain Free</span>
        </div>
        <div v-if="extraInfoVisible" class="listing-card__extra-info">
          <p class="listing-card__extra-info-title title-2xs">
            Additional Information:
          </p>
          <p class="body-xs faded-text">
            Lorem ipsum dolor sit amet consectetur. Ornare diam vel nunc ultrices malesuada ultrices...
          </p>
        </div>
      </div>
      <div class="listing-card__footer">
        <div class="listing-card__agent font-semibold">
          <div class="listing-card__agent-logo">
            <AtomsIcon name="check" icon="tick-solid" />
          </div>
          <p>MaggotBalls</p>
        </div>
        <div class="listing-card__actions">
          <button class="listing-card__button body-sm font-bold">
            View
          </button>
          <button class="listing-card__button body-sm font-bold">
            Enquire
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  title: {
    type: String,
    default: 'Detached House'
  },
  extraInfoVisible: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.listing-card {
  --card-padding: var(--size-16);
  --image-width: 45%;

  background-color: var(--background-100);
  border: var(--size-2) solid var(--blue-200);
  border-radius: var(--border-radius-2xl);
  display: flex;
  max-width: 960px;
  position: relative;
}

.listing-card__image-container {
  border-radius: calc(var(--border-radius-2xl) - var(--size-2)) 0 0 calc(var(--border-radius-2xl) - var(--size-2));
  overflow: hidden;
  position: relative;
  width: var(--image-width);
}

.listing-card__image {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.listing-card__image-overlay {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.listing-card__image-counter {
  background-color: var(--secondary-400);
  border-radius: var(--border-radius-xl);
  color: var(--monochrome-900);
  right: var(--size-16);
  padding: var(--size-4) var(--size-12);
  position: absolute;
  top: var(--size-16);
}

.listing-card__image-actions {
  background-color: var(--secondary-400);
  border-radius: var(--border-radius-pill);
  bottom: var(--size-16);
  display: flex;
  gap: var(--size-4);
  left: 50%;
  padding: var(--size-4) var(--size-8);
  position: absolute;
  transform: translateX(-50%);
}

.listing-card__icon-button {
  align-items: center;
  background-color: transparent;
  border: none;
  color: var(--monochrome-900);
  cursor: pointer;
  display: flex;
  font-size: var(--font-xl);
  height: var(--size-32);
  justify-content: center;
  width: var(--size-32);
}

.listing-card__arrow {
  align-items: center;
  background-color: var(--secondary-400);
  border: none;
  border-radius: 50%;
  color: var(--monochrome-900);
  cursor: pointer;
  display: flex;
  font-size: var(--font-2xl);
  height: var(--size-40);
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: var(--size-40);
}

.listing-card__arrow--left {
  left: var(--size-16);
}

.listing-card__arrow--right {
  right: var(--size-16);
}

.listing-card__content {
  color: var(--blue-200);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--card-padding);
  width: calc(100% - var(--image-width));
}

.listing-card__header {
  align-items: baseline;
  display: flex;
  column-gap: var(--size-8);
  flex-wrap: wrap;
}

.listing-card__price {
  margin: 0;
}

.listing-card__price-qualifier {
  margin: 0;
}

.listing-card__title {
  margin: var(--size-4) 0;
}

.listing-card__location {
  margin: 0 0 var(--size-16);
}

.listing-card__features {
  display: flex;
  gap: var(--size-16);
  margin-bottom: var(--size-16);
}

.listing-card__feature {
  align-items: center;
  border: var(--size-2) solid var(--secondary-400);
  border-radius: var(--border-radius-lg);
  display: flex;
  font-weight: var(--font-semibold);
  gap: var(--size-4);
  padding: var(--size-4) var(--size-8);
}

.listing-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-4);
  margin-bottom: var(--size-16);
}

.listing-card__tag {
  background-color: var(--background-300);
  border-radius: var(--size-20);
  padding: var(--size-6) var(--size-16);
}

.listing-card__extra-info {
  background-color: var(--background-300);
  border-radius: var(--border-radius-lg);
  padding: var(--size-16);
  margin-bottom: var(--size-16);
}

.listing-card__extra-info-title {
  margin: 0 0 var(--size-8);
}

.listing-card__extra-info p {
  line-height: 1.5;
  margin: 0;
}

.listing-card__footer {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  justify-content: space-between;
}

.listing-card__agent {
  align-items: center;
  display: flex;
  gap: var(--size-8);
}

.listing-card__agent-logo {
  align-items: center;
  background-color: var(--secondary-400);
  border-radius: 50%;
  color: var(--monochrome-900);
  display: flex;
  font-size: var(--font-2xl);
  height: var(--size-32);
  justify-content: center;
  width: var(--size-32);
}

.listing-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-16);
  width: 100%;
}

.listing-card__button {
  background-color: var(--secondary-400);
  border: none;
  border-radius: var(--border-radius-lg);
  color: var(--monochrome-900);
  cursor: pointer;
  padding: var(--size-8);
  width: 100%;
}

.listing-card__problem-tab {
  background-color: var(--secondary-400);
  border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
  color: var(--monochrome-900);
  padding: var(--size-8) var(--size-16);
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
}

@media (max-width: 768px) {
  .listing-card {
    flex-direction: column;
  }

  .listing-card__image-container {
    width: 100%;
    height: 250px;
    border-radius: calc(var(--border-radius-2xl) - var(--size-2)) calc(var(--border-radius-2xl) - var(--size-2)) 0 0;
  }

  .listing-card__content {
    width: 100%;
  }

  .listing-card__title {
    font-size: var(--font-lg);
  }

  .listing-card__tags {
    display: none;
  }

  .listing-card__actions {
    grid-template-columns: 1fr;
  }

  .listing-card__problem-tab {
    display: none;
  }
  .listing-card__extra-info {
    display: none;
  }
}
</style>