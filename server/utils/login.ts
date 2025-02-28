import { H3Event } from "h3";
import { OwnerRole } from '@prisma/client';

export async function loginOwner(event: H3Event, email: string, password: string) {
  try {
    const { trimmedEmail, trimmedPassword } = await loginFieldValidator(email, password);

    // Find owner by email - because its a agency owner
    const owner = await prisma.owner.findUnique({
      where: {
        email: trimmedEmail,
      },
    });

    // if owner is not found
    if (!owner) {
      return {
        status: 401,
        body: {
          error: `Failed! user not found`,
        },
      };
    } else {
      if(owner.role === OwnerRole.AGENT) {
        return {
          status: 403,
          body: {
            error: `Failed! User is an agent, please login as an agent`,
          },
        };
      }
      // Check password
      const matchedPassword = await verifyPassword(owner.password as string, trimmedPassword);

      if (!matchedPassword) {
        return {
          status: 401,
          body: {
            error: "Failed! Password is incorrect",
          },
        };
      }

      // set session with the ownner and isAgent = false
      await setSession(event, owner, false);

      // Return success status
      return {
        status: 200,
        body: {
          message: "Logged in successfully",
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
}

export async function loginAgent(event: H3Event, email: string, password: string) {
  try {
    // Trim and validate input
    const { trimmedEmail, trimmedPassword } = await loginFieldValidator(email, password);

    // search the agent by owner email
    const agent = await prisma.owner.findFirst({
      include: {
        agents: {
          where: {
            email: trimmedEmail,
          },
        },
      },
    });

    // if agent is not found
    if (!agent) {
      return {
        status: 401,
        body: {
          error: `Failed! agent not found`,
        },
      };
    }

    // check password
    const matchedPassword = await verifyPassword(agent.password as string, trimmedPassword);

    // if password is incorrect
    if (!matchedPassword) {
      return {
        status: 401,
        body: {
          error: "Failed! Password is incorrect",
        },
      };
    } else {
      // set session with the ownner and isAgent = false
      await setSession(event, agent, true);
      return {
        status: 200,
        body: {
          message: "Logged in successfully",
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
}
