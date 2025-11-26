import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const drop = await prisma.drop.findUnique({
      where: { slug },
      include: {
        dropProducts: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
          include: {
            product: true,
          },
        },
      },
    });

    if (!drop) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    return NextResponse.json(drop);
  } catch (error) {
    console.error('Error fetching drop:', error);
    return NextResponse.json({ error: 'Failed to fetch drop' }, { status: 500 });
  }
}
