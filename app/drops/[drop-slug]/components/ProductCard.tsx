'use client';

import { useState } from 'react';
import { useOrder } from '../context/OrderContext';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  uom: string;
  photos: string[];
}

interface ProductCardProps {
  product: Product;
  maxQuantity: number | null;
  gabrielaClassName: string;
  tangerineClassName: string;
}

export function ProductCard({
  product,
  maxQuantity,
  gabrielaClassName,
  tangerineClassName,
}: ProductCardProps) {
  const { state, addItem, updateQuantity, removeItem } = useOrder();
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = state.items.find((item) => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;
  const price = parseFloat(product.price);

  const handleAdd = () => {
    if (maxQuantity !== null && quantity >= maxQuantity) return;

    setIsAdding(true);
    addItem({
      productId: product.id,
      name: product.name,
      price,
      quantity: 1,
      photo: product.photos[0] || '',
      uom: product.uom,
    });
    setTimeout(() => setIsAdding(false), 200);
  };

  const handleIncrement = () => {
    if (maxQuantity !== null && quantity >= maxQuantity) return;
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
        quantity > 0 ? 'ring-2 ring-amber-400 shadow-amber-200/50' : ''
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Product Image */}
        {product.photos[0] && (
          <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={product.photos[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className={`text-2xl text-amber-900 ${tangerineClassName}`}>
              {product.name}
            </h3>
            {product.description && (
              <p className={`text-sm text-amber-700 mt-1 line-clamp-2 ${gabrielaClassName}`}>
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className={`text-amber-800 font-medium ${gabrielaClassName}`}>
              ${price.toFixed(2)}{' '}
              <span className="text-amber-600 text-sm">/ {product.uom}</span>
            </div>

            {maxQuantity && (
              <div className={`text-xs text-amber-500 ${gabrielaClassName}`}>
                Max: {maxQuantity}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="px-4 pb-4">
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className={`w-full py-3 rounded-full font-medium transition-all duration-200 ${gabrielaClassName} ${
              isAdding
                ? 'bg-rose-400 text-stone-900 scale-95'
                : 'bg-gradient-to-r from-orange-300 to-rose-300 text-stone-900 hover:from-orange-400 hover:to-rose-400 hover:shadow-lg active:scale-95'
            }`}
          >
            Add to Order
          </button>
        ) : (
          <div className="flex items-center justify-between bg-amber-50 rounded-full p-1">
            <button
              onClick={handleDecrement}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <div className="flex flex-col items-center">
              <span className={`text-lg font-bold text-amber-900 ${gabrielaClassName}`}>
                {quantity}
              </span>
              <span className={`text-xs text-amber-600 ${gabrielaClassName}`}>
                ${(price * quantity).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleIncrement}
              disabled={maxQuantity !== null && quantity >= maxQuantity}
              className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-colors ${
                maxQuantity !== null && quantity >= maxQuantity
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-300 to-rose-300 text-stone-900 hover:from-orange-400 hover:to-rose-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
