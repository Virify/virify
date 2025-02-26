import { H3Event } from "h3";

export async function loginUser(event: H3Event, email: string, password: string, userType: "user" | "agent") {
  try {
    // Trim and validate input
    const { trimmedEmail, trimmedPassword } = await loginFieldValidator(email, password);

    // Find user or agent by email
    const user = await (prisma['agent'] as any).findUnique({
      where: {
        email: trimmedEmail,
      },
    });

    if (!user) {
      return {
        status: 401,
        body: {
          error: `Failed! ${userType.charAt(0).toUpperCase() + userType.slice(1)} not found`,
        },
      };
    } else {
      // this is a hack but I will always have a password...
      const matchedPassword = await verifyPassword((user.password as string), trimmedPassword)

      if (!matchedPassword) {
        return {
          status: 401,
          body: {
            error: "Failed! Password is incorrect",
          },
        };
      }

      // If password is correct, set user session
      await setUserSession(event, {
        user: {
          id: user.id,
          email: user.email,
          username: user.username || user.email,
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
    }

    // verify password
  } catch (error) {
    return {
      status: 500,
      body: {
        error: "Internal server error",
      },
    };
  }
}
