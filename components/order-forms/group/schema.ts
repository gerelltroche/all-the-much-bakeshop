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

// Group member schema
const groupMemberSchema = z.object({
  name: z.string()
    .min(1, 'Member name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  snowmanQty: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  gingerbreadQty: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  mittensQty: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
})

// Group-specific fields
const groupInfoSchema = z.object({
  coordinatorName: z.string()
    .min(1, 'Coordinator name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  groupMembers: z.array(groupMemberSchema)
    .min(1, 'At least one group member is required')
    .max(50, 'Maximum 50 group members allowed'),
})

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

// Group order schema
export const groupOrderSchema = contactInfoSchema
  .extend(groupInfoSchema.shape)
  .extend(fulfillmentSchema.shape)
  .extend({
    orderType: z.literal('group'),
    attribution: z.string().optional(),
  })
  .refine(
    (data) => {
      // Check that at least one group member has ordered cookies
      return data.groupMembers.some(
        (member) => member.snowmanQty + member.gingerbreadQty + member.mittensQty > 0
      )
    },
    {
      message: 'At least one group member must order cookies',
      path: ['groupMembers'],
    }
  )

// Type exports
export type GroupOrderFormData = z.infer<typeof groupOrderSchema>
export type GroupMember = z.infer<typeof groupMemberSchema>
