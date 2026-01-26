<template>
  <div>
    <div class="hv2__spacer">
      Spacer
    </div>

    <section class="hv2__split | container">
      <div class="hv2__split-content">
        <h2 class="hv2__title | title-xl">
          We speak your language
        </h2>

        <p class="hv2__text | body-lg">
          Find exactly what you're visualising with natural queries, interactive maps, and granular filters. Our
          intelligent search platform understands you perfectly, even if you can't find the words for lincrusta or
          gingerbread trim for the estate agent.
        </p>

        <ul class="hv2__list">
          <li>
            <h3 class="| title-lg">
              <AtomsIcon icon="ai/star" />
              Natural language search
            </h3>

            <p class="| body-lg">
              Type exactly what you want: "2+ bed house with an en-suite, downstairs bathroom and south-facing garden to
              buy that's less than £325,000". Just say what you're looking for!
            </p>
          </li>

          <li>
            <h3 class="| title-lg">
              <AtomsIcon icon="ai/prompt" />
              Smart suggestions
            </h3>

            <p class="| body-lg">
              Get intelligent property suggestions based on your requirements. See popular searches and trending options
              as you type.
            </p>
          </li>

          <li>
            <h3 class="| title-lg">
              <AtomsIcon icon="search/filter" />
              Contextual filtering
            </h3>

            <p class="| body-lg">
              Our intelligent search extracts property type, transaction type and features from your search query for
              faster results.
            </p>
          </li>

          <li>
            <h3 class="| title-lg">
              <AtomsIcon icon="ai/send" />
              Instant results
            </h3>

            <p class="| body-lg">
              Type what you want and get relevant property matches in seconds. Forget confusing filters, forms, or slow
              loads.
            </p>
          </li>
        </ul>

      </div>

      <div class="hv2__split-content hv2__split-content--sticky">
        <HomepageTyping />
      </div>
    </section>

    <div class="hv2__spacer">
      Spacer
    </div>
  </div>
</template>

<style lang="scss">
.hv2 {

  &__spacer {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: var(--background-300);
    font-weight: bold;
  }

  &__split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: max(var(--size-56), 5vw);
    align-items: flex-start;
  }

  &__split-content {

    &--sticky {
      position: sticky;
      top: 8rem;
      max-width: 55ch;
    }
  }

  &__title {
    font-size: 4rem;
    width: min(100%, 12ch);
    line-height: 1.05em;
    margin: 0 0 var(--size-32);
  }

  &__list {
    list-style: none;
    margin: var(--size-40) 0;
    padding: 0;

    li {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding-left: var(--size-48);
      min-height: 50vh;

      &:not(:last-of-type) {
        margin-bottom: var(--size-32);
      }
    }

    h3 {
      position: relative;
      font-size: var(--size-40);
      line-height: var(--size-48);
    }

    svg {
      position: absolute;
      top: calc(50% - var(--size-20));
      left: calc(0px - var(--size-56));
      width: var(--size-40);
      height: var(--size-40);
    }
  }
}
</style>