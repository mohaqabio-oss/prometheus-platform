import React from "react";
import Link from "next/link";
import { getAdminCertificatesList, getAdminMembersList } from "@/app/actions/hr-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminIssueCertDialog } from "@/components/admin/admin-issue-cert-dialog";
import { CertificateQRDialog } from "@/components/admin/certificate-qr-dialog";
import {
  ExternalLink,
  ShieldCheck,
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
          <Card key={cert.id} className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl space-y-5 shadow-xl hover:border-[#E84A0C]/40 transition-all duration-300">
            
            <div className="flex items-start justify-between gap-4 border-b border-[#6B7280]/20 pb-4">
              <div>
                <Badge variant="orange" className="font-mono text-[10px] gap-1 mb-2">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{cert.certificateCode}</span>
                </Badge>
                <h3 className="font-display font-bold text-white text-base leading-snug">
                  {cert.title}
                </h3>
              </div>

              <div className="shrink-0">
                <CertificateQRDialog
                  certificateCode={cert.certificateCode}
                  memberName={cert.memberName}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>اسم صاحب الشهادة:</span>
                <strong className="text-white font-semibold">{cert.memberName}</strong>
              </div>
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>القسم والدور:</span>
                <span className="font-mono text-[11px] text-white">
                  {cert.memberDepartment} • {cert.memberRole}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>الساعات التطوعية الموثقة:</span>
                <strong className="font-mono text-[#E84A0C] font-bold">{cert.volunteerHours} ساعة</strong>
              </div>
              <div className="flex items-center justify-between text-[#6B7280]">
                <span>تاريخ الإصدار:</span>
                <span className="font-mono text-[11px] text-[#6B7280]">
                  {new Date(cert.issuedAt).toLocaleDateString("ar-SA")}
                </span>
              </div>
            </div>

            {cert.description && (
              <p className="text-xs text-[#6B7280] bg-[#1A2B4A] p-3 rounded-xl border border-[#6B7280]/20 leading-relaxed italic">
                "{cert.description}"
              </p>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <Link href={`/verify/${cert.certificateCode}`} target="_blank">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-xl border-[#6B7280]/30 text-white">
                  <span>صفحة التوثيق العامة</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#E84A0C]" />
                </Button>
              </Link>

              <CertificateQRDialog
                certificateCode={cert.certificateCode}
                memberName={cert.memberName}
              />
            </div>

          </Card>
        ))}
      </div>

    </div>
  );
}
