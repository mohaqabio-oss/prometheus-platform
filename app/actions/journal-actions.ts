"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export interface JournalSettingRecord {
  id: string;
  key: string;
  title: string;
  content: string;
  updatedAt: string;
}

const DEFAULT_ETHICS_TITLE = "أخلاقيات النشر والمعايير الأكاديمية والنزاهة العلمية";
const DEFAULT_ETHICS_CONTENT = `## 1. ميثاق النزاهة والالتزام الأكاديمي
تلتزم مجلة **بروميثيوس الأكاديمية (The Prometheus Post)** بأعلى معايير الرصانة العلمية، الشفافية، والتجرد التام. تخضع كافة الأوراق والمقالات والبحوث المودعة لسياسة النزاهة الدولية المتبعة في الدوريات العلمية المحكمة ذات الوصول المفتوح.

## 2. مسؤوليات الباحثين والمؤلفين
- **أصالة البحث:** يجب أن يكون العمل المقدم أصيلاً بالكامل ولم يسبق نشره في أي مؤتمر أو مجلة أخرى، ولا يكون قيد التحكيم لدى أي جهة في الوقت ذاته.
- **مكافحة الانتحال العلمي:** ترفض المجلة بشكل قاطع أي نوع من أنواع السرقة الفكرية أو الاقتباس غير الموثق. تخضع جميع المخطوطات للفحص البرمجي الدقيق قبل إحالتها للتحكيم.
- **تسمية المؤلفين والمشاركين:** يجب إدراج جميع المساهمين الفعليين في الورقة البحثية والتأكد من اطلاعهم وموافقتهم على النسخة النهائية.
- **الإفصاح وتضارب المصالح:** يلتزم الباحثون ببيان أي تضارب محتمل في المصالح وأي جهات داعمة أو ممولة لمشروع البحث.

## 3. سياسة التحكيم المزدوج التعمية (Double-Blind Peer Review)
- تخضع كافة الأوراق المقدمة لتقييم أولي من هيئة التحرير للتأكد من موافقتها لمحاور النشر والضوابط التنسيقية.
- يتم إرسال المخطوطات دون أي معلومات تعريفية عن الباحثين إلى محكّمين اثنين على الأقل من المتخصصين المستقلين في المجال.
- تُجرى عملية المراجعة في سرية مطلقة، وتلتزم هيئة التحرير بحماية الملكية الفكرية للأوراق طوال فترة المراجعة.
- لا يجوز للمحكمين الاستفادة من أية أفكار أو بيانات غير منشورة تم الاطلاع عليها أثناء التحكيم.

## 4. ترخيص الوصول الحر وحقوق الملكية الفكرية (Open Access & CC BY 4.0)
- تنشر المجلة جميع الأوراق البحثية بموجب ترخيص **المشاع الإبداعي (Creative Commons Attribution 4.0 International - CC BY 4.0)**.
- يحتفظ المؤلفون بحق الملكية الفكرية لأبحاثهم، مع منح المجلة الحق الحصري للنشر الأولي والتوزيع الرقمي.
- يحق لأي طرف قراءة وتحميل ونسخ وتوزيع وطباعة الأبحاث مجاناً ودون اشتراكات، مع وجوب العزو الصريح والتوثيق للمؤلف الأصلي والمجلة.

## 5. إجراءات التصويب وسحب الأبحاث
في حال ثبوت خطأ علمي جوهري أو عدم دقة في النتائج بعد النشر، تتعاون هيئة التحرير مع الباحثين لنشر إشعار تصحيح رسمي (Corrigendum) أو سحب الورقة (Retraction) إذا استدعى الأمر حرصاً على الأمانة العلمية الموثقة.`;

async function requireAdminOrEditorPermission() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  const hasAuth =
    session.roles.includes("ADMIN") ||
    session.roles.includes("HR_EDITOR") ||
    session.roles.includes("POST_EDITOR" as any) ||
    session.roles.includes("WRITER");

  if (!hasAuth) {
    throw new Error("Unauthorized access to journal settings.");
  }
  return session;
}

export async function getJournalSetting(key: string): Promise<JournalSettingRecord> {
  try {
    const record = await prisma.journalSetting.findUnique({
      where: { key },
    });

    if (record) {
      return {
        id: record.id,
        key: record.key,
        title: record.title,
        content: record.content,
        updatedAt: record.updatedAt.toISOString(),
      };
    }
  } catch (error) {
    console.error(`[GET_JOURNAL_SETTING_ERROR] Key: ${key}`, error);
  }

  // Fallback defaults for publication ethics
  if (key === "publication_ethics") {
    return {
      id: "default-ethics",
      key: "publication_ethics",
      title: DEFAULT_ETHICS_TITLE,
      content: DEFAULT_ETHICS_CONTENT,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: `default-${key}`,
    key,
    title: "",
    content: "",
    updatedAt: new Date().toISOString(),
  };
}

export async function updateJournalSettingAction(prevState: any, formData: FormData) {
  await requireAdminOrEditorPermission();

  const key = formData.get("key")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString() || "";

  if (!key || !title) {
    return { error: "عنوان الإعداد والمفتاح البرمجي مطلوبان." };
  }

  try {
    await prisma.journalSetting.upsert({
      where: { key },
      update: {
        title,
        content,
      },
      create: {
        key,
        title,
        content,
      },
    });

    revalidatePath("/PtPost/publication-ethics");
    revalidatePath("/PtPost");
    revalidatePath("/admin/post/ethics");
    revalidatePath("/admin/settings");

    return { success: true, message: "تم حفظ سياسات وأخلاقيات النشر بنجاح." };
  } catch (err: any) {
    console.error("[UPDATE_JOURNAL_SETTING_ERROR]:", err);
    return { error: err.message || "فشل حفظ إعدادات المجلة." };
  }
}
