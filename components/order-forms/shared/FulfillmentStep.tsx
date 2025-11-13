import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ErrorMessage } from './ErrorMessage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FulfillmentStep({
  register,
  errors,
  orderTotal = 0
}: {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  orderTotal?: number
}) {
  const deliveryEnabled = orderTotal >= 100
  const DELIVERY_MINIMUM = 100

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Fulfillment Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Fulfillment Type *
        </label>
        <div className="grid grid-cols-2 gap-4">
          {/* Pickup Option */}
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="pickup"
              defaultChecked
              {...register('fulfillmentType')}
              className="peer sr-only"
            />
            <div className="h-32 flex flex-col items-center justify-center gap-2 border-2 border-gray-300 rounded-lg bg-white peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:ring-2 peer-checked:ring-amber-500 hover:border-amber-400 transition-all">
              <span className="text-4xl">🏪</span>
              <span className="text-lg font-semibold text-gray-900">Pickup</span>
            </div>
          </label>

          {/* Delivery Option */}
          <label className={`relative ${deliveryEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
            <input
              type="radio"
              value="delivery"
              disabled={!deliveryEnabled}
              {...register('fulfillmentType')}
              className="peer sr-only"
            />
            <div className={`h-32 flex flex-col items-center justify-center gap-2 border-2 rounded-lg transition-all ${
              deliveryEnabled
                ? 'border-gray-300 bg-white peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:ring-2 peer-checked:ring-amber-500 hover:border-amber-400'
                : 'border-gray-200 bg-gray-100 opacity-50'
            }`}>
              <span className="text-4xl">🚚</span>
              <span className="text-lg font-semibold text-gray-900">Delivery</span>
            </div>
          </label>
        </div>

        {!deliveryEnabled && (
          <p className="mt-2 text-sm text-gray-600">
            You need at least ${DELIVERY_MINIMUM} of cookies in order to get delivery within 8 miles of Mark Twain 32828.
          </p>
        )}

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
