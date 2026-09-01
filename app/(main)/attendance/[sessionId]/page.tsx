"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  getPublicSessionForAttendance,
  submitAttendanceAction,
} from "@/app/actions/activity-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
  ExternalLink,
  Sparkles,
  Send,
  User,
  Mail,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

interface AttendancePageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default function AttendanceFormPage({ params }: AttendancePageProps) {
  const { sessionId } = use(params);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  // Result State
  const [submissionResult, setSubmissionResult] = useState<{
    uniqueCode: string;
    nameAr: string;
    nameEn: string;
    sessionTitle: string;
    activityTitle: string;
    activitySlug?: string;
    alreadySubmitted?: boolean;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPublicSessionForAttendance(sessionId);
        setSessionData(res);
      } catch (err) {
        setSessionData({ found: false, isOpen: false, session: null });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.set("sessionId", sessionId);
    formData.set("nameAr", nameAr);
    formData.set("nameEn", nameEn);
    formData.set("email", email);
    formData.set("feedback", feedback);

    try {
      const res = await submitAttendanceAction(null, formData);
      if (res?.error && !res.alreadySubmitted) {
        setErrorMessage(res.error);
      } else if (res?.success || res?.alreadySubmitted) {
        setSubmissionResult({
          uniqueCode: res.uniqueCode,
          nameAr: res.nameAr || nameAr,
          nameEn: res.nameEn || nameEn,
          sessionTitle: res.sessionTitle,
          activityTitle: res.activityTitle,
          activitySlug: res.activitySlug,
          alreadySubmitted: res.alreadySubmitted,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ غير متوقع أثناء إرسال الحضور.");
    } finally {
      setSubmitting(false);
    }
  };

  const getVerificationUrl = (code: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/verify/${code}`;
    }
    return `https://pmthiq.online/verify/${code}`;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(getVerificationUrl(code));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center bg-[#080C16] text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#E84A0C] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-stone-400">جاري التحقق من حالة استمارة الحضور...</p>
        </div>
      </div>
    );
  }

  // Session Not Found
  if (!sessionData?.found) {
    return (
      <div className="min-h-screen py-20 px-4 bg-[#080C16] flex items-center justify-center font-sans">
        <Card className="max-w-md w-full p-8 bg-[#0D1322] border-red-500/30 text-center space-y-5 rounded-3xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-white">رمز الجلسة غير صحيح</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              لم يتم العثور على جلسة حضور بهذا المعرف. يرجى التأكد من الرابط أو طلب رمز الاستجابة السريعة من المحاضر.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-white/15 text-stone-300 text-xs">
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const session = sessionData.session;
  const activity = session.activity;

  // Form Closed Screen
  if (!sessionData.isOpen) {
    return (
      <div className="min-h-screen py-20 px-4 bg-[#080C16] flex items-center justify-center font-sans">
        <Card className="max-w-lg w-full p-8 sm:p-10 bg-[#0D1322] border-[#1E293B] text-center space-y-6 rounded-3xl shadow-2xl relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="dark" className="text-stone-400 text-xs mx-auto">
              الاستمارة غير متاحة
            </Badge>
            <h2 className="font-display text-2xl font-bold text-white">
              استمارة تسجيل الحضور مغلقة
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md mx-auto">
              {sessionData.isExpired
                ? "انتهت المهلة المحددة لتسجيل الحضور لهذه المحاضرة."
                : "تم إغلاق استمارة الحضور لهذه الجلسة من قبل إدارة الفعالية والمحاضر."}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080C16] border border-[#1E293B] text-xs space-y-2 text-right font-mono">
            <div className="flex justify-between text-stone-400">
              <span>الفعالية:</span>
              <span className="text-white font-bold font-sans">{activity.title}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>الجلسة:</span>
              <span className="text-[#E84A0C] font-bold">{session.title}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link href={`/activities/${activity.slug}`}>
              <Button size="sm" className="bg-[#E84A0C] hover:bg-[#D03E06] text-white text-xs font-bold rounded-xl">
                عرض تفاصيل الدورة
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Successful Submission / Already Submitted View with Dynamic QR Code
  if (submissionResult) {
    const verifyUrl = getVerificationUrl(submissionResult.uniqueCode);

    return (
      <div className="min-h-screen py-16 px-4 bg-[#080C16] flex items-center justify-center font-sans animate-fade-in">
        <Card className="max-w-xl w-full p-8 sm:p-10 bg-[#0D1322] border border-emerald-500/40 text-center space-y-8 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Banner */}
          <div className="space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs mx-auto">
                {submissionResult.alreadySubmitted ? "سجل حضور مسبق موثق" : "تم تسجيل حضورك بنجاح!"}
              </Badge>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                أهلاً بك، {submissionResult.nameAr}
              </h1>
              <p className="text-xs text-stone-400 font-mono">
                {submissionResult.sessionTitle} • {submissionResult.activityTitle}
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative z-10 p-6 bg-white rounded-3xl inline-block mx-auto shadow-2xl border-4 border-[#E84A0C]">
            <QRCodeSVG
              value={verifyUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Participant Verification Code Box */}
          <div className="relative z-10 space-y-3">
            <div className="p-4 rounded-2xl bg-[#080C16] border border-[#1E293B] space-y-2 text-center">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-widest block">
                رمز التحقق المؤسسي الفريد (Unique Participant Code)
              </span>
              <p className="font-mono text-2xl font-black text-[#E84A0C] tracking-wider select-all">
                {submissionResult.uniqueCode}
              </p>
              <p className="text-[11px] text-stone-400 font-sans">
                احتفظ بهذا الرمز للتحقق من نسبة حضورك والحصول على شهادة المشاركة المعتمدة.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href={`/verify/${submissionResult.uniqueCode}`} className="w-full">
                <Button className="w-full gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white text-xs font-bold rounded-xl py-2.5 shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                  <span>فتح بوابة التوثيق الرسمية</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => handleCopyCode(submissionResult.uniqueCode)}
                className="w-full sm:w-auto shrink-0 gap-2 border-[#1E293B] text-stone-300 hover:text-white text-xs rounded-xl"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "تم نسخ رابط التوثيق" : "نسخ الرابط"}</span>
              </Button>
            </div>
          </div>

          {submissionResult.activitySlug && (
            <div className="pt-2 border-t border-[#1E293B]">
              <Link
                href={`/activities/${submissionResult.activitySlug}`}
                className="text-xs font-mono text-stone-400 hover:text-[#E84A0C] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>العودة لصفحة الدورة واستعراض قائمة الحضور</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </Card>
      </div>
    );
  }

  // Active Attendance Form
  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 bg-[#080C16] flex items-center justify-center font-sans">
      <div className="w-full max-w-xl space-y-8 animate-fade-in">
        
        {/* Top Header Card */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-[#0D1322] border border-white/10 group-hover:border-[#E84A0C]">
              <Image
                src="/logo-dark.PNG"
                alt="Prometheus"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="font-display font-bold text-lg text-white">
              فريق بروميثيوس التطوعي
            </span>
          </Link>

          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              استمارة تسجيل الحضور المباشر
            </h1>
            <p className="text-xs font-mono text-[#E84A0C]">
              {activity.title} • {session.title} (جلسة {session.sessionNumber}/{activity.totalSessions})
            </p>
          </div>
        </div>

        {/* Attendance Form Card */}
        <Card className="p-8 sm:p-10 bg-[#0D1322] border border-[#1E293B] rounded-3xl shadow-2xl space-y-6">
          
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans leading-relaxed">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
            
            {/* Arabic Name */}
            <div className="space-y-1.5">
              <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#E84A0C]" />
                <span>الاسم الكامل الثلاثي (باللغة العربية)</span>
                <span className="text-red-400">*</span>
              </label>
              <Input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: أحمد علي حسين"
                className="bg-[#080C16] border-[#1E293B] text-white text-xs h-11 rounded-xl"
                required
              />
              <p className="text-[10px] text-stone-500 font-mono">
                سيتم إدراج هذا الاسم في شهادة الحضور الرسمية.
              </p>
            </div>

            {/* English Name */}
            <div className="space-y-1.5">
              <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#E84A0C]" />
                <span>الاسم الكامل (باللغة الإنجليزية / English Name)</span>
                <span className="text-red-400">*</span>
              </label>
              <Input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Ahmed Ali Hussein"
                className="bg-[#080C16] border-[#1E293B] text-white text-xs h-11 rounded-xl font-mono"
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E84A0C]" />
                <span>البريد الإلكتروني المعتمد</span>
                <span className="text-red-400">*</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="bg-[#080C16] border-[#1E293B] text-white text-xs h-11 rounded-xl font-mono"
                required
              />
              <p className="text-[10px] text-stone-500 font-mono">
                يستخدم البريد الإلكتروني لمطابقة حضورك التراكمي عبر جلسات الدورة المختلفة.
              </p>
            </div>

            {/* Feedback / Evaluation */}
            <div className="space-y-1.5">
              <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#E84A0C]" />
                <span>رأيك وتقييمك عن هذه الجلسة / المحاضرة</span>
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="اكتب انطباعك أو أي ملاحظات لتطوير المحتوى التعليمي..."
                className="w-full rounded-xl border border-[#1E293B] bg-[#080C16] p-3 text-xs text-white placeholder:text-stone-500 focus:border-[#E84A0C] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white font-bold text-xs py-3.5 rounded-xl shadow-xl transition-all hover:scale-[1.01]"
            >
              {submitting ? (
                <span>جاري تسجيل الحضور وتوليد رمز QR...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>تأكيد تسجيل الحضور وتوليد الرمز الفريد</span>
                </>
              )}
            </Button>

          </form>
        </Card>

      </div>
    </div>
  );
}
