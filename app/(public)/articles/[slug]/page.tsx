import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MOCK_ARTICLES } from "@/lib/data/mock-articles";
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  ExternalLink,
  BookOpen,
  Share2,
  UserCheck,
} from "lucide-react";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: [article.category],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function SingleArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Related Articles
  const relatedArticles = MOCK_ARTICLES.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  ).slice(0, 2);

  return (
    <article className="py-12 sm:py-20 bg-brand-dark-950 min-h-screen text-foreground animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/articles">
            <Button variant="ghost" size="sm" className="gap-2 text-brand-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Prometheus Post</span>
            </Button>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* ARTICLE HEADER */}
        {/* ========================================================================= */}
        <header className="space-y-6 pb-10 border-b border-brand-dark-800">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge variant="orange">{article.category}</Badge>

            <div className="flex items-center gap-4 text-xs font-mono text-brand-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                {article.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {article.viewsCount} reads
              </span>
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-brand-gray-300 text-lg sm:text-xl font-normal leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Author Byline Bar */}
          <div className="pt-4 flex items-center justify-between border-t border-brand-dark-800/60">
            <div className="flex items-center gap-3">
              <Avatar
                src={article.author.avatarUrl}
                name={article.author.name}
                size="custom"
                className="w-11 h-11 text-sm font-bold shadow-md"
              />
              <div>
                <p className="text-sm font-semibold text-white">{article.author.name}</p>
                <p className="text-xs text-brand-gray-400">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button aria-label="Share article" variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full" title="Share article">
                <Share2 className="w-4 h-4 text-brand-gray-400" />
              </Button>
            </div>
          </div>

        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="my-10 rounded-2xl overflow-hidden border border-brand-dark-800 bg-brand-dark-900 aspect-video shadow-2xl">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* ARTICLE BODY CONTENT */}
        {/* ========================================================================= */}
        <div className="py-6 article-body">
          {article.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("## ")) {
              return <h2 key={index}>{paragraph.replace("## ", "")}</h2>;
            }
            if (paragraph.startsWith("### ")) {
              return <h3 key={index}>{paragraph.replace("### ", "")}</h3>;
            }
            if (paragraph.startsWith("> ")) {
              return (
                <blockquote key={index}>
                  {paragraph.replace("> ", "").replace(/"/g, "")}
                </blockquote>
              );
            }
            if (paragraph.startsWith("```")) {
              const codeText = paragraph.replace(/```[a-z]*/g, "").trim();
              return (
                <pre key={index}>
                  <code>{codeText}</code>
                </pre>
              );
            }
            if (paragraph.startsWith("* ")) {
              const items = paragraph.split("\n* ").map((i) => i.replace("* ", ""));
              return (
                <ul key={index}>
                  {items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* ========================================================================= */}
        {/* SOURCES & REFERENCES SECTION */}
        {/* ========================================================================= */}
        {article.sources.length > 0 && (
          <section className="my-12 pt-8 border-t border-brand-dark-800 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-orange" />
              <h3 className="font-display text-lg font-bold text-white">Sources & Academic Citations</h3>
            </div>
            
            <div className="space-y-3">
              {article.sources.map((src) => (
                <div
                  key={src.id}
                  className="p-4 rounded-lg bg-brand-dark-900 border border-brand-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                >
                  <div>
                    <p className="text-white font-medium">{src.title}</p>
                    {src.citation && <p className="text-brand-gray-400 text-[11px] mt-0.5">{src.citation}</p>}
                  </div>

                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand-orange hover:underline shrink-0"
                    >
                      <span>Verify Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* AUTHOR PROFILE CARD */}
        {/* ========================================================================= */}
        <section className="my-12 p-6 sm:p-8 rounded-xl border border-brand-dark-800 bg-brand-dark-900/80 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar
            src={article.author.avatarUrl}
            name={article.author.name}
            size="md"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-display text-lg font-bold text-white">{article.author.name}</h4>
              <Badge variant="dark" className="text-[10px]">
                <UserCheck className="w-3 h-3 text-brand-orange" />
                Verified Author
              </Badge>
            </div>
            <p className="text-xs font-mono text-brand-orange">{article.author.role}</p>
            <p className="text-xs text-brand-gray-400 leading-relaxed max-w-xl">
              {article.author.bio}
            </p>
          </div>
        </section>

        {/* Related Articles Strip */}
        {relatedArticles.length > 0 && (
          <section className="pt-12 border-t border-brand-dark-800 space-y-6">
            <h3 className="font-display text-xl font-bold text-white">More in {article.category}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Card key={rel.id} className="p-6 bg-brand-dark-900/60">
                  <Badge variant="orange" className="mb-2">{rel.category}</Badge>
                  <h4 className="font-display text-base font-bold text-white hover:text-brand-orange transition-colors">
                    <Link href={`/articles/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                  <p className="text-xs text-brand-gray-400 line-clamp-2 mt-2 leading-relaxed">
                    {rel.excerpt}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
}
