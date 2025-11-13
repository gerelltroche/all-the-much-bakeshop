import { FieldErrors } from 'react-hook-form'
import { ErrorMessage } from './ErrorMessage'
import { COOKIE_PRICE } from './constants'
import { GroupMember } from './GroupInfoStep'

// Helper to safely extract error message
function getErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GroupCookieSelectionStep({
  groupMembers,
  errors,
  onUpdateMember,
  calculateTotal,
  calculateTotalCookies
}: {
  groupMembers: GroupMember[]
  errors: FieldErrors<any>
  onUpdateMember: (index: number, field: keyof GroupMember, value: string | number) => void
  calculateTotal: () => number
  calculateTotalCookies: () => number
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Cookie Selection</h2>
      <p className="text-sm text-gray-600 mb-4">${COOKIE_PRICE.toFixed(2)} per cookie</p>

      {groupMembers.map((member, idx) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const memberError = (errors.groupMembers as any)?.[idx] as unknown
        const getMemberError = (field: string) => {
          if (memberError && typeof memberError === 'object' && field in memberError) {
            const fieldError = (memberError as Record<string, unknown>)[field]
            return getErrorMessage(fieldError)
          }
          return undefined
        }

        return (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-700 mb-3">{member.name !== '' ? member.name : `Member ${String(idx + 1)}`}</h4>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Snowman
                </label>
                <input
                  type="number"
                  min="0"
                  value={member.snowmanQty}
                  onChange={(e) => onUpdateMember(idx, 'snowmanQty', Number(e.target.value) > 0 ? parseInt(e.target.value) : 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <ErrorMessage error={getMemberError('snowmanQty')} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gingerbread
                </label>
                <input
                  type="number"
                  min="0"
                  value={member.gingerbreadQty}
                  onChange={(e) => onUpdateMember(idx, 'gingerbreadQty', Number(e.target.value) > 0 ? parseInt(e.target.value) : 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <ErrorMessage error={getMemberError('gingerbreadQty')} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mittens
                </label>
                <input
                  type="number"
                  min="0"
                  value={member.mittensQty}
                  onChange={(e) => onUpdateMember(idx, 'mittensQty', Number(e.target.value) > 0 ? parseInt(e.target.value) : 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <ErrorMessage error={getMemberError('mittensQty')} />
              </div>
            </div>
          </div>
        )
      })}
      <ErrorMessage error={errors.groupMembers?.message} />

      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
        <p className="text-lg font-semibold text-amber-900">
          Total: {calculateTotalCookies()} cookies - ${calculateTotal().toFixed(2)}
        </p>
      </div>
    </div>
  )
}
