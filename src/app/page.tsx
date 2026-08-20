import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "UPLOAD",
    description: "Drop any JPEG, PNG, or WebP image into the analyzer.",
  },
  {
    step: "02",
    title: "SCAN",
    description: "VERITAS runs 8 independent forensic vectors simultaneously.",
  },
  {
    step: "03",
    title: "ANALYZE",
    description: "Signals are correlated across frequency, pixel, and metadata layers.",
  },
  {
    step: "04",
    title: "VERDICT",
    description: "A probabilistic forensic report is returned in seconds.",
  },
];

const MOCK_SIGNALS = [
  { label: "DCT Anomaly", status: "SUSPICIOUS", suspicious: true },
  { label: "EXIF Integrity", status: "SUSPICIOUS", suspicious: true },
  { label: "Noise Pattern", status: "CLEAR", suspicious: false },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-neutral-100 selection:bg-crimson selection:text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center px-6 sm:px-8 lg:px-12 border-b border-white/[0.08] overflow-hidden pt-24 pb-16">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-crimson/[0.04] blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_70%_at_40%_50%,#000_60%,transparent_100%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left: Headline + CTA */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-crimson flex-shrink-0" />
              <span className="text-xs font-sans tracking-[0.2em] text-neutral-400 uppercase">
                Authenticity Intelligence & Digital Media Forensics
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white font-normal leading-[0.92] uppercase">
              Verify what <br />
              <span className="italic font-light text-neutral-300">you can&apos;t trust.</span> trust.
            </h1>

            <p className="font-sans text-base sm:text-lg text-neutral-400 font-light leading-relaxed max-w-lg">
              Upload any image. VERITAS returns a forensic verdict in seconds.
            </p>

            <Link href="/analyze">
              <GlowButton variant="white" size="lg">
                ANALYZE MEDIA
                <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </Link>
          </div>

          {/* Right: Mock verdict card */}
          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-surface">
              {/* Card header */}
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-sans tracking-[0.2em] text-neutral-400 uppercase">
                  Live Analysis Preview
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
                  <span className="text-[10px] font-sans text-neutral-400">SCANNING</span>
                </span>
              </div>

              {/* Mock image placeholder with scan animation */}
              <div className="relative bg-black/60 h-44 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center">
                  <div className="text-neutral-600 text-xs font-sans tracking-widest uppercase">
                    sample.jpg
                  </div>
                </div>
                {/* Scan line */}
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-crimson/60 to-transparent animate-[scanline_2s_ease-in-out_infinite]" />
              </div>

              {/* Verdict */}
              <div className="px-5 py-4 border-t border-white/10 space-y-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-2xl text-white font-normal tracking-wide">
                    AI GENERATED
                  </h3>
                  <span className="font-serif text-3xl text-white">
                    91.3<span className="text-lg text-crimson">%</span>
                  </span>
                </div>

                {/* Confidence bar */}
                <div className="h-[2px] w-full bg-white/10">
                  <div className="h-full bg-crimson" style={{ width: "91.3%" }} />
                </div>

                {/* Signal rows */}
                <div className="space-y-2 pt-1">
                  {MOCK_SIGNALS.map((signal) => (
                    <div key={signal.label} className="flex items-center justify-between">
                      <span className="text-xs font-sans text-neutral-400">
                        {signal.label}
                      </span>
                      <span
                        className={`text-[10px] font-sans tracking-wider uppercase font-medium ${
                          signal.suspicious ? "text-crimson-light" : "text-neutral-300"
                        }`}
                      >
                        {signal.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Disclaimer under card */}
            <p className="mt-3 text-[11px] font-sans text-neutral-500 text-center">
              Example output — upload your own image to begin
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Four steps. One verdict.
            </h2>
          </div>

          {/* Step row */}
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Connecting line — desktop only */}
            <div className="absolute top-3 left-[12.5%] right-[12.5%] h-[1px] bg-white/10 hidden md:block" />

            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-sm text-crimson font-normal">
                    {item.step}
                  </span>
                  <div className="w-2 h-2 border border-white/20 bg-background" />
                </div>
                <h3 className="font-sans text-sm font-semibold tracking-[0.15em] text-white uppercase">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTIGATION SECTION (single, kept) ─────────────────────────── */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-sans tracking-[0.2em] text-neutral-400 uppercase block">
              03 — Investigation
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.05]">
              FROM SUSPICION<br />TO EVIDENCE.
            </h2>
            <div className="w-10 h-[1px] bg-white/20" />
          </div>

          <div className="lg:col-span-7 space-y-8 lg:pt-4">
            <p className="font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              Built for investigators and analysts. VERITAS transforms raw pixel data into a structured, transparent forensic report with defensible probabilistic scoring.
            </p>
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              {[
                "Defensible probabilistic scoring",
                "Transparent multi-signal indicators",
                "Audit-ready technical documentation",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-neutral-500 flex-shrink-0" />
                  <span className="font-sans text-xs sm:text-sm text-neutral-400">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-crimson/[0.06] blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white font-normal tracking-tight">
            Ready to inspect<br />
            <span className="italic font-light text-neutral-300">media authenticity?</span>
          </h2>
          <p className="font-sans text-sm text-neutral-400 max-w-md mx-auto leading-relaxed font-light">
            Upload any digital image to receive an immediate, multi-signal probabilistic assessment and detailed forensic breakdown.
          </p>
          <div className="pt-2">
            <Link href="/analyze">
              <GlowButton variant="white" size="lg">
                ANALYZE MEDIA
                <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
