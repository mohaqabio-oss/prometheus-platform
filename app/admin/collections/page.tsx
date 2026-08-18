import React from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Layers } from "lucide-react";

export default function AdminCollectionsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        badgeText="Curated Series"
        title="Prometheus Post"
        highlightedTitle="Collections"
        description="Organize articles into thematic series and editorial collections."
        action={
          <Button size="sm" className="gap-1.5 text-xs">
            <PlusCircle className="w-4 h-4" />
            <span>Create Collection</span>
          </Button>
        }
      />

      <Card className="p-12 text-center border-dashed border-brand-dark-800 bg-brand-dark-900/40">
        <div className="w-12 h-12 rounded-full bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center text-brand-orange mx-auto mb-4">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="font-display text-lg font-bold text-white mb-2">Collections Management Console</h3>
        <p className="text-xs text-brand-gray-400 max-w-md mx-auto mb-6">
          Group articles into thematic series and arrange their reading order.
        </p>
      </Card>
    </div>
  );
}
