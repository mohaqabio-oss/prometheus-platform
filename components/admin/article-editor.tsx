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
import { getMembersForSelectAction, getPartnersForSelectAction, ArticleAuthor } from "@/app/actions/article-actions";
import { PartnerMultiSelect } from "@/components/admin/partner-multi-select";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Heading4, Pilcrow,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, ImageIcon, Save, AlertCircle,
  Loader2, Upload, Maximize2, Minimize2, Palette, Highlighter,
  Type, Users, Check, FileText, BookOpen, Info, AlertTriangle,
  Lightbulb, Plus, Trash2, BookMarked, Building2, UserPlus,
} from "lucide-react";

const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  content: "inline*",
  defining: true,
  addAttributes() { return { type: { default: "info" } }; },
  parseHTML() { return [{ tag: "div[data-callout]" }]; },
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

export interface PartnerSelectOption {
  id: string;
  name: string;
  logoUrl: string;
}

export interface MemberRole {
  memberId: string;
  roleName: string;
}

export interface PartnerRole {
  partnerId: string;
  roleName: string;
}

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
    memberRoles?: MemberRole[];
    sources?: string[];
    guestAuthors?: string[];
    partners?: { id: string; name: string; logoUrl: string; roleName?: string }[];
  } | null;
  availableMembers?: ArticleAuthor[];
  availablePartners?: PartnerSelectOption[];
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
  { value: "info", label: "معلومة", icon: Info },
  { value: "warning", label: "تحذير", icon: AlertTriangle },
  { value: "success", label: "نجاح", icon: Check },
  { value: "danger", label: "خطر", icon: AlertCircle },
];

