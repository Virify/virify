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

/**
 * Example geocoding feature for saved user locations
 */
export const geocodingFeature = {
  "type": "Feature",
  "geometry": {
      "type": "Point",
      "coordinates": [
          -3.1791935116052628,
          51.481654752296365
      ]
  },
  "place_name": "Cardiff, United Kingdom",
  "place_type": [
      "county"
  ],
  "language": "en",
  "text_en": "Cardiff",
  "language_en": "en",
  "place_name_en": "Cardiff, United Kingdom"
};

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
  const createdUsers = [];
  
  // First, create all users with their favorites
  for (const user of users) {
    try {
      // Get 3 unique random listing IDs for this user
      const availableIds = Array.from({ length: listingCount }, (_, i) => i + 1);
      const shuffledIds = availableIds.sort(() => Math.random() - 0.5);
      const selectedIds = shuffledIds.slice(0, Math.min(3, listingCount));

      const createdUser = await prisma.user.create({
        data: {
          ...user,
          verification: {
            create: {
              activated: true,
            },
          },
          preferences: {
            create: {
              favourites: {
                create: selectedIds.map((id) => ({ listingId: id })),
              },
              savedLocation: {
                create: [{
                  location: geocodingFeature.place_name_en,
                  geocodingFeature: geocodingFeature,
                  lat: Number(geocodingFeature.geometry.coordinates[1]),
                  lon: Number(geocodingFeature.geometry.coordinates[0]),
                  name: "my home location",
                }],
              },
            },
          },
        },
        // Return the created user ID and the selected listing IDs
        select: {
          id: true,
        },
      });
      
      // Store the created user and their selected listings for conversation creation
      createdUsers.push({ userId: createdUser.id, selectedListingIds: selectedIds });
      console.log(`Created user ${createdUser.id} with ${selectedIds.length} favorites`);
    } catch (error) {
      console.error("Error creating user with favorites:", error);
    }
  }
  
  // Now create conversations for all users after they've been created
  console.log("Creating conversations for users...");
  for (const { userId, selectedListingIds } of createdUsers) {
    try {
      // Create a conversation for each favorite listing
      for (const listingId of selectedListingIds) {
        // Create the conversation
        const conversation = await prisma.conversation.create({
          data: {
            listingId,
            senderId: userId,
            receiverId: 1,
          },
        });
        
        // Add an initial message to the conversation
        await prisma.message.create({
          data: {
            content: faker.lorem.sentence(),
            conversation: {
              connect: { id: conversation.id },
            },
            sender: {
              connect: { id: userId },
            },
            receiver: {
              connect: { id: 1 }, // Admin is the receiver of the message
            },
          },
        });
      }
      console.log(`Created conversations and messages for user ${userId}`);
    } catch (error) {
      console.error(`Error creating conversations for user ${userId}:`, error);
    }
  }
}
