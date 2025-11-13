import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ErrorMessage } from './ErrorMessage'

export interface GroupMember {
  name: string
  snowmanQty: number
  gingerbreadQty: number
  mittensQty: number
}

// Helper to safely extract error message
function getErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GroupInfoStep({
  register,
  errors,
  groupMembers,
  onAddMember,
  onRemoveMember,
  onUpdateMember
}: {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  groupMembers: GroupMember[]
  onAddMember: () => void
  onRemoveMember: (index: number) => void
  onUpdateMember: (index: number, field: keyof GroupMember, value: string | number) => void
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Group Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Coordinator Name *
        </label>
        <input
          type="text"
          {...register('coordinatorName')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <ErrorMessage error={errors.coordinatorName?.message} />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Group Members *
          </label>
          <button
            type="button"
            onClick={onAddMember}
            className="text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
          >
            + Add Member
          </button>
        </div>

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
            <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-3">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-700">Member {idx + 1}</h4>
                <button
                  type="button"
                  onClick={() => onRemoveMember(idx)}
                  className="text-red-600 text-sm hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <input
                type="text"
                placeholder="Member name"
                value={member.name}
                onChange={(e) => onUpdateMember(idx, 'name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <ErrorMessage error={getMemberError('name')} />
            </div>
          )
        })}

        <ErrorMessage error={errors.groupMembers?.message} />
      </div>
    </div>
  )
}
