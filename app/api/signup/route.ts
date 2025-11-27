import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getActiveDrop } from '@/lib/drops'
import { sendWelcomeEmail } from '@/lib/email'
import {
  trackSubscribe,
  buildUserData,
  getClientIp,
  getUserAgent,
  extractTrackingParams,
} from '@/lib/meta-conversions'

const signupSchema = z.object({
  name: z.string().min(1).min(2).max(100),
  email: z.email(),
  // Optional tracking params from client
  event_id: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = signupSchema.parse(body)

    // Extract tracking params for Meta CAPI
    const trackingParams = extractTrackingParams(body)
    const ipAddress = getClientIp(request)
    const userAgent = getUserAgent(request)

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

      // Track Subscribe event via Meta CAPI (fire and forget)
      trackSubscribe({
        eventId: trackingParams.event_id,
        eventSourceUrl: request.headers.get('referer') || undefined,
        userData: buildUserData({
          email,
          name,
          ipAddress,
          userAgent,
          fbp: trackingParams.fbp,
          fbc: trackingParams.fbc,
        }),
      }).catch((error) => {
        console.error('Meta CAPI tracking error:', error)
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
