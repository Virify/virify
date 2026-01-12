import { type User, Prisma, Reviewed, MembershipType } from "../database/prisma/generated/client";

import { prisma } from "./prisma-client";
export type UserWithVerification = Prisma.UserGetPayload<{ include: { verification: true, } }>;
export type UserWithVerificationAndMembership = Prisma.UserGetPayload<{ include: { verification: true, membership: true } }>;
export type UserWithMembership = Prisma.UserGetPayload<{ include: { membership: true } }>;
export type { User };

/**
 * Finds an user by email.
 * @param email - The email of the user to find.
 * @returns The user object if found, otherwise null.
 */
export async function findUser(email: string): Promise<UserWithVerificationAndMembership | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      membership: true,
      verification: true,
    },
  });
}

export async function getFullUserById(id: number): Promise<FullUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      address: true,
      listings: {
        include: {
          rentalListing: true,
          saleListing: true,
          property: {
            include: {
              address: true,
              media: true,
              type: true,
              classification: true,
              bedroomFeatures: {
                include: {
                  media: true,
                },
              },
              bathroomFeatures: {
                include: {
                  media: true,
                },
              },
              otherRoom: {
                include: {
                  media: true,
                },
              },
              parking: true,
              amenities: true,
              additionalFeatures: true,
              accessibilityFeatures: true,
              kitchenFeatures: {
                include: {
                  media: true,
                },
              },
              reception: {
                include: {
                  media: true,
                },
              },
              utility: true,
              outdoorSpace: {
                include: {
                  garden: {
                    include: {
                      media: true,
                    },
                  },
                  yard: {
                    include: {
                      media: true,
                    },
                  },
                  land: {
                    include: {
                      media: true,
                    },
                  },
                  media: true,
                },
              },
              energyAndUtilities: true,
              securityFeatures: true,
              storageFeatures: true,
              runningCosts: true,
            },
          },
        },
      },
    },
  });

  return user as FullUser | null;
}

/**
 * Find user by ID
 * @param id number
 * @returns user
 */
export async function findUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany();
}

/**
 * Find the first user
 * @returns The user
 */
export async function findFirstUser(): Promise<User | null> {
  return prisma.user.findFirst();
}

/**
 * Find user with Verification by Email
 * @param email string
 * @returns user with Verification Relation
 */
export async function finduUserWithVerification(email: string): Promise<UserWithVerification | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      verification: true,
    },
  });
}

/**
 * Find user by Activation Token
 *
 * @param token string
 */
export async function findUserByActivationToken(token: string): Promise<UserWithVerification | null> {
  return prisma.user.findFirst({
    where: {
      verification: {
        activationToken: token,
      },
    },
    include: {
      verification: true,
      membership: true,
    },
  });
}

/**
 * Find user by Password reset token
 * @param token string
 * @returns user
 */
export async function findUserByPasswordToken(token: string): Promise<UserWithVerification | null> {
  return prisma.user.findUnique({
    where: {
      passwordResetToken: token,
    },
    include: {
      verification: true,
    },
  });
}
/**
 * Update the users password based on the token *which has been verified*.
 * @param token string
 * @param password string
 * @returns user
 */
export async function updateUserByToken(token: string, password: string) {
  return prisma.user.update({
    where: {
      passwordResetToken: token,
    },
    data: {
      password,
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
    },
  });
}

/**
 * Update the users password based on ID
 * @param id number
 * @param password string
 * @returns user
 */
export async function updateUserPasswordById(id: number, password: string) {
  return prisma.user.update({
    where: { id },
    data: {
      password,
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
    },
  });
}

/**
 * Find user by Email and create a password reset token.
 * @param email - The email of the user to find.
 * @returns The user object if found, otherwise null.
 */
export async function updateUserPasswordToken(email: string, token: string, otpCode: string): Promise<User | null> {
  return prisma.user.update({
    where: { email },
    data: {
      otpCode,
      otpCodeExpiry: new Date(Date.now() + 3600000),
      passwordResetToken: token,
      passwordResetTokenExpiry: new Date(Date.now() + 3600000),
    },
  });
}

/**
 * Finds an user by email and activation token.
 * @param email - The email of the user to find.
 * @param token - The activation token of the user to find.
 * @returns The user object if found, otherwise null.
 */
export async function findUserByToken(token: string): Promise<UserWithVerification | null> {
  return prisma.user.findFirst({
    where: {
      verification: {
        is: { activationToken: token },
      },
    },
    include: {
      verification: true,
    },
  });
}

/**
 * Deletes an user by email.
 * @param email string
 * @returns Promise<User>
 */
export async function deleteUser(id: number): Promise<User> {
  return prisma.user.delete({ where: { id } });
}
/**
 * Create a new user with the given email and token.
 * @param email string
 * @param token string
 * @returns user <Promise>
 */
export async function createUserWithTokens(email: string, token: string, otpCode: string): Promise<UserWithVerification> {
  return prisma.user.create({
    data: {
      email,
      otpCode: otpCode,
      otpCodeExpiry: new Date(Date.now() + 3600000),
      verification: {
        create: {
          activationToken: token,
          activationTokenExpiry: new Date(Date.now() + 3600000),
        },
      },
    },
    include: {
      verification: true,
    },
  });
}

/**
 * Update user Token and Expiry.
 * @param email string
 * @param token string
 * @returns Promise<User>
 */
export async function updateUserTokens(email: string, token: string, otpCode: string): Promise<UserWithVerification> {
  return prisma.user.update({
    where: { email },
    data: {
      otpCode: otpCode,
      otpCodeExpiry: new Date(Date.now() + 3600000),
      verification: {
        update: {
          activationToken: token,
          activationTokenExpiry: new Date(Date.now() + 3600000),
        },
      },
    },
    include: {
      verification: true,
    },
  });
}

/**
 * Update user Password and Activation.
 * @param userId number
 * @param password string
 * @returns Promise<User>
 */
export async function updateUserAndActivate(userId: number, password?: string): Promise<UserWithVerificationAndMembership> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      otpCode: null,
      otpCodeExpiry: null,
      verification: {
        update: {
          activationToken: null,
          activationTokenExpiry: null,
          activated: true,
        },
      },
      membership: {
        create: {
          type: MembershipType.FREE,
        },
      },
    },
    include: {
      verification: true,
      membership: true
    },
  });
}

/**
 * Update user and Review.
 * if approval is approved, update the activation token and expiry.
 * if approval is rejected, update the review token and expiry.
 * @param id number
 * @param approval Reviewed
 * @param token string
 * @returns user <Promise>
 */
export async function updateUserAndReview(id: number, approval: Reviewed, token: string): Promise<UserWithVerification> {
  if (approval === Reviewed.APPROVED) {
    return prisma.user.update({
      where: { id: id },
      data: {
        verification: {
          update: {
            activationToken: token,
            activationTokenExpiry: new Date(Date.now() + 3600000),
            activated: false,
            reviewed: approval,
            reviewToken: null,
            reviewTokenExpiry: null,
          },
        },
      },
      include: {
        verification: true,
      },
    });
  } else {
    return prisma.user.update({
      where: { id: id },
      data: {
        verification: {
          update: {
            reviewed: approval,
            reviewToken: null,
            reviewTokenExpiry: null,
          },
        },
      },
      include: {
        verification: true,
      },
    });
  }
}

/**
 * Check if a user is active.
 * @param user user | Agent
 * @returns Boolean
 */
export function isActive(user: UserWithVerification): boolean {
  return user.verification?.activated === true;
}
