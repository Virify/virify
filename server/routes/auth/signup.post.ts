export default defineEventHandler(async (event) => {
  const { email, username, password } = await readBody(event);

  // Trim and validate input
  const trimmedEmail = (email as string).trim();
  const trimmedPassword = (password as string).trim();

  if (!trimmedEmail || !trimmedPassword) {
    return {
      status: 400,
      body: {
        error: "All fields are required",
      },
    };
  }

  if (!validateEmail(trimmedEmail)) {
    return {
      status: 400,
      body: {
        error: "Invalid email format",
      },
    };
  }

  const hashedPassword = await hashPassword(trimmedPassword);

  // Check that the user does not already exist
  const existingUser = await prisma.user.findUnique({
    where: {
      email: trimmedEmail,
    },
  });

  if (existingUser && existingUser.password) {
    return {
      status: 409,
      body: {
        error: "User already exists",
      },
    };
  }
  // if user exists but does not have a password, update the user with the password
  // example: if the used has logged in via OAuth
  if (existingUser && !existingUser.password) {
    const user = await prisma.user.update({
      where: {
        email: trimmedEmail,
      },
      data: {
        email: trimmedEmail,
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

  // if user does not exist, create a new user
  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
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
