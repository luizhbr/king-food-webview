import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "King Food",
  description: "Os melhores açaís de Columbus - Delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}