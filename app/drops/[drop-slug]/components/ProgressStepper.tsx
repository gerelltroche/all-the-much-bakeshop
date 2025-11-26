'use client';

import { Gabriela } from 'next/font/google';

const gabriela = Gabriela({
  weight: '400',
  subsets: ['latin'],
});

interface ProgressStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Select' },
  { number: 2, label: 'Details' },
  { number: 3, label: 'Checkout' },
];

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-orange-300 to-rose-300 text-stone-900 shadow-lg'
                    : 'bg-white/80 text-amber-400 border-2 border-amber-200'
                }`}
              >
                {currentStep > step.number ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-xs ${gabriela.className} ${
                  currentStep >= step.number ? 'text-amber-900 font-medium' : 'text-amber-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-all duration-300 ${
                  currentStep > step.number
                    ? 'bg-gradient-to-r from-orange-300 to-rose-300'
                    : 'bg-amber-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
