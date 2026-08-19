"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { QrCode, X, ShieldCheck, Download } from "lucide-react";

interface CertificateQRDialogProps {
  certificateCode: string;
  memberName: string;
}

export function CertificateQRDialog({ certificateCode, memberName }: CertificateQRDialogProps) {
  const [open, setOpen] = useState(false);
  const verifyUrl = `https://prometheus-voluntary.org/verify/${certificateCode}`;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="h-8 px-2.5 gap-1.5 text-xs rounded-xl border-[#6B7280]/30 text-[#E84A0C] hover:bg-[#E84A0C]/10"
        title="عرض رمز QR للشهادة"
      >
        <QrCode className="w-3.5 h-3.5" />
        <span>رمز QR</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl p-6 shadow-2xl space-y-6 text-white text-center">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#E84A0C]" />
                <h3 className="font-display font-bold text-white text-base">
                  رمز التوثيق الرقمي (QR)
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#6B7280] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="p-6 bg-white rounded-2xl flex items-center justify-center mx-auto w-fit shadow-xl border-4 border-[#E84A0C]">
              <QRCodeSVG
                value={verifyUrl}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#0D0D0D"
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Certificate Details */}
            <div className="space-y-1 font-mono text-xs text-[#6B7280]">
              <p className="text-white font-bold text-sm font-sans">{memberName}</p>
              <p className="text-[#E84A0C] font-bold">{certificateCode}</p>
              <p className="text-[10px] break-all pt-1">{verifyUrl}</p>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <Button
                onClick={() => setOpen(false)}
                size="sm"
                className="w-full bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl"
              >
                إغلاق
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
