import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import seedProducts from './seedProducts'
import seedDrops from './seedDrops'

async function main() {
  console.log('🌱 Starting seed...')

  await seedProducts()
  await seedDrops()

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
