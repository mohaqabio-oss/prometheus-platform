import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lzqpkpsofoqpvxcngauf.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sW-D-placeholder";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Client-Side Upload Utility (Browser Environment)
 * Completely ignores file.name to prevent parsing errors.
 * Hardcodes strict alphanumeric path formats:
 * - 'avatars' bucket -> 'avatar-' + Date.now() + '.png'
 * - 'magazine' bucket -> 'article-' + Date.now() + '.png'
 */
export async function uploadImageClientSide(
  file: File,
  bucket: "avatars" | "magazine" = "avatars"
): Promise<string> {
  if (!file) {
    throw new Error("لم يتم اختيار أي ملف للرفع.");
  }

  const prefix = bucket === "magazine" ? "article" : "avatar";
  const finalPath = `${prefix}-${Date.now()}.png`;

  console.log(`[CLIENT-SIDE SUPABASE UPLOAD] Uploading to Bucket '${bucket}' with path '${finalPath}'`);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(finalPath, file, {
      upsert: true,
    });

  if (error) {
    console.error("[CLIENT-SIDE SUPABASE UPLOAD ERROR]:", {
      bucket,
      finalPath,
      error,
      message: error.message,
    });
    throw new Error(`فشل رفع الصورة إلى Supabase (${bucket}): ${error.message}`);
  }

  const targetPath = data?.path || finalPath;
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
