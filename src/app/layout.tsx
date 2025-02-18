"use client";

import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import AnimatedBackground from '@/components/ui/animatedBackground';
import PageLoader from '@/components/ui/pageLoader';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" className={`${nunito.variable}`}>
      <head>
        <title>ArcHive Review</title>
        <meta name="description" content="Archive Review Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/ah.svg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-nunito min-h-screen relative custom-scrollbar`}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <PageLoader />
          ) : (
            <>
              <AnimatedBackground />
              <div className="relative z-0">
                {children}
              </div>
            </>
          )}
        </AnimatePresence>
      </body>
    </html>
  );
}