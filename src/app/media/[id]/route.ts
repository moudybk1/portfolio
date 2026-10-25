import { getImage } from "@/lib/media";
import { parseMediaUrl } from "@/lib/media-url";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const media = parseMediaUrl(`/media/${id}`);
  const image = media && (await getImage(media.id));
  if (!image) return new Response("Not found", { status: 404 });

  return new Response(image.data, {
    headers: {
      "Content-Type": image.mime,
      // An upload never changes, so its URL can be cached for good.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
