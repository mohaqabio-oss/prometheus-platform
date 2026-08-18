export interface ArticleSource {
  id: string;
  title: string;
  url?: string;
  citation?: string;
}

export interface MockArticle {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  category: "الهندسة البرمجية" | "البحث العلمي" | "التعليم والتطوير" | "المهارات الناعمة";
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
    bio: string;
  };
  publishedAt: string;
  readTime: string;
  viewsCount: number;
  featured?: boolean;
  coverImage?: string;
  sources: ArticleSource[];
}

export interface MockCollection {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  articlesCount: number;
  publishedAt: string;
  articleSlugs?: string[];
}

export const MOCK_COLLECTIONS: MockCollection[] = [
  {
    id: "col-1",
    title: "مجموعة أغسطس 2026: الهندسة والذكاء الاصطناعي",
    slug: "august-2026-collection",
    description: "سلسلة مقالات أكاديمية تناقش بنية الأنظمة الموزعة وتطبيقات الذكاء الاصطناعي في العلوم الحيوية.",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    articlesCount: 4,
    publishedAt: "15 أغسطس 2026",
    articleSlugs: ["architecture-decentralized-knowledge-graphs", "systematic-review-ml-genomics"],
  },
  {
    id: "col-2",
    title: "سلسلة البحث العلمي والتحليل الجيني",
    slug: "genomic-research-series",
    description: "مجموعة مراجعات منهجية حول استخدام شبكات التعلم العميق في التنبؤ بالتغيرات الجينية.",
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    articlesCount: 3,
    publishedAt: "10 أغسطس 2026",
    articleSlugs: ["systematic-review-ml-genomics"],
  },
];

