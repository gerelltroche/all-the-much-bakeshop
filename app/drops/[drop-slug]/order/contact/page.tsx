'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Gabriela, Fraunces } from 'next/font/google';
import Link from 'next/link';
import { useOrder } from '../../context/OrderContext';
import { ProgressStepper } from '../../components/ProgressStepper';

const gabriela = Gabriela({
  weight: '400',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  weight: '600',
  subsets: ['latin'],
});

type FulfillmentType = 'pickup' | 'delivery';

interface DropData {
  pickupDate: string;
  deliveryDates: string[];
  pickupLocation: string;
}

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dropSlug = params['drop-slug'] as string;
  const { state, dispatch, getTotal, getTotalItems } = useOrder();

  // Drop data for pickup/delivery dates
  const [dropData, setDropData] = useState<DropData | null>(null);

  // Redirect if no items in cart
  useEffect(() => {
    if (getTotalItems() === 0) {
      router.push(`/drops/${dropSlug}/order`);
    }
  }, [getTotalItems, dropSlug, router]);

  // Fetch drop data for dates
  useEffect(() => {
    async function fetchDrop() {
      try {
        const response = await fetch(`/api/drops/${dropSlug}`);
        if (response.ok) {
          const data = await response.json();
          setDropData({
            pickupDate: data.pickupDate,
            deliveryDates: data.deliveryDates || [],
            pickupLocation: data.pickupLocation,
          });
        }
      } catch (error) {
        console.error('Failed to fetch drop:', error);
      }
    }
    fetchDrop();
  }, [dropSlug]);

  // Form state
  const [name, setName] = useState(state.customer?.name || '');
  const [email, setEmail] = useState(state.customer?.email || '');
  const [phone, setPhone] = useState(state.customer?.phone || '');
  const [attribution, setAttribution] = useState(state.customer?.attribution || '');

  const total = getTotal();
  const orderType = state.orderType;
  const canChooseDelivery = (orderType === 'business' || orderType === 'group') && total >= 50;

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>(
    canChooseDelivery ? (state.fulfillment?.type || 'pickup') : 'pickup'
  );
  const [selectedDate, setSelectedDate] = useState<string>(state.fulfillment?.requestedDate || '');
  const [street, setStreet] = useState(state.fulfillment?.street || '');
  const [city, setCity] = useState(state.fulfillment?.city || '');
  const [deliveryState, setDeliveryState] = useState(state.fulfillment?.state || '');
  const [zipCode, setZipCode] = useState(state.fulfillment?.zipCode || '');
  const [dateScrollIndex, setDateScrollIndex] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get available dates based on fulfillment type
  const availableDates = fulfillmentType === 'delivery' && dropData?.deliveryDates.length
    ? dropData.deliveryDates
    : dropData?.pickupDate ? [dropData.pickupDate] : [];

  // Auto-select first date if none selected
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (fulfillmentType === 'delivery') {
      if (!street.trim()) newErrors.street = 'Street address is required';
      if (!city.trim()) newErrors.city = 'City is required';
      if (!deliveryState.trim()) newErrors.state = 'State is required';
      if (!zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    // Save customer details to context
    dispatch({
      type: 'SET_CUSTOMER',
      customer: {
        name,
        email,
        phone,
        orderType: state.orderType,
        attribution: attribution || undefined,
      },
    });

    // Save fulfillment details to context
    dispatch({
      type: 'SET_FULFILLMENT',
      fulfillment: {
        type: fulfillmentType,
        requestedDate: selectedDate,
        street: fulfillmentType === 'delivery' ? street : undefined,
        city: fulfillmentType === 'delivery' ? city : undefined,
        state: fulfillmentType === 'delivery' ? deliveryState : undefined,
        zipCode: fulfillmentType === 'delivery' ? zipCode : undefined,
      },
    });

    router.push(`/drops/${dropSlug}/order/checkout`);
  };

  // Date display helpers
  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate(),
    };
  };

  const visibleDatesCount = 3;
  const canScrollLeft = dateScrollIndex > 0;
  const canScrollRight = dateScrollIndex + visibleDatesCount < availableDates.length;
  const visibleDates = availableDates.slice(dateScrollIndex, dateScrollIndex + visibleDatesCount);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href={`/drops/${dropSlug}/order?type=${state.orderType}`}
          className={`inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors mb-6 ${gabriela.className}`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </Link>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={2} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-5xl text-amber-900 mb-2 ${fraunces.className}`}>
            Your Details
          </h1>
          <p className={`text-amber-700 ${gabriela.className}`}>
            Tell us who is picking up these delicious cookies!
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Contact Information */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className={`text-2xl text-amber-900 mb-4 ${fraunces.className}`}>
              Contact Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm text-amber-700 mb-1 ${gabriela.className}`}>
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.name ? 'border-red-400' : 'border-amber-200 focus:border-amber-400'
                  } bg-white focus:outline-none transition-colors ${gabriela.className}`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className={`text-red-500 text-sm mt-1 ${gabriela.className}`}>{errors.name}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm text-amber-700 mb-1 ${gabriela.className}`}>
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.email ? 'border-red-400' : 'border-amber-200 focus:border-amber-400'
                  } bg-white focus:outline-none transition-colors ${gabriela.className}`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className={`text-red-500 text-sm mt-1 ${gabriela.className}`}>{errors.email}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm text-amber-700 mb-1 ${gabriela.className}`}>
                  Phone *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.phone ? 'border-red-400' : 'border-amber-200 focus:border-amber-400'
                  } bg-white focus:outline-none transition-colors ${gabriela.className}`}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p className={`text-red-500 text-sm mt-1 ${gabriela.className}`}>{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Fulfillment Type */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            {canChooseDelivery && (
              <h2 className={`text-2xl text-amber-900 mb-4 ${fraunces.className}`}>
                How would you like to receive your order?
              </h2>
            )}

            {canChooseDelivery ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => {
                      setFulfillmentType('pickup');
                      setSelectedDate(dropData?.pickupDate || '');
                    }}
                    className={`py-4 px-6 rounded-xl transition-all duration-200 ${
                      fulfillmentType === 'pickup'
                        ? 'bg-gradient-to-r from-orange-300 to-rose-300 text-stone-900 shadow-lg'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-2 border-amber-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">📍</div>
                    <div className={`font-medium ${gabriela.className}`}>Pickup</div>
                    <div className={`text-sm opacity-80 ${gabriela.className}`}>Free</div>
                  </button>

                  <button
                    onClick={() => {
                      setFulfillmentType('delivery');
                      if (dropData?.deliveryDates.length) {
                        setSelectedDate(dropData.deliveryDates[0]);
                      }
                    }}
                    className={`py-4 px-6 rounded-xl transition-all duration-200 ${
                      fulfillmentType === 'delivery'
                        ? 'bg-gradient-to-r from-orange-300 to-rose-300 text-stone-900 shadow-lg'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-2 border-amber-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚗</div>
                    <div className={`font-medium ${gabriela.className}`}>Delivery</div>
                    <div className={`text-sm opacity-80 ${gabriela.className}`}>Free</div>
                  </button>
                </div>

                {fulfillmentType === 'delivery' && (
                  <div className="space-y-4 mt-4 pt-4 border-t border-amber-200">
                    {/* Delivery Date Selection */}
                    {availableDates.length > 0 && (
                      <div>
                        <label className={`block text-sm text-amber-700 mb-2 ${gabriela.className}`}>
                          Select Delivery Date
                        </label>
                        <div className="flex items-center gap-2">
                          {availableDates.length > visibleDatesCount && (
                            <button
                              onClick={() => setDateScrollIndex(Math.max(0, dateScrollIndex - 1))}
                              disabled={!canScrollLeft}
                              className={`p-2 rounded-lg ${canScrollLeft ? 'text-amber-700 hover:bg-amber-100' : 'text-amber-300 cursor-not-allowed'}`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                          )}
                          <div className="flex gap-2 flex-1 justify-center">
                            {visibleDates.map((dateStr) => {
                              const { weekday, month, day } = formatDateShort(dateStr);
                              return (
                                <button
                                  key={dateStr}
                                  onClick={() => setSelectedDate(dateStr)}
                                  className={`flex-1 max-w-[100px] py-3 px-2 rounded-xl transition-all duration-200 ${
                                    selectedDate === dateStr
                                      ? 'bg-gradient-to-r from-orange-300 to-rose-300 text-stone-900 shadow-lg'
                                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-2 border-amber-200'
                                  }`}
                                >
                                  <div className={`text-xs ${gabriela.className}`}>{weekday}</div>
                                  <div className={`text-lg font-bold ${gabriela.className}`}>{day}</div>
                                  <div className={`text-xs ${gabriela.className}`}>{month}</div>
                                </button>
                              );
                            })}
                          </div>
                          {availableDates.length > visibleDatesCount && (
                            <button
                              onClick={() => setDateScrollIndex(Math.min(availableDates.length - visibleDatesCount, dateScrollIndex + 1))}
                              disabled={!canScrollRight}
                              className={`p-2 rounded-lg ${canScrollRight ? 'text-amber-700 hover:bg-amber-100' : 'text-amber-300 cursor-not-allowed'}`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className={`block text-sm text-amber-700 mb-1 ${gabriela.className}`}>
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.street ? 'border-red-400' : 'border-amber-200 focus:border-amber-400'
                        } bg-white focus:outline-none transition-colors ${gabriela.className}`}
                        placeholder="123 Main St"
                      />
                      {errors.street && (
                        <p className={`text-red-500 text-sm mt-1 ${gabriela.className}`}>
                          {errors.street}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm text-amber-700 mb-1 ${gabriela.className}`}>
                          City *
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${
                            errors.city ? 'border-red-400' : 'border-amber-200 focus:border-amber-400'
                          } bg-white focus:outline-none transition-colors ${gabriela.className}`}
                          placeholder="City"
                        />
                        {errors.city && (
                          <p className={`text-red-500 text-sm mt-1 ${gabriela.className}`}>
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={`block text-sm text-amber-700 mb-1 ${gabriela.className}`}>
                          State *
                        </label>
                        <input
                          type="text"
                          value={deliveryState}
                          onChange={(e) => setDeliveryState(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${
                            errors.state ? 'border-red-400' : 'border-amber-200 focus:border-amber-400'
                          } bg-white focus:outline-none transition-colors ${gabriela.className}`}
                          placeholder="FL"
                        />
                        {errors.state && (
                          <p className={`text-red-500 text-sm mt-1 ${gabriela.className}`}>
                            {errors.state}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm text-amber-700 mb-1 ${gabriela.className}`}>
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.zipCode ? 'border-red-400' : 'border-amber-200 focus:border-amber-400'
                        } bg-white focus:outline-none transition-colors ${gabriela.className}`}
                        placeholder="32828"
                      />
                      {errors.zipCode && (
                        <p className={`text-red-500 text-sm mt-1 ${gabriela.className}`}>
                          {errors.zipCode}
                        </p>
                      )}
                    </div>

                    <p className={`text-sm text-amber-600 ${gabriela.className}`}>
                      Delivery available within 8 miles of Mark Twain Blvd, 32828
                    </p>
                  </div>
                )}

                {fulfillmentType === 'pickup' && dropData?.pickupDate && (
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <p className={`text-sm text-amber-700 ${gabriela.className}`}>
                      Pickup Date:{' '}
                      <span className="font-semibold text-amber-900">
                        {new Date(dropData.pickupDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </p>
                    {dropData.pickupLocation && (
                      <p className={`text-sm text-amber-600 mt-1 ${gabriela.className}`}>
                        Location: {dropData.pickupLocation}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                {dropData?.pickupDate && (
                  <div>
                    <span className={`text-amber-700 ${gabriela.className}`}>Pickup Date: </span>
                    <span className={`text-lg text-amber-900 font-semibold ${gabriela.className}`}>
                      {new Date(dropData.pickupDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {dropData?.pickupLocation && (
                  <div>
                    <span className={`text-amber-700 ${gabriela.className}`}>Location: </span>
                    <span className={`text-lg text-amber-900 font-semibold ${gabriela.className}`}>
                      {dropData.pickupLocation}
                    </span>
                  </div>
                )}
                {(orderType === 'business' || orderType === 'group') && total < 50 && (
                  <div className={`mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 ${gabriela.className}`}>
                    <p className="text-sm text-amber-700">
                      Add ${(50 - total).toFixed(2)} more to unlock free delivery!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-amber-700 ${gabriela.className}`}>Order Total</span>
            <span className={`text-xl font-bold text-amber-900 ${gabriela.className}`}>
              ${(total + (fulfillmentType === 'delivery' ? 5 : 0)).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleContinue}
            className={`w-full py-4 rounded-full font-medium bg-gradient-to-r from-orange-300 to-rose-300 text-stone-900 hover:from-orange-400 hover:to-rose-400 hover:shadow-lg transition-all duration-200 active:scale-95 text-lg ${gabriela.className}`}
          >
            Continue to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
