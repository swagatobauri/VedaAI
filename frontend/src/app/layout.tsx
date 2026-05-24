import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { ZustandProvider } from "@/store/ZustandProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VedaAI — AI-Powered Assignment Generator for Educators",
  description: "Generate intelligent question papers, manage assignments, and leverage AI tools designed for teachers and educators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ZustandProvider>
          {children}
        </ZustandProvider>
      </body>
    </html>
  );
}
