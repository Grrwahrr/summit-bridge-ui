import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "lucide-react";

import { Providers } from "@/providers/providers";

import { fontSans, fontMono } from "@/fonts";
import Footer from "@/components/layout/footer";
import { ChainInfo } from "@/components/chain/chain-info";

import "./globals.css";
import { NavBar } from "@/components/layout/nav-bar";

export const metadata: Metadata = {
  title: "ACDC",
  description: "ACDC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-[family-name:var(--font-sans)] antialiased`}
      >
        <Providers>
          <NavBar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChainInfo />
          <Toaster position="bottom-center" icons={{ loading: <Loader /> }} />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
