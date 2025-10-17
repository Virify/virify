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
   * A async data fetcher for navigation data including categories with their guides.
   * @returns A async data fetcher for navigation structure with categories and guides.
   */
  const useNavigationData = () => {
    return useAsyncData('navigation-data', () => 
      $fetch('/api/sanity/navigation')
    )
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

  /**
   * A async data fetcher for the Terms & Conditions from Sanity CMS.
   * @returns A async data fetcher for terms document.
   */
  const useTerms = () => {
    return useAsyncData('terms', () => 
      $fetch<TermsResponse>('/api/sanity/terms')
    )
  }

  /**
   * A async data fetcher for the Privacy Policy from Sanity CMS.
   * @returns A async data fetcher for privacy policy document.
   */
  const usePrivacy = () => {
    return useAsyncData('privacy', () => 
      $fetch<PrivacyResponse>('/api/sanity/privacy')
    )
  }

  /**
   * A async data fetcher for the Cookie Policy from Sanity CMS.
   * @returns A async data fetcher for cookie policy document.
   */
  const useCookie = () => {
    return useAsyncData('cookie', () => 
      $fetch<CookieResponse>('/api/sanity/cookie')
    )
  }

  /**
   * Helper to build a guide URL from a slug or expanded reference
   * @param slugOrRef string or object with slug.current
   */
  const guideUrl = (slugOrRef: any) => {
    if (!slugOrRef) return '#'
    if (typeof slugOrRef === 'string') return `/guides/${slugOrRef}`
    return slugOrRef?.slug?.current ? `/guides/${slugOrRef.slug.current}` : '#'
  }

  return {
    useCategories,
    useNavigationData,
    useGuideBySlug,
    useCategoryBySlug,
    useTerms,
    usePrivacy,
    useCookie,
    guideUrl
  }
}