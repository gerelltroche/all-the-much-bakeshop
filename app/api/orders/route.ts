import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

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
  paymentMethod: z.enum(['card', 'venmo', 'cash']),
  totalAmount: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createOrderSchema.parse(body);

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

    // Create the order
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
        totalAmount: data.totalAmount,
        status: 'pending',
        orderItems: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: item.priceAtOrder,
          })),
        },
        payments: {
          create: {
            amount: data.totalAmount,
            status: 'pending',
            paymentMethod: data.paymentMethod,
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

    // TODO: Send confirmation email

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
