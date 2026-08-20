import { AnalysisResult, ForensicIndicator } from "@/types";

async function inspectMetadata(file: File) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const headerBytes = bytes.slice(0, Math.min(bytes.length, 131072));
  const asStr = Array.from(headerBytes)
    .map((b) => String.fromCharCode(b))
    .join("");

  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
  const isPng =
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;

  const hasExif = isJpeg && asStr.includes("Exif");
  const cameraMatch = asStr.match(
    /Canon|Nikon|SONY|Apple|iPhone|Samsung|GoPro|Panasonic|FUJIFILM|OLYMPUS|Pixel/i
  );
  const aiSignatures = [
    "Midjourney",
    "DALL-E",
    "DALL·E",
    "Stable Diffusion",
    "stability.ai",
    "NightCafe",
    "Leonardo.Ai",
    "runwayml",
    "SynthID",
    "C2PA",
    "Adobe Firefly",
  ];
  const aiMatch = aiSignatures.find((sig) =>
    asStr.toLowerCase().includes(sig.toLowerCase())
  );

  return {
    hasExif,
    hasCamera: !!cameraMatch,
    cameraName: cameraMatch?.[0],
    aiSignature: aiMatch,
    isJpeg,
    isPng,
  };
}

function analyzePixels(img: HTMLImageElement) {
  const maxDim = 512;
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const gray = new Float32Array(w * h);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  const mag = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx =
        -gray[i - w - 1] - 2 * gray[i - 1] - gray[i + w - 1] +
        gray[i - w + 1] + 2 * gray[i + 1] + gray[i + w + 1];
      const gy =
        -gray[i - w - 1] - 2 * gray[i - w] - gray[i - w + 1] +
        gray[i + w - 1] + 2 * gray[i + w] + gray[i + w + 1];
      mag[i] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  const block = 16;
  const blockVars: number[] = [];
  for (let by = 0; by < h; by += block) {
    for (let bx = 0; bx < w; bx += block) {
      let sum = 0,
        sumsq = 0,
        n = 0;
      for (let y = by; y < Math.min(by + block, h); y++) {
        for (let x = bx; x < Math.min(bx + block, w); x++) {
          const v = mag[y * w + x];
          sum += v;
          sumsq += v * v;
          n++;
        }
      }
      const mean = sum / n;
      blockVars.push(sumsq / n - mean * mean);
    }
  }
  const avgVar = blockVars.reduce((a, b) => a + b, 0) / blockVars.length;
  const stdVar = Math.sqrt(
    blockVars.reduce((a, b) => a + (b - avgVar) ** 2, 0) / blockVars.length
  );
  const ratio = avgVar > 0 ? stdVar / avgVar : 0;

  return { ratio, width: img.naturalWidth, height: img.naturalHeight };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  const start = performance.now();
  const [meta, img] = await Promise.all([inspectMetadata(file), loadImage(file)]);
  const pixel = analyzePixels(img);

  let metaScore: number;
  if (meta.aiSignature) metaScore = 90;
  else if (meta.hasCamera) metaScore = 10;
  else if (meta.hasExif) metaScore = 35;
  else metaScore = 55;

  let pixelScore: number;
  let textureStatus: ForensicIndicator["status"];
  let textureValue: string;
  if (pixel.ratio < 0.55) {
    pixelScore = 80;
    textureStatus = "suspicious";
    textureValue = "Unnaturally uniform";
  } else if (pixel.ratio < 0.9) {
    pixelScore = 50;
    textureStatus = "warning";
    textureValue = "Moderate irregularity";
  } else {
    pixelScore = 15;
    textureStatus = "clean";
    textureValue = "Organic / high-entropy";
  }

  const composite = Math.round(metaScore * 0.4 + pixelScore * 0.6);

  let classification: AnalysisResult["classification"];
  if (composite >= 65) classification = "AI_GENERATED";
  else if (composite >= 38) classification = "INCONCLUSIVE";
  else classification = "HUMAN_CREATED";

  const confidence = classification === "INCONCLUSIVE"
    ? Math.round(100 - Math.abs(composite - 50) * 2)
    : Math.round(50 + Math.abs(composite - 50));

  const forensicIndicators: ForensicIndicator[] = [
    {
      id: "metadata-provenance",
      name: "Metadata Provenance",
      value: meta.aiSignature
        ? `Generator signature: "${meta.aiSignature}"`
        : meta.hasCamera
        ? `Camera metadata: ${meta.cameraName}`
        : meta.hasExif
        ? "Partial EXIF, no camera tag"
        : "No EXIF metadata found",
      status: meta.aiSignature ? "suspicious" : meta.hasCamera ? "clean" : "warning",
      description: meta.aiSignature
        ? "Embedded metadata matches a known AI-generation tool signature."
        : meta.hasCamera
        ? "Camera make/model metadata is present and consistent with a physical capture device."
        : "No camera provenance metadata found — common in both AI output and re-saved or screenshotted images, so treat as weak evidence alone.",
      weight: 0.85,
    },
    {
      id: "texture-consistency",
      name: "Texture & Edge Consistency",
      value: textureValue,
      status: textureStatus,
      description:
        textureStatus === "suspicious"
          ? "Pixel-level texture is unusually uniform across large regions — a pattern typical of diffusion/GAN upsampling rather than organic sensor noise."
          : textureStatus === "warning"
          ? "Texture irregularity is moderate — not conclusive on its own."
          : "Texture shows the irregular, high-entropy noise pattern typical of a real camera sensor.",
      weight: 0.9,
    },
    {
      id: "file-format",
      name: "Container Format",
      value: meta.isJpeg ? "JPEG/DCT" : meta.isPng ? "PNG" : file.type,
      status: "info",
      description: `File parsed as ${file.type || "unknown type"}. Format alone is not a reliable signal — included for reference.`,
      weight: 0.1,
    },
  ];

  return {
    classification,
    confidence,
    modelName: "VERITAS Forensic Heuristics v1",
    processingTime: Math.round(performance.now() - start),
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      dimensions: { width: pixel.width, height: pixel.height },
      lastModified: file.lastModified,
    },
    metadata: {
      hasExif: meta.hasExif,
      colorProfile: "sRGB (assumed)",
      bitDepth: 8,
      compression: meta.isJpeg ? "JPEG/DCT" : meta.isPng ? "PNG (lossless)" : "Unknown",
      noisePattern: textureValue,
      frequencyAnomaly: textureStatus === "suspicious",
      thumbnailMatch: false,
    },
    forensicIndicators,
  };
}
