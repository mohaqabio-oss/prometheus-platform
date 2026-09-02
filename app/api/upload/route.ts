import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "لم يتم تقديم أي ملف صالح للرفع" },
        { status: 400 }
      );
    }

    let buffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch (err: any) {
      return NextResponse.json(
        { error: "فشل في قراءة بيانات الملف المرفوع" },
        { status: 400 }
      );
    }

    // Create unique filename
    const originalName = file.name || "upload.png";
    const ext = path.extname(originalName) || ".png";
    const sanitizeName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${Date.now()}-${sanitizeName}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists synchronously
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (mkdirErr: any) {
      console.error("[UPLOAD API MKDIR ERROR]:", mkdirErr);
      return NextResponse.json(
        { error: `فشل إنشاء مجلد الرفع: ${mkdirErr.message}` },
        { status: 500 }
      );
    }

    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    try {
      fs.writeFileSync(filePath, buffer);
    } catch (writeErr: any) {
      console.error("[UPLOAD API WRITE FILE ERROR]:", writeErr);
      return NextResponse.json(
        { error: `فشل كتابة الملف على الخادم: ${writeErr.message}` },
        { status: 500 }
      );
    }

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url, success: true }, { status: 200 });
  } catch (error: any) {
    console.error("[UPLOAD API GENERAL ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "حدث خطأ غير متوقع أثناء رفع الملف" },
      { status: 500 }
    );
  }
}
