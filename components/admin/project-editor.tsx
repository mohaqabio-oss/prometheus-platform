"use client";

import React, { useState, useEffect, useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Save, Loader2, AlertCircle, ArrowLeft, Plus, Trash2,
  FolderGit2, Users, FileText, Building2, Check, Upload,
  UserPlus,
} from "lucide-react";
import { ProjectRecord } from "@/app/actions/project-actions";

interface Member {
  id: string;
  name: string;
  title?: string;
  department?: string;
}

interface Article {
  id: string;
  title: string;
  type: string;
}

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
}

interface MemberRole {
  memberId: string;
  memberName: string;
  roleName: string;
}

interface ProjectDetail extends ProjectRecord {
  members?: { memberId: string; memberName: string; roleName: string }[];
  articles?: { id: string; title: string; type: string }[];
  partners?: { id: string; name: string; logoUrl: string }[];
  guestAuthors?: string[];
}

interface ProjectEditorProps {
  project?: ProjectDetail | null;
  availableMembers: Member[];
  availableArticles: Article[];
  availablePartners: Partner[];
  saveAction: (prevState: any, formData: FormData) => Promise<any>;
}

const STATUS_OPTIONS = [
  { value: "PLANNED", label: "مخطط له", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { value: "IN_PROGRESS", label: "قيد التنفيذ", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { value: "COMPLETED", label: "مكتمل", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
];

export function ProjectEditor({ project, availableMembers, availableArticles, availablePartners, saveAction }: ProjectEditorProps) {
  const [status, setStatus] = useState<string>(project?.status || "PLANNED");
  const [coverImageUrl, setCoverImageUrl] = useState(project?.coverImage || "");
  const [uploadingCover, setUploadingCover] = useState(false);

  // Many-to-many selections
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>(
    project?.articles?.map((a) => a.id) || []
  );
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>(
    project?.partners?.map((p) => p.id) || []
  );
  const [memberRoles, setMemberRoles] = useState<MemberRole[]>(
    project?.members?.map((m) => ({ memberId: m.memberId, memberName: m.memberName, roleName: m.roleName })) || []
  );

  // External / Guest contributors
  const [guestAuthors, setGuestAuthors] = useState<string[]>(
    project?.guestAuthors && project.guestAuthors.length > 0 ? project.guestAuthors : [""]
  );

  // Member role dialog state
  const [newMemberId, setNewMemberId] = useState("");
  const [newRoleName, setNewRoleName] = useState("");

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    formData.set("status", status);
    if (coverImageUrl) formData.set("coverImage", coverImageUrl);
    formData.set("articleIds", JSON.stringify(selectedArticleIds));
    formData.set("partnerIds", JSON.stringify(selectedPartnerIds));
    formData.set("members", JSON.stringify(memberRoles));
    const cleanGuestAuthors = guestAuthors.filter((g) => g.trim() !== "");
    formData.set("guestAuthors", JSON.stringify(cleanGuestAuthors));
    return await saveAction(prevState, formData);
  }, null);

  const toggleArticle = (id: string) =>
    setSelectedArticleIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const togglePartner = (id: string) =>
    setSelectedPartnerIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const addMemberRole = () => {
    if (!newMemberId || !newRoleName.trim()) return;
    const member = availableMembers.find((m) => m.id === newMemberId);
    if (!member) return;
    if (memberRoles.some((mr) => mr.memberId === newMemberId)) return;
    setMemberRoles((prev) => [...prev, { memberId: newMemberId, memberName: member.name, roleName: newRoleName.trim() }]);
    setNewMemberId("");
    setNewRoleName("");
  };

  const removeMemberRole = (memberId: string) =>
    setMemberRoles((prev) => prev.filter((mr) => mr.memberId !== memberId));

  const addGuestAuthor = () => setGuestAuthors((prev) => [...prev, ""]);
  const removeGuestAuthor = (i: number) => setGuestAuthors((prev) => prev.filter((_, idx) => idx !== i));
  const updateGuestAuthor = (i: number, val: string) =>
    setGuestAuthors((prev) => prev.map((g, idx) => (idx === i ? val : g)));

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setCoverImageUrl(data.url);
    } catch (err) {
      console.error("Cover upload failed:", err);
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  return (
    <form action={formAction} className="max-w-7xl mx-auto space-y-6 text-white">
      {project?.id && <input type="hidden" name="id" value={project.id} />}

      {/* Error Banner */}
      {state?.error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0D0D0D]/90 rounded-2xl border border-[#6B7280]/20 sticky top-2 z-40 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <FolderGit2 className="w-5 h-5 text-[#E84A0C]" />
          <span className="font-cairo font-bold text-white">
            {project ? "تعديل المشروع" : "مشروع بحثي جديد"}
          </span>
        </div>
        <Button type="submit" disabled={isPending}
          className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl px-6 font-bold text-xs">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>حفظ المشروع</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">

          {/* Basic Info */}
          <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-fira text-[#E84A0C] border-b border-[#6B7280]/20 pb-3">
              <FolderGit2 className="w-4 h-4" />
              <span>معلومات المشروع الأساسية</span>
            </div>
            <input type="text" name="title" defaultValue={project?.title || ""} required
              placeholder="عنوان المشروع البحثي..."
              className="w-full bg-transparent border-none text-white font-cairo text-3xl font-extrabold focus:outline-none placeholder-[#6B7280]"
            />
            <textarea name="description" rows={6} defaultValue={project?.description || ""}
              placeholder="وصف المشروع وأهدافه والمنهجية المتبعة..."
              className="w-full bg-[#1A2B4A]/50 border border-[#6B7280]/20 rounded-xl px-4 py-3 text-sm text-white font-sans focus:outline-none focus:border-[#E84A0C] resize-none leading-relaxed"
            />
          </div>

          {/* Team Members with Roles */}
          <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
              <Users className="w-4 h-4 text-[#E84A0C]" />
              <h3 className="font-cairo font-bold text-white">أعضاء الفريق وأدوارهم</h3>
            </div>

            {/* Add member form */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-[#6B7280] font-sans mb-1 block">العضو</label>
                <select value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)}
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]">
                  <option value="">-- اختر عضواً --</option>
                  {availableMembers
                    .filter((m) => !memberRoles.some((mr) => mr.memberId === m.id))
                    .map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.department})</option>
                    ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-[#6B7280] font-sans mb-1 block">الدور في المشروع</label>
                <input type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="مثال: باحث رئيسي، مراجع، محرر..."
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMemberRole())}
                />
              </div>
              <Button type="button" onClick={addMemberRole} size="sm"
                className="bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shrink-0 h-10 px-4">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Assigned members list */}
            <div className="space-y-2">
              {memberRoles.length === 0 ? (
                <p className="text-xs text-[#6B7280] italic font-sans">لم يتم إضافة أعضاء بعد.</p>
              ) : (
                memberRoles.map((mr) => (
                  <div key={mr.memberId}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20">
                    <div>
                      <p className="text-xs font-bold text-white">{mr.memberName}</p>
                      <p className="text-[10px] text-[#E84A0C] font-fira mt-0.5">{mr.roleName}</p>
                    </div>
                    <button type="button" onClick={() => removeMemberRole(mr.memberId)}
                      className="p-1.5 text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* External / Guest Contributors */}
          <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#E84A0C]" />
                <h3 className="font-cairo font-bold text-white">المساهمون والباحثون الخارجيون (Guest Contributors)</h3>
              </div>
              <button type="button" onClick={addGuestAuthor}
                className="text-xs text-[#E84A0C] hover:underline flex items-center gap-1 font-sans">
                <Plus className="w-3.5 h-3.5" /> إضافة مساهم خارجي
              </button>
            </div>
            <p className="text-xs text-[#6B7280] font-sans">
              اكتب أسماء الباحثين أو الأطباء أو الخبراء المساهمين من خارج الفريق الذين لا يملكون حسابات نظام.
            </p>
            <div className="space-y-2">
              {guestAuthors.map((guest, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={guest}
                    onChange={(e) => updateGuestAuthor(idx, e.target.value)}
                    placeholder="مثال: د. أحمد المحمد (باحث زائر - جامعة القاهرة)"
                    className="flex-1 h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C] font-sans"
                  />
                  {guestAuthors.length > 1 && (
                    <button type="button" onClick={() => removeGuestAuthor(idx)}
                      className="p-2 text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Linked Articles */}
          <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
              <FileText className="w-4 h-4 text-[#E84A0C]" />
              <h3 className="font-cairo font-bold text-white">المقالات والمخرجات البحثية</h3>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableArticles.length === 0 ? (
                <p className="text-xs text-[#6B7280] italic">لا توجد مقالات منشورة.</p>
              ) : (
                availableArticles.map((art) => {
                  const sel = selectedArticleIds.includes(art.id);
                  return (
                    <div key={art.id} onClick={() => toggleArticle(art.id)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${sel ? "bg-[#1A2B4A] border-[#E84A0C]" : "bg-[#1A2B4A]/30 border-[#6B7280]/20 hover:border-[#6B7280]/40"}`}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${sel ? "bg-[#E84A0C] border-[#E84A0C] text-white" : "border-[#6B7280]/40"}`}>
                        {sel && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{art.title}</p>
                        <span className={`text-[10px] font-fira px-1.5 py-0.5 rounded ${art.type === "ACADEMIC" ? "text-purple-400" : "text-blue-400"}`}>
                          {art.type === "ACADEMIC" ? "أكاديمي" : "مدونة"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Status */}
          <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
            <h3 className="font-cairo font-bold text-white border-b border-[#6B7280]/20 pb-3">حالة المشروع</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <div key={opt.value} onClick={() => setStatus(opt.value)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${status === opt.value ? "bg-[#1A2B4A] border-[#E84A0C] ring-1 ring-[#E84A0C]" : "bg-[#1A2B4A]/30 border-[#6B7280]/20 hover:border-[#6B7280]/40"}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${status === opt.value ? "bg-[#E84A0C] border-[#E84A0C] text-white" : "border-[#6B7280]/40"}`}>
                    {status === opt.value && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${opt.color}`}>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Selection */}
          <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
              <Building2 className="w-4 h-4 text-[#E84A0C]" />
              <h3 className="font-cairo font-bold text-white">الشركاء المرتبطون</h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availablePartners.length === 0 ? (
                <p className="text-xs text-[#6B7280] italic">لا يوجد شركاء مضافون.</p>
              ) : (
                availablePartners.map((partner) => {
                  const sel = selectedPartnerIds.includes(partner.id);
                  return (
                    <div key={partner.id} onClick={() => togglePartner(partner.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${sel ? "bg-[#1A2B4A] border-[#E84A0C]" : "bg-[#1A2B4A]/30 border-[#6B7280]/20 hover:border-[#6B7280]/40"}`}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${sel ? "bg-[#E84A0C] border-[#E84A0C] text-white" : "border-[#6B7280]/40"}`}>
                        {sel && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <img src={partner.logoUrl} alt={partner.name} className="w-6 h-6 object-contain rounded" />
                      <p className="text-xs text-white truncate flex-1">{partner.name}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
            <h3 className="font-cairo font-bold text-white">صورة الغلاف</h3>
            {coverImageUrl ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-[#6B7280]/30">
                <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#6B7280] text-xs font-fira">
                لم تُختر صورة
              </div>
            )}
            <label className="cursor-pointer w-full py-3 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-white hover:border-[#E84A0C] transition-all flex items-center justify-center gap-2 text-xs font-semibold">
              {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin text-[#E84A0C]" /> : <Upload className="w-4 h-4 text-[#E84A0C]" />}
              <span>{uploadingCover ? "جاري الرفع..." : "رفع صورة الغلاف"}</span>
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
            </label>
          </div>

        </div>
      </div>
    </form>
  );
}
