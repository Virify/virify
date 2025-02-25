export default async function authDatabaseCheck(email: string, username: string) {
  try {
    // Check if the user already exists in the database
    let dbUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!dbUser) {
      // Create a new user if not found
      // intially set the username
      dbUser = await prisma.user.create({
        data: {
          email: email,
          username: username.replace(/\s/g,''),
        },
      });
      console.log('User created:', dbUser);
    } else {
      console.log('User exists - skipping');
    }

    return dbUser;
  } catch (error) {
    throw new Error(`Error finding or creating user: ${(error as Error).message}`);
  }
}