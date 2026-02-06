<template>
  <div class="homepage-section-comms">
    <HomepageSectionIntro class="home-section-ai-scroller__column" :title="sectionTitle"
      :description="sectionDescription">


    </HomepageSectionIntro>

    <div class="homepage-section-comms__infographic">

      <div class="homepage-section-comms__chats">
        <HomepageSectionCommsChat v-for="{ image, author, isSeller, message, time }, index of chatMessages" :image
          :author :message :time :is-seller class="homepage-section-comms__chat" />
      </div>

      <PropertyCardRoot class="homepage-section-comms__card | gradient-box" v-bind="propertyDetails" />
    </div>
  </div>
</template>

<script setup lang="ts">
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
    time: '1 hour ago'
  },
  {
    image: '/img/demo/author1.jpg',
    author: 'Jasmine',
    isSeller: true,
    message: 'Hi! Yes, this weekend sounds great - I am available all morning',
    time: '32 minutes ago'
  },
  {
    image: '/img/demo/author2.jpg',
    author: 'Paul',
    isSeller: false,
    message: "Amazing, let's book something in for 11:00am - I'll see you then",
    time: '19 minutes ago'
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

    padding: var(--size-14);
    box-sizing: border-box;
    transform: scale(0.8);
    width: min(90%, 31ch);
    margin: 0 auto;
  }
}
</style>