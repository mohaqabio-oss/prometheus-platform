/**
 * Reads a File object and compresses it using HTML5 Canvas
 * into a lightweight base64 Data URL (data:image/jpeg;base64,...).
 */
export function convertImageToBase64(
  file: File,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("لم يتم اختيار أي ملف."));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(event.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error("فشل قراءة تفاصيل الصورة."));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("فشل قراءة الملف عبر المتصفح."));
    };

    reader.readAsDataURL(file);
  });
}
