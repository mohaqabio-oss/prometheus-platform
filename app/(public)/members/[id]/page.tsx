import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { prisma } from "@/lib/db/prisma";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  FolderGit2,
  Microscope,
  Calendar,
} from "lucide-react";

interface MemberProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: MemberProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (member) {
      return {
        title: `${member.fullName} - ${member.title || "عضو فريق"}`,
        description: `${member.fullName} is a ${member.title || "Member"} in the ${member.departmentName || "General"} department at Prometheus Voluntary Team.`,
      };
    }
  } catch (e) {}

  return {
    title: "Member Profile | Prometheus Voluntary Team",
  };
}

export default async function SingleMemberProfilePage({ params }: MemberProfilePageProps) {
  const { id } = await params;
  let member: any = null;

  try {
    member = await prisma.member.findUnique({
      where: { id },
      include: {
        certificates: true,
      },
    });
  } catch (e) {}

  if (!member) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-20 bg-[#1A2B4A] min-h-screen text-white animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/members">
            <Button variant="ghost" size="sm" className="gap-2 text-[#6B7280] hover:text-white">
              <ArrowLeft className="w-4 h-4 text-[#E84A0C]" />
              <span>Back to Members Directory</span>
            </Button>
          </Link>
        </div>

        {/* MEMBER PROFILE HEADER CARD */}
        <div className="p-6 sm:p-10 rounded-2xl border border-[#6B7280]/20 bg-[#0D0D0D] mb-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            
            <Avatar
              src={member.avatarUrl || member.profileImage}
              name={member.fullName}
              size="xl"
              shape="rounded"
              className="border-2 border-[#6B7280]/30 shadow-xl"
            />

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="orange">{member.departmentName || "عام"}</Badge>
                <Badge variant="dark" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  {member.status} MEMBER
                </Badge>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {member.fullName}
              </h1>

              <p className="text-[#E84A0C] text-sm font-mono">{member.title || "عضو متطوع"}</p>

              <div className="flex items-center gap-4 text-xs font-mono text-[#6B7280] pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                  Joined {new Date(member.joinDate || member.createdAt).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* STATISTICS METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card className="p-5 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E84A0C]/15 border border-[#E84A0C]/30 flex items-center justify-center text-[#E84A0C] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white">{member.volunteerHours || 0}h</p>
                <p className="text-xs text-[#6B7280] font-sans">Volunteer Logged</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white">0</p>
                <p className="text-xs text-[#6B7280] font-sans">Articles Published</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C] shrink-0">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white">0</p>
                <p className="text-xs text-[#6B7280] font-sans">Projects Led</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C] shrink-0">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white">0</p>
                <p className="text-xs text-[#6B7280] font-sans">Research Papers</p>
              </div>
            </div>
          </Card>
        </div>

        {/* BIOGRAPHY SECTION */}
        <section className="mb-10 space-y-3">
          <h2 className="font-display text-xl font-bold text-white">Member Biography</h2>
          <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl leading-relaxed text-[#6B7280] text-sm sm:text-base">
            {member.bio || "لا تتوفر نبذة تعريفية خاصة بالعضو حالياً."}
          </Card>
        </section>

      </div>
    </div>
  );
}
