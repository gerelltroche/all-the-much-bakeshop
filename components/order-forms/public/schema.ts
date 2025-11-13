import { z } from 'zod'

// Phone number validation (US format)
const phoneRegex = /^(\+?1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/

// ZIP code validation (US 5-digit)
const zipRegex = /^\d{5}$/

// Base contact information schema
const contactInfoSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.email('Please enter a valid email address'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid US phone number (e.g., 555-123-4567)'),
  zipCode: z.string()
    .min(1, 'ZIP code is required')
    .regex(zipRegex, 'Please enter a valid 5-digit ZIP code'),
})

// Cookie quantities for individual orders
const cookieQuantitiesSchema = z.object({
  snowmanQty: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  gingerbreadQty: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  mittensQty: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
}).refine(
  (data) => data.snowmanQty + data.gingerbreadQty + data.mittensQty > 0,
  {
    message: 'Please order at least one cookie',
    path: ['snowmanQty'], // Show error on first field
  }
)

// Fulfillment schema
const fulfillmentSchema = z.object({
  fulfillmentType: z.enum(['pickup', 'delivery'], {
    message: 'Please select pickup or delivery'
  }),
  requestedDate: z.string()
    .min(1, 'Requested date is required')
    .refine((date) => {
      const selected = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, {
      message: 'Date must be today or in the future',
    }),
})

// Public order schema
export const publicOrderSchema = contactInfoSchema
  .extend(cookieQuantitiesSchema.shape)
  .extend(fulfillmentSchema.shape)
  .extend({
    orderType: z.literal('public'),
    attribution: z.string().optional(),
  })

// Type exports
export type PublicOrderFormData = z.infer<typeof publicOrderSchema>
