'use server'

import { Prisma } from '@prisma/client'
import { groupOrderSchema, GroupOrderFormData } from './schema'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function submitGroupOrder(data: GroupOrderFormData & { dropId: string; totalCookies: number; totalPrice: number }) {
  try {
    // Validate the data
    const validatedData = groupOrderSchema.parse(data)

    // Calculate totals from group members
    const snowmanQty = validatedData.groupMembers.reduce((sum, m) => sum + m.snowmanQty, 0)
    const gingerbreadQty = validatedData.groupMembers.reduce((sum, m) => sum + m.gingerbreadQty, 0)
    const mittensQty = validatedData.groupMembers.reduce((sum, m) => sum + m.mittensQty, 0)

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        dropId: data.dropId,
        orderType: 'group',
        attribution: data.attribution ?? null,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        zipCode: validatedData.zipCode,
        coordinatorName: validatedData.coordinatorName,
        groupMembers: validatedData.groupMembers as Prisma.InputJsonValue, // Store as JSON
        snowmanQty,
        gingerbreadQty,
        mittensQty,
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
