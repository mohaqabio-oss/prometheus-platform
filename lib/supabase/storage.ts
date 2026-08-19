import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lzqpkpsofoqpvxcngauf.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.sW-D-placeholder";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads a base64 or File image to a public Supabase Storage bucket ('avatars' or 'magazine')
 */
export async function uploadImageToSupabase(
  file: File | string,
  bucket: "avatars" | "magazine"
): Promise<string> {
  try {
    const fileExt = file instanceof File ? file.name.split(".").pop() : "jpg";
    const fileName = `${bucket}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;

    let fileData: any = file;
    if (typeof file === "string" && file.startsWith("data:image")) {
      const res = await fetch(file);
      fileData = await res.blob();
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileData, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.warn(`Supabase Storage upload warning (${bucket}):`, error.message);
      // Fallback: If bucket does not exist or fails, return raw dataUrl if provided or fallback URL
      if (typeof file === "string") return file;
      return URL.createObjectURL(file as File);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (e: any) {
    console.error("Supabase Storage error:", e);
    if (typeof file === "string") return file;
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80";
  }
}
