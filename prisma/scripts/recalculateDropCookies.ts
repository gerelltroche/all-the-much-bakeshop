import 'dotenv/config'
import { prisma } from '@/lib/prisma'

async function recalculateDropCookies() {
  console.log('🔄 Recalculating drop cookie counts...')

  const drops = await prisma.drop.findMany({
    include: {
      orders: {
        where: {
          status: { in: ['paid', 'confirmed', 'fulfilled'] }
        },
        include: {
          orderItems: {
            include: {
              product: { select: { cookieCount: true } }
            }
          }
        }
      }
    }
  })

  for (const drop of drops) {
    const totalCookies = drop.orders.reduce((dropSum, order) => {
      return dropSum + order.orderItems.reduce((orderSum, item) => {
        return orderSum + (item.quantity * item.product.cookieCount)
      }, 0)
    }, 0)

    const oldCount = drop.currentCookies

    await prisma.drop.update({
      where: { id: drop.id },
      data: { currentCookies: totalCookies }
    })

    console.log(`  ${drop.name}: ${oldCount} → ${totalCookies} cookies`)
  }

  console.log('✅ Recalculation complete!')
}

recalculateDropCookies()
  .catch((e) => {
    console.error('❌ Recalculation failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
