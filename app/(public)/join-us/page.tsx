"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { submitApplicationAction } from "@/app/actions/application-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
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
    <div className="py-12 sm:py-20 px-4 max-w-4xl mx-auto space-y-12 transition-all duration-300">
      
      {/* Header */}
      <SectionHeader
        badgeText="Voluntary Team Recruitment"
        title="Ignite Your Potential —"
        highlightedTitle="Join Prometheus"
        description="We do not accept open public registration. Instead, passionate engineers, researchers, and educators apply to join our structured voluntary departments."
      />

      {/* Success State View */}
      {submitted ? (
        <Card className="p-8 sm:p-12 bg-[#0D0D0D] border border-emerald-500/30 text-center space-y-6 shadow-md rounded-2xl transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="dark" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-mono text-xs">
              APPLICATION SUBMITTED SUCCESSFULLY
            </Badge>
            <h2 className="font-display text-2xl font-bold text-white">
              Thank You for Applying
            </h2>
            <p className="text-sm text-[#6B7280] max-w-lg mx-auto leading-relaxed">
              Your voluntary application has been registered in the Prometheus HR review queue. Our HR & Operations team will review your application and contact you via email regarding the next interview steps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 text-xs font-mono text-[#6B7280] max-w-md mx-auto space-y-1">
            <p className="text-white font-bold">What Happens Next?</p>
            <p>1. Preliminary HR Review (24–48 hours)</p>
            <p>2. Departmental Interview & Skill Assessment</p>
            <p>3. Onboarding & Official Member Registration</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/members">
              <Button variant="outline" size="sm" className="gap-2 text-xs rounded-xl border-[#6B7280]/30 text-white">
                <span>Browse Current Members Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/articles">
              <Button size="sm" className="gap-2 text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md">
                <span>Read Prometheus Post Publications</span>
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        /* Application Form */
        <Card className="p-6 sm:p-10 bg-[#0D0D0D] border border-[#6B7280]/20 space-y-8 shadow-md rounded-2xl transition-all duration-300">
          
          <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Candidate Application Form
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                All fields marked with an asterisk (*) are required.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-[#E84A0C] bg-[#E84A0C]/10 px-3 py-1.5 rounded-xl border border-[#E84A0C]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified HR Pipeline</span>
            </div>
          </div>

          {state?.error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            
            {/* Full Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[#6B7280] block">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Layla Hassan"
                  className="w-full h-11 px-4 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-sans shadow-sm transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[#6B7280] block">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="layla.hassan@example.com"
                  className="w-full h-11 px-4 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-mono shadow-sm transition-all duration-300"
                />
              </div>

            </div>

            {/* Phone, Age & Education Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[#6B7280] block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+964 770 000 0000"
                  className="w-full h-11 px-4 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-mono shadow-sm transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[#6B7280] block">
                  Age
                </label>
                <input
                  type="text"
                  name="age"
                  placeholder="e.g. 23"
                  className="w-full h-11 px-4 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-mono shadow-sm transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[#6B7280] block">
                  Target Department *
                </label>
                <select
                  name="departmentName"
                  required
                  className="w-full h-11 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#E84A0C] shadow-sm transition-all duration-300"
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
                <label className="text-xs font-mono font-medium text-[#6B7280] block">
                  Academic Background / Major
                </label>
                <input
                  type="text"
                  name="education"
                  placeholder="e.g. B.Sc. Computer Engineering (Final Year)"
                  className="w-full h-11 px-4 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-sans shadow-sm transition-all duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[#6B7280] block">
                  Skills & Core Expertise
                </label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React, Next.js, Python, Scientific Writing"
                  className="w-full h-11 px-4 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-sans shadow-sm transition-all duration-300"
                />
              </div>

            </div>

            {/* Portfolio / Resume URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#6B7280] block">
                Portfolio / GitHub / LinkedIn URL (Optional)
              </label>
              <input
                type="url"
                name="portfolioUrl"
                placeholder="https://github.com/your-username"
                className="w-full h-11 px-4 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-xs font-mono text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] shadow-sm transition-all duration-300"
              />
            </div>

            {/* Motivation Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#6B7280] block">
                Why do you want to join Prometheus Voluntary Team? *
              </label>
              <textarea
                name="motivation"
                required
                rows={5}
                placeholder="Tell us about your drive, voluntary goals, and how you want to contribute..."
                className="w-full p-4 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-sans leading-relaxed shadow-sm transition-all duration-300"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#6B7280]/20 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#6B7280] hidden sm:inline">
                Prometheus HR Recruitment Policy
              </span>

              <Button
                type="submit"
                disabled={isPending}
                className="gap-2 px-8 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md transition-all duration-300"
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
