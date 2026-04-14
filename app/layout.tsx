import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "My Recipes",
  description: "A collection of my favourite recipes, organized by ingredient.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-gray-200 dark:border-gray-800">
          <nav className="mx-auto max-w-4xl px-6 py-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:opacity-80"
            >
              My Recipes
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="mx-auto max-w-4xl px-6 py-4 text-center text-sm text-gray-500">
            My Recipes
          </div>
        </footer>
      </body>
    </html>
  );
}
