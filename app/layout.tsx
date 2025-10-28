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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
