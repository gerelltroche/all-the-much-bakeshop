import { prisma } from './prisma'
import type { Drop } from '@prisma/client'

export async function getActiveDrop(slug: string): Promise<(Drop & { isActive: boolean }) | null> {
  const drop = await prisma.drop.findUnique({
    where: { slug }
  })

  if (drop === null) return null

  // Check if drop is still active based on cutoff date
  const now = new Date()
  const isActive = drop.isActive && now <= drop.cutoffDate

  // Auto-update isActive if it changed
  if (isActive !== drop.isActive) {
    await prisma.drop.update({
      where: { id: drop.id },
      data: { isActive }
    })
  }

  return { ...drop, isActive }
}