export function ArticleEditor({ article, availableMembers = [], availablePartners = [], saveAction }: ArticleEditorProps) {
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

  const [sources, setSources] = useState<string[]>(article?.sources || [""]);
  const [guestAuthors, setGuestAuthors] = useState<string[]>(
    article?.guestAuthors && article.guestAuthors.length > 0 ? article.guestAuthors : [""]
  );

  const [partnersList, setPartnersList] = useState<PartnerSelectOption[]>(availablePartners);
  const [partnerRoles, setPartnerRoles] = useState<PartnerRole[]>(
    article?.partners?.map((p: any) => ({ partnerId: p.id || p.partnerId, roleName: p.roleName || "شريك إعلامي" })) || []
  );

  const [membersList, setMembersList] = useState<ArticleAuthor[]>(availableMembers);
  const [authorRoles, setAuthorRoles] = useState<MemberRole[]>(() => {
    if (article?.memberRoles && article.memberRoles.length > 0) {
      return article.memberRoles;
    }
    if (article?.authors && article.authors.length > 0) {
      return article.authors.map((a) => ({ memberId: a.id, roleName: a.roleName || "مؤلف مشارك" }));
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

  useEffect(() => {
    if (partnersList.length === 0) {
      async function loadPartners() {
        const data = await getPartnersForSelectAction();
        setPartnersList(data || []);
      }
      loadPartners();
    }
  }, [partnersList.length]);

  const toggleAuthorSelection = (memberId: string) => {
    setAuthorRoles((prev) => {
      const exist = prev.find((ar) => ar.memberId === memberId);
      if (exist) return prev.filter((ar) => ar.memberId !== memberId);
      return [...prev, { memberId, roleName: "مؤلف مشارك" }];
    });
  };

  const updateAuthorRoleName = (memberId: string, roleName: string) => {
    setAuthorRoles((prev) =>
      prev.map((ar) => (ar.memberId === memberId ? { ...ar, roleName } : ar))
    );
  };

  const handlePartnerSelectChange = (partnerIds: string[]) => {
    setPartnerRoles((prev) =>
      partnerIds.map((pid) => {
        const exist = prev.find((pr) => pr.partnerId === pid);
        return exist || { partnerId: pid, roleName: "شريك إعلامي" };
      })
    );
  };

  const updatePartnerRoleName = (partnerId: string, roleName: string) => {
    setPartnerRoles((prev) =>
      prev.map((pr) => (pr.partnerId === partnerId ? { ...pr, roleName } : pr))
    );
  };

  const addSource = () => setSources((prev) => [...prev, ""]);
  const removeSource = (i: number) => setSources((prev) => prev.filter((_, idx) => idx !== i));
  const updateSource = (i: number, val: string) => setSources((prev) => prev.map((s, idx) => (idx === i ? val : s)));

  const addGuestAuthor = () => setGuestAuthors((prev) => [...prev, ""]);
  const removeGuestAuthor = (i: number) => setGuestAuthors((prev) => prev.filter((_, idx) => idx !== i));
  const updateGuestAuthor = (i: number, val: string) => setGuestAuthors((prev) => prev.map((g, idx) => (idx === i ? val : g)));

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
    formData.set("authorRoles", JSON.stringify(authorRoles));
    formData.set("authorIds", JSON.stringify(authorRoles.map((ar) => ar.memberId)));
    formData.set("partnerRoles", JSON.stringify(partnerRoles));
    formData.set("partnerIds", JSON.stringify(partnerRoles.map((pr) => pr.partnerId)));
    const cleanSources = sources.filter((s) => s.trim() !== "");
    formData.set("sources", JSON.stringify(cleanSources));
    const cleanGuestAuthors = guestAuthors.filter((g) => g.trim() !== "");
    formData.set("guestAuthors", JSON.stringify(cleanGuestAuthors));
    return await saveAction(prevState, formData);
  }, null);

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setCoverImageUrl(data.url);
    } catch (err: any) {
      setUploadError(err.message || "فشل رفع صورة الغلاف");
    } finally { setUploadingCover(false); e.target.value = ""; }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploadingInlineImg(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err: any) {
      setUploadError(err.message || "فشل رفع الصورة");
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
    <form action={formAction} className={`transition-all duration-300 text-white font-sans ${focusMode ? "fixed inset-0 z-50 bg-[#1A2B4A] p-4 sm:p-8 overflow-y-auto" : "max-w-7xl mx-auto space-y-6"}`}>
      {article?.id && <input type="hidden" name="id" value={article.id} />}

      {/* Error Banner */}
      {(state?.error || uploadError) && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-sans mb-4">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{uploadError || state?.error}</span>
        </div>
      )}

      {/* Sticky Header Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#6B7280]/20 bg-[#0D0D0D]/90 p-4 rounded-2xl border backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <Button
            type="button" variant="outline" size="sm"
            onClick={() => setFocusMode(!focusMode)}
            className="gap-2 text-xs rounded-xl border-[#6B7280]/30 text-white hover:text-[#E84A0C]"
          >
            {focusMode ? <Minimize2 className="w-4 h-4 text-[#E84A0C]" /> : <Maximize2 className="w-4 h-4 text-[#E84A0C]" />}
            <span>{focusMode ? "إنهاء التركيز" : "وضع معالج المستندات (Word Mode)"}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            name="status"
            defaultValue={article?.status || "DRAFT"}
            className="h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
          >
            <option value="DRAFT">مسودة (DRAFT)</option>
            <option value="PUBLISHED">نشر فوري (PUBLISHED)</option>
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

          {/* Title Box */}
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

          {/* Editor Container */}
          <div className="border border-[#6B7280]/20 rounded-2xl bg-[#0D0D0D] shadow-2xl">
            <div className="p-3 bg-[#1A2B4A]/95 backdrop-blur border-b border-[#6B7280]/20 sticky top-0 z-40 flex flex-wrap items-center gap-2 text-white shadow-md rounded-t-2xl">
              
              <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl px-2 py-1">
                <Type className="w-3.5 h-3.5 text-[#E84A0C]" />
                <select
                  onChange={(e) => {
                    if (e.target.value) editor?.chain().focus().setFontFamily(e.target.value).run();
                    else editor?.chain().focus().unsetFontFamily().run();
                  }}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-sans"
                >
                  <option value="" className="bg-[#0D0D0D] text-white">نوع الخط</option>
                  {SUPPORTED_FONTS.map((f) => (
                    <option key={f.value} value={f.value} className="bg-[#0D0D0D] text-white" style={{ fontFamily: f.value }}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

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

              <div className="flex items-center gap-1">
                {[
                  { action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold"), icon: <Bold className="w-4 h-4" /> },
                  { action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic"), icon: <Italic className="w-4 h-4" /> },
                  { action: () => editor?.chain().focus().toggleUnderline().run(), active: editor?.isActive("underline"), icon: <UnderlineIcon className="w-4 h-4" /> },
                  { action: () => editor?.chain().focus().toggleStrike().run(), active: editor?.isActive("strike"), icon: <Strikethrough className="w-4 h-4" /> },
                ].map((btn, i) => (
                  <button key={i} type="button" onClick={btn.action}
                    className={`p-1.5 rounded-lg transition-colors ${btn.active ? "bg-[#E84A0C] text-white" : "hover:bg-[#0D0D0D] text-[#6B7280]"}`}>
                    {btn.icon}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-[#6B7280]/30 mx-1" />

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

              <label className="cursor-pointer p-1.5 rounded-lg hover:bg-[#0D0D0D] text-[#6B7280] hover:text-[#E84A0C] transition-colors flex items-center gap-1 border border-[#6B7280]/30 bg-[#0D0D0D]">
                {uploadingInlineImg ? <Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" /> : <ImageIcon className="w-4 h-4 text-[#E84A0C]" />}
                <span className="text-xs font-fira font-bold">إدراج صورة</span>
                <input type="file" accept="image/*" onChange={handleInlineImageUpload} className="hidden" disabled={uploadingInlineImg} />
              </label>
            </div>

            <div className="p-4 sm:p-8 bg-[#121A2B]/80 flex justify-center overflow-x-auto min-h-[700px] rounded-b-2xl">
              <div className="w-full max-w-4xl bg-[#0D0D0D] border border-[#6B7280]/30 rounded-2xl p-8 sm:p-12 shadow-2xl min-h-[650px] text-white font-sans text-base sm:text-lg leading-relaxed focus:outline-none prose prose-invert max-w-none">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        {!focusMode && (
          <div className="lg:col-span-4 space-y-6">

            {/* Type Selector */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
                <BookOpen className="w-4 h-4 text-[#E84A0C]" />
                <h3 className="font-cairo font-bold text-white text-base">نوع المنشور</h3>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { value: "BLOG", label: "مدونة عامة (Blog)" },
                  { value: "ACADEMIC", label: "مجلة أكاديمية محكمة" },
                ].map((opt) => (
                  <div key={opt.value} onClick={() => setArticleType(opt.value as any)}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      articleType === opt.value
                        ? "bg-[#1A2B4A] border-[#E84A0C] text-white"
                        : "bg-[#1A2B4A]/30 border-[#6B7280]/20 text-[#6B7280]"
                    }`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${articleType === opt.value ? "bg-[#E84A0C] border-[#E84A0C] text-white" : "border-[#6B7280]/40"}`}>
                      {articleType === opt.value && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold text-white">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Roles Input Section */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
                <Users className="w-4 h-4 text-[#E84A0C]" />
                <h3 className="font-cairo font-bold text-white text-base">المؤلفون وأدوارهم</h3>
              </div>
              <p className="text-xs text-[#6B7280]">حدد أعضاء الفريق ودور كل مؤلف (roleName):</p>
              
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {membersList.map((member) => {
                  const ar = authorRoles.find((a) => a.memberId === member.id);
                  const isSelected = !!ar;

                  return (
                    <div key={member.id} className={`p-3 rounded-xl border transition-all ${isSelected ? "bg-[#1A2B4A] border-[#E84A0C]" : "bg-[#1A2B4A]/30 border-[#6B7280]/20"}`}>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleAuthorSelection(member.id)}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${isSelected ? "bg-[#E84A0C] border-[#E84A0C] text-white" : "border-[#6B7280]/40"}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-bold text-white">{member.name}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-[#6B7280]/20">
                          <label className="text-[10px] text-[#6B7280] block mb-1">صفة / دور المؤلف (Role)</label>
                          <input
                            type="text"
                            value={ar.roleName}
                            onChange={(e) => updateAuthorRoleName(member.id, e.target.value)}
                            placeholder="مثال: مؤلف رئيسي، باحث، مراجع..."
                            className="w-full h-8 px-2 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-lg text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guest Authors */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#E84A0C]" />
                  <h3 className="font-cairo font-bold text-white text-base">المؤلفون الخارجيون (Guest Authors)</h3>
                </div>
                <button type="button" onClick={addGuestAuthor} className="text-xs text-[#E84A0C]">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {guestAuthors.map((guest, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={guest}
                      onChange={(e) => updateGuestAuthor(idx, e.target.value)}
                      placeholder="مثال: د. سارة خالد"
                      className="flex-1 h-9 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-lg text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                    />
                    {guestAuthors.length > 1 && (
                      <button type="button" onClick={() => removeGuestAuthor(idx)} className="p-1 text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Selection */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
                <Building2 className="w-4 h-4 text-[#D49B4B]" />
                <h3 className="font-cairo font-bold text-white text-base">الشركاء والمؤسسات</h3>
              </div>
              <PartnerMultiSelect
                availablePartners={partnersList}
                selectedPartnerIds={partnerRoles.map((pr) => pr.partnerId)}
                onChange={handlePartnerSelectChange}
                placeholder="اختر الشركاء والمؤسسات..."
              />
              {partnerRoles.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#6B7280]/20">
                  {partnerRoles.map((pr) => {
                    const partner = partnersList.find((p) => p.id === pr.partnerId);
                    return (
                      <div key={pr.partnerId} className="space-y-1 bg-[#1A2B4A]/30 p-2 rounded-lg border border-[#6B7280]/20">
                        <span className="text-xs font-bold text-[#D49B4B]">{partner?.name || "شريك"}</span>
                        <input
                          type="text"
                          value={pr.roleName}
                          onChange={(e) => updatePartnerRoleName(pr.partnerId, e.target.value)}
                          placeholder="مثال: شريك إعلامي، راعي أكاديمي..."
                          className="w-full h-8 px-2 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-lg text-xs text-white focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cover Image Upload */}
            <div className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-cairo font-bold text-white text-base">صورة الغلاف</h3>
              {coverImageUrl ? (
                <div className="aspect-video rounded-xl overflow-hidden border border-[#6B7280]/30">
                  <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#6B7280] font-fira text-xs">
                  لم يتم اختيار صورة غلاف
                </div>
              )}
              <label className="cursor-pointer w-full py-3 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-white hover:border-[#E84A0C] transition-all flex items-center justify-center gap-2 text-xs font-semibold">
                {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" /> : <Upload className="w-4 h-4 text-[#E84A0C]" />}
                <span>{uploadingCover ? "جاري الرفع..." : "رفع صورة الغلاف"}</span>
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
              </label>
            </div>

          </div>
        )}
      </div>
    </form>
  );
}
