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

// Business-specific fields
const businessInfoSchema = z.object({
  businessName: z.string()
    .min(1, 'Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(200, 'Business name must be less than 200 characters'),
  street: z.string()
    .min(1, 'Street address is required')
    .min(5, 'Please enter a complete street address')
    .max(200, 'Street address must be less than 200 characters'),
  city: z.string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  state: z.string()
    .min(1, 'State is required')
    .length(2, 'Please enter a 2-letter state code (e.g., CA)')
    .regex(/^[A-Z]{2}$/, 'State must be a valid 2-letter code in uppercase'),
})

// Cookie quantities
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
    path: ['snowmanQty'],
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

// Business order schema
export const businessOrderSchema = contactInfoSchema
  .extend(businessInfoSchema.shape)
  .extend(cookieQuantitiesSchema.shape)
  .extend(fulfillmentSchema.shape)
  .extend({
    orderType: z.literal('business'),
    attribution: z.string().optional(),
  })

// Type exports
export type BusinessOrderFormData = z.infer<typeof businessOrderSchema>
