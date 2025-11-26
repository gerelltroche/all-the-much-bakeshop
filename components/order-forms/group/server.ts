'use server'

import { groupOrderSchema, GroupOrderFormData } from './schema'
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

export async function submitGroupOrder(data: GroupOrderFormData & { dropId: string; totalCookies: number; totalPrice: number }) {
  try {
    // Validate the data
    const validatedData = groupOrderSchema.parse(data)

    // Calculate totals from group members
    const snowmanQty = validatedData.groupMembers.reduce((sum, m) => sum + m.snowmanQty, 0)
    const gingerbreadQty = validatedData.groupMembers.reduce((sum, m) => sum + m.gingerbreadQty, 0)
    const mittensQty = validatedData.groupMembers.reduce((sum, m) => sum + m.mittensQty, 0)

    // Find or create customer (the coordinator)
    let customer = await prisma.customer.findUnique({
      where: { email: validatedData.email },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          zipCode: validatedData.zipCode,
          isBusiness: false,
        },
      })
    }

    // Build order items from aggregated cookie quantities
    const orderItems: { productId: number; quantity: number; priceAtOrder: number }[] = []

    if (snowmanQty > 0) {
      orderItems.push({
        productId: COOKIE_PRODUCTS.snowman.id,
        quantity: snowmanQty,
        priceAtOrder: COOKIE_PRODUCTS.snowman.price,
      })
    }
    if (gingerbreadQty > 0) {
      orderItems.push({
        productId: COOKIE_PRODUCTS.gingerbread.id,
        quantity: gingerbreadQty,
        priceAtOrder: COOKIE_PRODUCTS.gingerbread.price,
      })
    }
    if (mittensQty > 0) {
      orderItems.push({
        productId: COOKIE_PRODUCTS.mittens.id,
        quantity: mittensQty,
        priceAtOrder: COOKIE_PRODUCTS.mittens.price,
      })
    }

    // Create the order in the database
    // Note: Group member details are stored as attribution JSON for now
    const order = await prisma.order.create({
      data: {
        dropId: data.dropId,
        customerId: customer.id,
        email: validatedData.email,
        orderType: 'group',
        attribution: JSON.stringify({
          coordinatorName: validatedData.coordinatorName,
          groupMembers: validatedData.groupMembers,
        }),
        fulfillmentType: validatedData.fulfillmentType,
        requestedDate: new Date(validatedData.requestedDate),
        totalAmount: data.totalPrice,
        status: 'pending',
        orderItems: {
          create: orderItems,
        },
      },
    })

    // Send order confirmation email asynchronously
    sendOrderConfirmationEmail(validatedData.email, {
      orderNumber: order.id,
      customerName: validatedData.name,
      cookies: [
        { name: 'Snowman', quantity: snowmanQty, price: 4 },
        { name: 'Gingerbread', quantity: gingerbreadQty, price: 4 },
        { name: 'Mittens', quantity: mittensQty, price: 4 },
      ].filter(cookie => cookie.quantity > 0),
      total: data.totalPrice,
      fulfillmentType: validatedData.fulfillmentType,
      fulfillmentDetails: validatedData.fulfillmentType === 'pickup'
        ? `Group order coordinated by ${validatedData.coordinatorName}\nPickup location details will be sent closer to your requested date.`
        : `Group order coordinated by ${validatedData.coordinatorName}\nDelivery details will be sent closer to your requested date.`,
      fulfillmentDate: new Date(validatedData.requestedDate),
    }).catch((error) => {
      console.error('Failed to send order confirmation email:', error)
    })

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Error submitting group order:', error)
    return { success: false, error: 'Failed to submit order. Please try again.' }
  }
}
