"use client";

import React, { useState, useActionState } from "react";
import { updateJournalSettingAction, JournalSettingRecord } from "@/app/actions/journal-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Heading,
  List,
  Bold,
  FileText,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface JournalEthicsEditorProps {
  initialSetting: JournalSettingRecord;
}

export function JournalEthicsEditor({ initialSetting }: JournalEthicsEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState(initialSetting.title);
  const [content, setContent] = useState(initialSetting.content);

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      formData.set("key", "publication_ethics");
      formData.set("title", title);
      formData.set("content", content);
      return await updateJournalSettingAction(prevState, formData);
    },
    null
  );

  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("ethics-content-area") as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || "نص هنا"}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  return (
    <div className="space-y-6">
      {/* Alert banner on success / error */}
      {state?.success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between font-sans">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{state.message || "تم حفظ سياسات وأخلاقيات النشر بنجاح."}</span>
          </div>
          <Link
            href="/PtPost/publication-ethics"
            target="_blank"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] underline hover:text-white"
          >
            <span>عرض الصفحة العامة</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {state?.error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-sans">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Title Input Card */}
        <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-3 shadow-md">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#6B7280]">
            عنوان ميثاق وسياسات النشر الأكاديمي (Title)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="مثال: أخلاقيات النشر والمعايير الأكاديمية والنزاهة العلمية"
            className="w-full h-11 px-4 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-[#E84A0C] transition-all"
          />
        </Card>

        {/* Content Editor Card with Tabs & Toolbar */}
        <Card className="p-0 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl overflow-hidden shadow-xl">
          {/* Editor Header Toolbar */}
          <div className="p-3 bg-[#1A2B4A] border-b border-[#6B7280]/20 flex flex-wrap items-center justify-between gap-3">
            {/* View Tabs */}
            <div className="flex items-center gap-1 bg-[#0D0D0D]/60 p-1 rounded-xl border border-[#6B7280]/20">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === "edit"
                    ? "bg-[#E84A0C] text-white shadow-sm"
                    : "text-[#6B7280] hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>التحرير</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === "preview"
                    ? "bg-[#E84A0C] text-white shadow-sm"
                    : "text-[#6B7280] hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>معاينة حية</span>
              </button>
            </div>

            {/* Markdown Quick Formatting Tools (Only active in Edit mode) */}
            {activeTab === "edit" && (
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting("## ", "")}
                  className="h-8 px-2 text-xs text-[#6B7280] hover:text-white"
                  title="عنوان رئيسي (H2)"
                >
                  <Heading className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting("**", "**")}
                  className="h-8 px-2 text-xs text-[#6B7280] hover:text-white"
                  title="نص عريض (Bold)"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting("- ", "")}
                  className="h-8 px-2 text-xs text-[#6B7280] hover:text-white"
                  title="قائمة نقطية (Bullet List)"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Quick Link to public page */}
            <Link
              href="/PtPost/publication-ethics"
              target="_blank"
              className="text-[11px] font-mono text-[#E84A0C] hover:underline flex items-center gap-1 ms-auto"
            >
              <span>معاينة في الموقع /PtPost</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Editor Body */}
          <div className="p-6">
            {activeTab === "edit" ? (
              <div className="space-y-2">
                <textarea
                  id="ethics-content-area"
                  rows={20}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="أدخل ميثاق أخلاقيات النشر والمعايير الأكاديمية بنظام Markdown..."
                  className="w-full p-4 bg-[#080C16] border border-[#6B7280]/20 rounded-xl text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-[#E84A0C] transition-all resize-y"
                  dir="rtl"
                />
                <p className="text-[11px] text-[#6B7280] font-mono">
                  يدعم التحرير صياغة Markdown: العناوين (##)، القوائم النقطية (-)، والنصوص العريضة (**نص**).
                </p>
              </div>
            ) : (
              <div className="p-6 bg-[#080C16] border border-[#6B7280]/20 rounded-xl min-h-[400px] space-y-6 text-white text-xs leading-relaxed font-sans" dir="rtl">
                <h1 className="font-display text-xl font-bold text-white border-b border-[#6B7280]/20 pb-4">
                  {title}
                </h1>
                <div className="space-y-4 whitespace-pre-wrap font-sans text-stone-300">
                  {content}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-[#1A2B4A]/50 border-t border-[#6B7280]/20 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#6B7280]">
              آخر تحديث: {new Date(initialSetting.updatedAt).toLocaleString("ar-SA")}
            </span>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#E84A0C] hover:bg-[#D03E06] text-white gap-2 rounded-xl px-6 shadow-lg font-sans"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ سياسات النشر</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
