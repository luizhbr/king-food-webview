import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://kingfood.online"),
  title: "King Food | Açaí BR da saudade em Columbus, OH",
  description:
    "Feito pra quem sente falta do Brasil. Açaí de verdade e delivery rápido em Columbus. Peça agora no King Food.",
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
  appleWebApp: {
    capable: true,
    title: "King Food",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://kingfood.online",
    siteName: "King Food",
    title: "King Food | Açaí BR da saudade",
    description:
      "Feito pra quem sente falta do Brasil. Açaí de verdade, delivery em Columbus.",
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
    title: "King Food | Açaí BR da saudade",
    description: "Açaí de verdade em Columbus. Peça agora.",
    images: ["/logo-kingfood.png.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

/** Captura beforeinstallprompt o mais cedo possível (antes do React hidratar). */
const earlyPwaScript = `
(function () {
  try {
    window.__kfDeferredPrompt = null;
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      window.__kfDeferredPrompt = e;
      window.dispatchEvent(new Event('kf-beforeinstallprompt'));
    });
    window.addEventListener('appinstalled', function () {
      window.__kfDeferredPrompt = null;
    });
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {});
      });
    }
  } catch (err) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="King Food" />
                <link rel="apple-touch-icon" href="/icons/launchericon-180x180.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/icons/launchericon-192x192.png" />
                <link rel="icon" type="image/png" sizes="512x512" href="/icons/launchericon-512x512.png" />
                <link rel="preconnect" href="https://kingfood.fe-v2.ola.click" crossOrigin="" />
        <link rel="dns-prefetch" href="https://kingfood.fe-v2.ola.click" />
        <link rel="preload" href="/bg-acai.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/logo-kingfood.png.png" as="image" type="image/png" />
        <script dangerouslySetInnerHTML={{ __html: earlyPwaScript }} />
      </head>
      <body className="antialiased bg-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
