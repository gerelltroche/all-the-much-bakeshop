import { notFound } from 'next/navigation';
import Image from 'next/image';
import getDropBySlug from './server';

export default async function page({ params }: { params: { 'drop-slug': string } }) {
    const { 'drop-slug': dropSlug } = await params;

    const drop = await getDropBySlug(dropSlug);

    if (!drop) {
        notFound();
    }

    const remainingCookies = drop.maxCookies - drop.currentCookies;

    return <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{drop.name}</h1>

        <div className="mb-6">
            <p className="text-lg">
                <span className="font-semibold">Cookies Remaining:</span>{' '}
                {remainingCookies} / {drop.maxCookies}
            </p>
        </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Products</h2>
            {drop.dropProducts.map((dropProduct) => (
                <div
                    key={dropProduct.product.id}
                    className="border rounded-lg p-4 shadow-sm flex gap-4"
                >
                    {dropProduct.product.photos.length > 0 && (
                        <div className="flex-shrink-0">
                            <Image
                                src={dropProduct.product.photos[0]}
                                alt={dropProduct.product.name}
                                width={150}
                                height={150}
                                className="rounded-lg object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold">{dropProduct.product.name}</h3>
                        {dropProduct.product.description && (
                            <p className="text-gray-600 mt-2">{dropProduct.product.description}</p>
                        )}
                        <div className="mt-3 flex gap-4 text-sm">
                            <span className="font-medium">
                                ${dropProduct.product.price.toString()} / {dropProduct.product.uom}
                            </span>
                            {dropProduct.maxQuantity && (
                                <span className="text-gray-600">
                                    Max: {dropProduct.maxQuantity}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>;
}