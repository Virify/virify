import crypto from "crypto";

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
  const user = await prisma.user.findFirst({
    where: {
      activationToken: token as string,
    },
  });

  // if the user has a token but its expired send another email
  if (user && user.activationExpires && new Date(user.activationExpires) < new Date()) {
    // generate new token
    const newToken = crypto.randomBytes(20).toString("hex");
    // update the user with the new token and expiry
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        activationToken: newToken,
        activationExpires: new Date(Date.now() + 3600000), // 1 hour
      },
    });
    // send email
    await sendActivation(email as string, newToken);

    return {
      status: 400,
      body: { error: "Failed! Token expired, new activation email sent" },
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
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      isActivated: true,
      activationToken: null,
      activationExpires: null,
    },
  });

  return {
    status: 200,
    body: {
      message: "User activated",
    },
  };
});
