<template>
  <div class="container">
    <!-- AI Search Hero -->
    <OrganismsHeroAISearchHero @selectSuggestion="handleSuggestionSelect" />

    <!-- How It Works Section -->
    <div class="ai-how-it-works | flow">
      <h2 class="| title-lg text-center">Revolutionary <GradientText>AI-Powered</GradientText> Property Search
      </h2>
      <p class="| body-lg text-center max-width-prose">
        The most advanced property search technology ever created. Simply describe your dream home in natural language,
        and our AI will find perfect matches using intelligent filtering and location awareness.
      </p>

      <div class="ai-how-it-works-grid">
        <GradientBox>
          <h3 class="| title-sm">Natural Language Search</h3>
          <p class="| body-md">Describe exactly what you want: "3 bedroom house with large garden near good schools" -
            our AI understands context and intent.</p>
        </GradientBox>

        <GradientBox>
          <h3 class="| title-sm">Intelligent Filtering</h3>
          <p class="| body-md">Advanced filters for every detail: room sizes, garden dimensions, accessibility
            features, EV charging, and hundreds more criteria.</p>
        </GradientBox>

        <GradientBox>
          <h3 class="| title-sm">Location Intelligence</h3>
          <p class="| body-md">Smart location matching with radius search, postcode recognition, and proximity to
            amenities like transport and schools.</p>
        </GradientBox>
      </div>
    </div>

    <!-- Advanced Search Capabilities -->
    <div class="ai-capabilities | flow">
      <h2 class="| title-lg text-center">Search By Anything You Can <GradientText>Imagine</GradientText>
      </h2>
      <p class="| body-lg text-center max-width-prose">
        Our AI understands hundreds of property features and can search by size, style, amenities, and lifestyle
        requirements.
      </p>

      <div class="ai-capabilities-list">
        <div class="ai-capabilities-category">
          <h3 class="| title-sm">Property & Location</h3>
          <p class="| body-md">Houses, flats, penthouses, studios • Room sizes, garden area • Near schools, stations,
            city centre</p>
        </div>

        <div class="ai-capabilities-category">
          <h3 class="| title-sm">Features & Amenities</h3>
          <p class="| body-md">Parking, garages, EV charging • Gardens, balconies, patios • Home office, study spaces
          </p>
        </div>

        <div class="ai-capabilities-category">
          <h3 class="| title-sm">Accessibility & Lifestyle</h3>
          <p class="| body-md">Wheelchair access, lifts, step-free • Pet-friendly, eco features • Solar panels, EPC
            ratings</p>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="ai-faq">
      <h2 class="| title-lg text-center">Frequently Asked Questions</h2>

      <div class="ai-faq-list">
        <FAQItem question="How does AI property search work?"
          answer="Our AI analyzes your natural language description and converts it into precise database queries. It understands context, synonyms, and relationships between different property features to find exactly what you're looking for."
          :is-open="true" />

        <FAQItem question="Can I search by specific room sizes?"
          answer="Yes! You can search by bedroom sizes, kitchen area, garden dimensions, total property size, and more. Try searches like 'house with master bedroom over 20 sqm' or 'flat with garden over 50 sqm'." />

        <FAQItem question="What locations can I search?"
          answer="Currently featuring properties in Cardiff and Newport with intelligent location matching. You can search by city, postcode, or proximity to landmarks like 'near Cardiff city centre' or 'close to Newport train station'." />

        <FAQItem question="How specific can my search be?"
          answer="Very specific! Our AI understands complex queries like '3 bedroom detached house with double garage, EV charging, large kitchen, and pet-friendly garden under £400,000 in Cardiff'. The more detail you provide, the better the matches." />

        <FAQItem question="What makes this different from traditional search?"
          answer="Traditional search uses dropdown filters and checkboxes. Our AI search understands natural language, context, and relationships between features. Instead of clicking dozens of filters, just describe your ideal home in your own words." />

        <FAQItem question="How many manual filters does AI search replace?"
          answer="Traditional property searches often require 50+ separate filters for detailed searches - property type, bedrooms, bathrooms, price ranges, features, location radius, parking, garden size, accessibility options, and more. Our AI understands all of these from a single sentence." />

        <FAQItem question="Can I perform complex searches without using any filters?"
          answer="Absolutely! Try 'Victorian terrace house with original features, modern kitchen, off-street parking, small garden, near primary school, under £350k in Cardiff suburbs' - our AI handles all the complexity automatically." />

        <FAQItem question="What if I have very specific requirements?"
          answer="The more specific, the better! Our AI excels at complex requirements like 'ground floor flat with level access, wet room, lift access, allocated parking space, south-facing balcony, pet-friendly building, near bus route' - no manual filter combinations needed." />
      </div>
    </div>

    <!-- Call to Action -->
    <div class="ai-cta">
      <div class="ai-cta-content">
        <h2 class="ai-cta-title | title-lg">Ready to Find Your Perfect
          <GradientText>Home</GradientText>?
        </h2>
        <p class="ai-cta-subtitle | body-lg">Start your search above and experience the future of property discovery</p>
        <a href="/search/ai" class="ai-cta-button">Try AI Search Now</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import GradientBox from '~/components/atoms/GradientBox.vue';
