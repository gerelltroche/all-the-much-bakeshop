'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Gabriela, Fraunces } from 'next/font/google';
import Link from 'next/link';
import { useOrder } from '../../context/OrderContext';
import { ProgressStepper } from '../../components/ProgressStepper';
import { StripePaymentWrapper } from './components/StripePaymentWrapper';

const gabriela = Gabriela({
  weight: '400',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  weight: '600',
  subsets: ['latin'],
});

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const dropSlug = params['drop-slug'] as string;
  const { state, getTotal, getTotalItems } = useOrder();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Ref for triggering Stripe form submission
  const stripeSubmitRef = useRef<(() => Promise<void>) | null>(null);

  // Redirect if no items or no customer details
  useEffect(() => {
    if (getTotalItems() === 0) {
      router.push(`/drops/${dropSlug}/order`);
    } else if (!state.customer) {
      router.push(`/drops/${dropSlug}/order/contact`);
    }
  }, [getTotalItems, state.customer, dropSlug, router]);

  const subtotal = getTotal();
  const total = subtotal;

  const handleStripePaymentSuccess = async (paymentIntentId: string) => {
    // Submit order with payment info
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dropId: state.dropId,
          items: state.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: item.price,
          })),
          customer: state.customer,
          fulfillment: state.fulfillment,
          paymentMethod: 'card',
          totalAmount: total,
          stripePaymentIntentId: paymentIntentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      // Redirect to confirmation
      router.push(`/drops/${dropSlug}/order/confirmation?orderId=${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete order');
      setIsSubmitting(false);
    }
  };

  const handleStripePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setIsSubmitting(false);
  };

  const handleSubmitOrder = async () => {
    if (!agreedToTerms) {
      setError('Please agree to the terms to continue');
      return;
    }

    setError(null);

    // Trigger Stripe form submission
    if (stripeSubmitRef.current) {
      setIsSubmitting(true);
      await stripeSubmitRef.current();
    } else {
      setError('Payment form not ready. Please try again.');
    }
  };

  if (!state.customer || !state.fulfillment) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen py-8 px-4 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href={`/drops/${dropSlug}/order/contact`}
          className={`inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors mb-6 ${gabriela.className}`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to contact
        </Link>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={3} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-5xl text-amber-900 mb-2 ${fraunces.className}`}>
            Review & Pay
          </h1>
          <p className={`text-amber-700 ${gabriela.className}`}>
            Double-check your order and choose your payment method
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className={`text-2xl text-amber-900 mb-4 ${fraunces.className}`}>
            Order Summary
          </h2>

          <div className="space-y-3 mb-4">
            {state.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                {item.photo && (
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className={`text-amber-900 font-medium ${gabriela.className}`}>
                    {item.name}
                  </div>
                  <div className={`text-sm text-amber-600 ${gabriela.className}`}>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className={`text-amber-900 font-medium ${gabriela.className}`}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-amber-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className={`text-amber-700 ${gabriela.className}`}>Subtotal</span>
              <span className={`text-amber-900 ${gabriela.className}`}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-amber-200">
              <span className={`text-amber-900 font-bold ${gabriela.className}`}>Total</span>
              <span className={`text-xl text-amber-900 font-bold ${gabriela.className}`}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Fulfillment Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg text-amber-900 font-medium mb-2 ${gabriela.className}`}>
                Contact
              </h3>
              <div className={`text-amber-700 ${gabriela.className}`}>
                <p>{state.customer.name}</p>
                <p>{state.customer.email}</p>
                <p>{state.customer.phone}</p>
                {state.customer.businessName && (
                  <p className="text-sm mt-1">Business: {state.customer.businessName}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className={`text-lg text-amber-900 font-medium mb-2 ${gabriela.className}`}>
                {state.fulfillment.type === 'pickup' ? 'Pickup' : 'Delivery'}
              </h3>
              <div className={`text-amber-700 ${gabriela.className}`}>
                {state.fulfillment.type === 'pickup' ? (
                  <p>You'll receive pickup details via email</p>
                ) : (
                  <>
                    <p>{state.fulfillment.street}</p>
                    <p>
                      {state.fulfillment.city}, {state.fulfillment.state} {state.fulfillment.zipCode}
                    </p>
                    <p className={`text-sm text-amber-600 ${gabriela.className} mt-2`}>
                      You'll receive delivery time details via email
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <Link
            href={`/drops/${dropSlug}/order/contact`}
            className={`inline-block mt-4 text-sm text-amber-600 hover:text-amber-800 ${gabriela.className}`}
          >
            Edit contact &rarr;
          </Link>
        </div>

        {/* Payment Method */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className={`text-2xl text-amber-900 mb-4 ${fraunces.className}`}>
            Payment Method
          </h2>

          {/* Card Payment Form */}
          {state.customer && (
            <StripePaymentWrapper
                amount={total}
                customerEmail={state.customer.email}
                customerName={state.customer.name}
                dropId={state.dropId || ''}
                onPaymentSuccess={handleStripePaymentSuccess}
                onPaymentError={handleStripePaymentError}
                isProcessing={isSubmitting}
                setIsProcessing={setIsSubmitting}
                submitRef={stripeSubmitRef}
              />
          )}
        </div>

        {/* Terms */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className={`text-2xl text-amber-900 mb-4 ${fraunces.className}`}>
            Order Policy
          </h2>

          <div className={`space-y-4 text-sm text-amber-700 mb-6 ${gabriela.className}`}>
            <div>
              <h3 className="font-medium text-amber-900 mb-1">Cancellations</h3>
              <p>
                You may cancel your order for a full refund up until the order close date.
                After this date, all sales are final. Because we purchase fresh ingredients
                and begin production schedules immediately after orders close, we cannot
                offer refunds for cancellations made after this window.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-amber-900 mb-1">Missed Pickups</h3>
              <p>
                Orders not picked up at the designated time will not be held or refunded.
                If you are unable to make the designated time, please reach out prior to the
                original pickup window to request a second pickup time within 2 days of the
                original date. A second pickup time is subject to availability and is not
                guaranteed. If the second pickup is missed, the order is forfeited and will
                not be refunded.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-amber-900 mb-1">Baker Cancellations</h3>
              <p>
                In the unlikely event that we need to cancel your order due to illness or
                emergency, a full refund will be issued immediately.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
            />
            <span className={`text-sm text-amber-700 ${gabriela.className}`}>
              I have read and agree to the order policy above.
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl ${gabriela.className}`}>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-amber-200 z-40">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || !agreedToTerms}
              className={`w-full py-4 rounded-full font-medium text-lg transition-all duration-200 ${gabriela.className} ${
                isSubmitting || !agreedToTerms
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-300 to-rose-300 text-stone-900 hover:from-orange-400 hover:to-rose-400 hover:shadow-lg active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
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
                  Processing Payment...
                </span>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
