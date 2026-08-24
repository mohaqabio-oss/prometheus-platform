"use client";

import React, { useState } from "react";
import {
  DepartmentRecord,
  createDepartmentAction,
  updateDepartmentAction,
  deleteDepartmentAction,
} from "@/app/actions/department-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

interface DepartmentsClientPageProps {
  departments: DepartmentRecord[];
}

export function DepartmentsClientPage({ departments }: DepartmentsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingDept, setEditingDept] = useState<DepartmentRecord | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredDepts = departments.filter(
    (d) =>
      d.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (modalMode === "create") {
        const res = await createDepartmentAction(null, formData);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setModalMode(null);
        }
      } else if (modalMode === "edit" && editingDept) {
        formData.append("id", editingDept.id);
        const res = await updateDepartmentAction(null, formData);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setModalMode(null);
          setEditingDept(null);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا القسم النهائي؟")) return;
    setDeletingId(id);
    try {
      await deleteDepartmentAction(id);
    } catch (err: any) {
      alert(err.message || "فشل حذف القسم.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#6B7280]/20 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="orange" className="text-xs">
              إدارة الهيكل التنظيمي (Departments)
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            الأقسام والتخصصات التشغيلية
          </h1>
          <p className="text-xs text-[#6B7280] font-sans">
            إضافة وتعديل الأقسام الأكاديمية والتقنية وتحديث الخيارات المتاحة في استمارة الانضمام والأعضاء.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setModalMode("create");
              setEditingDept(null);
              setErrorMsg(null);
            }}
            className="bg-[#E84A0C] hover:bg-[#D03E06] text-white gap-2 rounded-xl text-xs shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قسم جديد</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            placeholder="ابحث باسم القسم بالعربية أو الانكليزية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 ps-10 pe-4 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl text-xs text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-sans"
          />
        </div>

        <div className="text-xs font-mono text-[#6B7280]">
          إجمالي الأقسام المعروضة: <strong className="text-white">{filteredDepts.length} أقسام</strong>
        </div>
      </div>

      {/* Departments Table */}
      <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl shadow-xl overflow-hidden space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs font-sans">
            <thead>
              <tr className="border-b border-[#6B7280]/20 text-[#6B7280] font-mono text-[11px]">
                <th className="py-3 px-4">اسم القسم (بالعربية)</th>
                <th className="py-3 px-4">Department Name (English)</th>
                <th className="py-3 px-4">تاريخ الإنشاء</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6B7280]/10">
              {filteredDepts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#6B7280] font-mono">
                    لا توجد أقسام مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredDepts.map((dept) => (
                  <tr key={dept.id} className="hover:bg-[#1A2B4A]/30 transition-colors">
                    
                    {/* Arabic Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#E84A0C]">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white text-sm">{dept.nameAr}</span>
                      </div>
                    </td>

                    {/* English Name */}
                    <td className="py-4 px-4 font-mono text-[#6B7280]">
                      {dept.nameEn}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 font-mono text-[#6B7280]">
                      {new Date(dept.createdAt).toLocaleDateString("ar-EG")}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        
                        <Button
                          onClick={() => {
                            setEditingDept(dept);
                            setModalMode("edit");
                            setErrorMsg(null);
                          }}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 gap-1 text-xs rounded-xl border-[#6B7280]/30 text-white hover:text-[#E84A0C]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </Button>

                        <Button
                          onClick={() => handleDelete(dept.id)}
                          disabled={deletingId === dept.id}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                        >
                          {deletingId === dept.id ? (
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

      {/* Add / Edit Department Modal Dialog */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0D0D0D] border border-[#6B7280]/30 rounded-2xl p-6 shadow-2xl space-y-6 text-white text-right">
            
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#E84A0C]" />
                <h3 className="font-display font-bold text-base">
                  {modalMode === "create" ? "إضافة قسم تشغيلي جديد" : "تعديل بيانات القسم"}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-[#6B7280] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
              
              <div className="space-y-1.5">
                <label className="block text-[#6B7280] font-medium">اسم القسم (بالعربية)</label>
                <input
                  type="text"
                  name="nameAr"
                  defaultValue={editingDept?.nameAr || ""}
                  required
                  placeholder="مثال: قسم ذكاء الآلة والأبحاث"
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[#6B7280] font-medium">Department Name (English)</label>
                <input
                  type="text"
                  name="nameEn"
                  defaultValue={editingDept?.nameEn || ""}
                  required
                  placeholder="e.g. Artificial Intelligence & Research"
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C] font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#6B7280]/20">
                <Button
                  type="button"
                  onClick={() => setModalMode(null)}
                  variant="ghost"
                  className="text-[#6B7280] hover:text-white"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E84A0C] hover:bg-[#D03E06] text-white gap-2 rounded-xl"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{modalMode === "create" ? "إضافة القسم" : "حفظ التغيرات"}</span>
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
