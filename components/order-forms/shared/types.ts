import { FieldErrors, UseFormRegister } from 'react-hook-form'

export type OrderType = 'public' | 'business' | 'group'

export interface OrderFormProps {
  dropId: string
  dropName: string
  orderType: OrderType
  attribution?: string
}

// Re-export commonly used react-hook-form types for convenience
export type { FieldErrors, UseFormRegister }
