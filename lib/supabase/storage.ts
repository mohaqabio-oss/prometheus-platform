import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lzqpkpsofoqpvxcngauf.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sW-D-placeholder";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Client-Side Upload Utility (Browser Environment)
 * Directly uploads a File object from an HTML <input type="file"> to Supabase Storage.
 * Completely bypasses Next.js server action payload limits.
 */
export async function uploadImageClientSide(
  file: File,
  bucket: "avatars" | "magazine" = "avatars"
): Promise<string> {
  if (!file) {
    throw new Error("لم يتم اختيار أي ملف للرفع.");
  }

  // Generate unique filename to avoid collision
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanName}`;
  const filePath = `${fileName}`;

  console.log(`[CLIENT-SIDE SUPABASE UPLOAD] Starting upload for file: ${file.name} -> Bucket: ${bucket}, Path: ${filePath}`);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("[CLIENT-SIDE SUPABASE UPLOAD ERROR]:", {
      bucket,
      filePath,
      error,
      message: error.message,
    });
    throw new Error(`فشل رفع الصورة إلى Supabase (${bucket}): ${error.message}`);
  }

  const targetPath = data?.path || filePath;
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
