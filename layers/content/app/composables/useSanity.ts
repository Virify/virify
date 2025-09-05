/**
 * Composables for fetching data from Sanity CMS via API routes.
 * @returns An object containing methods to fetch categories, guide by slug, and category by slug.
 */
export const useSanity = () => {

  /**
   * A lazy async data fetcher for guide categories from the Sanity CMS.
   * @returns A lazy async data fetcher for guide categories from the Sanity CMS.
   */
  const useCategories = () => {
    return useLazyAsyncData('guide-categories', () => 
      $fetch<CategoriesResponse>('/api/sanity/categories')
    )
  }

  /**
   * A lazy async data fetcher for a guide by slug from the Sanity CMS.
   * @param slug The slug of the guide to fetch.
   * @returns A lazy async data fetcher for a guide by slug from the Sanity CMS.
   */
  const useGuideBySlug = (slug: string) => {
    return useLazyAsyncData(`guide-${slug}`, () => 
      $fetch<GuideResponse>(`/api/sanity/guide/${slug}`)
    )
  }

  /**
   * A lazy async data fetcher for a category by slug from the Sanity CMS.
   * @param slug The slug of the category to fetch.
   * @returns A lazy async data fetcher for a category by slug from the Sanity CMS.
   */
  const useCategoryBySlug = (slug: string) => {
    return useLazyAsyncData(`category-${slug}`, () => 
      $fetch<CategoryWithGuidesResponse>(`/api/sanity/categories/${slug}`)
    )
  }

  return {
    useCategories,
    useGuideBySlug,
    useCategoryBySlug
  }
}