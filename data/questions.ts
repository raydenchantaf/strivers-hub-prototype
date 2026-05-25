// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionType = "single" | "multi" | "likert" | "dropdown" | "text" | "multi-text";

export interface Option {
  id: string;
  label: { en: string; bm: string };
  points: number;
  nextId?: string;
  hasOther?: boolean;
}

export interface MultiTextField {
  id: string;
  label: { en: string; bm: string };
  placeholder?: { en: string; bm: string };
  inputType?: "text" | "email" | "tel" | "number";
  required?: boolean;
}

export interface Question {
  id: string;
  section: string;
  type: QuestionType;
  maxSelections?: number;
  exactSelections?: boolean;
  likertLabels?: { low: { en: string; bm: string }; high: { en: string; bm: string } };
  text: { en: string; bm: string };
  options: Option[];
  nextId: string;
  placeholder?: { en: string; bm: string };
  inputType?: "text" | "number";
  fields?: MultiTextField[];
}

export const questions: Question[] = [
  // Section 1: Business Status
  {
    id: "q1", section: "Business Status", type: "single",
    text: { en: "Do you presently own a business?", bm: "Adakah anda memiliki perniagaan pada masa kini?" },
    options: [
      { id: "q1_yes", label: { en: "Yes", bm: "Ya" }, points: 0, nextId: "q2a" },
      { id: "q1_no",  label: { en: "No, but I aspire to be an entrepreneur", bm: "Tidak, tetapi saya berhasrat untuk menjadi seorang usahawan" }, points: 0, nextId: "q2b" },
    ],
    nextId: "q2a",
  },
  // Section 2: Business Info — Yes path
  {
    id: "q2a", section: "Business Info", type: "multi",
    text: { en: "Kindly specify the type or industry of your business (you may select multiple responses)", bm: "Jika ya, sila nyatakan jenis atau industri perniagaan anda: (boleh pilih lebih daripada satu)" },
    options: [
      { id: "q2a_1",  label: { en: "Hospitality services",             bm: "Perkhidmatan hospitaliti/pelancongan" }, points: 0 },
      { id: "q2a_2",  label: { en: "Arts, entertainment & recreation", bm: "Seni, hiburan & rekreasi" }, points: 0 },
      { id: "q2a_3",  label: { en: "Beauty & cosmetics",               bm: "Kecantikan & kosmetik" }, points: 0 },
      { id: "q2a_4",  label: { en: "Creative & media",                 bm: "Kreatif & media" }, points: 0 },
      { id: "q2a_5",  label: { en: "Education",                        bm: "Pendidikan" }, points: 0 },
      { id: "q2a_6",  label: { en: "Fashion & jewellery",              bm: "Fesyen & barangan kemas" }, points: 0 },
      { id: "q2a_7",  label: { en: "Financial & insurance activities", bm: "Perkhidmatan kewangan & insurans" }, points: 0 },
      { id: "q2a_8",  label: { en: "Food & drink",                     bm: "Makanan & minuman" }, points: 0 },
      { id: "q2a_9",  label: { en: "Health, fitness & wellness",       bm: "Penjagaan kesihatan, kecergasan & kesejahteraan" }, points: 0 },
      { id: "q2a_10", label: { en: "Wholesale & international trade",  bm: "Borong & perdagangan antarabangsa" }, points: 0 },
      { id: "q2a_11", label: { en: "Other (please specify)",           bm: "Lain-lain (sila nyatakan)" }, points: 0, hasOther: true },
    ],
    nextId: "q2a1",
  },
  {
    id: "q2a1", section: "Business Info", type: "text", inputType: "number",
    text: { en: "How many years has your business been in operation?", bm: "Berapa lamakah perniagaan anda sudah beroperasi?" },
    options: [], nextId: "q2a2",
    placeholder: { en: "Enter number of years (e.g., 3)", bm: "Masukkan bilangan tahun (cth., 3)" },
  },
  {
    id: "q2a2", section: "Business Info", type: "single",
    text: { en: "Please indicate the number of employees that you have for your business (including part-time, full-time staffs, if you have multiple businesses then choose the main one)", bm: "Nyatakan bilangan pekerja untuk perniagaan anda (termasuk pekerja separa masa, pekerja sepenuh masa. Jika anda memiliki beberapa perniagaan maka pilih yang utama.)" },
    options: [
      { id: "q2a2_1", label: { en: "< 5",   bm: "< 5" },   points: 0 },
      { id: "q2a2_2", label: { en: "5-10",  bm: "5-10" },  points: 0 },
      { id: "q2a2_3", label: { en: "16-30", bm: "16-30" }, points: 0 },
      { id: "q2a2_4", label: { en: "31-50", bm: "31-50" }, points: 0 },
      { id: "q2a2_5", label: { en: "51-75", bm: "51-75" }, points: 0 },
      { id: "q2a2_6", label: { en: "75+",   bm: "75+" },   points: 0 },
    ],
    nextId: "q2a3",
  },
  {
    id: "q2a3", section: "Business Info", type: "dropdown",
    text: { en: "What is the approximate monthly revenue of your business?", bm: "Apakah anggaran pendapatan bulanan perniagaan anda?" },
    options: [
      { id: "q2a3_1", label: { en: "Below RM 1,500",        bm: "Di bawah RM 1,500" },      points: 0 },
      { id: "q2a3_2", label: { en: "RM 1,501 - RM 2,500",   bm: "RM 1,501 - RM 2,500" },    points: 0 },
      { id: "q2a3_3", label: { en: "RM 2,501 - RM 5,000",   bm: "RM 2,501 - RM 5,000" },    points: 0 },
      { id: "q2a3_4", label: { en: "RM 5,001 - RM 7,500",   bm: "RM 5,001 - RM 7,500" },    points: 0 },
      { id: "q2a3_5", label: { en: "RM 7,501 - RM 10,000",  bm: "RM 7,501 - RM 10,000" },   points: 0 },
      { id: "q2a3_6", label: { en: "RM 10,001 - RM 12,500", bm: "RM 10,001 - RM 12,500" },  points: 0 },
      { id: "q2a3_7", label: { en: "Above RM 12,500",       bm: "Melebihi RM 12,500" },      points: 0 },
      { id: "q2a3_8", label: { en: "Prefer not to say",     bm: "Tidak ingin menjawab" },    points: 0 },
    ],
    nextId: "q3a",
  },
  // Section 2: Industry Interest — No path
  {
    id: "q2b", section: "Business Info", type: "multi",
    text: { en: "Kindly specify the type of industry of your interest (you may select multiple responses)", bm: "Jika tidak, sila nyatakan jenis industri yang anda minati: (boleh pilih lebih daripada satu)" },
    options: [
      { id: "q2b_1",  label: { en: "Hospitality services",             bm: "Perkhidmatan hospitaliti/pelancongan" }, points: 0 },
      { id: "q2b_2",  label: { en: "Arts, entertainment & recreation", bm: "Seni, hiburan & rekreasi" }, points: 0 },
      { id: "q2b_3",  label: { en: "Beauty & cosmetics",               bm: "Kecantikan & kosmetik" }, points: 0 },
      { id: "q2b_4",  label: { en: "Creative & media",                 bm: "Kreatif & media" }, points: 0 },
      { id: "q2b_5",  label: { en: "Education",                        bm: "Pendidikan" }, points: 0 },
      { id: "q2b_6",  label: { en: "Fashion & jewellery",              bm: "Fesyen & barangan kemas" }, points: 0 },
      { id: "q2b_7",  label: { en: "Financial & insurance activities", bm: "Perkhidmatan kewangan & insurans" }, points: 0 },
      { id: "q2b_8",  label: { en: "Food & drink",                     bm: "Makanan & minuman" }, points: 0 },
      { id: "q2b_9",  label: { en: "Health, fitness & wellness",       bm: "Penjagaan kesihatan, kecergasan & kesejahteraan" }, points: 0 },
      { id: "q2b_10", label: { en: "Wholesale & international trade",  bm: "Borong & perdagangan antarabangsa" }, points: 0 },
      { id: "q2b_11", label: { en: "Other (please specify)",           bm: "Lain-lain (sila nyatakan)" }, points: 0, hasOther: true },
    ],
    nextId: "q3a",
  },
  // Section 3: Categorisation
  {
    id: "q3a", section: "Categorisation", type: "single",
    text: { en: "Where are you in your entrepreneurial journey?", bm: "Di mana anda berada dalam perjalanan keusahawanan anda?" },
    options: [
      { id: "q3a_1", label: { en: "I'm in the early stages, focusing on conceptualizing my business, working on ideation and opportunity, or setting up my business platform.", bm: "Saya berada dalam peringkat awal, sedang mengusahakan konsep dan idea, mencari peluang, atau menyediakan platform perniagaan." }, points: 1 },
      { id: "q3a_2", label: { en: "I have launched my business. I'm focusing on managing daily operations, resources, and addressing challenges for business stability.", bm: "Perniagaan saya sudah dilancarkan, dan saya memberi tumpuan kepada operasi harian, sumber, dan menangani cabaran untuk kestabilan perniagaan." }, points: 2 },
      { id: "q3a_3", label: { en: "I'm actively planning and taking steps for business growth and expansion, focusing on increasing market share or entering new market.", bm: "Saya secara aktif merancang dan mengambil langkah untuk perkembangan perniagaan yang mampan, memfokuskan pada peningkatan bahagian pasaran atau memasuki pasaran baharu." }, points: 3 },
    ],
    nextId: "q3b",
  },
  {
    id: "q3b", section: "Categorisation", type: "multi",
    maxSelections: 4, exactSelections: true,
    text: { en: "What type of training resources are you currently looking for in your entrepreneurial journey? (Select 4 options)", bm: "Apakah jenis sumber latihan yang sedang anda cari/minat dalam perjalanan keusahawanan anda sekarang? (Pilih 4 pilihan)" },
    options: [
      { id: "q3b_1a", label: { en: "Business registration/licensing",                     bm: "Pendaftaran perniagaan/perlesenan" }, points: 1 },
      { id: "q3b_1b", label: { en: "Online presence setup",                               bm: "Penubuhan kewujudan perniagaan atas talian" }, points: 1 },
      { id: "q3b_1c", label: { en: "Basic market research techniques",                    bm: "Teknik asas penyelidikan pasaran" }, points: 1 },
      { id: "q3b_1d", label: { en: "Financial Planning Basics",                           bm: "Perancangan kewangan asas" }, points: 1 },
      { id: "q3b_2a", label: { en: "Day-to-day operation management",                     bm: "Pengurusan operasi harian" }, points: 2 },
      { id: "q3b_2b", label: { en: "Human resource management",                           bm: "Pengurusan sumber manusia" }, points: 2 },
      { id: "q3b_2c", label: { en: "Cost control and budgeting",                          bm: "Kawalan kos dan perancangan belanjawan" }, points: 2 },
      { id: "q3b_2d", label: { en: "Alternative investments",                             bm: "Pelaburan alternatif" }, points: 2 },
      { id: "q3b_3a", label: { en: "Networking opportunities and strategic partnerships", bm: "Peluang jaringan dan perkongsian strategik" }, points: 3 },
      { id: "q3b_3b", label: { en: "Business expansion strategies",                       bm: "Strategi pengembangan perniagaan" }, points: 3 },
      { id: "q3b_3c", label: { en: "Advanced digital marketing skills",                   bm: "Kemahiran pemasaran digital yang canggih" }, points: 3 },
      { id: "q3b_3d", label: { en: "Industry updates and events",                         bm: "Berita dan acara-acara terkini industri" }, points: 3 },
    ],
    nextId: "q3c",
  },
  {
    id: "q3c", section: "Categorisation", type: "single",
    text: { en: "Do you promote or market your products/services online?", bm: "Adakah anda mengiklankan atau memasarkan produk / perkhidmatan anda dalam talian." },
    options: [
      { id: "q3c_1", label: { en: "Not at all",                 bm: "Tidak langsung" },           points: 1 },
      { id: "q3c_2", label: { en: "Yes, on a single platform",  bm: "Ya, pada satu platform sahaja" }, points: 2 },
      { id: "q3c_3", label: { en: "Yes, on multiple platforms", bm: "Ya, pada pelbagai platform" }, points: 3 },
    ],
    nextId: "q4a",
  },
  // Section 4: Baseline
  {
    id: "q4a", section: "Baseline", type: "likert",
    likertLabels: { low: { en: "Low", bm: "Rendah" }, high: { en: "High", bm: "Tinggi" } },
    text: { en: "How would you rate your level of digital literacy?", bm: "Bagaimana anda menilai tahap literasi digital anda?" },
    options: [], nextId: "q4b",
  },
  {
    id: "q4b", section: "Baseline", type: "likert",
    likertLabels: { low: { en: "Low", bm: "Rendah" }, high: { en: "High", bm: "Tinggi" } },
    text: { en: "How would you rate your level of financial literacy?", bm: "Bagaimana anda menilai tahap literasi kewangan anda?" },
    options: [], nextId: "q4c",
  },
  {
    id: "q4c", section: "Baseline", type: "likert",
    likertLabels: { low: { en: "Strongly Disagree", bm: "Sangat Tidak Setuju" }, high: { en: "Strongly Agree", bm: "Sangat Setuju" } },
    text: { en: "I am confident in using digital tools and technologies for my business.", bm: "Saya yakin menggunakan alat dan teknologi digital untuk perniagaan saya." },
    options: [], nextId: "q4d",
  },
  {
    id: "q4d", section: "Baseline", type: "likert",
    likertLabels: { low: { en: "Strongly Disagree", bm: "Sangat Tidak Setuju" }, high: { en: "Strongly Agree", bm: "Sangat Setuju" } },
    text: { en: "I frequently leverage digital platforms for networking and seeking support within the entrepreneurial community.", bm: "Saya kerap menggunakan platform digital untuk mendapatkan rangkaian dan sokongan dalam komuniti keusahawanan." },
    options: [], nextId: "q4e",
  },
  {
    id: "q4e", section: "Baseline", type: "likert",
    likertLabels: { low: { en: "Strongly Disagree", bm: "Sangat Tidak Setuju" }, high: { en: "Strongly Agree", bm: "Sangat Setuju" } },
    text: { en: "I have a reliable support system (e.g., mentors, family, friends, business networks) in place to assist me as an entrepreneur.", bm: "Saya mempunyai sistem sokongan yang boleh dipercayai (contohnya, mentor, keluarga, rakan-rakan, rangkaian perniagaan) untuk membantu saya sebagai usahawan." },
    options: [], nextId: "q4f",
  },
  {
    id: "q4f", section: "Baseline", type: "likert",
    likertLabels: { low: { en: "Strongly Disagree", bm: "Sangat Tidak Setuju" }, high: { en: "Strongly Agree", bm: "Sangat Setuju" } },
    text: { en: "I am aware of government support programs and financial resources available.", bm: "Saya sedar tentang program sokongan kerajaan dan sumber kewangan yang tersedia." },
    options: [], nextId: "q4g",
  },
  {
    id: "q4g", section: "Baseline", type: "likert",
    likertLabels: { low: { en: "Strongly Disagree", bm: "Sangat Tidak Setuju" }, high: { en: "Strongly Agree", bm: "Sangat Setuju" } },
    text: { en: "Securing financial support (capital, loans, or other modalities) for my startup has been challenging for me.", bm: "Mendapatkan sokongan kewangan (modal, pinjaman, atau modaliti lain) untuk permulaan perniagaan saya adalah mencabar." },
    options: [], nextId: "q4h",
  },
  {
    id: "q4h", section: "Baseline", type: "multi", maxSelections: 3,
    text: { en: "What are your main concerns when it comes to obtaining business loans? (Select up to 3 options)", bm: "Apakah kebimbangan utama anda dalam memperoleh pinjaman perniagaan? (Pilih sehingga 3 pilihan)" },
    options: [
      { id: "q4h_1", label: { en: "I am afraid to be in-debt",                 bm: "Saya takut/bimbang untuk berhutang" }, points: 0 },
      { id: "q4h_2", label: { en: "I am not interested",                        bm: "Saya tidak berminat" }, points: 0 },
      { id: "q4h_3", label: { en: "I do not have enough knowledge",             bm: "Saya tidak mempunyai pengetahuan yang mencukupi" }, points: 0 },
      { id: "q4h_4", label: { en: "The procedure is complex",                   bm: "Prosedur yang rumit" }, points: 0 },
      { id: "q4h_5", label: { en: "Worried about meeting loan repayment terms", bm: "Bimbang tentang memenuhi syarat pembayaran balik pinjaman" }, points: 0 },
      { id: "q4h_6", label: { en: "Other (please specify)",                     bm: "Lain-lain (sila nyatakan)" }, points: 0, hasOther: true },
    ],
    nextId: "q4i",
  },
  {
    id: "q4i", section: "Baseline", type: "single",
    text: { en: "Have you observed or experienced any instances of prejudice or bias against women entrepreneurs in your work experiences?", bm: "Adakah anda pernah memerhati atau mengalami sebarang kejadian prasangka atau bias terhadap usahawan wanita dalam pengalaman kerja anda?" },
    options: [
      { id: "q4i_1", label: { en: "Always",    bm: "Sentiasa" },      points: 0 },
      { id: "q4i_2", label: { en: "Sometimes", bm: "Kadang-kadang" }, points: 0 },
      { id: "q4i_3", label: { en: "Seldom",    bm: "Jarang" },        points: 0 },
      { id: "q4i_4", label: { en: "Never",     bm: "Tidak pernah" },  points: 0 },
    ],
    nextId: "q5a",
  },
  // Section 5: Demographic
  {
    id: "q5a", section: "Demographic", type: "single",
    text: { en: "What is your gender identity?", bm: "Apakah identiti gender anda?" },
    options: [
      { id: "q5a_1", label: { en: "Female", bm: "Perempuan" }, points: 0 },
      { id: "q5a_2", label: { en: "Male",   bm: "Lelaki" },    points: 0 },
    ],
    nextId: "q5b",
  },
  {
    id: "q5b", section: "Demographic", type: "single",
    text: { en: "Which age group do you fall into?", bm: "Berapakah umur anda?" },
    options: [
      { id: "q5b_1", label: { en: "<21",   bm: "<21" },   points: 0 },
      { id: "q5b_2", label: { en: "21-30", bm: "21-30" }, points: 0 },
      { id: "q5b_3", label: { en: "31-40", bm: "31-40" }, points: 0 },
      { id: "q5b_4", label: { en: "41-50", bm: "41-50" }, points: 0 },
      { id: "q5b_5", label: { en: "51-60", bm: "51-60" }, points: 0 },
      { id: "q5b_6", label: { en: "60+",   bm: "60+" },   points: 0 },
    ],
    nextId: "q5c",
  },
  {
    id: "q5c", section: "Demographic", type: "dropdown",
    text: { en: "In which state do you currently reside?", bm: "Di negeri mana anda tinggal sekarang?" },
    options: [
      { id: "johor",      label: { en: "Johor",           bm: "Johor" },           points: 0 },
      { id: "kedah",      label: { en: "Kedah",           bm: "Kedah" },           points: 0 },
      { id: "kelantan",   label: { en: "Kelantan",        bm: "Kelantan" },        points: 0 },
      { id: "kl",         label: { en: "Kuala Lumpur",    bm: "Kuala Lumpur" },    points: 0 },
      { id: "labuan",     label: { en: "Labuan",          bm: "Labuan" },          points: 0 },
      { id: "melaka",     label: { en: "Melaka",          bm: "Melaka" },          points: 0 },
      { id: "ns",         label: { en: "Negeri Sembilan", bm: "Negeri Sembilan" }, points: 0 },
      { id: "pahang",     label: { en: "Pahang",          bm: "Pahang" },          points: 0 },
      { id: "penang",     label: { en: "Penang",          bm: "Pulau Pinang" },    points: 0 },
      { id: "perak",      label: { en: "Perak",           bm: "Perak" },           points: 0 },
      { id: "perlis",     label: { en: "Perlis",          bm: "Perlis" },          points: 0 },
      { id: "putrajaya",  label: { en: "Putrajaya",       bm: "Putrajaya" },       points: 0 },
      { id: "sabah",      label: { en: "Sabah",           bm: "Sabah" },           points: 0 },
      { id: "sarawak",    label: { en: "Sarawak",         bm: "Sarawak" },         points: 0 },
      { id: "selangor",   label: { en: "Selangor",        bm: "Selangor" },        points: 0 },
      { id: "terengganu", label: { en: "Terengganu",      bm: "Terengganu" },      points: 0 },
    ],
    nextId: "q5d",
  },
  {
    id: "q5d", section: "Demographic", type: "single",
    text: { en: "How would you describe your current residence area?", bm: "Di manakah lokasi tempat tinggal anda?" },
    options: [
      { id: "q5d_1", label: { en: "Urban",      bm: "Bandaraya" },    points: 0 },
      { id: "q5d_2", label: { en: "Semi-urban", bm: "Bandar kecil" }, points: 0 },
      { id: "q5d_3", label: { en: "Rural",      bm: "Luar bandar" },  points: 0 },
    ],
    nextId: "q5e",
  },
  {
    id: "q5e", section: "Demographic", type: "single",
    text: { en: "What is your ethnic background?", bm: "Apakah latar belakang etnik anda?" },
    options: [
      { id: "q5e_1", label: { en: "Malay",   bm: "Melayu" }, points: 0 },
      { id: "q5e_2", label: { en: "Chinese", bm: "Cina" },   points: 0 },
      { id: "q5e_3", label: { en: "Indian",  bm: "India" },  points: 0 },
      { id: "q5e_4", label: { en: "Other bumiputera (Bajau, Bidayuh, Dusun, Kadazan, Melanau, etc)", bm: "Bumiputera lain (Bajau, Bidayuh, Dusun, Kadazan, Melanau, dll)" }, points: 0 },
      { id: "q5e_5", label: { en: "Other (please specify)", bm: "Lain-lain (sila nyatakan)" }, points: 0, hasOther: true },
    ],
    nextId: "q5f",
  },
  {
    id: "q5f", section: "Demographic", type: "single",
    text: { en: "What is the highest level of education you have?", bm: "Apakah tahap pendidikan tertinggi anda?" },
    options: [
      { id: "q5f_1", label: { en: "No Formal Education",          bm: "Tiada pendidikan formal" },      points: 0 },
      { id: "q5f_2", label: { en: "Primary School",               bm: "Sekolah rendah" },               points: 0 },
      { id: "q5f_3", label: { en: "Secondary School",             bm: "Sekolah menengah" },             points: 0 },
      { id: "q5f_4", label: { en: "University/college and above", bm: "Universiti/kolej dan ke atas" }, points: 0 },
      { id: "q5f_5", label: { en: "Other (please specify)",       bm: "Lain-lain (sila nyatakan)" },    points: 0, hasOther: true },
    ],
    nextId: "q5g",
  },
  {
    id: "q5g", section: "Demographic", type: "multi-text",
    text: { en: "Please provide your contact details", bm: "Sila berikan maklumat hubungan anda" },
    options: [], nextId: "q5k",
    fields: [
      { id: "q5g", label: { en: "First name",      bm: "Nama pertama"   }, placeholder: { en: "Enter your first name",       bm: "Masukkan nama pertama anda"       }, required: true  },
      { id: "q5h", label: { en: "Last name",       bm: "Nama keluarga"  }, placeholder: { en: "Enter your last name",        bm: "Masukkan nama keluarga anda"      }, required: true  },
      { id: "q5i", label: { en: "Email",           bm: "E-mel"          }, placeholder: { en: "Enter your email address",    bm: "Masukkan alamat e-mel anda"       }, inputType: "email", required: true  },
      { id: "q5j", label: { en: "Contact number",  bm: "Nombor telefon" }, placeholder: { en: "Enter your contact number",   bm: "Masukkan nombor telefon anda"     }, inputType: "tel",   required: false },
    ],
  },
  {
    id: "q5k", section: "Demographic", type: "single",
    text: { en: "How did you hear about Strivers' Hub?", bm: "Bagaimana anda mendapat tahu tentang Strivers' Hub?" },
    options: [
      { id: "q5k_1", label: { en: "Universiti Malaysia Kelantan/GERIK",                       bm: "Universiti Malaysia Kelantan/GERIK" }, points: 0 },
      { id: "q5k_2", label: { en: "National Council of Women's Organizations Malaysia (NCWO)", bm: "National Council of Women's Organizations Malaysia (NCWO)" }, points: 0 },
      { id: "q5k_3", label: { en: "KANITA/Universiti Sains Malaysia",                         bm: "KANITA/Universiti Sains Malaysia" }, points: 0 },
      { id: "q5k_4", label: { en: "Penang Women Development Corporation (PWDC)",               bm: "Penang Women Development Corporation (PWDC)" }, points: 0 },
      { id: "q5k_5", label: { en: "WomenBizSense", bm: "WomenBizSense" }, points: 0 },
      { id: "q5k_6", label: { en: "FutureLab",     bm: "FutureLab" },     points: 0 },
      { id: "q5k_7", label: { en: "Facebook",      bm: "Facebook" },      points: 0 },
      { id: "q5k_8", label: { en: "WhatsApp",      bm: "WhatsApp" },      points: 0 },
      { id: "q5k_9", label: { en: "Other (please specify)", bm: "Lain-lain (sila nyatakan)" }, points: 0, hasOther: true },
    ],
    nextId: "[END]",
  },
];

