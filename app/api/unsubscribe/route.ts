import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const unsubscribeSchema = z.object({
  email: z.email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = unsubscribeSchema.parse(body)

    // Update the subscriber's isSubscribed status to false
    const result = await prisma.email.updateMany({
      where: { email: email.toLowerCase() },
      data: { isSubscribed: false },
    })

    if (result.count === 0) {
      // Email not found in our list
      return NextResponse.json({
        success: true,
        message: 'Email not found in our mailing list.',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from our mailing list.',
    })
  } catch (error) {
    console.error('Unsubscribe error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to unsubscribe. Please try again later.',
      },
      { status: 500 }
    )
  }
}
