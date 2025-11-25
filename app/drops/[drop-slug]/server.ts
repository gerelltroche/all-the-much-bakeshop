import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Drop } from '@/lib/generated/prisma/client';

export default async function getDropBySlug(dropSlug: string) {
  const drop = await prisma.drop.findUnique({
    where: { slug: dropSlug },
    include: {
      dropProducts: {
        include: { product: true },
      },
    },
  });

  if (!drop) {
    notFound();
  }

  // Filter and sort the drop products
  const filteredDrop: typeof drop = {
    ...drop,
    dropProducts: drop.dropProducts
      .filter((dp) => dp.isActive)
      .sort((a, b) => {
        const orderA = a.displayOrder ?? Infinity;
        const orderB = b.displayOrder ?? Infinity;
        return orderA - orderB;
      }),
  };

  return filteredDrop;
}