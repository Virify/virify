export default async function oauthDatabaseCheck(email: string, password?: string) {
  try {
    // Check if the user already exists in the database
    let dbUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!dbUser) {
      if(password) {
        dbUser = await prisma.user.create({
          data: {
            email: email,
            password: password,
          },
        });
      } else {
        dbUser = await prisma.user.create({
          data: {
            email: email,
          },
        });
      }
      console.log("User created:", dbUser);
    } else {
      console.log("User exists - skipping");
    }

    return dbUser;
  } catch (error) {
    throw new Error(`Error finding or creating user: ${(error as Error).message}`);
  }
}
