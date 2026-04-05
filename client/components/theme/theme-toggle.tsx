"use client";

import { MoonIcon, SunIcon } from "@/lib/svg";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className="fixed top-1/2 -translate-y-1/2 right-0 z-1 max-lg:hidden"
      suppressHydrationWarning
    >
      <button
        onClick={toggleTheme}
        type="button"
        className="bg-(--color5) border-2 border-(--color5) rounded-full w-16.5 h-9 flex items-center relative outline-none rotate-90 transition-none shadow-[0_0_10px_rgba(24,144,255,0.4)]"
        aria-label="Toggle theme"
      >
        {/* Sliding circle */}
        <div
          className="absolute transition-all duration-200 ease-in-out"
          style={{ left: theme === "dark" ? "calc(100% - 28px)" : "8px" }}
        >
          <div className="bg-white rounded-full w-5 h-5 shadow-md"></div>
        </div>
        {/* Moon icon (visible in light mode) */}
        <div
          className="absolute right-3 flex -rotate-90 transition-opacity duration-200"
          style={{ opacity: theme === "light" ? 1 : 0 }}
          suppressHydrationWarning
        >
          <MoonIcon size={14} className="text-white" />
        </div>
        {/* Sun icon (visible in dark mode) */}
        <div
          className="absolute left-2.5 flex -rotate-90 transition-opacity duration-200"
          style={{ opacity: theme === "dark" ? 1 : 0 }}
        >
          <SunIcon size={16} className="text-white" />
        </div>
      </button>
    </div>
  );
}
