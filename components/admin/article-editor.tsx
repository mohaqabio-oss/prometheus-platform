"use client";

import React, { useState, useActionState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import ImageResize from "tiptap-extension-resize-image";
import { FontSize } from "@/lib/tiptap/font-size";
import { Button } from "@/components/ui/button";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  Save,
  AlertCircle,
  Loader2,
  Upload,
  Maximize2,
  Minimize2,
  Palette,
  Highlighter,
  Type,
} from "lucide-react";

export interface ArticleEditorProps {
  article?: {
    id: string;
    title: string;
    excerpt?: string;
    content: string;
    categoryName?: string;
    coverImage?: string;
    status?: string;
  } | null;
  saveAction: (prevState: any, formData: FormData) => Promise<any>;
}

const SUPPORTED_FONTS = [
  { name: "Tajawal (الافتراضي)", value: "Tajawal" },
  { name: "Cairo (القاهرة)", value: "Cairo" },
  { name: "Poppins", value: "Poppins" },
  { name: "Inter", value: "Inter" },
  { name: "Arial", value: "Arial" },
  { name: "Tahoma", value: "Tahoma" },
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

export function ArticleEditor({ article, saveAction }: ArticleEditorProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(article?.coverImage || "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInlineImg, setUploadingInlineImg] = useState(false);
  const [editorContent, setEditorContent] = useState<string>(article?.content || "");

  const [textColor, setTextColor] = useState("#FFFFFF");
  const [highlightColor, setHighlightColor] = useState("#E84A0C");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ImageResize.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: article?.content || "<p>اكتب هنا نص المقالة الأكاديمي والبحثي التخصصي...</p>",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    formData.set("content", editorContent || editor?.getHTML() || "");
    if (coverImageUrl) {
      formData.set("coverImage", coverImageUrl);
    }
    return await saveAction(prevState, formData);
  }, null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const publicUrl = await uploadImageToSupabase(file, "magazine");
      setCoverImageUrl(publicUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploadingInlineImg(true);
    try {
      const publicUrl = await uploadImageToSupabase(file, "magazine");
      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingInlineImg(false);
    }
  };

  return (
    <form action={formAction} className={`transition-all duration-300 text-white ${focusMode ? "fixed inset-0 z-50 bg-[#1A2B4A] p-4 sm:p-10 overflow-y-auto" : "max-w-7xl mx-auto space-y-6"}`}>
      {article?.id && <input type="hidden" name="id" value={article.id} />}

      {/* Error Banner */}
      {state?.error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-sans mb-4">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Header Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#6B7280]/20 bg-[#0D0D0D]/90 p-4 rounded-2xl border backdrop-blur-md sticky top-2 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFocusMode(!focusMode)}
            className="gap-2 text-xs rounded-xl border-[#6B7280]/30 text-white hover:text-[#E84A0C]"
            title={focusMode ? "خروج من وضع التركيز" : "تفعيل وضع التركيز التحريري"}
          >
            {focusMode ? <Minimize2 className="w-4 h-4 text-[#E84A0C]" /> : <Maximize2 className="w-4 h-4 text-[#E84A0C]" />}
            <span>{focusMode ? "إنهاء التركيز" : "وضع التركيز (Focus Mode)"}</span>
          </Button>

          <span className="text-xs text-[#6B7280] font-mono hidden md:inline">
            Prometheus CMS Pro Editor v2.0
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
            type="submit"
            disabled={isPending}
            className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md px-5"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ المقالة</span>
          </Button>
        </div>
      </div>

      {/* Main Wide Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        
        {/* Main Editor Column */}
        <div className={`${focusMode ? "lg:col-span-12 max-w-5xl mx-auto w-full" : "lg:col-span-8"} space-y-6`}>
          
          {/* Seamless Massive Title Input */}
          <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-[#6B7280]/20 shadow-xl">
            <input
              type="text"
              name="title"
              defaultValue={article?.title || ""}
              required
              placeholder="اكتب عنوان المقالة الأكاديمية هنا..."
              className="w-full bg-transparent border-none text-white font-display text-2xl sm:text-4xl font-extrabold focus:outline-none placeholder-[#6B7280]"
            />
            
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={article?.excerpt || ""}
              placeholder="اكتب ملخص المقالة المكثف هنا..."
              className="w-full bg-transparent border-none text-[#6B7280] font-sans text-sm focus:outline-none mt-3 placeholder-[#6B7280]/60 resize-none"
            />
          </div>

          {/* STICKY PRO RICH TEXT EDITOR TOOLBAR & CANVAS */}
          <div className="border border-[#6B7280]/20 rounded-2xl overflow-hidden bg-[#0D0D0D] shadow-2xl">
            
            {/* Sticky Professional Formatting Toolbar */}
            <div className="p-3 bg-[#1A2B4A] border-b border-[#6B7280]/20 sticky top-16 z-30 flex flex-wrap items-center gap-2 text-white">
              
              {/* Font Family Selector */}
              <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl px-2 py-1">
                <Type className="w-3.5 h-3.5 text-[#E84A0C]" />
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      editor?.chain().focus().setFontFamily(e.target.value).run();
                    } else {
                      editor?.chain().focus().unsetFontFamily().run();
                    }
                  }}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-[#0D0D0D] text-white">اختر الخط (Font)</option>
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
                    if (e.target.value) {
                      editor?.chain().focus().setFontSize(e.target.value).run();
                    } else {
                      editor?.chain().focus().unsetFontSize().run();
                    }
                  }}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-[#0D0D0D] text-white">حجم الخط (Size)</option>
                  {FONT_SIZES.map((s) => (
                    <option key={s.value} value={s.value} className="bg-[#0D0D0D] text-white">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Text Formatting Tools */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("bold") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="Bold (عريض)"
                >
                  <Bold className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("italic") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="Italic (مائل)"
                >
                  <Italic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("underline") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="Underline (تحته خط)"
                >
                  <UnderlineIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("strike") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="Strikethrough (يتوسطه خط)"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Headings */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setParagraph().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("paragraph") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="فقرة عادية"
                >
                  <Pilcrow className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("heading", { level: 1 }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="عنوان رئيسي H1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("heading", { level: 2 }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="عنوان فرعي H2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("heading", { level: 3 }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="عنوان H3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("heading", { level: 4 }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="عنوان H4"
                >
                  <Heading4 className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Text Alignment */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive({ textAlign: "right" }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="محاذاة لليمين"
                >
                  <AlignRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive({ textAlign: "center" }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="محاذاة للوسط"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive({ textAlign: "left" }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="محاذاة لليسار"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive({ textAlign: "justify" }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="ضبط المحاذاة Justify"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Color Pickers */}
              <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl px-2 py-1">
                {/* Text Color */}
                <label className="cursor-pointer flex items-center gap-1" title="لون النص (Text Color)">
                  <Palette className="w-3.5 h-3.5 text-[#E84A0C]" />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      editor?.chain().focus().setColor(e.target.value).run();
                    }}
                    className="w-4 h-4 bg-transparent border-none cursor-pointer p-0"
                  />
                </label>

                {/* Highlight Color */}
                <label className="cursor-pointer flex items-center gap-1 border-r border-[#6B7280]/30 pr-2" title="تظليل النص (Background Highlight)">
                  <Highlighter className="w-3.5 h-3.5 text-[#F5A623]" />
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={(e) => {
                      setHighlightColor(e.target.value);
                      editor?.chain().focus().toggleHighlight({ color: e.target.value }).run();
                    }}
                    className="w-4 h-4 bg-transparent border-none cursor-pointer p-0"
                  />
                </label>
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Lists & Quotes */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("bulletList") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="قائمة نقطية"
                >
                  <List className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("orderedList") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="قائمة رقمية"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`p-1.5 rounded-lg transition-colors ${editor?.isActive("blockquote") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="اقتباس مخصص"
                >
                  <Quote className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

              {/* Resizable Inline Image Upload */}
              <label className="cursor-pointer p-1.5 rounded-lg hover:bg-[#0D0D0D] text-[#6B7280] hover:text-[#E84A0C] transition-colors flex items-center gap-1">
                {uploadingInlineImg ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-[#E84A0C]" />
                )}
                <span className="text-xs font-mono font-bold">إدراج صورة قابلة للتعديل</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInlineImageUpload}
                  className="hidden"
                  disabled={uploadingInlineImg}
                />
              </label>

            </div>

            {/* Writer Viewport */}
            <div className="p-6 sm:p-10 min-h-[480px] font-sans text-base sm:text-lg text-white focus:outline-none leading-relaxed prose prose-invert max-w-none [&_img]:rounded-xl [&_img]:border [&_img]:border-[#6B7280]/20 [&_img]:my-4">
              <EditorContent editor={editor} />
            </div>

          </div>

        </div>

        {/* Sidebar Controls (Hidden in Focus Mode) */}
        {!focusMode && (
          <div className="lg:col-span-4 space-y-6">
            
            {/* Academic Category Selector */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-display font-bold text-white text-base">التصنيف الأكاديمي</h3>
              <input
                type="text"
                name="categoryName"
                defaultValue={article?.categoryName || ""}
                placeholder="اكتب اسم التصنيف (مثال: الذكاء الاصطناعي)"
                className="w-full h-11 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
              />
            </div>

            {/* Cover Image Upload to 'magazine' Bucket */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-display font-bold text-white text-base">صورة الغلاف (Cover Image)</h3>

              {coverImageUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-[#6B7280]/30">
                  <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#6B7280] font-mono text-xs">
                  لم يتم اختيار صورة غلاف
                </div>
              )}

              <label className="cursor-pointer w-full py-3 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-white hover:border-[#E84A0C] transition-all flex items-center justify-center gap-2 text-xs font-semibold">
                {uploadingCover ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" />
                    <span>جاري الرفع إلى Supabase...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#E84A0C]" />
                    <span>رفع صورة الغلاف من الجهاز</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                  disabled={uploadingCover}
                />
              </label>
            </div>

          </div>
        )}

      </div>
    </form>
  );
}
