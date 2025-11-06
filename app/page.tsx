'use client';

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">All the Much Bakeshop</h1>
          <p className="text-lg text-amber-600">Delicious baked goods made with love</p>
        </div>
      </main>
    </div>
  );
}