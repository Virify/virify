import { faker } from "@faker-js/faker";
import type { Prisma } from "../../../database/server/database/prisma/generated/client";
import { MembershipType } from "../../../database/server/database/prisma/generated/enums";
import { prisma } from "../../../database/server/utils/prisma-client";
import { generateSaleListing, generateRentalListing } from "./listing-faker";

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

export async function seedFakeUsers(count = 1): Promise<number[]> {
  const users: Prisma.UserCreateInput[] = [];
  const usedUsernames = new Set<string>();
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    let user = generateFakeUser();
    
    // Ensure unique username and email
    while (!user.username || !user.email || usedUsernames.has(user.username) || usedEmails.has(user.email)) {
      user = generateFakeUser();
    }
    
    // Add a unique suffix to be extra safe
    user.username = `${user.username}_${i}`;
    user.email = `${i}_${user.email}`;
    
    usedUsernames.add(user.username);
    usedEmails.add(user.email);
    users.push(user);
  }

  // Create all users first
  console.log(`Creating ${count} users...`);
  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: {
          ...user,
          verification: {
            create: {
              activated: 'ACTIVATED',
            },
          },
          membership: {
            create: {
              type: MembershipType.FREE,
            },
          },
        },
        select: {
          id: true,
        },
      })
    )
  );

  const allUserIds = createdUsers.map((u) => u.id);
  console.log(`Created ${allUserIds.length} users.`);

  return allUserIds;
}

/**
 * Distribute listings to users:
 * - Admin (user id 1) gets 15 listings
 * - Each other user gets 3-5 listings
 * - Each listing gets 2-5 enquiries
 * - Admin sends 10 enquiries to random listings
 */
export async function distributeListingsToUsers(userIds: number[]): Promise<void> {
  // Get all properties that don't have listings yet
  const allProperties = await prisma.property.findMany({
    select: {
      id: true,
      listing: {
        select: {
          id: true,
        },
      },
    },
  });

  const properties = allProperties.filter(p => p.listing.length === 0).map(p => ({ id: p.id }));

  if (properties.length === 0) {
    console.log("No properties available to create listings.");
    return;
  }

  console.log(`Distributing ${properties.length} properties as listings...`);

  let propertyIndex = 0;
  const ADMIN_ID = 1;
  const ADMIN_LISTINGS = 15;
  
  // Admin gets 15 listings
  console.log(`Creating ${ADMIN_LISTINGS} listings for admin...`);
  for (let i = 0; i < ADMIN_LISTINGS && propertyIndex < properties.length; i++) {
    const property = properties[propertyIndex];
    if (!property) continue;
    
    const isRental = Math.random() > 0.5;
    
    if (isRental) {
      await generateRentalListing(property.id, ADMIN_ID);
    } else {
      await generateSaleListing(property.id, ADMIN_ID);
    }
    
    propertyIndex++;
  }

  // Distribute remaining properties to other users (3-5 each)
  console.log(`Distributing remaining properties to ${userIds.length} users...`);
  let processedUsers = 0;
  
  for (const userId of userIds) {
    if (userId === ADMIN_ID) continue; // Skip admin
    
    const listingsForUser = faker.number.int({ min: 3, max: 5 });
    
    for (let i = 0; i < listingsForUser && propertyIndex < properties.length; i++) {
      const property = properties[propertyIndex];
      if (!property) continue;
      
      const isRental = Math.random() > 0.5;
      
      if (isRental) {
        await generateRentalListing(property.id, userId);
      } else {
        await generateSaleListing(property.id, userId);
      }
      
      propertyIndex++;
    }
    
    processedUsers++;
    
    if (processedUsers % 100 === 0) {
      console.log(`  Progress: ${processedUsers}/${userIds.length} users, ${propertyIndex} listings created...`);
    }
  }

  console.log(`✅ Created ${propertyIndex} total listings`);

  // Now seed conversations
  await seedConversations(userIds);
  
  // Seed fake user favourites and notes on admin listings
  await seedFakeUserFavouritesOnAdminListings(userIds);
}

/**
 * Seed conversations with realistic distribution:
 * - Each listing gets 2-5 enquiries
 * - Admin sends 10 enquiries to random listings
 */
