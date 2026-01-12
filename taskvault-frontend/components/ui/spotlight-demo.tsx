"use client";

import { Layers, ShieldCheck, Zap } from "lucide-react";

import { SpotlightCard } from "@/components/ui/spotlight-card";

export default function DemoSpotlight() {
  return (
    <div className="min-h-[500px] w-full flex items-center justify-center bg-black p-4 sm:p-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl w-full">
        {/* Card 1: Default White Spotlight */}
        <SpotlightCard className="p-6 h-full flex flex-col gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700">
            <Layers className="text-white h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Seamless UX</h3>
            <p className="text-sm text-neutral-400">
              Smooth, mouse-responsive interactions that elevate the user experience to the next level.
            </p>
          </div>
        </SpotlightCard>

        {/* Card 2: Sky Blue Spotlight */}
        <SpotlightCard
          className="p-6 h-full flex flex-col gap-4"
          spotlightColor="rgba(14, 165, 233, 0.25)"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-sky-900/20 border border-sky-800/50">
            <ShieldCheck className="text-sky-400 h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Secure By Design</h3>
            <p className="text-sm text-neutral-400">
              Built with modern security standards, ensuring your data is protected with end-to-end encryption.
            </p>
          </div>
        </SpotlightCard>

        {/* Card 3: Purple Spotlight */}
        <SpotlightCard
          className="p-6 h-full flex flex-col gap-4"
          spotlightColor="rgba(168, 85, 247, 0.25)"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-900/20 border border-purple-800/50">
            <Zap className="text-purple-400 h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Lightning Fast</h3>
            <p className="text-sm text-neutral-400">
              Optimized for performance. Import the component and start building without configuration overhead.
            </p>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
