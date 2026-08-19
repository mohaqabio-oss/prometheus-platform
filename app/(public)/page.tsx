import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublicWebsiteData } from "@/app/actions/website-actions";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Users2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const { settings, dynamicStats, featuredArticles, partners } =
    await getPublicWebsiteData();

  const heroTitle =
    settings["hero.title"] || "فريق بروميثيوس التطوعي";
  const heroSubtitle =
    settings["hero.subtitle"] ||
    "مؤسسة تطوعية أكاديمية تعنى بتطوير المنصات البرمجية، نشر المقالات والبحوث المفتوحة، وتدريب الطاقات الشبابية.";

  const aboutTitle =
    settings["about.title"] ||
    "منظمة تطوعية تسعى للنهوض بالواقع الأكاديمي والتقني";
  const aboutDescription =
    settings["about.description"] ||
    "تأسس فريق بروميثيوس التطوعي بهدف سد الثغرة بين الدراسة الأكاديمية وسوق العمل التقني، من خلال مشاريع حقيقية وأبحاث رصينة.";

  const pillars = [
    {
      id: "tech",
      title: "الهندسة البرمجية والتطوير",
      description:
        "بناء المنصات الرقمية والتطبيقات مفتوحة المصدر اعتماداً على أحدث التقنيات البرمجية.",
      icon: "code",
    },
    {
      id: "research",
      title: "البحث العلمي والتحليل",
      description:
        "إعداد الأوراق والبحوث المنهجية وتحليل البيانات لدعم الحصيلة العلمية للمجتمع.",
      icon: "book",
    },
    {
      id: "edu",
      title: "التعليم وصناعة المحتوى",
      description:
        "تقديم ورش عمل تخصصية وكتابة مقالات تعليمية مبسطة باللغة العربية.",
      icon: "grad",
    },
    {
      id: "hr",
      title: "الموارد البشرية والعمليات",
      description:
        "إدارة وتنظيم الطاقات التطوعية وتوجيه الكوادر نحو المكان المناسب لإمكانياتهم.",
      icon: "users",
    },
  ];

  const identity = {
    badge: "الهوية والرسالة",
    title: "شعارنا: المعرفة حق متاح، والتطوع أسلوب حياة",
    quote:
      "نسعى لتوفير بيئة تطوعية ناضجة تتيح للشاب العربي اكتساب الخبرة البرمجية والبحثية المباشرة مع خدمة المجتمع.",
    points: [
      "مشاريع برمجية مفتوحة المصدر 100%",
      "معايير نشر أكاديمية صارمة للمقالات والبحوث",
      "شهادات تطوعية رسمية وموثقة إلكترونياً",
      "بيئة تعاونية تشجع العمل الجماعي والابتكار",
    ],
  };

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case "code":
        return <Code2 className="w-6 h-6 text-[#E84A0C]" />;
      case "book":
        return <BookOpen className="w-6 h-6 text-[#F5A623]" />;
      case "grad":
        return <GraduationCap className="w-6 h-6 text-[#E84A0C]" />;
      case "users":
        return <Users2 className="w-6 h-6 text-[#F5A623]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#E84A0C]" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-grid-pattern radial-glow-orange transition-all duration-300">
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#E84A0C]/30 bg-[#E84A0C]/10 px-4 py-1.5 text-xs font-mono text-[#E84A0C] backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#E84A0C] animate-pulse" />
            <span>منصة مؤسسية وأكاديمية تطوعية</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            {heroTitle}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#6B7280] leading-relaxed font-sans font-normal">
            {heroSubtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/articles">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-medium bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md transition-all duration-300">
                <span>تصفح منشورات بروميثيوس</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/join-us">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-sm font-medium border-[#6B7280]/30 text-white hover:text-[#E84A0C] hover:border-[#E84A0C]/40 rounded-xl transition-all duration-300"
              >
                <span>تقديم طلب انضمام</span>
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. ABOUT THE TEAM SECTION */}
      <section id="about" className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badgeText="رؤيتنا ورسالتنا"
              title={aboutTitle}
              description={aboutDescription}
            />

            <div className="pt-4">
              <Link href="/join-us">
                <Button variant="outline" size="md" className="gap-2 text-xs rounded-xl border-[#6B7280]/30 text-white">
                  <span>تعرّف على آلية الانضمام</span>
                  <ArrowLeft className="w-4 h-4 text-[#E84A0C]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Dynamic Stats Metric Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {dynamicStats.map((stat: any, i: number) => (
              <Card key={i} className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 space-y-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <p className="font-display font-bold text-3xl sm:text-4xl text-[#E84A0C] font-mono">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#6B7280] font-sans">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 3. WHAT WE DO (PILLARS) */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-12">
        <SectionHeader
          badgeText="أقسام العمل التطوعي"
          title="أقسام وتخصصات الفريق"
          description="تتوزع الجهود التطوعية عبر أربعة أقسام متكاملة لضمان جودة المحتوى والأثر الأكاديمي."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <Card
              key={pillar.id}
              className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center">
                {getPillarIcon(pillar.icon)}
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. BRAND IDENTITY & ETHOS */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
        <Card className="p-8 sm:p-12 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="max-w-3xl space-y-6">
            <Badge variant="accent">{identity.badge}</Badge>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
              {identity.title}
            </h2>
            <blockquote className="text-[#6B7280] italic text-base sm:text-lg border-r-2 border-[#E84A0C] pr-4 font-sans leading-relaxed">
              "{identity.quote}"
            </blockquote>

            <div className="pt-2 space-y-3">
              {identity.points.map((pt, index) => (
                <div key={index} className="flex items-center gap-3 text-xs sm:text-sm text-[#6B7280]">
                  <CheckCircle2 className="w-4 h-4 text-[#E84A0C] shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* 5. PROMETHEUS POST PREVIEW (Only if published articles exist) */}
      {featuredArticles.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader
              badgeText="المكتبة والأوراق البحثية"
              title="جديد منشورات بروميثيوس"
              description="مجموعة مختارة من المقالات المنهجية والأبحاث الأكاديمية المصاغة بأسلوب رصين."
            />
            <Link href="/articles" className="shrink-0">
              <Button variant="outline" size="sm" className="gap-2 text-xs rounded-xl border-[#6B7280]/30 text-white">
                <span>جميع المقالات</span>
                <ArrowLeft className="w-4 h-4 text-[#E84A0C]" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article: any) => (
              <Card key={article.id} className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="accent">{article.category}</Badge>
                    <span className="text-[11px] font-mono text-[#6B7280]">{article.publishedAt}</span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white hover:text-[#E84A0C] transition-all duration-300">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-[#6B7280] line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#6B7280]/20 flex items-center justify-between text-xs font-mono text-[#6B7280]">
                  <span>{article.author.name}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 6. OUR PARTNERS & SPONSORS SECTION */}
      {partners.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-8">
          <SectionHeader
            badgeText="الشركاء والرعاة"
            title={settings["partners.title"] || "شركاؤنا الداعمون والمؤسسات الراعية"}
            description={settings["partners.subtitle"] || "نفخر بالتعاون مع المؤسسات التكنولوجية والمنابر الأكاديمية لدعم منصاتنا التطوعية المفتوحة."}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {partners.map((partner: any) => (
              <Card
                key={partner.id}
                className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:border-[#E84A0C]/40 shadow-sm hover:shadow-md transition-all duration-300 group text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 p-2 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <p className="font-bold text-white text-xs sm:text-sm font-sans">{partner.name}</p>

                {partner.websiteUrl && (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-[#E84A0C] hover:underline inline-flex items-center gap-1"
                  >
                    <span>زيارة الموقع</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 7. CALL TO ACTION / JOIN US */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl text-center space-y-6">
        <div className="p-10 rounded-2xl border border-[#6B7280]/20 bg-[#0D0D0D] space-y-6 shadow-md transition-all duration-300">
          <Badge variant="accent" className="mx-auto">انضم إلينا اليوم</Badge>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
            هل ترغب في المساهمة بجهدك التطوعي؟
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            نرحب بالمطورين والباحثين والمترجمين الشباب الراغبين في الانضمام لأقسام الفريق والمساهمة في تقديم معرفة حقيقية للمجتمع.
          </p>

          <div className="pt-2 flex justify-center">
            <Link href="/join-us">
              <Button size="lg" className="gap-2 text-sm bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md transition-all duration-300">
                <span>تقديم طلب انضمام</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
