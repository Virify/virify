<template>
  <div class="o-mock-results | container">
    <PropertyCardRoot v-for="{
      price,
      saleOrRent,
      overviewAddress,
      propertyImage,
      sellerName,
      icons,
      overview,
      viewUrl,
      labels,
      dateChanged,
      dateChangedType,
      priceLabel
    } of resultsMapped" :property-image :price :overview :sale-or-rent :icons :overview-address :seller-name
      :date-changed :date-changed-type :view-url :labels :price-label />

    <PropertyCardSkeleton v-for="_ of 8" />
  </div>
</template>

<script setup lang="ts">
// const results = [
// ]

/**
 *  @TODO - not yet implemented
 */
// propertyImage: __getFirstImage(property as Result['property']),
// coords: __getCoords(property as Result['property']),
// sellerImage: null,

// const resultsMapped = results.map(formatSearchResults)

const resultsMapped = [{ "saleOrRent": "buy", "price": "£211,357", "overviewAddress": "70, Richmond Road, Cardiff, CF24 3AT", "propertyImage": "d0f1451c-5944-431d-8b40-583622460f00", "coords": [51.489286, -3.171296], "sellerName": "Virify", "overview": "4 Bed Student Accommodation Flat", "icons": [{ "icon": "property/bedrooms", "count": 4, "label": "Bedrooms" }, { "icon": "property/bathrooms", "count": 2, "label": "Bathrooms" }, { "icon": "property/receptions", "count": 3, "label": "Receptions" }, { "icon": "property/parking", "label": "Parking", "active": true }, { "icon": "property/front-garden", "label": "Garden", "active": true }], "viewUrl": "/listing/4/", "dateChanged": "2026-01-19T11:12:44.967Z", "dateChangedType": "Added", "labels": ["COMMONHOLD"], "priceLabel": "FIXED", "sellerImage": null }, { "saleOrRent": "buy", "price": "£256,850", "overviewAddress": "53, Clifton Street, Cardiff, CF24 1LS", "propertyImage": "a08cd2c3-6cd8-4a42-aa4e-68e0d4160800", "coords": [51.485421, -3.157762], "sellerName": "Virify", "overview": "4 Bed Bungalow End of Terrace", "icons": [{ "icon": "property/bedrooms", "count": 4, "label": "Bedrooms" }, { "icon": "property/bathrooms", "count": 2, "label": "Bathrooms" }, { "icon": "property/receptions", "count": 2, "label": "Receptions" }, { "icon": "property/parking", "label": "Parking", "active": true }, { "icon": "property/front-garden", "label": "Garden", "active": true }], "viewUrl": "/listing/5/", "dateChanged": "2026-01-19T11:12:45.002Z", "dateChangedType": "Added", "labels": ["COMMONHOLD"], "priceLabel": "OFFERS_OVER", "sellerImage": null }, { "saleOrRent": "buy", "price": "£386,972", "overviewAddress": "117, Henke Court, Cardiff, CF10 4EJ", "propertyImage": "6c48e550-09ea-4b56-fb5f-6d9268cd3500", "coords": [51.470991, -3.164458], "sellerName": "Zakary6_1", "overview": "2 Bed House Mansion", "icons": [{ "icon": "property/bedrooms", "count": 2, "label": "Bedrooms" }, { "icon": "property/bathrooms", "count": 1, "label": "Bathrooms" }, { "icon": "property/receptions", "count": 1, "label": "Receptions" }, { "icon": "property/parking", "label": "Parking", "active": true }], "viewUrl": "/listing/19/", "dateChanged": "2026-01-19T11:12:45.066Z", "dateChangedType": "Added", "labels": ["FREEHOLD"], "priceLabel": "OFFERS_OVER", "sellerImage": null }, { "saleOrRent": "buy", "price": "£754,532", "overviewAddress": "CATHEDRAL HOUSE, Hamilton Street, Cardiff, CF11 9FG", "propertyImage": "a08cd2c3-6cd8-4a42-aa4e-68e0d4160800", "coords": [51.481655, -3.179194], "sellerName": "Devonte.McKenzie50_3", "overview": "4 Bed House Mansion", "icons": [{ "icon": "property/bedrooms", "count": 4, "label": "Bedrooms" }, { "icon": "property/bathrooms", "count": 1, "label": "Bathrooms" }, { "icon": "property/receptions", "count": 2, "label": "Receptions" }, { "icon": "property/parking", "label": "Parking", "active": true }], "viewUrl": "/listing/29/", "dateChanged": "2026-01-19T11:12:45.119Z", "dateChangedType": "Added", "labels": ["LEASEHOLD"], "priceLabel": "FIXED", "sellerImage": null }, { "saleOrRent": "buy", "price": "£315,137", "overviewAddress": "WINDSOR COURT, Maes Yr Awel, Cardiff, CF15 8AT", "propertyImage": "a08cd2c3-6cd8-4a42-aa4e-68e0d4160800", "coords": [51.481655, -3.179194], "sellerName": "Ben3_5", "overview": "5 Bed Bungalow Semi-detached", "icons": [{ "icon": "property/bedrooms", "count": 5, "label": "Bedrooms" }, { "icon": "property/bathrooms", "count": 2, "label": "Bathrooms" }, { "icon": "property/receptions", "count": 3, "label": "Receptions" }, { "icon": "property/parking", "label": "Parking", "active": true }, { "icon": "property/front-garden", "label": "Garden", "active": true }], "viewUrl": "/listing/38/", "dateChanged": "2026-01-19T11:12:45.535Z", "dateChangedType": "Added", "labels": ["COMMONHOLD"], "priceLabel": "OFFERS_OVER", "sellerImage": null }, { "saleOrRent": "buy", "price": "£215,236", "overviewAddress": "18, Green Street, Cardiff, CF11 6LN", "propertyImage": "d0f1451c-5944-431d-8b40-583622460f00", "coords": [51.480555, -3.188261], "sellerName": "Darwin_Prohaska63_10", "overview": "4 Bed House Semi-detached", "icons": [{ "icon": "property/bedrooms", "count": 4, "label": "Bedrooms" }, { "icon": "property/bathrooms", "count": 1, "label": "Bathrooms" }, { "icon": "property/receptions", "count": 2, "label": "Receptions" }, { "icon": "property/parking", "label": "Parking", "active": true }, { "icon": "property/front-garden", "label": "Garden", "active": true }], "viewUrl": "/listing/59/", "dateChanged": "2026-01-19T11:12:45.138Z", "dateChangedType": "Added", "labels": ["LEASEHOLD"], "priceLabel": "GUIDE_PRICE", "sellerImage": null }]

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-mock-results {
  --container-padding: var(--size-24);

  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-12);
  row-gap: var(--size-24);

  @include mq.mobile {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mq.small-tablet {
    gap: var(--size-16);
  }

  @include mq.notebook {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--size-20);
  }

  @include mq.desktop {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--size-24);
  }

  @include mq.superultrawide {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>