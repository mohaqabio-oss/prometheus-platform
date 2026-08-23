import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lzqpkpsofoqpvxcngauf.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sW-D-placeholder";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Client-Side Upload Utility (Browser Environment)
 * Directly uploads a File object from an HTML <input type="file"> to Supabase Storage.
 * Generates a strict alphanumeric safe file path (no raw file names, spaces, or non-ASCII characters).
 */
export async function uploadImageClientSide(
  file: File,
  bucket: "avatars" | "magazine" = "avatars"
): Promise<string> {
  if (!file) {
    throw new Error("لم يتم اختيار أي ملف للرفع.");
  }

  // 1. Strict, safe extension extraction
  const rawExt = file.name ? file.name.split(".").pop() || "jpg" : "jpg";
  const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";

  // 2. Strict alphanumeric safe path without raw file names, spaces, or leading slashes
  const safeFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

  console.log(`[CLIENT-SIDE SUPABASE UPLOAD] Starting upload for file (${file.name || 'unnamed'}) -> Bucket: ${bucket}, SafePath: ${safeFileName}`);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(safeFileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("[CLIENT-SIDE SUPABASE UPLOAD ERROR]:", {
      bucket,
      safeFileName,
      error,
      message: error.message,
    });
    throw new Error(`فشل رفع الصورة إلى Supabase (${bucket}): ${error.message}`);
  }

  const targetPath = data?.path || safeFileName;
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(targetPath);

  if (!publicUrlData?.publicUrl) {
    throw new Error("تعذر الحصول على رابط الصورة المرفوعة من Supabase.");
  }

  console.log(`[CLIENT-SIDE SUPABASE UPLOAD SUCCESS] URL: ${publicUrlData.publicUrl}`);
  return publicUrlData.publicUrl;
}

/**
 * Compatibility wrapper
 */
export async function uploadImageToSupabase(
  file: File | string,
  bucket: "avatars" | "magazine" = "avatars"
): Promise<string> {
  if (typeof file === "string") {
    if (file.startsWith("http") && !file.startsWith("blob:")) {
      return file;
    }
    throw new Error("Invalid image format.");
  }

  return uploadImageClientSide(file, bucket);
}
