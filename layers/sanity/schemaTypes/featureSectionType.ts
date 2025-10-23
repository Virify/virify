import {defineField, defineType} from 'sanity'

/**
 * Feature Section Type
 * Reusable component for displaying feature sections with images and feature lists
 */
export const featureSectionType = defineType({
  name: 'featureSection',
  title: 'Feature Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Use {gradient}text{/gradient} for gradient styling. For light gradient use {gradient-light}text{/gradient-light}',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Features List',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          title: 'Feature',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'iconSelect',
              validation: (rule) => rule.required(),
            },
            {
              name: 'title',
              title: 'Feature Title',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'description',
              title: 'Feature Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              icon: 'icon',
            },
            prepare({title, subtitle, icon}) {
              return {
                title: title || 'Untitled Feature',
                subtitle: subtitle || 'No description',
                media: undefined, // Could add icon preview here if needed
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1).max(8),
      description: 'List of features to display (1-8 items recommended)',
    }),
    defineField({
      name: 'imageType',
      title: 'Image Type',
      type: 'string',
      options: {
        list: [
          {title: 'Single Image', value: 'single'},
          {title: 'Overlaid Images', value: 'overlaid'},
        ],
        layout: 'radio',
      },
      initialValue: 'single',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imageSource',
      title: 'Image Source',
      type: 'string',
      options: {
        list: [
          {title: 'Cloudflare', value: 'cloudflare'},
          {title: 'Sanity', value: 'sanity'},
        ],
        layout: 'radio',
      },
      initialValue: 'cloudflare',
      description: 'Choose image source type',
      hidden: ({parent}) => parent?.imageType !== 'single',
      validation: (rule) => rule.custom((value, context) => {
        const parent = context.parent as any
        if (parent?.imageType === 'single' && !value) {
          return 'Image source is required for single images'
        }
        return true
      }),
    }),
    defineField({
      name: 'image',
      title: 'Cloudflare Image ID',
      type: 'string',
      description: 'Cloudflare image ID (e.g., "a9460506-cfd4-4920-3ccb-0b4ba4177800")',
      hidden: ({parent}) => parent?.imageType === 'overlaid' || parent?.imageSource === 'sanity',
    }),
    defineField({
      name: 'sanityImage',
      title: 'Sanity Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ],
      description: 'Upload image to Sanity',
      hidden: ({parent}) => parent?.imageType === 'overlaid' || parent?.imageSource === 'cloudflare',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image Alt Text',
      type: 'string',
      description: 'Alternative text for the main image (accessibility)',
      hidden: ({parent}) => parent?.imageType === 'overlaid' || parent?.imageSource === 'sanity',
    }),
    defineField({
      name: 'overlaidImagesSource',
      title: 'Overlaid Images Source',
      type: 'string',
      options: {
        list: [
          {title: 'Cloudflare', value: 'cloudflare'},
          {title: 'Sanity', value: 'sanity'},
        ],
        layout: 'radio',
      },
      initialValue: 'cloudflare',
      description: 'Choose image source type for overlaid images',
      hidden: ({parent}) => parent?.imageType !== 'overlaid',
      validation: (rule) => rule.custom((value, context) => {
        const parent = context.parent as any
        if (parent?.imageType === 'overlaid' && !value) {
          return 'Image source is required for overlaid images'
        }
        return true
      }),
    }),
    defineField({
      name: 'overlaidImages',
      title: 'Overlaid Images (Cloudflare)',
      type: 'object',
      hidden: ({parent}) => parent?.imageType !== 'overlaid' || parent?.overlaidImagesSource === 'sanity',
      fields: [
        {
          name: 'rear',
          title: 'Rear Image ID',
          type: 'string',
          description: 'Cloudflare image ID for rear image',
        },
        {
          name: 'rearAlt',
          title: 'Rear Image Alt Text',
          type: 'string',
          description: 'Alternative text for rear image',
        },
        {
          name: 'front',
          title: 'Front Image ID',
          type: 'string',
          description: 'Cloudflare image ID for front image',
        },
        {
          name: 'frontAlt',
          title: 'Front Image Alt Text',
          type: 'string',
          description: 'Alternative text for front image',
        },
      ],
    }),
    defineField({
      name: 'overlaidSanityImages',
      title: 'Overlaid Images (Sanity)',
      type: 'object',
      hidden: ({parent}) => parent?.imageType !== 'overlaid' || parent?.overlaidImagesSource === 'cloudflare',
      fields: [
        {
          name: 'rear',
          title: 'Rear Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }
          ],
        },
        {
          name: 'front',
          title: 'Front Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }
          ],
        },
      ],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'background',
      title: 'Background Style',
      type: 'string',
      options: {
        list: [
          {title: 'White', value: 'white'},
          {title: 'Gradient', value: 'gradient'},
        ],
        layout: 'radio',
      },
      initialValue: 'white',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'iconColor',
      title: 'Icon Color Theme',
      type: 'string',
      options: {
        list: [
          {title: 'Orange', value: 'orange'},
          {title: 'Blue', value: 'blue'},
        ],
        layout: 'radio',
      },
      initialValue: 'orange',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      imageType: 'imageType',
      background: 'background',
    },
    prepare({title, subtitle, imageType, background}) {
      return {
        title: title || 'Untitled Section',
        subtitle: `${imageType === 'overlaid' ? 'Overlaid' : 'Single'} | ${background} background | ${subtitle?.substring(0, 50) || 'No subtitle'}...`,
      }
    },
  },
})