async function seedConversations(userIds: number[]): Promise<void> {
  console.log("🗨️  Seeding conversations...");

  const listings = await prisma.listing.findMany({
    select: { id: true, userId: true },
  });

  if (listings.length === 0) {
    console.log("No listings found. Skipping conversation seeding.");
    return;
  }

  console.log(`Found ${listings.length} listings. Creating 2-5 enquiries per listing...`);

  const ADMIN_ID = 1;
  const BATCH_SIZE = 100;
  let totalConversations = 0;
  let totalMessages = 0;

  // Process listings in batches
  for (let batchStart = 0; batchStart < listings.length; batchStart += BATCH_SIZE) {
    const batch = listings.slice(batchStart, batchStart + BATCH_SIZE);
    const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(listings.length / BATCH_SIZE);

    console.log(`Processing batch ${batchNum}/${totalBatches} (listings ${batchStart + 1}-${batchStart + batch.length})...`);

    const conversationsToCreate = [];

    for (const listing of batch) {
      const numEnquiries = faker.number.int({ min: 2, max: 5 });
      const eligibleUsers = userIds.filter(id => id !== listing.userId);

      if (eligibleUsers.length === 0) continue;

      const selectedUsers = faker.helpers.arrayElements(
        eligibleUsers,
        Math.min(numEnquiries, eligibleUsers.length)
      );

      for (const senderId of selectedUsers) {
        conversationsToCreate.push({
          listingId: listing.id,
          senderId: senderId,
          receiverId: listing.userId ?? 1,
        });
      }
    }

    // Bulk create conversations
    if (conversationsToCreate.length > 0) {
      await prisma.conversation.createMany({
        data: conversationsToCreate,
      });

      totalConversations += conversationsToCreate.length;

      // Get created conversations
      const createdConversations = await prisma.conversation.findMany({
        where: {
          listingId: { in: batch.map(l => l.id) },
        },
        select: {
          id: true,
          senderId: true,
          receiverId: true,
        },
      });

      // Prepare messages
      const messagesToCreate = [];

      for (const conversation of createdConversations) {
        const messageCount = faker.number.int({ min: 3, max: 8 });

        for (let i = 0; i < messageCount; i++) {
          const isFromUser = faker.datatype.boolean();
          const isRead = i < messageCount - 2 ? true : faker.datatype.boolean();

          messagesToCreate.push({
            content: faker.lorem.sentences({ min: 1, max: 3 }),
            isRead: isRead,
            conversationId: conversation.id,
            senderId: isFromUser ? conversation.senderId : conversation.receiverId,
            receiverId: isFromUser ? conversation.receiverId : conversation.senderId,
            createdAt: new Date(Date.now() - (messageCount - i) * 1000 * 60 * 60),
          });
        }
      }

      // Bulk create messages
      if (messagesToCreate.length > 0) {
        await prisma.message.createMany({
          data: messagesToCreate,
        });
        totalMessages += messagesToCreate.length;
      }

      console.log(`  ✓ Batch ${batchNum}: ${conversationsToCreate.length} conversations, ${messagesToCreate.length} messages (Total: ${totalConversations} conversations, ${totalMessages} messages)`);
    }
  }

  // Admin enquiries: stress test amount (approx 600 total)
  console.log("👤 Creating admin enquiries...");
  
  // Admin sends 200 enquiries to other users' listings
  const nonAdminListings = listings.filter(l => l.userId !== ADMIN_ID);
  const adminSentListings = faker.helpers.arrayElements(nonAdminListings, Math.min(200, nonAdminListings.length));

  console.log(`  Creating ${adminSentListings.length} sent enquiries from admin...`);
  for (const listing of adminSentListings) {
    const conversation = await prisma.conversation.create({
      data: {
        listingId: listing.id,
        senderId: ADMIN_ID,
        receiverId: listing.userId ?? 1,
      },
    });

    const messageCount = faker.number.int({ min: 3, max: 8 });
    const messages = [];

    for (let i = 0; i < messageCount; i++) {
      const isFromAdmin = faker.datatype.boolean();
      const isRead = i < messageCount - 2 ? true : faker.datatype.boolean();

      messages.push({
        content: faker.lorem.sentences({ min: 1, max: 3 }),
        isRead: isRead,
        conversationId: conversation.id,
        senderId: isFromAdmin ? ADMIN_ID : (listing.userId ?? 1),
        receiverId: isFromAdmin ? (listing.userId ?? 1) : ADMIN_ID,
        createdAt: new Date(Date.now() - (messageCount - i) * 1000 * 60 * 60),
      });
    }

    await prisma.message.createMany({
      data: messages,
    });

    totalConversations++;
    totalMessages += messages.length;
  }

  // Admin receives 400+ enquiries on their listings
  const adminListings = listings.filter(l => l.userId === ADMIN_ID);
  console.log(`  Creating 400+ received enquiries to admin's ${adminListings.length} listings...`);
  
  let adminReceivedCount = 0;
  const targetReceived = 400;
  
  // Distribute enquiries across admin's listings
  while (adminReceivedCount < targetReceived && adminListings.length > 0) {
    for (const listing of adminListings) {
      if (adminReceivedCount >= targetReceived) break;
      
      // Pick a random user to send enquiry
      const eligibleUsers = userIds.filter(id => id !== ADMIN_ID);
      if (eligibleUsers.length === 0) break;
      
      const senderId = faker.helpers.arrayElement(eligibleUsers);
      
      const conversation = await prisma.conversation.create({
        data: {
          listingId: listing.id,
          senderId: senderId,
          receiverId: ADMIN_ID,
        },
      });

      const messageCount = faker.number.int({ min: 3, max: 8 });
      const messages = [];

      for (let i = 0; i < messageCount; i++) {
        const isFromSender = faker.datatype.boolean();
        const isRead = i < messageCount - 2 ? true : faker.datatype.boolean();

        messages.push({
          content: faker.lorem.sentences({ min: 1, max: 3 }),
          isRead: isRead,
          conversationId: conversation.id,
          senderId: isFromSender ? senderId : ADMIN_ID,
          receiverId: isFromSender ? ADMIN_ID : senderId,
          createdAt: new Date(Date.now() - (messageCount - i) * 1000 * 60 * 60),
        });
      }

      await prisma.message.createMany({
        data: messages,
      });

      totalConversations++;
      totalMessages += messages.length;
      adminReceivedCount++;
    }
  }

  console.log(`  ✓ Admin: ${adminSentListings.length} sent, ${adminReceivedCount} received enquiries`);
  console.log(`✅ Seeded ${totalConversations} conversations with ${totalMessages} messages`);
}

