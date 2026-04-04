import { type User, Reviewed, MembershipType, ActivationStatus } from "../database/prisma/generated/client";
import type { ProfileSchemaType } from "~~/shared/utils/profile-schema";

import { prisma } from "./prisma-client";
import { UserWithVerification, UserWithVerificationAndMembership } from "~~/shared/types/user";

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

/**
 * Get user with address for profile update
 * @param id User ID
 * @returns User With Address
 */
export async function findUserforProfileUpdate(id: number): Promise<UserWithAddress | null> {
  return prisma.user.findUnique({
    where: { id },
    include: {
      address: true,
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

/**
 * Get user with Verification and Membership by ID
 * Required for updating user session
 * @param id User Id
 * @returns User with Verification and Membership
 */
export async function getUserWithVerificationAndMembershipById(id: number): Promise<UserWithVerificationAndMembership | null> {
  return prisma.user.findUnique({
    where: { id },
    include: {
      membership: true,
      verification: true,
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
 * 
 * @param id User Id
 * @param data Data
 * @returns User
 */
export async function updateUserById(id: number, username: string, hashedPassword: string, activate?: string): Promise<UserWithVerificationAndMembership> {
  return prisma.user.update({
    where: { id },
    data: {
      username,
      password: hashedPassword,
      ...(activate ? {
        verification: {
          update: {
            activated: activate as ActivationStatus,
          }
        }
      } : {})
    },
    include: {
      verification: true,
      membership: true,
    }
  });
}

/**
 * Update user username by ID
 * @param id 
 * @param username 
 * @returns UserWithVerificationAndMembership
 */
export async function updateUserUsernameById(id: number, username: string): Promise<UserWithVerificationAndMembership> {
  return prisma.user.update({
    where: { id },
    data: {
      username,
    },
    include: {
      verification: true,
      membership: true,
    }
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
      verification: {
        update: {
          activated: 'ACTIVATED',
        },
      },
    },
    include: {
      verification: true,
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
      verification: {
        update: {
          activated: 'UNVERIFIED',
        },
      },
    },
    include: {
      verification: true,
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
          activated: 'PENDING',
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
          activated: 'UNVERIFIED',
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
            activated: 'UNVERIFIED',
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
            activated: 'DENIED',
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
 * Update User Profile Data and Address
 * @param id User Id
 * @param data User Pofile Data and Address
 * @returns User With Address
 */
export async function updateUserProfileData(id: number, data: ProfileSchemaType): Promise<UserWithAddress> {
  const { address, ...userData } = data;
  
  return await prisma.user.update({
    where: { id },
    data: {
      ...userData,
      address: {
        upsert: {
          create: address,
          update: address,
        }
      },
    },
    include: {
      address: true,
    },
  });
}

/**
 * 
 * @param id User ID
 * @param data 
 * @returns 
 */
export async function updateUserSecurityById(id: number, email?: string, password?: string, activatedStatus?: string): Promise<UserWithVerificationAndMembership> {
  const data: any = {};
  if (email !== undefined) data.email = email;
  if (password !== undefined) data.password = password;
  
  const updateData: any = { ...data };
  
  if (activatedStatus) {
    updateData.verification = {
      update: {
        activated: activatedStatus,
      }
    };
  }

  return await prisma.user.update({
    where: { id },
    data: updateData,
    include: {
      membership: true,
      verification: true,
    },
  });
}

/**
 * Check if a user is active.
 * @param user user | Agent
 * @returns Boolean
 */
export function isActive(user: UserWithVerification): boolean {
  return user.verification?.activated === 'UNVERIFIED' || user.verification?.activated === 'ACTIVATED';
}

/**
 * Fetches a user's email address and notification preferences in a single query.
 * Returns null if the user is not found.
 */
export async function getUserNotificationPreferences(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      preferences: {
        select: {
          notificationPreferences: {
            select: {
              receiveEmailNotifications: true,
              receivePushNotifications: true,
              receiveDesktopNotifications: true,
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!user) return null;

  const prefs = user.preferences?.notificationPreferences?.[0];

  return {
    email: user.email,
    receiveEmailNotifications: prefs?.receiveEmailNotifications ?? true,
    receivePushNotifications: prefs?.receivePushNotifications ?? true,
    receiveDesktopNotifications: prefs?.receiveDesktopNotifications ?? true,
  };
}
