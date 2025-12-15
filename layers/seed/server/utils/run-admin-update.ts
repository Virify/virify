#!/usr/bin/env tsx
/**
 * Script to trigger admin password update via API endpoint
 * Usage: pnpm update-admin-password:remote
 * Railway: railway run pnpm update-admin-password:remote
 */

import { config } from 'dotenv'
config()

async function updateAdminPasswordRemote() {
  try {
    const taskSecret = process.env.TASK_SECRET
    const baseUrl = process.env.EMAIL_BASE_URL || 'http://localhost:3000'

    if (!taskSecret) {
      console.error('❌ TASK_SECRET environment variable is required')
      process.exit(1)
    }
    
    const url = `${baseUrl}/auth/update-admin-password?taskSecret=${encodeURIComponent(taskSecret)}`
    console.log(`🔐 Triggering admin password update at ${baseUrl}...`)

    const response = await fetch(url, {
      method: 'GET',
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HTTP ${response.status}: ${error}`)
    }

    const result = await response.json()
    console.log('✅ Admin password update triggered successfully')
    console.log(result)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error triggering admin password update:', error.message)
    process.exit(1)
  }
}

updateAdminPasswordRemote()
