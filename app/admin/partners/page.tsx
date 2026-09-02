import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { deletePartnerAction } from "@/app/actions/partner-actions";
import { Button } from "@/components/ui/button";
import { Building2, Plus, Globe, Trash2, Edit3, ExternalLink, FolderGit2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  let partners: any[] = [];
  try {
    partners = await prisma.partner.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { articles: true, projects: true } },
      },
    });
  } catch {}

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cairo text-3xl font-extrabold text-white flex items-center gap-3">
            <Building2 className="w-7 h-7 text-[#D49B4B]" />
            الشركاء والمؤسسات
          </h1>
          <p className="text-sm text-[#6B7280] font-sans mt-1">
            إدارة الشركاء المؤسسيين وربطهم بالمقالات والمشاريع البحثية.
          </p>
        </div>
        <Link href="/admin/partners/new">
          <Button className="gap-2 bg-[#D49B4B] hover:bg-[#c08a3a] text-[#0A0F1D] rounded-xl font-bold">
            <Plus className="w-4 h-4" />
            شريك جديد
          </Button>
        </Link>
      </div>

      {/* Partners Grid */}
      {partners.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-dashed border-[#1E293B] bg-[#141C2F]/40">
          <Building2 className="w-12 h-12 text-[#6B7280]/40 mx-auto mb-4" />
          <p className="text-[#94A3B8] font-cairo text-lg font-bold">لا يوجد شركاء مضافون بعد</p>
          <p className="text-sm text-[#6B7280] mt-2 font-sans">أضف أول شريك مؤسسي لشبكة بروميثيوس.</p>
          <Link href="/admin/partners/new">
            <Button className="mt-6 gap-2 bg-[#D49B4B] hover:bg-[#c08a3a] text-[#0A0F1D] rounded-xl font-bold">
              <Plus className="w-4 h-4" /> إضافة شريك
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {partners.map((partner) => (
            <div key={partner.id}
              className="bg-[#141C2F] border border-[#1E293B] rounded-2xl overflow-hidden hover:border-[#D49B4B]/30 transition-all duration-200 group shadow-lg">
              <div className="p-6 space-y-4">
                {/* Logo + Name */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-[#1E293B] flex items-center justify-center overflow-hidden shrink-0">
                    <img src={partner.logoUrl} alt={partner.name}
                      className="w-12 h-12 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-cairo font-bold text-white text-lg truncate group-hover:text-[#D49B4B] transition-colors">
                      {partner.name}
                    </h2>
                    {partner.websiteUrl && (
                      <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#6B7280] hover:text-[#D49B4B] flex items-center gap-1 font-inter mt-0.5 truncate">
                        <Globe className="w-3 h-3 shrink-0" />
                        {partner.websiteUrl.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                {partner.description && (
                  <p className="text-xs text-[#6B7280] font-sans line-clamp-2 leading-relaxed">
                    {partner.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-[11px] text-[#6B7280] font-fira pt-2 border-t border-[#1E293B]">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#D49B4B]" />
                    {partner._count.articles} مقالة
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderGit2 className="w-3.5 h-3.5 text-[#D49B4B]" />
                    {partner._count.projects} مشروع
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-[#1E293B]">
                  <Link href={`/admin/partners/${partner.id}/edit`} className="flex-1">
                    <Button variant="ghost" size="sm"
                      className="w-full gap-1.5 text-xs text-[#6B7280] hover:text-white hover:bg-[#1E293B]">
                      <Edit3 className="w-3.5 h-3.5 text-[#D49B4B]" /> تعديل
                    </Button>
                  </Link>
                  <Link href={`/partners/${partner.slug}`} target="_blank">
                    <Button variant="ghost" size="sm"
                      className="gap-1.5 text-xs text-[#6B7280] hover:text-[#D49B4B]">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <form action={async () => { "use server"; await deletePartnerAction(partner.id); }}>
                    <Button type="submit" variant="ghost" size="sm"
                      className="gap-1.5 text-xs text-[#6B7280] hover:text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
