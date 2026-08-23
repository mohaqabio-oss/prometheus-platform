import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lzqpkpsofoqpvxcngauf.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sW-D-placeholder";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads a base64 or File image to a public Supabase Storage bucket ('avatars' or 'magazine')
 * and returns the fully-qualified public URL (getPublicUrl).
 * Throws explicit detailed errors on upload failure.
 */
export async function uploadImageToSupabase(
  file: File | string,
  bucket: "avatars" | "magazine" = "avatars"
): Promise<string> {
  // If already a valid public HTTP URL and not a blob URL, return directly
  if (typeof file === "string" && file.startsWith("http") && !file.startsWith("blob:")) {
    return file;
  }

  const fileExt = file instanceof File ? file.name.split(".").pop() : "jpg";
  const fileName = `${bucket}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${fileName}`;

  let fileData: any = file;
  if (typeof file === "string" && (file.startsWith("data:image") || file.startsWith("blob:"))) {
    try {
      const res = await fetch(file);
      fileData = await res.blob();
    } catch (fetchErr: any) {
      console.error("[SUPABASE UPLOAD FETCH BLOB ERROR]:", fetchErr);
      throw new Error(`Failed to process local image file: ${fetchErr.message}`);
    }
  }

  console.log(`[SUPABASE UPLOAD START] Bucket: ${bucket}, FilePath: ${filePath}`);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileData, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("[SUPABASE STORAGE UPLOAD FAILED DETAILS]:", {
      bucket,
      filePath,
      errorMessage: error.message,
      name: error.name,
      cause: (error as any).cause,
      status: (error as any).statusCode || (error as any).status,
      supabaseUrl: SUPABASE_URL,
    });
    throw new Error(`Supabase Upload Failed (${bucket}): ${error.message}`);
  }

  const targetPath = data?.path || filePath;

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(targetPath);

  if (publicUrlData?.publicUrl && !publicUrlData.publicUrl.startsWith("blob:")) {
    console.log(`[SUPABASE UPLOAD SUCCESS] Public URL: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  }

  const fallbackUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${targetPath}`;
  console.log(`[SUPABASE UPLOAD FALLBACK URL]: ${fallbackUrl}`);
  return fallbackUrl;
}
