import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BEO Automation',
  description: 'Business Entity Operations Automation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
