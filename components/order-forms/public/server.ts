'use server'

import { publicOrderSchema, PublicOrderFormData } from './schema'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function submitPublicOrder(data: PublicOrderFormData & { dropId: string; totalCookies: number; totalPrice: number }) {
  try {
    // Validate the data
    const validatedData = publicOrderSchema.parse(data)

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        dropId: data.dropId,
        orderType: 'public',
        attribution: data.attribution ?? null,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        zipCode: validatedData.zipCode,
        snowmanQty: validatedData.snowmanQty,
        gingerbreadQty: validatedData.gingerbreadQty,
        mittensQty: validatedData.mittensQty,
        totalCookies: data.totalCookies,
        totalPrice: data.totalPrice,
        fulfillmentType: validatedData.fulfillmentType,
        requestedDate: new Date(validatedData.requestedDate),
        status: 'pending',
      },
    })

    // Send order confirmation email asynchronously
    sendOrderConfirmationEmail(validatedData.email, {
      orderNumber: order.orderNumber,
      customerName: validatedData.name,
      cookies: [
        { name: 'Snowman', quantity: validatedData.snowmanQty, price: 4 },
        { name: 'Gingerbread', quantity: validatedData.gingerbreadQty, price: 4 },
        { name: 'Mittens', quantity: validatedData.mittensQty, price: 4 },
      ].filter(cookie => cookie.quantity > 0),
      total: data.totalPrice,
      fulfillmentType: validatedData.fulfillmentType,
      fulfillmentDetails: validatedData.fulfillmentType === 'pickup'
        ? 'Pickup location details will be sent closer to your requested date.'
        : 'Delivery details will be sent closer to your requested date.',
      fulfillmentDate: new Date(validatedData.requestedDate),
    }).catch((error) => {
      console.error('Failed to send order confirmation email:', error)
    })

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Error submitting public order:', error)
    return { success: false, error: 'Failed to submit order. Please try again.' }
  }
}
