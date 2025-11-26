'use client';

import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Gabriela } from 'next/font/google';

const gabriela = Gabriela({
  weight: '400',
  subsets: ['latin'],
});

interface StripeCardFormProps {
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  submitRef: React.MutableRefObject<(() => Promise<void>) | null>;
}

export function StripeCardForm({
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  submitRef,
}: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Expose the submit function to parent
    submitRef.current = async () => {
      if (!stripe || !elements) {
        onPaymentError('Payment system not ready. Please try again.');
        return;
      }

      setIsProcessing(true);

      try {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.href, // Not used since we handle redirect ourselves
          },
          redirect: 'if_required',
        });

        if (error) {
          if (error.type === 'card_error' || error.type === 'validation_error') {
            onPaymentError(error.message || 'Payment failed');
          } else {
            onPaymentError('An unexpected error occurred');
          }
          setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent.id);
        } else {
          onPaymentError('Payment was not completed');
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Payment error:', err);
        onPaymentError('Payment failed. Please try again.');
        setIsProcessing(false);
      }
    };
  }, [stripe, elements, onPaymentSuccess, onPaymentError, setIsProcessing, submitRef]);

  return (
    <div className="space-y-4">
      <PaymentElement
        id="payment-element"
        onReady={() => setIsReady(true)}
        options={{
          layout: 'tabs',
        }}
      />
      {!isReady && (
        <div className={`text-center text-amber-600 ${gabriela.className}`}>
          Loading payment form...
        </div>
      )}
    </div>
  );
}
