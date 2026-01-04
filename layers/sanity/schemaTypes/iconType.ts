import {defineType} from 'sanity'

/**
 * Reusable icon type for Sanity
 * Includes all available icons from the sprite system
 */
export const iconType = defineType({
  name: 'iconSelect',
  title: 'Icon',
  type: 'string',
  options: {
    list: [
      // Account icons
      {title: 'Account Preferences', value: 'account/account-preferences'},
      {title: 'Billing', value: 'account/billing'},
      {title: 'Chat', value: 'account/chat'},
      {title: 'Dashboard', value: 'account/dash'},
      {title: 'Dashboard Home', value: 'account/dash-home'},
      {title: 'Enquiry', value: 'account/enquiry'},
      {title: 'Logout', value: 'account/logout'},
      {title: 'Notifications', value: 'account/notifications'},
      {title: 'Offer', value: 'account/offer'},
      {title: 'Offers', value: 'account/offers'},
      {title: 'Read', value: 'account/read'},
      {title: 'Sent', value: 'account/sent'},
      {title: 'Settings', value: 'account/settings'},
      {title: 'Viewing', value: 'account/viewing'},
      
      // AI icons
      {title: 'AI Close', value: 'ai/close'},
      {title: 'AI Edit', value: 'ai/edit'},
      {title: 'AI Prompt', value: 'ai/prompt'},
      {title: 'AI Send', value: 'ai/send'},
      {title: 'AI Star', value: 'ai/star'},
      
      // Amenities
      {title: 'Hospital', value: 'amenities/hospital'},
      {title: 'School', value: 'amenities/school'},
      {title: 'Train Station', value: 'amenities/train'},
      
      // Animated
      {title: 'Animated Dots', value: 'animated-dots/animated-dots'},
      
      // Cards
      {title: 'Bathrooms', value: 'cards/bathrooms'},
      {title: 'Beds', value: 'cards/beds'},
      {title: 'Contract', value: 'cards/contract'},
      {title: 'Expand', value: 'cards/expand'},
      {title: 'Favourite', value: 'cards/favourite'},
      {title: 'Favourite Filled', value: 'cards/favourite-filled'},
      {title: 'Notes', value: 'cards/notes'},
      {title: 'Property Type', value: 'cards/property-type'},
      {title: 'Verified', value: 'cards/verified'},
      
      // Content
      {title: 'Content Billing', value: 'content/billing'},
      {title: 'Content Contract', value: 'content/contract'},
      {title: 'Content Enquiry', value: 'content/enquiry'},
      {title: 'Content House', value: 'content/house'},
      {title: 'Content Info', value: 'content/info'},
      {title: 'Content Map', value: 'content/map'},
      {title: 'Content Savings', value: 'content/savings'},
      {title: 'Content Search', value: 'content/search'},
      {title: 'Content Security', value: 'content/security'},
      {title: 'Content Settings', value: 'content/settings'},
      
      // Errors
      {title: 'Error', value: 'errors/error'},
      
      // Explore
      {title: 'AI Explore', value: 'explore/ai'},
      {title: 'Hot', value: 'explore/hot'},
      {title: 'Explore Map', value: 'explore/map'},
      {title: 'Top Picks', value: 'explore/top-picks'},
      {title: 'Explore Trending', value: 'explore/trending'},
      
      // Listings
      {title: 'Listing Bathrooms', value: 'listings/bathrooms'},
      {title: 'Listing Beds', value: 'listings/beds'},
      {title: 'Listing Contract', value: 'listings/contract'},
      {title: 'Eco', value: 'listings/eco'},
      {title: 'Flood', value: 'listings/flood'},
      {title: 'Listing Map', value: 'listings/map'},
      {title: 'Listing Property Type', value: 'listings/property-type'},
      {title: 'Risk', value: 'listings/risk'},
      {title: 'Savings', value: 'listings/savings'},
      {title: 'Signal', value: 'listings/signal'},
      {title: 'Speed', value: 'listings/speed'},
      {title: 'Street View', value: 'listings/streetview'},
      
      // Logo
      {title: 'Logo Horizontal', value: 'logo/horizontal-colour'},
      
      // Map
      {title: 'Favourite Marker', value: 'map/fav-marker'},
      {title: 'Map Marker', value: 'map/marker'},
      {title: 'Marker Basic', value: 'map/marker-basic'},
      {title: 'Marker Favourite', value: 'map/marker-fav'},
      {title: 'Marker Featured', value: 'map/marker-featured'},
      {title: 'Marker Premium', value: 'map/marker-premium'},
      
      // Property
      {title: 'Access', value: 'property/access'},
      {title: 'Property Bathrooms', value: 'property/bathrooms'},
      {title: 'Property Bedrooms', value: 'property/bedrooms'},
      {title: 'Bungalow', value: 'property/bungalow'},
      {title: 'Cottage', value: 'property/cottage'},
      {title: 'Detached', value: 'property/detatched'},
      {title: 'Dining Room', value: 'property/dining-room'},
      {title: 'Farm', value: 'property/farm'},
      {title: 'Feature', value: 'property/feature'},
      {title: 'Flat', value: 'property/flat'},
      {title: 'Floor', value: 'property/floor'},
      {title: 'Front Garden', value: 'property/front-garden'},
      {title: 'Gym', value: 'property/gym'},
      {title: 'House', value: 'property/house'},
      {title: 'Property Info', value: 'property/info'},
      {title: 'Kitchen', value: 'property/kitchen'},
      {title: 'Land', value: 'property/land'},
      {title: 'Mansion', value: 'property/mansion'},
      {title: 'New Build', value: 'property/newbuild'},
      {title: 'Other', value: 'property/other'},
      {title: 'Other Room', value: 'property/other-room'},
      {title: 'Parking', value: 'property/parking'},
      {title: 'Rear Garden', value: 'property/rear-garden'},
      {title: 'Receptions', value: 'property/receptions'},
      {title: 'Property Security', value: 'property/security'},
      {title: 'Semi Detached', value: 'property/semi-detatched'},
      {title: 'Shared', value: 'property/shared'},
      {title: 'Size', value: 'property/size'},
      {title: 'Storage', value: 'property/storage'},
      {title: 'Terraced', value: 'property/terraced'},
      {title: 'Utility', value: 'property/utility'},
      {title: 'Work', value: 'property/work'},
      
      // Search
      {title: 'Filter', value: 'search/filter'},
      {title: 'Grid', value: 'search/grid'},
      {title: 'History', value: 'search/history'},
      {title: 'Location', value: 'search/location'},
      {title: 'Search Map', value: 'search/map'},
      {title: 'Pin', value: 'search/pin'},
      {title: 'Remove', value: 'search/remove'},
      {title: 'Sort', value: 'search/sort'},
      {title: 'Split', value: 'search/split'},
      {title: 'Search Trending', value: 'search/trending'},
    ],
  },
})
