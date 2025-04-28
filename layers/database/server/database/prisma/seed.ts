import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
  const types = {
    House: ["Terraced", "Semi-detached", "End of terrace", "Detached", "Mansion"],
    Cottage: ["Terraced", "Detached", "Semi-detached", "End of terrace"],
    Bungalow: ["Terraced", "Semi-detached", "End of terrace", "Detached"],
    Flat: ["Converted flat", "Studio flat", "Maisonette", "High-rise", "Within a complex", "Penthouse"],
    Land: ["Residential Land", "Commercial Land", "Agricultural Land", "Development plot", "Development potential"],
    Farms: ["Non-working Farmhouse", "Working Farm", "Small Holding"],
    Specialty: ["Shared Ownership", "Retirement Homes", "New Build Homes"],
    "Student Accommodation": ["Flat", "House", "House-share"],
  };
  

  for (const [typeName, classification] of Object.entries(types)) {
    const createTypes = await prisma.propertyType.create({
      data: {
        name: typeName,
        classifications: {
          create: classification.map((name) => ({ name })),
        },
      },
    });

    if (classification.length === 0) {
      console.log(`Seeded category '${typeName}' with no subtypes.`);
    }
  }

  console.log("✅ Seed complete");
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
