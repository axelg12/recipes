import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
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
  title: "Uppskriftir Axels",
  description:
    "Helstu uppskriftirnar sem ég hef sankað að mér en man ekki alltaf",
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <header className="border-b border-gray-200 dark:border-gray-800">
            <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight hover:opacity-80"
              ></Link>
              <ThemeToggle />
            </nav>
          </header>
          <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
            {children}
          </main>
          <footer className="border-t border-gray-200 dark:border-gray-800">
            <div className="mx-auto max-w-4xl px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Uppskriftir Axels
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
