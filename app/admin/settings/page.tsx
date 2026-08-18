import React from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        badgeText="System Configuration"
        title="Platform"
        highlightedTitle="Settings"
        description="Configure institutional parameters, branding defaults, and email notifications."
      />

      <Card className="p-12 text-center border-dashed border-brand-dark-800 bg-brand-dark-900/40">
        <div className="w-12 h-12 rounded-full bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center text-brand-orange mx-auto mb-4">
          <Settings className="w-6 h-6" />
        </div>
        <h3 className="font-display text-lg font-bold text-white mb-2">System Settings</h3>
        <p className="text-xs text-brand-gray-400 max-w-md mx-auto">
          Global platform configurations, environment variables, and organizational metadata settings.
        </p>
      </Card>
    </div>
  );
}
