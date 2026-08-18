"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleStatus, RoleType } from "@prisma/client";
import {
  submitArticleAction,
  reviewArticleAction,
  requestArticleChangesAction,
  publishArticleAction,
} from "@/app/actions/article-actions";
import {
  Send,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  FileCheck,
  MessageSquare,
} from "lucide-react";

interface ArticleWorkflowPanelProps {
  articleId: string;
  currentStatus: ArticleStatus;
  editorNotes?: string;
  authorId: string;
  authorName: string;
  currentUserId: string;
  userRoles: RoleType[];
}

export function ArticleWorkflowPanel({
  articleId,
  currentStatus,
  editorNotes,
  authorId,
  authorName,
  currentUserId,
  userRoles,
}: ArticleWorkflowPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [showNotesForm, setShowNotesForm] = useState(false);

  const isAuthor = authorId === currentUserId;
  const isEditor = userRoles.includes("POST_EDITOR");
  const isAdmin = userRoles.includes("ADMIN");
  const isSelfPublishAttempt = isAuthor && !isAdmin;

  const handleAction = async (actionFn: () => Promise<any>) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await actionFn();
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesInput.trim()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      await requestArticleChangesAction(articleId, notesInput);
      setShowNotesForm(false);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to request changes.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (currentStatus) {
      case "DRAFT":
        return <Badge variant="dark" className="bg-zinc-800 text-zinc-200 border-zinc-700">DRAFT</Badge>;
      case "SUBMITTED":
        return <Badge variant="dark" className="bg-blue-500/20 text-blue-400 border-blue-500/40">SUBMITTED FOR REVIEW</Badge>;
      case "IN_REVIEW":
        return <Badge variant="dark" className="bg-purple-500/20 text-purple-400 border-purple-500/40">UNDER REVIEW</Badge>;
      case "CHANGES_REQUESTED":
        return <Badge variant="dark" className="bg-amber-500/20 text-amber-400 border-amber-500/40">CHANGES REQUESTED</Badge>;
      case "PUBLISHED":
        return <Badge variant="dark" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">PUBLISHED</Badge>;
      default:
        return <Badge variant="outline">{currentStatus}</Badge>;
    }
  };

  return (
    <Card className="p-6 bg-brand-dark-900/90 border-brand-dark-800 space-y-6">
      
      {/* Current Workflow Status Block */}
      <div className="space-y-3 pb-4 border-b border-brand-dark-800">
        <span className="text-[10px] font-mono text-brand-gray-500 uppercase tracking-widest block">
          Workflow Pipeline Status
        </span>
        <div className="flex items-center justify-between">
          {getStatusBadge()}
        </div>
      </div>

      {/* Editor Notes Feedback Box */}
      {currentStatus === "CHANGES_REQUESTED" && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Editor Revisions Requested</span>
          </div>
          <p className="text-amber-200 leading-relaxed font-sans">
            "{editorNotes || "Please review article structure and citations before resubmitting."}"
          </p>
        </div>
      )}

      {/* Security Rule Violation Alert */}
      {isSelfPublishAttempt && (
        <div className="p-3.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Security Rule: As author of this piece, an independent Editor must review and approve it.
          </span>
        </div>
      )}

      {/* Action Errors */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          {errorMessage}
        </div>
      )}

      {/* Workflow Action Buttons */}
      <div className="space-y-3">
        
        {/* 1. Author Action: Submit for Review */}
        {(currentStatus === "DRAFT" || currentStatus === "CHANGES_REQUESTED") && (
          <Button
            onClick={() => handleAction(() => submitArticleAction(articleId))}
            disabled={loading}
            className="w-full justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Submit for Review</span>
          </Button>
        )}

        {/* 2. Editor Action: Mark Under Review */}
        {currentStatus === "SUBMITTED" && (isEditor || isAdmin) && (
          <Button
            onClick={() => handleAction(() => reviewArticleAction(articleId))}
            disabled={loading}
            variant="secondary"
            className="w-full justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4 text-purple-400" />}
            <span>Start Editorial Review</span>
          </Button>
        )}

        {/* 3. Editor Action: Request Changes Form */}
        {(currentStatus === "SUBMITTED" || currentStatus === "IN_REVIEW") && (isEditor || isAdmin) && (
          <>
            {!showNotesForm ? (
              <Button
                onClick={() => setShowNotesForm(true)}
                disabled={loading}
                variant="outline"
                className="w-full justify-center gap-2 border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Request Revisions</span>
              </Button>
            ) : (
              <form onSubmit={handleRequestChanges} className="space-y-3 p-3 rounded-lg bg-brand-dark-950 border border-brand-dark-800">
                <label className="text-[11px] font-mono text-brand-gray-300 block">
                  Notes for Author:
                </label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  required
                  rows={3}
                  placeholder="Specify required changes..."
                  className="w-full p-2 bg-brand-dark-900 border border-brand-dark-800 rounded text-xs text-white placeholder:text-brand-gray-600 font-mono"
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Send Notes
                  </Button>
                  <Button type="button" onClick={() => setShowNotesForm(false)} size="sm" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </>
        )}

        {/* 4. Editor / Admin Action: Approve & Publish */}
        {(currentStatus === "SUBMITTED" || currentStatus === "IN_REVIEW" || currentStatus === "CHANGES_REQUESTED") && (isEditor || isAdmin) && (
          <Button
            onClick={() => handleAction(() => publishArticleAction(articleId))}
            disabled={loading || isSelfPublishAttempt}
            className="w-full justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
            <span>Approve & Publish Article</span>
          </Button>
        )}

      </div>

    </Card>
  );
}
