#!/usr/bin/env tsx
/**
 * Standalone script to update admin password
 * Usage: pnpm update-admin-password
 * Railway: railway run pnpm update-admin-password
 */

import { config } from 'dotenv'
config()

import { prisma } from '../../../database/server/utils/prisma-client'

async function updateAdminPassword() {
  const admin = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL },
  });
  if (admin) {
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD as string);
    if (hashedPassword !== admin.password) {
      await prisma.user.update({
        where: { email: process.env.ADMIN_EMAIL },
        data: {
          password: hashedPassword,
        },
      });
    }
  }
}

updateAdminPassword()