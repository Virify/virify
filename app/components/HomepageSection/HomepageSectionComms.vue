<template>
  <div class="homepage-section-comms">
    <div class="homepage-section-comms__column homepage-section-comms__column--sticky">
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

    <HomepageSectionIntro class="homepage-section-comms__column" :title="sectionTitle"
      :description="sectionDescription">

      <HomepageSectionList :sections="contentSection" />
    </HomepageSectionIntro>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const sectionTitle = 'Communication made simple'
const sectionDescription = "Talk directly with landlords, sellers, buyers and tenants, with Virify's built-in messaging. Get the answers you need, without the wait."

const contentSection = [
  {
    icon: 'map/marker-home',
    title: 'Direct messaging',
    content: 'With Virify, there are no intermediaries. Chat directly with property owners, landlords, tenants and potential buyers'
  },
  {
    icon: 'map/marker-home',
    title: 'Real-time notifications',
    content: 'Never miss an opportunity. Instant notifications for new messages helps you act quickly in a changing market'
  },
  {
    icon: 'map/marker-home',
    title: 'Rich media sharing',
    content: 'Share photos, documents, and listing details directly in the chat. Everything stays in one place'
  },
  {
    icon: 'map/marker-home',
    title: 'Listing context',
    content: 'See property details, price, and location at-a-glance inside the conversation thread'
  },
]

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
    animationDelay: '2250ms'
  },
  {
    image: '/img/demo/author1.jpg',
    author: 'Jasmine',
    isSeller: true,
    message: 'Hi! Yes, this weekend sounds great - I am available all morning',
    time: '32 minutes ago',
    animationDelay: '4400ms'
  },
  {
    image: '/img/demo/author2.jpg',
    author: 'Paul',
    isSeller: false,
    message: "Amazing, let's book something in for 11:00am - I'll see you then",
    time: '19 minutes ago',
    animationDelay: '5600ms'
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
  display: grid;
  gap: var(--size-32);
  align-items: center;
  justify-content: center;

  @include mq.tablet {
    margin-top: var(--size-120);
    grid-template-columns: 1fr 1fr;
    gap: var(--size-56);
    align-items: flex-start;
  }

  @include mq.desktop {
    gap: var(--size-72);
  }

  &__column--sticky {
    overflow: hidden;

    @include mq.tablet {
      position: sticky;
      top: 10ch;
      order: 2;
    }
  }

  &__infographic {
    position: relative;
    width: min(90%, 40ch);
    margin: 0 auto;

    @include mq.mobile-only {
      transform: scale(0.85);
      width: min(100%, 40ch);
    }
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
    width: min(100%, 31ch);
    margin: 0 auto;
    opacity: 0;
    animation: 3s var(--ease-out);
    filter: none;
  }

  &__chat {
    animation: fadeInHomeInfographicChat var(--animation-subtle) var(--ease-out);
    animation-delay: 2000ms;
    display: none;
  }

  &__chat,
  &__card {
    animation-fill-mode: backwards;
  }

  &__infographic--visible &__chat {
    display: block;
  }

  &__infographic--visible &__card {
    animation-name: fadeInHomeInfographic;
    opacity: 0.75;
    filter: grayscale(1);
  }
}

@keyframes fadeInHomeInfographic {
  0% {
    opacity: 1;
    transform: none;
  }

  75% {
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