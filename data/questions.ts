export interface Option {
  id: string;
  label: { en: string; bm: string };
  points: number;
}

export interface Question {
  id: number;
  text: { en: string; bm: string };
  options: Option[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: {
      en: "What is your current business stage?",
      bm: "Apakah peringkat perniagaan anda sekarang?",
    },
    options: [
      { id: "1a", label: { en: "Still exploring an idea", bm: "Masih meneroka idea" }, points: 1 },
      { id: "1b", label: { en: "Running for less than 1 year", bm: "Beroperasi kurang dari 1 tahun" }, points: 2 },
      { id: "1c", label: { en: "1–3 years in business", bm: "1–3 tahun dalam perniagaan" }, points: 3 },
      { id: "1d", label: { en: "More than 3 years", bm: "Lebih dari 3 tahun" }, points: 4 },
    ],
  },
  {
    id: 2,
    text: {
      en: "Is your business officially registered?",
      bm: "Adakah perniagaan anda telah didaftarkan secara rasmi?",
    },
    options: [
      { id: "2a", label: { en: "No, not yet", bm: "Tidak, belum lagi" }, points: 1 },
      { id: "2b", label: { en: "Planning to register soon", bm: "Merancang untuk mendaftar tidak lama lagi" }, points: 2 },
      { id: "2c", label: { en: "Yes, registered (SSM or equivalent)", bm: "Ya, telah didaftarkan (SSM atau setara)" }, points: 4 },
    ],
  },
  {
    id: 3,
    text: {
      en: "How do you currently sell your products or services?",
      bm: "Bagaimana anda menjual produk atau perkhidmatan anda sekarang?",
    },
    options: [
      { id: "3a", label: { en: "Word of mouth only", bm: "Hanya melalui mulut ke mulut" }, points: 1 },
      { id: "3b", label: { en: "Social media (Facebook, Instagram, etc.)", bm: "Media sosial (Facebook, Instagram, dll.)" }, points: 2 },
      { id: "3c", label: { en: "My own website or e-commerce store", bm: "Laman web sendiri atau kedai e-dagang" }, points: 3 },
      { id: "3d", label: { en: "Multiple channels (online + offline)", bm: "Pelbagai saluran (dalam talian + luar talian)" }, points: 4 },
    ],
  },
  {
    id: 4,
    text: {
      en: "How do you manage your business finances?",
      bm: "Bagaimana anda menguruskan kewangan perniagaan anda?",
    },
    options: [
      { id: "4a", label: { en: "Mix personal and business money with no tracking", bm: "Campur wang peribadi dan perniagaan tanpa rekod" }, points: 1 },
      { id: "4b", label: { en: "Simple notes or spreadsheet", bm: "Nota ringkas atau hamparan" }, points: 2 },
      { id: "4c", label: { en: "Separate business bank account", bm: "Akaun bank perniagaan yang berasingan" }, points: 3 },
      { id: "4d", label: { en: "Accounting software or professional bookkeeping", bm: "Perisian perakaunan atau pembukuan profesional" }, points: 4 },
    ],
  },
  {
    id: 5,
    text: {
      en: "How many people work in your business?",
      bm: "Berapa ramai orang yang bekerja dalam perniagaan anda?",
    },
    options: [
      { id: "5a", label: { en: "Just me (solo)", bm: "Saya sahaja (solo)" }, points: 1 },
      { id: "5b", label: { en: "1–2 helpers or part-timers", bm: "1–2 pembantu atau pekerja sambilan" }, points: 2 },
      { id: "5c", label: { en: "3–10 employees", bm: "3–10 pekerja" }, points: 3 },
      { id: "5d", label: { en: "More than 10 employees", bm: "Lebih dari 10 pekerja" }, points: 4 },
    ],
  },
  {
    id: 6,
    text: {
      en: "Do you have a business plan or growth strategy?",
      bm: "Adakah anda mempunyai pelan perniagaan atau strategi pertumbuhan?",
    },
    options: [
      { id: "6a", label: { en: "No, I run things day to day", bm: "Tidak, saya uruskan hari demi hari" }, points: 1 },
      { id: "6b", label: { en: "I have ideas but nothing written down", bm: "Saya ada idea tapi tiada yang ditulis" }, points: 2 },
      { id: "6c", label: { en: "A basic plan I've written myself", bm: "Pelan asas yang saya tulis sendiri" }, points: 3 },
      { id: "6d", label: { en: "A formal plan with goals and financial projections", bm: "Pelan formal dengan matlamat dan unjuran kewangan" }, points: 4 },
    ],
  },
  {
    id: 7,
    text: {
      en: "What is your average monthly business revenue?",
      bm: "Berapakah purata pendapatan perniagaan bulanan anda?",
    },
    options: [
      { id: "7a", label: { en: "Less than RM 1,000", bm: "Kurang dari RM 1,000" }, points: 1 },
      { id: "7b", label: { en: "RM 1,000 – RM 5,000", bm: "RM 1,000 – RM 5,000" }, points: 2 },
      { id: "7c", label: { en: "RM 5,000 – RM 20,000", bm: "RM 5,000 – RM 20,000" }, points: 3 },
      { id: "7d", label: { en: "More than RM 20,000", bm: "Lebih dari RM 20,000" }, points: 4 },
    ],
  },
  {
    id: 8,
    text: {
      en: "How do you attract new customers?",
      bm: "Bagaimana anda menarik pelanggan baharu?",
    },
    options: [
      { id: "8a", label: { en: "Mostly through friends and family", bm: "Kebanyakannya melalui rakan dan keluarga" }, points: 1 },
      { id: "8b", label: { en: "Organic social media posts", bm: "Siaran media sosial organik" }, points: 2 },
      { id: "8c", label: { en: "Paid advertising (online or offline)", bm: "Pengiklanan berbayar (dalam talian atau luar talian)" }, points: 3 },
      { id: "8d", label: { en: "Multi-channel marketing strategy", bm: "Strategi pemasaran pelbagai saluran" }, points: 4 },
    ],
  },
  {
    id: 9,
    text: {
      en: "Have you attended any business training or mentorship programs?",
      bm: "Pernahkah anda menghadiri program latihan perniagaan atau mentorship?",
    },
    options: [
      { id: "9a", label: { en: "Never", bm: "Tidak pernah" }, points: 1 },
      { id: "9b", label: { en: "Once or twice", bm: "Sekali atau dua kali" }, points: 2 },
      { id: "9c", label: { en: "I attend regularly", bm: "Saya menghadiri secara tetap" }, points: 3 },
      { id: "9d", label: { en: "I attend and also mentor others", bm: "Saya menghadiri dan juga membimbing orang lain" }, points: 4 },
    ],
  },
  {
    id: 10,
    text: {
      en: "What is your biggest challenge right now?",
      bm: "Apakah cabaran terbesar anda sekarang?",
    },
    options: [
      { id: "10a", label: { en: "I don't know where to start", bm: "Saya tidak tahu di mana hendak bermula" }, points: 1 },
      { id: "10b", label: { en: "Getting enough customers", bm: "Mendapatkan pelanggan yang mencukupi" }, points: 2 },
      { id: "10c", label: { en: "Managing growth and operations", bm: "Mengurus pertumbuhan dan operasi" }, points: 3 },
      { id: "10d", label: { en: "Scaling to new markets or products", bm: "Menskalakan ke pasaran atau produk baharu" }, points: 4 },
    ],
  },
];

