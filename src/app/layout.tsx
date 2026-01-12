import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import StructuredData from "@/components/StructuredData";
import { Metadata } from 'next';

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Agil Faqih Ijsam | Portfolio",
  description: "Portfolio of Agil Faqih Ijsam - Game, Web, App Developer & Music Producer",
  keywords: ['web developer', 'next.js', 'react', 'portfolio', 'game developer', 'music producer'],
  metadataBase: new URL('https://your-site.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://your-site.vercel.app',
    title: "Agil Faqih Ijsam | Portfolio",
    description: "Portfolio personal Agil Faqih Ijsam - Game, Web, App Developer & Music Producer",
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Agil Faqih Ijsam | Portfolio",
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <StructuredData />
          </ThemeProvider>
      </body>
    </html>
  );
}
