<template>
  <div class="container flow flow-2xl">
    <div v-if="listing && property">
      <!-- Header -->
      <div class="p-listing-header flex justify-between items-center">
        <h1 class="title-xl p-listing-title">{{ listing.title }}</h1>
        <div class="flex gap-4 p-listing-action-buttons">
          <AtomsFavouriteButton :property-id="property.id" />
          <AtomsNoteButton :property-id="property.id" />
        </div>
      </div>

      <!-- Listing Metadata -->
      <div class="box">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div><span class="font-medium">Listed:</span> {{ listing.publishedAt ? formatMDY(listing.publishedAt) : 'Not published' }}</div>
          <div><span class="font-medium">Reference ID:</span> #{{ listing.id }}</div>
          <div><span class="font-medium">Tier:</span> {{ listing.listingTier }}</div>
          <div v-if="listing.verificationLevel"><span class="font-medium">Verification:</span> {{ listing.verificationLevel }}</div>
        </div>
      </div>

      <!-- Media Gallery -->
      <div class="p-listing-media-grid">
        <NuxtImg v-for="(mediaItem, index) in property.media" :key="index" :src="mediaItem.image as string" :alt="mediaItem?.metadata" class="p-listing-media-image" width="400" />
      </div>

      <!-- Key Info Panel -->
      <div class="p-listing-info-grid">
        <div class="box box-lg">
          <h2 class="title-md">£{{ listing.price?.toLocaleString() }}</h2>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="p-listing-badge p-listing-badge-primary">{{ listing.saleListing ? 'For Sale' : 'For Rent' }}</span>
            <span class="p-listing-badge p-listing-badge-secondary">{{ listing.rentalListing?.availabilityStatus ?? listing.saleListing?.availabilityStatus }}</span>
          </div>
          <div class="flow flow-xs body-sm">
            <p>{{ listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency }}</p>
            <p v-if="listing.rentalListing">Deposit: £{{ listing.rentalListing.deposit }}</p>
            <p v-if="listing.rentalListing">Furnished: {{ listing.rentalListing.furnishedStatus }}</p>
            <p>Available from: {{ formattedMoveInDate }}</p>
          </div>
        </div>
        <div class="box box-lg">
          <h2 class="title-sm">Property Details</h2>
          <div class="p-listing-details-grid">
            <div><span class="body-xs faded-text">Type:</span> <span class="font-medium">{{ property.type?.name }}</span></div>
            <div><span class="body-xs faded-text">Class:</span> <span class="font-medium">{{ property.classification?.name }}</span></div>
            <div><span class="body-xs faded-text">Bedrooms:</span> <span class="font-medium">{{ property.bedroomFeatures?.length ?? 0 }}</span></div>
            <div><span class="body-xs faded-text">Bathrooms:</span> <span class="font-medium">{{ property.bathroomFeatures?.length ?? 0 }}</span></div>
            <div><span class="body-xs faded-text">Tier:</span> <span class="font-medium">{{ listing.listingTier }}</span></div>
            <div><span class="body-xs faded-text">Receptions:</span> <span class="font-medium">{{ property.numberReceptions ?? 0 }}</span></div>
            <div><span class="body-xs faded-text">Floor Area:</span> <span class="font-medium">{{ property.floorLevel ?? 'N/A' }}</span></div>
            <div><span class="body-xs faded-text">Year Built:</span> <span class="font-medium">{{ property.yearBuilt ?? 'N/A' }}</span></div>
            <div><span class="body-xs faded-text">EPC Rating:</span> <span class="font-medium">{{ property.energyAndUtilities?.epcRating ?? 'N/A' }}</span></div>
            <div><span class="body-xs faded-text">Council Tax Band:</span> <span class="font-medium">{{ property.runningCosts?.councilTaxBand ?? 'N/A' }}</span></div>
            <div><span class="body-xs faded-text">Construction Type:</span> <span class="font-medium">{{ property.constructionType || 'N/A' }}</span></div>
            <div><span class="body-xs faded-text">Size:</span> <span class="font-medium">{{ property.size ?? 'N/A' }}</span></div>
          </div>
        </div>
        <div class="box box-lg">
          <h2 class="title-sm">Location</h2>
          <address class="body-sm flow flow-xs">
            {{ property.address?.flat ? property.address.flat + ', ' : '' }}
            {{ property.address?.number ? property.address.number + ' ' : '' }}
            {{ property.address?.street }}<br>
            {{ property.address?.city }}<br>
            {{ property.address?.county }}<br>
            {{ property.address?.postcode }}
          </address>
        </div>
      </div>

      <!-- Map -->
      <div class="p-listing-map-container">
        <h2 class="title-md">Map</h2>
        <div v-if="property?.address?.lat && property?.address?.lon" class="p-listing-map-inner">
          <Map
            ref="mapRef"
            :marker="listing"
            :zoom="15"
            :center="[property.address.lon, property.address.lat]"
            :interactive="false"
            :mapId="GLOBAL_MAP_ID"
          />
        </div>
      </div>

      <!-- Descriptions -->
      <div class="box box-lg">
        <h2 class="title-sm">Listing Description</h2>
        <p class="body-sm">{{ listing.description }}</p>
      </div>
      <div class="box box-lg">
        <h2 class="title-sm">Property Description</h2>
        <p class="body-sm">{{ property.description }}</p>
      </div>

      <!-- Property Features -->
      <div class="flow flow-2xl">
        <h2 class="title-xl p-listing-main-title">Property Features</h2>
        <div class="p-listing-features box box-lg">
          <!-- Bedrooms -->
          <div class="flow flow-lg section-container">
            <h3 class="title-md section-heading p-listing-section-title">Bedroom Features</h3>
            <div class="p-listing-feature-grid">
              <template v-if="property.bedroomFeatures && property.bedroomFeatures.length">
                <div v-for="(room, i) in property.bedroomFeatures" :key="i" class="p-listing-feature-card">
                  <h4 class="font-medium body-sm">Bedroom {{ room.roomNumber ?? (i + 1) }}</h4>
                  <div class="body-xs">Bed Size(s): {{ room.bed?.length ? room.bed.join(', ') : 'N/A' }}</div>
                  <div class="body-xs">Description: {{ room.description || 'N/A' }}</div>
                  <div class="body-xs">Size: {{ room.size || 'N/A' }}</div>
                  <div class="body-xs">Ensuite: {{ room.enSuite ? 'Yes' : 'No' }}</div>
                  <div class="body-xs">Built-In Storage: {{ room.builtInStorage ? 'Yes' : 'No' }}</div>
                  <div class="body-xs">Walk-In Wardrobe: {{ room.walkInWardrobe ? 'Yes' : 'No' }}</div>
                </div>
              </template>
              <div v-else class="p-listing-feature-card p-listing-empty-card">
                <h4 class="font-medium body-sm">No bedroom information available</h4>
              </div>
            </div>
          </div>

          <!-- Bathrooms -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Bathroom Features</h3>
            <div class="p-listing-feature-grid">
              <template v-if="property.bathroomFeatures && property.bathroomFeatures.length">
                <div v-for="(room, i) in property.bathroomFeatures" :key="i" class="p-listing-feature-card">
                  <h4 class="font-medium body-sm">Bathroom {{ room.roomNumber ?? (i + 1) }}</h4>
                  <div class="body-xs">Description: {{ room.description || 'N/A' }}</div>
                  <div class="body-xs">Size: {{ room.size || 'N/A' }}</div>
                  <div class="body-xs">Ensuite: {{ room.enSuite ? 'Yes' : 'No' }}</div>
                  <div class="body-xs">Bathtub: {{ room.bathtub ? 'Yes' : 'No' }}</div>
                  <div class="body-xs">Walk-In Shower: {{ room.walkInShower ? 'Yes' : 'No' }}</div>
                  <div class="body-xs">Downstairs: {{ room.downstairs ? 'Yes' : 'No' }}</div>
                  <div class="body-xs">Upstairs: {{ room.upstairs ? 'Yes' : 'No' }}</div>
                </div>
              </template>
              <div v-else class="p-listing-feature-card p-listing-empty-card">
                <h4 class="font-medium body-sm">No bathroom information available</h4>
              </div>
            </div>
          </div>

          <!-- Kitchen -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Kitchen Features</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card">
                <div class="body-xs">Modern: {{ property.kitchenFeatures?.modern ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Open Plan: {{ property.kitchenFeatures?.openPlan ? 'Yes' : 'No' }}</div>
                <div class="body-xs">White Goods: {{ property.kitchenFeatures?.whiteGoods ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Breakfast Bar: {{ property.kitchenFeatures?.breakfastBar ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Island: {{ property.kitchenFeatures?.island ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Pantry: {{ property.kitchenFeatures?.pantry ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Utility Room Access: {{ property.kitchenFeatures?.utilityAccess ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Size: {{ property.kitchenFeatures?.size || 'N/A' }}</div>
                <div class="body-xs">Description: {{ property.kitchenFeatures?.description || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Utility -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Utility Room</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card">
                <div class="body-xs">Appliances: {{ property.utility?.appliances?.length ? property.utility.appliances.join(', ') : 'None' }}</div>
                <div class="body-xs">Storage: {{ property.utility?.storage ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Sink: {{ property.utility?.sink ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Plumbing: {{ property.utility?.plumbing ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Size: {{ property.utility?.size || 'N/A' }}</div>
                <div class="body-xs">Description: {{ property.utility?.description || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Living Area -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Living Area</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card">
                <div class="body-xs">Fireplace: {{ property.livingAreaFeatures?.fireplace || 'N/A' }}</div>
                <div class="body-xs">Balcony: {{ property.livingAreaFeatures?.balcony ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Open Plan: {{ property.livingAreaFeatures?.openPlan ? 'Yes' : 'No' }}</div>
                <div class="body-xs">Size: {{ property.livingAreaFeatures?.size || 'N/A' }}</div>
                <div class="body-xs">Description: {{ property.livingAreaFeatures?.description || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Reception Rooms -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Reception Rooms</h3>
            <div class="p-listing-feature-grid">
              <template v-if="property.reception && property.reception.length">
                <div v-for="(rec, i) in property.reception" :key="i" class="p-listing-feature-card">
                  <h4 class="font-medium body-sm">Reception {{ rec.roomNumber ?? (i + 1) }}</h4>
                  <div class="body-xs">Description: {{ rec.description || 'N/A' }}</div>
                  <div class="body-xs">Size: {{ rec.size || 'N/A' }}</div>
                  <div class="body-xs">Open Plan: {{ rec.openPlan ? 'Yes' : 'No' }}</div>
                  <div class="body-xs">Fireplace: {{ rec.fireplace || 'N/A' }}</div>
                  <div class="body-xs">Games Room: {{ rec.gamesRoom ? 'Yes' : 'No' }}</div>
                  <div class="body-xs">Home Cinema: {{ rec.homeCinema ? 'Yes' : 'No' }}</div>
                </div>
              </template>
              <div v-else class="p-listing-feature-card p-listing-empty-card">
                <h4 class="font-medium body-sm">No reception room information available</h4>
              </div>
            </div>
          </div>

          <!-- Parking -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Parking</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Garage:</span> <span class="body-xs">{{ property.parking?.garage ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Driveway:</span> <span class="body-xs">{{ property.parking?.driveway ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Permit Parking:</span> <span class="body-xs">{{ property.parking?.permitParking ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">On Street:</span> <span class="body-xs">{{ property.parking?.onStreet ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">No Parking:</span> <span class="body-xs">{{ property.parking?.noParking ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Carport:</span> <span class="body-xs">{{ property.parking?.carport ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Allocated Parking:</span> <span class="body-xs">{{ property.parking?.allocatedParking ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">EV Charging:</span> <span class="body-xs">{{ property.parking?.evCharging ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Description:</span> <span class="body-xs">{{ property.parking?.description || 'N/A' }}</span></div>
            </div>
          </div>

          <!-- Outdoor Space -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Outdoor Space</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Description:</span> <span class="body-xs">{{ property.outdoorSpace?.description || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Total Size:</span> <span class="body-xs">{{ property.outdoorSpace?.totalSize || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Front Garden:</span> <span class="body-xs">{{ property.outdoorSpace?.frontGarden ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Front Garden Size:</span> <span class="body-xs">{{ property.outdoorSpace?.frontGardenSize || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Rear Garden:</span> <span class="body-xs">{{ property.outdoorSpace?.rearGarden ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Rear Garden Size:</span> <span class="body-xs">{{ property.outdoorSpace?.rearGardenSize || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Sun Terrace:</span> <span class="body-xs">{{ property.outdoorSpace?.sunTerrace ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Terrace:</span> <span class="body-xs">{{ property.outdoorSpace?.terrace ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Balcony:</span> <span class="body-xs">{{ property.outdoorSpace?.balcony ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Patio:</span> <span class="body-xs">{{ property.outdoorSpace?.patio ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Separate Parcel:</span> <span class="body-xs">{{ property.outdoorSpace?.separateParcel ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Shed:</span> <span class="body-xs">{{ property.outdoorSpace?.shed ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Summer House:</span> <span class="body-xs">{{ property.outdoorSpace?.summerHouse ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Garden Office:</span> <span class="body-xs">{{ property.outdoorSpace?.gardenOffice ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Pool:</span> <span class="body-xs">{{ property.outdoorSpace?.pool ? 'Yes' : 'No' }}</span></div>
            </div>
          </div>

          <!-- Energy & Utilities -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Energy & Utilities</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Description:</span> <span class="body-xs">{{ property.energyAndUtilities?.description || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">EPC Rating:</span> <span class="body-xs">{{ property.energyAndUtilities?.epcRating || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">EPC Certificate URL:</span> <span class="body-xs"><a v-if="property.energyAndUtilities?.epcCertificateUrl" :href="property.energyAndUtilities.epcCertificateUrl" target="_blank">View Certificate</a><span v-else>N/A</span></span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Primary Heating Type:</span> <span class="body-xs">{{ property.energyAndUtilities?.primaryHeatingType?.length ? property.energyAndUtilities.primaryHeatingType.join(', ') : 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Secondary Heating Type:</span> <span class="body-xs">{{ property.energyAndUtilities?.secondaryHeatingType?.length ? property.energyAndUtilities.secondaryHeatingType.join(', ') : 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Boiler Type:</span> <span class="body-xs">{{ property.energyAndUtilities?.boilerType || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Hot Water Source:</span> <span class="body-xs">{{ property.energyAndUtilities?.hotWaterSource || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Renewables:</span> <span class="body-xs">{{ property.energyAndUtilities?.renewables?.length ? property.energyAndUtilities.renewables.join(', ') : 'None' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Connected Utilities:</span> <span class="body-xs">{{ property.energyAndUtilities?.connectedUtilities?.length ? property.energyAndUtilities.connectedUtilities.join(', ') : 'None' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Broadband Type:</span> <span class="body-xs">{{ property.energyAndUtilities?.broadbandType || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Full Fibre Available:</span> <span class="body-xs">{{ property.energyAndUtilities?.fullFibreAvailable ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Max Download Speed (Mbps):</span> <span class="body-xs">{{ property.energyAndUtilities?.maxDownloadSpeedMbps || 'N/A' }}</span></div>
            </div>
          </div>

          <!-- Accessibility Features -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Accessibility Features</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Description:</span> <span class="body-xs">{{ property.accessibilityFeatures?.description || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Wheelchair Friendly:</span> <span class="body-xs">{{ property.accessibilityFeatures?.wheelchairFriendly ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Step Free Access:</span> <span class="body-xs">{{ property.accessibilityFeatures?.stepFreeAccess ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Wide Doorways:</span> <span class="body-xs">{{ property.accessibilityFeatures?.wideDoorways ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Wet Room:</span> <span class="body-xs">{{ property.accessibilityFeatures?.wetRoom ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Handrails:</span> <span class="body-xs">{{ property.accessibilityFeatures?.handrails ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Elevator:</span> <span class="body-xs">{{ property.accessibilityFeatures?.elevator ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Stairs:</span> <span class="body-xs">{{ property.accessibilityFeatures?.stairs ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Accessible Parking:</span> <span class="body-xs">{{ property.accessibilityFeatures?.accessibleParking ? 'Yes' : 'No' }}</span></div>
            </div>
          </div>

          <!-- Security Features -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Security Features</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Description:</span> <span class="body-xs">{{ property.securityFeatures?.description || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Gated Community:</span> <span class="body-xs">{{ property.securityFeatures?.gatedCommunity ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">CCTV:</span> <span class="body-xs">{{ property.securityFeatures?.cctv ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Alarm System:</span> <span class="body-xs">{{ property.securityFeatures?.alarmSystem ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Neighbourhood Watch:</span> <span class="body-xs">{{ property.securityFeatures?.neighborhoodWatch ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Intercom System:</span> <span class="body-xs">{{ property.securityFeatures?.intercomSystem ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Security Staff:</span> <span class="body-xs">{{ property.securityFeatures?.security ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Reception:</span> <span class="body-xs">{{ property.securityFeatures?.reception ? 'Yes' : 'No' }}</span></div>
            </div>
          </div>

          <!-- Additional Features -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Additional Features</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Description:</span> <span class="body-xs">{{ property.additionalFeatures?.description || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Pet Friendly:</span> <span class="body-xs">{{ property.additionalFeatures?.petFriendly ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Move In Date:</span> <span class="body-xs">{{ property.additionalFeatures?.moveInDate ? formatMDY(property.additionalFeatures.moveInDate) : 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Home Office:</span> <span class="body-xs">{{ property.additionalFeatures?.homeOffice ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Pool:</span> <span class="body-xs">{{ property.additionalFeatures?.pool ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Internet:</span> <span class="body-xs">{{ property.additionalFeatures?.internet ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Cable TV:</span> <span class="body-xs">{{ property.additionalFeatures?.cableTv ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Phone:</span> <span class="body-xs">{{ property.additionalFeatures?.phone ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Laundry:</span> <span class="body-xs">{{ property.additionalFeatures?.laundry ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Concierge:</span> <span class="body-xs">{{ property.additionalFeatures?.concierge ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Shop:</span> <span class="body-xs">{{ property.additionalFeatures?.shop ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Gym:</span> <span class="body-xs">{{ property.additionalFeatures?.gym ? 'Yes' : 'No' }}</span></div>
            </div>
          </div>

          <!-- Amenities -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Amenities</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Amenities:</span> <span class="body-xs">N/A</span></div>
            </div>
          </div>

          <!-- Storage Features -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Storage Features</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Description:</span> <span class="body-xs">{{ property.storageFeatures?.description || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Attic:</span> <span class="body-xs">{{ property.storageFeatures?.attic ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Basement:</span> <span class="body-xs">{{ property.storageFeatures?.basement ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Separate Dressing:</span> <span class="body-xs">{{ property.storageFeatures?.separateDressing ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Under Stairs Storage:</span> <span class="body-xs">{{ property.storageFeatures?.underStairsStorage ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Pantry:</span> <span class="body-xs">{{ property.storageFeatures?.pantry ? 'Yes' : 'No' }}</span></div>
            </div>
          </div>

          <!-- Running Costs -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Running Costs</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Description:</span> <span class="body-xs">{{ property.runningCosts?.description || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Council Tax Band:</span> <span class="body-xs">{{ property.runningCosts?.councilTaxBand || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Service Charges:</span> <span class="body-xs">{{ property.runningCosts?.serviceCharges !== undefined ? '£' + property.runningCosts.serviceCharges : 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Ground Rent:</span> <span class="body-xs">{{ property.runningCosts?.groundRent !== undefined ? '£' + property.runningCosts.groundRent : 'N/A' }}</span></div>
            </div>
          </div>

          <!-- Land Details -->
          <div class="mt-10 section-container">
            <h3 class="title-md section-heading p-listing-section-title">Land Details</h3>
            <div class="p-listing-feature-grid">
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Planning Classification:</span> <span class="body-xs">{{ property.Land?.planningClassification || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Land Size:</span> <span class="body-xs">{{ property.Land?.landSize ?? 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Access Rights:</span> <span class="body-xs">{{ property.Land?.accessRights ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Road Frontage:</span> <span class="body-xs">{{ property.Land?.roadFrontage ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Utilities Available:</span> <span class="body-xs">{{ property.Land?.utilitiesAvailable ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Current Use:</span> <span class="body-xs">{{ property.Land?.currentUse || 'N/A' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Agricultural Subsidies:</span> <span class="body-xs">{{ property.Land?.agriculturalSubsidies ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Stewardship Scheme:</span> <span class="body-xs">{{ property.Land?.stewardshipScheme ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Tenanted:</span> <span class="body-xs">{{ property.Land?.tenanted ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Vacant:</span> <span class="body-xs">{{ property.Land?.vacant ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Agricultural Use:</span> <span class="body-xs">{{ property.Land?.agriculturalUse ? 'Yes' : 'No' }}</span></div>
              <div class="p-listing-feature-card"><span class="font-medium body-xs">Description:</span> <span class="body-xs">{{ property.Land?.description || 'N/A' }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="p-listing-loader">
      <div class="text-center">
        <p class="title-sm">Loading...</p>
        <p class="body-xs">Please wait while we fetch the property details</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapMarker } from '~~/shared/types/map';
const { trackListingView } = useAnalytics()
const route = useRoute();
const listingId = route.params.id as string;
const listing = ref<ListingWithFullProperty | null>(null);
const url: string = `/api/listing/${listingId}`;
const { data } = await useAsyncData("listing", () => $fetch<ListingWithFullProperty>(url));
if (data.value) {
  listing.value = data.value;
}
const property = computed(() => {
  if (!listing.value || !listing.value.property) return undefined;
  return listing.value.property as typeof listing.value.property & { Land?: any };
});
const formattedMoveInDate = computed(() => formatMDY(listing.value?.moveInDate as Date));

const propertyMarkers = computed<MapMarker[]>(() => {
  if (!property.value?.address?.lat || !property.value.address.lon) return [];
  return [{
    id: property.value.id,
    lat: property.value.address.lat,
    lon: property.value.address.lon,
    bedrooms: property.value.bedroomFeatures?.length ?? null,
    bathrooms: property.value.bathroomFeatures?.length ?? null,
    price: listing.value?.price ?? null,
    hasNote: false,
    isFavorite: false
  }];
});

onMounted(() => {
  if (route.params.id) {
    trackListingView(route.params.id as string);
  }
});
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;
@use '#styles/_utils/media' as mq;

/* Header Section */
.p-listing-header {
  margin-bottom: var(--size-20);
  padding-bottom: var(--size-16);
  border-bottom: 1px solid var(--background-300);
}

.p-listing-title {
  font-weight: var(--font-bold);
  color: var(--foreground-100);
  line-height: var(--lineheight-xs);
}

.p-listing-action-buttons {
  transform-origin: center right;
  transition: transform var(--animation-fast);
  
  &:hover {
    transform: scale(1.05);
  }
}

/* Media Grid for property images */
.p-listing-media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--size-16);
  margin-bottom: var(--size-24);
}

.p-listing-media-image {
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--border-radius-lg);
  transition: transform var(--animation-fast), box-shadow var(--animation-fast);
  border: 1px solid var(--background-300);

  &:hover {
    transform: scale(0.98);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

/* Info grid for the key information panels */
.p-listing-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-20);
  margin-bottom: var(--size-32);
  
  @include mq.tablet {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .box {
    height: 100%;
    transition: transform var(--animation-fast), box-shadow var(--animation-fast);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  }
}

.p-listing-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-12);
}

/* Map container styles */
.p-listing-map-container {
  margin-bottom: var(--size-24);
}

.p-listing-map-inner {
  height:300px;
  width: 100%;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--background-300);
  position: relative;
}

/* Feature sections container */
.p-listing-features {
  margin-top: var(--size-16);
  background: var(--background-100); /* Lighter background like ListingCard */
  border: 1px solid var(--background-200);
}

/* Add margin to create separation between sections */
.mt-10 {
  margin-top: var(--size-40);
}

/* Section styling */
.section-container {
  padding-bottom: var(--size-24);
  border-bottom: 1px solid var(--background-300);
}

.section-heading {
  margin-bottom: var(--size-16);
  color: var(--foreground-100); /* Use foreground color that works in both light/dark mode */
  font-weight: var(--font-semibold);
}

/* Feature grids and cards */
.p-listing-feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--size-16);
}

.p-listing-feature-card {
  padding: var(--size-16);
  background-color: var(--background-200);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--background-300);
  transition: transform var(--animation-fast), box-shadow var(--animation-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
}

.p-listing-feature-detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-8);
  margin-top: var(--size-12);
  
  @include mq.small-tablet {
    grid-template-columns: 1fr 1fr;
  }
  
  div {
    padding: var(--size-6);
    border-radius: var(--border-radius-sm);
    transition: background-color var(--animation-fast);
    
    &:hover {
      background-color: var(--background-300);
    }
  }
}

.p-listing-feature-list {
  list-style: disc;
  padding-left: var(--size-20);
  font-size: var(--font-xs);
  color: var(--foreground-100); /* Ensures text is visible in both dark/light mode */
  
  li {
    margin-bottom: var(--size-8);
    position: relative;
    
    &::marker {
      color: var(--primary-400); /* Use primary color for list bullets */
    }
  }
}

.p-listing-amenity-item {
  padding: var(--size-12) 0;
  border-bottom: var(--divider-100);
  
  &:last-child {
    border-bottom: none;
  }
}

/* EPC Badge */
.p-listing-epc-badge {
  width: var(--size-48);
  height: var(--size-48);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  font-weight: var(--font-bold);
  font-size: var(--font-lg);
  color: var(--monochrome-100);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform var(--animation-fast);
  
  &:hover {
    transform: scale(1.05);
  }
}

/* Status badges */
.p-listing-badge {
  display: inline-flex;
  padding: var(--size-6) var(--size-12);
  border-radius: var(--border-radius-pill);
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  transition: transform var(--animation-fast);
  
  &:hover {
    transform: translateY(-1px);
  }
}

.p-listing-badge-primary {
  background: var(--primary-200);
  color: var(--primary-800);
  border: 1px solid var(--primary-300);
}

.p-listing-badge-secondary {
  background: var(--secondary-200);
  color: var(--secondary-800);
  border: 1px solid var(--secondary-300);
}

/* Loading state */
.p-listing-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background: var(--background-200);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--background-300);
}

/* Section title styling for dark-mode compatibility */
.p-listing-section-title {
  position: relative;
  display: inline-block;
  color: var(--foreground-100);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: var(--primary-400);
  }
}

/* Main Property Features title styling */
.p-listing-main-title {
  font-weight: var(--font-bold);
  color: var(--foreground-100);
  position: relative;
  display: inline-block;
  margin-bottom: var(--size-20);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: var(--primary-500);
  }
}
</style>
