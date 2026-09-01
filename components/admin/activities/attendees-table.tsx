"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Users,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  QrCode,
} from "lucide-react";

interface Attendee {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  uniqueCode: string;
  attendedSessionsCount: number;
  totalSessions: number;
  attendanceRatio: string;
  attendancePercentage: number;
  records: {
    sessionId: string;
    sessionNumber: number;
    sessionTitle: string;
    feedback: string | null;
    attendedAt: string;
  }[];
}

interface AttendeesTableProps {
  activityTitle: string;
  totalSessions: number;
  participants: Attendee[];
}

export function AttendeesTable({
  activityTitle,
  totalSessions,
  participants,
}: AttendeesTableProps) {
  const [search, setSearch] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Attendee | null>(null);

  const filtered = participants.filter(
    (p) =>
      p.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.uniqueCode.toLowerCase().includes(search.toLowerCase())
  );

  const exportToCSV = () => {
    if (participants.length === 0) return;

    const headers = [
      "الاسم بالعربية",
      "الاسم بالإنجليزية",
      "البريد الإلكتروني",
      "الرمز الفريد (QR Code)",
      "عدد الجلسات المحضورة",
      "إجمالي الجلسات",
      "نسبة الحضور",
      "ملاحظات التقييم / الرأي",
    ];

    const rows = participants.map((p) => {
      const feedbackNotes = p.records
        .map((r) => (r.feedback ? `[جلسة ${r.sessionNumber}: ${r.feedback}]` : ""))
        .filter(Boolean)
        .join(" | ");

      return [
        `"${p.nameAr.replace(/"/g, '""')}"`,
        `"${p.nameEn.replace(/"/g, '""')}"`,
        `"${p.email}"`,
        `"${p.uniqueCode}"`,
        p.attendedSessionsCount,
        p.totalSessions,
        `"${p.attendanceRatio} (${p.attendancePercentage}%)"`,
        `"${feedbackNotes.replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `حضور_${activityTitle.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو البريد أو رمز QR..."
            className="ps-9 bg-[#0D1322] border-[#1E293B] text-white text-xs h-10 rounded-xl"
          />
        </div>

        {/* Export Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-mono text-stone-400">
            الإجمالي: {participants.length} مسجل
          </span>
          <Button
            onClick={exportToCSV}
            disabled={participants.length === 0}
            size="sm"
            className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>تصدير إلى ملف CSV</span>
          </Button>
        </div>

      </div>

      {/* Table Container */}
      <Card className="p-0 bg-[#0D1322] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            
            <thead className="bg-[#080C16] border-b border-[#1E293B] text-stone-400 font-mono text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">المشارك (عربي / English)</th>
                <th className="py-3.5 px-4 font-bold">البريد الإلكتروني</th>
                <th className="py-3.5 px-4 font-bold">رمز التحقق (QR)</th>
                <th className="py-3.5 px-4 font-bold">نسبة الحضور</th>
                <th className="py-3.5 px-4 font-bold">الحالة</th>
                <th className="py-3.5 px-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1E293B] font-sans">
              {filtered.length > 0 ? (
                filtered.map((p) => {
                  const isPassed = p.attendancePercentage >= 75;
                  const hasFeedback = p.records.some((r) => !!r.feedback);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">
                          {p.nameAr}
                        </div>
                        <div className="text-[11px] font-mono text-stone-400">
                          {p.nameEn}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-mono text-stone-300">
                        {p.email}
                      </td>

                      {/* Unique Code */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/verify/${p.uniqueCode}`}
                          target="_blank"
                          className="font-mono text-xs font-bold text-[#E84A0C] hover:underline flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{p.uniqueCode}</span>
                          <ExternalLink className="w-3 h-3 text-stone-500" />
                        </Link>
                      </td>

                      {/* Attendance Ratio */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between font-mono text-xs">
                            <span className="font-bold text-white">
                              {p.attendanceRatio} جلسة
                            </span>
                            <span className="text-stone-400">
                              {p.attendancePercentage}%
                            </span>
                          </div>
                          <div className="w-28 h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isPassed ? "bg-emerald-400" : "bg-[#E84A0C]"
                              }`}
                              style={{ width: `${p.attendancePercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {isPassed ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                            مستحق لشهادة المشاركة
                          </Badge>
                        ) : (
                          <Badge variant="dark" className="text-stone-400 text-[10px]">
                            حضور جزئي
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {hasFeedback && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedFeedback(p)}
                              className="h-7 px-2 text-[11px] border-[#1E293B] text-amber-400 hover:text-amber-300 gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>التقييم</span>
                            </Button>
                          )}
                          <Link href={`/verify/${p.uniqueCode}`} target="_blank">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-[11px] border-[#1E293B] text-stone-300 hover:text-white gap-1"
                            >
                              <ShieldCheck className="w-3 h-3 text-[#E84A0C]" />
                              <span>توثيق</span>
                            </Button>
                          </Link>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400 font-sans">
                    <Users className="w-8 h-8 text-stone-500 mx-auto mb-2" />
                    <p>لا يوجد مشاركون مسجلون يطابقون البحث حالياً.</p>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </Card>

      {/* Feedback Dialog */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0D1322] border border-[#1E293B] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  ملاحظات وتقييمات المشارك: {selectedFeedback.nameAr}
                </h3>
                <p className="text-xs font-mono text-stone-400">
                  {selectedFeedback.email} • {selectedFeedback.uniqueCode}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFeedback(null)}
                className="text-stone-400 hover:text-white"
              >
                إغلاق
              </Button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedFeedback.records
                .filter((r) => !!r.feedback)
                .map((rec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#080C16] border border-[#1E293B] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#E84A0C]">
                      <span>{rec.sessionTitle}</span>
                      <span className="text-stone-500">
                        {new Date(rec.attendedAt).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                    <p className="text-stone-200 leading-relaxed font-sans italic">
                      "{rec.feedback}"
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
