import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  UserCheck,
  Clock,
  ArrowUpLeft,
  Activity,
  PlusCircle,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const firstName = session?.fullName.split(" ")[0] || "عضو الكادر";

  const mockMetrics = [
    {
      title: "إجمالي الأعضاء النشطين",
      value: "6 أعضاء",
      subtitle: "موزعين على 4 أقسام تخصصية",
      icon: <Users className="w-5 h-5 text-brand-orange" />,
      link: "/admin/members",
    },
    {
      title: "المقالات المنشورة",
      value: "6 مقالات",
      subtitle: "سلسلة منشورات بروميثيوس",
      icon: <FileText className="w-5 h-5 text-brand-orange" />,
      link: "/admin/articles",
    },
    {
      title: "طلبات الانضمام المعلقة",
      value: "2 طلبان",
      subtitle: "في انتظار مراجعة الموارد البشرية",
      icon: <UserCheck className="w-5 h-5 text-brand-orange" />,
      link: "/admin/applications",
    },
    {
      title: "ساعات التطوع الموثقة",
      value: "625 ساعة",
      subtitle: "إجمالي الساعات المسجلة للكادر",
      icon: <Clock className="w-5 h-5 text-brand-orange" />,
      link: "/admin/members",
    },
  ];

  const mockActivities = [
    {
      id: "act-1",
      user: "سارة الحسني",
      action: "قدمت مسودة مقالة جديدة للمراجعة",
      target: "مراجعة منهجية: تطبيقات التعلم العميق في تحليل المتغيرات الجينية",
      time: "منذ ساعتين",
      tag: "التحرير",
    },
    {
      id: "act-2",
      user: "عمر الفاروق",
      action: "راجع طلب انضمام جديد",
      target: "المتقدم: أحمد يوسف (قسم الهندسة البرمجية)",
      time: "منذ 5 ساعات",
      tag: "الموارد البشرية",
    },
    {
      id: "act-3",
      user: "كرار المنصور",
      action: "حدّث إعدادات نظام الصلاحيات الأمني",
      target: "Prisma PostgreSQL & RBAC Middleware",
      time: "منذ يوم واحد",
      tag: "النظام",
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-dark-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-brand-orange uppercase tracking-wider">
              لوحة التحكم التنفيذية
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            أهلاً بك مجدداً، <span className="text-brand-orange">{firstName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray-400 mt-1">
            نظرة عامة على أداء فريق بروميثيوس التطوعي وسجلات الأنشطة المؤسسية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/articles/new">
            <Button size="sm" className="gap-1.5 text-xs">
              <PlusCircle className="w-4 h-4" />
              <span>كتابة مقالة جديدة</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockMetrics.map((metric) => (
          <Link key={metric.title} href={metric.link}>
            <Card className="p-5 bg-brand-dark-900/80 border-brand-dark-800 hover:border-brand-orange/40 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center">
                  {metric.icon}
                </div>
                <ArrowUpLeft className="w-4 h-4 text-brand-gray-500 group-hover:text-brand-orange transition-colors" />
              </div>
              <p className="text-xs text-brand-gray-400 font-sans">{metric.title}</p>
              <p className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-brand-orange transition-colors">
                {metric.value}
              </p>
              <p className="text-[11px] text-brand-gray-500 font-mono mt-1">{metric.subtitle}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* RECENT ACTIVITY & QUICK ACCESS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity Stream */}
        <Card className="lg:col-span-8 p-6 bg-brand-dark-900/80">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-brand-dark-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-orange" />
                <span>سجل الأنشطة والعمليات الأخير</span>
              </CardTitle>
              <CardDescription className="text-xs">
                متابعة فورية لعمليات التحرير، طلبات الانضمام، والتحديثات التقنية.
              </CardDescription>
            </div>
            <Badge variant="orange" className="text-[10px]">سجل التدقيق الفوري</Badge>
          </CardHeader>

          <CardContent className="px-0 pt-4 space-y-4">
            {mockActivities.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-brand-dark-850/60 border border-brand-dark-800 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{act.user}</span>
                    <span className="text-brand-gray-400">{act.action}</span>
                    <Badge variant="dark" className="text-[9px]">{act.tag}</Badge>
                  </div>
                  <p className="text-brand-gray-300 font-mono text-[11px] leading-relaxed">
                    "{act.target}"
                  </p>
                </div>
                <span className="font-mono text-[10px] text-brand-gray-500 shrink-0">{act.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick System Navigation Panel */}
        <Card className="lg:col-span-4 p-6 bg-brand-dark-900/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-orange" />
              <h3 className="font-display text-base font-bold text-white">صلاحيات المستخدم</h3>
            </div>
            <p className="text-xs text-brand-gray-400 leading-relaxed">
              صلاحيات حسابك الحالية <strong className="text-white">{session?.roles.join(", ")}</strong> تحدد الوصول للروابط التنفيذية.
            </p>

            <div className="space-y-2 pt-2">
              <Link href="/admin/articles">
                <Button variant="outline" size="sm" className="w-full justify-between text-xs">
                  <span>إدارة المقالات والمنشورات</span>
                  <ChevronLeft className="w-4 h-4 text-brand-orange" />
                </Button>
              </Link>
              <Link href="/admin/members">
                <Button variant="outline" size="sm" className="w-full justify-between text-xs">
                  <span>إدارة أعضاء الفريق والساعات</span>
                  <ChevronLeft className="w-4 h-4 text-brand-orange" />
                </Button>
              </Link>
              <Link href="/admin/certificates">
                <Button variant="outline" size="sm" className="w-full justify-between text-xs">
                  <span>إصدار وتوثيق الشهادات</span>
                  <ChevronLeft className="w-4 h-4 text-brand-orange" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-dark-800 mt-6 text-[11px] font-mono text-brand-gray-500">
            <span>نظام بروميثيوس • الإصدار 1.0.0</span>
          </div>
        </Card>

      </div>

    </div>
  );
}
