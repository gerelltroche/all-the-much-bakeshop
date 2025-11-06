'use client'

import { useState } from 'react'
import { useForm, FieldErrors, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  publicOrderSchema,
  businessOrderSchema,
  groupOrderSchema,
  type PublicOrderFormData,
  type BusinessOrderFormData,
  type GroupOrderFormData,
  type GroupMember,
} from '@/lib/validations/order'

type OrderType = 'public' | 'business' | 'group'

interface OrderFormProps {
  dropId: string
  dropName: string
  orderType: OrderType
  attribution?: string
}

const COOKIE_PRICE = 5.00 // Price per cookie

function ErrorMessage({ error }: { error?: string }): React.ReactElement | null {
  if (error == null || error === '') return null
  return <p className="text-sm text-red-600 mt-1">{error}</p>
}

// Public Order Form
function PublicOrderForm({ dropId, attribution }: { dropId: string; attribution?: string }): JSX.Element {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PublicOrderFormData>({
    resolver: zodResolver(publicOrderSchema),
    defaultValues: {
      orderType: 'public',
      attribution: attribution ?? '',
      name: '',
      email: '',
      phone: '',
      zipCode: '',
      snowmanQty: 0,
      gingerbreadQty: 0,
      mittensQty: 0,
      fulfillmentType: '' as 'pickup' | 'delivery',
      requestedDate: '',
    },
    mode: 'onChange',
  })

  const formValues = watch()
  const totalSteps = 4

  const calculateTotal = (): number => {
    return (formValues.snowmanQty + formValues.gingerbreadQty + formValues.mittensQty) * COOKIE_PRICE
  }

  const calculateTotalCookies = (): number => {
    return formValues.snowmanQty + formValues.gingerbreadQty + formValues.mittensQty
  }

  const onSubmit = async (data: PublicOrderFormData): Promise<void> => {
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

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error('Failed to submit order')

      alert('Order submitted successfully!')

    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof PublicOrderFormData)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'email', 'phone', 'zipCode']
        break
      case 2:
        fieldsToValidate = ['snowmanQty', 'gingerbreadQty', 'mittensQty']
        break
      case 3:
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
            <CookieSelectionStep register={register} errors={errors} calculateTotal={calculateTotal} calculateTotalCookies={calculateTotalCookies} />
          )}

          {currentStep === 3 && (
            <FulfillmentStep register={register} errors={errors} />
          )}

          {currentStep === 4 && (
            <ReviewStep formValues={formValues} orderType="public" calculateTotal={calculateTotal} calculateTotalCookies={calculateTotalCookies} />
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

// Business Order Form
function BusinessOrderForm({ dropId, attribution }: { dropId: string; attribution?: string }): JSX.Element {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BusinessOrderFormData>({
    resolver: zodResolver(businessOrderSchema),
    defaultValues: {
      orderType: 'business',
      attribution: attribution ?? '',
      name: '',
      email: '',
      phone: '',
      zipCode: '',
      businessName: '',
      businessAddress: '',
      snowmanQty: 0,
      gingerbreadQty: 0,
      mittensQty: 0,
      fulfillmentType: '' as 'pickup' | 'delivery',
      requestedDate: '',
    },
    mode: 'onChange',
  })

  const formValues = watch()
  const totalSteps = 5

  const calculateTotal = (): number => {
    return (formValues.snowmanQty + formValues.gingerbreadQty + formValues.mittensQty) * COOKIE_PRICE
  }

  const calculateTotalCookies = (): number => {
    return formValues.snowmanQty + formValues.gingerbreadQty + formValues.mittensQty
  }

  const onSubmit = async (data: BusinessOrderFormData): Promise<void> => {
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

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error('Failed to submit order')

      alert('Order submitted successfully!')

    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof BusinessOrderFormData)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'email', 'phone', 'zipCode']
        break
      case 2:
        fieldsToValidate = ['businessName', 'businessAddress']
        break
      case 3:
        fieldsToValidate = ['snowmanQty', 'gingerbreadQty', 'mittensQty']
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
            <BusinessInfoStep register={register} errors={errors} />
          )}

          {currentStep === 3 && (
            <CookieSelectionStep register={register} errors={errors} calculateTotal={calculateTotal} calculateTotalCookies={calculateTotalCookies} />
          )}

          {currentStep === 4 && (
            <FulfillmentStep register={register} errors={errors} />
          )}

          {currentStep === 5 && (
            <ReviewStep formValues={formValues} orderType="business" calculateTotal={calculateTotal} calculateTotalCookies={calculateTotalCookies} />
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

// Group Order Form
function GroupOrderForm({ dropId, attribution }: { dropId: string; attribution?: string }): JSX.Element {
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

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error('Failed to submit order')

      alert('Order submitted successfully!')

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
            <FulfillmentStep register={register} errors={errors} />
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

// Shared Step Components
function ContactInfoStep({ register, errors }: {
  register: UseFormRegister<PublicOrderFormData> | UseFormRegister<BusinessOrderFormData> | UseFormRegister<GroupOrderFormData>
  errors: FieldErrors<PublicOrderFormData> | FieldErrors<BusinessOrderFormData> | FieldErrors<GroupOrderFormData>
}): JSX.Element {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Contact Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <ErrorMessage error={errors.name?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <ErrorMessage error={errors.email?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          {...register('phone')}
          placeholder="555-123-4567"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <ErrorMessage error={errors.phone?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ZIP Code *
        </label>
        <input
          type="text"
          {...register('zipCode')}
          placeholder="12345"
          maxLength={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <ErrorMessage error={errors.zipCode?.message} />
      </div>
    </div>
  )
}

function BusinessInfoStep({ register, errors }: {
  register: UseFormRegister<BusinessOrderFormData>
  errors: FieldErrors<BusinessOrderFormData>
}): JSX.Element {
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

function GroupInfoStep({ register, errors, groupMembers, onAddMember, onRemoveMember, onUpdateMember }: {
  register: UseFormRegister<GroupOrderFormData>
  errors: FieldErrors<GroupOrderFormData>
  groupMembers: GroupMember[]
  onAddMember: () => void
  onRemoveMember: (index: number) => void
  onUpdateMember: (index: number, field: keyof GroupMember, value: string | number) => void
}): JSX.Element {
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

        {groupMembers.map((member, idx) => (
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
            {(errors.groupMembers?.[idx]?.name != null) && (
              <ErrorMessage error={errors.groupMembers[idx].name.message} />
            )}
          </div>
        ))}

        <ErrorMessage error={errors.groupMembers?.message} />
      </div>
    </div>
  )
}

function CookieSelectionStep({ register, errors, calculateTotal, calculateTotalCookies }: {
  register: UseFormRegister<PublicOrderFormData> | UseFormRegister<BusinessOrderFormData>
  errors: FieldErrors<PublicOrderFormData> | FieldErrors<BusinessOrderFormData>
  calculateTotal: () => number
  calculateTotalCookies: () => number
}): JSX.Element {
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

function GroupCookieSelectionStep({ groupMembers, errors, onUpdateMember, calculateTotal, calculateTotalCookies }: {
  groupMembers: GroupMember[]
  errors: FieldErrors<GroupOrderFormData>
  onUpdateMember: (index: number, field: keyof GroupMember, value: string | number) => void
  calculateTotal: () => number
  calculateTotalCookies: () => number
}): JSX.Element {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Cookie Selection</h2>
      <p className="text-sm text-gray-600 mb-4">${COOKIE_PRICE.toFixed(2)} per cookie</p>

      {groupMembers.map((member, idx) => (
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
              {(errors.groupMembers?.[idx]?.snowmanQty != null) && (
                <ErrorMessage error={errors.groupMembers[idx].snowmanQty.message} />
              )}
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
              {(errors.groupMembers?.[idx]?.gingerbreadQty != null) && (
                <ErrorMessage error={errors.groupMembers[idx].gingerbreadQty.message} />
              )}
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
              {(errors.groupMembers?.[idx]?.mittensQty != null) && (
                <ErrorMessage error={errors.groupMembers[idx].mittensQty.message} />
              )}
            </div>
          </div>
        </div>
      ))}
      <ErrorMessage error={errors.groupMembers?.message} />

      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
        <p className="text-lg font-semibold text-amber-900">
          Total: {calculateTotalCookies()} cookies - ${calculateTotal().toFixed(2)}
        </p>
      </div>
    </div>
  )
}

function FulfillmentStep({ register, errors }: {
  register: UseFormRegister<PublicOrderFormData> | UseFormRegister<BusinessOrderFormData> | UseFormRegister<GroupOrderFormData>
  errors: FieldErrors<PublicOrderFormData> | FieldErrors<BusinessOrderFormData> | FieldErrors<GroupOrderFormData>
}): JSX.Element {
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

function ReviewStep({ formValues, orderType, calculateTotal, calculateTotalCookies }: {
  formValues: PublicOrderFormData | BusinessOrderFormData | GroupOrderFormData
  orderType: OrderType
  calculateTotal: () => number
  calculateTotalCookies: () => number
}): JSX.Element {
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
          ) : (formValues.orderType === 'public' || formValues.orderType === 'business') ? (
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

function NavigationButtons({ currentStep, totalSteps, isSubmitting, onPrevious, onNext }: {
  currentStep: number
  totalSteps: number
  isSubmitting: boolean
  onPrevious: () => void
  onNext: () => void
}): JSX.Element {
  return (
    <div className="flex justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`px-6 py-3 rounded-lg font-semibold ${
          currentStep === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        Previous
      </button>

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-lg font-semibold bg-amber-600 text-white hover:bg-amber-700"
        >
          Next
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-lg font-semibold text-lg ${
            isSubmitting
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </button>
      )}
    </div>
  )
}

// Main component that routes to the correct form
export default function OrderForm({ dropId, orderType, attribution }: OrderFormProps): JSX.Element {
  if (orderType === 'business') {
    return <BusinessOrderForm dropId={dropId} attribution={attribution} />
  }

  if (orderType === 'group') {
    return <GroupOrderForm dropId={dropId} attribution={attribution} />
  }

  return <PublicOrderForm dropId={dropId} attribution={attribution} />
}
