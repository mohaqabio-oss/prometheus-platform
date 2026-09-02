"use client";

import React, { useState, useEffect, useActionState } from "react";
import { useEditor, EditorContent, Node, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import TipTapImage from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { FontSize } from "@/lib/tiptap/font-size";
import { Button } from "@/components/ui/button";
import { getMembersForSelectAction, ArticleAuthor } from "@/app/actions/article-actions";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Heading4, Pilcrow,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, ImageIcon, Save, AlertCircle,
  Loader2, Upload, Maximize2, Minimize2, Palette, Highlighter,
  Type, Users, Check, FileText, BookOpen, Info, AlertTriangle,
  Lightbulb, Plus, Trash2, Link2, BookMarked,
} from "lucide-react";

// ── Custom Callout TipTap Node ────────────────────────────────────────────────
const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  content: "inline*",
  defining: true,
  addAttributes() {
    return {
      type: { default: "info" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-callout]" }];
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-callout": node.attrs.type,
        class: `tiptap-callout ${node.attrs.type}`,
      }),
      0,
    ];
  },
});

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ArticleEditorProps {
  article?: {
    id: string;
    title: string;
    excerpt?: string;
    content: string;
    categoryName?: string;
    coverImage?: string;
    status?: string;
    type?: string;
    authors?: ArticleAuthor[];
    sources?: string[];
  } | null;
  availableMembers?: ArticleAuthor[];
  saveAction: (prevState: any, formData: FormData) => Promise<any>;
}

const SUPPORTED_FONTS = [
  { name: "Tajawal (الافتراضي)", value: "Tajawal" },
  { name: "Cairo (القاهرة)", value: "Cairo" },
  { name: "Almarai (الأمراء)", value: "Almarai" },
  { name: "Amiri (الأميري - أكاديمي)", value: "Amiri" },
  { name: "IBM Plex Sans Arabic", value: "IBM Plex Sans Arabic" },
  { name: "Inter (English)", value: "Inter" },
  { name: "Roboto (English)", value: "Roboto" },
  { name: "Merriweather (Serif)", value: "Merriweather" },
  { name: "Playfair Display (Elegant)", value: "Playfair Display" },
  { name: "Fira Code (Code)", value: "Fira Code" },
  { name: "Arial", value: "Arial" },
  { name: "Times New Roman", value: "Times New Roman" },
];

const FONT_SIZES = [
  { label: "12px (صغير جداً)", value: "12px" },
  { label: "14px (صغير)", value: "14px" },
  { label: "16px (عادي)", value: "16px" },
  { label: "18px (كبير)", value: "18px" },
  { label: "20px (عريض)", value: "20px" },
  { label: "24px (عنوان فرعي)", value: "24px" },
  { label: "30px (عنوان كبير)", value: "30px" },
  { label: "36px (عنوان رئيسي)", value: "36px" },
];

const CALLOUT_TYPES = [
  { value: "info", label: "معلومة", icon: Info, color: "text-blue-400" },
  { value: "warning", label: "تحذير", icon: AlertTriangle, color: "text-yellow-400" },
  { value: "success", label: "نجاح", icon: Check, color: "text-emerald-400" },
  { value: "danger", label: "خطر", icon: AlertCircle, color: "text-red-400" },
];

