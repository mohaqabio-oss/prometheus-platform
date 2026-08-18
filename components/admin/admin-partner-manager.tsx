"use client";

import React, { useState } from "react";
import { PartnerRecord, addPartnerAction, deletePartnerAction } from "@/app/actions/website-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ExternalLink, Building2 } from "lucide-react";

interface AdminPartnerManagerProps {
  partners: PartnerRecord[];
}

export function AdminPartnerManager({ partners }: AdminPartnerManagerProps) {
  const [partnerList, setPartnerList] = useState<PartnerRecord[]>(partners);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPartner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !logoUrl) {
      setError("يرجى إدخال اسم الشريك ورابط الشعار.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("logoUrl", logoUrl);
    formData.append("websiteUrl", websiteUrl);

    const res = await addPartnerAction(null, formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setPartnerList([
        ...partnerList,
        {
          id: `part-${Date.now()}`,
          name,
          logoUrl,
          websiteUrl: websiteUrl || undefined,
          order: partnerList.length + 1,
        },
      ]);
      setName("");
      setLogoUrl("");
      setWebsiteUrl("");
    }
    setLoading(false);
  };

  const handleDeletePartner = async (id: string) => {
    setPartnerList((prev) => prev.filter((p) => p.id !== id));
    await deletePartnerAction(id);
  };

  return (
    <div className="space-y-8">
      
      {/* Add Partner Form */}
      <Card className="p-6 bg-brand-dark-900/90 border-brand-dark-800 space-y-4">
        <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-orange" />
          <span>إضافة شريك أو راعي جديد</span>
        </h3>

        {error && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleAddPartner} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-brand-gray-300 font-sans">اسم الشريك / المؤسسة *</label>
            <Input
              type="text"
              placeholder="مثال: العراق التقنية"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-brand-gray-300 font-sans">رابط الشعار (Image URL) *</label>
            <Input
              type="url"
              placeholder="https://..."
              value={logoUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-brand-gray-300 font-sans">رابط الموقع الرسمي (اختياري)</label>
            <Input
              type="url"
              placeholder="https://..."
              value={websiteUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsiteUrl(e.target.value)}
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <Button type="submit" size="sm" disabled={loading} className="gap-2">
              <Plus className="w-4 h-4" />
              <span>إضافة الشريك</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Partners Grid */}
      <div className="space-y-4">
        <h3 className="font-display text-sm font-bold text-white">الشركاء والرعاة الحاليون ({partnerList.length})</h3>

        {partnerList.length === 0 ? (
          <p className="text-xs text-brand-gray-500 italic">لا يوجد شركاء مضافون حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {partnerList.map((partner) => (
              <Card key={partner.id} className="p-4 bg-brand-dark-900/80 border-brand-dark-800 space-y-3 relative group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-brand-dark-850 border border-brand-dark-700 p-2 shrink-0 flex items-center justify-center">
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <p className="font-bold text-white text-xs truncate">{partner.name}</p>
                    {partner.websiteUrl && (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-brand-orange hover:underline flex items-center gap-1 font-mono truncate"
                      >
                        <span>زيارة الموقع</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-dark-800 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePartner(partner.id)}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
