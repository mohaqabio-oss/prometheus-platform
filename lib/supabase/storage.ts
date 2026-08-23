import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lzqpkpsofoqpvxcngauf.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sW-D-placeholder";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Ultra-simple Client-Side Upload Utility (Browser Environment)
 * Uses exact raw string timestamp path: String(Date.now())
 */
export async function uploadImageClientSide(
  file: File,
  bucket: "avatars" | "magazine" = "avatars"
): Promise<string> {
  if (!file) {
    throw new Error("لم يتم اختيار أي ملف للرفع.");
  }

  const rawPath = String(Date.now());

  console.log(`[CLIENT-SIDE SUPABASE UPLOAD] Uploading to bucket '${bucket}' with rawPath '${rawPath}'`);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(rawPath, file, { cacheControl: "3600", upsert: true });

  if (error) {
    console.error("[CLIENT-SIDE SUPABASE UPLOAD ERROR]:", {
      bucket,
      rawPath,
      error,
      message: error.message,
    });
    throw new Error(`فشل رفع الصورة إلى Supabase (${bucket}): ${error.message}`);
  }

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(rawPath).data.publicUrl;

  if (!publicUrl) {
    throw new Error("تعذر الحصول على رابط الصورة المرفوعة من Supabase.");
  }

  console.log(`[CLIENT-SIDE SUPABASE UPLOAD SUCCESS] URL: ${publicUrl}`);
  return publicUrl;
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
