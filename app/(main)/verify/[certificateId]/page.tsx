import React from "react";
import Link from "next/link";
import { verifyCertificateCode } from "@/app/actions/hr-actions";
import { getParticipantVerification } from "@/app/actions/activity-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  QrCode,
  Calendar,
  Clock,
  User,
  Building2,
  ArrowRight,
  GraduationCap,
  Layers,
  Award,
  BookOpen,
} from "lucide-react";

interface VerifyPageProps {
  params: Promise<{
    certificateId: string;
  }>;
}

export default async function UnifiedVerificationPage({ params }: VerifyPageProps) {
  const { certificateId } = await params;

  // Check both Certificate and Participant Activity Verification
  const participantData = await getParticipantVerification(certificateId);
  const cert = !participantData ? await verifyCertificateCode(certificateId) : null;

  return (
    <div className="min-h-screen py-16 px-4 bg-[#080C16] text-foreground font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-8 animate-fade-in">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#E84A0C] rounded-sm rotate-45" />
            <span className="font-display font-bold text-lg text-white tracking-wider">
              فريق بروميثيوس التطوعي
            </span>
          </Link>
          <p className="text-xs font-mono text-stone-400 uppercase tracking-widest">
            بوابة التحقق والتوثيق الرقمي المعتمد
          </p>
        </div>

        {/* 1. PARTICIPANT ATTENDANCE VERIFICATION VIEW */}
        {participantData ? (
          <Card className="p-8 sm:p-10 bg-[#0D1322] border border-emerald-500/30 space-y-8 shadow-2xl relative rounded-3xl">
            
            {/* Status Header Banner */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-emerald-400 font-bold tracking-wider uppercase">
                      سجل حضور موثق ومطابق
                    </span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[9px]">
                      معتمد رقمياً
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5 font-sans">
                    سجل حضور رسمي مسجل في قاعدة بيانات منصة بروميثيوس
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white text-black shrink-0 hidden sm:block">
                <QrCode className="w-10 h-10" />
              </div>
            </div>

            {/* Participant Profile */}
            <div className="text-center space-y-2 border-b border-[#1E293B] pb-6">
              <span className="text-xs font-mono text-[#E84A0C] uppercase tracking-wider">
                بيانات المشارك المعتمد
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
                {participantData.participant.nameAr}
              </h1>
              <p className="text-sm font-mono text-stone-400">
                {participantData.participant.nameEn}
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <Badge variant="dark" className="font-mono text-xs text-stone-300">
                  رمز المشارك: <strong className="text-[#E84A0C]">{participantData.participant.uniqueCode}</strong>
                </Badge>
              </div>
            </div>

            {/* Activities & Sessions Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-300">
                <GraduationCap className="w-4 h-4 text-[#E84A0C]" />
                <span>الأنشطة والدورات المسجلة ({participantData.activities.length})</span>
              </div>

              <div className="space-y-4">
                {participantData.activities.map((act) => (
                  <div
                    key={act.activityId}
                    className="p-5 rounded-2xl bg-[#080C16] border border-[#1E293B] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="orange" className="text-[10px]">
                            {act.activityType}
                          </Badge>
                          <Link
                            href={`/activities/${act.activitySlug}`}
                            className="font-display font-bold text-white text-base hover:text-[#E84A0C] transition-colors"
                          >
                            {act.activityTitle}
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-stone-400">نسبة الحضور:</span>
                        <span className="font-bold text-white">
                          {act.attendanceRatio} ({act.attendancePercentage}%)
                        </span>
                        {act.isPassed ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                            مستحق للشهادة
                          </Badge>
                        ) : (
                          <Badge variant="dark" className="text-stone-400 text-[10px]">
                            حضور جزئي
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Attended Sessions List */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono text-stone-500 block">
                        الجلسات والمحاضرات التي تم حضورها:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {act.sessions.map((s) => (
                          <div
                            key={s.sessionId}
                            className="p-2.5 rounded-xl bg-[#0D1322] border border-[#1E293B] flex items-center justify-between text-xs font-mono"
                          >
                            <span className="text-stone-200 truncate flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="truncate">{s.sessionTitle}</span>
                            </span>
                            <span className="text-[10px] text-stone-500 shrink-0">
                              {new Date(s.attendedAt).toLocaleDateString("ar-SA")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Seal Footer */}
            <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-stone-400" />
                منظومة بروميثيوس لإدارة الأنشطة والتحقق الرقمي
              </span>
              <span className="text-[11px]">
                تاريخ التسجيل الأول: {new Date(participantData.participant.createdAt).toLocaleDateString("ar-SA")}
              </span>
            </div>

          </Card>
        ) : cert ? (
          /* 2. CERTIFICATE VERIFICATION VIEW */
          <Card className="p-8 sm:p-10 bg-[#0D1322] border-emerald-500/30 space-y-8 shadow-2xl relative rounded-3xl">
            
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-emerald-400 font-bold tracking-wider uppercase">
                      الحالة: صالحة (موثقة رسمياً)
                    </span>
                    <Badge variant="dark" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[9px]">
                      سجل موثق في الأرشيف
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5 font-sans">
                    تم التوثيق بواسطة السجل المؤسسي لفريق بروميثيوس التطوعي
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-white text-black shrink-0 hidden sm:block">
                <QrCode className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center space-y-2 border-b border-[#1E293B] pb-6">
                <span className="text-xs font-mono text-[#E84A0C] uppercase tracking-wider">
                  مسمى الشهادة التطوعية
                </span>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                  {cert.title}
                </h1>
                <p className="text-xs font-mono text-stone-400">
                  رمز الشهادة الفريد: <strong className="text-white">{cert.certificateCode}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-[#080C16] border border-[#1E293B] space-y-1">
                  <span className="text-stone-500 text-[10px] uppercase block flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    الممنوحة له (العضو)
                  </span>
                  <p className="text-sm font-bold text-white font-sans">{cert.recipientName}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080C16] border border-[#1E293B] space-y-1">
                  <span className="text-stone-500 text-[10px] uppercase block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    تاريخ الإصدار
                  </span>
                  <p className="text-sm font-bold text-stone-200">
                    {new Date(cert.issueDate).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080C16] border border-[#1E293B] space-y-1">
                  <span className="text-stone-500 text-[10px] uppercase block flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    الجهة المصدرة
                  </span>
                  <p className="text-sm font-bold text-stone-200 font-sans">
                    فريق بروميثيوس التطوعي
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080C16] border border-[#1E293B] space-y-1">
                  <span className="text-stone-500 text-[10px] uppercase block flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ساعات التطوع الموثقة
                  </span>
                  <p className="text-sm font-bold text-[#E84A0C]">
                    {cert.hoursCount ? `${cert.hoursCount} ساعة تدريبية/تطوعية` : "شهادة إنجاز وتقدير"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-stone-500">
              <span>سجل رقمي مشفر</span>
              <span>Prometheus Verification System</span>
            </div>

          </Card>
        ) : (
          /* 3. INVALID / NOT FOUND CODE */
          <Card className="p-8 sm:p-10 bg-[#0D1322] border-red-500/30 text-center space-y-6 shadow-2xl rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-wider block">
                رمز غير مطابق
              </span>
              <h2 className="font-display text-2xl font-bold text-white">
                لم يتم العثور على سجل بهذا الرمز
              </h2>
              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                الرمز الذي أدخلته (<strong className="font-mono text-white">{certificateId}</strong>) غير مسجل في السجل الرسمي للمشاركين أو الشهادات الصادرة.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 text-xs border border-white/10 text-stone-300 hover:text-white hover:border-white/30 rounded-xl h-8 px-3 transition-all duration-300 font-medium cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </Link>
            </div>
          </Card>
        )}

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="text-xs font-mono text-stone-500 hover:text-white transition-colors">
            ← العودة إلى الصفحة الرئيسية لموقع بروميثيوس
          </Link>
        </div>

      </div>

    </div>
  );
}
