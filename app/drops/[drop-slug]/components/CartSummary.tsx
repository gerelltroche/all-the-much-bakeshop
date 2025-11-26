'use client';

import { useOrder } from '../context/OrderContext';

interface CartSummaryProps {
  dropSlug: string;
  onContinue: () => void;
  gabrielaClassName: string;
}

export function CartSummary({ dropSlug, onContinue, gabrielaClassName }: CartSummaryProps) {
  const { state, getTotal, getTotalItems } = useOrder();

  const totalItems = getTotalItems();
  const total = getTotal();

  if (totalItems === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-8 bg-white/95 backdrop-blur-sm border-t md:border border-amber-200 md:rounded-2xl p-4 md:p-6 shadow-lg">
        <div className={`text-center text-amber-600 ${gabrielaClassName}`}>
          Select items to start your order
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-8 bg-white/95 backdrop-blur-sm border-t md:border border-amber-200 md:rounded-2xl p-4 md:p-6 shadow-lg z-40">
      <div className="max-w-4xl mx-auto">
        {/* Item summary - visible on desktop */}
        <div className="hidden md:block mb-4">
          <h3 className={`text-lg text-amber-900 font-medium mb-3 ${gabrielaClassName}`}>
            Your Order
          </h3>
          <div className="space-y-2">
            {state.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className={`text-amber-800 ${gabrielaClassName}`}>
                  {item.quantity}x {item.name}
                </span>
                <span className={`text-amber-600 ${gabrielaClassName}`}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-amber-200 mt-3 pt-3 flex justify-between">
            <span className={`text-amber-900 font-medium ${gabrielaClassName}`}>Total</span>
            <span className={`text-amber-900 font-bold ${gabrielaClassName}`}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Mobile summary + CTA */}
        <div className="flex items-center justify-between gap-4">
          <div className="md:hidden">
            <div className={`text-sm text-amber-600 ${gabrielaClassName}`}>
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </div>
            <div className={`text-lg font-bold text-amber-900 ${gabrielaClassName}`}>
              ${total.toFixed(2)}
            </div>
          </div>

          <button
            onClick={onContinue}
            className={`flex-1 md:w-full py-3 px-6 rounded-full font-medium bg-gradient-to-r from-orange-300 to-rose-300 text-stone-900 hover:from-orange-400 hover:to-rose-400 hover:shadow-lg transition-all duration-200 active:scale-95 ${gabrielaClassName}`}
          >
            Continue to Details
          </button>
        </div>
      </div>
    </div>
  );
}
