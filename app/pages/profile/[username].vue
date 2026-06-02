<template>
  <div class="profile-page">

    <!-- ═══════════════ BANNER ═══════════════ -->
    <div class="profile-page__banner">
      <div class="container">
        <div class="profile-page__banner-inner">

          <!-- Avatar -->
          <div class="profile-page__avatar-wrap">
            <img
              v-if="profile.avatar"
              :src="profile.avatar"
              :alt="profile.username"
              class="profile-page__avatar"
            />
            <AvatarInitials v-else :name="profile.username" class="profile-page__avatar-initials" />
          </div>

          <!-- Identity -->
          <div class="profile-page__identity">

            <!-- Name + badges -->
            <div class="profile-page__name-row">
              <h1 class="profile-page__username title-xl">{{ profile.username }}</h1>

              <!-- Virify Team badge (with logo mark) -->
              <span v-if="isVirifyTeam" class="profile-page__team-badge">
                <svg width="18" height="18" viewBox="0 0 33 32" aria-hidden="true" fill="currentColor">
                  <path d="M3.23211 0.937979C6.36228 -0.946274 10.4023 0.106514 12.255 3.29008L16.9742 11.3965L11.3801 21.0068C10.1903 23.0503 10.1829 25.4722 11.1498 27.4518L0.919484 10.1149C-0.933153 6.93127 0.101955 2.82226 3.23211 0.937979Z"/>
                  <path d="M22.5699 21.0069L16.975 11.3954L11.3801 21.0069C9.51309 24.2135 10.5565 28.3518 13.7093 30.2507C14.7362 30.869 15.8618 31.1719 16.975 31.1907C18.0883 31.1719 19.2138 30.869 20.2408 30.2507C23.3936 28.3518 24.437 24.2135 22.5699 21.0069Z" fill="#FC7239"/>
                  <path d="M21.5922 10.1984L27.1933 19.8224L32.7944 10.1984C34.6634 6.98767 33.62 2.8452 30.4632 0.942134C29.4341 0.323793 28.3086 0.0188009 27.1933 0C26.078 0.0188009 24.9525 0.321704 23.9234 0.942134C20.7665 2.84311 19.7211 6.98767 21.5922 10.1984Z" fill="#FC7239"/>
                </svg>
                Virify team
              </span>

              <!-- Role badge -->
              <UBadge v-else-if="roleLabel" size="md" color="primary">{{ roleLabel }}</UBadge>
            </div>

            <!-- Meta line -->
            <p class="profile-page__meta body-sm">
              Joined {{ memberSince }}<template v-if="listingCount > 0"> &middot; {{ listingCount }} listing{{ listingCount !== 1 ? 's' : '' }}</template>
            </p>

            <!-- Details row: intents · bio · interests -->
            <div class="profile-page__details-row">

              <!-- Bio -->
              <div v-if="profile.bio" class="profile-page__bio-wrap">
                <span class="profile-page__details-label body-xs">About</span>
                <p class="profile-page__bio body-sm">{{ profile.bio }}</p>
              </div>

              <!-- Intents -->
              <div v-if="profile.intents?.length" class="profile-page__intents">
                <span class="profile-page__details-label body-xs">Looking for</span>
                <div class="profile-page__intents-badges">
                  <UBadge
                    v-for="intent in profile.intents"
                    :key="intent"
                    variant="solid"
                    size="md"
                  >{{ intentLabel(intent) }}</UBadge>
                </div>
              </div>

              <!-- Interests -->
              <div v-if="profile.interests?.length" class="profile-page__interests">
                <span class="profile-page__details-label body-xs">Interests</span>
                <div class="profile-page__interests-badges">
                  <UBadge
                    v-for="interest in profile.interests"
                    :key="interest"
                    color="secondary"
                    variant="solid"
                    size="md"
                  >{{ interest }}</UBadge>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ LISTINGS ═══════════════ -->
    <div class="container">
      <div class="profile-page__listings">
        <h2 class="title-sm">Listings</h2>

        <div v-if="listingCards.length" class="profile-page__listing-grid">
          <PropertyCardRoot
            v-for="card in listingCards"
            :key="card.listingId"
            v-bind="card"
          />
        </div>

        <div v-else class="profile-page__empty">
          <AtomsIcon icon="property/bedrooms" class="profile-page__empty-icon" aria-hidden="true" />
          <p class="body-sm">{{ profile.username }} has no active listings.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { PublicProfile } from '~~/layers/database/server/utils/user';

