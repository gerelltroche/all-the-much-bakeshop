import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Links - All the Much Bake Shop',
  description: 'Connect with Katie at All the Much Bake Shop',
};

export default function LinkTreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 py-12 px-4 relative overflow-hidden">
      {/* Background decorative polka dots */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Larger polka dots */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-rose-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-rose-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Additional medium polka dots */}
        <div className="absolute top-40 right-32 w-12 h-12 bg-amber-300 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-24 w-16 h-16 bg-rose-200 rounded-full opacity-18 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-14 h-14 bg-amber-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-18 h-18 bg-rose-300 rounded-full opacity-18 animate-pulse" style={{ animationDelay: '3s' }} />

        {/* Smaller scattered polka dots */}
        <div className="absolute top-32 left-1/3 w-8 h-8 bg-amber-200 rounded-full opacity-12 animate-pulse" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-3/4 left-16 w-10 h-10 bg-rose-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1.8s' }} />
        <div className="absolute top-1/4 right-16 w-10 h-10 bg-amber-300 rounded-full opacity-12 animate-pulse" style={{ animationDelay: '2.2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-rose-300 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2.8s' }} />
        <div className="absolute top-2/3 right-1/3 w-12 h-12 bg-amber-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '3.5s' }} />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg overflow-hidden border-4 border-rose-200">
            <img
              src="/Katie-pfp.jpg"
              alt="Katie - All the Much Bake Shop"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            All the Much Bake Shop
          </h1>
          <p className="text-amber-700">
            Handcrafted treats made with love
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {/* Instagram */}
          <a
            href="https://instagram.com/allthemuchbakeshop"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-rose-200 hover:border-rose-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 via-rose-400 to-amber-400 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-amber-900">Instagram</div>
                  <div className="text-sm text-amber-700">@allthemuchbakeshop</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:katie@allthemuchbakeshop.com"
            className="block w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-amber-200 hover:border-amber-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-amber-400 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-amber-900">Email</div>
                  <div className="text-sm text-amber-700">katie@allthemuchbakeshop.com</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:+14072790014"
            className="block w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-rose-200 hover:border-rose-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-rose-400 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-amber-900">Phone</div>
                  <div className="text-sm text-amber-700">(407) 279-0014</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-amber-700">
          <p>All the Much Bake Shop</p>
          <p className="mt-1">Made with love 💕</p>
        </div>
      </div>
    </div>
  );
}
