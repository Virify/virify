import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

export function generateFakeUser(): Prisma.UserCreateInput {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    phoneNumber: faker.phone.number(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function seedFakeUsers(count = 1): Promise<void> {
  const users: Prisma.UserCreateInput[] = [];

  for (let i = 0; i < count; i++) {
    users.push(generateFakeUser());
  }

  // First, let's get the actual count of listings in the database
  const listingCount = await prisma.listing.count();
  console.log(`Found ${listingCount} listings in the database for favorites`);

  if (listingCount === 0) {
    console.log("No listings found in database. Creating users without favorites.");

    // Create users without favorites if no listings exist
    for (const user of users) {
      await prisma.user.create({
        data: {
          ...user,
          verification: {
            create: {
              activated: true,
            },
          },
        },
      });
    }
    return;
  }

  // Create users with unique favorites if listings exist
  for (const user of users) {
    try {
      // Get 3 unique random listing IDs for this user
      const availableIds = Array.from({ length: listingCount }, (_, i) => i + 1);
      const shuffledIds = availableIds.sort(() => Math.random() - 0.5);
      const selectedIds = shuffledIds.slice(0, Math.min(3, listingCount));

      await prisma.user.create({
        data: {
          ...user,
          verification: {
            create: {
              activated: true,
            },
          },
          favourites: {
            create: {
              favourites: {
                create: selectedIds.map((id) => ({ listingId: id })),
              },
            },
          },
        },
      });

      console.log(`Created user with ${selectedIds.length} favorites`);
    } catch (error) {
      console.error("Error creating user with favorites:", error);
    }
  }
}
