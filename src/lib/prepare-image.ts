// Runs in the browser. Every image is redrawn onto a canvas before upload: it
// keeps files small, and it drops EXIF metadata such as a photo's location.

const MAX_SIDE = 2000;
const MAX_BYTES = 3_400_000;

export type PreparedImage = { blob: Blob; width: number; height: number };

function encode(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error(`${file.name} is not an image this browser can read.`);
  });
  try {
    for (let scale = 1; scale > 0.3; scale *= 0.75) {
      const ratio = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * ratio * scale));
      const height = Math.max(1, Math.round(bitmap.height * ratio * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("This browser cannot process images.");
      context.drawImage(bitmap, 0, 0, width, height);

      let blob = await encode(canvas, "image/webp", 0.86);
      if (blob?.type !== "image/webp") {
        // Browsers without WebP encoding get a JPEG on a white background.
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);
        blob = await encode(canvas, "image/jpeg", 0.88);
      }
      if (blob && blob.size <= MAX_BYTES) return { blob, width, height };
    }
    throw new Error(`${file.name} is too large, even after resizing.`);
  } finally {
    bitmap.close();
  }
}
