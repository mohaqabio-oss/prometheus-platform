import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublicWebsiteData } from "@/app/actions/website-actions";
import { PrometheusHero } from "@/components/ui/horizon-hero-section";
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
  Link2,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { settings, dynamicStats, featuredArticles, partners } =
    await getPublicWebsiteData();

  const heroBadge =
    settings.pageHeaders?.homeHero?.badge || "منصة مؤسسية وأكاديمية تطوعية";
  const heroTitle =
    settings.pageHeaders?.homeHero?.title || "فريق بروميثيوس التطوعي";
  const heroSubtitle =
    settings.pageHeaders?.homeHero?.subtitle ||
    "مؤسسة تطوعية أكاديمية تعنى بتطوير المنصات البرمجية، نشر المقالات والبحوث المفتوحة، وتدريب الطاقات الشبابية.";

  const aboutBadge =
    settings.pageHeaders?.homeAbout?.badge || "رؤيتنا ورسالتنا";
  const aboutTitle =
    settings.pageHeaders?.homeAbout?.title ||
    "منظمة تطوعية تسعى للنهوض بالواقع الأكاديمي والتقني";
  const aboutDescription =
    settings.pageHeaders?.homeAbout?.subtitle ||
    "تأسس فريق بروميثيوس التطوعي بهدف سد الثغرة بين الدراسة الأكاديمية وسوق العمل التقني، من خلال مشاريع حقيقية وأبحاث رصينة.";

  const academicSpecs = settings.academicSpecs;
  const isSpecsEnabled = academicSpecs?.enabled === true;

  const pillars = [
    {
      id: "tech",
      specCode: "SPEC // TECH-01",
      title: "الهندسة البرمجية والتطوير",
      description:
        "بناء المنصات الرقمية والتطبيقات مفتوحة المصدر اعتماداً على أحدث التقنيات البرمجية.",
      icon: "code",
    },
    {
      id: "research",
      specCode: "SPEC // RES-02",
      title: "البحث العلمي والتحليل",
      description:
        "إعداد الأوراق والبحوث المنهجية وتحليل البيانات لدعم الحصيلة العلمية للمجتمع.",
      icon: "book",
    },
    {
      id: "edu",
      specCode: "SPEC // EDU-03",
      title: "التعليم وصناعة المحتوى",
      description:
        "تقديم ورش عمل تخصصية وكتابة مقالات تعليمية مبسطة باللغة العربية.",
      icon: "grad",
    },
    {
      id: "hr",
      specCode: "SPEC // OPS-04",
      title: "الموارد البشرية والعمليات",
      description:
        "إدارة وتنظيم الطاقات التطوعية وتوجيه الكوادر نحو المكان المناسب لإمكانياتهم.",
      icon: "users",
    },
  ];

  const identity = {
    badge: "الهوية والرسالة الأكاديمية",
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
        return <Code2 className="w-6 h-6 text-[#D49B4B]" />;
      case "book":
        return <BookOpen className="w-6 h-6 text-[#0284C7]" />;
      case "grad":
        return <GraduationCap className="w-6 h-6 text-[#D49B4B]" />;
      case "users":
        return <Users2 className="w-6 h-6 text-[#0284C7]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#D49B4B]" />;
    }
  };

  const homeBlocks = settings.homeBlocks || [];

  return (
    <div className="space-y-20 pb-20 bg-[#0A0F1D] text-[#F8FAFC]">
      
      {/* 1. THREE.JS & GSAP 3D HERO SECTION — PROMETHEUS BRANDING */}
      <PrometheusHero
        heroBadge={heroBadge}
        heroSubtitle={heroSubtitle}
      />

      {/* 2. ABOUT THE TEAM SECTION — ARCHIVAL STATS GRID */}
      <section id="about" className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badgeText={aboutBadge}
              title={aboutTitle}
              description={aboutDescription}
            />

            <div className="pt-2">
              <Link href="/join-us">
                <Button variant="outline" size="md" className="gap-2 text-xs rounded-xl border-[#1E293B] bg-[#141C2F] text-[#F8FAFC] hover:border-[#D49B4B]/50 hover:text-[#D49B4B]">
                  <span>تعرّف على آلية الانضمام</span>
                  <ArrowLeft className="w-4 h-4 text-[#D49B4B]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Dynamic Stats Metric Cards Grid (With Archival Spec-Margin) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {dynamicStats.map((stat: any, i: number) => (
              <Card key={i} specMargin={true} className="p-6 space-y-2">
                <p className="font-mono font-bold text-3xl sm:text-4xl text-[#D49B4B]">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#94A3B8] font-sans">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 3. DYNAMIC CONTENT BLOCKS SECTION (Custom Admin Configured Blocks) */}
      {homeBlocks.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-8">
          <SectionHeader
            badgeText="المكونات التفاعلية"
            title="منصات ومبادرات بروميثيوس"
            description="مكونات ديناميكية مصممة ومخصصة عبر لوحة التحكم لعرض المبادرات والمشاريع الرئيسية."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeBlocks.map((block) => {
              if (block.type === "image-card") {
                return (
                  <Card
                    key={block.id}
                    specMargin={true}
                    className="p-0 overflow-hidden flex flex-col justify-between group"
                  >
                    {block.image_url && (
                      <div className="h-44 w-full overflow-hidden relative bg-[#0A0F1D] border-b border-[#1E293B]">
                        <img
                          src={block.image_url}
                          alt={block.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        {block.subtitle && (
                          <span className="text-[11px] font-mono text-[#D49B4B] block">
                            {block.subtitle}
                          </span>
                        )}
                        <h3 className="font-serif text-lg font-bold text-[#F8FAFC]">
                          {block.title}
                        </h3>
                        {block.content && (
                          <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3 font-sans">
                            {block.content}
                          </p>
                        )}
                      </div>

                      {block.target_url && (
                        <div className="pt-4 border-t border-[#1E293B]">
                          <Link href={block.target_url}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full gap-2 text-xs rounded-xl border-[#1E293B] bg-[#0A0F1D] text-[#F8FAFC] hover:text-[#D49B4B]"
                            >
                              <span>استكشف المزيد</span>
                              <ArrowLeft className="w-3.5 h-3.5 text-[#D49B4B]" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              }

              if (block.type === "shortcut-link") {
                return (
                  <Card
                    key={block.id}
                    specMargin={true}
                    className="bg-gradient-to-br from-[#141C2F] to-[#0A0F1D] flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#D49B4B]/10 border border-[#D49B4B]/30 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-[#D49B4B]" />
                      </div>
                      {block.subtitle && (
                        <span className="text-[11px] font-mono text-[#D49B4B] block">
                          {block.subtitle}
                        </span>
                      )}
                      <h3 className="font-serif text-lg font-bold text-[#F8FAFC]">
                        {block.title}
                      </h3>
                      {block.content && (
                        <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                          {block.content}
                        </p>
                      )}
                    </div>

                    {block.target_url && (
                      <div className="pt-2">
                        <Link href={block.target_url}>
                          <Button
                            size="sm"
                            className="w-full gap-2 text-xs bg-[#D49B4B] hover:bg-[#b8823b] text-[#0A0F1D] font-bold rounded-xl shadow-md"
                          >
                            <span>انتقال سريع</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </Card>
                );
              }

              // Default: info-box
              return (
                <Card
                  key={block.id}
                  specMargin={true}
                  className="flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A0F1D] border border-[#1E293B] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#D49B4B]" />
                    </div>
                    {block.subtitle && (
                      <span className="text-[11px] font-mono text-[#D49B4B] block">
                        {block.subtitle}
                      </span>
                    )}
                    <h3 className="font-serif text-lg font-bold text-[#F8FAFC]">
                      {block.title}
                    </h3>
                    {block.content && (
                      <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                        {block.content}
                      </p>
                    )}
                  </div>

                  {block.target_url && (
                    <div className="pt-4 border-t border-[#1E293B]">
                      <Link href={block.target_url}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 text-xs rounded-xl border-[#1E293B] bg-[#0A0F1D] text-[#F8FAFC] hover:text-[#D49B4B]"
                        >
                          <span>عرض التفاصيل</span>
                          <ArrowLeft className="w-3.5 h-3.5 text-[#D49B4B]" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. WHAT WE DO (PILLARS) */}
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
              specMargin={true}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A0F1D] border border-[#1E293B] flex items-center justify-center">
                  {getPillarIcon(pillar.icon)}
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8]">
                  {pillar.specCode}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F8FAFC]">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. BRAND IDENTITY & ETHOS */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
        <Card specMargin={true} className="p-8 sm:p-12 space-y-8 relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <Badge variant="amber">{identity.badge}</Badge>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#F8FAFC] leading-tight">
              {identity.title}
            </h2>
            <blockquote className="text-[#94A3B8] italic text-base sm:text-lg border-r-4 border-[#D49B4B] pr-4 font-sans leading-relaxed bg-[#0A0F1D]/50 p-4 rounded-l-xl">
              "{identity.quote}"
            </blockquote>

            <div className="pt-2 space-y-3">
              {identity.points.map((pt, index) => (
                <div key={index} className="flex items-center gap-3 text-xs sm:text-sm text-[#94A3B8] font-sans">
                  <CheckCircle2 className="w-4 h-4 text-[#D49B4B] shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* 6. PROMETHEUS POST PREVIEW (Only if published articles exist) */}
      {featuredArticles.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader
              badgeText="المدونة المعرفية"
              title="جديد تدوينات بروميثيوس"
              description="مجموعة مختارة من المقالات التوعوية والتدوينات البرمجية والتجارب التقنية."
            />
            <Link href="/blog" className="shrink-0">
              <Button variant="outline" size="sm" className="gap-2 text-xs rounded-xl border-[#1E293B] bg-[#141C2F] text-[#F8FAFC] hover:border-[#D49B4B]/50 hover:text-[#D49B4B]">
                <span>جميع التدوينات</span>
                <ArrowLeft className="w-4 h-4 text-[#D49B4B]" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article: any) => (
              <Card key={article.id} specMargin={true} className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="amber">{article.category}</Badge>
                    <span className="text-[11px] font-mono text-[#94A3B8]">{article.publishedAt}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#F8FAFC] hover:text-[#D49B4B] transition-all duration-300">
                    <Link href="/blog">
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-[#94A3B8] line-clamp-3 leading-relaxed font-sans">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                  <span>{article.author.name}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D49B4B]" />
                    {article.readTime}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 7. OUR PARTNERS & SPONSORS SECTION */}
      {partners.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-8">
          <SectionHeader
            badgeText={settings.pageHeaders?.partners?.badge || "الشركاء والرعاة"}
            title={settings.pageHeaders?.partners?.title || "شركاؤنا الداعمون والمؤسسات الراعية"}
            description={settings.pageHeaders?.partners?.subtitle || "نفخر بالتعاون مع المؤسسات التكنولوجية والمنابر الأكاديمية لدعم منصاتنا التطوعية المفتوحة."}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {partners.map((partner: any) => (
              <Card
                key={partner.id}
                className="p-6 bg-[#141C2F] border border-[#1E293B] rounded-2xl flex flex-col items-center justify-center space-y-3 hover:border-[#D49B4B]/50 shadow-sm transition-all duration-300 group text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-[#0A0F1D] border border-[#1E293B] p-2 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <p className="font-bold text-[#F8FAFC] text-xs sm:text-sm font-sans">{partner.name}</p>

                {partner.websiteUrl && (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-[#D49B4B] hover:underline inline-flex items-center gap-1"
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

      {/* 8. CALL TO ACTION / JOIN US */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl text-center space-y-6">
        <div className="p-10 rounded-2xl border border-[#1E293B] border-r-4 border-r-[#D49B4B] bg-[#141C2F] space-y-6 shadow-xl transition-all duration-300">
          <Badge variant="amber" className="mx-auto">انضم إلينا اليوم</Badge>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#F8FAFC]">
            هل ترغب في المساهمة بجهدك التطوعي؟
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed font-sans">
            نرحب بالمطورين والباحثين والمترجمين الشباب الراغبين في الانضمام لأقسام الفريق والمساهمة في تقديم معرفة حقيقية للمجتمع.
          </p>

          <div className="pt-2 flex justify-center">
            <Link href="/join-us">
              <Button size="lg" className="gap-2 text-sm bg-[#D49B4B] hover:bg-[#b8823b] text-[#0A0F1D] font-bold rounded-xl shadow-lg transition-all duration-300">
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
