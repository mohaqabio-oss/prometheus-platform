import React from "react";
import Link from "next/link";
import { verifyCertificateCode } from "@/app/actions/hr-actions";
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
  Lock,
} from "lucide-react";

interface VerifyPageProps {
  params: Promise<{
    certificateId: string;
  }>;
}

export default async function CertificateVerificationPage({ params }: VerifyPageProps) {
  const { certificateId } = await params;
  const cert = await verifyCertificateCode(certificateId);

  return (
    <div className="min-h-screen py-16 px-4 bg-brand-dark-950 text-foreground font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-brand-orange rounded-sm rotate-45" />
            <span className="font-display font-bold text-lg text-white tracking-wider">
              فريق بروميثيوس التطوعي
            </span>
          </Link>
          <p className="text-xs font-mono text-brand-gray-400 uppercase tracking-widest">
            بوابة التحقق الرسمي من الشهادات التطوعية
          </p>
        </div>

        {/* Verification Card */}
        {cert ? (
          <Card className="p-8 sm:p-10 bg-brand-dark-900/90 border-emerald-500/30 space-y-8 shadow-2xl relative">
            
            {/* Status Header Banner */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
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
                  <p className="text-xs text-brand-gray-300 mt-0.5 font-sans">
                    تم التوثيق بواسطة السجل المؤسسي لفريق بروميثيوس التطوعي
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-white text-black shrink-0 hidden sm:block">
                <QrCode className="w-10 h-10" />
              </div>
            </div>

            {/* Certificate Details */}
            <div className="space-y-6">
              
              <div className="text-center space-y-2 border-b border-brand-dark-800 pb-6">
                <span className="text-xs font-mono text-brand-orange uppercase tracking-wider">
                  مسمى الشهادة التطوعية
                </span>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                  {cert.title}
                </h1>
                <p className="text-xs font-mono text-brand-gray-400">
                  رمز الشهادة الفريد: <strong className="text-white">{cert.certificateCode}</strong>
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                
                <div className="p-3.5 rounded-lg bg-brand-dark-950 border border-brand-dark-800 space-y-1">
                  <span className="text-brand-gray-500 text-[10px] uppercase block flex items-center gap-1">
                    <User className="w-3 h-3 text-brand-orange" /> اسم صاحب الشهادة
                  </span>
                  <p className="text-sm font-bold text-white font-sans">{cert.memberName}</p>
                  <p className="text-brand-gray-400 text-[11px]">{cert.memberRole}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-brand-dark-950 border border-brand-dark-800 space-y-1">
                  <span className="text-brand-gray-500 text-[10px] uppercase block flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-brand-orange" /> القسم التخصصي
                  </span>
                  <p className="text-sm font-bold text-white font-sans">{cert.memberDepartment}</p>
                  <p className="text-brand-gray-400 text-[11px]">عضو نشط في بروميثيوس</p>
                </div>

                <div className="p-3.5 rounded-lg bg-brand-dark-950 border border-brand-dark-800 space-y-1">
                  <span className="text-brand-gray-500 text-[10px] uppercase block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-orange" /> الساعات التطوعية الموثقة
                  </span>
                  <p className="text-base font-bold text-emerald-400">{cert.volunteerHours} ساعة تطوعية</p>
                </div>

                <div className="p-3.5 rounded-lg bg-brand-dark-950 border border-brand-dark-800 space-y-1">
                  <span className="text-brand-gray-500 text-[10px] uppercase block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-orange" /> تاريخ الإصدار الرسمي
                  </span>
                  <p className="text-sm font-bold text-white">
                    {new Date(cert.issuedAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>

              </div>

              {/* Description */}
              {cert.description && (
                <div className="p-4 rounded-lg bg-brand-dark-950 border border-brand-dark-800 text-xs text-brand-gray-300 leading-relaxed font-sans italic">
                  "{cert.description}"
                </div>
              )}

            </div>

            {/* Audit Footer */}
            <div className="pt-6 border-t border-brand-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-brand-gray-500">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>ختم التشفير الموثق SHA-256</span>
              </div>
              <span>الأرشيف المؤسسي الرسمي بروميثيوس</span>
            </div>

          </Card>
        ) : (
          <Card className="p-8 sm:p-10 bg-brand-dark-900/90 border-red-500/30 text-center space-y-6 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <Badge variant="dark" className="bg-red-500/20 text-red-400 border-red-500/40 font-mono text-xs">
                الحالة: غير صالحة أو غير موجودة
              </Badge>
              <h2 className="font-display text-xl font-bold text-white">
                فشل عملية التحقق من الشهادة
              </h2>
              <p className="text-xs text-brand-gray-400 max-w-md mx-auto leading-relaxed">
                رمز الشهادة المدخل <strong className="font-mono text-white">"{certificateId}"</strong> لا يطابق أي سجل رسمي صادق في أرشيف فريق بروميثيوس التطوعي.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-brand-dark-950 border border-brand-dark-800 text-[11px] font-mono text-brand-gray-500 max-w-md mx-auto text-right space-y-1">
              <p className="text-brand-gray-400 font-bold">تنبيه أمني:</p>
              <p>الرموز غير المسجلة قد تدل على شهادات ملغاة أو غير صادرة من المنظمة. يرجى التأكد من الرمز مع الجهة المصدرة.</p>
            </div>

            <div className="pt-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <ArrowRight className="w-4 h-4" />
                  <span>العودة للصفحة الرئيسية</span>
                </Button>
              </Link>
            </div>
          </Card>
        )}

      </div>

    </div>
  );
}
