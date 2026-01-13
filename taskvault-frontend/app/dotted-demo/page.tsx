import Link from "next/link";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { cn } from "@/lib/utils";

export default function DemoOne() {
  return (
    <DottedSurface className="size-full">
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative max-w-xl rounded-3xl border border-white/10 bg-black/40 px-6 py-8 text-center shadow-2xl shadow-black/60 backdrop-blur-md">
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full",
              "bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.45),transparent_60%)]",
              "blur-3xl"
            )}
          />
          <h1 className="relative font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Dotted Surface
          </h1>
          <p className="relative mt-3 text-sm sm:text-base text-slate-200/80">
            This is a standalone demo of the animated dotted background used across TaskVault. It&apos;s
            rendered with Three.js and kept lightweight enough to sit behind your real app screens.
          </p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 font-semibold text-slate-900 shadow-sm shadow-white/40 hover:bg-white transition"
            >
              ⬅ Back to home
            </Link>
            <span className="text-xs text-slate-300/80">
              Tip: use <kbd className="rounded border border-slate-500/70 bg-slate-900/70 px-1.5 py-0.5 text-[0.7rem] font-mono">
                Ctrl / ⌘ + K
              </kbd>{" "}
              to open the command palette anywhere.
            </span>
          </div>
        </div>
      </div>
    </DottedSurface>
  );
}
