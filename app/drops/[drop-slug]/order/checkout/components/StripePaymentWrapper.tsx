'use client';

import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripeCardForm } from './StripeCardForm';
import { Gabriela } from 'next/font/google';

const gabriela = Gabriela({
  weight: '400',
  subsets: ['latin'],
});

// Load Stripe outside of component to avoid recreating on every render
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface OrderItem {
  productId: number;
  quantity: number;
}

interface StripePaymentWrapperProps {
  items: OrderItem[];
  customerEmail: string;
  customerName: string;
  dropId: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  submitRef: React.MutableRefObject<(() => Promise<void>) | null>;
}

export function StripePaymentWrapper({
  items,
  customerEmail,
  customerName,
  dropId,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  submitRef,
}: StripePaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasCreatedIntent = useRef(false);

  useEffect(() => {
    // Prevent duplicate payment intent creation
    if (hasCreatedIntent.current) return;
    hasCreatedIntent.current = true;

    // Create PaymentIntent as soon as the component loads
    // Server calculates amount from items to prevent price manipulation
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        metadata: {
          customerEmail,
          customerName,
          dropId,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create payment intent');
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error('Error creating payment intent:', err);
        setError('Failed to initialize payment. Please try again.');
      });
  }, [items, customerEmail, customerName, dropId]);

  if (!stripePublishableKey) {
    return (
      <div className={`p-4 bg-red-50 border-2 border-red-200 rounded-xl ${gabriela.className}`}>
        <p className="text-red-700">Payment system is not configured. Please contact support at (407) 279-0014.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border-2 border-red-200 rounded-xl ${gabriela.className}`}>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => {
            setError(null);
            hasCreatedIntent.current = false;
          }}
          className="mt-2 text-red-600 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className={`flex items-center justify-center p-8 ${gabriela.className}`}>
        <div className="flex items-center gap-3 text-amber-700">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Preparing secure payment...</span>
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#92400e', // amber-800
            colorBackground: '#fffbeb', // amber-50
            colorText: '#78350f', // amber-900
            colorDanger: '#dc2626',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '12px',
          },
          rules: {
            '.Input': {
              border: '2px solid #fcd34d', // amber-300
              padding: '12px',
            },
            '.Input:focus': {
              border: '2px solid #f59e0b', // amber-500
              boxShadow: '0 0 0 2px rgba(245, 158, 11, 0.2)',
            },
            '.Label': {
              color: '#78350f', // amber-900
              fontWeight: '500',
            },
          },
        },
      }}
    >
      <StripeCardForm
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        submitRef={submitRef}
      />
    </Elements>
  );
}
