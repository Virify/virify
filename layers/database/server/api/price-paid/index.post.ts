import * as z from "zod";

const ppdSchema = z.object({
  postcode: z.string(),
});

const propertyTypeMap: Record<string, string> = {
  'D': 'Detached',
  'S': 'Semi-detached',
  'T': 'Terraced',
  'F': 'Flats/Maisonettes',
  'O': 'Other'
};

const durationMap: Record<string, string> = {
  'F': 'Freehold',
  'L': 'Leasehold'
};

export default defineEventHandler(async (event) => {
  const { postcode } = await readValidatedBody(event, ppdSchema.parse);

  // Example usage of the Prisma clients
  const ppdData = await ppdPrisma.pricePaid.findMany({
    where: {
      postcode: postcode.toUpperCase(),
    },
    orderBy: {
      transfer_date: "desc",
    },
  });

  const mappedData = ppdData.map(item => {
    // Clean address: number, street, city, postcode only
    const addressParts = [
      item.saon, // flat number if exists
      item.paon, // property number
      item.street,
      item.town_city,
      item.postcode
    ].filter(Boolean);
    
    return {
      ...item,
      property_type_display: propertyTypeMap[item.property_type || ''] || item.property_type,
      duration_display: durationMap[item.duration || ''] || item.duration,
      full_address: addressParts.join(', ')
    };
  });

  // Group by address
  const groupedData = mappedData.reduce((acc, item) => {
    const key = item.full_address;
    if (!acc[key]) {
      acc[key] = {
        full_address: item.full_address,
        property_type_display: item.property_type_display,
        duration_display: item.duration_display,
        sales: []
      };
    }
    acc[key].sales.push({
      price: item.price,
      transfer_date: item.transfer_date,
      transaction_id: item.transaction_id
    });
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort sales by date
  const groupedArray = Object.values(groupedData).map(group => ({
    ...group,
    sales: group.sales.sort((a: any, b: any) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime())
  }));

  return {data: groupedArray};
});
