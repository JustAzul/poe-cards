import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POE Cards",
  description: "Divination card arbitrage opportunities for Path of Exile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header id="site-header" className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-6 py-3">
          <h1 className="text-xl font-bold tracking-tight font-[family-name:var(--font-geist-sans)]">
            <span className="text-primary">&#9670;</span>{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">POE Cards</span>
          </h1>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
        </header>
        <TooltipProvider>
          <main className="flex-1">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  );
}
