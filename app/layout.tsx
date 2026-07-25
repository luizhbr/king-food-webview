import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "King Food | Açaí Premium Delivery em Columbus, OH",
  description:
    "O verdadeiro sabor do Brasil em Columbus. Açaís premium, combos e delivery rápido. Peça agora no King Food.",
  applicationName: "King Food",
  authors: [{ name: "King Food" }],
  keywords: [
    "açaí",
    "açaí Columbus",
    "delivery Columbus",
    "King Food",
    "açaí brasileiro",
    "food delivery Ohio",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-kingfood.png.png",
    apple: "/logo-kingfood.png.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://king-food-webview-luizztx-6366s-projects.vercel.app",
    siteName: "King Food",
    title: "King Food | Açaí Premium Delivery",
    description:
      "Açaís premium, combos e delivery rápido em Columbus, Ohio. Sabor brasileiro de verdade.",
    images: [
      {
        url: "/logo-kingfood.png.png",
        width: 512,
        height: 512,
        alt: "King Food",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "King Food | Açaí Premium Delivery",
    description:
      "O verdadeiro sabor do Brasil em Columbus. Peça agora.",
    images: ["/logo-kingfood.png.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-white text-black">{children}</body>
    </html>
  );
}
