export function mapToCardProps(result: ListingCardData) {
  const { id, price, rentalListing, saleListing, updatedAt, createdAt, property, user } = result;
  const { numberBedrooms, numberBathrooms, numberReceptions, type, classification, address, media, outdoorSpace, energyAndUtilities } = property;

  const saleOrRent: "buy" | "rent" = rentalListing ? "rent" : "buy";
  const propertyDesc = [classification?.name, type?.name].filter(Boolean).join(", ");
  const overview = numberBedrooms ? `${numberBedrooms} Bed ${propertyDesc}` : propertyDesc;
  const overviewAddress = [address.street, address.city, address.postcode?.split(" ")[0]].filter(Boolean).join(", ");

  const labels: string[] = [];
  if (saleListing) {
    const tenure = getTenureType(saleListing.tenureType);
    if (tenure) labels.push(tenure);
    if (saleListing.chain) labels.push("Chain free");
  } else if (rentalListing) {
    const furnished = convertEnumToString((rentalListing as any).furnishedStatus);
    if (furnished) labels.push(furnished);
  }

  const hasGarden = isPopulatedArray(outdoorSpace?.garden) || isPopulatedArray(outdoorSpace?.yard) || isPopulatedArray(outdoorSpace?.land);
  const hasRenewables = isPopulatedArray(energyAndUtilities?.renewables);

  const icons = [
    numberBedrooms ? { icon: "property/bedrooms", count: numberBedrooms, label: "Bedrooms" } : null,
    numberBathrooms ? { icon: "property/bathrooms", count: numberBathrooms, label: "Bathrooms" } : null,
    numberReceptions ? { icon: "property/receptions", count: numberReceptions, label: "Receptions" } : null,
    hasGarden ? { icon: "property/land", label: "Garden" } : null,
    hasRenewables ? { icon: "property/utility", label: "Renewables" } : null,
  ].filter(Boolean) as { icon: string; count?: number; label: string }[];

  const dateChanged = (updatedAt ?? createdAt)?.toString();

  return {
    saleOrRent,
    propertyImage: media?.[0]?.image ?? undefined,
    carouselImages: media?.map(row => row?.image).filter(Boolean),
    propertyImageAlt: overview,
    price: numberToCurrency(Math.floor(price)),
    rentFrequency: rentalListing ? convertEnumToString(rentalListing.rentFrequency) : undefined,
    priceLabel: saleListing ? convertEnumToString(saleListing.priceType) : undefined,
    overview,
    overviewAddress,
    dateChanged,
    dateChangedType: updatedAt ? "Updated" : "Added",
    labels,
    icons,
    sellerName: user.username,
    sellerImage: user.avatar ?? undefined,
    viewUrl: `/listing/${id}`,
    listingId: id,
    userId: user.id,
  };
}
