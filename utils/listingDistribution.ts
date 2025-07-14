export interface ListingSection {
  type: 'premium' | 'grid-row';
  item?: ListingWithFullProperty;
  items?: ListingWithFullProperty[];
}

export function distributePremiumListings(results: ListingWithFullProperty[]): ListingSection[] {
  const premium = results.filter(listing => listing.listingTier === 'PREMIUM');
  const basicFeatured = results.filter(listing => listing.listingTier !== 'PREMIUM');
  
  const result: ListingSection[] = [];
  
  if (premium.length === 0) {
    // No premium cards, just return grid rows
    for (let i = 0; i < basicFeatured.length; i += 2) {
      result.push({
        type: 'grid-row',
        items: basicFeatured.slice(i, i + 2)
      });
    }
    return result;
  }
  
  // Add first premium at beginning
  result.push({
    type: 'premium',
    item: premium[0]
  });
  
  // Get middle premiums (excluding first and last)
  const middlePremiums = premium.slice(1, premium.length > 1 ? -1 : premium.length);
  
  // Group basic/featured into pairs for grid rows
  const gridRows: ListingSection[] = [];
  for (let i = 0; i < basicFeatured.length; i += 2) {
    gridRows.push({
      type: 'grid-row',
      items: basicFeatured.slice(i, i + 2)
    });
  }
  
  // If no middle premiums, just add all grid rows
  if (middlePremiums.length === 0) {
    result.push(...gridRows);
  } else {
    // Calculate spacing: every X grid rows, insert a middle premium
    const spacing = Math.floor(gridRows.length / middlePremiums.length);
    let premiumIndex = 0;
    
    for (let i = 0; i < gridRows.length; i++) {
      const gridRow = gridRows[i];
      if (gridRow) {
        result.push(gridRow);
      }
      
      // Insert middle premium at calculated intervals
      if (premiumIndex < middlePremiums.length && 
          (i + 1) % spacing === 0 && 
          (i + 1) < gridRows.length) { // Don't insert after last grid row
        result.push({
          type: 'premium',
          item: middlePremiums[premiumIndex]
        });
        premiumIndex++;
      }
    }
  }
  
  // Add last premium at end (if we have more than one)
  if (premium.length > 1) {
    result.push({
      type: 'premium',
      item: premium[premium.length - 1]
    });
  }
  
  return result;
}