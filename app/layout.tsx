import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/app/actions/website-actions";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const viewport: Viewport = {
  themeColor: "#1A2B4A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "فريق بروميثيوس التطوعي | المنصة المؤسسية والأكاديمية",
    template: "%s | فريق بروميثيوس التطوعي",
  },
  description:
    "فريق بروميثيوس التطوعي هو مؤسسة تطوعية تهدف لنشر المعرفة التقنية، البحث العلمي، والمحتوى الأكاديمي الرقمي المفتوح.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Prometheus",
  },
  formatDetection: {
    telephone: false,
  },
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const primaryColor = settings?.primaryColor || "#E84A0C";
  const secondaryColor = settings?.secondaryColor || "#1A2B4A";

  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${primaryColor};
            --accent: ${primaryColor};
            --ring: ${primaryColor};
            --secondary: ${secondaryColor};
            --background: ${secondaryColor};
          }
          body {
            background-color: var(--secondary) !important;
          }
          .bg-\\[\\#1A2B4A\\] {
            background-color: var(--secondary) !important;
          }
          .bg-\\[\\#E84A0C\\], .hover\\:bg-\\[\\#E84A0C\\]:hover, .bg-brand-orange {
            background-color: var(--primary) !important;
          }
          .text-\\[\\#E84A0C\\], .hover\\:text-\\[\\#E84A0C\\]:hover, .text-brand-orange {
            color: var(--primary) !important;
          }
          .border-\\[\\#E84A0C\\], .border-\\[\\#E84A0C\\]\\/30, .border-\\[\\#E84A0C\\]\\/40 {
            border-color: var(--primary) !important;
          }
          ::selection {
            background-color: var(--primary) !important;
          }
        ` }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#1A2B4A] text-white font-sans selection:bg-[#E84A0C] selection:text-white">
        {children}
      </body>
    </html>
  );
}
