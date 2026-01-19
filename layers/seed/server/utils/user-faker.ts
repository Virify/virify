import { faker } from "@faker-js/faker";
import type { Prisma } from "../../../database/server/database/prisma/generated/client";
import { MembershipType } from "../../../database/server/database/prisma/generated/enums";
import { prisma } from "../../../database/server/utils/prisma-client";

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
          membership: {
            create: {
              type: MembershipType.FREE,
            },
          }
        },
      });
    }
    return;
  }

  // Create users with unique favorites if listings exist - in parallel
  const userCreationPromises = users.map(async (user) => {
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
            },
          },
        },
        // Return the created user ID and the selected listing IDs
        select: {
          id: true,
        },
      });
      
      console.log(`Created user ${createdUser.id} with ${selectedIds.length} favorites`);
      return { userId: createdUser.id, selectedListingIds: selectedIds };
    } catch (error) {
      console.error("Error creating user with favorites:", error);
      return null;
    }
  });

  // Wait for all users to be created
  const createdUsersResults = await Promise.all(userCreationPromises);
  const createdUsers = createdUsersResults.filter(result => result !== null);
  
  // Now create conversations for all users after they've been created - in parallel
  console.log("Creating conversations for users...");
  const conversationPromises = createdUsers.map(async ({ userId, selectedListingIds }) => {
    try {
      // Create conversations and messages for each favorite listing
      const conversationCreationPromises = selectedListingIds.map(async (listingId) => {
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
            isRead: faker.datatype.boolean(),
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
        
        return conversation.id;
      });
      
      await Promise.all(conversationCreationPromises);
      console.log(`Created conversations and messages for user ${userId}`);
    } catch (error) {
      console.error(`Error creating conversations for user ${userId}:`, error);
    }
  });

  await Promise.all(conversationPromises);
}
