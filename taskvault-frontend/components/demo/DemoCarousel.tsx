'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const slides = [
  {
    title: 'Your Command Center',
    caption:
      'Get a real-time view of workflows, team usage, and completion rates.',
    image: '/demo/slide-1.svg?v=2',
  },
  {
    title: 'Create Workflows in Seconds',
    caption: 'Define steps, assign owners, and track progress without friction.',
    image: '/demo/slide-2.svg?v=2',
  },
  {
    title: 'Manage Your Team',
    caption: 'Add members, control roles, and stay within plan limits.',
    image: '/demo/slide-3.svg?v=2',
  },
  {
    title: 'Track What Matters',
    caption:
      'Visual analytics help you understand progress and bottlenecks instantly.',
    image: '/demo/slide-4.svg?v=2',
  },
] as const;

export default function DemoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIndex((i) => (i + 1) % slides.length),
    onSwipedRight: () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    trackMouse: true,
  });

  const slide = slides[index];

  return (
    <section className="mt-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-slate-300">
            Product walkthrough
          </h2>
          <p className="text-xs text-slate-400">
            Auto-advances every 4 seconds · Swipe on mobile
          </p>
        </div>

        <div
          {...handlers}
          className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6 shadow-xl shadow-slate-950/60"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/80">
                <div className="relative w-full overflow-hidden aspect-video">
                  {/* Placeholder-friendly: these paths work even before real screenshots exist */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    width={1440}
                    height={900}
                    className="h-full w-full object-contain"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              </div>

              <div className="mt-4 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-slate-50">{slide.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{slide.caption}</p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      i === index
                        ? 'w-6 bg-accent shadow-[0_0_12px_rgba(59,130,246,0.7)]'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
      </div>
      </div>
    </section>
  );
}
