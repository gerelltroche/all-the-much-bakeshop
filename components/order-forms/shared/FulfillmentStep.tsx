import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { ErrorMessage } from './ErrorMessage'
import { useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FulfillmentStep({
  register,
  errors,
  orderTotal = 0,
  watch,
  setValue
}: {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  orderTotal?: number
  watch: UseFormWatch<any>
  setValue: UseFormSetValue<any>
}) {
  const deliveryEnabled = orderTotal >= 100
  const DELIVERY_MINIMUM = 100
  const fulfillmentType = watch('fulfillmentType')
  const requestedDate = watch('requestedDate')

  // Auto-set pickup date to December 17th
  useEffect(() => {
    if (fulfillmentType === 'pickup') {
      setValue('requestedDate', '2025-12-17')
    }
  }, [fulfillmentType, setValue])

  const deliveryDates = [
    { date: '2025-12-16', label: '16' },
    { date: '2025-12-17', label: '17' },
    { date: '2025-12-18', label: '18' }
  ]

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
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Requested Date *
        </label>

        {fulfillmentType === 'pickup' ? (
          <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-gray-700">
              Pickup Date: <span className="font-semibold text-amber-800">December 17th, 2025</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {deliveryDates.map(({ date, label }) => (
              <label key={date} className="cursor-pointer">
                <input
                  type="radio"
                  value={date}
                  {...register('requestedDate')}
                  className="peer sr-only"
                />
                <div className="h-24 flex flex-col items-center justify-center gap-1 border-2 border-gray-300 rounded-lg bg-white peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:ring-2 peer-checked:ring-amber-500 hover:border-amber-400 transition-all">
                  <span className="text-sm text-gray-500 uppercase">Dec</span>
                  <span className="text-3xl font-bold text-gray-900">{label}</span>
                </div>
              </label>
            ))}
          </div>
        )}

        <ErrorMessage error={errors.requestedDate?.message} />
      </div>
    </div>
  )
}
