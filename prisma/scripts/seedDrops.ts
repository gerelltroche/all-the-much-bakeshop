import 'dotenv/config'
import { prisma } from '@/lib/prisma'

export default async function seedDrops() {
  console.log('🌱 Starting drops seed...')

  // Get all products by SKU
  const cclCard = await prisma.product.findUnique({ where: { sku: 'CCL-CARD' } })
  const cclHalfDozen = await prisma.product.findUnique({ where: { sku: 'CCL-6' } })
  const cclDozen = await prisma.product.findUnique({ where: { sku: 'CCL-12' } })

  const ccmCard = await prisma.product.findUnique({ where: { sku: 'CCM-CARD' } })
  const ccmHalfDozen = await prisma.product.findUnique({ where: { sku: 'CCM-6' } })
  const ccmDozen = await prisma.product.findUnique({ where: { sku: 'CCM-12' } })

  const swCard = await prisma.product.findUnique({ where: { sku: 'SW-CARD' } })
  const swHalfDozen = await prisma.product.findUnique({ where: { sku: 'SW-6' } })
  const swDozen = await prisma.product.findUnique({ where: { sku: 'SW-12' } })

  // Create or update drops
  const candyCaneLane = await prisma.drop.upsert({
    where: { slug: 'candy-cane-lane' },
    update: {
      name: 'Candy Cane Lane',
      dropOpens: new Date('2025-11-26T17:00:00Z'),
      pickupDate: new Date('2025-12-21T10:00:00Z'),
      deliveryDates: [
        new Date('2025-12-21T10:00:00Z'),
        new Date('2025-12-22T10:00:00Z'),
      ],
      pickupLocation: 'Alafaya Trail - Orlando, FL',
      cutoffDate: new Date('2025-12-07T23:59:59Z'),
      isActive: true,
      maxCookies: 72 - 24, // Pre-allocate 24 cookies for Katie
    },
    create: {
      name: 'Candy Cane Lane',
      slug: 'candy-cane-lane',
      dropOpens: new Date('2025-11-26T17:00:00Z'),
      pickupDate: new Date('2025-12-21T10:00:00Z'),
      deliveryDates: [
        new Date('2025-12-21T10:00:00Z'),
        new Date('2025-12-22T10:00:00Z'),
      ],
      pickupLocation: 'Alafaya Trail - Orlando, FL',
      cutoffDate: new Date('2025-12-07T23:59:59Z'),
      isActive: true,
      maxCookies: 72 - 24, // Pre-allocate 24 cookies for Katie
      currentCookies: 0,
    },
  })

  const catchMeIfYouCan = await prisma.drop.upsert({
    where: { slug: 'cant-catch-me' },
    update: {
      name: "Can't Catch Me",
      dropOpens: new Date('2025-11-26T17:00:00Z'),
      pickupDate: new Date('2025-12-28T10:00:00Z'),
      deliveryDates: [
        new Date('2025-12-28T10:00:00Z'),
        new Date('2025-12-29T10:00:00Z'),
      ],
      pickupLocation: 'Alafaya Trail - Orlando, FL',
      cutoffDate: new Date('2025-12-14T23:59:59Z'),
      isActive: true,
      maxCookies: 72,
    },
    create: {
      name: "Can't Catch Me",
      slug: 'cant-catch-me',
      dropOpens: new Date('2025-11-26T17:00:00Z'),
      pickupDate: new Date('2025-12-28T10:00:00Z'),
      deliveryDates: [
        new Date('2025-12-28T10:00:00Z'),
        new Date('2025-12-29T10:00:00Z'),
      ],
      pickupLocation: 'Alafaya Trail - Orlando, FL',
      cutoffDate: new Date('2025-12-14T23:59:59Z'),
      isActive: true,
      maxCookies: 72,
      currentCookies: 0,
    },
  })

  const sweaterWeather = await prisma.drop.upsert({
    where: { slug: 'sweater-weather' },
    update: {
      name: 'Sweater Weather',
      dropOpens: new Date('2025-11-26T17:00:00Z'),
      pickupDate: new Date('2026-01-04T10:00:00Z'),
      deliveryDates: [
        new Date('2026-01-04T10:00:00Z'),
        new Date('2026-01-05T10:00:00Z'),
      ],
      pickupLocation: 'Alafaya Trail - Orlando, FL',
      cutoffDate: new Date('2025-12-21T23:59:59Z'),
      isActive: true,
      maxCookies: 72,
    },
    create: {
      name: 'Sweater Weather',
      slug: 'sweater-weather',
      dropOpens: new Date('2025-11-26T17:00:00Z'),
      pickupDate: new Date('2026-01-04T10:00:00Z'),
      deliveryDates: [
        new Date('2026-01-04T10:00:00Z'),
        new Date('2026-01-05T10:00:00Z'),
      ],
      pickupLocation: 'Alafaya Trail - Orlando, FL',
      cutoffDate: new Date('2025-12-21T23:59:59Z'),
      isActive: true,
      maxCookies: 72,
      currentCookies: 0,
    },
  })

  // Superbowl drop - coming soon, placeholder dates
  const superbowl = await prisma.drop.upsert({
    where: { slug: 'superbowl' },
    update: {
      name: 'Superbowl Drop',
      dropOpens: new Date('2025-01-25T17:00:00Z'), // TBA
      pickupDate: new Date('2025-02-09T10:00:00Z'), // Super Bowl Sunday
      deliveryDates: [
        new Date('2025-02-08T10:00:00Z'),
        new Date('2025-02-09T10:00:00Z'),
      ],
      pickupLocation: 'Alafaya Trail - Orlando, FL',
      cutoffDate: new Date('2025-02-02T23:59:59Z'), // TBA
      isActive: false, // Not active yet - coming soon
      maxCookies: 72,
    },
    create: {
      id: 'superbowl', // Match the frontend ID
      name: 'Superbowl Drop',
      slug: 'superbowl',
      dropOpens: new Date('2025-01-25T17:00:00Z'), // TBA
      pickupDate: new Date('2025-02-09T10:00:00Z'), // Super Bowl Sunday
      deliveryDates: [
        new Date('2025-02-08T10:00:00Z'),
        new Date('2025-02-09T10:00:00Z'),
      ],
      pickupLocation: 'Alafaya Trail - Orlando, FL',
      cutoffDate: new Date('2025-02-02T23:59:59Z'), // TBA
      isActive: false, // Not active yet - coming soon
      maxCookies: 72,
      currentCookies: 0,
    },
  })

  console.log('✅ Created drops:')
  console.log(`  - ${candyCaneLane.name} (${candyCaneLane.slug})`)
  console.log(`  - ${catchMeIfYouCan.name} (${catchMeIfYouCan.slug})`)
  console.log(`  - ${sweaterWeather.name} (${sweaterWeather.slug})`)
  console.log(`  - ${superbowl.name} (${superbowl.slug}) [coming soon]`)

  // Associate products with drops using upsert for idempotency
  if (cclCard && cclHalfDozen && cclDozen) {
    await Promise.all([
      prisma.dropProduct.upsert({
        where: { dropId_productId: { dropId: candyCaneLane.id, productId: cclCard.id } },
        update: { isActive: true, displayOrder: 1 },
        create: { dropId: candyCaneLane.id, productId: cclCard.id, isActive: true, displayOrder: 1 },
      }),
      prisma.dropProduct.upsert({
        where: { dropId_productId: { dropId: candyCaneLane.id, productId: cclHalfDozen.id } },
        update: { isActive: true, displayOrder: 2 },
        create: { dropId: candyCaneLane.id, productId: cclHalfDozen.id, isActive: true, displayOrder: 2 },
      }),
      prisma.dropProduct.upsert({
        where: { dropId_productId: { dropId: candyCaneLane.id, productId: cclDozen.id } },
        update: { isActive: true, displayOrder: 3 },
        create: { dropId: candyCaneLane.id, productId: cclDozen.id, isActive: true, displayOrder: 3 },
      }),
    ])
    console.log(`✅ Associated Candy Cane Lane products with drop`)
  }

  if (ccmCard && ccmHalfDozen && ccmDozen) {
    await Promise.all([
      prisma.dropProduct.upsert({
        where: { dropId_productId: { dropId: catchMeIfYouCan.id, productId: ccmCard.id } },
        update: { isActive: true, displayOrder: 1 },
        create: { dropId: catchMeIfYouCan.id, productId: ccmCard.id, isActive: true, displayOrder: 1 },
      }),
      prisma.dropProduct.upsert({
        where: { dropId_productId: { dropId: catchMeIfYouCan.id, productId: ccmHalfDozen.id } },
        update: { isActive: true, displayOrder: 2 },
        create: { dropId: catchMeIfYouCan.id, productId: ccmHalfDozen.id, isActive: true, displayOrder: 2 },
      }),
      prisma.dropProduct.upsert({
        where: { dropId_productId: { dropId: catchMeIfYouCan.id, productId: ccmDozen.id } },
        update: { isActive: true, displayOrder: 3 },
        create: { dropId: catchMeIfYouCan.id, productId: ccmDozen.id, isActive: true, displayOrder: 3 },
      }),
    ])
    console.log(`✅ Associated Can't Catch Me products with drop`)
  }

  if (swCard && swHalfDozen && swDozen) {
    await Promise.all([
      prisma.dropProduct.upsert({
        where: { dropId_productId: { dropId: sweaterWeather.id, productId: swCard.id } },
        update: { isActive: true, displayOrder: 1 },
        create: { dropId: sweaterWeather.id, productId: swCard.id, isActive: true, displayOrder: 1 },
      }),
      prisma.dropProduct.upsert({
        where: { dropId_productId: { dropId: sweaterWeather.id, productId: swHalfDozen.id } },
        update: { isActive: true, displayOrder: 2 },
        create: { dropId: sweaterWeather.id, productId: swHalfDozen.id, isActive: true, displayOrder: 2 },
      }),
      prisma.dropProduct.upsert({
        where: { dropId_productId: { dropId: sweaterWeather.id, productId: swDozen.id } },
        update: { isActive: true, displayOrder: 3 },
        create: { dropId: sweaterWeather.id, productId: swDozen.id, isActive: true, displayOrder: 3 },
      }),
    ])
    console.log(`✅ Associated Sweater Weather products with drop`)
  }

  console.log('✅ Drops seed completed!')
}
