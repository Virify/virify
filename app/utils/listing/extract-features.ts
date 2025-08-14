/**
 * Extract boolean features from an object and format them for display
 */
export const getFeatures = (item: any): string[] => {
  return Object.entries(item)
    .filter(([, value]) => typeof value === 'boolean' && value === true)
    .map(([key]) => key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
    );
};