import { stegaClean } from '@sanity/client/stega'
/**
 * Process feature sections from Sanity CMS
 * - Filters out incomplete sections
 * - Cleans stega encoding from strings used in business logic
 * - Conditionally determines which image props to pass
 * 
 * @param sections - Raw feature sections from Sanity
 * @returns Processed sections ready for component binding
 */
export function processFeatureSections(sections?: FeatureSection[]) {
  if (!sections) return []
  
  return sections
    .filter(s => s?.title && s?.subtitle && s?.features)
    .map(section => {
      const imageType = stegaClean(section.imageType)
      const imageSource = stegaClean(section.imageSource)
      const overlaidImagesSource = stegaClean(section.overlaidImagesSource)
      
      // Clean overlaid images strings if using Cloudflare
      const cleanedOverlaidImages = imageType === 'overlaid' && overlaidImagesSource === 'cloudflare' && section.overlaidImages
        ? {
            rear: stegaClean(section.overlaidImages.rear),
            rearAlt: stegaClean(section.overlaidImages.rearAlt),
            front: stegaClean(section.overlaidImages.front),
            frontAlt: stegaClean(section.overlaidImages.frontAlt),
          }
        : undefined
      
      const processed = {
        // Content props (keep stega for visual editing)
        subtitle: section.subtitle,
        features: section.features,
        title: section.title,
        
        // Image props (conditionally set based on type/source)
        image: imageType === 'single' && imageSource === 'cloudflare' ? stegaClean(section.image) : undefined,
        imageAlt: imageType === 'single' && imageSource === 'cloudflare' ? section.imageAlt : undefined,
        sanityImage: imageType === 'single' && imageSource === 'sanity' ? section.sanityImage : undefined,
        overlaidImages: cleanedOverlaidImages,
        overlaidSanityImages: imageType === 'overlaid' && overlaidImagesSource === 'sanity' ? section.overlaidSanityImages : undefined,
        
        // Layout props (cleaned for business logic, component has defaults)
        imagePosition: stegaClean(section.imagePosition) as 'left' | 'right' | undefined,
        background: stegaClean(section.background) as 'white' | 'gradient' | undefined,
        iconColor: stegaClean(section.iconColor) as 'orange' | 'blue' | undefined,
      }  
      return processed
    })
}
