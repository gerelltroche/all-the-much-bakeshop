import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ErrorMessage } from './ErrorMessage'
import { BusinessOrderFormData } from '@/components/order-forms/business/schema'

export function BusinessInfoStep({
  register,
  errors
}: {
  register: UseFormRegister<BusinessOrderFormData>
  errors: FieldErrors<BusinessOrderFormData>
}): React.JSX.Element {
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
          Street Address *
        </label>
        <input
          type="text"
          {...register('street')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="123 Main St"
        />
        <ErrorMessage error={errors.street?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            {...register('city')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <ErrorMessage error={errors.city?.message} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            {...register('state')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="CA"
            maxLength={2}
          />
          <ErrorMessage error={errors.state?.message} />
        </div>
      </div>
    </div>
  )
}
