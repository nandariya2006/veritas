"use client";
import { useState, useCallback } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { AnalysisResultView } from "@/components/AnalysisResult";
import { AnalysisResult } from "@/types";
import { analyzeImage } from "@/lib/realAnalysis";

type PageState = "upload" | "analyzing" | "results";

export default function AnalyzePage() {
  const [pageState, setPageState] = useState<PageState>("upload");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleAnalyze = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setCurrentFile(file);
    setPageState("analyzing");

    const [analysisResult] = await Promise.all([
      analyzeImage(file),
      new Promise((resolve) => setTimeout(resolve, 1400)),
    ]);

    setResult(analysisResult);
    setPageState("results");
  }, []);

  const handleReset = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setResult(null);
    setCurrentFile(null);
    setPageState("upload");
  }, [imageUrl]);

  return (
    <div className="min-h-screen bg-background text-neutral-100 selection:bg-crimson selection:text-white pt-28 sm:pt-36 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="border-b border-white/[0.08] pb-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-crimson" />
            <span className="text-[10px] sm:text-xs font-sans tracking-[0.25em] text-neutral-400 uppercase">
              PROVENANCE & AUTHENTICITY EVALUATION
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white font-normal tracking-tight">
            ANALYZE MEDIA
          </h1>

          <p className="font-sans text-sm sm:text-base text-neutral-400 font-light max-w-2xl leading-relaxed">
            Upload evidence for an AI-assisted authenticity assessment. VERITAS isolates structural manipulation markers across spatial and frequency domains.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] font-sans text-neutral-400 tracking-wider">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">ENGINE:</span>
              <span className="text-neutral-300">VERITAS FORENSIC HEURISTICS V1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">STATUS:</span>
              <span className="text-neutral-300">
                {pageState === "analyzing" ? "PROCESSING PIPELINE" : "STANDBY"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">TARGETS:</span>
              <span className="text-neutral-300">DIFFUSION / GAN / MANIPULATION</span>
            </div>
          </div>
        </div>

        <div className="transition-all duration-500">
          {pageState === "upload" && (
            <ImageUploader onAnalyze={handleAnalyze} />
          )}

          {pageState === "analyzing" && (
            <div className="border border-white/10 bg-surface p-8 sm:p-12">
              <LoadingAnimation />
            </div>
          )}

          {pageState === "results" && result && imageUrl && currentFile && (
            <AnalysisResultView
              result={result}
              imageUrl={imageUrl}
              file={currentFile}
              onReset={handleReset}
            />
          )}
        </div>

        <div className="pt-8 border-t border-white/[0.06] text-center">
          <p className="text-[11px] font-sans text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
            AI-assisted assessment. Results should be interpreted alongside other forensic evidence and are not definitive proof of authenticity.
          </p>
        </div>
      </div>
    </div>
  );
}
