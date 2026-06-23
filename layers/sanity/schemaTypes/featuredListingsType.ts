import {defineType} from 'sanity'

export const pageFeaturedListingsType = defineType({
  name: 'pageFeaturedListings',
  title: 'Featured Listings',
  type: 'document',
  fields: [
    {
      name: 'displayFeaturedListings',
      title: 'Display Featured Listings',
      type: 'boolean',
      initialValue: true,
      readOnly: true,
      hidden: true,
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Featured Listings',
        subtitle: 'Displays featured property listings',
      }
    },
  },
})
