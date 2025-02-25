export default defineEventHandler(async (event) => {
  const { email, username, password } = await readBody(event);

  // Trim and validate input
  const trimmedEmail = (email as string).trim();
  const trimmedUsername = (username as string).trim();
  const trimmedPassword = (password as string).trim();

  if (!trimmedEmail || !trimmedUsername || !trimmedPassword) {
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
  console.log(existingUser);
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
        email: trimmedEmail,
        username: trimmedUsername,
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
