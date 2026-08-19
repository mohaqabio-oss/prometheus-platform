"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Clock, ArrowLeft } from "lucide-react";

export interface MemberCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    department: string;
    avatarUrl?: string | null;
    photoUrl?: string | null;
    volunteerHours: number;
  };
}

export function MemberCard({ member }: MemberCardProps) {
  const photo = member.avatarUrl ?? member.photoUrl;

  return (
    <Card className="p-6 bg-brand-dark-900/80 border-brand-dark-800 card-hover-border flex flex-col justify-between space-y-4 text-center group">
      <div className="space-y-4">
        {/* Avatar Container */}
        <div className="flex justify-center">
          <Avatar
            src={photo}
            name={member.name}
            size="lg"
            shape="circle"
            className="group-hover:border-brand-orange/60 transition-colors shadow-lg"
          />
        </div>

        <div className="space-y-1">
          <Badge variant="orange" className="text-[10px] mb-1">
            {member.department}
          </Badge>
          <h3 className="font-display text-base font-bold text-foreground dark:text-white group-hover:text-brand-orange transition-colors">
            <Link href={`/members/${member.id}`}>{member.name}</Link>
          </h3>
          <p className="text-xs font-mono text-brand-gray-400">{member.role}</p>
        </div>
      </div>

      {/* Volunteer Hours & Action */}
      <div className="pt-4 border-t border-brand-dark-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-brand-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-orange" />
            ساعات التطوع:
          </span>
          <strong className="text-foreground dark:text-white">{member.volunteerHours}h</strong>
        </div>

        <Link href={`/members/${member.id}`}>
          <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs">
            <span>عرض الملف الشخصي</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
