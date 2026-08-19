import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MOCK_MEMBERS } from "@/lib/data/mock-members";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  FolderGit2,
  Microscope,
  ShieldCheck,
  Award,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Send,
  Twitter,
  UserCheck,
  ChevronRight,
} from "lucide-react";

interface MemberProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: MemberProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const member = MOCK_MEMBERS.find((m) => m.id === id);

  if (!member) {
    return {
      title: "Member Not Found",
    };
  }

  return {
    title: `${member.name} - ${member.role}`,
    description: `${member.name} is a ${member.role} in the ${member.department} department at Prometheus Voluntary Team.`,
    openGraph: {
      title: `${member.name} | Prometheus Member Profile`,
      description: member.bio,
      type: "profile",
    },
  };
}

export default async function SingleMemberProfilePage({ params }: MemberProfilePageProps) {
  const { id } = await params;
  const member = MOCK_MEMBERS.find((m) => m.id === id);

  if (!member) {
    notFound();
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "GitHub":
        return <Github className="w-4 h-4" />;
      case "LinkedIn":
        return <Linkedin className="w-4 h-4" />;
      case "Telegram":
        return <Send className="w-4 h-4" />;
      case "Twitter":
        return <Twitter className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-brand-dark-950 min-h-screen text-foreground animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/members">
            <Button variant="ghost" size="sm" className="gap-2 text-brand-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Members Directory</span>
            </Button>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* MEMBER PROFILE HEADER CARD */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-10 rounded-2xl border border-brand-dark-800 bg-brand-dark-900/90 mb-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            
            {/* Avatar Image Frame */}
            <Avatar
              src={member.avatarUrl}
              name={member.name}
              size="xl"
              shape="rounded"
              className="border-2 border-brand-dark-700 shadow-xl"
            />

            {/* Member Details */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="orange">{member.department}</Badge>
                <Badge variant="dark" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  {member.status} MEMBER
                </Badge>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground dark:text-white tracking-tight">
                {member.name}
              </h1>

              <p className="text-brand-orange text-sm font-mono">{member.role}</p>

              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  Joined {member.joinDate}
                </span>
              </div>

              {/* Social Links */}
              {member.socialLinks.length > 0 && (
                <div className="pt-2 flex items-center gap-3">
                  {member.socialLinks.map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-card dark:bg-brand-dark-850 border border-border dark:border-brand-dark-800 text-foreground/70 dark:text-brand-gray-400 hover:text-brand-orange hover:border-brand-orange/40 transition-colors"
                      aria-label={s.platform}
                      title={s.platform}
                    >
                      {getSocialIcon(s.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* STATISTICS METRICS GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card className="p-5 bg-card dark:bg-brand-dark-900/80 border-border dark:border-brand-dark-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground dark:text-white">{member.volunteerHours}h</p>
                <p className="text-xs text-muted-foreground font-sans">Volunteer Logged</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card dark:bg-brand-dark-900/80 border-border dark:border-brand-dark-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted dark:bg-brand-dark-850 border border-border dark:border-brand-dark-800 flex items-center justify-center text-brand-orange shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground dark:text-white">{member.articlesCount}</p>
                <p className="text-xs text-muted-foreground font-sans">Articles Published</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card dark:bg-brand-dark-900/80 border-border dark:border-brand-dark-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted dark:bg-brand-dark-850 border border-border dark:border-brand-dark-800 flex items-center justify-center text-brand-orange shrink-0">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground dark:text-white">{member.projectsCount}</p>
                <p className="text-xs text-muted-foreground font-sans">Projects Led</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card dark:bg-brand-dark-900/80 border-border dark:border-brand-dark-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted dark:bg-brand-dark-850 border border-border dark:border-brand-dark-800 flex items-center justify-center text-brand-orange shrink-0">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground dark:text-white">{member.researchCount}</p>
                <p className="text-xs text-muted-foreground font-sans">Research Papers</p>
              </div>
            </div>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* BIOGRAPHY SECTION */}
        {/* ========================================================================= */}
        <section className="mb-10 space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground dark:text-white">Member Biography</h2>
          <Card className="p-6 bg-card dark:bg-brand-dark-900/60 leading-relaxed text-foreground/80 dark:text-brand-gray-300 text-sm sm:text-base border-border dark:border-brand-dark-800">
            {member.bio}
          </Card>
        </section>

        {/* ========================================================================= */}
        {/* ACHIEVEMENTS / BADGES SECTION */}
        {/* ========================================================================= */}
        {member.achievements.length > 0 && (
          <section className="mb-10 space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-orange" />
              <span>Earned Achievements & Badges</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {member.achievements.map((ach) => (
                <Card key={ach.id} className="p-5 bg-card dark:bg-brand-dark-900/80 border-border dark:border-brand-dark-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-bold text-foreground dark:text-white">{ach.title}</h3>
                      <span className="text-[10px] font-mono text-muted-foreground">{ach.awardedDate}</span>
                    </div>
                    <p className="text-xs text-foreground/70 dark:text-brand-gray-400 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* RECENT CONTRIBUTIONS */}
        {/* ========================================================================= */}
        {member.recentContributions.length > 0 && (
          <section className="mb-10 space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground dark:text-white">Recent Contributions</h2>

            <div className="space-y-3">
              {member.recentContributions.map((contrib) => (
                <div
                  key={contrib.id}
                  className="p-4 rounded-xl bg-card dark:bg-brand-dark-900 border border-border dark:border-brand-dark-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="orange" className="text-[10px]">{contrib.type}</Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">{contrib.date}</span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground dark:text-white hover:text-brand-orange transition-colors">
                      <Link href={contrib.link}>{contrib.title}</Link>
                    </h3>
                  </div>

                  <Link href={contrib.link} aria-label={`View ${contrib.title}`} className="text-muted-foreground hover:text-brand-orange transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* CERTIFICATE VERIFICATION HOOK UI */}
        {/* ========================================================================= */}
        {member.certificateCode && (
          <section className="p-6 rounded-2xl border border-brand-orange/30 bg-brand-orange/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-foreground dark:text-white">Verified Voluntary Certificate</h3>
                <p className="text-xs font-mono text-foreground/70 dark:text-brand-gray-400 mt-0.5">
                  Official Verification ID: <span className="text-brand-orange font-bold">{member.certificateCode}</span>
                </p>
              </div>
            </div>

            <Link href={`/verify/${member.certificateCode}`} target="_blank">
              <Button variant="outline" size="sm" className="shrink-0 border-brand-orange/40 text-brand-orange hover:bg-brand-orange hover:text-white">
                Verify Certificate →
              </Button>
            </Link>
          </section>
        )}

      </div>
    </div>
  );
}