import GradientText from '~/components/atoms/GradientText.vue';
import FAQItem from '~/components/molecules/FAQItem.vue';

// Page metadata
useHead({
  title: 'AI Property Search - Find Your Perfect Home',
  meta: [
    { name: 'description', content: 'Revolutionary AI-powered property search. Simply describe your ideal home and let our intelligent system find perfect matches using natural language processing.' }
  ]
})

// Handle suggestion clicks from hero component
const handleSuggestionSelect = (suggestion) => {
  // Navigate to the AI search page with the suggestion as a query parameter
  navigateTo(`/search/ai/?q=${encodeURIComponent(suggestion)}`)
}
</script>

<style scoped lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

// Section spacing
.ai-how-it-works,
.ai-how-it-works-grid,
.ai-capabilities,
.ai-faq,
.ai-faq-list {
  margin: var(--size-64) 0;
  padding: var(--size-40) 0;

  @include mq.tablet {
    margin: var(--size-80) 0;
  }
}

// How It Works Section - Enhanced styling
.ai-how-it-works {
  position: relative;
  padding: var(--size-40) 0;
}

// Capabilities section with hero-style background
.ai-capabilities {
  background: linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
  border-radius: var(--border-radius-3xl);
  padding: var(--size-56) var(--size-20);
  margin: var(--size-64) 0;
  color: var(--monochrome-900);

  @include mq.tablet {
    padding: var(--size-72) var(--size-32);
    margin: var(--size-80) 0;
    background:
      url('/img/logo-background.svg') no-repeat top right,
      linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
    background-size: auto 120%, cover;
  }

  .title-lg {
    color: var(--monochrome-900);
  }

  .body-lg {
    color: var(--monochrome-700);
  }
}

// Centered content with max width
.max-width-prose {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
}



// How It Works Grid
.ai-how-it-works-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-24);
  padding: var(--size-40) 0;

  @include mq.tablet {
    grid-template-columns: repeat(3, 1fr);
  }

  .title-sm {
    color: var(--foreground-100);
    font-weight: 700;
    margin-bottom: var(--size-16);
    font-size: 1.25rem;
  }

  .body-md {
    color: var(--foreground-200);
    line-height: 1.6;
  }
}

// Capabilities List
.ai-capabilities-list {
  display: flex;
  flex-direction: column;
  gap: var(--size-32);
  padding: var(--size-40) 0;
  max-width: 800px;
  margin: 0 auto;

  @include mq.tablet {
    gap: var(--size-40);
  }
}

.ai-capabilities-category {
  text-align: center;

  .title-sm {
    color: var(--monochrome-900);
    font-weight: 700;
    margin-bottom: var(--size-12);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 2px;
      background: var(--primary-600);
    }
  }

  .body-md {
    color: var(--monochrome-700);
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }
}

// FAQ List
.ai-faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
}

// Call to Action - Hero Style
.ai-cta {
  background: linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
  color: var(--monochrome-900);
  border-radius: var(--border-radius-3xl);
  min-height: max(300px, 40vh);
  margin-bottom: var(--size-32);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-56) var(--size-20);

  @include mq.tablet {
    padding: var(--size-72) var(--size-32);
    background:
      url('/img/logo-background.svg') no-repeat top right,
      linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
    background-size: auto 120%, cover;
  }
}

.ai-cta-content {
  text-align: center;
  max-width: 600px;
}

.ai-cta-title {
  margin: 0 auto var(--size-16);
}

.ai-cta-subtitle {
  margin-bottom: var(--size-32);
  line-height: 1.6;
}

.ai-cta-button {
  display: inline-block;
  background-color: fn.faded-color(12%, var(--monochrome-600));
  color: var(--monochrome-900);
  padding: var(--size-12) var(--size-24);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: fn.faded-color(24%, var(--monochrome-600));
  }
}
</style>
