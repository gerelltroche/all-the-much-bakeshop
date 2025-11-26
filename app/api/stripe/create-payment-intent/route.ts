import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const orderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

const createPaymentIntentSchema = z.object({
  // CRITICAL FIX #2: Accept items instead of amount - calculate server-side
  items: z.array(orderItemSchema).min(1),
  metadata: z.object({
    customerEmail: z.string().email(),
    customerName: z.string(),
    dropId: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, metadata } = createPaymentIntentSchema.parse(body);

    // CRITICAL FIX #2: Calculate amount from database prices, not client
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 400 }
      );
    }

    const productPriceMap = new Map(
      products.map((p) => [p.id, Number(p.price)])
    );

    // Calculate server-side total
    let calculatedTotal = 0;
    for (const item of items) {
      const dbPrice = productPriceMap.get(item.productId);
      if (dbPrice === undefined) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }
      calculatedTotal += dbPrice * item.quantity;
    }

    // Stripe minimum is $0.50 USD
    if (calculatedTotal < 0.50) {
      return NextResponse.json(
        { error: 'Order total must be at least $0.50' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the server-calculated amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(calculatedTotal * 100), // Convert dollars to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        // Store item details for verification
        itemCount: items.length.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
