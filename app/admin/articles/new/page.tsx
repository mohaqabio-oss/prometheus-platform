"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createArticleDraftAction } from "@/app/actions/article-actions";
import { ArrowLeft, Save, FileEdit, AlertCircle, Loader2 } from "lucide-react";

export default function NewArticlePage() {
  const [state, formAction, isPending] = useActionState(createArticleDraftAction, null);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Back Button */}
      <div>
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm" className="gap-2 text-brand-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles Management</span>
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="orange" className="mb-2">Authoring Console</Badge>
          <h1 className="font-display text-2xl font-bold text-white">Create New Article Draft</h1>
          <p className="text-xs text-brand-gray-400 mt-0.5">
            Draft your technical or research publication. Articles are saved as DRAFT before submitting to editors.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {state?.error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Form */}
      <Card className="p-8 bg-brand-dark-900/90 border-brand-dark-800 space-y-6">
        <form action={formAction} className="space-y-6">
          
          {/* Article Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-brand-gray-300 block">
              Article Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Modern Relational Data Modeling with Prisma & PostgreSQL"
              className="w-full h-11 px-4 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-sm text-white placeholder:text-brand-gray-600 focus:outline-none focus:border-brand-orange/60 font-sans"
            />
          </div>

          {/* Excerpt & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-mono font-medium text-brand-gray-300 block">
                Short Excerpt / Summary
              </label>
              <input
                type="text"
                name="excerpt"
                placeholder="Concise 1-2 sentence overview for article cards..."
                className="w-full h-11 px-4 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-sm text-white placeholder:text-brand-gray-600 focus:outline-none focus:border-brand-orange/60 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-brand-gray-300 block">
                Category
              </label>
              <select
                name="categoryName"
                className="w-full h-11 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-xs font-mono text-brand-gray-300 focus:outline-none focus:border-brand-orange/60"
              >
                <option value="Technology">Technology</option>
                <option value="Research">Research</option>
                <option value="Education">Education</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>

          </div>

          {/* Cover Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-brand-gray-300 block">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              name="coverImage"
              placeholder="https://images.unsplash.com/..."
              className="w-full h-11 px-4 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-xs font-mono text-white placeholder:text-brand-gray-600 focus:outline-none focus:border-brand-orange/60"
            />
          </div>

          {/* Article Body Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-brand-gray-300 block">
              Article Content (Markdown supported) *
            </label>
            <textarea
              name="content"
              required
              rows={12}
              placeholder="Write your article body content here..."
              className="w-full p-4 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-sm text-white placeholder:text-brand-gray-600 focus:outline-none focus:border-brand-orange/60 font-mono leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-brand-dark-800 flex items-center justify-end gap-3">
            <Link href="/admin/articles">
              <Button type="button" variant="ghost" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Draft...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save as Draft</span>
                </>
              )}
            </Button>
          </div>

        </form>
      </Card>

    </div>
  );
}
