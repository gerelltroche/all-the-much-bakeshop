'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  photo: string;
  uom: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  orderType: 'individual' | 'business' | 'group';
  businessName?: string;
  attribution?: string;
}

export interface FulfillmentDetails {
  type: 'pickup' | 'delivery';
  requestedDate?: string;
  // Delivery address
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export type OrderType = 'individual' | 'group' | 'business';

export interface OrderState {
  dropId: string;
  dropSlug: string;
  orderType: OrderType;
  items: CartItem[];
  customer: CustomerDetails | null;
  fulfillment: FulfillmentDetails | null;
  currentStep: number;
}

type OrderAction =
  | { type: 'SET_DROP'; dropId: string; dropSlug: string; orderType: OrderType }
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'SET_CUSTOMER'; customer: CustomerDetails }
  | { type: 'SET_FULFILLMENT'; fulfillment: FulfillmentDetails }
  | { type: 'SET_STEP'; step: number }
  | { type: 'CLEAR_ORDER' };

const initialState: OrderState = {
  dropId: '',
  dropSlug: '',
  orderType: 'individual',
  items: [],
  customer: null,
  fulfillment: null,
  currentStep: 1,
};

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SET_DROP':
      return { ...state, dropId: action.dropId, dropSlug: action.dropSlug, orderType: action.orderType };

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.item.productId
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.item.quantity,
        };
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, action.item] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.productId),
      };

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.productId !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }

    case 'SET_CUSTOMER':
      return { ...state, customer: action.customer };

    case 'SET_FULFILLMENT':
      return { ...state, fulfillment: action.fulfillment };

    case 'SET_STEP':
      return { ...state, currentStep: action.step };

    case 'CLEAR_ORDER':
      return { ...initialState };

    default:
      return state;
  }
}

interface OrderContextValue {
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
  // Helper functions
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', item });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const getTotal = () => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <OrderContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        getTotal,
        getTotalItems,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
