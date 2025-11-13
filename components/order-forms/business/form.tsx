'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { businessOrderSchema, BusinessOrderFormData } from './schema'
import { submitBusinessOrder } from './server'
import { ContactInfoStep } from '../shared/ContactInfoStep'
import { BusinessInfoStep } from '../shared/BusinessInfoStep'
import { CookieSelectionStep } from '../shared/CookieSelectionStep'
import { FulfillmentStep } from '../shared/FulfillmentStep'
import { ReviewStep } from '../shared/ReviewStep'
import { NavigationButtons } from '../shared/NavigationButtons'
import { COOKIE_PRICE } from '../shared/constants'

interface BusinessOrderFormProps {
  dropId: string
  attribution?: string
}

export function BusinessOrderForm({ dropId, attribution }: BusinessOrderFormProps) {
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
      street: '',
      city: '',
      state: '',
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

      const result = await submitBusinessOrder(orderData)

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
    let fieldsToValidate: (keyof BusinessOrderFormData)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'email', 'phone', 'zipCode']
        break
      case 2:
        fieldsToValidate = ['businessName', 'street', 'city', 'state']
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
