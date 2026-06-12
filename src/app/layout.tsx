import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AirTracker | Real-time AQI Dashboard",
  description: "Monitor your location's Air Quality Index in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen text-foreground transition-colors duration-500 overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {/* Navbar is rendered within the page components that need to pass state */}
          <main className="w-full">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
