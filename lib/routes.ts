export function getArticlePublicUrl(slug: string, type?: string | null): string {
  if (type === "ACADEMIC") {
    return `/PtPost/articles/${slug}`;
  }
  return `/blog/${slug}`;
}
