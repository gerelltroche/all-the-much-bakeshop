import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ErrorMessage } from './ErrorMessage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FulfillmentStep({
  register,
  errors
}: {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Fulfillment Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fulfillment Type *
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="pickup"
              {...register('fulfillmentType')}
              className="mr-2"
            />
            Pickup
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="delivery"
              {...register('fulfillmentType')}
              className="mr-2"
            />
            Delivery
          </label>
        </div>
        <ErrorMessage error={errors.fulfillmentType?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Requested Date *
        </label>
        <input
          type="date"
          {...register('requestedDate')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <ErrorMessage error={errors.requestedDate?.message} />
      </div>
    </div>
  )
}
