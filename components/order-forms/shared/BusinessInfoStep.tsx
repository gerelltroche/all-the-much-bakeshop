import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ErrorMessage } from './ErrorMessage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BusinessInfoStep({
  register,
  errors
}: {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Business Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name *
        </label>
        <input
          type="text"
          {...register('businessName')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <ErrorMessage error={errors.businessName?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Address *
        </label>
        <textarea
          {...register('businessAddress')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          rows={3}
        />
        <ErrorMessage error={errors.businessAddress?.message} />
      </div>
    </div>
  )
}
