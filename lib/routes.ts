export function getArticlePublicUrl(slug: string, type?: string | null): string {
  const isAcademic = type === "ACADEMIC";
  if (isAcademic) {
    if (process.env.NODE_ENV === "development") {
      return `/post/articles/${slug}`;
    }
    return `https://post.pmthiq.online/articles/${slug}`;
  }
  return `/blog/${slug}`;
}