export const questionsById: Record<string, Question> = Object.fromEntries(questions.map((q) => [q.id, q]));

export function getCategorizationScore(answers: Record<string, string | string[]>): number {
  let score = 0;
  for (const qId of ["q3a", "q3b", "q3c"]) {
    const q = questionsById[qId];
    const ans = answers[qId];
    if (!ans) continue;
    if (Array.isArray(ans)) { for (const id of ans) score += q.options.find((o) => o.id === id)?.points ?? 0; }
    else { score += q.options.find((o) => o.id === ans)?.points ?? 0; }
  }
  return score;
}

export function getMaxScore(): number { return 18; }

export interface ScoreTier {
  min: number; max: number;
  category: { en: string; bm: string };
  label: { en: string; bm: string };
  description: { en: string; bm: string };
  color: string;
  nextSteps: { en: string[]; bm: string[] };
}

export const scoreTiers: ScoreTier[] = [
  {
    min: 6, max: 10,
    category: { en: "Aspiring", bm: "Aspiring" },
    label: { en: "You are an Aspiring entrepreneur!", bm: "Anda seorang usahawan Aspiring!" },
    description: {
      en: "Hey there, aspiring entrepreneur! It's awesome to see your motivation as an entrepreneur. You've identified one or more industries/services/products to venture into, which is a great starting point. Beyond passion and ideas, success in entrepreneurship requires sustainable strategies. This is why many small businesses don't make it past the first few years of being launched due to burnout as the passion runs out.\n\nJust like building a house, you need a solid foundation and careful planning to ensure your business survives through any weather in the long run. Gain skills in financial management, marketing and sales, operations and human resources, and improve your online presence. We've got your back with the right training and resources to help you strive and thrive.",
      bm: "Hai bakal usahawan! Motivasi anda sebagai seorang usahawan amat mengagumkan. Anda telah mengenal pasti sekurang-kurang satu atau lebih industri/perkhidmatan/produk untuk diterokai. Ini merupakan titik permulaan yang hebat. Selain daripada semangat dan idea, kejayaan dalam keusahawanan memerlukan strategi yang mampan.\n\nSeperti dalam pembinaan rumah, anda perlu memastikan bahawa perniagaan anda mempunyai asas yang kukuh dan perancangan yang teliti. Justeru, ia adalah sangat penting bagi anda untuk mempelajari kemahiran dalam pengurusan kewangan, pemasaran dan jualan, operasi dan sumber manusia, serta tingkatkan kehadiran perniagaan anda dalam talian.",
    },
    color: "#F59E0B",
    nextSteps: {
      en: ["Complete free training modules on business basics and registration", "Build your online presence on social media platforms", "Learn financial management fundamentals for entrepreneurs", "Connect with a Strivers' Hub mentor for personalised guidance"],
      bm: ["Lengkapkan modul latihan percuma tentang asas perniagaan dan pendaftaran", "Bina kehadiran dalam talian anda di platform media sosial", "Pelajari asas pengurusan kewangan untuk usahawan", "Hubungi mentor Strivers' Hub untuk panduan peribadi"],
    },
  },
  {
    min: 11, max: 15,
    category: { en: "Managing", bm: "Managing" },
    label: { en: "You are a Managing entrepreneur!", bm: "Anda seorang usahawan Managing!" },
    description: {
      en: "You're on the right path! You've taken that first step and brought your business idea to life.\n\nRight now, it's all about setting up effective structures and fine-tuning operations to ensure you're running like a well-oiled machine. To future-proof your business, leveling up your knowledge is a must. You've built your house, but let's make the foundations stronger with renovations and improvements. Equip yourself with knowledge in cybersecurity, digital payments, customer engagement, and marketing to propel yourself to the next level.",
      bm: "Anda berada di jalan yang betul! Anda telah mengambil langkah pertama untuk merealisasikan idea perniagaan anda.\n\nSekarang, tumpuan anda adalah untuk membentuk struktur yang berkesan dan meningkatkan operasi bagi memastikan perniagaan terus berjalan dengan lancar. Anda telah membina asas perniagaan anda, namun mari kita teguhkan lagi asas tersebut dengan penyesuaian dan penambahbaikan. Lengkapkan diri anda dengan pengetahuan dalam keselamatan siber, pembayaran digital, penglibatan pelanggan, dan pemasaran.",
    },
    color: "#3B82F6",
    nextSteps: {
      en: ["Attend digital marketing and customer engagement workshops", "Set up a proper financial management and accounting system", "Explore government grants and SME funding programs", "Join the Strivers' Hub entrepreneur community for peer support"],
      bm: ["Hadiri bengkel pemasaran digital dan penglibatan pelanggan", "Sediakan sistem pengurusan kewangan dan perakaunan yang betul", "Terokai geran kerajaan dan program pembiayaan PKS", "Sertai komuniti usahawan Strivers' Hub untuk sokongan rakan sebaya"],
    },
  },
  {
    min: 16, max: 18,
    category: { en: "Growing", bm: "Growing" },
    label: { en: "You are a Growing entrepreneur!", bm: "Anda seorang usahawan Growing!" },
    description: {
      en: "You are a fighter! Your grit and determination have kept your business afloat through thick and thin. You've got loyal customers and clients who trust you. You have built a beautiful home with a strong foundation and structure. But let's take it a step further and see how we can decorate your house even more.\n\nWe welcome you to refresh your skills and network with like-minded entrepreneurs. Don't be afraid to push the limits and embrace digital solutions to take your business to new heights. Scale up and expand!",
      bm: "Anda adalah seorang pejuang! Ketegasan dan keazaman anda telah memastikan perniagaan anda terus bergerak maju walaupun dalam situasi yang mencabar. Anda mempunyai pelanggan dan klien yang setia serta mempercayai anda. Anda telah membina sebuah rumah yang indah dengan asas yang kukuh.\n\nKami mengalu-alukan anda untuk menyegarkan kemahiran anda dan menjalin hubungan dengan usahawan yang bersefikiran. Jangan rasa ragu untuk mencabar diri dan menerima penyelesaian digital untuk membawa perniagaan anda ke peringkat yang lebih tinggi.",
    },
    color: "#10B981",
    nextSteps: {
      en: ["Attend advanced networking events and strategic partnership forums", "Explore digital tools and automation to scale your operations", "Consider mentoring aspiring entrepreneurs in the community", "Explore new market expansion and export opportunities"],
      bm: ["Hadiri acara rangkaian lanjutan dan forum perkongsian strategik", "Terokai alat digital dan automasi untuk meningkatkan operasi anda", "Pertimbangkan untuk membimbing usahawan baharu dalam komuniti", "Terokai pengembangan pasaran baharu dan peluang eksport"],
    },
  },
];

export function getScoreTier(score: number): ScoreTier {
  return scoreTiers.find((t) => score >= t.min && score <= t.max) ?? scoreTiers[0];
}