/**
 * Seed favourites and notes for fake users on admin's listings
 * This ensures admin's listings have analytics data (favourites, notes)
 */
export async function seedFakeUserFavouritesOnAdminListings(userIds: number[]): Promise<void> {
  console.log("⭐ Seeding fake user favourites and notes on admin's listings...");

  const ADMIN_ID = 1;
  
  // Get all admin listings
  const adminListings = await prisma.listing.findMany({
    where: { userId: ADMIN_ID },
    select: { id: true },
  });

  if (adminListings.length === 0) {
    console.log("No admin listings found. Skipping fake user favourites seeding.");
    return;
  }

  console.log(`Found ${adminListings.length} admin listings`);

  // Filter out admin from user list
  const fakeUsers = userIds.filter(id => id !== ADMIN_ID);
  
  if (fakeUsers.length === 0) {
    console.log("No fake users found. Skipping fake user favourites seeding.");
    return;
  }

  let totalFavourites = 0;
  let totalNotes = 0;

  // Each fake user has a chance to add some admin listings to favourites/notes
  for (const userId of fakeUsers) {
    // Each user favourites 0-5 admin listings
    const numFavourites = faker.number.int({ min: 0, max: 5 });
    if (numFavourites > 0) {
      const selectedFavourites = faker.helpers.arrayElements(
        adminListings,
        Math.min(numFavourites, adminListings.length)
      );

      for (const listing of selectedFavourites) {
        // Create or get user preferences
        const preferences = await prisma.userPreferences.upsert({
          where: { userId },
          create: { userId },
          update: {},
        });

        // Add to favourites
        await prisma.userFavouriteListing.create({
          data: {
            userPreferencesId: preferences.id,
            listingId: listing.id,
          },
        });

        totalFavourites++;
      }
    }

    // Each user adds notes to 0-5 admin listings (different from favourites)
    const numNotes = faker.number.int({ min: 0, max: 5 });
    if (numNotes > 0) {
      const selectedNotes = faker.helpers.arrayElements(
        adminListings,
        Math.min(numNotes, adminListings.length)
      );

      for (const listing of selectedNotes) {
        // Create or get user preferences
        const preferences = await prisma.userPreferences.upsert({
          where: { userId },
          create: { userId },
          update: {},
        });

        // Check if note already exists (avoid duplicates)
        const existingNote = await prisma.userNote.findFirst({
          where: {
            userPreferencesId: preferences.id,
            listingId: listing.id,
          },
        });

        if (!existingNote) {
          await prisma.userNote.create({
            data: {
              userPreferencesId: preferences.id,
              listingId: listing.id,
              note: faker.lorem.sentence(),
            },
          });

          totalNotes++;
        }
      }
    }
  }

  console.log(`✅ Created ${totalFavourites} favourites and ${totalNotes} notes from fake users on admin's listings`);
}
