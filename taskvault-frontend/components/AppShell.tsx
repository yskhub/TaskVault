"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { ToastProvider } from "@/components/ui/Toast";
import { CommandPalette, type CommandAction } from "@/components/command/CommandPalette";
import { useKeyboard } from "@/hooks/useKeyboard";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);

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
        <DottedSurface className="pointer-events-none" />
        <div className="pointer-events-none fixed left-4 top-4 z-20 flex flex-col gap-2 sm:left-6 sm:top-6">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-slate-100 shadow-sm shadow-black/40 hover:border-accent hover:text-white hover:bg-slate-900/90 transition"
          >
            ⬅ Back to home
          </Link>
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