// ─── Scoring Tiers ────────────────────────────────────────────────────────────

export interface ScoreTier {
  min: number;
  max: number;
  category: { en: string; bm: string };
  label: { en: string; bm: string };
  description: { en: string; bm: string };
  color: string;
  nextSteps: { en: string[]; bm: string[] };
}

export const scoreTiers: ScoreTier[] = [
  {
    min: 0,
    max: 17,
    category: { en: "Starter", bm: "Pemula" },
    label: { en: "Beginning Your Journey", bm: "Memulakan Perjalanan Anda" },
    description: {
      en: "You're at the exciting beginning of your entrepreneurial journey. Strivers' Hub is here to help you build a solid foundation with the right knowledge and community.",
      bm: "Anda berada di permulaan yang mengujakan dalam perjalanan keusahawanan anda. Strivers' Hub di sini untuk membantu anda membina asas yang kukuh dengan ilmu dan komuniti yang tepat.",
    },
    color: "#F59E0B",
    nextSteps: {
      en: [
        "Complete the free Business Basics module",
        "Register your business with SSM",
        "Open a dedicated business bank account",
        "Connect with a Strivers' Hub mentor",
      ],
      bm: [
        "Lengkapkan modul Asas Perniagaan secara percuma",
        "Daftarkan perniagaan anda dengan SSM",
        "Buka akaun bank perniagaan khusus",
        "Berhubung dengan mentor Strivers' Hub",
      ],
    },
  },
  {
    min: 18,
    max: 27,
    category: { en: "Growth", bm: "Pertumbuhan" },
    label: { en: "Building Momentum", bm: "Membina Momentum" },
    description: {
      en: "You have a working foundation and are ready to grow. Focus on formalising your operations, expanding your customer base, and building your digital presence.",
      bm: "Anda mempunyai asas yang kukuh dan bersedia untuk berkembang. Fokus pada memformalkan operasi anda, mengembangkan pangkalan pelanggan, dan membina kehadiran digital anda.",
    },
    color: "#3B82F6",
    nextSteps: {
      en: [
        "Attend our Digital Marketing Masterclass",
        "Set up a simple accounting system",
        "Join our Women Entrepreneurs Network",
        "Apply for SME business grants",
      ],
      bm: [
        "Hadiri Masterclass Pemasaran Digital kami",
        "Sediakan sistem perakaunan yang mudah",
        "Sertai Rangkaian Usahawanita kami",
        "Mohon geran perniagaan PKS",
      ],
    },
  },
  {
    min: 28,
    max: 35,
    category: { en: "Established", bm: "Mapan" },
    label: { en: "Scaling with Confidence", bm: "Menskalakan dengan Yakin" },
    description: {
      en: "Your business is well-established with strong processes in place. Now is the time to scale strategically, explore new markets, and leverage partnerships.",
      bm: "Perniagaan anda sudah mantap dengan proses yang kukuh. Inilah masanya untuk menskalakan secara strategik, meneroka pasaran baharu, dan memanfaatkan perkongsian.",
    },
    color: "#10B981",
    nextSteps: {
      en: [
        "Explore export and regional market opportunities",
        "Consider bringing on a business partner or investor",
        "Automate operations with digital tools",
        "Mentor other entrepreneurs in the community",
      ],
      bm: [
        "Terokai peluang eksport dan pasaran serantau",
        "Pertimbangkan untuk mendapatkan rakan kongsi atau pelabur",
        "Automatikkan operasi dengan alat digital",
        "Bimbing usahawan lain dalam komuniti",
      ],
    },
  },
  {
    min: 36,
    max: 40,
    category: { en: "Advanced", bm: "Maju" },
    label: { en: "Leading the Way", bm: "Memimpin Ke Hadapan" },
    description: {
      en: "You're a seasoned entrepreneur with a thriving business. Your experience is invaluable — consider contributing to the ecosystem while exploring new growth frontiers.",
      bm: "Anda adalah usahawan berpengalaman dengan perniagaan yang berkembang maju. Pengalaman anda sangat berharga — pertimbangkan untuk menyumbang kepada ekosistem sambil meneroka sempadan pertumbuhan baharu.",
    },
    color: "#D81B60",
    nextSteps: {
      en: [
        "Apply for the Strivers' Hub Leadership Program",
        "Become a featured mentor in our community",
        "Explore venture capital and institutional funding",
        "Share your story to inspire the next generation",
      ],
      bm: [
        "Mohon Program Kepimpinan Strivers' Hub",
        "Jadilah mentor terkemuka dalam komuniti kami",
        "Terokai modal teroka dan pembiayaan institusi",
        "Kongsi cerita anda untuk mengilhamkan generasi seterusnya",
      ],
    },
  },
];

export function getScoreTier(score: number): ScoreTier {
  return scoreTiers.find((t) => score >= t.min && score <= t.max) ?? scoreTiers[0];
}
