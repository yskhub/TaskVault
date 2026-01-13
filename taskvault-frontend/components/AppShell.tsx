"use client";

import { useMemo, useState } from "react";
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
