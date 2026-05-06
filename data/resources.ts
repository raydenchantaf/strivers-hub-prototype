export type ResourceCategory = "finance" | "digital" | "marketing" | "legal";

export interface Resource {
  id: number;
  title: { en: string; bm: string };
  excerpt: { en: string; bm: string };
  category: ResourceCategory;
  readTime: number; // minutes
  imageUrl: string;
  date: string;
}

export const resources: Resource[] = [
  {
    id: 1,
    title: {
      en: "Mastering Your Pitch: A Guide for MSMEs",
      bm: "Menguasai Pitching Anda: Panduan untuk PKS",
    },
    excerpt: {
      en: "Learn how to craft a compelling business pitch that gets attention from investors and partners.",
      bm: "Pelajari cara menghasilkan pitching perniagaan yang menarik perhatian pelabur dan rakan kongsi.",
    },
    category: "marketing",
    readTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    date: "2024-11-15",
  },
  {
    id: 2,
    title: {
      en: "Running Sales And Productivity With Claude",
      bm: "Menjalankan Jualan Dan Produktiviti Dengan Claude",
    },
    excerpt: {
      en: "Discover how AI tools can automate repetitive tasks and free up your time for what matters most.",
      bm: "Temui cara alat AI boleh mengautomasikan tugas berulang dan memberi anda masa untuk perkara yang paling penting.",
    },
    category: "digital",
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    date: "2024-11-10",
  },
  {
    id: 3,
    title: {
      en: "Embracing The Implementation Of MSME In Business",
      bm: "Merangkul Pelaksanaan PKS Dalam Perniagaan",
    },
    excerpt: {
      en: "A comprehensive look at what it means to formalise your micro or small business for long-term success.",
      bm: "Tinjauan komprehensif tentang apa yang dimaksudkan dengan memformalkan perniagaan mikro atau kecil anda untuk kejayaan jangka panjang.",
    },
    category: "legal",
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
    date: "2024-11-05",
  },
  {
    id: 4,
    title: {
      en: "Getting Your First Business Loan in Malaysia",
      bm: "Mendapatkan Pinjaman Perniagaan Pertama Anda di Malaysia",
    },
    excerpt: {
      en: "A step-by-step guide to SME financing options in Malaysia, from BSN to TEKUN and beyond.",
      bm: "Panduan langkah demi langkah untuk pilihan pembiayaan PKS di Malaysia, dari BSN ke TEKUN dan seterusnya.",
    },
    category: "finance",
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80",
    date: "2024-10-28",
  },
  {
    id: 5,
    title: {
      en: "Social Media Strategy for Malaysian Entrepreneurs",
      bm: "Strategi Media Sosial untuk Usahawan Malaysia",
    },
    excerpt: {
      en: "How to build a consistent, engaging social media presence across Facebook, Instagram, and TikTok.",
      bm: "Cara membina kehadiran media sosial yang konsisten dan menarik di Facebook, Instagram, dan TikTok.",
    },
    category: "marketing",
    readTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
    date: "2024-10-20",
  },
  {
    id: 6,
    title: {
      en: "Understanding SST and Tax Obligations for Small Businesses",
      bm: "Memahami SST dan Kewajipan Cukai untuk Perniagaan Kecil",
    },
    excerpt: {
      en: "Navigate Malaysia's Sales and Services Tax regime with this practical guide for MSME owners.",
      bm: "Navigasi rejim Cukai Jualan dan Perkhidmatan Malaysia dengan panduan praktikal ini untuk pemilik PKS.",
    },
    category: "legal",
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    date: "2024-10-12",
  },
];

export const communityEvents = [
  {
    id: 1,
    title: {
      en: "Elevating Women Entrepreneurs: The Launch of SHE TECH Asia",
      bm: "Meningkatkan Usahawanita: Pelancaran SHE TECH Asia",
    },
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    date: "2024-11-08",
  },
  {
    id: 2,
    title: {
      en: "Empowering Women At SHE TECH Asia Forum",
      bm: "Memperkasakan Wanita Di Forum SHE TECH Asia",
    },
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80",
    date: "2024-10-25",
  },
  {
    id: 3,
    title: {
      en: "Digital Skills Workshop: From Idea to Online Store",
      bm: "Bengkel Kemahiran Digital: Dari Idea ke Kedai Dalam Talian",
    },
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
    date: "2024-10-15",
  },
];
