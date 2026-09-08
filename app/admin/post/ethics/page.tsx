import React from "react";
import { getJournalSetting } from "@/app/actions/journal-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { JournalEthicsEditor } from "@/components/admin/journal-ethics-editor";

export const dynamic = "force-dynamic";

export default async function AdminJournalEthicsPage() {
  const ethicsSetting = await getJournalSetting("publication_ethics");

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        badgeText="سياسات ومعايير النشر"
        title="محرر أخلاقيات النشر"
        highlightedTitle="والتحكيم الأكاديمي"
        description="تعديل وتحديث ميثاق النزاهة العلمية، قواعد التحكيم المزدوج، وحقوق الملكية الفكرية المنشورة في صفحة المجلة العامة."
      />

      <JournalEthicsEditor initialSetting={ethicsSetting} />
    </div>
  );
}
