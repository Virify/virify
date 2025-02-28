export default defineEventHandler(async (event) => {
  const { password, token, email } = await readBody(event);
  console.log(password, token, email);
  // Check if token, email, and password are provided
  if (token === undefined || email === undefined || password === undefined) {
    return {
      status: 400,
      body: {
        error: "Failed! Invalid request",
      },
    };
  }

  // Find the user by token and ensure the token is still valid
  const user = await prisma.owner.findUnique({
    where: {
      activationToken: token as string,
    },
  });

  // check if user is already activated
  if (user && user.isActivated === true) {
    return {
      status: 400,
      body: {
        error: "Failed! User already activated",
      },
    };
  }
  // if the user has a token but its expired send another email
  if (user && user.tokenExpiry && new Date(user.tokenExpiry) < new Date()) {
    return {
      status: 400,
      body: { error: "Failed! Token expired, Please try signing up again with your email to issue a new email" },
    };
  }
  // Check if the user exists and the token is valid
  if (!user) {
    return {
      status: 400,
      body: {
        error: "Failed! Token invalid",
      },
    };
  }

  // Check if the user is already activated
  if (user.isActivated) {
    return {
      status: 400,
      body: {
        error: "Failed! User already activated",
      },
    };
  }

  // Hash the new password
  const hashedPassword = await hashPassword(password as string);

  // Update the user with the new password and set the account as activated
  await prisma.owner.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      isActivated: true,
      activationToken: null,
      tokenExpiry: null,
    },
  });

  return {
    status: 200,
    body: {
      message: "User activated",
    },
  };
});
