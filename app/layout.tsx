import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const helveticaNeue = localFont({
  src: [
    {
      path: "../public/font/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/HelveticaNeueMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/font/HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/font/HelveticaNeueBlack.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
});

export const metadata: Metadata = {
  title: "Quran International Dashboard",
  description: "Advanced analytics for Quran International app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${helveticaNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
