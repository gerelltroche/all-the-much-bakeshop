import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// TODO: Update these image paths when you have your own images
const twitterImagePath = "/og-image.jpg";
const openGraphImagePath = "/og-image.jpg";

export const metadata: Metadata = {
  metadataBase: new URL("https://allthemuchbakeshop.com"),
  title: "All The Much Bake Shop | Custom Decorated Sugar Cookies",
  description: "Handcrafted custom sugar cookies that taste as incredible as they look. Specializing in decorated cookies for celebrations, seasonal drops, and appreciation gifts. Order your edible art today!",
  keywords: [
    "custom cookies",
    "decorated sugar cookies",
    "bakery",
    "custom bakery",
    "seasonal cookies",
    "celebration cookies",
    "appreciation gifts",
    "edible art",
    "cookie decorating",
  ],
  authors: [{ name: "Katie", url: "https://allthemuchbakeshop.com" }],
  creator: "All The Much Bake Shop",
  publisher: "All The Much Bake Shop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://allthemuchbakeshop.com",
    siteName: "All The Much Bake Shop",
    title: "All The Much Bake Shop | Custom Decorated Sugar Cookies",
    description: "Handcrafted custom sugar cookies that taste as incredible as they look. Beautiful edible art for your special celebrations.",
    images: [
      {
        url: openGraphImagePath,
        width: 1200,
        height: 630,
        alt: "All The Much Bake Shop - Custom Decorated Cookies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All The Much Bake Shop | Custom Decorated Sugar Cookies",
    description: "Handcrafted custom sugar cookies that taste as incredible as they look.",
    images: [twitterImagePath],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you set them up
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-rose-50 to-amber-50`}
      >
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

        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
