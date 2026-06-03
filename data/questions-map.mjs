/**
 * Flat ordered map of every answer key → question/field label (en + bm).
 * Used by scripts/export.mjs to resolve column headers without needing TypeScript.
 * Mirrors the structure of data/questions.ts — keep in sync if questions change.
 */

export const questionOrder = [
  "q1", "q2a", "q2a1", "q2a2", "q2a3",
  "q2b",
  "q3a", "q3b", "q3c",
  "q4a", "q4b", "q4c", "q4d", "q4e", "q4f", "q4g", "q4h", "q4i",
  "q6a", "q6b", "q6c", "q6d", "q6e", "q6f", "q6g",
  "q5a", "q5b", "q5c", "q5d", "q5e", "q5f",
  "q5g", "q5h", "q5i", "q5j",
  "q5k",
];

export const questionLabels = {
  q1:    { en: "Do you presently own a business?",                                                              bm: "Adakah anda memiliki perniagaan pada masa kini?" },
  q2a:   { en: "Type/industry of your business (multiple allowed)",                                            bm: "Jenis/industri perniagaan anda (boleh pilih lebih daripada satu)" },
  q2a1:  { en: "How many years has your business been in operation?",                                          bm: "Berapa lamakah perniagaan anda sudah beroperasi?" },
  q2a2:  { en: "Number of employees",                                                                          bm: "Bilangan pekerja" },
  q2a3:  { en: "Approximate monthly revenue",                                                                  bm: "Anggaran pendapatan bulanan" },
  q2b:   { en: "Type of industry of interest (multiple allowed)",                                              bm: "Jenis industri yang diminati (boleh pilih lebih daripada satu)" },
  q3a:   { en: "Where are you in your entrepreneurial journey?",                                               bm: "Di mana anda berada dalam perjalanan keusahawanan anda?" },
  q3b:   { en: "Training resources you are looking for (select 4)",                                            bm: "Sumber latihan yang anda cari (pilih 4)" },
  q3c:   { en: "Do you promote/market your products/services online?",                                        bm: "Adakah anda mengiklankan produk/perkhidmatan anda dalam talian?" },
  q4a:   { en: "Digital literacy level (1–5)",                                                                 bm: "Tahap literasi digital (1–5)" },
  q4b:   { en: "Financial literacy level (1–5)",                                                               bm: "Tahap literasi kewangan (1–5)" },
  q4c:   { en: "Confident using digital tools for business (1=Strongly Disagree, 5=Strongly Agree)",          bm: "Yakin menggunakan alat digital untuk perniagaan (1=Sangat Tidak Setuju, 5=Sangat Setuju)" },
  q4d:   { en: "Frequently use digital platforms for networking (1=Strongly Disagree, 5=Strongly Agree)",     bm: "Kerap guna platform digital untuk rangkaian (1=Sangat Tidak Setuju, 5=Sangat Setuju)" },
  q4e:   { en: "Reliable support system in place (1=Strongly Disagree, 5=Strongly Agree)",                    bm: "Sistem sokongan yang boleh dipercayai (1=Sangat Tidak Setuju, 5=Sangat Setuju)" },
  q4f:   { en: "Aware of government support programs (1=Strongly Disagree, 5=Strongly Agree)",                bm: "Sedar tentang program sokongan kerajaan (1=Sangat Tidak Setuju, 5=Sangat Setuju)" },
  q4g:   { en: "Securing financial support has been challenging (1=Strongly Disagree, 5=Strongly Agree)",     bm: "Mendapatkan sokongan kewangan adalah mencabar (1=Sangat Tidak Setuju, 5=Sangat Setuju)" },
  q4h:   { en: "Main concerns about obtaining business loans (up to 3)",                                       bm: "Kebimbangan utama dalam memperoleh pinjaman perniagaan (sehingga 3)" },
  q4i:   { en: "Observed/experienced bias against women entrepreneurs?",                                      bm: "Pernah memerhati/mengalami bias terhadap usahawan wanita?" },
  q6a:   { en: "Currently providing care for (select all that apply)",                                        bm: "Kini menjaga (pilih semua yang berkenaan)" },
  q6b:   { en: "Is the care you provide paid or unpaid?",                                                     bm: "Adakah penjagaan yang anda berikan berbayar atau tidak berbayar?" },
  q6c:   { en: "Monthly amount received for care work (RM)",                                                  bm: "Jumlah bulanan yang diterima untuk kerja penjagaan (RM)" },
  q6d:   { en: "Hours per week spent on caregiving",                                                          bm: "Jam seminggu untuk aktiviti penjagaan" },
  q6e:   { en: "Who else shares caregiving responsibilities with you?",                                       bm: "Siapakah lagi yang berkongsi tanggungjawab penjagaan bersama anda?" },
  q6f:   { en: "How caregiving affects your work or livelihood",                                              bm: "Kesan tanggungjawab penjagaan terhadap pekerjaan atau pendapatan" },
  q6g:   { en: "Support that would most help manage caregiving (up to 3)",                                    bm: "Sokongan yang paling membantu dalam menguruskan penjagaan (sehingga 3)" },
  q5a:   { en: "Gender identity",                                                                              bm: "Identiti gender" },
  q5b:   { en: "Age group",                                                                                    bm: "Kumpulan umur" },
  q5c:   { en: "State of residence",                                                                           bm: "Negeri tempat tinggal" },
  q5d:   { en: "Residence area type",                                                                          bm: "Jenis kawasan tempat tinggal" },
  q5e:   { en: "Ethnic background",                                                                            bm: "Latar belakang etnik" },
  q5f:   { en: "Highest level of education",                                                                   bm: "Tahap pendidikan tertinggi" },
  q5g:   { en: "First name",                                                                                   bm: "Nama pertama" },
  q5h:   { en: "Last name",                                                                                    bm: "Nama keluarga" },
  q5i:   { en: "Email",                                                                                        bm: "E-mel" },
  q5j:   { en: "Contact number",                                                                               bm: "Nombor telefon" },
  q5k:   { en: "How did you hear about Strivers' Hub?",                                                        bm: "Bagaimana anda mendapat tahu tentang Strivers' Hub?" },
};
