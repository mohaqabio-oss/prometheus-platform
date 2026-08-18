export interface MemberAchievement {
  id: string;
  title: string;
  description: string;
  awardedDate: string;
}

export interface MemberContribution {
  id: string;
  title: string;
  type: "مقالة" | "مشروع" | "ورقة بحثية";
  date: string;
  link: string;
}

export interface MockMember {
  id: string;
  name: string;
  role: string;
  department: "الهندسة البرمجية" | "البحث العلمي" | "التعليم والتطوير" | "الموارد البشرية والعمليات";
  status: "نشط" | "خريج" | "في إجازة";
  avatarUrl: string;
  bio: string;
  volunteerHours: number;
  articlesCount: number;
  projectsCount: number;
  researchCount: number;
  joinDate: string;
  socialLinks: Array<{ platform: string; url: string }>;
  achievements: MemberAchievement[];
  recentContributions: MemberContribution[];
  certificateCode?: string;
}

export const MOCK_MEMBERS: MockMember[] = [
  {
    id: "mem-1",
    name: "كرار المنصور",
    role: "قائد قسم الهندسة البرمجية والمنصات",
    department: "الهندسة البرمجية",
    status: "نشط",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "مهندس برمجيات متخصص في بناء المنصات الموزعة وقواعد البيانات وتطوير تطبيقات الويب الحديثة بـ Next.js و TypeScript.",
    volunteerHours: 140,
    articlesCount: 6,
    projectsCount: 3,
    researchCount: 2,
    joinDate: "يناير 2026",
    certificateCode: "PRM-2026-DEV-001",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
    achievements: [
      {
        id: "ach-1",
        title: "وسام التميز الهندسي",
        description: "ممنوح لإكمال أكثر من 100 ساعة تطوعية في تطوير البنية التحتية البرمجية للمنصة.",
        awardedDate: "أغسطس 2026",
      },
    ],
    recentContributions: [
      {
        id: "c-1",
        title: "بنية الأنظمة الموزعة الحديثة وقواعد البيانات الرسومية",
        type: "مقالة",
        date: "14 أغسطس 2026",
        link: "/articles/architecture-decentralized-knowledge-graphs",
      },
    ],
  },
  {
    id: "mem-2",
    name: "سارة الحسني",
    role: "مديرة قسم البحث العلمي والبيولوجيا المحسوبة",
    department: "البحث العلمي",
    status: "نشط",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "باحثة أكاديمية متخصصة في تحليل البيانات الجينية وتطبيقات التعلم العميق في العلوم الحيوية.",
    volunteerHours: 125,
    articlesCount: 4,
    projectsCount: 2,
    researchCount: 5,
    joinDate: "فبراير 2026",
    certificateCode: "PRM-2026-RES-002",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
    achievements: [
      {
        id: "ach-2",
        title: "جائزة التميز الأكاديمي",
        description: "ممنوحة لإعداد ونشر 5 مراجعات منهجية في منشورات بروميثيوس.",
        awardedDate: "يوليو 2026",
      },
    ],
    recentContributions: [
      {
        id: "c-2",
        title: "مراجعة منهجية: تطبيقات التعلم العميق في تحليل المتغيرات الجينية",
        type: "ورقة بحثية",
        date: "10 أغسطس 2026",
        link: "/articles/systematic-review-ml-genomics",
      },
    ],
  },
  {
    id: "mem-3",
    name: "مصطفى طارق",
    role: "رئيس تحرير منشورات بروميثيوس",
    department: "التعليم والتطوير",
    status: "نشط",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "باحث ومحرر مهتم بصناعة المحتوى التعليمي المفتوح وتسهيل المفاهيم الأكاديمية المعقدة للشباب.",
    volunteerHours: 95,
    articlesCount: 8,
    projectsCount: 1,
    researchCount: 1,
    joinDate: "مارس 2026",
    certificateCode: "PRM-2026-ED-003",
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com" },
    ],
    achievements: [],
    recentContributions: [
      {
        id: "c-3",
        title: "فن الكتابة التقنية وصناعة المحتوى الأكاديمي للشباب",
        type: "مقالة",
        date: "5 أغسطس 2026",
        link: "/articles/art-of-technical-writing-youth",
      },
    ],
  },
  {
    id: "mem-4",
    name: "عمر الفاروق",
    role: "منسق الموارد البشرية والعمليات",
    department: "الموارد البشرية والعمليات",
    status: "نشط",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "متخصص في إدارة وتطوير الكوادر الشبابية، تقييم الساعات التطوعية، وإدارة المقابلات والقبول.",
    volunteerHours: 85,
    articlesCount: 2,
    projectsCount: 4,
    researchCount: 0,
    joinDate: "أبريل 2026",
    certificateCode: "PRM-2026-HR-005",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
    achievements: [],
    recentContributions: [
      {
        id: "c-4",
        title: "المهارات الناعمة والإدارة المؤسسية في الفرق التطوعية",
        type: "مقالة",
        date: "1 أغسطس 2026",
        link: "/articles/soft-skills-voluntary-leadership",
      },
    ],
  },
];