// ─────────────────────────────────────────────────────────────────────────────
export function ArticleEditor({ article, availableMembers = [], saveAction }: ArticleEditorProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(article?.coverImage || "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInlineImg, setUploadingInlineImg] = useState(false);
  const [editorContent, setEditorContent] = useState<string>(article?.content || "");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [highlightColor, setHighlightColor] = useState("#E84A0C");
  const [articleType, setArticleType] = useState<"BLOG" | "ACADEMIC">(
    (article?.type as "BLOG" | "ACADEMIC") || "BLOG"
  );

  // Sources state
  const [sources, setSources] = useState<string[]>(article?.sources || [""]);

  // Multi-Author Selection State
  const [membersList, setMembersList] = useState<ArticleAuthor[]>(availableMembers);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(() => {
    if (article?.authors && article.authors.length > 0) {
      return article.authors.map((a) => a.id);
    }
    return [];
  });

  useEffect(() => {
    if (membersList.length === 0) {
      async function loadMembers() {
        const data = await getMembersForSelectAction();
        setMembersList(data || []);
      }
      loadMembers();
    }
  }, [membersList.length]);

  const toggleAuthorSelection = (authorId: string) => {
    setSelectedAuthorIds((prev) =>
      prev.includes(authorId)
        ? prev.filter((id) => id !== authorId)
        : [...prev, authorId]
    );
  };

  const addSource = () => setSources((prev) => [...prev, ""]);
  const removeSource = (i: number) => setSources((prev) => prev.filter((_, idx) => idx !== i));
  const updateSource = (i: number, val: string) =>
    setSources((prev) => prev.map((s, idx) => (idx === i ? val : s)));

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      TipTapImage.configure({ inline: true, allowBase64: true }),
      ImageResize.configure({ inline: true, allowBase64: true }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CalloutNode,
    ],
    content: article?.content || "<p>اكتب هنا نص المقالة أو البحث الأكاديمي التخصصي...</p>",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    formData.set("content", editorContent || editor?.getHTML() || "");
    if (coverImageUrl) formData.set("coverImage", coverImageUrl);
    formData.set("type", articleType);
    formData.set("authorIds", JSON.stringify(selectedAuthorIds));
    const cleanSources = sources.filter((s) => s.trim() !== "");
    formData.set("sources", JSON.stringify(cleanSources));
    return await saveAction(prevState, formData);
  }, null);

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setUploadError(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, signal: controller.signal });
      clearTimeout(timeoutId);
      let data: any = {};
      try { data = await res.json(); } catch { throw new Error("استجابة الخادم غير صالحة عند رفع صورة الغلاف"); }
      if (!res.ok || data.error) throw new Error(data.error || "فشل رفع صورة الغلاف على الخادم");
      setCoverImageUrl(data.url);
    } catch (err: any) {
      clearTimeout(timeoutId);
      const msg = err.name === "AbortError"
        ? "انتهت مهلة طلب رفع صورة الغلاف."
        : (err.message || "فشل رفع صورة الغلاف إلى الخادم.");
      setUploadError(msg);
    } finally { setUploadingCover(false); e.target.value = ""; }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploadingInlineImg(true);
    setUploadError(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, signal: controller.signal });
      clearTimeout(timeoutId);
      let data: any = {};
      try { data = await res.json(); } catch { throw new Error("استجابة الخادم غير صالحة عند رفع الصورة"); }
      if (!res.ok || data.error) throw new Error(data.error || "فشل رفع الصورة على الخادم");
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err: any) {
      clearTimeout(timeoutId);
      const msg = err.name === "AbortError"
        ? "انتهت مهلة طلب رفع الصورة."
        : (err.message || "فشل رفع الصورة إلى الخادم.");
      setUploadError(msg);
    } finally { setUploadingInlineImg(false); e.target.value = ""; }
  };

  const insertCallout = (type: string) => {
    editor?.chain().focus().insertContent({
      type: "callout",
      attrs: { type },
      content: [{ type: "text", text: `مربع ${CALLOUT_TYPES.find(c => c.value === type)?.label || "معلومة"}: اكتب هنا...` }],
    }).run();
  };

  return (
    <form action={formAction} className={`transition-all duration-300 text-white ${focusMode ? "fixed inset-0 z-50 bg-[#1A2B4A] p-4 sm:p-8 overflow-y-auto" : "max-w-7xl mx-auto space-y-6"}`}>
      {article?.id && <input type="hidden" name="id" value={article.id} />}
      <input type="hidden" name="type" value={articleType} />
      <input type="hidden" name="authorIds" value={JSON.stringify(selectedAuthorIds)} />

      {/* Error Banner */}
      {(state?.error || uploadError) && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-sans mb-4">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{uploadError || state?.error}</span>
        </div>
      )}

      {/* Header Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#6B7280]/20 bg-[#0D0D0D]/90 p-4 rounded-2xl border backdrop-blur-md sticky top-2 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <Button
            type="button" variant="outline" size="sm"
            onClick={() => setFocusMode(!focusMode)}
            className="gap-2 text-xs rounded-xl border-[#6B7280]/30 text-white hover:text-[#E84A0C]"
          >
            {focusMode ? <Minimize2 className="w-4 h-4 text-[#E84A0C]" /> : <Maximize2 className="w-4 h-4 text-[#E84A0C]" />}
            <span>{focusMode ? "إنهاء التركيز" : "وضع معالج المستندات (Word Mode)"}</span>
          </Button>
          <span className="text-xs text-[#6B7280] font-fira hidden md:inline">
            Prometheus Academic Writer v4.0
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            name="status"
            defaultValue={article?.status || "DRAFT"}
            className="h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
          >
            <option value="DRAFT">مسودة (DRAFT)</option>
            <option value="PUBLISHED">نشر فوري (PUBLISHED)</option>
            <option value="SUBMITTED">تقديم للمراجعة (SUBMITTED)</option>
          </select>
          <Button
            type="submit" disabled={isPending}
            className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md px-6 font-bold text-xs"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ المستند والمقالة</span>
          </Button>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">

        {/* Main Editor Column */}
        <div className={`${focusMode ? "lg:col-span-12 max-w-5xl mx-auto w-full" : "lg:col-span-8"} space-y-6`}>

          {/* Article Title Header Box */}
          <div className="bg-[#0D0D0D] p-6 sm:p-8 rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-fira text-[#E84A0C]">
              <FileText className="w-4 h-4" />
              <span>عنوان المستند الورقي</span>
            </div>
            <input
              type="text" name="title"
              defaultValue={article?.title || ""} required
              placeholder="اكتب عنوان المقالة أو البحث الأكاديمي هنا..."
              className="w-full bg-transparent border-none text-white font-cairo text-2xl sm:text-4xl font-extrabold focus:outline-none placeholder-[#6B7280]"
            />
            <textarea
              name="excerpt" rows={2}
              defaultValue={article?.excerpt || ""}
              placeholder="اكتب ملخص المستند أو المراجعة العلمية هنا..."
              className="w-full bg-transparent border-none text-[#6B7280] font-sans text-sm focus:outline-none pt-2 border-t border-[#6B7280]/20 placeholder-[#6B7280]/60 resize-none"
            />
          </div>

          {/* WORD PROCESSOR EDITOR CONTAINER */}
          <div className="border border-[#6B7280]/20 rounded-2xl overflow-hidden bg-[#0D0D0D] shadow-2xl">

            {/* STICKY TOP TOOLBAR */}
            <div className="p-3 bg-[#1A2B4A] border-b border-[#6B7280]/20 sticky top-16 z-30 flex flex-wrap items-center gap-2 text-white shadow-md">

              {/* Font Family Selector */}
              <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl px-2 py-1">
                <Type className="w-3.5 h-3.5 text-[#E84A0C]" />
                <select
                  onChange={(e) => {
                    if (e.target.value) editor?.chain().focus().setFontFamily(e.target.value).run();
                    else editor?.chain().focus().unsetFontFamily().run();
                  }}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-sans"
                >
                  <option value="" className="bg-[#0D0D0D] text-white">نوع الخط (Font)</option>
                  {SUPPORTED_FONTS.map((f) => (
                    <option key={f.value} value={f.value} className="bg-[#0D0D0D] text-white" style={{ fontFamily: f.value }}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl px-2 py-1">
                <select
                  onChange={(e) => {
                    if (e.target.value) editor?.chain().focus().setFontSize(e.target.value).run();
                    else editor?.chain().focus().unsetFontSize().run();
                  }}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-fira"
                >
                  <option value="" className="bg-[#0D0D0D] text-white">حجم الخط</option>
                  {FONT_SIZES.map((s) => (
                    <option key={s.value} value={s.value} className="bg-[#0D0D0D] text-white">{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                {[
                  { action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold"), icon: <Bold className="w-4 h-4" />, title: "Bold" },
                  { action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic"), icon: <Italic className="w-4 h-4" />, title: "Italic" },
                  { action: () => editor?.chain().focus().toggleUnderline().run(), active: editor?.isActive("underline"), icon: <UnderlineIcon className="w-4 h-4" />, title: "Underline" },
                  { action: () => editor?.chain().focus().toggleStrike().run(), active: editor?.isActive("strike"), icon: <Strikethrough className="w-4 h-4" />, title: "Strike" },
                ].map((btn, i) => (
                  <button key={i} type="button" onClick={btn.action} title={btn.title}
                    className={`p-1.5 rounded-lg transition-colors ${btn.active ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}>
                    {btn.icon}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Headings */}
              <div className="flex items-center gap-1">
                {[
                  { action: () => editor?.chain().focus().setParagraph().run(), active: editor?.isActive("paragraph"), icon: <Pilcrow className="w-4 h-4" /> },
                  { action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), active: editor?.isActive("heading", { level: 1 }), icon: <Heading1 className="w-4 h-4" /> },
                  { action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }), icon: <Heading2 className="w-4 h-4" /> },
                  { action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive("heading", { level: 3 }), icon: <Heading3 className="w-4 h-4" /> },
                  { action: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(), active: editor?.isActive("heading", { level: 4 }), icon: <Heading4 className="w-4 h-4" /> },
                ].map((btn, i) => (
                  <button key={i} type="button" onClick={btn.action}
                    className={`p-1.5 rounded-lg transition-colors ${btn.active ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}>
                    {btn.icon}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Alignment */}
              <div className="flex items-center gap-1">
                {[
                  { align: "right", icon: <AlignRight className="w-4 h-4" /> },
                  { align: "center", icon: <AlignCenter className="w-4 h-4" /> },
                  { align: "left", icon: <AlignLeft className="w-4 h-4" /> },
                  { align: "justify", icon: <AlignJustify className="w-4 h-4" /> },
                ].map((btn) => (
                  <button key={btn.align} type="button"
                    onClick={() => editor?.chain().focus().setTextAlign(btn.align).run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor?.isActive({ textAlign: btn.align }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}>
                    {btn.icon}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Color Pickers */}
              <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl px-2 py-1">
                <label className="cursor-pointer flex items-center gap-1" title="لون النص">
                  <Palette className="w-3.5 h-3.5 text-[#E84A0C]" />
                  <input type="color" value={textColor}
                    onChange={(e) => { setTextColor(e.target.value); editor?.chain().focus().setColor(e.target.value).run(); }}
                    className="w-4 h-4 bg-transparent border-none cursor-pointer p-0"
                  />
                </label>
                <label className="cursor-pointer flex items-center gap-1 border-r border-[#6B7280]/30 pr-2" title="تظليل النص">
                  <Highlighter className="w-3.5 h-3.5 text-[#F5A623]" />
                  <input type="color" value={highlightColor}
                    onChange={(e) => { setHighlightColor(e.target.value); editor?.chain().focus().toggleHighlight({ color: e.target.value }).run(); }}
                    className="w-4 h-4 bg-transparent border-none cursor-pointer p-0"
                  />
                </label>
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Lists & Quotes */}
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("bulletList") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}>
                  <List className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("orderedList") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}>
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("blockquote") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}>
                  <Quote className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Callout Inserter */}
              <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl px-2 py-1">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                <select
                  onChange={(e) => { if (e.target.value) { insertCallout(e.target.value); (e.target as HTMLSelectElement).value = ""; } }}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-sans"
                >
                  <option value="">إدراج صندوق</option>
                  {CALLOUT_TYPES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#0D0D0D] text-white">{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Inline Image Upload */}
              <label className="cursor-pointer p-1.5 rounded-lg hover:bg-[#0D0D0D] text-[#6B7280] hover:text-[#E84A0C] transition-colors flex items-center gap-1 border border-[#6B7280]/30 bg-[#0D0D0D]">
                {uploadingInlineImg ? <Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" /> : <ImageIcon className="w-4 h-4 text-[#E84A0C]" />}
                <span className="text-xs font-fira font-bold">إدراج صورة</span>
                <input type="file" accept="image/*" onChange={handleInlineImageUpload} className="hidden" disabled={uploadingInlineImg} />
              </label>
            </div>

            {/* EDITOR CANVAS */}
            <div className="p-4 sm:p-8 bg-[#121A2B]/80 flex justify-center overflow-x-auto min-h-[750px]">
              <div className="w-full max-w-4xl bg-[#0D0D0D] border border-[#6B7280]/30 rounded-2xl p-8 sm:p-12 shadow-2xl min-h-[700px] text-white font-sans text-base sm:text-lg leading-relaxed focus:outline-none prose prose-invert max-w-none [&_img]:rounded-xl [&_img]:border [&_img]:border-[#6B7280]/30 [&_img]:my-6">
                <EditorContent editor={editor} />
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar Controls */}
        {!focusMode && (
          <div className="lg:col-span-4 space-y-6">

            {/* PUBLICATION TYPE SELECTOR */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
                <BookOpen className="w-4 h-4 text-[#E84A0C]" />
                <h3 className="font-cairo font-bold text-white text-base">نوع المنشور</h3>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { value: "BLOG", label: "مدونة عامة (Blog)", sub: "للمقالات، التدوينات العامة، والأخبار التطوعية." },
                  { value: "ACADEMIC", label: "مجلة أكاديمية محكمة", sub: "للبحوث العلمية والدراسات التخصصية." },
                ].map((opt) => (
                  <div key={opt.value} onClick={() => setArticleType(opt.value as any)}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all duration-200 ${
                      articleType === opt.value
                        ? "bg-[#1A2B4A] border-[#E84A0C] text-white shadow-md ring-1 ring-[#E84A0C]"
                        : "bg-[#1A2B4A]/30 border-[#6B7280]/20 text-[#6B7280] hover:text-white hover:border-[#6B7280]/40"
                    }`}>
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center border text-[10px] shrink-0 ${articleType === opt.value ? "bg-[#E84A0C] border-[#E84A0C] text-white" : "border-[#6B7280]/40"}`}>
                      {articleType === opt.value && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{opt.label}</p>
                      <p className="text-[11px] text-[#6B7280] mt-1 font-sans">{opt.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MULTI-AUTHOR ATTRIBUTION */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
                <Users className="w-4 h-4 text-[#E84A0C]" />
                <h3 className="font-cairo font-bold text-white text-base">المؤلفون والمشاركون</h3>
              </div>
              <p className="text-xs text-[#6B7280]">اختر مؤلفاً واحداً أو أكثر من كادر الفريق.</p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {membersList.length === 0 ? (
                  <p className="text-xs text-[#6B7280] font-fira">جاري تحميل دليل الكادر...</p>
                ) : (
                  membersList.map((member) => {
                    const isSelected = selectedAuthorIds.includes(member.id);
                    return (
                      <div key={member.id} onClick={() => toggleAuthorSelection(member.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                          isSelected ? "bg-[#1A2B4A] border-[#E84A0C] text-white shadow-sm" : "bg-[#1A2B4A]/30 border-[#6B7280]/20 text-[#6B7280] hover:text-white"
                        }`}>
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${isSelected ? "bg-[#E84A0C] border-[#E84A0C] text-white" : "border-[#6B7280]/40"}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-none">{member.name}</p>
                            <p className="text-[10px] font-fira text-[#6B7280] mt-1">{member.title} ({member.department})</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* SOURCES & REFERENCES PANEL */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-[#D49B4B]" />
                  <h3 className="font-cairo font-bold text-white text-base">المصادر والمراجع</h3>
                </div>
                <button type="button" onClick={addSource}
                  className="p-1.5 rounded-lg bg-[#D49B4B]/10 hover:bg-[#D49B4B]/20 text-[#D49B4B] transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-[#6B7280] font-amiri italic">
                أضف المصادر العلمية والمراجع — ستظهر في صندوق رسمي أسفل المقالة المنشورة.
              </p>
              <div className="space-y-2">
                {sources.map((src, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] font-fira text-[#6B7280] w-5 text-center shrink-0">{i + 1}</span>
                    <input
                      type="text" value={src}
                      onChange={(e) => updateSource(i, e.target.value)}
                      placeholder="رابط المرجع أو الاقتباس الأكاديمي..."
                      className="flex-1 h-9 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-lg text-xs text-white font-ibm placeholder-[#6B7280]/60 focus:outline-none focus:border-[#D49B4B]"
                    />
                    {sources.length > 1 && (
                      <button type="button" onClick={() => removeSource(i)}
                        className="p-1.5 rounded-lg text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addSource}
                className="w-full py-2 rounded-lg border border-dashed border-[#6B7280]/30 text-[#6B7280] hover:text-[#D49B4B] hover:border-[#D49B4B]/40 text-xs font-cairo flex items-center justify-center gap-1.5 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                إضافة مرجع آخر
              </button>
            </div>

            {/* CATEGORY SELECTOR */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-cairo font-bold text-white text-base">التصنيف الأكاديمي</h3>
              <input type="text" name="categoryName"
                defaultValue={article?.categoryName || ""}
                placeholder="اسم التصنيف (مثال: الهندسة البرمجية)"
                className="w-full h-11 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
              />
            </div>

            {/* COVER IMAGE UPLOAD */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-cairo font-bold text-white text-base">صورة الغلاف</h3>
              {coverImageUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-[#6B7280]/30">
                  <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#6B7280] font-fira text-xs">
                  لم يتم اختيار صورة غلاف
                </div>
              )}
              <label className="cursor-pointer w-full py-3 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-white hover:border-[#E84A0C] transition-all flex items-center justify-center gap-2 text-xs font-semibold">
                {uploadingCover ? (
                  <><Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" /><span>جاري الرفع...</span></>
                ) : (
                  <><Upload className="w-4 h-4 text-[#E84A0C]" /><span>رفع صورة الغلاف</span></>
                )}
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
              </label>
            </div>

          </div>
        )}
      </div>
    </form>
  );
}
