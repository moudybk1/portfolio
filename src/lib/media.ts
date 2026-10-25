import { randomBytes } from "crypto";
import { getDb } from "./db";
import { mediaUrl } from "./media-url";

// The editor resizes images before upload, so this only guards the database.
export const MAX_IMAGE_BYTES = 3_500_000;
const MAX_IMAGE_SIDE = 10_000;
const MEDIA_ID = /^[a-f0-9]{32}$/;

// The type is read from the bytes, never from the client, so only real raster
// images are ever served back (no SVG or HTML).
export function detectImageType(bytes: Uint8Array): string | undefined {
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...bytes.subarray(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (ascii(0, 8) === "\x89PNG\r\n\x1a\n") return "image/png";
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return "image/gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) {
    return "image/avif";
  }
  return undefined;
}

export class ImageUploadError extends Error {}

export async function saveImage(
  bytes: Uint8Array,
  width: number,
  height: number,
): Promise<string> {
  if (bytes.byteLength === 0) throw new ImageUploadError("The file is empty.");
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new ImageUploadError("The image is larger than 3.5 MB.");
  }
  const mime = detectImageType(bytes);
  if (!mime) {
    throw new ImageUploadError("Use a JPEG, PNG, WebP, GIF or AVIF image.");
  }
  const validSide = (side: number) =>
    Number.isSafeInteger(side) && side > 0 && side <= MAX_IMAGE_SIDE;
  if (!validSide(width) || !validSide(height)) {
    throw new ImageUploadError("The image size could not be read.");
  }

  const id = randomBytes(16).toString("hex");
  const db = await getDb();
  await db.execute({
    sql: `INSERT INTO media (id, mime, data, width, height, size)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [id, mime, bytes, width, height, bytes.byteLength],
  });
  return mediaUrl(id, width, height);
}

export async function getImage(
  id: string,
): Promise<{ mime: string; data: ArrayBuffer } | undefined> {
  if (!MEDIA_ID.test(id)) return undefined;
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT mime, data FROM media WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0];
  if (!row) return undefined;
  return { mime: String(row.mime), data: row.data as ArrayBuffer };
}
