export interface HomeMockData {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };
  about: {
    badge: string;
    title: string;
    description: string;
    stats: Array<{ label: string; value: string }>;
  };
  pillars: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  identity: {
    badge: string;
    title: string;
    quote: string;
    points: string[];
  };
}

export const MOCK_HOME_DATA: HomeMockData = {
  hero: {
    title: "فريق بروميثيوس التطوعي",
    subtitle: "منظمة مؤسسية تطوعية تهدف لنشر المعرفة الأكاديمية، بناء المنصات البرمجية، وإعادة تعريف العمل التطوعي الأكاديمي لدى الشباب.",
    ctaPrimary: { label: "استكشف منشورات بروميثيوس", href: "/articles" },
    ctaSecondary: { label: "انضم إلى الفريق", href: "/join-us" },
  },
  about: {
    badge: "رسالتنا المؤسسية",
    title: "إشعال المعرفة وتمكين العقول الشبابية",
    description: "استلهاماً من رمزية بروميثيوس في إيصال المعرفة للنفع العام، يعمل فريقنا التطوعي برؤية هندسية وأكاديمية صارمة لبناء منصات تقنية وبحوث مفتوحة المصدر تخدم المجتمع.",
    stats: [
      { label: "ساعة تطوعية موثقة", value: "+600" },
      { label: "أوراق بحثية ومقالات", value: "+45" },
      { label: "عضو متطوع نشط", value: "+30" },
      { label: "أقسام تخصصية", value: "4" },
    ],
  },
  pillars: [
    {
      id: "tech",
      title: "الهندسة البرمجية والتطوير",
      description: "بناء الأنظمة البرمجية، وتطبيقات الويب المفتوحة المصدر بأحدث التقنيات والمعايير الهندسية.",
      icon: "Code",
    },
    {
      id: "research",
      title: "البحث العلمي والتحليل",
      description: "صياغة المراجعات المنهجية وتحليل البيانات والمعلومات العلمية لنشرها للجمهور.",
      icon: "Microscope",
    },
    {
      id: "education",
      title: "التعليم المفتوح والمحتوى",
      description: "إعداد المحتوى التعليمي والدروس الأكاديمية المبسطة لإيصال المعرفة لأكبر شريحة.",
      icon: "BookOpen",
    },
    {
      id: "hr",
      title: "إدارة الموارد والعمليات",
      description: "تنظيم الهيكل المؤسسي للتطوع، وتقييم الساعات والشهادات الموثقة رسمياً.",
      icon: "Users",
    },
  ],
  identity: {
    badge: "هويتنا البصرية والفكرية",
    title: "نهج هندسي، محتوى رصين، وأثر مستدام",
    quote: "نؤمن بأن التطوع ليس مجرد نشاط عابر، بل هو التزام مؤسسي وأكاديمي ببناء أدوات وبحوث تترك أثراً حقيقياً.",
    points: [
      "الانضباط والأداء المؤسسي عالي الكفاءة",
      "الشفافية الكاملة وتوثيق الساعات والشهادات",
      "التعليم المجاني المفتوح للجميع دون قيود",
    ],
  },
};
