<template>
  <section class="home-section-ai-scroller">
    <div class="home-section-ai-scroller__column">
      <h2 class="home-section-ai-scroller__title | title-xl">
        We speak your language
      </h2>

      <p class="home-section-ai-scroller__overview | body-lg">
        Find exactly what you're visualising with natural queries, interactive maps, and granular filters. Our
        intelligent search platform understands you perfectly, even if you can't find the words for lincrusta or
        gingerbread trim for the estate agent.
      </p>

      <ul class="home-section-ai-scroller__sections-list">
        <li v-for="{ id, title, content, icon } of scrollingSections" :key="id" :id
          class="home-section-ai-scroller__section">
          <h3 class="home-section-ai-scroller__section-title | title-lg">
            <AtomsIcon v-if="icon" :icon class="home-section-ai-scroller__section-title-icon"
              aria-role="presentation" />
            {{ title }}
          </h3>

          <p class="home-section-ai-scroller__section-content | body-lg">
            {{ content }}
          </p>
        </li>
      </ul>
    </div>

    <div
      class="home-section-ai-scroller__column home-section-ai-scroller__column--sticky home-section-ai-scroller__column--demo">
      <HomepageSectionAiDemo class="home-section-ai-scroller__demo" />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Section {
  icon?: string
  id: string
  title: string
  content: string
}

const scrollingSections: Section[] = [
  {
    id: 'natural-language',
    icon: 'ai/star',
    title: 'Natural language search',
    content: 'Type exactly what you want: "2+ bed house with an en-suite, downstairs bathroom and south-facing garden to buy that\'s less than £325,000". Just say what you\'re looking for!'
  },
  {
    id: 'prompt',
    icon: 'ai/prompt',
    title: 'Smart suggestions',
    content: 'Get intelligent property suggestions based on your requirements. See popular searches and trending options as you type.'
  },
  {
    id: 'filters',
    icon: 'search/filter',
    title: 'Contextual filtering',
    content: 'Our intelligent search extracts property type, transaction type and features from your search query for faster results.'
  },
  {
    id: 'results',
    icon: 'ai/send',
    title: 'Instant results',
    content: 'Type what you want and get relevant property matches in seconds. Forget confusing filters, forms, or slow loads.'
  }
]

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.home-section-ai-scroller {
  display: grid;
  gap: var(--size-32);

  @include mq.tablet {
    grid-template-columns: 1fr 1fr;
    gap: var(--size-56);
    align-items: flex-start;
  }

  @include mq.desktop {
    gap: var(--size-72);
  }

  &__column {

    &--sticky {
      top: 0;
      position: sticky;
    }

    &--demo {
      padding: 5ch 0;

      @include mq.notebook {
        padding: 8ch 0;
      }

      @include mq.desktop {
        padding: 12ch 0;
      }
    }
  }

  &__title {
    font-size: var(--font-6xl);
    width: min(100%, 12ch);
    line-height: var(--lineheight-xs);
    margin: 0 0 var(--size-32);

    @include mq.notebook {
      font-size: var(--font-7xl);
    }

    @include mq.desktop {
      font-size: var(--font-8xl);
    }
  }

  &__sections-list {
    list-style: none;
    margin: var(--size-40) 0;
    padding: 0;
  }

  &__section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: var(--size-24);
    padding-left: var(--size-56);
    box-sizing: border-box;
    margin: var(--size-56) 0;

    @include mq.notebook {
      margin: var(--size-72) 0;
    }

    @include mq.desktop {
      margin: var(--size-120) 0;
    }

    &:not(:last-of-type) {
      margin-bottom: var(--size-32);
    }
  }

  &__sections-list,
  &__demo {
    width: min(100%, 50ch);
    justify-self: center;
  }

  &__section-title {
    position: relative;
    font-size: var(--font-2xl);
    line-height: var(--lineheight-sm);

    @include mq.notebook {
      font-size: var(--font-3xl);
    }

    @include mq.desktop {
      font-size: var(--font-4xl);
    }
  }

  &__section-title-icon {
    position: absolute;
    top: calc(50% - var(--size-20));
    left: calc(0px - var(--size-56));
    width: var(--size-40);
    height: var(--size-40);
    color: var(--secondary-400);
  }
}
</style>