'use server'

import { businessOrderSchema, BusinessOrderFormData } from './schema'
import { prisma } from '@/lib/prisma'

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

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Error submitting business order:', error)
    return { success: false, error: 'Failed to submit order. Please try again.' }
  }
}
