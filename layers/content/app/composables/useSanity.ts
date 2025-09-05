/**
 * Composables for fetching data from Sanity CMS via API routes.
 * @returns An object containing methods to fetch categories, guide by slug, and category by slug.
 */
export const useSanity = () => {

  /**
   * A async data fetcher for guide categories from the Sanity CMS.
   * Filters out categories with no guides.
   * @returns A async data fetcher for guide categories with guides only.
   */
  const useCategories = () => {
    return useAsyncData('guide-categories', async () => {
      const categories = await $fetch<CategoriesResponse>('/api/sanity/categories')
      return categories.filter(category => (category.guideCount ?? 0) > 0)
    })
  }

  /**
   * A async data fetcher for a guide by slug from the Sanity CMS.
   * @param slug The slug of the guide to fetch.
   * @returns A async data fetcher for a guide by slug from the Sanity CMS.
   */
  const useGuideBySlug = (slug: string) => {
    return useAsyncData(`guide-${slug}`, () => 
      $fetch<GuideResponse>(`/api/sanity/guide/${slug}`)
    )
  }

  /**
   * A async data fetcher for a category by slug from the Sanity CMS.
   * @param slug The slug of the category to fetch.
   * @returns A async data fetcher for a category by slug from the Sanity CMS.
   */
  const useCategoryBySlug = (slug: string) => {
    return useAsyncData(`category-${slug}`, () => 
      $fetch<CategoryWithGuidesResponse>(`/api/sanity/categories/${slug}`)
    )
  }

  return {
    useCategories,
    useGuideBySlug,
    useCategoryBySlug
  }
}