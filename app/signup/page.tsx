import type { Metadata } from 'next';
import { Gabriela, DynaPuff } from 'next/font/google';
import { EmailSignupForm } from '@/components/EmailSignupForm';

const gabriela = Gabriela({
  weight: '400',
  subsets: ['latin']
});

const dynaPuff = DynaPuff({
  weight: '500',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Sign Up - All the Much Bake Shop',
  description: 'Join our mailing list to be notified about new cookie drops and special offers',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 py-12 px-4 relative overflow-hidden">
      {/* Back to Link Tree */}
      <div className="absolute top-4 left-4 z-20">
        <a
          href="/link-tree"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </a>
      </div>

      {/* Background decorative polka dots */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-rose-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-rose-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 right-32 w-12 h-12 bg-amber-300 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-24 w-16 h-16 bg-rose-200 rounded-full opacity-18 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-6xl font-bold text-amber-900 mb-3 ${dynaPuff.className}`}>
            Don't Miss Out!
          </h1>
          <p className={`text-lg text-amber-800 max-w-md mx-auto ${gabriela.className}`}>
            Be the first to know when orders open for our 2025-2026 Winter Drop
          </p>
        </div>

        {/* Signup Form */}
        <EmailSignupForm />
      </div>
    </div>
  );
}
