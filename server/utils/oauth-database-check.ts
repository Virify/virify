export default async function oauthDatabaseCheck(email: string) {
  try {
    // Check if the user already exists in the database
    let dbUser = await prisma.owner.findUnique({
      where: {
        email: email,
      },
    });
    if (!dbUser) {
      dbUser = await prisma.owner.create({
        data: {
          email: email,
        },
      });

      console.log("User created:", dbUser);
    } else {
      console.log("User exists - skipping");
    }

    return dbUser;
    
  } catch (error) {
    throw new Error(`Error finding or creating user: ${(error as Error).message}`);
  }
}
