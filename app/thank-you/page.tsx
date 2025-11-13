import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Your cookie order has been successfully submitted.
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-amber-800 mb-3">
              What's Next?
            </h2>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>You'll receive a confirmation email shortly with your order details.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>We'll reach out if we have any questions about your order.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <span>Your cookies will be ready on your requested date!</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
