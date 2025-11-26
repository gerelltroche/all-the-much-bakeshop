'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type { OrderType } from '../context/OrderContext';
import { Gabriela, Fraunces } from 'next/font/google';
import Link from 'next/link';
import { useOrder } from '../context/OrderContext';
import { ProgressStepper } from '../components/ProgressStepper';
import { ProductCard } from '../components/ProductCard';
import { CartSummary } from '../components/CartSummary';

const gabriela = Gabriela({
  weight: '400',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  weight: '600',
  subsets: ['latin'],
});

interface DropProduct {
  product: {
    id: number;
    name: string;
    description: string | null;
    price: string;
    uom: string;
    photos: string[];
  };
  maxQuantity: number | null;
}

interface Drop {
  id: string;
  name: string;
  slug: string;
  maxCookies: number;
  currentCookies: number;
  dropProducts: DropProduct[];
}

export default function ProductSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropSlug = params['drop-slug'] as string;
  const typeParam = searchParams.get('type');
  const orderType: OrderType = (typeParam === 'group' || typeParam === 'business') ? typeParam : 'individual';
  const { state, dispatch, addItem, getTotal, getTotalItems } = useOrder();
  const [drop, setDrop] = useState<Drop | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('orderType', orderType);

  useEffect(() => {
    async function fetchDrop() {
      try {
        const response = await fetch(`/api/drops/${dropSlug}`);
        if (response.ok) {
          const data = await response.json();
          setDrop(data);
          dispatch({ type: 'SET_DROP', dropId: data.id, dropSlug: data.slug, orderType });
        }
      } catch (error) {
        console.error('Failed to fetch drop:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDrop();
  }, [dropSlug, dispatch, orderType]);

  const handleContinue = () => {
    if (getTotalItems() > 0) {
      router.push(`/drops/${dropSlug}/order/contact`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    );
  }

  if (!drop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`text-center ${gabriela.className}`}>
          <p className="text-amber-900 text-xl mb-4">Drop not found</p>
          <Link href="/winter-drops" className="text-amber-600 hover:text-amber-800">
            ← Back to drops
          </Link>
        </div>
      </div>
    );
  }

  const remainingCookies = drop.maxCookies - drop.currentCookies;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href={`/winter-drops?type=${orderType}`}
          className={`inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors mb-6 ${gabriela.className}`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Winter Drops
        </Link>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={1} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-5xl md:text-7xl text-amber-900 mb-2 ${fraunces.className}`}>
            Build Your Order
          </h1>
          <p className={`text-amber-700 ${gabriela.className}`}>
            Select the cookies you'd like to order from {drop.name}
          </p>
          <div className={`mt-2 text-sm text-amber-600 ${gabriela.className}`}>
            {remainingCookies} cookies available in this drop
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {drop.dropProducts.map((dropProduct) => (
            <ProductCard
              key={dropProduct.product.id}
              product={dropProduct.product}
              maxQuantity={dropProduct.maxQuantity}
              gabrielaClassName={gabriela.className}
              tangerineClassName={fraunces.className}
            />
          ))}
        </div>

        {/* Cart Summary - Fixed at bottom on mobile */}
        <CartSummary
          dropSlug={dropSlug}
          onContinue={handleContinue}
          gabrielaClassName={gabriela.className}
        />
      </div>
    </div>
  );
}
