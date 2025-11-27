import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'
import {
  trackSubscribe,
  buildUserData,
  getClientIp,
  getUserAgent,
  extractTrackingParams,
} from '@/lib/meta-conversions'

const notifySchema = z.object({
  email: z.email(),
  dropId: z.string(),
  // Optional tracking params from client
  event_id: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, dropId } = notifySchema.parse(body)

    console.log('📧 [notify-me] Received signup request for:', email)

    // Extract tracking params for Meta CAPI
    const trackingParams = extractTrackingParams(body)
    const ipAddress = getClientIp(request)
    const userAgent = getUserAgent(request)

    console.log('📧 [notify-me] Tracking params:', {
      eventId: trackingParams.event_id,
      hasFbp: !!trackingParams.fbp,
      hasFbc: !!trackingParams.fbc
    })

    // Helper to fire tracking (used in both success cases)
    const fireTracking = () => {
      console.log('📧 [notify-me] Firing Meta CAPI tracking...')
      trackSubscribe({
        eventId: trackingParams.event_id,
        eventSourceUrl: request.headers.get('referer') || undefined,
        userData: buildUserData({
          email,
          ipAddress,
          userAgent,
          fbp: trackingParams.fbp,
          fbc: trackingParams.fbc,
        }),
      }).catch((error) => {
        console.error('Meta CAPI tracking error:', error)
      })
    }

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

      // Track Subscribe event via Meta CAPI (fire and forget)
      fireTracking()

      return NextResponse.json({
        success: true,
        message: 'Successfully added to notification list!',
      })
    } catch (error) {
      // Check if it's a unique constraint error (email already exists)
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        // Email already exists, but still track the Subscribe intent
        fireTracking()

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
