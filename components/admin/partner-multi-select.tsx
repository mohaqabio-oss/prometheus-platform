"use client";

import React, { useState, useRef, useEffect } from "react";
import { Building2, Check, ChevronDown, Search, X } from "lucide-react";

export interface PartnerOption {
  id: string;
  name: string;
  logoUrl?: string;
}

interface PartnerMultiSelectProps {
  availablePartners: PartnerOption[];
  selectedPartnerIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
}

export function PartnerMultiSelect({
  availablePartners,
  selectedPartnerIds,
  onChange,
  placeholder = "اختر الشركاء المرتبطين...",
}: PartnerMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePartner = (id: string) => {
    if (selectedPartnerIds.includes(id)) {
      onChange(selectedPartnerIds.filter((pId) => pId !== id));
    } else {
      onChange([...selectedPartnerIds, id]);
    }
  };

  const removePartner = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedPartnerIds.filter((pId) => pId !== id));
  };

  const selectAll = () => {
    onChange(availablePartners.map((p) => p.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  const filteredPartners = availablePartners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPartners = availablePartners.filter((p) => selectedPartnerIds.includes(p.id));

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Area */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full min-h-[44px] p-2 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl cursor-pointer flex items-center justify-between gap-2 hover:border-[#E84A0C]/50 transition-all focus:outline-none"
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedPartners.length > 0 ? (
            selectedPartners.map((partner) => (
              <span
                key={partner.id}
                className="inline-flex items-center gap-1.5 bg-[#0D0D0D] text-white text-xs px-2.5 py-1 rounded-lg border border-[#6B7280]/30 shadow-sm"
              >
                {partner.logoUrl ? (
                  <img src={partner.logoUrl} alt={partner.name} className="w-4 h-4 object-contain rounded" />
                ) : (
                  <Building2 className="w-3.5 h-3.5 text-[#E84A0C]" />
                )}
                <span className="truncate max-w-[120px] font-sans">{partner.name}</span>
                <button
                  type="button"
                  onClick={(e) => removePartner(partner.id, e)}
                  className="hover:text-red-400 p-0.5 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-[#6B7280] font-sans px-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#6B7280]" />
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#6B7280] shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#E84A0C]" : ""
          }`}
        />
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl shadow-2xl p-3 space-y-3 font-sans animate-in fade-in zoom-in-95 duration-150">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B7280] absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن شريك..."
              className="w-full h-9 pr-9 pl-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-lg text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#E84A0C]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Header Controls */}
          <div className="flex items-center justify-between text-[11px] text-[#6B7280] px-1 border-b border-[#6B7280]/20 pb-2">
            <span>
              تم تحديد <strong className="text-white">{selectedPartnerIds.length}</strong> من{" "}
              {availablePartners.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={selectAll}
                className="text-[#E84A0C] hover:underline font-semibold"
              >
                تحديد الكل
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="hover:text-red-400 transition-colors"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>

          {/* List of Partners */}
          <div className="max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredPartners.length === 0 ? (
              <p className="text-xs text-[#6B7280] italic text-center py-4">لا يوجد شريك بهذا الاسم.</p>
            ) : (
              filteredPartners.map((partner) => {
                const isSelected = selectedPartnerIds.includes(partner.id);
                return (
                  <div
                    key={partner.id}
                    onClick={() => togglePartner(partner.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#1A2B4A] border border-[#E84A0C]/50 text-white"
                        : "bg-[#1A2B4A]/30 border border-transparent text-slate-300 hover:border-[#6B7280]/30 hover:bg-[#1A2B4A]/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="w-6 h-6 object-contain rounded shrink-0 bg-white/5 p-0.5"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-[#6B7280] shrink-0" />
                      )}
                      <span className="text-xs font-semibold truncate">{partner.name}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#E84A0C] border-[#E84A0C] text-white"
                          : "border-[#6B7280]/40"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
