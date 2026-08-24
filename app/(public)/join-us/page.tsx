"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { submitJoinRequestAction } from "@/app/actions/application-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Globe,
  Heart,
} from "lucide-react";

export default function JoinUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const res = await submitJoinRequestAction(prevState, formData);
    if (res.success) {
      setSubmitted(true);
    }
    return res;
  }, null);

  return (
    <div className="py-12 sm:py-20 px-4 max-w-4xl mx-auto space-y-12 transition-all duration-300 relative">
      
      {/* Ambient Glowing Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#E84A0C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <SectionHeader
        badgeText="تقديم طلب انضمام للكادر التطوعي"
        title="انضم إلى عائلة بروميثيوس —"
        highlightedTitle="رؤية الشباب بعقلية العلماء"
        description="نرحب بالكوادر البرمجية، الباحثين الأكاديميين، وصناع المحتوى الراغبين في الانضمام لأقسام الفريق والمساهمة في بناء المنصات الأكاديمية والبحثية."
      />

      {/* Success State View */}
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-8 sm:p-12 bg-[#0D1322]/90 backdrop-blur-xl border border-emerald-500/40 text-center space-y-6 shadow-2xl rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <Badge variant="dark" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-mono text-xs">
                تم استلام طلبك بنجاح
              </Badge>
              <h2 className="font-display text-2xl font-bold text-white">
                شكراً لتقديمك طلب الانضمام!
              </h2>
              <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
                تم تسجيل طلبك في قائمة المراجعة لدى قسم الموارد البشرية والعمليات بفريق بروميثيوس. سيقوم مسؤول التوظيف بمراجعة بياناتك والتواصل معك عبر وسائل الاتصال المسجلة.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-stone-400 max-w-md mx-auto space-y-1.5 text-right">
              <p className="text-white font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>الخطوات القادمة:</span>
              </p>
              <p>1. المراجعة الأولية وتصنيف البيانات (خلال 24-48 ساعة)</p>
              <p>2. التواصل المباشر وتحديد موعد المقابلة الأكاديمية</p>
              <p>3. اعتماد العضوية وإدراج البيانات في دليل الأعضاء</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/members">
                <Button variant="outline" size="sm" className="gap-2 text-xs rounded-xl border-white/15 text-white bg-white/5 hover:bg-[#E84A0C]">
                  <span>تصفح دليل الأعضاء حالياً</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link href="/articles">
                <Button size="sm" className="gap-2 text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md">
                  <span>تصفح منشورات بروميثيوس</span>
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      ) : (
        /* Application Form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6 sm:p-10 bg-[#0D1322]/85 backdrop-blur-xl border border-white/10 space-y-8 shadow-2xl rounded-2xl relative">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#E84A0C]" />
                  <span>استمارة طلب الانضمام للكادر</span>
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  يرجى ملء كافة الحقول بدقة لضمان معالجة طلبك وسرعة التواصل.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-[#E84A0C] bg-[#E84A0C]/10 px-3 py-1.5 rounded-xl border border-[#E84A0C]/30 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>استمارة معتمدة للتوظيف</span>
              </div>
            </div>

            {state?.error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="space-y-6 text-right font-sans">
              
              {/* Names Row (Arabic & English) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                    <span>الاسم الثلاثي باللغة العربية</span>
                    <span className="text-[#E84A0C]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    required
                    placeholder="مثال: د. محمد علي الحسني"
                    className="w-full h-11 px-4 bg-[#1A253B] border border-white/10 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E84A0C] shadow-sm transition-all duration-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                    <span>Full Name in English</span>
                    <span className="text-[#E84A0C]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    required
                    placeholder="e.g. Dr. Mohammed Ali Al-Hassani"
                    className="w-full h-11 px-4 bg-[#1A253B] border border-white/10 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E84A0C] font-mono shadow-sm transition-all duration-300"
                  />
                </div>

              </div>

              {/* Contact Info & Department Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#E84A0C]" />
                    <span>معلومات الاتصال (البريد الإلكتروني / رقم الهاتف)</span>
                    <span className="text-[#E84A0C]">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactInfo"
                    required
                    placeholder="مثال: name@domain.com / 07700000000"
                    className="w-full h-11 px-4 bg-[#1A253B] border border-white/10 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E84A0C] font-mono shadow-sm transition-all duration-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#E84A0C]" />
                    <span>القسم المطلوب الانضمام إليه</span>
                    <span className="text-[#E84A0C]">*</span>
                  </label>
                  <select
                    name="department"
                    required
                    className="w-full h-11 px-3 bg-[#1A253B] border border-white/10 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-[#E84A0C] shadow-sm transition-all duration-300"
                  >
                    <option value="الهندسة البرمجية">قسم الهندسة البرمجية والتطوير (Software Engineering)</option>
                    <option value="البحث العلمي">قسم البحث العلمي والتحليل (Scientific Research)</option>
                    <option value="التعليم والتطوير">قسم التعليم وصناعة المحتوى (Education & Content)</option>
                    <option value="الموارد البشرية والعمليات">قسم الموارد البشرية والعمليات (HR & Operations)</option>
                  </select>
                </div>

              </div>

              {/* Education Background */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#E84A0C]" />
                  <span>التحصيل الأكاديمي والجامعة/التخصص</span>
                  <span className="text-[#E84A0C]">*</span>
                </label>
                <input
                  type="text"
                  name="education"
                  required
                  placeholder="مثال: بكالوريوس علوم حاسوب - جامعة بغداد / مرحلة رابعة"
                  className="w-full h-11 px-4 bg-[#1A253B] border border-white/10 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E84A0C] shadow-sm transition-all duration-300"
                />
              </div>

              {/* Previous Experience */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#E84A0C]" />
                  <span>الخبرات السابقة والمهارات العملية</span>
                  <span className="text-[#E84A0C]">*</span>
                </label>
                <textarea
                  name="experience"
                  required
                  rows={3}
                  placeholder="اكتب نبذة عن خبراتك التقنية أو البحثية، اللغات البرمجية التي تتقنها، أو المشاريع السابقة..."
                  className="w-full p-4 bg-[#1A253B] border border-white/10 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E84A0C] leading-relaxed shadow-sm transition-all duration-300"
                />
              </div>

              {/* What do you know about Prometheus */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-[#E84A0C]" />
                  <span>ماذا تعرف عن فريق بروميثيوس ورسالته؟</span>
                  <span className="text-[#E84A0C]">*</span>
                </label>
                <textarea
                  name="aboutPrometheus"
                  required
                  rows={3}
                  placeholder="اكتب ما تعرفه عن رؤية الفريق وأهدافه الأكاديمية..."
                  className="w-full p-4 bg-[#1A253B] border border-white/10 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E84A0C] leading-relaxed shadow-sm transition-all duration-300"
                />
              </div>

              {/* Reason to join */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E84A0C]" />
                  <span>سبب الرغبة في الانضمام والأهداف الشخصية</span>
                  <span className="text-[#E84A0C]">*</span>
                </label>
                <textarea
                  name="reasonToJoin"
                  required
                  rows={3}
                  placeholder="كيف تنوي المساهمة في الفريق وما هي الأهداف التي ترغب بتحقيقها من خلال التطوع معنا؟"
                  className="w-full p-4 bg-[#1A253B] border border-white/10 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E84A0C] leading-relaxed shadow-sm transition-all duration-300"
                />
              </div>

              {/* Portfolio / Link (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#E84A0C]" />
                  <span>رابط معرض الأعمال / GitHub / LinkedIn / CV (اختياري)</span>
                </label>
                <input
                  type="url"
                  name="portfolioLink"
                  placeholder="https://github.com/your-username or https://linkedin.com/in/username"
                  className="w-full h-11 px-4 bg-[#1A253B] border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E84A0C] shadow-sm transition-all duration-300"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-stone-400 hidden sm:inline">
                  سياسة التوظيف المعتمدة لعام 2026
                </span>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="gap-2 px-8 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-lg transition-all duration-300"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري إرسال الطلب...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>إرسال طلب الانضمام</span>
                    </>
                  )}
                </Button>
              </div>

            </form>

          </Card>
        </motion.div>
      )}

    </div>
  );
}
