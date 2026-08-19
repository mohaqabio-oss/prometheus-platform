"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loginAction } from "@/app/actions/auth-actions";
import { KeyRound, Mail, Lock, ShieldCheck, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-grid-pattern radial-glow-orange transition-colors duration-200">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-foreground/70 dark:text-brand-gray-400 hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Prometheus Home</span>
        </Link>

        {/* Login Box */}
        <Card className="p-8 bg-card dark:bg-brand-dark-900/90 border-border dark:border-brand-dark-800 shadow-2xl backdrop-blur-md">
          
          {/* Brand Logo Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted dark:bg-brand-dark-850 border border-border dark:border-brand-dark-700 text-brand-orange shadow-lg shadow-brand-orange/10 mb-1">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground dark:text-white">
              STAFF & MEMBER <span className="text-brand-orange">LOGIN</span>
            </h1>
            <p className="text-xs text-foreground/70 dark:text-brand-gray-400 font-sans">
              Enter your credentials to access the Prometheus administrative dashboard.
            </p>
          </div>

          {/* Error Notification */}
          {state?.error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-500 text-xs font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@prometheus.local"
                  className="w-full h-11 pl-10 pr-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-foreground/80 dark:text-brand-gray-300 block">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-4 bg-background dark:bg-brand-dark-950 border border-border dark:border-brand-dark-800 rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-brand-orange/60 transition-colors font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 text-sm font-semibold tracking-wider uppercase mt-2 gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </Button>
          </form>

        </Card>

        {/* Development Seed Accounts Helper */}
        <div className="p-4 rounded-xl border border-border dark:border-brand-dark-800 bg-card/60 dark:bg-brand-dark-900/60 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-brand-orange font-bold">
            <span>TEST CREDENTIALS (SEED ACCOUNTS)</span>
            <span className="text-[10px] text-muted-foreground font-normal">Password: password123</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-foreground/70 dark:text-brand-gray-400 text-[11px] pt-1">
            <div>
              <span className="text-foreground dark:text-white block font-medium">ADMIN:</span>
              <code>admin@prometheus.local</code>
            </div>
            <div>
              <span className="text-foreground dark:text-white block font-medium">HR EDITOR:</span>
              <code>hr@prometheus.local</code>
            </div>
            <div>
              <span className="text-foreground dark:text-white block font-medium">POST EDITOR:</span>
              <code>editor@prometheus.local</code>
            </div>
            <div>
              <span className="text-foreground dark:text-white block font-medium">AUTHOR:</span>
              <code>author@prometheus.local</code>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
