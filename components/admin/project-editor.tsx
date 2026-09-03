"use client";

import React, { useState, useTransition, useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import {
  Save, Loader2, AlertCircle, ArrowLeft, Plus, Trash2,
  FolderGit2, Users, FileText, Building2, Check, Upload,
  UserPlus, Calendar, MapPin, Clock, ExternalLink, QrCode,
  Download, Copy, ShieldCheck, RefreshCw, Eye, GraduationCap,
} from "lucide-react";
import { ProjectDetail, toggleProjectSessionFormAction } from "@/app/actions/project-actions";
import { PartnerMultiSelect } from "@/components/admin/partner-multi-select";

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

interface PartnerRole {
  partnerId: string;
  roleName: string;
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

const TYPE_OPTIONS = [
  { value: "PROJECT", label: "مشروع بحثي" },
  { value: "COURSE", label: "دورة تعليمية" },
  { value: "WORKSHOP", label: "ورشة عمل" },
  { value: "LECTURE", label: "محاضرة علمية" },
  { value: "BOOTCAMP", label: "معسكر تدريبي" },
  { value: "SEMINAR", label: "ندوة حوارية" },
];

export function ProjectEditor({ project, availableMembers, availableArticles, availablePartners, saveAction }: ProjectEditorProps) {
  const [activeTab, setActiveTab] = useState<"general" | "sessions" | "participants">("general");

  const [status, setStatus] = useState<string>(project?.status || "PLANNED");
  const [type, setType] = useState<string>(project?.type || "PROJECT");
  const [totalSessions, setTotalSessions] = useState<number>(project?.totalSessions || 1);
  const [coverImageUrl, setCoverImageUrl] = useState(project?.coverImage || "");
  const [uploadingCover, setUploadingCover] = useState(false);

  // Selections
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>(
    project?.articles?.map((a) => a.id) || []
  );

  const [partnerRoles, setPartnerRoles] = useState<PartnerRole[]>(
    project?.partners?.map((p) => ({ partnerId: p.id, roleName: p.roleName || "شريك استراتيجي" })) || []
  );

  const [memberRoles, setMemberRoles] = useState<MemberRole[]>(
    project?.members?.map((m) => ({
      memberId: m.memberId,
      memberName: m.memberName || availableMembers.find((am) => am.id === m.memberId)?.name || "عضو",
      roleName: m.roleName,
    })) || []
  );

  const [guestAuthors, setGuestAuthors] = useState<string[]>(
    project?.guestAuthors && project.guestAuthors.length > 0 ? project.guestAuthors : [""]
  );

  // New member role form
  const [newMemberId, setNewMemberId] = useState("");
  const [newRoleName, setNewRoleName] = useState("");

  // Session form toggling state
  const [isTogglingSession, startTransition] = useTransition();
  const [sessionFormMsg, setSessionFormMsg] = useState<string | null>(null);
  const [expirationMins, setExpirationMins] = useState<number>(30);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    formData.set("status", status);
    formData.set("type", type);
    formData.set("totalSessions", totalSessions.toString());
    if (coverImageUrl) formData.set("coverImage", coverImageUrl);
    formData.set("articleIds", JSON.stringify(selectedArticleIds));
    formData.set("partnerRoles", JSON.stringify(partnerRoles));
    formData.set("partnerIds", JSON.stringify(partnerRoles.map((pr) => pr.partnerId)));
    formData.set("members", JSON.stringify(memberRoles));
    const cleanGuestAuthors = guestAuthors.filter((g) => g.trim() !== "");
    formData.set("guestAuthors", JSON.stringify(cleanGuestAuthors));
    return await saveAction(prevState, formData);
  }, null);

  const toggleArticle = (id: string) =>
    setSelectedArticleIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handlePartnerSelectChange = (partnerIds: string[]) => {
    setPartnerRoles((prev) => {
      return partnerIds.map((pid) => {
        const exist = prev.find((p) => p.partnerId === pid);
        return exist || { partnerId: pid, roleName: "شريك استراتيجي" };
      });
    });
  };

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

  const handleToggleSessionForm = (sessionId: string, currentStatus: string) => {
    setSessionFormMsg(null);
    const targetStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
    startTransition(async () => {
      const res = await toggleProjectSessionFormAction(sessionId, targetStatus, expirationMins);
      if (res.error) setSessionFormMsg(res.error);
      else setSessionFormMsg(targetStatus === "OPEN" ? "تم فتح استمارة التسجيل للجلسة." : "تم إغلاق الاستمارة.");
    });
  };

  const downloadQRCode = (code: string, name: string) => {
    const svgElement = document.getElementById(`qr-svg-${code}`);
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${name.replace(/\s+/g, "_")}_${code}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copyVerificationLink = (code: string) => {
    const url = `https://pmthiq.online/verify/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <form action={formAction} className="max-w-7xl mx-auto space-y-6 text-white font-sans">
      {project?.id && <input type="hidden" name="id" value={project.id} />}

      {/* Error Banner */}
      {state?.error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Sticky Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#0D0D0D]/95 rounded-2xl border border-[#6B7280]/20 sticky top-2 z-40 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <FolderGit2 className="w-5 h-5 text-[#E84A0C]" />
          <span className="font-cairo font-bold text-white text-base">
            {project ? `تعديل: ${project.title}` : "مشروع / نشاط جديد"}
          </span>
        </div>

        {/* Editor Tabs for Existing Projects */}
        {project?.id && (
          <div className="flex items-center bg-[#1A2B4A]/60 p-1 rounded-xl border border-[#6B7280]/20 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-cairo font-bold ${activeTab === "general" ? "bg-[#E84A0C] text-white" : "text-stone-300 hover:text-white"}`}
            >
              البيانات الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sessions")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-cairo font-bold flex items-center gap-1.5 ${activeTab === "sessions" ? "bg-[#E84A0C] text-white" : "text-stone-300 hover:text-white"}`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>الجلسات والحضور ({project.sessions?.length || 0})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("participants")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-cairo font-bold flex items-center gap-1.5 ${activeTab === "participants" ? "bg-[#E84A0C] text-white" : "text-stone-300 hover:text-white"}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>المشاركون وبار كود QR ({project.participants?.length || 0})</span>
            </button>
          </div>
        )}

        <Button type="submit" disabled={isPending}
          className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl px-6 font-bold text-xs shrink-0">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>حفظ التغييرات</span>
        </Button>
      </div>

      {/* TAB 1: General Info */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Basic Details */}
            <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-fira text-[#E84A0C] border-b border-[#6B7280]/20 pb-3">
                <FolderGit2 className="w-4 h-4" />
                <span>المعلومات الأساسية للمشروع / الفعالية</span>
              </div>
              <input
                type="text"
                name="title"
                defaultValue={project?.title || ""}
                required
                placeholder="عنوان المشروع أو الفعالية..."
                className="w-full bg-transparent border-none text-white font-cairo text-2xl sm:text-3xl font-extrabold focus:outline-none placeholder-[#6B7280]"
              />
              <textarea
                name="description"
                rows={5}
                defaultValue={project?.description || ""}
                placeholder="وصف وتفاصيل المشروع/الفعالية والأهداف..."
                className="w-full bg-[#1A2B4A]/50 border border-[#6B7280]/20 rounded-xl px-4 py-3 text-xs text-white font-sans focus:outline-none focus:border-[#E84A0C] resize-none leading-relaxed"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs text-[#6B7280] font-sans mb-1 block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E84A0C]" />
                    المكان / الرابط
                  </label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={project?.location || ""}
                    placeholder="مثال: القاعة الرئيسية / Zoom"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] font-sans mb-1 block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E84A0C]" />
                    تاريخ البدء
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={project?.startDate ? project.startDate.substring(0, 10) : ""}
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] font-sans mb-1 block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E84A0C]" />
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={project?.endDate ? project.endDate.substring(0, 10) : ""}
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>
              </div>
            </div>

            {/* Team Members with Roles */}
            <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
                <Users className="w-4 h-4 text-[#E84A0C]" />
                <h3 className="font-cairo font-bold text-white">أعضاء الفريق وأدوارهم (Project Roles)</h3>
              </div>

              <div className="space-y-3 bg-[#1A2B4A]/40 p-4 rounded-xl border border-[#6B7280]/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6B7280] font-sans mb-1 block">العضو المشارك</label>
                    <select
                      value={newMemberId}
                      onChange={(e) => setNewMemberId(e.target.value)}
                      className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                    >
                      <option value="">-- اختر عضواً --</option>
                      {availableMembers
                        .filter((m) => !memberRoles.some((mr) => mr.memberId === m.id))
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} {m.department ? `(${m.department})` : ""}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#6B7280] font-sans mb-1 block">الدور في المشروع (roleName)</label>
                    <input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="مثال: باحث رئيسي، محاضر، مدرب..."
                      className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-[#6B7280]">أدوار مقترحة:</span>
                  {["باحث رئيسي", "محاضر", "مدرب", "مستشار علمي", "مشرِف", "مساعد بحث"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewRoleName(role)}
                      className="text-[10px] bg-[#1A2B4A] hover:bg-[#E84A0C]/20 hover:text-[#E84A0C] text-slate-300 px-2 py-0.5 rounded-lg border border-[#6B7280]/30 transition-colors"
                    >
                      + {role}
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={addMemberRole}
                  disabled={!newMemberId || !newRoleName.trim()}
                  size="sm"
                  className="w-full bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl h-9 text-xs font-bold gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة العضو والدور للمشروع</span>
                </Button>
              </div>

              <div className="space-y-2">
                {memberRoles.length === 0 ? (
                  <p className="text-xs text-[#6B7280] italic font-sans py-2 text-center">لم يتم إضافة أعضاء للمشروع بعد.</p>
                ) : (
                  memberRoles.map((mr) => (
                    <div
                      key={mr.memberId}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{mr.memberName}</p>
                        <span className="inline-block text-[10px] text-[#E84A0C] bg-[#E84A0C]/10 px-2 py-0.5 rounded-md font-fira mt-1 border border-[#E84A0C]/30">
                          {mr.roleName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMemberRole(mr.memberId)}
                        className="p-1.5 text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="إزالة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Guest Authors */}
            <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#E84A0C]" />
                  <h3 className="font-cairo font-bold text-white">المساهمون والمحاضرون الخارجيون (Guest Authors)</h3>
                </div>
                <button
                  type="button"
                  onClick={addGuestAuthor}
                  className="text-xs text-[#E84A0C] hover:underline flex items-center gap-1 font-sans"
                >
                  <Plus className="w-3.5 h-3.5" /> إضافة مساهم
                </button>
              </div>
              <div className="space-y-2">
                {guestAuthors.map((guest, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={guest}
                      onChange={(e) => updateGuestAuthor(idx, e.target.value)}
                      placeholder="مثال: د. أحمد المحمد (محاضر زائر)"
                      className="flex-1 h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                    />
                    {guestAuthors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuestAuthor(idx)}
                        className="p-2 text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Settings Column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Project Classification */}
            <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
              <h3 className="font-cairo font-bold text-white border-b border-[#6B7280]/20 pb-3">نوع الفعالية / المشروع</h3>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">نوع التصنيف (Type)</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#6B7280] block mb-1">عدد الجلسات / المحاضرات</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={totalSessions}
                  onChange={(e) => setTotalSessions(parseInt(e.target.value, 10) || 1)}
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              <div className="pt-2">
                <label className="text-xs text-[#6B7280] block mb-1">الحالة (Status)</label>
                <div className="space-y-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <div key={opt.value} onClick={() => setStatus(opt.value)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${status === opt.value ? "bg-[#1A2B4A] border-[#E84A0C]" : "bg-[#1A2B4A]/30 border-[#6B7280]/20"}`}>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border shrink-0 ${status === opt.value ? "bg-[#E84A0C] border-[#E84A0C] text-white" : "border-[#6B7280]/40"}`}>
                        {status === opt.value && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${opt.color}`}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Partners Dropdown */}
            <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-[#6B7280]/20 pb-3">
                <Building2 className="w-4 h-4 text-[#E84A0C]" />
                <h3 className="font-cairo font-bold text-white">الشركاء المؤسسيين</h3>
              </div>
              <PartnerMultiSelect
                availablePartners={availablePartners}
                selectedPartnerIds={partnerRoles.map((pr) => pr.partnerId)}
                onChange={handlePartnerSelectChange}
                placeholder="اختر الشركاء للمشروع..."
              />
            </div>

            {/* Cover Image Upload */}
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
      )}

      {/* TAB 2: Sessions & Form Management */}
      {activeTab === "sessions" && project?.id && (
        <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#6B7280]/20 pb-4">
            <div>
              <h2 className="font-cairo font-bold text-xl text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E84A0C]" />
                إدارة جلسات الفعالية واستمارات الحضور
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                قم بفتح أو إغلاق استمارة تسجيل الحضور لكل جلسة أو تحديد مهلة زمنية لإغلاق الاستمارة تلقائياً.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7280]">مهلة فتح الاستمارة:</span>
              <select
                value={expirationMins}
                onChange={(e) => setExpirationMins(parseInt(e.target.value, 10))}
                className="h-9 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value={15}>15 دقيقة</option>
                <option value={30}>30 دقيقة</option>
                <option value={60}>ساعة واحدة</option>
                <option value={120}>ساعتان</option>
                <option value={0}>بدون تحديد (مفتوح)</option>
              </select>
            </div>
          </div>

          {sessionFormMsg && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              {sessionFormMsg}
            </div>
          )}

          <div className="grid gap-4">
            {project.sessions?.map((s) => {
              const isOpen = s.formStatus === "OPEN" && !s.isExpired;
              const publicUrl = `https://pmthiq.online/attendance/${s.id}`;

              return (
                <div key={s.id} className="p-5 rounded-2xl bg-[#1A2B4A]/50 border border-[#6B7280]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#E84A0C] bg-[#E84A0C]/10 px-2 py-0.5 rounded-md font-bold">
                        جلسة #{s.sessionNumber}
                      </span>
                      <h3 className="font-cairo font-bold text-white text-base">{s.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-fira ${isOpen ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse" : "bg-stone-500/20 text-stone-400"}`}>
                        {isOpen ? "الاستمارة مفتوحة للجمهور" : "الاستمارة مغلقة"}
                      </span>
                    </div>
                    {s.expiresAt && isOpen && (
                      <p className="text-[11px] font-mono text-amber-400">
                        تنتهي صلاحية الاستمارة تلقائياً: {new Date(s.expiresAt).toLocaleTimeString("ar-EG")}
                      </p>
                    )}
                    <p className="text-xs text-[#6B7280]">
                      إجمالي الحضور المسجل في هذه الجلسة: <span className="text-white font-bold">{s.attendanceCount} مشارك</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/attendance/${s.id}`} target="_blank">
                      <Button size="sm" variant="outline" className="border-[#6B7280]/30 text-stone-300 text-xs rounded-xl gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>معاينة الاستمارة</span>
                      </Button>
                    </Link>

                    <Button
                      type="button"
                      onClick={() => handleToggleSessionForm(s.id, s.formStatus)}
                      disabled={isTogglingSession}
                      className={`text-xs font-bold rounded-xl px-4 ${isOpen ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
                    >
                      {isOpen ? "إغلاق الاستمارة الآن" : "فتح الاستمارة للجمهور"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Registered Participants & Admin QR Code Extraction */}
      {activeTab === "participants" && project?.id && (
        <div className="p-6 bg-[#0D0D0D] rounded-2xl border border-[#6B7280]/20 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
            <div>
              <h2 className="font-cairo font-bold text-xl text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#E84A0C]" />
                سجل المشاركين واستخراج البار كود (QR Codes)
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                سجل جميع المسجلين والحاضرين في الفعالية مع إمكانية تحقّق الكادر وتنزيل صور رمز QR لاستخدامها في تصميم الشهادات.
              </p>
            </div>
            <span className="text-xs font-mono bg-[#1A2B4A] text-white px-3 py-1 rounded-xl border border-[#6B7280]/30">
              إجمالي المشاركين: {project.participants?.length || 0}
            </span>
          </div>

          {project.participants?.length === 0 ? (
            <div className="p-12 text-center text-stone-500 text-xs font-sans space-y-2">
              <Users className="w-8 h-8 mx-auto opacity-40 text-[#E84A0C]" />
              <p>لم يقم أي مشارك بتسجيل الحضور في هذه الفعالية بعد.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {project.participants?.map((p) => {
                const verifyUrl = `https://pmthiq.online/verify/${p.uniqueCode}`;

                return (
                  <div key={p.id} className="p-5 rounded-2xl bg-[#1A2B4A]/40 border border-[#6B7280]/20 flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    {/* Admin QR Code View & Download Button */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="p-2 bg-white rounded-2xl border-2 border-[#E84A0C] shadow-lg">
                        <QRCodeSVG
                          id={`qr-svg-${p.uniqueCode}`}
                          value={verifyUrl}
                          size={90}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#6B7280] block">رمز التحقق الفريد:</span>
                        <p className="font-mono text-lg font-black text-[#E84A0C]">{p.uniqueCode}</p>
                        
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => downloadQRCode(p.uniqueCode, p.nameAr)}
                            className="inline-flex items-center gap-1 text-[11px] bg-[#E84A0C] hover:bg-[#D03E06] text-white px-2.5 py-1 rounded-lg font-bold transition-all"
                            title="تنزيل صورة QR بصيغة PNG لاستخدامها في تصميم الشهادة"
                          >
                            <Download className="w-3 h-3" />
                            <span>تنزيل QR</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => copyVerificationLink(p.uniqueCode)}
                            className="inline-flex items-center gap-1 text-[11px] bg-[#1A2B4A] hover:bg-[#1A2B4A]/80 text-stone-300 px-2.5 py-1 rounded-lg border border-[#6B7280]/30 transition-all"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedCode === p.uniqueCode ? "تم النسخ!" : "نسخ الرابط"}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Participant Meta */}
                    <div className="flex-1 min-w-0 space-y-1 text-right">
                      <h3 className="font-cairo font-bold text-white text-base">{p.nameAr}</h3>
                      <p className="font-mono text-xs text-stone-400">{p.nameEn} • {p.email}</p>
                      
                      <div className="flex items-center gap-3 pt-2">
                        <div className="text-xs">
                          <span className="text-[#6B7280]">نسبة الحضور: </span>
                          <span className="font-mono font-bold text-emerald-400">{p.attendanceRatio} ({p.attendancePercentage}%)</span>
                        </div>
                        <div className="w-24 h-2 bg-[#0D0D0D] rounded-full overflow-hidden border border-[#6B7280]/30">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.attendancePercentage}%` }} />
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
