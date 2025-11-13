'use server'

import { publicOrderSchema, PublicOrderFormData } from './schema'
import { prisma } from '@/lib/prisma'

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

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Error submitting public order:', error)
    return { success: false, error: 'Failed to submit order. Please try again.' }
  }
}
