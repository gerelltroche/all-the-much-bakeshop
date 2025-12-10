'use server'

import { prisma } from '@/lib/prisma'

export async function getDropsWithStatus() {
  const drops = await prisma.drop.findMany({
    orderBy: { cutoffDate: 'asc' }
  })

  const now = new Date()
  return drops.map(drop => ({
    ...drop,
    isClosed: now > drop.cutoffDate,
    isComingSoon: !drop.isActive
  }))
}
