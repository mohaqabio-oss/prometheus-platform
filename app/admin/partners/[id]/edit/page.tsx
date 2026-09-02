import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { updatePartnerAction } from "@/app/actions/partner-actions";
import { ArrowLeft } from "lucide-react";
import { PartnerForm } from "@/components/admin/partner-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPartnerPage({ params }: Props) {
  const { id } = await params;

  let partner: any = null;
  try {
    partner = await prisma.partner.findUnique({ where: { id } });
  } catch {}

  if (!partner) notFound();

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/partners"
          className="p-2 rounded-xl bg-[#1A2B4A] text-[#6B7280] hover:text-white hover:bg-[#D49B4B]/10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-cairo text-2xl font-extrabold text-white">تعديل بيانات الشريك</h1>
          <p className="text-xs text-[#6B7280]">{partner.name}</p>
        </div>
      </div>
      <PartnerForm
        partner={{
          id: partner.id,
          name: partner.name,
          slug: partner.slug,
          description: partner.description,
          bio: partner.bio,
          logoUrl: partner.logoUrl,
          websiteUrl: partner.websiteUrl,
        }}
        saveAction={updatePartnerAction}
      />
    </div>
  );
}
