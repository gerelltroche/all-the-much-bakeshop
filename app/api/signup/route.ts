import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getActiveDrop } from '@/lib/drops'
import { sendWelcomeEmail } from '@/lib/email'

const signupSchema = z.object({
  name: z.string().min(1).min(2).max(100),
  email: z.email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = signupSchema.parse(body)

    // Try to get the active drop (winter-2025 is the current slug)
    const activeDrop = await getActiveDrop('winter-2025')

    // Create email record
    try {
      await prisma.email.create({
        data: {
          email,
          name,
          dropId: activeDrop?.id ?? null,
          isSubscribed: true,
        },
      })

      // Send welcome email asynchronously
      sendWelcomeEmail(email, name).catch((error) => {
        console.error('Failed to send welcome email:', error)
      })

      return NextResponse.json({
        success: true,
        message: 'Successfully signed up!',
      })
    } catch (error) {
      // Check if it's a unique constraint error (email already exists)
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        return NextResponse.json({
          success: false,
          error: 'This email is already subscribed!',
        })
      }
      throw error
    }
  } catch (error) {
    console.error('Signup error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input. Please check your information.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sign up. Please try again later.',
      },
      { status: 500 }
    )
  }
}
