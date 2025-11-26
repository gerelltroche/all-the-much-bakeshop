'use server'

import { businessOrderSchema, BusinessOrderFormData } from './schema'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

interface CookieProduct {
  id: number;
  name: string;
  price: number;
}

// Map cookie types to product IDs - these should be fetched or configured
const COOKIE_PRODUCTS: Record<string, CookieProduct> = {
  snowman: { id: 1, name: 'Snowman', price: 4 },
  gingerbread: { id: 2, name: 'Gingerbread', price: 4 },
  mittens: { id: 3, name: 'Mittens', price: 4 },
}

export async function submitBusinessOrder(data: BusinessOrderFormData & { dropId: string; totalCookies: number; totalPrice: number }) {
  try {
    // Validate the data
    const validatedData = businessOrderSchema.parse(data)

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: validatedData.email },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          street: validatedData.street,
          city: validatedData.city,
          state: validatedData.state,
          zipCode: validatedData.zipCode,
          businessName: validatedData.businessName,
          isBusiness: true,
        },
      })
    }

    // Build order items from cookie quantities
    const orderItems: { productId: number; quantity: number; priceAtOrder: number }[] = []

    if (validatedData.snowmanQty > 0) {
      orderItems.push({
        productId: COOKIE_PRODUCTS.snowman.id,
        quantity: validatedData.snowmanQty,
        priceAtOrder: COOKIE_PRODUCTS.snowman.price,
      })
    }
    if (validatedData.gingerbreadQty > 0) {
      orderItems.push({
        productId: COOKIE_PRODUCTS.gingerbread.id,
        quantity: validatedData.gingerbreadQty,
        priceAtOrder: COOKIE_PRODUCTS.gingerbread.price,
      })
    }
    if (validatedData.mittensQty > 0) {
      orderItems.push({
        productId: COOKIE_PRODUCTS.mittens.id,
        quantity: validatedData.mittensQty,
        priceAtOrder: COOKIE_PRODUCTS.mittens.price,
      })
    }

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        dropId: data.dropId,
        customerId: customer.id,
        email: validatedData.email,
        orderType: 'business',
        attribution: data.attribution ?? null,
        fulfillmentType: validatedData.fulfillmentType,
        deliveryStreet: validatedData.street,
        deliveryCity: validatedData.city,
        deliveryState: validatedData.state,
        deliveryZip: validatedData.zipCode,
        requestedDate: new Date(validatedData.requestedDate),
        totalAmount: data.totalPrice,
        status: 'pending',
        orderItems: {
          create: orderItems,
        },
      },
    })

    // Send order confirmation email asynchronously
    const deliveryAddress = `${validatedData.street}, ${validatedData.city}, ${validatedData.state} ${validatedData.zipCode}`
    sendOrderConfirmationEmail(validatedData.email, {
      orderNumber: order.id,
      customerName: validatedData.name,
      cookies: [
        { name: 'Snowman', quantity: validatedData.snowmanQty, price: 4 },
        { name: 'Gingerbread', quantity: validatedData.gingerbreadQty, price: 4 },
        { name: 'Mittens', quantity: validatedData.mittensQty, price: 4 },
      ].filter(cookie => cookie.quantity > 0),
      total: data.totalPrice,
      fulfillmentType: validatedData.fulfillmentType,
      fulfillmentDetails: validatedData.fulfillmentType === 'pickup'
        ? `Business: ${validatedData.businessName}\nPickup location details will be sent closer to your requested date.`
        : `Business: ${validatedData.businessName}\nDelivery to: ${deliveryAddress}`,
      fulfillmentDate: new Date(validatedData.requestedDate),
    }).catch((error) => {
      console.error('Failed to send order confirmation email:', error)
    })

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Error submitting business order:', error)
    return { success: false, error: 'Failed to submit order. Please try again.' }
  }
}
