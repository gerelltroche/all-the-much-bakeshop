'use server'

import { businessOrderSchema, BusinessOrderFormData } from './schema'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function submitBusinessOrder(data: BusinessOrderFormData & { dropId: string; totalCookies: number; totalPrice: number }) {
  try {
    // Validate the data
    const validatedData = businessOrderSchema.parse(data)

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        dropId: data.dropId,
        orderType: 'business',
        attribution: data.attribution ?? null,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        street: validatedData.street,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        businessName: validatedData.businessName,
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
    const deliveryAddress = `${validatedData.street}, ${validatedData.city}, ${validatedData.state} ${validatedData.zipCode}`
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
