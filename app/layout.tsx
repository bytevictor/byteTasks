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

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/byteTasks" : "";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <DriveProvider>{children}</DriveProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
