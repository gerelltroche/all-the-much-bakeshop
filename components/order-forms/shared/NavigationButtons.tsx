export function NavigationButtons({ currentStep, totalSteps, isSubmitting, onPrevious, onNext, onSubmit }: {
  currentStep: number
  totalSteps: number
  isSubmitting: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit?: () => void
}) {
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
          type="button"
          onClick={onSubmit}
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
