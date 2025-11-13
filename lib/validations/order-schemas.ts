import { z } from 'zod'

const baseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),

  snowmanQty: z.number().int().min(0).default(0),
  gingerbreadQty: z.number().int().min(0).default(0),
  mittensQty: z.number().int().min(0).default(0),

  fulfillmentType: z.enum(['pickup', 'delivery']),
  requestedDate: z.date().optional()
})

export const publicOrderSchema = baseSchema

export const businessOrderSchema = baseSchema.extend({
  businessName: z.string().min(1, 'Business name is required'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required').length(2, 'State must be 2 letters')
})

export const groupOrderSchema = z.object({
  coordinatorName: z.string().min(1, 'Coordinator name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),

  groupMembers: z.array(z.object({
    name: z.string().min(1, 'Member name is required'),
    snowmanQty: z.number().int().min(0).default(0),
    gingerbreadQty: z.number().int().min(0).default(0),
    mittensQty: z.number().int().min(0).default(0)
  })).min(1, 'At least one group member is required'),

  fulfillmentType: z.enum(['pickup', 'delivery']),
  requestedDate: z.date().optional()
})
