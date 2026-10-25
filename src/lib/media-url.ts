// Shared by the server and the admin editor, so it must not import server code.
// Uploaded images live at /media/<id>-<width>x<height>; the size in the path
// lets pages reserve space before the image loads, without a query string.

const MEDIA_URL = /^\/media\/([a-f0-9]{32})-(\d{1,5})x(\d{1,5})$/;

export function mediaUrl(id: string, width: number, height: number): string {
  return `/media/${id}-${width}x${height}`;
}

export function parseMediaUrl(
  url: string,
): { id: string; width: number; height: number } | undefined {
  const match = MEDIA_URL.exec(url);
  if (!match) return undefined;
  return { id: match[1], width: Number(match[2]), height: Number(match[3]) };
}

// Cover images may be an uploaded image or an external https URL.
export function isAllowedImageUrl(url: string): boolean {
  if (parseMediaUrl(url)) return true;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}
