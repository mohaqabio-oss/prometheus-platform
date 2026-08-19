"use client";

import React, { useState, useActionState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { uploadImageToSupabase } from "@/lib/supabase/storage";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  Save,
  Send,
  AlertCircle,
  Loader2,
  Upload,
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

export function ArticleEditor({ article, saveAction }: ArticleEditorProps) {
  const [coverImageUrl, setCoverImageUrl] = useState<string>(article?.coverImage || "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInlineImg, setUploadingInlineImg] = useState(false);
  const [editorContent, setEditorContent] = useState<string>(article?.content || "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: article?.content || "<p>اكتب هنا نص المقالة الأكاديمي...</p>",
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
    <form action={formAction} className="space-y-6 text-white max-w-5xl mx-auto">
      {article?.id && <input type="hidden" name="id" value={article.id} />}

      {/* Error Banner */}
      {state?.error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-sans">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#6B7280]/20">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {article ? `تعديل المقالة: ${article.title}` : "محرر المقالات - WordPress Style Editor"}
          </h1>
          <p className="text-xs text-[#6B7280] mt-1 font-sans">
            محرر نصوص غني WYSIWYG متوافق مع معايير بروميثيوس التحريرية مع دعم الصور المباشرة.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            name="status"
            defaultValue={article?.status || "DRAFT"}
            className="h-10 px-3 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
          >
            <option value="DRAFT">مسودة (DRAFT)</option>
            <option value="PUBLISHED">نشر فوري (PUBLISHED)</option>
            <option value="SUBMITTED">تقديم للمراجعة (SUBMITTED)</option>
          </select>

          <Button
            type="submit"
            disabled={isPending}
            className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ المقالة</span>
          </Button>
        </div>
      </div>

      {/* WordPress Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Main Column: Title & Body */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* WordPress Title Input */}
          <div>
            <label className="block text-[#6B7280] font-bold text-xs uppercase tracking-wider mb-2">
              عنوان المقالة (Article Title) *
            </label>
            <input
              type="text"
              name="title"
              defaultValue={article?.title || ""}
              required
              placeholder="اكتب عنوان المقالة الهام هنا..."
              className="w-full h-14 px-4 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-2xl text-white font-display text-xl sm:text-2xl font-extrabold focus:outline-none focus:border-[#E84A0C]"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-[#6B7280] font-bold text-xs uppercase tracking-wider mb-2">
              الملخص والتكثيف التحريري (Excerpt)
            </label>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={article?.excerpt || ""}
              placeholder="ملخص قصير ومكثف يظهر في بطاقات المقالات والصفحة الرئيسية..."
              className="w-full p-3.5 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-2xl text-white font-sans text-xs focus:outline-none focus:border-[#E84A0C]"
            />
          </div>

          {/* WYSIWYG RICH TEXT EDITOR */}
          <div className="space-y-2">
            <label className="block text-[#6B7280] font-bold text-xs uppercase tracking-wider mb-2">
              محتوى المقالة (Rich Text WYSIWYG Content) *
            </label>

            <div className="border border-[#6B7280]/30 rounded-2xl overflow-hidden bg-[#0D0D0D]">
              
              {/* Toolbar */}
              <div className="p-2.5 bg-[#1A2B4A] border-b border-[#6B7280]/20 flex flex-wrap items-center gap-1.5 text-white">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive("bold") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="خط عريض Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive("italic") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="خط مائل Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-[#6B7280]/30 mx-1" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive("heading", { level: 1 }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="عنوان رئيسي H1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive("heading", { level: 2 }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="عنوان فرعي H2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive("heading", { level: 3 }) ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="عنوان فرعي H3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-[#6B7280]/30 mx-1" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive("bulletList") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="قائمة نقطية Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive("orderedList") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="قائمة رقمية Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded-lg transition-colors ${editor?.isActive("blockquote") ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}
                  title="اقتباس Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-[#6B7280]/30 mx-1" />

                {/* Inline Image Upload to 'magazine' bucket */}
                <label className="cursor-pointer p-2 rounded-lg hover:bg-[#0D0D0D] text-[#6B7280] hover:text-[#E84A0C] transition-colors inline-flex items-center gap-1">
                  {uploadingInlineImg ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  <span className="text-[11px] font-mono">إدراج صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInlineImageUpload}
                    className="hidden"
                    disabled={uploadingInlineImg}
                  />
                </label>
              </div>

              {/* Editor View */}
              <div className="p-4 min-h-[350px] font-sans text-sm text-white focus:outline-none leading-relaxed prose prose-invert max-w-none">
                <EditorContent editor={editor} />
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Settings & Cover Image */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Category Selector */}
          <div className="p-5 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4">
            <h3 className="font-display font-bold text-white text-sm">التصنيف الأكاديمي</h3>
            <select
              name="categoryName"
              defaultValue={article?.categoryName || "Technology"}
              className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
            >
              <option value="Technology">الهندسة البرمجية والذكاء الاصطناعي</option>
              <option value="Research">القرارات والبحوث العلمية</option>
              <option value="Education">التعليم والتطوير الذاتي</option>
            </select>
          </div>

          {/* Cover Image Upload to 'magazine' Bucket */}
          <div className="p-5 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4">
            <h3 className="font-display font-bold text-white text-sm">صورة الغلاف (Cover Image)</h3>

            {coverImageUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-[#6B7280]/30">
                <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#6B7280] font-mono text-xs">
                No Cover Selected
              </div>
            )}

            <label className="cursor-pointer w-full py-2.5 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-white hover:border-[#E84A0C] transition-all flex items-center justify-center gap-2 text-xs">
              {uploadingCover ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" />
                  <span>جاري الرفع إلى Supabase...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#E84A0C]" />
                  <span>رفع صورة الغلاف</span>
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

      </div>
    </form>
  );
}
