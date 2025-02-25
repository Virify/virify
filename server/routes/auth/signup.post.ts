export default defineEventHandler(async (event) => {
  const { email, username, password } = await readBody(event);
  const hashedPassword = await hashPassword(password as string);
  // we need to check that the user does not already exist
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });
  if (existingUser) {
    return {
      status: 409,
      body: {
        error: "User already exists",
      },
    };
  } else {
    const user = await prisma.user.create({
      data: {
        email: email as string,
        username: username as string,
        password: hashedPassword,
      },
    });
    return {
      status: 201,
      body: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
});
