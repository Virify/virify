import { type Agent, type Owner, OwnerRole, Prisma, Reviewed } from "@prisma/client";
import { prisma } from "./prisma-client";
export type OwnerWithVerification = Prisma.OwnerGetPayload<{ include: { verification: true } }>;
export { OwnerRole, Reviewed };
export type { Agent, Owner}

/**
 * Finds an owner by email.
 * @param email - The email of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function findOwner(email: string): Promise<Owner | null> {
  return prisma.owner.findUnique({
    where: {
      email,
    },
  });
}

/**
 * Find the first owner
 * @returns The Owner
 */
export async function findFirstOwner(): Promise<Owner | null> {
  return prisma.owner.findFirst();
}

/**
 * Find Owner with Verification by Email
 * @param email string
 * @returns Owner with Verification Relation
 */
export async function findOwnerWithVerification(email: string): Promise<OwnerWithVerification | null> {
  return prisma.owner.findUnique({
    where: {
      email,
    },
    include: {
      verification: true,
    },
  });
}

/**
 * Find Owner by Activation Token
 *
 * @param token string
 */
export async function findOwnerByActivationToken(token: string): Promise<OwnerWithVerification | null> {
  return prisma.owner.findFirst({
    where: {
      verification: {
        activationToken: token,
      },
    },
    include: {
      verification: true,
    },
  });
}

/**
 * Find Owner by Password reset token
 * @param token string
 * @returns Owner
 */
export async function findOwnerByPasswordToken(token: string): Promise<Owner | null> {
  return prisma.owner.findUnique({
    where: {
      passwordResetToken: token,
    },
  });
}

/**
 * Update the owners password based on the token *which has been verified*.
 * @param token string
 * @param password string
 * @returns Owner
 */
export async function updateOwnerByToken(token: string, password: string) {
  return prisma.owner.update({
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
 * Find owner by Email and create a password reset token.
 * @param email - The email of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function updateOwnerByEmailPasswordReset(email: string, token: string) {
  return prisma.owner.update({
    where: { email },
    data: {
      passwordResetToken: token,
      passwordResetTokenExpiry: new Date(Date.now() + 3600000),
    },
  });
}

/**
 * Finds an owner by email and activation token.
 * @param email - The email of the owner to find.
 * @param token - The activation token of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function findOwnerByToken(token: string): Promise<OwnerWithVerification | null> {
  return prisma.owner.findFirst({
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
 * Finds an owner by email, business name, and registration number.
 * @param email - The email of the owner to find.
 * @param businessName - The business name of the owner to find.
 * @param registrationNumber - The registration number of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function findBusinessOwner(email: string, address: string): Promise<OwnerWithVerification | null> {
  return prisma.owner.findFirst({
    where: {
      OR: [{ email: email }, { addressLine1: address }],
    },
    include: {
      verification: true,
    },
  });
}
/**
 * Finds an agent by owner OR find owner by OwnerRole
 * @param email - The email of the agent to find.
 * @returns The agent object if found, otherwise null.
 */
export async function findAgent(email: string): Promise<Owner | null> {
  return prisma.owner.findFirst({
    where: {
      OR: [
        {
          email: email,
          role: OwnerRole.AGENT,
        },
        {
          agents: {
            some: {
              email: email,
            },
          },
        },
      ],
    },
    include: { agents: true, verification: true },
  });
}

/**
 * Deletes an owner by email.
 * @param email string
 * @returns Promise<Owner>
 */
export async function deleteOwner(id: number): Promise<Owner> {
  return prisma.owner.delete({ where: { id } });
}
/**
 * Create a new owner with the given email and token.
 * @param email string
 * @param token string
 * @returns Owner <Promise>
 */
export async function createOwnerWithTokens(email: string, token: string, otpCode: string): Promise<OwnerWithVerification> {
  return prisma.owner.create({
    data: {
      email,
      verification: {
        create: {
          activationToken: token,
          activationTokenExpiry: new Date(Date.now() + 3600000),
          otpCode: otpCode,
          otpCodeExpiry: new Date(Date.now() + 3600000),
        },
      },
    },
    include: {
      verification: true,
    },
  });
}

/**
 * Create owner as agent
 * @param email string
 * @param businessName string
 * @param mainContact string
 * @param addressLine string
 * @param city string
 * @param county string
 * @param country string
 * @param postcode string
 * @param registrationNumber string
 * @returns Promise<Owner>
 */
export async function createBusinessOwnerWithToken(
  email: string,
  businessName: string,
  mainContact: string,
  addressLine: string,
  city: string,
  county: string,
  country: string,
  postcode: string,
  registrationNumber: string,
  token: string,
): Promise<OwnerWithVerification | null> {
  return prisma.owner.create({
    data: {
      email,
      businessName,
      mainContact,
      addressLine1: addressLine,
      city,
      county,
      country,
      postcode,
      companyRegistration: registrationNumber,
      role: OwnerRole.AGENT,
      verification: {
        create: {
          reviewed: Reviewed.PENDING,
          reviewToken: token,
          reviewTokenExpiry: new Date(Date.now() + 3600000),
        },
      },
    },
    include: { verification: true },
  });
}

/**
 * Update Owner Token and Expiry.
 * @param email string
 * @param token string
 * @returns Promise<Owner>
 */
export async function updateOwnerTokens(email: string, token: string, otpCode: string): Promise<OwnerWithVerification> {
  return prisma.owner.update({
    where: { email },
    data: {
      verification: {
        update: {
          activationToken: token,
          activationTokenExpiry: new Date(Date.now() + 3600000),
          otpCode: otpCode,
          otpCodeExpiry: new Date(Date.now() + 3600000),
        },
      },
    },
    include: {
      verification: true,
    }
  });
}

/**
 * Update Owner Password and Activation.
 * @param userId number
 * @param password string
 * @returns Promise<Owner>
 */
export async function updateOwnerAndActivate(userId: number, password?: string): Promise<OwnerWithVerification> {
  return prisma.owner.update({
    where: { id: userId },
    data: {
      password,
      verification: {
        update: {
          activationToken: null,
          activationTokenExpiry: null,
          otpCode: null,
          otpCodeExpiry: null,
          activated: true,
        },
      },
    },
    include: {
      verification: true,
    },
  });
}

/**
 * Update Owner and Review.
 * if approval is approved, update the activation token and expiry.
 * if approval is rejected, update the review token and expiry.
 * @param id number
 * @param approval Reviewed
 * @param token string
 * @returns Owner <Promise>
 */
export async function updateOwnerAndReview(id: number, approval: Reviewed, token: string): Promise<OwnerWithVerification> {
  if (approval === Reviewed.APPROVED) {
    return prisma.owner.update({
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
    return prisma.owner.update({
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
 * Check for the role of the owner.
 * @param user Owner | Agent
 * @param role OwnerRole
 * @returns Boolean
 */
export function hasRole(user: Owner | Agent, role: OwnerRole): boolean {
  return user.role === role;
}

/**
 * Check if a owner is active.
 * @param user Owner | Agent
 * @returns Boolean
 */
export function isActive(user: OwnerWithVerification): boolean {
  return user.verification?.activated === true;
}
