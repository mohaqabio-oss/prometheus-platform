"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  toggleSessionFormAction,
  updateSessionInfoAction,
} from "@/app/actions/activity-actions";
import {
  QrCode,
  Link2,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  Users,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  X,
  Sparkles,
} from "lucide-react";

interface SessionItem {
  id: string;
  sessionNumber: number;
  title: string;
  description: string | null;
  formStatus: "OPEN" | "CLOSED";
  expiresAt: string | null;
  isExpired: boolean;
  attendanceCount: number;
}

interface SessionManagerProps {
  activityId: string;
  activityTitle: string;
  sessions: SessionItem[];
}

export function SessionManager({
  activityId,
  activityTitle,
  sessions,
}: SessionManagerProps) {
  const [selectedQR, setSelectedQR] = useState<{
    sessionId: string;
    sessionNumber: number;
    sessionTitle: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [editingSession, setEditingSession] = useState<SessionItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [expirationMinutesMap, setExpirationMinutesMap] = useState<
    Record<string, number>
  >({});

  const handleToggle = async (sessionId: string, currentStatus: "OPEN" | "CLOSED") => {
    const targetStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
    const minutes = expirationMinutesMap[sessionId] || 0;

    setLoadingMap((prev) => ({ ...prev, [sessionId]: true }));
    try {
      await toggleSessionFormAction(sessionId, targetStatus, minutes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [sessionId]: false }));
    }
  };

  const getAttendanceUrl = (sessionId: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/attendance/${sessionId}`;
    }
    return `https://pmthiq.online/attendance/${sessionId}`;
  };

  const handleCopyLink = (sessionId: string) => {
    const url = getAttendanceUrl(sessionId);
    navigator.clipboard.writeText(url);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    try {
      await updateSessionInfoAction(editingSession.id, editTitle, editDesc);
      setEditingSession(null);
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      
      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => {
          const isOpen = session.formStatus === "OPEN" && !session.isExpired;
          const attendanceUrl = getAttendanceUrl(session.id);
          const isLoading = loadingMap[session.id] || false;

          return (
            <Card
              key={session.id}
              className={`p-6 bg-[#0D1322] border rounded-2xl flex flex-col justify-between space-y-5 shadow-xl transition-all duration-300 ${
                isOpen
                  ? "border-emerald-500/50 shadow-emerald-950/20"
                  : "border-[#1E293B]"
              }`}
            >
              
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#E84A0C] bg-[#E84A0C]/10 border border-[#E84A0C]/30 px-2.5 py-0.5 rounded-lg">
                    الجلسة رقم {session.sessionNumber}
                  </span>

                  {isOpen ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px] gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      استمارة الحضور مفتوحة
                    </Badge>
                  ) : (
                    <Badge variant="dark" className="text-[10px] text-stone-400">
                      الاستمارة مغلقة
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="font-display text-base font-bold text-white leading-snug">
                    {session.title}
                  </h4>
                  {session.description && (
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                      {session.description}
                    </p>
                  )}
                </div>

                {/* Expiration Timer Indicator */}
                {isOpen && session.expiresAt && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      الإغلاق التلقائي:{" "}
                      {new Date(session.expiresAt).toLocaleTimeString("ar-SA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Attendance Metric */}
              <div className="p-3 rounded-xl bg-[#080C16] border border-[#1E293B] flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#E84A0C]" />
                  المسجلين حالياً
                </span>
                <span className="text-sm font-bold text-white">
                  {session.attendanceCount} مشارك
                </span>
              </div>

              {/* Action Controls */}
              <div className="space-y-3 pt-3 border-t border-[#1E293B]">
                
                {/* Timer select when closed */}
                {!isOpen && (
                  <div className="flex items-center gap-2 text-xs font-sans">
                    <span className="text-stone-400 shrink-0 text-[11px]">مؤقت تلقائي:</span>
                    <select
                      value={expirationMinutesMap[session.id] || 0}
                      onChange={(e) =>
                        setExpirationMinutesMap((prev) => ({
                          ...prev,
                          [session.id]: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full h-8 bg-[#080C16] border border-[#1E293B] rounded-lg px-2 text-[11px] text-white focus:outline-none focus:border-[#E84A0C]"
                    >
                      <option value={0}>إغلاق يدوي (بدون مؤقت)</option>
                      <option value={15}>15 دقيقة</option>
                      <option value={30}>30 دقيقة</option>
                      <option value={45}>45 دقيقة</option>
                      <option value={60}>ساعة واحدة</option>
                    </select>
                  </div>
                )}

                {/* Primary Toggle Button */}
                <Button
                  onClick={() => handleToggle(session.id, isOpen ? "OPEN" : "CLOSED")}
                  disabled={isLoading}
                  size="sm"
                  className={`w-full gap-2 text-xs font-bold rounded-xl transition-all ${
                    isOpen
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
                  }`}
                >
                  {isOpen ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>{isLoading ? "جاري الإغلاق..." : "إغلاق الاستمارة فوراً"}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isLoading ? "جاري الفتح..." : "فتح استمارة تسجيل الحضور"}</span>
                    </>
                  )}
                </Button>

                {/* Secondary Actions (QR & Copy Link) */}
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedQR({
                        sessionId: session.id,
                        sessionNumber: session.sessionNumber,
                        sessionTitle: session.title,
                      })
                    }
                    className="p-1 gap-1 border-[#1E293B] bg-[#080C16] text-stone-300 hover:text-white"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#E84A0C]" />
                    <span>رمز QR</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(session.id)}
                    className="p-1 gap-1 border-[#1E293B] bg-[#080C16] text-stone-300 hover:text-white"
                  >
                    {copiedId === session.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === session.id ? "تم النسخ" : "نسخ الرابط"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSession(session);
                      setEditTitle(session.title);
                      setEditDesc(session.description || "");
                    }}
                    className="p-1 gap-1 border-[#1E293B] bg-[#080C16] text-stone-300 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </Button>
                </div>

              </div>

            </Card>
          );
        })}
      </div>

      {/* Live QR Modal for Lecture Projections */}
      {selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0D1322] border border-[#1E293B] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            
            <button
              onClick={() => setSelectedQR(null)}
              className="absolute top-5 left-5 text-stone-400 hover:text-white p-1 rounded-full bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <Badge variant="orange" className="mx-auto">
                مسح الحضور المباشر
              </Badge>
              <h3 className="font-display text-xl font-bold text-white">
                {selectedQR.sessionTitle}
              </h3>
              <p className="text-xs text-stone-400">{activityTitle}</p>
            </div>

            {/* QR Container */}
            <div className="p-6 bg-white rounded-2xl inline-block mx-auto shadow-2xl border-4 border-[#E84A0C]">
              <QRCodeSVG
                value={getAttendanceUrl(selectedQR.sessionId)}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-stone-300">
                امسح الكود بكاميرا هاتفك لتسجيل الحضور فوراً
              </p>
              <div className="p-2.5 rounded-xl bg-[#080C16] border border-[#1E293B] text-[11px] font-mono text-stone-400 select-all truncate">
                {getAttendanceUrl(selectedQR.sessionId)}
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => handleCopyLink(selectedQR.sessionId)}
              className="w-full gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white text-xs font-bold rounded-xl"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ رابط الاستمارة المباشر</span>
            </Button>

          </div>
        </div>
      )}

      {/* Edit Session Info Dialog */}
      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0D1322] border border-[#1E293B] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-display text-base font-bold text-white">
                تعديل مسمى الجلسة رقم {editingSession.sessionNumber}
              </h3>
              <button
                onClick={() => setEditingSession(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-300 font-semibold">عنوان الجلسة</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-[#080C16] border-[#1E293B] text-white text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-semibold">وصف مختصر</label>
                <Input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="bg-[#080C16] border-[#1E293B] text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSession(null)}
                  className="border-[#1E293B] text-stone-300"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#E84A0C] hover:bg-[#D03E06] text-white font-bold"
                >
                  حفظ التعديل
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
