import 'dotenv/config'
import { prisma } from '@/lib/prisma'

export default async function seedProducts() {
  console.log('🌱 Starting product seed...')

  // Candy Cane Lane Products
  const ccl_greetingCard = await prisma.product.upsert({
    where: { sku: 'CCL-CARD' },
    update: {
      name: 'Candy Cane Lane - Greeting Card',
      description: 'A festive greeting card featuring our Candy Cane Lane cookie',
      price: 10.00,
      uom: 'card',
      photos: ['/products/candy_cane_lane.jpg'],
    },
    create: {
      name: 'Candy Cane Lane - Greeting Card',
      description: 'A festive greeting card featuring our Candy Cane Lane cookie',
      price: 10.00,
      uom: 'card',
      sku: 'CCL-CARD',
      photos: ['/products/candy_cane_lane.jpg'],
    },
  })

  const ccl_halfDozen = await prisma.product.upsert({
    where: { sku: 'CCL-6' },
    update: {
      name: 'Candy Cane Lane - Half Dozen',
      description: 'Six delicious Candy Cane Lane cookies',
      price: 25.00,
      uom: 'box',
      photos: ['/products/candy_cane_lane.jpg'],
    },
    create: {
      name: 'Candy Cane Lane - Half Dozen',
      description: 'Six delicious Candy Cane Lane cookies',
      price: 25.00,
      uom: 'box',
      sku: 'CCL-6',
      photos: ['/products/candy_cane_lane.jpg'],
    },
  })

  const ccl_dozen = await prisma.product.upsert({
    where: { sku: 'CCL-12' },
    update: {
      name: 'Candy Cane Lane - Dozen',
      description: 'A dozen festive Candy Cane Lane cookies',
      price: 50.00,
      uom: 'box',
      photos: ['/products/candy_cane_lane.jpg'],
    },
    create: {
      name: 'Candy Cane Lane - Dozen',
      description: 'A dozen festive Candy Cane Lane cookies',
      price: 50.00,
      uom: 'box',
      sku: 'CCL-12',
      photos: ['/products/candy_cane_lane.jpg'],
    },
  })

  // Can't Catch Me Products
  const ccm_greetingCard = await prisma.product.upsert({
    where: { sku: 'CCM-CARD' },
    update: {
      name: "Can't Catch Me - Greeting Card",
      description: "A playful greeting card featuring our Can't Catch Me cookie",
      price: 10.00,
      uom: 'card',
      photos: ['/products/catch_me_if_you_can.jpg'],
    },
    create: {
      name: "Can't Catch Me - Greeting Card",
      description: "A playful greeting card featuring our Can't Catch Me cookie",
      price: 10.00,
      uom: 'card',
      sku: 'CCM-CARD',
      photos: ['/products/catch_me_if_you_can.jpg'],
    },
  })

  const ccm_halfDozen = await prisma.product.upsert({
    where: { sku: 'CCM-6' },
    update: {
      name: "Can't Catch Me - Half Dozen",
      description: "Six delightful Can't Catch Me cookies",
      price: 25.00,
      uom: 'box',
      photos: ['/products/catch_me_if_you_can.jpg'],
    },
    create: {
      name: "Can't Catch Me - Half Dozen",
      description: "Six delightful Can't Catch Me cookies",
      price: 25.00,
      uom: 'box',
      sku: 'CCM-6',
      photos: ['/products/catch_me_if_you_can.jpg'],
    },
  })

  const ccm_dozen = await prisma.product.upsert({
    where: { sku: 'CCM-12' },
    update: {
      name: "Can't Catch Me - Dozen",
      description: "A dozen fun Can't Catch Me cookies",
      price: 50.00,
      uom: 'box',
      photos: ['/products/catch_me_if_you_can.jpg'],
    },
    create: {
      name: "Can't Catch Me - Dozen",
      description: "A dozen fun Can't Catch Me cookies",
      price: 50.00,
      uom: 'box',
      sku: 'CCM-12',
      photos: ['/products/catch_me_if_you_can.jpg'],
    },
  })

  // Sweater Weather Products
  const sw_greetingCard = await prisma.product.upsert({
    where: { sku: 'SW-CARD' },
    update: {
      name: 'Sweater Weather - Greeting Card',
      description: 'A cozy greeting card featuring our Sweater Weather cookie',
      price: 10.00,
      uom: 'card',
      photos: ['/products/sweater_weather.jpg'],
    },
    create: {
      name: 'Sweater Weather - Greeting Card',
      description: 'A cozy greeting card featuring our Sweater Weather cookie',
      price: 10.00,
      uom: 'card',
      sku: 'SW-CARD',
      photos: ['/products/sweater_weather.jpg'],
    },
  })

  const sw_halfDozen = await prisma.product.upsert({
    where: { sku: 'SW-6' },
    update: {
      name: 'Sweater Weather - Half Dozen',
      description: 'Six cozy Sweater Weather cookies',
      price: 25.00,
      uom: 'box',
      photos: ['/products/sweater_weather.jpg'],
    },
    create: {
      name: 'Sweater Weather - Half Dozen',
      description: 'Six cozy Sweater Weather cookies',
      price: 25.00,
      uom: 'box',
      sku: 'SW-6',
      photos: ['/products/sweater_weather.jpg'],
    },
  })

  const sw_dozen = await prisma.product.upsert({
    where: { sku: 'SW-12' },
    update: {
      name: 'Sweater Weather - Dozen',
      description: 'A dozen warm Sweater Weather cookies',
      price: 50.00,
      uom: 'box',
      photos: ['/products/sweater_weather.jpg'],
    },
    create: {
      name: 'Sweater Weather - Dozen',
      description: 'A dozen warm Sweater Weather cookies',
      price: 50.00,
      uom: 'box',
      sku: 'SW-12',
      photos: ['/products/sweater_weather.jpg'],
    },
  })

  console.log('✅ Created products:')
  console.log('\nCandy Cane Lane:')
  console.log(`  - ${ccl_greetingCard.name} (${ccl_greetingCard.sku}) - $${ccl_greetingCard.price}`)
  console.log(`  - ${ccl_halfDozen.name} (${ccl_halfDozen.sku}) - $${ccl_halfDozen.price}`)
  console.log(`  - ${ccl_dozen.name} (${ccl_dozen.sku}) - $${ccl_dozen.price}`)

  console.log("\nCan't Catch Me:")
  console.log(`  - ${ccm_greetingCard.name} (${ccm_greetingCard.sku}) - $${ccm_greetingCard.price}`)
  console.log(`  - ${ccm_halfDozen.name} (${ccm_halfDozen.sku}) - $${ccm_halfDozen.price}`)
  console.log(`  - ${ccm_dozen.name} (${ccm_dozen.sku}) - $${ccm_dozen.price}`)

  console.log('\nSweater Weather:')
  console.log(`  - ${sw_greetingCard.name} (${sw_greetingCard.sku}) - $${sw_greetingCard.price}`)
  console.log(`  - ${sw_halfDozen.name} (${sw_halfDozen.sku}) - $${sw_halfDozen.price}`)
  console.log(`  - ${sw_dozen.name} (${sw_dozen.sku}) - $${sw_dozen.price}`)

  console.log('\n✅ Product seed completed!')
}
