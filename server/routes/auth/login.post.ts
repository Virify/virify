export default defineEventHandler(async (event) => {
  // Get email and password from form data
  const { email, password } = await readBody(event);

  // Trim and validate input
  const trimmedEmail = (email as string).trim();
  const trimmedPassword = (password as string).trim();

  if (!trimmedEmail || !trimmedPassword) {
    return {
      status: 400,
      body: {
        error: "Email and password are required",
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

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: trimmedEmail,
      },
    });

    if (!user) {
      return {
        status: 401,
        body: {
          error: "Failed! Username not found",
        },
      };
    }

    // Verify password
    const matchedPassword = await verifyPassword(user.password as string, trimmedPassword);

    if (matchedPassword) {
      // If password is correct, set user session
      await setUserSession(event, {
        user: {
          id: user.id,
          email: user.email,
        },
        loggedIn: true,
        loggedInAt: new Date(),
      });

      // Return success status
      return {
        status: 200,
        body: {
          message: "Logged in successfully",
        },
      };
    } else {
      return {
        status: 401,
        body: {
          error: "Failed! Password is incorrect",
        },
      };
    }
  } catch (error) {
    return {
      status: 500,
      body: {
        error: "Internal server error",
      },
    };
  }
});
