import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addPartnerAction } from "@/app/actions/partner-actions";
import { ArrowLeft, Building2 } from "lucide-react";
import { PartnerForm } from "@/components/admin/partner-form";

export const dynamic = "force-dynamic";

export default function NewPartnerPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/partners"
          className="p-2 rounded-xl bg-[#1A2B4A] text-[#6B7280] hover:text-white hover:bg-[#D49B4B]/10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-cairo text-2xl font-extrabold text-white">إضافة شريك مؤسسي جديد</h1>
          <p className="text-xs text-[#6B7280]">أضف مؤسسة أو شريكاً إلى شبكة بروميثيوس.</p>
        </div>
      </div>
      <PartnerForm saveAction={addPartnerAction} />
    </div>
  );
}
