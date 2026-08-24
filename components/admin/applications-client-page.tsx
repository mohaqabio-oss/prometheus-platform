"use client";

import React, { useState } from "react";
import {
  JoinRequestRecord,
  updateJoinRequestStatusAction,
  deleteJoinRequestAction,
} from "@/app/actions/application-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  Search,
  Eye,
  Trash2,
  Mail,
  GraduationCap,
  Briefcase,
  Globe,
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface ApplicationsClientPageProps {
  requests: JoinRequestRecord[];
}

export function ApplicationsClientPage({ requests }: ApplicationsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedRequest, setSelectedRequest] = useState<JoinRequestRecord | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesSearch =
      r.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contactInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    setLoadingId(requestId);
    try {
      await updateJoinRequestStatusAction(requestId, newStatus);
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    } catch (e: any) {
      alert(e.message || "حدث خطأ أثناء تحديث الحالة.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الطلب نهائياً؟")) return;
    setLoadingId(requestId);
    try {
      await deleteJoinRequestAction(requestId);
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(null);
      }
    } catch (e: any) {
      alert(e.message || "فشل حذف الطلب.");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <Badge variant="dark" className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/40 gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>مقبول</span>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="dark" className="text-[10px] bg-rose-500/20 text-rose-400 border-rose-500/40 gap-1 font-mono">
            <XCircle className="w-3 h-3 text-rose-400" />
            <span>مرفوض</span>
          </Badge>
        );
      case "REVIEWED":
        return (
          <Badge variant="dark" className="text-[10px] bg-sky-500/20 text-sky-400 border-sky-500/40 gap-1 font-mono">
            <Clock className="w-3 h-3 text-sky-400" />
            <span>تمت المراجعة</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="orange" className="text-[10px] gap-1 font-mono">
            <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>قيد المراجعة</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#6B7280]/20 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="orange" className="text-xs">
              لوحة الموارد البشرية (HR Applications)
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            طلبات الانضمام والتوظيف الواردة
          </h1>
          <p className="text-xs text-[#6B7280] font-sans">
            مراجعة واستعراض طلبات الانضمام المقدمة من الكوادر الشبابية والباحثين وإدارتها.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>إجمالي الطلبات: {requests.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="ابحث باسم المتقدم أو البريد أو القسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 ps-10 pe-4 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-sans"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { label: "الكل", value: "ALL" },
              { label: "قيد المراجعة", value: "PENDING" },
              { label: "تمت المراجعة", value: "REVIEWED" },
              { label: "مقبول", value: "ACCEPTED" },
              { label: "مرفوض", value: "REJECTED" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === f.value
                    ? "bg-[#E84A0C] text-white font-bold shadow-md"
                    : "bg-[#0D0D0D] text-[#6B7280] hover:text-white border border-[#6B7280]/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Applications Table */}
      <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl shadow-xl overflow-hidden space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs font-sans">
            <thead>
              <tr className="border-b border-[#6B7280]/20 text-[#6B7280] font-mono text-[11px]">
                <th className="py-3 px-4">اسم المتقدم (عربي / English)</th>
                <th className="py-3 px-4">معلومات الاتصال</th>
                <th className="py-3 px-4">القسم المستهدف</th>
                <th className="py-3 px-4">حالة الطلب</th>
                <th className="py-3 px-4">تاريخ التقديم</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6B7280]/10">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6B7280] font-mono">
                    لا توجد طلبات انضمام مطابقة للفلتر المحدد.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-[#1A2B4A]/30 transition-colors">
                    
                    {/* Candidate Name */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-white text-sm">{r.nameAr}</p>
                        <p className="text-[11px] font-mono text-[#6B7280]">{r.nameEn}</p>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-4 font-mono text-[#6B7280]">
                      <div className="flex items-center gap-1 text-white">
                        <Mail className="w-3.5 h-3.5 text-[#E84A0C]" />
                        <span>{r.contactInfo}</span>
                      </div>
                    </td>

                    {/* Target Department */}
                    <td className="py-4 px-4">
                      <Badge variant="orange" className="text-[10px]">
                        {r.department}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {getStatusBadge(r.status)}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 font-mono text-[#6B7280]">
                      {new Date(r.createdAt).toLocaleDateString("ar-EG")}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* View Details Button */}
                        <Button
                          onClick={() => setSelectedRequest(r)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 gap-1.5 text-xs rounded-xl border-[#6B7280]/30 text-white hover:text-[#E84A0C]"
                          title="عرض التفاصيل الكاملة"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#E84A0C]" />
                          <span>عرض التفاصيل</span>
                        </Button>

                        {/* Status Select */}
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          disabled={loadingId === r.id}
                          className="h-8 px-2 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-[11px] font-mono text-white focus:outline-none focus:border-[#E84A0C]"
                        >
                          <option value="PENDING">قيد المراجعة</option>
                          <option value="REVIEWED">تمت المراجعة</option>
                          <option value="ACCEPTED">مقبول</option>
                          <option value="REJECTED">مرفوض</option>
                        </select>

                        {/* Delete Button */}
                        <Button
                          onClick={() => handleDelete(r.id)}
                          disabled={loadingId === r.id}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                        >
                          {loadingId === r.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Full Details Modal Dialog */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0D0D0D] border border-[#6B7280]/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-white text-right">
            
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#E84A0C] font-bold text-lg font-mono">
                  {selectedRequest.nameAr.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {selectedRequest.nameAr}
                  </h3>
                  <p className="text-xs font-mono text-[#6B7280]">{selectedRequest.nameEn}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(selectedRequest.status)}
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-[#6B7280] hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Quick Details Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 text-xs font-sans">
              <div className="space-y-1">
                <p className="text-[#6B7280]">البريد / معلومات الاتصال:</p>
                <p className="font-bold text-white font-mono">{selectedRequest.contactInfo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#6B7280]">القسم المستهدف:</p>
                <p className="font-bold text-[#E84A0C] font-sans">{selectedRequest.department}</p>
              </div>
            </div>

            {/* Field 1: Education */}
            <div className="space-y-1.5 border-b border-[#6B7280]/15 pb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E84A0C] font-mono">
                <GraduationCap className="w-4 h-4" />
                <span>التحصيل الأكاديمي والجامعة:</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed font-sans bg-[#141C2F] p-3 rounded-xl border border-[#6B7280]/20">
                {selectedRequest.education}
              </p>
            </div>

            {/* Field 2: Experience */}
            <div className="space-y-1.5 border-b border-[#6B7280]/15 pb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E84A0C] font-mono">
                <Briefcase className="w-4 h-4" />
                <span>الخبرات السابقة والمهارات العملية:</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed font-sans bg-[#141C2F] p-3 rounded-xl border border-[#6B7280]/20 whitespace-pre-wrap">
                {selectedRequest.experience}
              </p>
            </div>

            {/* Field 3: Knowledge about Prometheus */}
            <div className="space-y-1.5 border-b border-[#6B7280]/15 pb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E84A0C] font-mono">
                <Heart className="w-4 h-4" />
                <span>ماذا يعرف عن الفريق ورسالته؟</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed font-sans bg-[#141C2F] p-3 rounded-xl border border-[#6B7280]/20 whitespace-pre-wrap">
                {selectedRequest.aboutPrometheus}
              </p>
            </div>

            {/* Field 4: Reason to Join */}
            <div className="space-y-1.5 border-b border-[#6B7280]/15 pb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E84A0C] font-mono">
                <Sparkles className="w-4 h-4" />
                <span>سبب الرغبة في الانضمام والأهداف الشخصية:</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed font-sans bg-[#141C2F] p-3 rounded-xl border border-[#6B7280]/20 whitespace-pre-wrap">
                {selectedRequest.reasonToJoin}
              </p>
            </div>

            {/* Field 5: Portfolio Link */}
            {selectedRequest.portfolioLink && (
              <div className="space-y-1.5 border-b border-[#6B7280]/15 pb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E84A0C] font-mono">
                  <Globe className="w-4 h-4" />
                  <span>رابط معرض الأعمال / CV / LinkedIn:</span>
                </div>
                <a
                  href={selectedRequest.portfolioLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#E84A0C] hover:underline bg-[#141C2F] p-3 rounded-xl border border-[#6B7280]/20 w-full"
                >
                  <span>{selectedRequest.portfolioLink}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#6B7280]/20">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7280] font-mono">تغيير حالة الطلب:</span>
                <Button
                  onClick={() => handleStatusChange(selectedRequest.id, "ACCEPTED")}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 rounded-xl"
                >
                  قبول الطلب
                </Button>
                <Button
                  onClick={() => handleStatusChange(selectedRequest.id, "REJECTED")}
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8 rounded-xl"
                >
                  رفض الطلب
                </Button>
                <Button
                  onClick={() => handleStatusChange(selectedRequest.id, "REVIEWED")}
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs h-8 rounded-xl"
                >
                  تمت المراجعة
                </Button>
              </div>

              <Button
                onClick={() => setSelectedRequest(null)}
                variant="ghost"
                className="text-[#6B7280] hover:text-white text-xs"
              >
                إغلاق
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
