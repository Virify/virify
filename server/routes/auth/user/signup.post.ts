import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  // Trim and validate input
  const trimmedEmail = (email as string).trim();

  // Generate token
  const token = crypto.randomBytes(20).toString("hex");

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: trimmedEmail,
    },
  });

  if (existingUser) {
    if (existingUser.isActivated) {
      return {
        status: 400,
        body: {
          error: "Signup failed! User already exists",
        },
      };
    }

    // If the user is not activated, generate a new token and send activation email
    const newToken = crypto.randomBytes(20).toString("hex");
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        activationToken: newToken,
        activationExpires: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    try {
      await sendActivation(trimmedEmail, newToken);
      return {
        status: 400,
        body: { 
          error: "User exists but is not activated. Resending activation email..."
        },
      };
    } catch (error) {
      return {
        status: 500,
        body: {
          error: "Failed to send activation email",
          message: (error as Error).message,
        },
      };
    }
  }

  // Create new user and send activation email
  try {
    await sendActivation(trimmedEmail, token);
    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        activationToken: token,
        activationExpires: new Date(Date.now() + 3600000), // 1 hour
      },
    });
    return {
      status: 200,
      body: {
        message: "Activation email sent",
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: "Error creating user",
        message: (error as Error).message,
      },
    };
  }
});