import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const basePath = "";

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "byteTasks",
  description:
    "Gestor de tareas serverless con arquitectura BYOS (Bring Your Own Storage).",
  icons: {
    icon: `${basePath}/favicon.ico`,
  },
  manifest: `${basePath}/manifest.json`,
};

import { DriveProvider } from "@/app/components/hooks/DriveHook";
import { LanguageProvider } from "@/app/components/hooks/LanguageHook";
import { ServiceWorkerRegister } from "@/app/components/ServiceWorkerRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <DriveProvider>
            {children}
            <ServiceWorkerRegister />
          </DriveProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
