import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const primaryFont = Plus_Jakarta_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDAM Mini",
  description: "Aplikasi manajemen pelanggan & tagihan air",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${primaryFont.variable} ${monoFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
