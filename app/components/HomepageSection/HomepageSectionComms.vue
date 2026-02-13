<template>
  <div class="homepage-section-comms">
    <HomepageSectionIntro class="home-section-ai-scroller__column" :title="sectionTitle"
      :description="sectionDescription">


    </HomepageSectionIntro>

    <div class="homepage-section-comms__infographic" ref="$infographic" :class="{
      'homepage-section-comms__infographic--visible': isInfographicVisible
    }">

      <div class="homepage-section-comms__chats">
        <HomepageSectionCommsChat v-for="{ image, author, isSeller, message, time, animationDelay } of chatMessages"
          :image :author :message :time :is-seller class="homepage-section-comms__chat" :style="{ animationDelay }" />
      </div>

      <PropertyCardRoot class="homepage-section-comms__card | gradient-box" v-bind="propertyDetails" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const sectionTitle = 'Communication made simple'
const sectionDescription = "Talk directly with landlords, sellers, buyers and tenants, with Virify's built-in messaging. Get the answers you need, without the wait."

/**
 *  Mock chat
 */
const chatMessages = [
  {
    image: '/img/demo/author2.jpg',
    author: 'Paul',
    isSeller: false,
    message: 'Hey, I saw your property for sale and I absolutely love it! Are you available this weekend for a viewing?',
    time: '1 hour ago',
    animationDelay: '2400ms'
  },
  {
    image: '/img/demo/author1.jpg',
    author: 'Jasmine',
    isSeller: true,
    message: 'Hi! Yes, this weekend sounds great - I am available all morning',
    time: '32 minutes ago',
    animationDelay: '2600ms'
  },
  {
    image: '/img/demo/author2.jpg',
    author: 'Paul',
    isSeller: false,
    message: "Amazing, let's book something in for 11:00am - I'll see you then",
    time: '19 minutes ago',
    animationDelay: '2800ms'
  }
]

/**
 *  Mock card
 */
const propertyDetails = {
  disabledInteractions: true,
  saleOrRent: 'sale' as 'sale' | 'rent',
  propertyImage: '/img/demo/demo-1.jpg',
  price: '£325,000',
  priceLabel: 'In excess of',
  overview: '3 bed detached house',
  overviewAddress: '101 Virify Street, Cardiff, CF3',
  labels: [
    'Freehold',
    'Chain-free'
  ],
  icons: [
    { icon: 'property/bedrooms', count: 3, label: 'Bedrooms' },
    { icon: 'property/bathrooms', count: 1, label: 'Bathrooms' },
    { icon: 'property/receptions', count: 2, label: 'Receptions' },
    { icon: 'property/utility', label: 'Renewables' },
    { icon: 'property/land', label: 'Garden' },
  ],
  sellerImage: undefined,
  sellerName: 'Virify',
  viewURL: undefined,
  enquiryURL: undefined
}

/**
 *  Animate content in
 */
const $infographic = useTemplateRef('$infographic')
const isInfographicVisible = shallowRef(false)

useIntersectionObserver($infographic, ([entry]) => {
  const { isIntersecting } = asObject(entry)

  isInfographicVisible.value = !!isIntersecting
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-comms {

  &__infographic {
    position: relative;
    width: min(90%, 40ch);
    margin: 0 auto;
  }

  &__chats {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: var(--size-20);
  }

  &__chat {
    max-width: min(80%, 30ch);
  }

  &__card {
    --gradient-box-radius: var(--border-radius-3xl);

    background: var(--background-200);
    padding: var(--size-14);
    box-sizing: border-box;
    transform: scale(0.76);
    width: min(90%, 31ch);
    margin: 0 auto;
  }

  &__card {
    animation: fadeInHomeInfographic 2.4s var(--ease-out);
    animation-delay: 500ms;
    filter: none;
  }

  &__chat {
    animation: fadeInHomeInfographicChat var(--animation-subtle) var(--ease-out);
    animation-delay: 2000ms;
  }

  &__chat,
  &__card {
    animation-fill-mode: backwards;
    display: none;
  }

  &__infographic--visible &__chat,
  &__infographic--visible &__card {
    display: block;
  }

  &__infographic--visible &__card {
    opacity: 0.75;
    filter: grayscale(1);
  }
}

@keyframes fadeInHomeInfographic {
  0% {
    opacity: 0;
    transform: translateY(100px);
  }

  20% {
    opacity: 1;
    transform: none;
  }

  80% {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

@keyframes fadeInHomeInfographicChat {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
}
</style>