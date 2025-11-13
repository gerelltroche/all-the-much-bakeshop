import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ErrorMessage } from './ErrorMessage'
import { COOKIE_PRICE } from './constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CookieSelectionStep({
  register,
  errors,
  calculateTotal,
  calculateTotalCookies
}: {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  calculateTotal: () => number
  calculateTotalCookies: () => number
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Cookie Selection</h2>
      <p className="text-sm text-gray-600 mb-4">${COOKIE_PRICE.toFixed(2)} per cookie</p>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Snowman
          </label>
          <input
            type="number"
            min="0"
            {...register('snowmanQty', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <ErrorMessage error={errors.snowmanQty?.message} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gingerbread
          </label>
          <input
            type="number"
            min="0"
            {...register('gingerbreadQty', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <ErrorMessage error={errors.gingerbreadQty?.message} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mittens
          </label>
          <input
            type="number"
            min="0"
            {...register('mittensQty', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <ErrorMessage error={errors.mittensQty?.message} />
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
        <p className="text-lg font-semibold text-amber-900">
          Total: {calculateTotalCookies()} cookies - ${calculateTotal().toFixed(2)}
        </p>
      </div>
    </div>
  )
}
