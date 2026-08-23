import React from "react";
import type { Metadata } from "next";
import { getPublicMembersAction } from "@/app/actions/hr-actions";
import { getSiteSettings } from "@/app/actions/website-actions";
import { MembersClientPage } from "@/components/members/members-client-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const memHeader = settings.pageHeaders?.members;
  return {
    title: `${memHeader?.title || "دليل أعضاء الفريق"} | فريق بروميثيوس`,
    description: memHeader?.subtitle || "استكشف اعضاء فريق بروميثيوس المتطوعين والكوادر.",
  };
}

export default async function MembersPage() {
  const [members, settings] = await Promise.all([
    getPublicMembersAction(),
    getSiteSettings(),
  ]);

  return (
    <MembersClientPage
      initialMembers={members || []}
      headerConfig={settings?.pageHeaders?.members || null}
    />
  );
}
