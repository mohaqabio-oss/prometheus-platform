import React from "react";
import Link from "next/link";
import { getAdminCertificatesList, getAdminMembersList } from "@/app/actions/hr-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminIssueCertDialog } from "@/components/admin/admin-issue-cert-dialog";
import {
  ExternalLink,
  ShieldCheck,
  QrCode,
} from "lucide-react";

export default async function AdminCertificatesPage() {
  const certificates = await getAdminCertificatesList();
  const members = await getAdminMembersList();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <SectionHeader
        badgeText="التوثيق المؤسسي الرسمي"
        title="إصدار وتوثيق"
        highlightedTitle="الشهادات التطوعية"
        description="منح الشهادات التطوعية الرسمية الموثقة برمز تشفير فريد ورابط تحقق فوري للمؤسسات والجهات الأكاديمية."
        action={<AdminIssueCertDialog members={members} />}
      />

      {/* Grid of Issued Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {certificates.map((cert) => (
          <Card key={cert.id} className="p-6 bg-brand-dark-900/90 border-brand-dark-800 space-y-5 hover:border-brand-orange/30 transition-colors">
            
            <div className="flex items-start justify-between gap-4 border-b border-brand-dark-800 pb-4">
              <div>
                <Badge variant="orange" className="font-mono text-[10px] gap-1 mb-2">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{cert.certificateCode}</span>
                </Badge>
                <h3 className="font-display font-bold text-white text-base leading-snug">
                  {cert.title}
                </h3>
              </div>

              <div className="p-2 rounded bg-white text-black shrink-0">
                <QrCode className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between text-brand-gray-300">
                <span>اسم صاحب الشهادة:</span>
                <strong className="text-white font-semibold">{cert.memberName}</strong>
              </div>
              <div className="flex items-center justify-between text-brand-gray-300">
                <span>القسم والدور:</span>
                <span className="font-mono text-[11px] text-brand-gray-400">
                  {cert.memberDepartment} • {cert.memberRole}
                </span>
              </div>
              <div className="flex items-center justify-between text-brand-gray-300">
                <span>الساعات التطوعية الموثقة:</span>
                <strong className="font-mono text-brand-orange">{cert.volunteerHours} ساعة</strong>
              </div>
              <div className="flex items-center justify-between text-brand-gray-300">
                <span>تاريخ الإصدار:</span>
                <span className="font-mono text-[11px] text-brand-gray-500">
                  {new Date(cert.issuedAt).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>

            <p className="text-xs text-brand-gray-400 bg-brand-dark-950 p-3 rounded border border-brand-dark-800 leading-relaxed italic">
              "{cert.description}"
            </p>

            <div className="pt-2 flex justify-start">
              <Link href={`/verify/${cert.certificateCode}`} target="_blank">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <span>فتح صفحة التوثيق العامة</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
                </Button>
              </Link>
            </div>

          </Card>
        ))}
      </div>

    </div>
  );
}
