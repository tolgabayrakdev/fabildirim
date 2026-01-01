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

export const metadata: Metadata = {
  title: "Vanpara - Basit ve Anlaşılır Borç/Alacak Takip Sistemi",
  description: "Vanpara ile borç ve alacaklarınızı kolayca takip edin. SMS ve e-posta bildirimleri ile vade takibi yapın. Ücretsiz plan ile hemen başlayın.",
  keywords: ["borç takibi", "alacak takibi", "vade takibi", "borç yönetimi", "alacak yönetimi", "SMS bildirim", "e-posta bildirim"],
  openGraph: {
    title: "Vanpara - Basit ve Anlaşılır Borç/Alacak Takip Sistemi",
    description: "Vanpara ile borç ve alacaklarınızı kolayca takip edin. SMS ve e-posta bildirimleri ile vade takibi yapın.",
    type: "website",
  },
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
