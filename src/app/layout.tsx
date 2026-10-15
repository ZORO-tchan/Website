import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "صيانة Hassan-55",
  description:
    "مركز Hassan-55 لصيانة جميع أجهزة الموبايل - تخصص فحص وتشخيص أعطال البوردة ودوائر الطاقة والشحن باحترافية وأعلى دقة.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "صيانة Hassan-55",
    description: "صيانة جميع أجهزة الموبايل - تشخيص دقيق قبل الإصلاح وعناية بأدق التفاصيل.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark scroll-smooth selection:bg-[#C9A05C]/20 selection:text-[#EDE8E0]">
      <body
        className={`${cormorant.variable} ${cinzel.variable} ${inter.variable} font-sans bg-[#060606] text-[#EDE8E0] antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
