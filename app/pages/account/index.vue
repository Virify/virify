<template>
  <!-- Middle Column - Main Content -->
  <div class="account-profile-content | container">
    <div v-if="loggedIn">
      <h2 class="title-sm">Weclome back, {{ user?.firstName ?? user?.username }}!</h2>
      <!-- Analytics Dashboard -->
      <div class="analytics-dashboard">
        <div class="analytics-card | box">
          <h3 class="| title-xs">Total Listings Views</h3>
          <p class="| title-lg text-primary-500">{{ listingViews?.totalViews }}</p>
          <p class="| body-xs">+{{ listingViews?.percentageChange }}% from last month</p>
        </div>
        <div class="analytics-card | box">
          <h3 class="| title-xs">Listings Favourited</h3>
          <p class="| title-lg text-primary-500">{{ listingViews?.favoritedByOthersCount }}</p>
          <p class="| body-xs">Listings saved by users</p>
        </div>
        <div class="analytics-card | box">
          <h3 class="| title-xs">Total Enquiries</h3>
          <p class="| title-lg text-primary-500">{{ listingViews?.totalConversations }}</p>
          <p class="| body-xs">Enquiries on your listings</p>
        </div>
      </div>
      

      <!-- notifications -->
      <div class="account-notifications">
        <h3 class="title-sm">Notifications</h3>
        <div class="box-xl | box">
          <p class="body-md">You have no new notifications.</p>
        </div>
      </div>

      <!-- activity -->
      <div class="account-activity">
        <h3 class="title-sm">Recent Activity</h3>
        <div class="box-xl | box">
          <p class="body-md">You have no recent activity.</p>
        </div>
      </div>

      <!-- recent favourites -->
      <div class="account-favourites">
        <h3 class="title-sm">Recent Favourites</h3>
        <div class="box-xl | box">
          <p class="body-md">You have no recent favourties.</p>
        </div>
      </div>
    </div>

    <!-- recent favourites -->
    <div class="account-notes">
      <h3 class="title-sm">Recent Notes</h3>
      <div class="box-xl | box">
        <p class="body-md">You have no recent notes.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getUserAnalytics } = useAnalytics();
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Account",
    meta: [
      { name: "description", content: "Manage your account settings and preferences." },
      { name: "keywords", content: "account, settings, preferences, user" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  },
});
const { user, loggedIn } = useUserSession();
const listingViews = ref<UserAnalyticsSummary>();

onMounted(() => {
  getUserAnalytics().then((result) => {
    listingViews.value = result;
  });
});
</script>
<style lang="scss" scoped>

.account-profile-content {
  margin-top: -3rem;
}

.analytics-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .analytics-card {
    padding: 1rem;
  }
}

.box {
  background: url("/img/logo-background.svg") no-repeat top right, linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
  background-size: auto 200%, cover;
  color: var(--monochrome-900);

  &-xl {
    background: none;
    background-color: var(--background-200);
    color: var(--foreground-100);
  }
}

.account-notifications,
.account-activity,
.account-favourites,
.account-notes {
  margin: 1rem 0;
}

.account-favourites-list {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  justify-content: space-between;
  padding: 0;
  padding-right: 20px;
  text-align: left;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
}
</style>
