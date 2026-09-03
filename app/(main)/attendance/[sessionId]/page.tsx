"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getPublicSessionForAttendance,
  submitAttendanceAction,
} from "@/app/actions/project-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  User,
  Mail,
  MessageSquare,
  ArrowRight,
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
    nameAr: string;
    sessionTitle: string;
    projectTitle: string;
    message?: string;
    alreadySubmitted?: boolean;
  } | null>(null);

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
          nameAr: res.nameAr || nameAr,
          sessionTitle: res.sessionTitle,
          projectTitle: res.projectTitle,
          message: res.message,
          alreadySubmitted: res.alreadySubmitted,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ غير متوقع أثناء إرسال الحضور.");
    } finally {
      setSubmitting(false);
    }
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
              لم يتم العثور على جلسة حضور بهذا المعرف. يرجى التأكد من الرابط الخاص بالجلسة.
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
  const project = session.project;

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
              <span>الفعالية / المشروع:</span>
              <span className="text-white font-bold font-sans">{project.title}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>الجلسة:</span>
              <span className="text-[#E84A0C] font-bold">{session.title}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link href="/projects">
              <Button size="sm" className="bg-[#E84A0C] hover:bg-[#D03E06] text-white text-xs font-bold rounded-xl">
                استعراض المشاريع والأنشطة
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Security Workflow: Successful Public Submission (Clean Success Message WITHOUT QR Code)
  if (submissionResult) {
    return (
      <div className="min-h-screen py-16 px-4 bg-[#080C16] flex items-center justify-center font-sans animate-fade-in">
        <Card className="max-w-md w-full p-8 sm:p-10 bg-[#0D1322] border border-emerald-500/40 text-center space-y-6 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Success Banner */}
          <div className="space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs mx-auto">
                {submissionResult.alreadySubmitted ? "سجل حضور مسبق موثق" : "تم تسليم التسجيل بنجاح"}
              </Badge>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                شكراً لك، {submissionResult.nameAr}
              </h1>
              <p className="text-xs text-stone-300 leading-relaxed max-w-sm mx-auto">
                {submissionResult.message || "تم تسجيل استمارة حضورك بنجاح. تم توثيق مشاركتك لدى فريق إدارة الفعالية."}
              </p>
            </div>
          </div>

          {/* Details Card */}
          <div className="p-4 rounded-2xl bg-[#080C16] border border-[#1E293B] text-xs space-y-2 text-right font-mono">
            <div className="flex justify-between text-stone-400">
              <span>الفعالية:</span>
              <span className="text-white font-bold font-sans">{submissionResult.projectTitle}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>الجلسة:</span>
              <span className="text-[#E84A0C] font-bold">{submissionResult.sessionTitle}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/" className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-[#E84A0C] font-mono transition-colors">
              <span>العودة للصفحة الرئيسية</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

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
              {project.title} • {session.title} (جلسة {session.sessionNumber}/{project.totalSessions})
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
                سيتم إدراج هذا الاسم في سجل الحضور والشهادات الرسمية.
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
                يستخدم البريد الإلكتروني لمطابقة حضورك التراكمي عبر جلسات الفعالية.
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
                <span>جاري إرسال تسليم الاستمارة...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>تأكيد وتسليم الاستمارة</span>
                </>
              )}
            </Button>

          </form>
        </Card>

      </div>
    </div>
  );
}
