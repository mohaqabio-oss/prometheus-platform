import React from "react";

export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-brand-dark-950 py-20 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-8 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="w-32 h-6 bg-brand-dark-850 rounded-full" />
          <div className="w-3/4 h-10 bg-brand-dark-850 rounded-lg" />
          <div className="w-1/2 h-4 bg-brand-dark-850 rounded" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="h-64 bg-brand-dark-900 border border-brand-dark-800 rounded-xl" />
          <div className="h-64 bg-brand-dark-900 border border-brand-dark-800 rounded-xl" />
          <div className="h-64 bg-brand-dark-900 border border-brand-dark-800 rounded-xl" />
        </div>

      </div>
    </div>
  );
}
