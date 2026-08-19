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
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-grid-pattern radial-glow-orange transition-all duration-300">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral hover:text-accent transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Prometheus Home</span>
        </Link>

        {/* Login Box */}
        <Card className="p-8 bg-card border-neutral-200 dark:border-neutral-800 shadow-md rounded-2xl backdrop-blur-md transition-all duration-300">
          
          {/* Brand Logo Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 text-accent shadow-sm mb-1">
              <KeyRound className="w-6 h-6 text-accent" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-secondary dark:text-white">
              STAFF & MEMBER <span className="text-accent">LOGIN</span>
            </h1>
            <p className="text-xs text-neutral font-sans">
              Enter your official credentials to access the Prometheus administrative dashboard.
            </p>
          </div>

          {/* Error Notification */}
          {state?.error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-500 text-xs font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-secondary dark:text-neutral-300 block">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@prometheus.local"
                  className="w-full h-11 pl-10 pr-4 bg-background border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm text-foreground placeholder:text-neutral focus:outline-none focus:border-accent transition-all duration-300 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-secondary dark:text-neutral-300 block">
                  Security Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-4 bg-background border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm text-foreground placeholder:text-neutral focus:outline-none focus:border-accent transition-all duration-300 font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 text-sm font-semibold tracking-wider uppercase mt-2 gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl shadow-accent transition-all duration-300"
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

      </div>
    </div>
  );
}
