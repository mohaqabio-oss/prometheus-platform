"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  updateApplicationStatusAction,
  LocalApplicationRecord,
} from "@/app/actions/application-actions";
import { ApplicationStatus } from "@prisma/client";
import {
  Eye,
  X,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  ExternalLink,
  User,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  Loader2,
  FileText,
} from "lucide-react";

interface ApplicationReviewPanelProps {
  application: LocalApplicationRecord;
}

export function ApplicationReviewPanel({ application }: ApplicationReviewPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(application.notes || "");
  const [message, setMessage] = useState("");

  const handleUpdateStatus = async (status: ApplicationStatus) => {
    setLoading(true);
    setMessage("");
    try {
      await updateApplicationStatusAction(application.id, status, notes);
      setMessage(`Application status updated to ${status}.`);
      router.refresh();
    } catch (err: any) {
      setMessage(err.message || "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="h-8 px-2.5 text-xs gap-1"
      >
        <Eye className="w-3.5 h-3.5 text-brand-orange" />
        <span>Review Candidate</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-brand-dark-900 border border-brand-dark-800 rounded-xl p-6 sm:p-8 space-y-6 text-left my-8 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-brand-dark-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="orange" className="text-[10px]">
                    {application.departmentName} Department
                  </Badge>
                  <span className="text-xs font-mono text-brand-gray-500">
                    ID: {application.id}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-xl">
                  {application.fullName}
                </h3>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-brand-gray-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Notification message */}
            {message && (
              <div className="p-3 rounded bg-brand-dark-850 border border-brand-dark-800 text-brand-orange text-xs font-mono">
                {message}
              </div>
            )}

            {/* Candidate Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              
              <div className="p-3 rounded bg-brand-dark-950 border border-brand-dark-800 space-y-1">
                <span className="text-brand-gray-500 text-[10px] uppercase flex items-center gap-1">
                  <Mail className="w-3 h-3 text-brand-orange" /> Email Address
                </span>
                <p className="text-white font-sans font-medium">{application.email}</p>
              </div>

              <div className="p-3 rounded bg-brand-dark-950 border border-brand-dark-800 space-y-1">
                <span className="text-brand-gray-500 text-[10px] uppercase flex items-center gap-1">
                  <Phone className="w-3 h-3 text-brand-orange" /> Phone Number
                </span>
                <p className="text-white font-sans font-medium">{application.phone}</p>
              </div>

              <div className="p-3 rounded bg-brand-dark-950 border border-brand-dark-800 space-y-1">
                <span className="text-brand-gray-500 text-[10px] uppercase flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-brand-orange" /> Academic Background
                </span>
                <p className="text-white font-sans font-medium">{application.education}</p>
              </div>

              <div className="p-3 rounded bg-brand-dark-950 border border-brand-dark-800 space-y-1">
                <span className="text-brand-gray-500 text-[10px] uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-orange" /> Skills & Expertise
                </span>
                <p className="text-white font-sans font-medium">{application.skills}</p>
              </div>

            </div>

            {/* Portfolio Link */}
            {application.portfolioUrl && (
              <div className="p-3 rounded bg-brand-dark-950 border border-brand-dark-800 flex items-center justify-between text-xs">
                <span className="font-mono text-brand-gray-400">Portfolio / GitHub / Resume:</span>
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-brand-orange hover:underline flex items-center gap-1"
                >
                  <span>{application.portfolioUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Candidate Motivation Essay */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-brand-gray-400 block">
                Why Candidate Wants to Join Prometheus:
              </label>
              <div className="p-4 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-xs font-sans text-brand-gray-200 leading-relaxed whitespace-pre-wrap">
                "{application.motivation}"
              </div>
            </div>

            {/* HR Internal Review Notes */}
            <div className="space-y-1.5 pt-2 border-t border-brand-dark-800">
              <label className="text-xs font-mono font-medium text-brand-gray-400 block">
                HR Internal Review Notes:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add interview notes or evaluation remarks..."
                className="w-full p-3 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-xs font-mono text-white placeholder:text-brand-gray-600 focus:outline-none focus:border-brand-orange/60"
              />
            </div>

            {/* Pipeline Action Buttons */}
            <div className="pt-4 border-t border-brand-dark-800 space-y-3">
              <span className="text-[10px] font-mono text-brand-gray-500 uppercase tracking-widest block">
                HR Pipeline Actions (Current Status: {application.status})
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                
                <Button
                  onClick={() => handleUpdateStatus("UNDER_REVIEW")}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full text-purple-400 border-purple-500/40 hover:bg-purple-500/10"
                >
                  Under Review
                </Button>

                <Button
                  onClick={() => handleUpdateStatus("INTERVIEW_SCHEDULED")}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full text-blue-400 border-blue-500/40 hover:bg-blue-500/10"
                >
                  Schedule Interview
                </Button>

                <Button
                  onClick={() => handleUpdateStatus("ACCEPTED")}
                  disabled={loading}
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Accept Candidate
                </Button>

                <Button
                  onClick={() => handleUpdateStatus("REJECTED")}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-400 hover:bg-red-500/10"
                >
                  Reject Candidate
                </Button>

              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
