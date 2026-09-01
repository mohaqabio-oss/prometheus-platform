"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Clock, ArrowLeft, Crown, ShieldAlert } from "lucide-react";

export interface MemberCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    department: string;
    leadershipTier?: string | null;
    avatarUrl?: string | null;
    photoUrl?: string | null;
    volunteerHours: number;
  };
}

export function MemberCard({ member }: MemberCardProps) {
  const photo = member.avatarUrl ?? member.photoUrl;

  const renderTierBadge = () => {
    const tier = member.leadershipTier || "Regular";
    if (tier === "Founder & Leader") {
      return (
        <Badge variant="dark" className="text-[10px] bg-amber-500/20 text-amber-300 border-amber-500/40 font-mono gap-1 backdrop-blur-md">
          <Crown className="w-3 h-3 text-amber-400" />
          <span>مؤسس وقائد الفريق</span>
        </Badge>
      );
    }
    if (tier === "Department Leader") {
      return (
        <Badge variant="dark" className="text-[10px] bg-sky-500/20 text-sky-300 border-sky-500/40 font-mono gap-1 backdrop-blur-md">
          <ShieldAlert className="w-3 h-3 text-sky-400" />
          <span>قائد قسم</span>
        </Badge>
      );
    }
    return null;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="h-full p-6 bg-[#0D1322]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 text-center group shadow-xl hover:shadow-2xl hover:border-[#E84A0C]/50 transition-all duration-300 relative overflow-hidden">
        
        {/* Subtle Ambient Card Glow Orb */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#E84A0C]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E84A0C]/25 transition-all duration-500" />

        <div className="space-y-4 relative z-10">
          {/* Avatar Container */}
          <div className="flex justify-center">
            <Avatar
              src={photo}
              name={member.name}
              size="lg"
              shape="circle"
              className="group-hover:border-[#E84A0C]/80 transition-all duration-300 shadow-2xl ring-2 ring-white/10"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <Badge variant="orange" className="text-[10px] backdrop-blur-md">
                {member.department}
              </Badge>
              {renderTierBadge()}
            </div>

            <h3 className="font-display text-base font-bold text-white group-hover:text-[#E84A0C] transition-all duration-300">
              <Link href={`/members/${member.id}`}>{member.name}</Link>
            </h3>
            <p className="text-xs font-mono text-stone-400">{member.role}</p>
          </div>
        </div>

        {/* Volunteer Hours & Action */}
        <div className="pt-4 border-t border-white/10 space-y-3 relative z-10">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E84A0C]" />
              ساعات التطوع:
            </span>
            <strong className="text-white font-bold">{member.volunteerHours}h</strong>
          </div>

          <Link
            href={`/members/${member.id}`}
            className="w-full inline-flex items-center justify-center gap-1.5 text-xs rounded-xl border border-white/15 text-white bg-white/5 hover:bg-[#E84A0C] hover:border-[#E84A0C] h-8 px-3 transition-all duration-300 font-medium cursor-pointer"
          >
            <span>عرض الملف الشخصي</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
