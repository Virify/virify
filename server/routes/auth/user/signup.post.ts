import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  // Trim and validate input
  const trimmedEmail = (email as string).trim();

  // generate token
  const token = crypto.randomBytes(20).toString("hex");

  // check if user already exists
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
    if (existingUser.isActivated === false && existingUser.activationToken) {
      // generate new token
      const newToken = crypto.randomBytes(20).toString("hex");
      // update the user with the new token and expiry
      await prisma.user.update({
        where: {
          id: existingUser.id,
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
    return {
      status: 400,
      body: {
        error: "Signup failed! User already exists",
      },
    };
  }
  if (existingUser) {
    return {
      status: 400,
      body: {
        error: "Signup failed! User already activated",
      },
    };
  }

  if (!existingUser) {
    try {
      await sendActivation(email, token);
      const user = await prisma.user.create({
        data: {
          email: email as string,
          activationToken: token,
          activationExpires: new Date(Date.now() + 3600000), // 1 hour
        },
      });
      return {
        status: 200,
        body: {
          message: "Activation email sent",
          data: user,
        },
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error creating user",
        error: (error as Error).message!,
      };
    }
  }
});