export const MOCK_ARTICLES: MockArticle[] = [
  {
    id: "art-1",
    title: "بنية الأنظمة الموزعة الحديثة وقواعد البيانات الرسومية",
    slug: "architecture-decentralized-knowledge-graphs",
    subtitle: "تحليل منهجي لبناء قواعد البيانات وتطبيقات خوارزميات التوافق في المشاريع المعقدة",
    excerpt: "دراسة عميقة حول كيفية تصميم قواعد البيانات الرسومية وتوسيع الأنظمة الموزعة لتتحمل الضغط العالي مع الحفاظ على الأداء.",
    content: `## مقدمة في بنية الأنظمة الموزعة

تعد الأنظمة الموزعة العمود الفقري للبنية التحتية الرقمية الحديثة. مع تزايد حجوم البيانات وتوزع المستخدمين جغرافياً، أصبحت الحاجة ملحة لتطوير أنظمة قادرة على معالجة البيانات بكفاءة عالية وبدون نقاط فشل فردية.

### تصميم قواعد البيانات الرسومية

تتميز قواعد البيانات الرسومية بقدرتها على تمثيل العلاقات المعقدة بين الكيانات بشكل طبيعي وفعال، مقارنة بقواعد البيانات العلائقية التقليدية.

* كفاءة عالية في الاستعلام عن العلاقات المتعددة
* مرونة في توسيع المخطط دون الحاجة لإعادة التراكيب
* دعم خوارزميات تحليل الشبكات والمعارف المترابطة

> "إن البرمجة والأنظمة الموزعة تتطلب فهماً عميقاً لآليات التوافق وإدارة حالة البيانات عبر الشبكات المتعددة."

\`\`\`typescript
// نموذج استعلام رسومي
const query = "MATCH (author:Person)-[:WROTE]->(article:Article) RETURN author, article";
\`\`\`

## التطلع للمستقبل

يسعى فريق بروميثيوس لتطوير هذه المفاهيم ونشر الأدوات المفتوحة المصدر لدعم الباحثين والمطورين في العالم العربي.`,
    category: "الهندسة البرمجية",
    author: {
      name: "كرار المنصور",
      role: "قائد قسم الهندسة البرمجية",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      bio: "مهندس برمجيات متخصص في بناء المنصات الموزعة وقواعد البيانات الرسومية.",
    },
    publishedAt: "14 أغسطس 2026",
    readTime: "8 دقائق",
    viewsCount: 342,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    sources: [
      {
        id: "src-1",
        title: "Designing Data-Intensive Applications - Martin Kleppmann",
        citation: "O'Reilly Media, 2017.",
      },
    ],
  },
  {
    id: "art-2",
    title: "مراجعة منهجية: تطبيقات التعلم العميق في تحليل المتغيرات الجينية",
    slug: "systematic-review-ml-genomics",
    subtitle: "تقييم نماذج الشبكات العصبية العميقة وتنبؤات تأثير التغيرات الجينية على الصحة",
    excerpt: "استعراض شامل لأحدث الأوراق البحثية التي تستخدم نماذج التعلم الآلي للتنبؤ بالأمراض والتغيرات الجينية نادرة الحدوث.",
    content: `## مقدمة في علم الجينات المحسوب

يمثل التداخل بين علم الجينات والذكاء الاصطناعي إحدى أكثر الجبهات العلمية إثارة في القرن الحادي والعشرين.

### نماذج التنبؤ الجيني

تساعد النماذج الذكية في تحليل ملايين المتغيرات الجينية وتحديد الآثار الوظيفية المحتملة على البروتينات.

* استخدام شبكات التعلم العميق للتحليل التسلسلي
* تقييم دقة النماذج مقارنة بالفحوصات المختبرية
* توفير أدوات تشخيصية مساعدة للأطباء والباحثين

> "الهدف الأساسي هو تحويل البيانات الجينية الضخمة إلى رؤى طبية قابلة للتطبيق العلاجي."`,
    category: "البحث العلمي",
    author: {
      name: "سارة الحسني",
      role: "مديرة قسم البحث العلمي",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      bio: "باحثة في البيولوجيا المحسوبة والجينوميات.",
    },
    publishedAt: "10 أغسطس 2026",
    readTime: "12 دقيقة",
    viewsCount: 512,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    sources: [
      {
        id: "src-2",
        title: "Deep Learning in Genomics - Nature Reviews Genetics",
        citation: "Nature Publishing Group, 2024.",
      },
    ],
  },
  {
    id: "art-3",
    title: "فن الكتابة التقنية وصناعة المحتوى الأكاديمي للشباب",
    slug: "art-of-technical-writing-youth",
    excerpt: "لماذا تعد التوثيقات البرمجية والمقالات العلمية أداة التمكين الأولى للفرق التطوعية الأكاديمية.",
    content: `## أهمية الكتابة التقنية

الكتابة التقنية ليست مجرد تدوين للرموز البرمجية، بل هي جسر نقل المعرفة بين الخبراء والمتعلمين.`,
    category: "التعليم والتطوير",
    author: {
      name: "مصطفى طارق",
      role: "رئيس تحرير منشورات بروميثيوس",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      bio: "محرر وباحث في مجالات التعليم والتطوير التقني.",
    },
    publishedAt: "5 أغسطس 2026",
    readTime: "6 دقائق",
    viewsCount: 289,
    sources: [],
  },
  {
    id: "art-4",
    title: "المهارات الناعمة والإدارة المؤسسية في الفرق التطوعية",
    slug: "soft-skills-voluntary-leadership",
    excerpt: "دليل العمل الجماعي، وإدارة الوقت، والتواصل الفعال بين أعضاء الأقسام المختلفة في المنصات الأكاديمية.",
    content: `## القيادة والعمل الجماعي

يتطلب نجاح المنظمات التطوعية مهارات تواصل عالية وانضباطاً مؤسسياً لا يقل عن العمل في الشراكات التجارية.`,
    category: "المهارات الناعمة",
    author: {
      name: "عمر الفاروق",
      role: "منسق الموارد البشرية والعمليات",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
      bio: "متخصص في إدارة الموارد البشرية وتطوير الفرق التطوعية.",
    },
    publishedAt: "1 أغسطس 2026",
    readTime: "5 دقائق",
    viewsCount: 198,
    sources: [],
  },
];
