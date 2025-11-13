'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { groupOrderSchema, GroupOrderFormData, GroupMember } from './schema'
import { submitGroupOrder } from './server'
import { ContactInfoStep } from '../shared/ContactInfoStep'
import { GroupInfoStep } from '../shared/GroupInfoStep'
import { GroupCookieSelectionStep } from '../shared/GroupCookieSelectionStep'
import { FulfillmentStep } from '../shared/FulfillmentStep'
import { ReviewStep } from '../shared/ReviewStep'
import { NavigationButtons } from '../shared/NavigationButtons'
import { COOKIE_PRICE } from '../shared/constants'

interface GroupOrderFormProps {
  dropId: string
  attribution?: string
}

export function GroupOrderForm({ dropId, attribution }: GroupOrderFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<GroupOrderFormData>({
    resolver: zodResolver(groupOrderSchema),
    defaultValues: {
      orderType: 'group',
      attribution: attribution ?? '',
      name: '',
      email: '',
      phone: '',
      zipCode: '',
      coordinatorName: '',
      groupMembers: [],
      fulfillmentType: '' as 'pickup' | 'delivery',
      requestedDate: '',
    },
    mode: 'onChange',
  })

  const formValues = watch()
  const totalSteps = 5

  const calculateTotal = (): number => {
    return formValues.groupMembers.reduce((sum, member) =>
      sum + member.snowmanQty + member.gingerbreadQty + member.mittensQty, 0
    ) * COOKIE_PRICE
  }

  const calculateTotalCookies = (): number => {
    return formValues.groupMembers.reduce((sum, member) =>
      sum + member.snowmanQty + member.gingerbreadQty + member.mittensQty, 0
    )
  }

  const onSubmit = async (data: GroupOrderFormData): Promise<void> => {
    setIsSubmitting(true)

    try {
      const totalCookies = calculateTotalCookies()
      const totalPrice = calculateTotal()

      const orderData = {
        dropId,
        ...data,
        totalCookies,
        totalPrice,
      }

      const result = await submitGroupOrder(orderData)

      if (result.success) {
        alert('Order submitted successfully!')
        // TODO: Redirect to success page or reset form
      } else {
        alert(result.error ?? 'Failed to submit order. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof GroupOrderFormData)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'email', 'phone', 'zipCode']
        break
      case 2:
        fieldsToValidate = ['coordinatorName', 'groupMembers']
        break
      case 3:
        fieldsToValidate = ['groupMembers']
        break
      case 4:
        fieldsToValidate = ['fulfillmentType', 'requestedDate']
        break
    }

    const isValid = await trigger(fieldsToValidate)
    return isValid
  }

  const handleNext = async (): Promise<void> => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      setCurrentStep(prev => Math.min(totalSteps, prev + 1))
    }
  }

  const handlePrevious = (): void => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const addGroupMember = (): void => {
    const currentMembers = formValues.groupMembers
    setValue('groupMembers', [
      ...currentMembers,
      { name: '', snowmanQty: 0, gingerbreadQty: 0, mittensQty: 0 }
    ])
  }

  const removeGroupMember = (index: number): void => {
    const currentMembers = formValues.groupMembers
    setValue('groupMembers', currentMembers.filter((_, i) => i !== index))
  }

  const updateGroupMember = (index: number, field: keyof GroupMember, value: string | number): void => {
    const currentMembers = [...formValues.groupMembers]
    currentMembers[index] = { ...currentMembers[index], [field]: value }
    setValue('groupMembers', currentMembers)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-2 rounded-full mx-1 ${
                idx + 1 <= currentStep ? 'bg-amber-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {currentStep === 1 && (
            <ContactInfoStep register={register} errors={errors} />
          )}

          {currentStep === 2 && (
            <GroupInfoStep
              register={register}
              errors={errors}
              groupMembers={formValues.groupMembers}
              onAddMember={addGroupMember}
              onRemoveMember={removeGroupMember}
              onUpdateMember={updateGroupMember}
            />
          )}

          {currentStep === 3 && (
            <GroupCookieSelectionStep
              groupMembers={formValues.groupMembers}
              errors={errors}
              onUpdateMember={updateGroupMember}
              calculateTotal={calculateTotal}
              calculateTotalCookies={calculateTotalCookies}
            />
          )}

          {currentStep === 4 && (
            <FulfillmentStep register={register} errors={errors} orderTotal={calculateTotal()} watch={watch} setValue={setValue} />
          )}

          {currentStep === 5 && (
            <ReviewStep formValues={formValues} orderType="group" calculateTotal={calculateTotal} calculateTotalCookies={calculateTotalCookies} />
          )}
        </div>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
          onNext={() => { void handleNext() }}
        />
      </form>
    </div>
  )
}
