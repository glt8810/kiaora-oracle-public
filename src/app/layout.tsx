import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { seasonsFont, circeFont, quincyFont } from "@/lib/fonts";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiaora Oracle",
  description: "Receive mystical guidance from our Māori healer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${seasonsFont.variable} ${circeFont.variable} ${quincyFont.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster
          position="top-center"
          offset="80px"
          theme="dark"
          expand
          richColors
        />
      </body>
    </html>
  );
}
