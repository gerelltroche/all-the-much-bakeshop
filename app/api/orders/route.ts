import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmationEmail, sendKatieOrderNotification } from '@/lib/email';
import {
  trackPurchase,
  buildUserData,
  getClientIp,
  getUserAgent,
  extractTrackingParams,
} from '@/lib/meta-conversions';

const orderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  priceAtOrder: z.number(),
});

const customerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  orderType: z.enum(['individual', 'business', 'group']),
  businessName: z.string().optional(),
  attribution: z.string().optional(),
});

const fulfillmentSchema = z.object({
  type: z.enum(['pickup', 'delivery']),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

const createOrderSchema = z.object({
  dropId: z.string(),
  items: z.array(orderItemSchema).min(1),
  customer: customerSchema,
  fulfillment: fulfillmentSchema,
  paymentMethod: z.literal('card'),
  totalAmount: z.number(),
  stripePaymentIntentId: z.string(), // Required for card payments
  // Optional tracking params from client
  event_id: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createOrderSchema.parse(body);

    // Extract tracking params for Meta CAPI
    const trackingParams = extractTrackingParams(body);
    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);

    // Verify drop exists and is open
    const drop = await prisma.drop.findUnique({
      where: { id: data.dropId },
    });

    if (!drop) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    const now = new Date();
    if (now < drop.dropOpens || now > drop.cutoffDate) {
      return NextResponse.json({ error: 'This drop is not currently accepting orders' }, { status: 400 });
    }

    // Check cookie availability
    const totalCookiesOrdered = data.items.reduce((sum, item) => sum + item.quantity, 0);
    const remainingCookies = drop.maxCookies - drop.currentCookies;

    if (totalCookiesOrdered > remainingCookies) {
      return NextResponse.json(
        { error: `Only ${remainingCookies} cookies remaining in this drop` },
        { status: 400 }
      );
    }

    // CRITICAL FIX #1: Verify payment with Stripe before creating order
    const paymentIntent = await stripe.paymentIntents.retrieve(data.stripePaymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 400 }
      );
    }

    // Prevent payment intent reuse - check if this payment was already used for an order
    const existingPayment = await prisma.payment.findFirst({
      where: { paymentIntentId: data.stripePaymentIntentId },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'This payment has already been processed' },
        { status: 400 }
      );
    }

    // CRITICAL FIX #3: Verify prices against database
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    const productPriceMap = new Map(
      products.map((p) => [p.id, Number(p.price)])
    );

    // Calculate server-side total from database prices
    let calculatedTotal = 0;
    for (const item of data.items) {
      const dbPrice = productPriceMap.get(item.productId);
      if (dbPrice === undefined) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }
      calculatedTotal += dbPrice * item.quantity;
    }

    // Round to 2 decimal places to avoid floating point issues
    calculatedTotal = Math.round(calculatedTotal * 100) / 100;

    // Verify client total matches server calculation
    if (Math.abs(calculatedTotal - data.totalAmount) > 0.01) {
      return NextResponse.json(
        { error: 'Order total does not match calculated price' },
        { status: 400 }
      );
    }

    // Verify payment amount matches order total (Stripe amounts are in cents)
    const expectedAmountCents = Math.round(calculatedTotal * 100);
    if (paymentIntent.amount !== expectedAmountCents) {
      return NextResponse.json(
        { error: 'Payment amount does not match order total' },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: data.customer.email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone,
          businessName: data.customer.businessName,
          isBusiness: data.customer.orderType === 'business',
          zipCode: data.fulfillment.zipCode || '',
        },
      });
    }

    // Create the order - payment has already succeeded at this point
    const order = await prisma.order.create({
      data: {
        dropId: data.dropId,
        customerId: customer.id,
        email: data.customer.email,
        orderType: data.customer.orderType,
        attribution: data.customer.attribution,
        fulfillmentType: data.fulfillment.type,
        deliveryStreet: data.fulfillment.street,
        deliveryCity: data.fulfillment.city,
        deliveryState: data.fulfillment.state,
        deliveryZip: data.fulfillment.zipCode,
        // Use server-calculated total, not client-submitted
        totalAmount: calculatedTotal,
        status: 'paid',
        orderItems: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            // Use verified database price, not client-submitted price
            priceAtOrder: productPriceMap.get(item.productId)!,
          })),
        },
        payments: {
          create: {
            // Use server-calculated total
            amount: calculatedTotal,
            status: 'succeeded',
            paymentMethod: 'card',
            paymentIntentId: data.stripePaymentIntentId,
          },
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    // Update cookie count
    await prisma.drop.update({
      where: { id: data.dropId },
      data: {
        currentCookies: {
          increment: totalCookiesOrdered,
        },
      },
    });

    // Send confirmation emails (don't await - let them send in background)
    const cookiesForEmail = order.orderItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: Number(item.priceAtOrder),
    }));

    const fulfillmentDetails =
      data.fulfillment.type === 'pickup'
        ? drop.pickupLocation || 'Location TBD'
        : `${data.fulfillment.street}, ${data.fulfillment.city}, ${data.fulfillment.state} ${data.fulfillment.zipCode}`;

    // Send customer confirmation email
    sendOrderConfirmationEmail(data.customer.email, {
      orderNumber: order.id,
      customerName: data.customer.name,
      cookies: cookiesForEmail,
      total: calculatedTotal,
      fulfillmentType: data.fulfillment.type,
      fulfillmentDetails,
      fulfillmentDate: drop.pickupDate,
    }).catch((err) => {
      console.error('Failed to send customer confirmation email:', err);
    });

    // Send Katie notification email
    sendKatieOrderNotification({
      orderNumber: order.id,
      customerName: data.customer.name,
      customerEmail: data.customer.email,
      customerPhone: data.customer.phone,
      orderType: data.customer.orderType,
      businessName: data.customer.businessName,
      cookies: cookiesForEmail,
      total: calculatedTotal,
      fulfillmentType: data.fulfillment.type,
      fulfillmentDetails,
      fulfillmentDate: drop.pickupDate,
      dropName: drop.name,
    }).catch((err) => {
      console.error('Failed to send Katie notification email:', err);
    });

    // Track Purchase event via Meta CAPI (fire and forget)
    trackPurchase({
      eventId: trackingParams.event_id,
      eventSourceUrl: request.headers.get('referer') || undefined,
      userData: buildUserData({
        email: data.customer.email,
        phone: data.customer.phone,
        name: data.customer.name,
        ipAddress,
        userAgent,
        fbp: trackingParams.fbp,
        fbc: trackingParams.fbc,
      }),
      customData: {
        value: calculatedTotal,
        currency: 'USD',
        content_ids: data.items.map(item => String(item.productId)),
        content_type: 'product',
        num_items: totalCookiesOrdered,
        order_id: String(order.id),
      },
    }).catch((error) => {
      console.error('Meta CAPI tracking error:', error);
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid order data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
