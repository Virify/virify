/**
 * Utility functions for sorting search results
 */

export const applySortToResults = (results: ListingWithFullProperty[], sortBy: string): ListingWithFullProperty[] => {
  if (sortBy === 'relevance' || !results) return results;

  const sortFunctions = {
    'price-asc': (a: ListingWithFullProperty, b: ListingWithFullProperty) => (a.price || 0) - (b.price || 0),
    'price-desc': (a: ListingWithFullProperty, b: ListingWithFullProperty) => (b.price || 0) - (a.price || 0),
    'date-asc': (a: ListingWithFullProperty, b: ListingWithFullProperty) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    'date-desc': (a: ListingWithFullProperty, b: ListingWithFullProperty) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  };

  const sortFn = sortFunctions[sortBy as keyof typeof sortFunctions];
  return sortFn ? [...results].sort(sortFn) : results;
};