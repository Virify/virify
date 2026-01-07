<template>
  <UDashboardGroup unit="px">
    <!-- sidebar -->
    <OrganismsNavigationSidebar />
    <UDashboardSearch
      :groups="groups"
      placeholder="Search your saved listings"
      :color-mode="false"
      variant="ghost"
      :ui="{
        input: 'border-white/30 focus:border-0 outline-0 placeholder-white!',
        label: 'body-md',
        item: 'py-2',
        itemLeadingIcon: 'text-secondary'
      }"
    />
    <slot />
  </UDashboardGroup>
  <ViewsDialog />
  <MoleculesToastContainer />
</template>
<script lang="ts" setup>
const { fetchUserItemsAggregates } = useNotifications()
const { favourites } = useFavourites()
const { userNotes } = useNotes()

onMounted(async () => {
  await fetchUserItemsAggregates()
})

const formatLabel = (listing: any) => {
  const price = listing.price || 0
  const formattedPrice = numberToCurrency(typeof price === 'number' ? price : 0)
  const address = listing.property.address
  const addressString = [address.street, address.city, address.postcode].filter(Boolean).join(', ')
  return `${formattedPrice} -> ${addressString}`
}

const groups = computed(() => {
  const notesSales = userNotes.value
    .filter(n => n.listing?.saleListing)
    .map(note => ({
      id: note.listing!.id,
      label: formatLabel(note.listing!),
      icon: 'i-lucide-sticky-note',
      to: `/listing/${note.listing!.id}`,
      suffix: note.note ? (note.note.length > 30 ? note.note.substring(0, 30) + '...' : note.note) : 'Note'
    }))

  const notesRentals = userNotes.value
    .filter(n => n.listing?.rentalListing)
    .map(note => ({
      id: note.listing!.id,
      label: formatLabel(note.listing!),
      icon: 'i-lucide-sticky-note',
      to: `/listing/${note.listing!.id}`,
      suffix: note.note ? (note.note.length > 30 ? note.note.substring(0, 30) + '...' : note.note) : 'Note'
    }))

  const favouritesSales = favourites.value
    .filter(f => f.listing.saleListing)
    .map(fav => ({
      id: fav.listing.id,
      label: formatLabel(fav.listing),
      icon: 'i-heroicons-home',
      to: `/listing/${fav.listing.id}`,
    }))

  const favouritesRentals = favourites.value
    .filter(f => f.listing.rentalListing)
    .map(fav => ({
      id: fav.listing.id,
      label: formatLabel(fav.listing),
      icon: 'i-heroicons-home',
      to: `/listing/${fav.listing.id}`,
    }))

  return [
    {
      id: 'notes-rentals',
      key: 'notes-rentals',
      label: 'Notes Rental',
      items: notesRentals
    },
    {
      id: 'notes-sales',
      key: 'notes-sales',
      label: 'Notes Sale',
      items: notesSales
    },
    {
      id: 'favourites-rentals',
      key: 'favourites-rentals',
      label: 'Favourites Rental',
      items: favouritesRentals
    },
    {
      id: 'favourites-sales',
      key: 'favourites-sales',
      label: 'Favourites Sale',
      items: favouritesSales
    }
  ]
})
</script>
<style lang="scss">
  @media (min-width: 2560px) {
  .uw-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>