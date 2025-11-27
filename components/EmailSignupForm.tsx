'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  generateEventId,
  getTrackingParams,
  trackSubscribePixel,
} from '@/lib/meta-pixel-client'

const emailSignupSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.email('Please enter a valid email address'),
})

type EmailSignupFormData = z.infer<typeof emailSignupSchema>

export function EmailSignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailSignupFormData>({
    resolver: zodResolver(emailSignupSchema),
  })

  const onSubmit = async (data: EmailSignupFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Generate event_id for deduplication and get tracking params
    const eventId = generateEventId()
    const trackingParams = getTrackingParams(eventId)

    // Fire browser pixel event
    trackSubscribePixel(eventId)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          ...trackingParams,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: "You're in! Check your email for a welcome message.",
        })
        reset()
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.',
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Failed to sign up. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 rounded-lg border-2 border-rose-300 shadow-md">
      <h3 className="text-2xl font-bold text-rose-900 mb-2">
        Hop into the cookie jar!
      </h3>
      <p className="text-sm text-rose-800 mb-4">
        Be the first to know about new drops, special flavors, and exclusive
        offers.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-rose-800 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder:text-rose-300"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-rose-800 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder:text-rose-300"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isSubmitting ? 'Signing up...' : 'Sign Me Up'}
        </button>

        {submitStatus && (
          <div
            className={`p-3 rounded-lg ${
              submitStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  )
}
