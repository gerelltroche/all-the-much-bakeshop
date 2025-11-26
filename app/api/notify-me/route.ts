import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

const notifySchema = z.object({
  email: z.email(),
  dropId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, dropId } = notifySchema.parse(body)

    // Create email record for this specific drop
    try {
      await prisma.email.create({
        data: {
          email,
          dropId,
          isSubscribed: true,
        },
      })

      // Send welcome email (don't await to avoid blocking the response)
      sendWelcomeEmail(email).catch((err) => {
        console.error('Failed to send welcome email:', err)
      })

      return NextResponse.json({
        success: true,
        message: 'Successfully added to notification list!',
      })
    } catch (error) {
      // Check if it's a unique constraint error (email already exists)
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        // Email already exists, but that's okay - they're still on the list
        return NextResponse.json({
          success: true,
          message: 'You are already on the notification list!',
        })
      }
      throw error
    }
  } catch (error) {
    console.error('Notify-me error:', error)

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
        error: 'Failed to save email. Please try again later.',
      },
      { status: 500 }
    )
  }
}
