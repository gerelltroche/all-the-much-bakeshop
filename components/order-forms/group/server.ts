'use server'

import { Prisma } from '@prisma/client'
import { groupOrderSchema, GroupOrderFormData } from './schema'
import { prisma } from '@/lib/prisma'

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
        groupMembers: validatedData.groupMembers as unknown as Prisma.JsonArray, // Store as JSON
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

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Error submitting group order:', error)
    return { success: false, error: 'Failed to submit order. Please try again.' }
  }
}
