import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://olympay-sol.vercel.app"),
  title: "OlymPay on Sol - Cross-Chain Payment Infrastructure",
  description:
    "Seamless payments on Solana and Base Network with algorithmic stability, instant settlement, and ultra-low fees.",
  keywords: "Solana, Base, cross-chain, payments, DeFi, blockchain",
  authors: [{ name: "OlymPay on Sol" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "OlymPay on Sol - Cross-Chain Payment Infrastructure",
    description:
      "Seamless payments on Solana and Base Network with algorithmic stability, instant settlement, and ultra-low fees.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 200,
        height: 60,
        alt: "OlymPay on Sol Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OlymPay on Sol - Cross-Chain Payment Infrastructure",
    description:
      "Seamless payments on Solana and Base Network with algorithmic stability, instant settlement, and ultra-low fees.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="solbase">
      <body className="font-inter">
        <WalletProvider>
          {children}
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