const route = useRoute();

const { data: profileData, error } = await useAsyncData(
  `profile-${route.params.username}`,
  () => $fetch<{ profile: PublicProfile }>(`/api/profile/${route.params.username}`),
  { watch: [() => route.params.username] }
);

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Profile not found', fatal: true });
}

const profile = computed(() => profileData.value!.profile);

const INTENT_LABELS: Record<string, string> = {
  BUYING: 'Buying',
  SELLING: 'Selling',
  RENTING: 'Renting',
  LANDLORD: 'Landlord',
};

function intentLabel(intent: string) {
  return INTENT_LABELS[intent] ?? intent;
}

const roleLabel = computed(() => {
  const role = profile.value.verification?.role;
  if (role === 'AGENT') return 'Estate Agent';
  if (role === 'ADMIN') return null; // shown as Virify Team badge instead
  return null;
});

const isVirifyTeam = computed(() => profile.value.verification?.role === 'ADMIN');

const memberSince = computed(() =>
  new Date(profile.value.createdAt).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
  })
);

const listingCount = computed(() => profile.value.listings.length);

const listingCards = computed(() =>
  profile.value.listings
    .filter(l => l.property?.address)
    .map(l => mapToCardProps(l as any))
);

const seoTitle = computed(() => `${profile.value.username} on Virify`);
const seoDescription = computed(() => {
  if (profile.value.bio) {
    return profile.value.bio.length > 155
      ? profile.value.bio.slice(0, 155) + '...'
      : profile.value.bio;
  }
  return `View ${profile.value.username}'s profile and listings on Virify.`;
});

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  ogImage: () => profile.value.avatar ?? null,
  twitterCard: 'summary',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: () => profile.value.avatar ?? null,
});
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.profile-page {

  &__banner {
    background-color: light-dark(var(--blue-200), var(--blue-100));
    color: var(--monochrome-900);
    padding: var(--size-48) 0;
  }

  &__banner-inner {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--size-32);

    @include mq.mobile-only {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  &__avatar-wrap {
    flex-shrink: 0;
  }

  &__avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: var(--shadow-md);
  }

  &__avatar-initials {
    width: 120px !important;
    height: 120px !important;
    border-radius: 50% !important;
    font-size: var(--font-2xl) !important;
  }

  &__identity {
    display: flex;
    flex-direction: column;
    gap: var(--size-12);
  }

  &__name-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--size-12);

    @include mq.mobile-only {
      justify-content: center;
    }
  }

  &__username {
    margin: 0;
    line-height: 1;
  }

  &__team-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--size-8);
    background-color: var(--monochrome-900);
    color: var(--blue-400);
    font-size: var(--font-xs);
    font-weight: var(--font-bold);
    padding: var(--size-4) var(--size-12);
    border-radius: var(--border-radius-pill);
  }

  &__meta {
    margin: 0;
    opacity: 0.65;
  }
  &__details-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--size-32);
    margin-top: var(--size-4);

    @include mq.mobile-only {
      flex-direction: column;
      gap: var(--size-16);
      align-items: center;
    }
  }

  &__details-label {
    display: block;
    margin: 0 0 var(--size-6);
    opacity: 0.55;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  &__intents {
    display: flex;
    flex-direction: column;
    gap: var(--size-6);
  }

  &__intents-badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-6);
  }

  &__bio-wrap {
    display: flex;
    flex-direction: column;
    gap: var(--size-6);
    max-width: 380px;
  }

  &__bio {
    margin: 0;
    line-height: 1.6;
  }

  &__interests {
    display: flex;
    flex-direction: column;
    gap: var(--size-6);
  }

  &__interests-badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-6);
  }

  &__listings {
    padding: var(--size-48) 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-32);
  }

  &__listing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--size-24);

    @include mq.tablet-only {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mq.mobile-only {
      grid-template-columns: 1fr;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--size-96) 0;
    gap: var(--size-16);
    opacity: 0.4;
  }

  &__empty-icon {
    width: var(--size-48);
    height: var(--size-48);
  }
}
</style>
