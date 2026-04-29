import type { Metadata } from "next";
import Link from "next/link";
import { Karla, Lora } from "next/font/google";
import TopNav from "@/components/TopNav";
import "./globals.css";

const editorial = Lora({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

const body = Karla({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rosalynn BEO Command Center",
  description:
    "Notion-driven banquet event order generation with role guardrails, recipient mismatch protection, and dead-letter recovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${editorial.variable} ${body.variable}`}>
      <body className="antialiased">
        <div className="relative min-h-screen overflow-hidden bg-stone-100 text-stone-900">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(19,91,96,0.14),transparent_34%),radial-gradient(circle_at_88%_3%,rgba(188,147,86,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(244,238,224,0.7))]" />

          <nav className="relative border-b border-stone-300/80 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-teal-700" />
                <Link
                  href="/"
                  className="font-display text-xl tracking-wide text-stone-900 transition hover:text-teal-800"
                >
                  Rosalynn BEO
                </Link>
              </div>
              <TopNav />
            </div>
          </nav>
          <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
