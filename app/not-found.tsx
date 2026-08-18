import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, FileText, Users, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark-950 text-foreground font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="w-full max-w-lg text-center space-y-6 relative z-10">
        
        {/* Brand Logo Symbol */}
        <div className="w-14 h-14 rounded-2xl bg-brand-dark-900 border border-brand-dark-800 flex items-center justify-center mx-auto shadow-2xl">
          <span className="w-4 h-4 bg-brand-orange rounded-sm rotate-45" />
        </div>

        <div className="space-y-2">
          <Badge variant="dark" className="bg-red-500/10 text-red-400 border-red-500/30 font-mono text-xs">
            404 • RESOURCE NOT FOUND
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Page Does Not Exist
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray-400 leading-relaxed max-w-md mx-auto">
            The resource or page you requested could not be located in the Prometheus Voluntary Team platform registry. It may have been moved or archived.
          </p>
        </div>

        {/* Quick Navigation Action Grid */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button size="sm" className="gap-2 text-xs w-full sm:w-auto">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/articles">
            <Button variant="outline" size="sm" className="gap-2 text-xs w-full sm:w-auto">
              <FileText className="w-4 h-4 text-brand-orange" />
              <span>Prometheus Post</span>
            </Button>
          </Link>
          <Link href="/members">
            <Button variant="outline" size="sm" className="gap-2 text-xs w-full sm:w-auto">
              <Users className="w-4 h-4 text-brand-orange" />
              <span>Members Roster</span>
            </Button>
          </Link>
        </div>

        <p className="text-[11px] font-mono text-brand-gray-600 pt-6">
          Prometheus Voluntary Team • Institutional System
        </p>

      </div>

    </div>
  );
}
