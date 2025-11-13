'use client'

import { PublicOrderForm } from './order-forms/public/form'
import { BusinessOrderForm } from './order-forms/business/form'
import { GroupOrderForm } from './order-forms/group/form'
import { OrderFormProps } from './order-forms/shared/types'

/**
 * Main OrderForm router component
 * Routes to the appropriate form based on orderType
 */
export default function OrderForm({ dropId, orderType, attribution }: OrderFormProps) {
  if (orderType === 'business') {
    return <BusinessOrderForm dropId={dropId} attribution={attribution} />
  }

  if (orderType === 'group') {
    return <GroupOrderForm dropId={dropId} attribution={attribution} />
  }

  return <PublicOrderForm dropId={dropId} attribution={attribution} />
}
