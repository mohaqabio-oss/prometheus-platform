import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: {
    default: "فريق بروميثيوس التطوعي | المنصة المؤسسية والأكاديمية",
    template: "%s | فريق بروميثيوس التطوعي",
  },
  description:
    "فريق بروميثيوس التطوعي هو مؤسسة تطوعية تهدف لنشر المعرفة التقنية، البحث العلمي، والمحتوى الأكاديمي الرقمي المفتوح.",
  keywords: [
    "فريق بروميثيوس التطوعي",
    "منشورات بروميثيوس",
    "البحث العلمي التطوعي",
    "الهندسة البرمجية",
    "المجلات الأكاديمية",
    "التطوع التقني",
  ],
  authors: [{ name: "فريق بروميثيوس التطوعي" }],
  creator: "فريق بروميثيوس التطوعي",
  metadataBase: new URL("https://prometheus-voluntary.org"),
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://prometheus-voluntary.org",
    title: "فريق بروميثيوس التطوعي | المنصة المؤسسية والأكاديمية",
    description:
      "إشعال طاقات الشباب عبر الهندسة البرمجية والبحث العلمي والأوراق البحثية المفتوحة المصدر.",
    siteName: "فريق بروميثيوس التطوعي",
  },
  twitter: {
    card: "summary_large_image",
    title: "فريق بروميثيوس التطوعي",
    description: "منصة مؤسسية وأكاديمية للعمل التطوعي والتقني.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#1A2B4A] text-white font-sans selection:bg-[#E84A0C] selection:text-white">
        {children}
      </body>
    </html>
  );
}
