import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  await prisma.drop.upsert({
    where: { slug: 'winter-2025' },
    update: {},
    create: {
      name: 'Winter 2025 Drop',
      slug: 'winter-2025',
      startDate: new Date('2025-11-12T00:00:00Z'),
      cutoffDate: new Date('2025-12-01T23:59:59Z'),
      isActive: true
    }
  })

  console.log('✅ Winter 2025 Drop created')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e: unknown) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
