import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vanpara.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Vanpara - Basit ve Anlaşılır Borç/Alacak Takip Sistemi",
    template: "%s | Vanpara",
  },
  description: "Vanpara ile borç ve alacaklarınızı kolayca takip edin. SMS ve e-posta bildirimleri ile vade takibi yapın. Ücretsiz plan ile hemen başlayın.",
  keywords: [
    "borç takibi",
    "alacak takibi",
    "vade takibi",
    "borç yönetimi",
    "alacak yönetimi",
    "SMS bildirim",
    "e-posta bildirim",
    "finansal takip",
    "borç yönetim sistemi",
    "alacak yönetim sistemi",
    "vade takip sistemi",
    "Türkiye borç takibi",
  ],
  authors: [{ name: "Vanpara" }],
  creator: "Vanpara",
  publisher: "Vanpara",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: baseUrl,
    siteName: "Vanpara",
    title: "Vanpara - Basit ve Anlaşılır Borç/Alacak Takip Sistemi",
    description: "Vanpara ile borç ve alacaklarınızı kolayca takip edin. SMS ve e-posta bildirimleri ile vade takibi yapın. Ücretsiz plan ile hemen başlayın.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Vanpara - Borç/Alacak Takip Sistemi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanpara - Basit ve Anlaşılır Borç/Alacak Takip Sistemi",
    description: "Vanpara ile borç ve alacaklarınızı kolayca takip edin. SMS ve e-posta bildirimleri ile vade takibi yapın.",
    images: [`${baseUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
