import 'dotenv/config'
import { prisma } from '@/lib/prisma'

export default async function seedProducts() {
  console.log('🌱 Starting product seed...')

  // Candy Cane Lane Products
  const ccl_greetingCard = await prisma.product.upsert({
    where: { sku: 'CCL-CARD' },
    update: {
      name: 'Candy Cane Lane - Greeting Card',
      description: "Elevate your holiday gifting with this Triple Chocolate Peppermint Bark mug cookie, rimmed with crushed candy and Ghirardelli chocolate. We've handled the wrapping by placing it in a 5\"x5\" box with a bow and a complimentary card and envelope, making it the ultimate ready-to-give treat.",
      price: 10.00,
      uom: 'card',
      photos: ['/products/candy_cane_lane/greeting-card.mp4'],
    },
    create: {
      name: 'Candy Cane Lane - Greeting Card',
      description: "Elevate your holiday gifting with this Triple Chocolate Peppermint Bark mug cookie, rimmed with crushed candy and Ghirardelli chocolate. We've handled the wrapping by placing it in a 5\"x5\" box with a bow and a complimentary card and envelope, making it the ultimate ready-to-give treat.",
      price: 10.00,
      uom: 'card',
      sku: 'CCL-CARD',
      photos: ['/products/candy_cane_lane/greeting-card.mp4'],
    },
  })

  const ccl_halfDozen = await prisma.product.upsert({
    where: { sku: 'CCL-6' },
    update: {
      name: 'Candy Cane Lane - Half Dozen',
      description: 'Six delicious Candy Cane Lane cookies',
      price: 25.00,
      uom: 'box',
      photos: ['/products/candy_cane_lane/half-dozen.jpg'],
    },
    create: {
      name: 'Candy Cane Lane - Half Dozen',
      description: 'Six delicious Candy Cane Lane cookies',
      price: 25.00,
      uom: 'box',
      sku: 'CCL-6',
      photos: ['/products/candy_cane_lane/half-dozen.jpg'],
    },
  })

  const ccl_dozen = await prisma.product.upsert({
    where: { sku: 'CCL-12' },
    update: {
      name: 'Candy Cane Lane - Dozen',
      description: 'A dozen festive Candy Cane Lane cookies',
      price: 50.00,
      uom: 'box',
      photos: ['/products/candy_cane_lane/dozen.jpg'],
    },
    create: {
      name: 'Candy Cane Lane - Dozen',
      description: 'A dozen festive Candy Cane Lane cookies',
      price: 50.00,
      uom: 'box',
      sku: 'CCL-12',
      photos: ['/products/candy_cane_lane/dozen.jpg'],
    },
  })

  // Can't Catch Me Products
  const ccm_greetingCard = await prisma.product.upsert({
    where: { sku: 'CCM-CARD' },
    update: {
      name: "Can't Catch Me - Greeting Card",
      description: "Enjoy the warmth of the season with our traditional gingerbread mug cookie, perfectly decorated with a smiling gingerbread friend. We've handled the wrapping by placing it in a 5\"x5\" box with a bow and a complimentary card and envelope, making it the ultimate ready-to-give treat.",
      price: 10.00,
      uom: 'card',
      photos: ['/products/cant_catch_me/greeting-card.mp4'],
    },
    create: {
      name: "Can't Catch Me - Greeting Card",
      description: "Enjoy the warmth of the season with our traditional gingerbread mug cookie, perfectly decorated with a smiling gingerbread friend. We've handled the wrapping by placing it in a 5\"x5\" box with a bow and a complimentary card and envelope, making it the ultimate ready-to-give treat.",
      price: 10.00,
      uom: 'card',
      sku: 'CCM-CARD',
      photos: ['/products/cant_catch_me/greeting-card.mp4'],
    },
  })

  const ccm_halfDozen = await prisma.product.upsert({
    where: { sku: 'CCM-6' },
    update: {
      name: "Can't Catch Me - Half Dozen",
      description: "Six delightful Can't Catch Me cookies",
      price: 25.00,
      uom: 'box',
      photos: ['/products/cant_catch_me/half-dozen.jpg'],
    },
    create: {
      name: "Can't Catch Me - Half Dozen",
      description: "Six delightful Can't Catch Me cookies",
      price: 25.00,
      uom: 'box',
      sku: 'CCM-6',
      photos: ['/products/cant_catch_me/half-dozen.jpg'],
    },
  })

  const ccm_dozen = await prisma.product.upsert({
    where: { sku: 'CCM-12' },
    update: {
      name: "Can't Catch Me - Dozen",
      description: "A dozen fun Can't Catch Me cookies",
      price: 50.00,
      uom: 'box',
      photos: ['/products/cant_catch_me/dozen.jpg'],
    },
    create: {
      name: "Can't Catch Me - Dozen",
      description: "A dozen fun Can't Catch Me cookies",
      price: 50.00,
      uom: 'box',
      sku: 'CCM-12',
      photos: ['/products/cant_catch_me/dozen.jpg'],
    },
  })

  // Sweater Weather Products
  const sw_greetingCard = await prisma.product.upsert({
    where: { sku: 'SW-CARD' },
    update: {
      name: 'Sweater Weather - Greeting Card',
      description: "Cozy up with our gourmet Apple Pie à la Mode mug cookie, beautifully decorated with delicate snowflakes and the phrase 'Sweater Weather.' Packaged in a 5x5 box with a complimentary winter card and envelope, this treat creates the perfect cozy presentation of a ready to give gift.",
      price: 12.00,
      uom: 'card',
      photos: ['/products/sweater_weather/greeting-card.mp4'],
    },
    create: {
      name: 'Sweater Weather - Greeting Card',
      description: "Cozy up with our gourmet Apple Pie à la Mode mug cookie, beautifully decorated with delicate snowflakes and the phrase 'Sweater Weather.' Packaged in a 5x5 box with a complimentary winter card and envelope, this treat creates the perfect cozy presentation of a ready to give gift.",
      price: 12.00,
      uom: 'card',
      sku: 'SW-CARD',
      photos: ['/products/sweater_weather/greeting-card.mp4'],
    },
  })

  const sw_halfDozen = await prisma.product.upsert({
    where: { sku: 'SW-6' },
    update: {
      name: 'Sweater Weather - Half Dozen',
      description: 'Six cozy Sweater Weather cookies',
      price: 30.00,
      uom: 'box',
      photos: ['/products/sweater_weather/half-dozen.jpg'],
    },
    create: {
      name: 'Sweater Weather - Half Dozen',
      description: 'Six cozy Sweater Weather cookies',
      price: 30.00,
      uom: 'box',
      sku: 'SW-6',
      photos: ['/products/sweater_weather/half-dozen.jpg'],
    },
  })

  const sw_dozen = await prisma.product.upsert({
    where: { sku: 'SW-12' },
    update: {
      name: 'Sweater Weather - Dozen',
      description: 'A dozen warm Sweater Weather cookies',
      price: 60.00,
      uom: 'box',
      photos: ['/products/sweater_weather/dozen.jpg'],
    },
    create: {
      name: 'Sweater Weather - Dozen',
      description: 'A dozen warm Sweater Weather cookies',
      price: 60.00,
      uom: 'box',
      sku: 'SW-12',
      photos: ['/products/sweater_weather/dozen.jpg'],
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
