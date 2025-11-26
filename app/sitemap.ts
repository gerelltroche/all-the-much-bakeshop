import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://allthemuchbakeshop.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/link-tree`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/winter-drops`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic drop pages - get all active drops
  let dropPages: MetadataRoute.Sitemap = []

  try {
    const drops = await prisma.drop.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    dropPages = drops.map((drop) => ({
      url: `${baseUrl}/drops/${drop.slug}/order`,
      lastModified: drop.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  } catch (error) {
    // If database is unavailable, continue with static pages only
    console.error('Failed to fetch drops for sitemap:', error)
  }

  return [...staticPages, ...dropPages]
}
