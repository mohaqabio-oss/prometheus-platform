import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4">
      <div className="w-48 h-8 bg-brand-dark-850 rounded-lg" />
      <div className="w-96 h-4 bg-brand-dark-850 rounded" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
        <div className="h-28 bg-brand-dark-900 border border-brand-dark-800 rounded-xl" />
        <div className="h-28 bg-brand-dark-900 border border-brand-dark-800 rounded-xl" />
        <div className="h-28 bg-brand-dark-900 border border-brand-dark-800 rounded-xl" />
        <div className="h-28 bg-brand-dark-900 border border-brand-dark-800 rounded-xl" />
      </div>

      <div className="h-80 bg-brand-dark-900 border border-brand-dark-800 rounded-xl" />
    </div>
  );
}
