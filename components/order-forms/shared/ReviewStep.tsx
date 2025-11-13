import { OrderType } from './types'

interface BaseFormData {
  orderType: OrderType
  name: string
  email: string
  phone: string
  zipCode: string
  fulfillmentType: 'pickup' | 'delivery' | ''
  requestedDate: string
}

interface PublicFormData extends BaseFormData {
  orderType: 'public'
  snowmanQty: number
  gingerbreadQty: number
  mittensQty: number
}

interface BusinessFormData extends BaseFormData {
  orderType: 'business'
  businessName: string
  businessAddress: string
  snowmanQty: number
  gingerbreadQty: number
  mittensQty: number
}

interface GroupFormData extends BaseFormData {
  orderType: 'group'
  coordinatorName: string
  groupMembers: {
    name: string
    snowmanQty: number
    gingerbreadQty: number
    mittensQty: number
  }[]
}

type FormData = PublicFormData | BusinessFormData | GroupFormData

export function ReviewStep({
  formValues,
  orderType,
  calculateTotal,
  calculateTotalCookies
}: {
  formValues: FormData
  orderType: OrderType
  calculateTotal: () => number
  calculateTotalCookies: () => number
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Review Your Order</h2>

      <div className="space-y-3">
        <div className="border-b pb-3">
          <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
          <p className="text-sm text-gray-600">{formValues.name}</p>
          <p className="text-sm text-gray-600">{formValues.email}</p>
          <p className="text-sm text-gray-600">{formValues.phone}</p>
          <p className="text-sm text-gray-600">ZIP: {formValues.zipCode}</p>
        </div>

        {orderType === 'business' && formValues.orderType === 'business' && (
          <div className="border-b pb-3">
            <h3 className="font-semibold text-gray-700 mb-2">Business Information</h3>
            <p className="text-sm text-gray-600">{formValues.businessName}</p>
            <p className="text-sm text-gray-600">{formValues.businessAddress}</p>
          </div>
        )}

        {orderType === 'group' && formValues.orderType === 'group' && (
          <div className="border-b pb-3">
            <h3 className="font-semibold text-gray-700 mb-2">Group Information</h3>
            <p className="text-sm text-gray-600">Coordinator: {formValues.coordinatorName}</p>
            <p className="text-sm text-gray-600">Members: {formValues.groupMembers.length}</p>
          </div>
        )}

        <div className="border-b pb-3">
          <h3 className="font-semibold text-gray-700 mb-2">Cookie Order</h3>
          {orderType === 'group' && formValues.orderType === 'group' ? (
            formValues.groupMembers.map((member, idx) => (
              <div key={idx} className="text-sm text-gray-600 mb-2">
                <p className="font-medium">{member.name}</p>
                <p className="ml-4">
                  Snowman: {member.snowmanQty}, Gingerbread: {member.gingerbreadQty}, Mittens: {member.mittensQty}
                </p>
              </div>
            ))
          ) : (formValues.orderType === 'business') ? (
            <>
              <p className="text-sm text-gray-600">Snowman: {formValues.snowmanQty}</p>
              <p className="text-sm text-gray-600">Gingerbread: {formValues.gingerbreadQty}</p>
              <p className="text-sm text-gray-600">Mittens: {formValues.mittensQty}</p>
            </>
          ) : null}
        </div>

        <div className="border-b pb-3">
          <h3 className="font-semibold text-gray-700 mb-2">Fulfillment</h3>
          <p className="text-sm text-gray-600 capitalize">{formValues.fulfillmentType}</p>
          <p className="text-sm text-gray-600">Date: {formValues.requestedDate}</p>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <p className="text-xl font-bold text-amber-900">
            Total: {calculateTotalCookies()} cookies
          </p>
          <p className="text-2xl font-bold text-amber-900">
            ${calculateTotal().toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
