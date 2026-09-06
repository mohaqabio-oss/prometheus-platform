import type { Metadata, Viewport } from "next";
import {
  // Arabic Fonts
  Tajawal,
  Cairo,
  Amiri,
  Almarai,
  IBM_Plex_Sans_Arabic,
  // English Fonts
  Inter,
  Roboto,
  Merriweather,
  Playfair_Display,
  Fira_Code,
} from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/app/actions/website-actions";

// ── Arabic Fonts ──────────────────────────────────────────
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
});

// ── English Fonts ──────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira",
  display: "swap",
});

// ── Combined className for html element ───────────────────
const allFontVariables = [
  tajawal.variable,
  cairo.variable,
  amiri.variable,
  almarai.variable,
  ibmPlexSansArabic.variable,
  inter.variable,
  roboto.variable,
  merriweather.variable,
  playfairDisplay.variable,
  firaCode.variable,
].join(" ");

export const viewport: Viewport = {
  themeColor: "#0A0F1D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "فريق ومجلة بروميثيوس التطوعية | المنصة الأكاديمية والمؤسسية",
    template: "%s | فريق بروميثيوس التطوعي",
  },
  description:
    "منصة ومجلة بروميثيوس الأكاديمية التطوعية تهدف لنشر المعرفة التقنية، البحث العلمي، والأوراق البحثية المفتوحة المصدر.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Prometheus",
  },
  formatDetection: {
    telephone: false,
  },
  keywords: [
    "فريق بروميثيوس التطوعي",
    "مجلة بروميثيوس الأكاديمية",
    "البحث العلمي التطوعي",
    "الهندسة البرمجية",
    "المجلات الأكاديمية المفتوحة",
    "التطوع التقني",
  ],
  authors: [{ name: "فريق ومجلة بروميثيوس التطوعية" }],
  creator: "فريق بروميثيوس التطوعي",
  metadataBase: new URL("https://prometheus-voluntary.org"),
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://prometheus-voluntary.org",
    title: "فريق ومجلة بروميثيوس التطوعية | المنصة الأكاديمية والمؤسسية",
    description:
      "إشعال طاقات الشباب عبر الهندسة البرمجية والبحث العلمي والأوراق البحثية المفتوحة المصدر.",
    siteName: "فريق بروميثيوس التطوعي",
  },
  twitter: {
    card: "summary_large_image",
    title: "فريق ومجلة بروميثيوس التطوعية",
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
  const primaryColor = settings?.primaryColor || "#D49B4B";
  const secondaryColor = settings?.secondaryColor || "#0A0F1D";

  return (
    <html lang="ar" dir="rtl" className={`${allFontVariables} h-full antialiased`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${primaryColor};
            --accent: ${primaryColor};
            --ring: ${primaryColor};
            --secondary: ${secondaryColor};
            --background: ${secondaryColor};
            --card: #141C2F;
            --foreground: #F8FAFC;
            --muted-foreground: #94A3B8;
            --border: #1E293B;
          }
          body {
            background-color: var(--secondary) !important;
            color: #F8FAFC !important;
          }
          .bg-\\[\\#1A2B4A\\], .bg-\\[\\#0D0D0D\\], .bg-\\[\\#0A0F1D\\] {
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
            color: #0A0F1D !important;
          }
        ` }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#070b14] text-slate-100 font-sans selection:bg-amber-500/20 overflow-x-hidden">
        {/* Elegant, subtle CSS ambient glow (Static, lightweight, zero JS) */}
        <div 
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-50 overflow-hidden"
        >
          {/* Top subtle blue/indigo ambient haze */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[65rem] h-[30rem] rounded-full bg-gradient-to-tr from-blue-900/15 via-indigo-800/10 to-transparent blur-3xl opacity-60" />
          
          {/* Very gentle accent glow near top right */}
          <div className="absolute top-20 right-[-10%] w-[35rem] h-[25rem] rounded-full bg-amber-500/5 blur-[120px] opacity-40" />
        </div>

        {/* Page Content Container */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
