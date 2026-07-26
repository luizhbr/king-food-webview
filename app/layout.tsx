import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { OnlineBanner } from "@/components/OnlineBanner";
import {
  APP_NAME,
  APP_DEFAULT_TITLE,
  APP_TITLE_TEMPLATE,
  APP_DESCRIPTION,
} from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  keywords: [
    "açaí",
    "acai",
    "delivery",
    "Columbus",
    "Ohio",
    "King Food",
    "açaí delivery",
    "comida brasileira",
    "OlaClick",
  ],
  authors: [{ name: "King Food" }],
  creator: "King Food",
  publisher: "King Food",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: "https://kingfood.online",
    locale: "pt_BR",
    images: [
      {
        url: "/logo-kingfood.png",
        width: 512,
        height: 512,
        alt: "King Food Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: ["/logo-kingfood.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#5B21B6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" dir="ltr" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-brand-acaiDark font-sans text-brand-cream antialiased">
        <OnlineBanner />
        <Header />
        <main className="relative">{children}</main>
        <Footer />
        <PwaInstallPrompt />
        <WhatsAppButton />
      </body>
    </html>
  );
}
