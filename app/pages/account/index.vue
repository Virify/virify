<template>
  <div class="account-container | container">
    <!-- Left Column - Account Navigation -->
    <div class="">
      <div class="account-navigation">
        <h2 class="| title-sm cursor-pointer" @click.prevent="navToggle = !navToggle">Account</h2>
        <ul v-show="navToggle">
          <li v-for="item in accountNavigation" :key="item.name" class="account-navigation-item">
            <AtomsIcon :name="item.icon" :icon="item.icon" height="16" width="16"
              class="account-navigation-item-icon" />
            <NuxtLink :to="item.url">
              <p class="body-sm">{{ item.name }}</p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Middle Column - Main Content -->
    <div class="account-profile-content">
      <div v-if="loggedIn">

        <h2 class="title-sm">Weclome back, {{ user?.firstName ?? user?.username }}!</h2>
        <!-- Analytics Dashboard -->
        <div class="analytics-dashboard">
          <div class="analytics-card | box">
            <h3 class="| title-xs">Total Listing Views</h3>
            <p class="| title-lg text-primary-500">1,245</p>
            <p class="| body-xs">+15% from last month</p>
          </div>
          <div class="analytics-card | box">
            <h3 class="| title-xs">Liked Listings</h3>
            <p class="| title-lg text-primary-500">{{ favourites?.length || 0 }}</p>
            <p class="| body-xs">Properties saved</p>
          </div>
          <div class="analytics-card | box">
            <h3 class="| title-xs">Total Enquiries</h3>
            <p class="| title-lg text-primary-500">8</p>
            <p class="| body-xs">2 new this week</p>
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

  </div>
</template>

<script setup lang="ts">
import { accountNavigation } from '~/utils/account/navigation';
definePageMeta({
  middleware: ['authenticated'],
  head: {
    title: "Account",
    meta: [
      { name: "description", content: "Manage your account settings and preferences." },
      { name: "keywords", content: "account, settings, preferences, user" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  },
})
const { user, clear, loggedIn } = useUserSession();
const favourites = useState<ListingCardType[]>("favourites");
const { getAllFavourites } = useFavourites();
const navToggle = ref(true);

const recentFavourites = computed(() => {
  if (favourites.value.length === 0) {
    return [];
  }
  return favourites.value.slice(0, 3);
});

const handleResize = () => {
  if (window.innerWidth < 768) {
    navToggle.value = false;
  } else {
    navToggle.value = true;
  }
};

onMounted(() => {
  getAllFavourites();
  handleResize();
});

onBeforeMount(() => {
  window.addEventListener("resize", handleResize);
});

/**
 * Deletes the user account
 * Redirects to the home page after successful deletion
 * Shows an error notification if deletion fails
 * Shows a success notification if deletion is successful
 */
async function deleteAccount() {
  await $fetch("/auth/delete", {
    method: "DELETE",
  })
    .then(() => {
      clear();
      navigateTo("/");
    })
    .catch((error) => {
      console.error("Error deleting account:", error);
    });
}

/**
 * Logs out the user and redirects to the login page
 */
async function logout() {
  await clear();
  navigateTo("/");
}
</script>
<style lang="scss" scoped>
ul {
  list-style: none;
  ;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-decoration-color: var(--primary-400);
    text-decoration-thickness: 2px;
  }
}

.account-container {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 2rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;

  }
}

.account-profile-info {
  display: flex;
  align-items: center;
  gap: 5px;

  .account-profile-avatar {
    width: 40px;
    height: 40px;
  }
}

.account-navigation {
  padding: var(--size-12) var(--size-16);
  border-radius: var(--border-radius-lg);
  background:
    url('/img/logo-background.svg') no-repeat top left, linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
    background-size: auto 200%, cover;
  color: var(--monochrome-900);

  @media screen and (max-width: 768px) {
    background-image: linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
    background-position: top right;
    background-size: auto, cover;
  }
}

.account-navigation-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  color: white;

  &-icon {
    width: 24px;
    height: 24px;
  }
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
  background:
    url('/img/logo-background.svg') no-repeat top right, linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
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