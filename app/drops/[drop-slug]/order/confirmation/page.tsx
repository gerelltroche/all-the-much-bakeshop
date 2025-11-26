'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Gabriela, Fraunces } from 'next/font/google';
import Link from 'next/link';
import { useOrder } from '../../context/OrderContext';

const gabriela = Gabriela({
  weight: '400',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  weight: '600',
  subsets: ['latin'],
});

interface OrderDetails {
  id: number;
  email: string;
  totalAmount: string;
  fulfillmentType: 'pickup' | 'delivery';
  status: string;
  drop: {
    name: string;
    pickupDate: string;
    pickupLocation: string;
  };
  orderItems: Array<{
    quantity: number;
    priceAtOrder: string;
    product: {
      name: string;
    };
  }>;
}

export default function ConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dropSlug = params['drop-slug'] as string;
  const orderId = searchParams.get('orderId');
  const { dispatch } = useOrder();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear the order context after successful order
    dispatch({ type: 'CLEAR_ORDER' });
  }, [dispatch]);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError('Order not found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          setError('Could not load order details');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className={`text-3xl text-amber-900 mb-4 ${fraunces.className}`}>
            {error || 'Order not found'}
          </h1>
          <Link
            href={`/drops/${dropSlug}`}
            className={`text-amber-600 hover:text-amber-800 ${gabriela.className}`}
          >
            Return to drop page
          </Link>
        </div>
      </div>
    );
  }

  const pickupDate = new Date(order.drop.pickupDate);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mb-6 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className={`text-5xl text-amber-900 mb-2 ${fraunces.className}`}>
            Order Confirmed!
          </h1>
          <p className={`text-amber-700 ${gabriela.className}`}>
            Thank you for your order! We can't wait to bake for you.
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-6 mb-6 text-center shadow-lg">
          <div className={`text-sm opacity-90 ${gabriela.className}`}>Order Number</div>
          <div className={`text-3xl font-bold ${gabriela.className}`}>#{order.id}</div>
        </div>

        {/* Order Details */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className={`text-2xl text-amber-900 mb-4 ${fraunces.className}`}>
            Order Details
          </h2>

          <div className="space-y-3 mb-6">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className={`text-amber-700 ${gabriela.className}`}>
                  {item.quantity}× {item.product.name}
                </span>
                <span className={`text-amber-900 ${gabriela.className}`}>
                  ${(parseFloat(item.priceAtOrder) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-amber-200 pt-4">
            <div className="flex justify-between">
              <span className={`text-amber-900 font-bold ${gabriela.className}`}>Total</span>
              <span className={`text-xl text-amber-900 font-bold ${gabriela.className}`}>
                ${parseFloat(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Pickup/Delivery Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className={`text-2xl text-amber-900 mb-4 ${fraunces.className}`}>
            {order.fulfillmentType === 'pickup' ? 'Pickup Information' : 'Delivery Information'}
          </h2>

          {order.fulfillmentType === 'pickup' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📅</div>
                <div>
                  <div className={`text-sm text-amber-600 ${gabriela.className}`}>Pickup Date</div>
                  <div className={`text-lg text-amber-900 font-medium ${gabriela.className}`}>
                    {pickupDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {order.drop.pickupLocation && (
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📍</div>
                  <div>
                    <div className={`text-sm text-amber-600 ${gabriela.className}`}>Location</div>
                    <div className={`text-lg text-amber-900 font-medium ${gabriela.className}`}>
                      {order.drop.pickupLocation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="text-2xl">🚗</div>
              <div>
                <div className={`text-sm text-amber-600 ${gabriela.className}`}>Delivery Date</div>
                <div className={`text-lg text-amber-900 font-medium ${gabriela.className}`}>
                  {pickupDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className={`text-sm text-amber-600 mt-2 ${gabriela.className}`}>
                  We'll contact you to confirm delivery details
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-amber-50 rounded-2xl p-6 mb-6">
          <h2 className={`text-2xl text-amber-900 mb-4 ${fraunces.className}`}>
            What's Next?
          </h2>

          <ol className={`space-y-3 ${gabriela.className}`}>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-sm flex items-center justify-center">
                1
              </span>
              <span className="text-amber-800">
                Check your email ({order.email}) for order confirmation and payment instructions
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-sm flex items-center justify-center">
                2
              </span>
              <span className="text-amber-800">
                Complete payment via Venmo or prepare cash for pickup
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-sm flex items-center justify-center">
                3
              </span>
              <span className="text-amber-800">
                Pick up your fresh-baked cookies on the scheduled date!
              </span>
            </li>
          </ol>
        </div>

        {/* Add to Calendar */}
        <div className="text-center space-y-4">
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cookie%20Pickup%20-%20${encodeURIComponent(order.drop.name)}&dates=${pickupDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${pickupDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Pick%20up%20your%20order%20%23${order.id}%20from%20All%20the%20Much%20Bake%20Shop&location=${encodeURIComponent(order.drop.pickupLocation || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-amber-300 rounded-full text-amber-700 hover:bg-amber-50 transition-colors ${gabriela.className}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to Google Calendar
          </a>

          <div>
            <Link
              href="/winter-drops"
              className={`text-amber-600 hover:text-amber-800 ${gabriela.className}`}
            >
              ← Browse more drops
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
