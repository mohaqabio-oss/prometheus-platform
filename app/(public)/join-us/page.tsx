"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { submitApplicationAction } from "@/app/actions/application-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";

export default function JoinUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const res = await submitApplicationAction(prevState, formData);
    if (res.success) {
      setSubmitted(true);
    }
    return res;
  }, null);

  return (
    <div className="py-12 sm:py-20 px-4 max-w-4xl mx-auto space-y-12">
      
      {/* Header */}
      <SectionHeader
        badgeText="Voluntary Team Recruitment"
        title="Ignite Your Potential —"
        highlightedTitle="Join Prometheus"
        description="We do not accept open public registration. Instead, passionate engineers, researchers, and educators apply to join our structured voluntary departments."
      />

      {/* Success State View */}
      {submitted ? (
        <Card className="p-8 sm:p-12 bg-brand-dark-900/90 border-emerald-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="dark" className="bg-emerald-500/20 text-emerald-500 border-emerald-500/40 font-mono text-xs">
              APPLICATION SUBMITTED SUCCESSFULLY
            </Badge>
            <h2 className="font-display text-2xl font-bold text-foreground dark:text-white">
              Thank You for Applying
            </h2>
            <p className="text-sm text-foreground/80 dark:text-brand-gray-300 max-w-lg mx-auto leading-relaxed">
              Your voluntary application has been registered in the Prometheus HR review queue. Our HR & Operations team will review your application and contact you via email regarding the next interview steps.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 text-xs font-mono text-foreground/70 dark:text-brand-gray-400 max-w-md mx-auto space-y-1">
            <p className="text-foreground dark:text-white font-bold">What Happens Next?</p>
            <p>1. Preliminary HR Review (24–48 hours)</p>
            <p>2. Departmental Interview & Skill Assessment</p>
            <p>3. Onboarding & Official Member Registration</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/members">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <span>Browse Current Members Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/articles">
              <Button size="sm" className="gap-2 text-xs">
                <span>Read Prometheus Post Publications</span>
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        /* Application Form */
        <Card className="p-6 sm:p-10 bg-card dark:bg-brand-dark-900/90 border-border dark:border-brand-dark-800 space-y-8 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-border dark:border-brand-dark-800 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground dark:text-white">
                Candidate Application Form
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                All fields marked with an asterisk (*) are required.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-brand-orange bg-brand-dark-850 px-3 py-1.5 rounded border border-brand-dark-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified HR Pipeline</span>
            </div>
          </div>

          {state?.error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            
            {/* Full Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Layla Hassan"
                  className="w-full h-11 px-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="layla.hassan@example.com"
                  className="w-full h-11 px-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60 font-mono"
                />
              </div>

            </div>

            {/* Phone, Age & Education Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+964 770 000 0000"
                  className="w-full h-11 px-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                  Age
                </label>
                <input
                  type="text"
                  name="age"
                  placeholder="e.g. 23"
                  className="w-full h-11 px-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                  Target Department *
                </label>
                <select
                  name="departmentName"
                  required
                  className="w-full h-11 px-3 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-xs font-mono text-foreground dark:text-brand-gray-300 focus:outline-none focus:border-brand-orange/60"
                >
                  <option value="Technology">Technology</option>
                  <option value="Research">Research</option>
                  <option value="Education">Education</option>
                  <option value="HR & Operations">HR & Operations</option>
                </select>
              </div>

            </div>

            {/* Academic Background & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                  Academic Background / Major
                </label>
                <input
                  type="text"
                  name="education"
                  placeholder="e.g. B.Sc. Computer Engineering (Final Year)"
                  className="w-full h-11 px-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                  Skills & Core Expertise
                </label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React, Next.js, Python, Scientific Writing"
                  className="w-full h-11 px-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60 font-sans"
                />
              </div>

            </div>

            {/* Portfolio / Resume URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                Portfolio / GitHub / LinkedIn URL (Optional)
              </label>
              <input
                type="url"
                name="portfolioUrl"
                placeholder="https://github.com/your-username"
                className="w-full h-11 px-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-xs font-mono text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60"
              />
            </div>

            {/* Motivation Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                Why do you want to join Prometheus Voluntary Team? *
              </label>
              <textarea
                name="motivation"
                required
                rows={5}
                placeholder="Tell us about your drive, voluntary goals, and how you want to contribute..."
                className="w-full p-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60 font-sans leading-relaxed"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-border dark:border-brand-dark-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-brand-gray-500 hidden sm:inline">
                Prometheus HR Recruitment Policy
              </span>

              <Button
                type="submit"
                disabled={isPending}
                className="gap-2 px-8"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Volunteer Application</span>
                  </>
                )}
              </Button>
            </div>

          </form>

        </Card>
      )}

    </div>
  );
}
