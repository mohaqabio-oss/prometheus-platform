import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { getSiteSettings, getPartners } from "@/app/actions/website-actions";
import { MOCK_HOME_DATA } from "@/lib/data/mock-home";
import { MOCK_ARTICLES } from "@/lib/data/mock-articles";
import {
  Code,
  Microscope,
  BookOpen,
  Users,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  ExternalLink,
} from "lucide-react";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const partners = await getPartners();

  const { pillars, identity } = MOCK_HOME_DATA;
  const featuredArticles = MOCK_ARTICLES.slice(0, 3);

  const heroTitle = settings["hero.title"] || MOCK_HOME_DATA.hero.title;
  const heroSubtitle = settings["hero.subtitle"] || MOCK_HOME_DATA.hero.subtitle;
  const aboutTitle = settings["about.title"] || MOCK_HOME_DATA.about.title;
  const aboutDescription = settings["about.description"] || MOCK_HOME_DATA.about.description;

  const dynamicStats = [
    { label: "ساعات التطوع الموثقة", value: settings["stat.hours"] || "+600" },
    { label: "الأوراق والمقالات العلمية", value: settings["stat.articles"] || "+45" },
    { label: "الأعضاء الفاعلون", value: settings["stat.members"] || "+30" },
    { label: "الأقسام التخصصية", value: settings["stat.departments"] || "4" },
  ];

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return <Code className="w-6 h-6 text-brand-orange" />;
      case "Microscope":
        return <Microscope className="w-6 h-6 text-brand-orange" />;
      case "BookOpen":
        return <BookOpen className="w-6 h-6 text-brand-orange" />;
      case "Users":
        return <Users className="w-6 h-6 text-brand-orange" />;
      default:
        return <Sparkles className="w-6 h-6 text-brand-orange" />;
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-grid-pattern border-b border-brand-dark-800">
        <div className="absolute inset-0 radial-glow-orange pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-dark-700 bg-brand-dark-900/90 px-4 py-1.5 text-xs font-mono text-brand-gray-300 backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span>منصة مؤسسية وأكاديمية تطوعية</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            {heroTitle}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-brand-gray-300 leading-relaxed font-sans font-normal">
            {heroSubtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/articles">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-medium">
                <span>تصفح منشورات بروميثيوس</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/join-us">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-sm font-medium border-brand-dark-700 text-brand-gray-300 hover:text-white"
              >
                <span>تقديم طلب انضمام</span>
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT THE TEAM SECTION */}
      {/* ========================================================================= */}
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
                <Button variant="outline" size="md" className="gap-2 text-xs">
                  <span>تعرّف على آلية الانضمام</span>
                  <ArrowLeft className="w-4 h-4 text-brand-orange" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Dynamic Stats Metric Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {dynamicStats.map((stat, i) => (
              <Card key={i} className="p-6 bg-brand-dark-900/80 border-brand-dark-800 space-y-2">
                <p className="font-display font-bold text-3xl sm:text-4xl text-brand-orange font-mono">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-brand-gray-300 font-sans">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT WE DO (PILLARS) */}
      {/* ========================================================================= */}
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
              className="p-6 bg-brand-dark-900/70 border-brand-dark-800 card-hover-border space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center">
                {getPillarIcon(pillar.icon)}
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-gray-400 leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BRAND IDENTITY & ETHOS */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
        <Card className="p-8 sm:p-12 bg-brand-dark-900/90 border-brand-dark-800 space-y-8 relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <Badge variant="orange">{identity.badge}</Badge>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
              {identity.title}
            </h2>
            <blockquote className="text-brand-gray-300 italic text-base sm:text-lg border-r-2 border-brand-orange pr-4 font-sans leading-relaxed">
              "{identity.quote}"
            </blockquote>

            <div className="pt-2 space-y-3">
              {identity.points.map((pt, index) => (
                <div key={index} className="flex items-center gap-3 text-xs sm:text-sm text-brand-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* 5. PROMETHEUS POST PREVIEW */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHeader
            badgeText="المكتبة والأوراق البحثية"
            title="جديد منشورات بروميثيوس"
            description="مجموعة مختارة من المقالات المنهجية والأبحاث الأكاديمية المصاغة بأسلوب رصين."
          />
          <Link href="/articles" className="shrink-0">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <span>جميع المقالات</span>
              <ArrowLeft className="w-4 h-4 text-brand-orange" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <Card key={article.id} className="p-6 bg-brand-dark-900/80 border-brand-dark-800 card-hover-border flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="orange">{article.category}</Badge>
                  <span className="text-[11px] font-mono text-brand-gray-500">{article.publishedAt}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-white hover:text-brand-orange transition-colors">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-xs text-brand-gray-400 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-dark-800 flex items-center justify-between text-xs font-mono text-brand-gray-500">
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

      {/* ========================================================================= */}
      {/* 6. OUR PARTNERS & SPONSORS SECTION */}
      {/* ========================================================================= */}
      {partners.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-8">
          <SectionHeader
            badgeText="الشركاء والرعاة"
            title={settings["partners.title"] || "شركاؤنا الداعمون والمؤسسات الراعية"}
            description={settings["partners.subtitle"] || "نفخر بالتعاون مع المؤسسات التكنولوجية والمنابر الأكاديمية لدعم منصاتنا التطوعية المفتوحة."}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {partners.map((partner) => (
              <Card
                key={partner.id}
                className="p-6 bg-brand-dark-900/80 border-brand-dark-800 flex flex-col items-center justify-center space-y-3 hover:border-brand-orange/40 transition-colors group text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-brand-dark-850 border border-brand-dark-700 p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
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
                    className="text-[11px] font-mono text-brand-orange hover:underline inline-flex items-center gap-1"
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

      {/* ========================================================================= */}
      {/* 7. CALL TO ACTION / JOIN US */}
      {/* ========================================================================= */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl text-center space-y-6">
        <div className="p-10 rounded-2xl border border-brand-dark-800 bg-brand-dark-900/90 space-y-6 shadow-2xl">
          <Badge variant="orange" className="mx-auto">انضم إلينا اليوم</Badge>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
            هل ترغب في المساهمة بجهدك التطوعي؟
          </h2>
          <p className="text-xs sm:text-sm text-brand-gray-300 max-w-xl mx-auto leading-relaxed">
            نرحب بالمطورين والباحثين والمترجمين الشباب الراغبين في الانضمام لأقسام الفريق والمساهمة في تقديم معرفة حقيقية للمجتمع.
          </p>

          <div className="pt-2 flex justify-center">
            <Link href="/join-us">
              <Button size="lg" className="gap-2 text-sm">
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
