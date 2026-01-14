"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { ToastProvider } from "@/components/ui/Toast";
import { CommandPalette, type CommandAction } from "@/components/command/CommandPalette";
import { useKeyboard } from "@/hooks/useKeyboard";
import ProceduralGroundBackground from "@/components/ui/procedural-ground-background";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState<"dots" | "ground">("dots");
  const pathname = usePathname();

  const actions: CommandAction[] = useMemo(
    () => [
      {
        label: "Create workflow",
        onSelect: () => router.push("/workflows"),
      },
      {
        label: "Add team member",
        onSelect: () => router.push("/team"),
      },
      {
        label: "Go to dashboard",
        onSelect: () => router.push("/dashboard"),
      },
      {
        label: "Upgrade plan",
        onSelect: () => router.push("/account"),
      },
    ],
    [router]
  );

  useKeyboard("k", () => setPaletteOpen(true));

  return (
    <ThemeProvider>
      <ToastProvider>
        {backgroundMode === "dots" ? (
          <DottedSurface className="pointer-events-none" />
        ) : (
          <ProceduralGroundBackground />
        )}
        <div className="pointer-events-none fixed left-4 top-4 z-20 flex flex-col gap-2 sm:left-6 sm:top-6">
          {pathname !== "/" && (
            <Link
              href="/"
              className="pointer-events-auto inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-slate-100 shadow-sm shadow-black/40 hover:border-accent hover:text-white hover:bg-slate-900/90 transition"
            >
              ⬅ Back to home
            </Link>
          )}
          <div className="pointer-events-auto inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/80 p-0.5 text-[11px] font-medium text-slate-200 shadow-sm shadow-black/40">
            <button
              type="button"
              onClick={() => setBackgroundMode("dots")}
              className={`rounded-full px-2 py-1 transition ${
                backgroundMode === "dots"
                  ? "bg-slate-800 text-white shadow-sm shadow-black/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
              }`}
            >
              Dots
            </button>
            <button
              type="button"
              onClick={() => setBackgroundMode("ground")}
              className={`rounded-full px-2 py-1 transition ${
                backgroundMode === "ground"
                  ? "bg-slate-800 text-white shadow-sm shadow-black/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
              }`}
            >
              Terrain
            </button>
          </div>
        </div>
        <div className="pointer-events-none fixed right-4 top-4 z-20 flex flex-col items-end gap-2 sm:right-6 sm:top-6">
          <div className="pointer-events-auto flex gap-2 sm:gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/40 hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/50 whitespace-nowrap transition-transform duration-150"
            >
              Sign in / Sign up
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-100 hover:bg-slate-800 hover:-translate-y-0.5 whitespace-nowrap transition-transform duration-150"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
        <CommandPalette
          actions={actions}
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
        />
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
