export interface ListingSection {
  type: "premium" | "grid-row";
  item?: ListingWithFullProperty;
  items?: ListingWithFullProperty[];
}

/** Groups listings into pairs for grid display */
function createGridRows(listings: ListingWithFullProperty[]): ListingSection[] {
  const gridRows: ListingSection[] = [];
  for (let i = 0; i < listings.length; i += 2) {
    gridRows.push({
      type: "grid-row",
      items: listings.slice(i, i + 2),
    });
  }
  return gridRows;
}

/** Creates a premium listing section */
function createPremiumSection(
  listing: ListingWithFullProperty
): ListingSection {
  return {
    type: "premium",
    item: listing,
  };
}

/** Inserts premium listings between grid rows at calculated intervals */
function interleaveGridRowsWithPremiums(
  gridRows: ListingSection[],
  middlePremiums: ListingWithFullProperty[]
): ListingSection[] {
  const result: ListingSection[] = [];

  if (middlePremiums.length === 0) {
    return gridRows;
  }

  // Calculate even spacing for middle premiums
  // We want to distribute middle premiums evenly across the available grid row positions
  const totalPositions = gridRows.length;
  const premiumCount = middlePremiums.length;
  
  // Calculate positions where premiums should be inserted
  const premiumPositions: number[] = [];
  
  if (premiumCount > 0) {
    // For even distribution, divide the total positions into equal segments
    const segmentSize = totalPositions / (premiumCount + 1);
    
    for (let i = 0; i < premiumCount; i++) {
      // Place premium at the end of each segment (except the last one)
      const position = Math.floor(segmentSize * (i + 1)) - 1;
      premiumPositions.push(Math.max(0, Math.min(position, totalPositions - 2)));
    }
  }

  let premiumIndex = 0;

  for (let i = 0; i < gridRows.length; i++) {
    const gridRow = gridRows[i];
    if (gridRow) {
      result.push(gridRow);
    }

    // Insert premium at calculated positions
    if (
      premiumIndex < premiumPositions.length &&
      i === premiumPositions[premiumIndex] &&
      premiumIndex < middlePremiums.length
    ) {
      const premiumListing = middlePremiums[premiumIndex];
      if (premiumListing) {
        result.push(createPremiumSection(premiumListing));
      }
      premiumIndex++;
    }
  }

  return result;
}

/** Splits listings into premium and basic/featured groups */
function separateListingsByTier(results: ListingWithFullProperty[]) {
  const premium = results.filter(
    (listing) => listing.listingTier === "PREMIUM"
  );
  const basicFeatured = results.filter(
    (listing) => listing.listingTier !== "PREMIUM"
  );
  return { premium, basicFeatured };
}

/** Distributes listings with premium cards at start, middle intervals, and end */
export function distributePremiumListings(
  results: ListingWithFullProperty[]
): ListingSection[] {
  const { premium, basicFeatured } = separateListingsByTier(results);
  const result: ListingSection[] = [];

  // Handle case with no premium listings
  if (premium.length === 0) {
    return createGridRows(basicFeatured);
  }

  // Add first premium at beginning
  const firstPremium = premium[0];
  if (firstPremium) {
    result.push(createPremiumSection(firstPremium));
  }

  // Create grid rows from basic/featured listings
  const gridRows = createGridRows(basicFeatured);

  // Get middle premiums (excluding first and last)
  const middlePremiums = premium.slice(
    1,
    premium.length > 1 ? -1 : premium.length
  );

  // Interleave grid rows with middle premiums
  const interleavedContent = interleaveGridRowsWithPremiums(
    gridRows,
    middlePremiums
  );
  result.push(...interleavedContent);

  // Add last premium at end (if we have more than one)
  if (premium.length > 1) {
    const lastPremium = premium[premium.length - 1];
    if (lastPremium) {
      result.push(createPremiumSection(lastPremium));
    }
  }

  return result;
}
