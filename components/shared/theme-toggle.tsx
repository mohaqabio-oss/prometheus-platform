"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 p-0 rounded-lg text-brand-gray-400"
        aria-label="تبديل المظهر"
      >
        <Sun className="w-4 h-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 p-0 rounded-lg text-brand-gray-400 hover:text-white hover:bg-brand-dark-850 transition-colors cursor-pointer"
      aria-label={isDark ? "التحويل للوضع الفاتح" : "التحويل للوضع الداكن"}
      title={isDark ? "التحويل للوضع الفاتح" : "التحويل للوضع الداكن"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-brand-orange transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 transition-transform hover:-rotate-12" />
      )}
    </Button>
  );
}
