export type EducationCategory =
  | "Urologi"
  | "Reproduksi"
  | "Menstruasi"
  | "Kebersihan"
  | "Pencegahan";

export type EducationArticle = {
  slug: string;
  title: string;
  category: EducationCategory;
  icon: string;
  description: string;
  readTime: string;
  level: "Dasar" | "Menengah";
  introduction: string;
  keyPoints: string[];
  sections: { title: string; content: string[] }[];
  tips?: string[];
  warningSigns?: string[];
  related?: string[];
};

export const educationCategories = [
  { name: "Urologi" as const, icon: "💧", description: "Ginjal, urine, kandung kemih, hidrasi, dan saluran kemih." },
  { name: "Reproduksi" as const, icon: "🧬", description: "Pubertas, organ reproduksi, kesehatan testis, dan kesehatan reproduksi." },
  { name: "Menstruasi" as const, icon: "🌸", description: "Siklus menstruasi, nyeri, kebersihan, dan kapan perlu diperiksa." },
  { name: "Kebersihan" as const, icon: "🫧", description: "Kebiasaan sederhana untuk menjaga area genital dan tubuh tetap sehat." },
  { name: "Pencegahan" as const, icon: "🛡️", description: "Kenali kebiasaan sehat dan tanda bahaya yang tidak boleh diabaikan." },
];

export const educationArticles: EducationArticle[] = [
  {
    slug: "mengenal-ginjal",
    title: "Mengenal Ginjal dan Fungsinya",
    category: "Urologi",
    icon: "🫘",
    description: "Kenali fungsi ginjal dan kebiasaan sederhana yang membantu menjaga kesehatannya.",
    readTime: "6 menit",
    level: "Dasar",
    introduction: "Ginjal adalah dua organ yang membantu menyaring darah, membuang zat sisa melalui urine, serta menjaga keseimbangan cairan dan mineral tubuh.",
    keyPoints: ["Ginjal menyaring darah dan membentuk urine.", "Asupan cairan yang cukup membantu fungsi tubuh secara umum.", "Nyeri hebat, darah pada urine, atau bengkak perlu dinilai tenaga kesehatan."],
    sections: [
      { title: "Apa yang dilakukan ginjal?", content: ["Ginjal menyaring darah dan membantu membuang zat sisa serta kelebihan cairan melalui urine.", "Ginjal juga berperan dalam keseimbangan elektrolit, tekanan darah, dan beberapa hormon penting bagi tubuh."] },
      { title: "Kebiasaan yang mendukung kesehatan ginjal", content: ["Minum sesuai kebutuhan tubuh, tetap aktif, tidak merokok, serta menghindari penggunaan obat tanpa aturan merupakan kebiasaan yang baik.", "Pola makan seimbang dan membatasi asupan garam berlebihan juga membantu kesehatan tubuh secara keseluruhan."] },
      { title: "Apa yang perlu diperhatikan?", content: ["Perubahan warna urine, bengkak, nyeri pinggang hebat, demam, atau berkurangnya produksi urine dapat menjadi alasan untuk mencari penilaian medis."] },
    ],
    tips: ["Biasakan membawa botol minum.", "Jangan menahan buang air kecil terlalu lama.", "Gunakan obat sesuai petunjuk tenaga kesehatan atau label."],
    warningSigns: ["Darah pada urine", "Nyeri pinggang hebat disertai demam", "Bengkak yang tidak biasa", "Sulit atau hampir tidak bisa buang air kecil"],
    related: ["hidrasi-sehat", "warna-urine", "batu-ginjal"],
  },
  {
    slug: "hidrasi-sehat",
    title: "Hidrasi Sehat",
    category: "Urologi",
    icon: "💧",
    description: "Pahami tanda tubuh membutuhkan cairan dan cara menjaga hidrasi sehari-hari.",
    readTime: "5 menit",
    level: "Dasar",
    introduction: "Cairan membantu mengatur suhu tubuh, membawa zat gizi, dan mendukung sistem kemih. Kebutuhan tiap orang dapat berbeda tergantung aktivitas, cuaca, dan kondisi kesehatan.",
    keyPoints: ["Rasa haus adalah salah satu sinyal tubuh membutuhkan cairan.", "Kebutuhan cairan tidak selalu sama untuk setiap orang.", "Urine yang sangat pekat terus-menerus dapat menjadi tanda asupan cairan kurang."],
    sections: [
      { title: "Tanda hidrasi yang perlu diperhatikan", content: ["Mulut kering, rasa haus, pusing, kelelahan, dan urine yang lebih pekat dapat muncul saat tubuh kekurangan cairan.", "Saat cuaca panas atau aktivitas fisik meningkat, kebutuhan cairan biasanya bertambah."] },
      { title: "Cara menjaga hidrasi", content: ["Minum secara teratur sepanjang hari dan tambah asupan saat berkeringat lebih banyak.", "Air putih umumnya menjadi pilihan utama; makanan seperti buah dan sayur juga menyumbang cairan."] },
    ],
    tips: ["Minum sedikit demi sedikit tetapi rutin.", "Perhatikan rasa haus dan warna urine.", "Tambah cairan saat berolahraga atau berada di cuaca panas."],
    warningSigns: ["Pusing berat atau kebingungan", "Tidak buang air kecil dalam waktu lama", "Muntah terus-menerus sehingga tidak bisa minum"],
    related: ["mengenal-ginjal", "warna-urine", "infeksi-saluran-kemih"],
  },
  {
    slug: "warna-urine",
    title: "Apa Arti Warna Urine?",
    category: "Urologi",
    icon: "🧪",
    description: "Pelajari perubahan warna urine yang umum dan kapan perlu lebih waspada.",
    readTime: "5 menit",
    level: "Dasar",
    introduction: "Warna urine dapat berubah karena jumlah cairan, makanan, vitamin, obat, maupun kondisi kesehatan tertentu. Warna saja tidak cukup untuk menentukan diagnosis.",
    keyPoints: ["Urine pucat hingga kuning muda sering berkaitan dengan hidrasi cukup.", "Makanan, vitamin, dan obat dapat mengubah warna urine.", "Urine merah, cokelat gelap, atau keruh yang menetap perlu diperhatikan."],
    sections: [
      { title: "Perubahan yang sering terjadi", content: ["Urine yang lebih kuning pekat sering terjadi ketika asupan cairan berkurang.", "Beberapa makanan, suplemen, dan obat dapat membuat urine tampak lebih terang atau berubah warna sementara."] },
      { title: "Jangan mendiagnosis dari warna saja", content: ["Warna urine perlu dilihat bersama gejala lain seperti nyeri, demam, bau yang berbeda, sering buang air kecil, atau adanya darah."] },
    ],
    warningSigns: ["Urine merah atau tampak berdarah", "Urine cokelat gelap yang menetap", "Urine keruh disertai nyeri atau demam"],
    related: ["hidrasi-sehat", "infeksi-saluran-kemih", "mengenal-ginjal"],
  },
  {
    slug: "infeksi-saluran-kemih",
    title: "Infeksi Saluran Kemih (ISK)",
    category: "Urologi",
    icon: "🦠",
    description: "Kenali gejala umum ISK dan alasan mengapa beberapa gejala perlu segera diperiksa.",
    readTime: "7 menit",
    level: "Menengah",
    introduction: "Infeksi saluran kemih adalah infeksi pada bagian sistem kemih. Gejala dapat berbeda pada setiap orang dan diagnosis perlu dilakukan oleh tenaga kesehatan.",
    keyPoints: ["Nyeri atau panas saat buang air kecil merupakan gejala yang umum.", "Sering ingin buang air kecil juga dapat terjadi.", "Demam dan nyeri pinggang dapat menandakan kondisi yang perlu segera diperiksa."],
    sections: [
      { title: "Gejala yang mungkin muncul", content: ["Keluhan dapat berupa rasa panas saat buang air kecil, sering ingin buang air kecil, nyeri perut bawah, urine keruh, atau perubahan bau.", "Gejala serupa juga dapat disebabkan oleh kondisi lain, sehingga pemeriksaan tetap penting bila keluhan menetap."] },
      { title: "Pencegahan sederhana", content: ["Cukupi cairan, jangan menahan buang air kecil terlalu lama, dan jaga kebersihan area genital dengan cara yang lembut.", "Hindari penggunaan produk berpewangi yang memicu iritasi pada area sensitif."] },
    ],
    warningSigns: ["Demam tinggi", "Nyeri pinggang atau punggung yang berat", "Mual atau muntah", "Darah pada urine"],
    related: ["hidrasi-sehat", "kebersihan-area-genital", "warna-urine"],
  },
  {
    slug: "batu-ginjal",
    title: "Batu Ginjal: Kenali Tanda Awalnya",
    category: "Urologi",
    icon: "🪨",
    description: "Pahami secara sederhana apa itu batu ginjal, gejala yang mungkin muncul, dan langkah pencegahan umum.",
    readTime: "7 menit",
    level: "Menengah",
    introduction: "Batu ginjal terbentuk ketika zat tertentu dalam urine mengkristal. Tidak semua batu menimbulkan gejala, tetapi sebagian dapat menyebabkan nyeri yang sangat kuat.",
    keyPoints: ["Nyeri hebat di sisi pinggang dapat terjadi saat batu bergerak.", "Pencegahan berbeda tergantung jenis batu dan kondisi seseorang.", "Nyeri hebat, demam, atau sulit buang air kecil memerlukan pertolongan medis."],
    sections: [
      { title: "Gejala yang mungkin muncul", content: ["Nyeri tajam pada sisi pinggang yang dapat menjalar, mual, muntah, atau darah pada urine dapat terjadi pada batu ginjal.", "Gejala serupa juga dapat berasal dari kondisi lain sehingga pemeriksaan diperlukan."] },
      { title: "Kebiasaan pencegahan umum", content: ["Menjaga hidrasi merupakan langkah penting bagi banyak orang.", "Pola makan dan anjuran lain dapat berbeda menurut jenis batu, sehingga tidak semua pembatasan makanan cocok untuk setiap orang."] },
    ],
    warningSigns: ["Nyeri sangat berat", "Demam atau menggigil", "Tidak dapat buang air kecil", "Muntah berulang"],
    related: ["mengenal-ginjal", "hidrasi-sehat", "warna-urine"],
  },
  {
    slug: "pubertas",
    title: "Mengenal Pubertas",
    category: "Reproduksi",
    icon: "🌱",
    description: "Pelajari perubahan fisik dan emosional yang umum terjadi selama pubertas.",
    readTime: "6 menit",
    level: "Dasar",
    introduction: "Pubertas adalah masa ketika tubuh mengalami perubahan menuju kematangan reproduksi. Waktu dan kecepatannya berbeda pada setiap orang.",
    keyPoints: ["Perubahan pubertas tidak terjadi pada waktu yang sama untuk semua orang.", "Perubahan fisik dan emosi merupakan bagian perkembangan.", "Keluhan yang mengganggu atau perubahan yang sangat tidak biasa boleh dikonsultasikan."],
    sections: [
      { title: "Perubahan fisik", content: ["Tubuh dapat bertambah tinggi, produksi keringat dan minyak meningkat, rambut tumbuh di beberapa area, dan organ reproduksi berkembang."] },
      { title: "Perubahan emosional", content: ["Perubahan suasana hati, kebutuhan privasi, rasa ingin mandiri, serta ketertarikan kepada orang lain dapat mulai muncul."] },
      { title: "Setiap orang berbeda", content: ["Membandingkan perkembangan tubuh dengan teman sering membuat cemas. Variasi waktu pubertas cukup luas dan tidak selalu menunjukkan masalah."] },
    ],
    tips: ["Jaga kebersihan tubuh.", "Tidur cukup.", "Konsumsi makanan bergizi.", "Bicarakan pertanyaan dengan orang dewasa tepercaya atau tenaga kesehatan."],
    related: ["organ-reproduksi", "kebersihan-area-genital", "kesehatan-testis"],
  },
  {
    slug: "organ-reproduksi",
    title: "Mengenal Organ Reproduksi",
    category: "Reproduksi",
    icon: "🧬",
    description: "Kenali fungsi dasar organ reproduksi dan pentingnya memahami tubuh sendiri.",
    readTime: "7 menit",
    level: "Dasar",
    introduction: "Mengenal anatomi reproduksi membantu seseorang memahami perubahan tubuh, menjaga kebersihan, serta mengenali keluhan yang perlu diperiksa.",
    keyPoints: ["Anatomi reproduksi memiliki bagian luar dan dalam.", "Fungsi tiap organ berbeda tetapi saling berkaitan.", "Perubahan atau keluhan tidak biasa perlu dinilai berdasarkan gejala, bukan rasa malu."],
    sections: [
      { title: "Mengapa mengenal anatomi penting?", content: ["Pengetahuan anatomi membantu menggunakan istilah yang tepat saat bertanya atau menjelaskan keluhan kepada tenaga kesehatan.", "Hal ini juga membantu membedakan informasi ilmiah dari mitos."] },
      { title: "Menjaga kesehatan reproduksi", content: ["Kebersihan yang lembut, pakaian dalam bersih, dan menghindari produk yang menimbulkan iritasi merupakan langkah sederhana yang berguna."] },
    ],
    related: ["pubertas", "kebersihan-area-genital", "kesehatan-testis"],
  },
  {
    slug: "kesehatan-testis",
    title: "Kesehatan Testis",
    category: "Reproduksi",
    icon: "🩺",
    description: "Kenali perubahan pada testis yang normal dan tanda bahaya yang perlu segera ditangani.",
    readTime: "6 menit",
    level: "Menengah",
    introduction: "Testis merupakan bagian dari sistem reproduksi pria. Nyeri atau perubahan mendadak pada testis tidak boleh diabaikan.",
    keyPoints: ["Sedikit perbedaan posisi antara kedua testis dapat normal.", "Nyeri testis mendadak dan berat adalah keadaan yang harus segera dinilai.", "Benjolan baru atau pembengkakan perlu diperiksa."],
    sections: [
      { title: "Apa yang bisa diperhatikan?", content: ["Perhatikan bila ada pembengkakan, benjolan, rasa berat, atau perubahan ukuran yang baru terjadi.", "Keluhan tidak selalu berarti penyakit serius, tetapi pemeriksaan membantu mengetahui penyebabnya."] },
      { title: "Nyeri mendadak perlu cepat ditangani", content: ["Nyeri hebat yang muncul tiba-tiba, terutama disertai mual atau pembengkakan, memerlukan penilaian medis segera karena beberapa kondisi sensitif terhadap waktu."] },
    ],
    warningSigns: ["Nyeri testis mendadak dan berat", "Pembengkakan cepat", "Mual disertai nyeri testis", "Benjolan baru yang menetap"],
    related: ["pubertas", "organ-reproduksi", "kebersihan-area-genital"],
  },
  {
    slug: "siklus-menstruasi",
    title: "Memahami Siklus Menstruasi",
    category: "Menstruasi",
    icon: "🩸",
    description: "Pelajari bagaimana siklus menstruasi berlangsung dan mengapa pola tiap orang bisa berbeda.",
    readTime: "7 menit",
    level: "Dasar",
    introduction: "Siklus menstruasi dihitung dari hari pertama menstruasi hingga hari pertama menstruasi berikutnya. Pada masa remaja, siklus dapat belum teratur.",
    keyPoints: ["Panjang siklus dapat berbeda antarindividu.", "Mencatat siklus membantu mengenali pola pribadi.", "Perubahan yang menetap atau perdarahan sangat banyak perlu dinilai."],
    sections: [
      { title: "Apa yang terjadi dalam satu siklus?", content: ["Hormon mengatur perubahan pada ovarium dan lapisan rahim sepanjang siklus.", "Menstruasi terjadi ketika lapisan rahim luruh dan keluar sebagai darah menstruasi."] },
      { title: "Mengapa mencatat siklus?", content: ["Catatan membantu melihat pola, memperkirakan menstruasi berikutnya, serta mencatat keluhan seperti nyeri atau perubahan jumlah perdarahan."] },
    ],
    tips: ["Catat hari pertama menstruasi.", "Catat keluhan yang muncul.", "Gunakan Cycle Tracker UROVA untuk melihat pola dari waktu ke waktu."],
    warningSigns: ["Perdarahan sangat banyak", "Pusing atau lemas berat", "Nyeri yang mengganggu aktivitas", "Perubahan pola yang menetap dan mengkhawatirkan"],
    related: ["nyeri-menstruasi", "menstrual-hygiene", "pubertas"],
  },
  {
    slug: "nyeri-menstruasi",
    title: "Nyeri Menstruasi",
    category: "Menstruasi",
    icon: "🌺",
    description: "Kenali penyebab umum kram menstruasi dan kapan rasa nyeri perlu diperiksakan.",
    readTime: "6 menit",
    level: "Dasar",
    introduction: "Kram menstruasi cukup umum dan dapat terjadi karena kontraksi rahim. Namun nyeri yang sangat berat atau semakin memburuk tidak perlu dianggap normal begitu saja.",
    keyPoints: ["Kram ringan sampai sedang cukup umum.", "Kompres hangat dan aktivitas ringan dapat membantu sebagian orang.", "Nyeri berat yang menghambat aktivitas perlu dievaluasi."],
    sections: [
      { title: "Mengapa bisa terasa nyeri?", content: ["Zat yang disebut prostaglandin membantu rahim berkontraksi. Pada sebagian orang, kontraksi ini menimbulkan nyeri lebih kuat."] },
      { title: "Cara membantu rasa tidak nyaman", content: ["Kompres hangat, istirahat cukup, hidrasi, dan aktivitas ringan dapat membantu sebagian orang.", "Jika mempertimbangkan obat pereda nyeri, ikuti petunjuk kemasan atau arahan tenaga kesehatan dan perhatikan kontraindikasi pribadi."] },
    ],
    warningSigns: ["Nyeri sampai pingsan", "Nyeri mendadak yang berbeda dari biasanya", "Demam", "Perdarahan sangat banyak"],
    related: ["siklus-menstruasi", "menstrual-hygiene", "pubertas"],
  },
  {
    slug: "menstrual-hygiene",
    title: "Kebersihan Saat Menstruasi",
    category: "Menstruasi",
    icon: "🫧",
    description: "Panduan praktis menjaga kebersihan dan kenyamanan selama menstruasi.",
    readTime: "5 menit",
    level: "Dasar",
    introduction: "Kebersihan menstruasi yang baik membantu menjaga kenyamanan dan mengurangi risiko iritasi.",
    keyPoints: ["Ganti produk menstruasi secara teratur sesuai jenis dan petunjuk penggunaan.", "Cuci tangan sebelum dan sesudah mengganti produk.", "Bersihkan area genital dengan lembut."],
    sections: [
      { title: "Menggunakan produk menstruasi", content: ["Pilih produk yang nyaman dan sesuai kebutuhan. Ikuti petunjuk penggunaan, termasuk waktu penggantian.", "Jika kulit terasa gatal atau iritasi setelah memakai produk tertentu, hentikan bila memungkinkan dan pertimbangkan produk lain yang lebih sesuai."] },
      { title: "Menjaga kebersihan", content: ["Gunakan air bersih dan hindari menggosok terlalu keras.", "Produk berpewangi tidak diperlukan untuk menjaga kebersihan area genital dan dapat memicu iritasi pada sebagian orang."] },
    ],
    related: ["siklus-menstruasi", "nyeri-menstruasi", "kebersihan-area-genital"],
  },
  {
    slug: "kebersihan-area-genital",
    title: "Kebersihan Area Genital",
    category: "Kebersihan",
    icon: "🧼",
    description: "Cara sederhana merawat area genital tanpa membuat kulit sensitif menjadi iritasi.",
    readTime: "5 menit",
    level: "Dasar",
    introduction: "Area genital memiliki kulit yang sensitif. Kebersihan yang baik tidak berarti harus menggunakan banyak produk.",
    keyPoints: ["Air bersih dan pembersihan lembut sering kali cukup.", "Hindari produk berpewangi bila menimbulkan iritasi.", "Jaga area tetap kering dan gunakan pakaian dalam bersih."],
    sections: [
      { title: "Kebiasaan sehari-hari", content: ["Ganti pakaian dalam setiap hari atau ketika lembap atau kotor.", "Setelah aktivitas yang membuat banyak berkeringat, mandi dan ganti pakaian membantu menjaga kenyamanan."] },
      { title: "Hindari pembersihan berlebihan", content: ["Menggosok terlalu keras atau memakai produk yang kuat dapat mengiritasi kulit dan mengganggu keseimbangan alami area sensitif."] },
    ],
    warningSigns: ["Luka atau lepuh", "Gatal berat yang menetap", "Cairan tidak biasa disertai nyeri atau bau menyengat", "Pembengkakan atau nyeri berat"],
    related: ["menstrual-hygiene", "infeksi-saluran-kemih", "pubertas"],
  },
  {
    slug: "personal-hygiene",
    title: "Personal Hygiene Remaja",
    category: "Kebersihan",
    icon: "🚿",
    description: "Bangun rutinitas kebersihan tubuh yang sederhana dan realistis.",
    readTime: "5 menit",
    level: "Dasar",
    introduction: "Perubahan hormon selama pubertas dapat meningkatkan keringat dan produksi minyak pada kulit. Rutinitas yang konsisten membantu menjaga kenyamanan.",
    keyPoints: ["Mandi rutin dan ganti pakaian setelah berkeringat banyak.", "Jaga kebersihan gigi dan tangan.", "Pilih produk yang tidak membuat kulit iritasi."],
    sections: [
      { title: "Rutinitas dasar", content: ["Mandi, mencuci tangan, menyikat gigi, mengganti pakaian, serta membersihkan area tubuh yang mudah berkeringat merupakan dasar personal hygiene."] },
      { title: "Sesuaikan dengan aktivitas", content: ["Setelah olahraga atau aktivitas berat, tubuh dapat lebih berkeringat sehingga pakaian dan pakaian dalam sebaiknya diganti bila lembap."] },
    ],
    related: ["kebersihan-area-genital", "pubertas", "hidrasi-sehat"],
  },
  {
    slug: "ims",
    title: "Mengenal Infeksi Menular Seksual",
    category: "Pencegahan",
    icon: "🛡️",
    description: "Pelajari konsep dasar IMS, bagaimana penularan dapat terjadi, dan mengapa pemeriksaan penting.",
    readTime: "8 menit",
    level: "Menengah",
    introduction: "Infeksi menular seksual (IMS) adalah infeksi yang dapat ditularkan melalui aktivitas seksual tertentu. Beberapa IMS tidak menimbulkan gejala di awal.",
    keyPoints: ["Tidak semua IMS menimbulkan gejala.", "Tes dan konsultasi membantu memastikan diagnosis.", "Informasi kesehatan seksual dari sumber tepercaya penting untuk pencegahan."],
    sections: [
      { title: "Mengapa edukasi IMS penting?", content: ["Karena sebagian IMS tidak bergejala, seseorang tidak dapat menilai status infeksi hanya dari penampilan.", "Mengenali cara penularan dan pencegahan membantu membuat keputusan kesehatan yang lebih aman."] },
      { title: "Jika memiliki kekhawatiran", content: ["Jika terdapat paparan yang dikhawatirkan, luka, cairan tidak biasa, atau gejala lain, konsultasi dengan tenaga kesehatan dapat membantu menentukan pemeriksaan yang sesuai."] },
    ],
    warningSigns: ["Nyeri berat", "Demam disertai keluhan genital", "Luka atau lepuh yang luas", "Nyeri testis mendadak"],
    related: ["kebersihan-area-genital", "organ-reproduksi", "kesehatan-testis"],
  },
  {
    slug: "jangan-tahan-bak",
    title: "Bahaya Kebiasaan Menahan Buang Air Kecil",
    category: "Pencegahan",
    icon: "⏱️",
    description: "Pahami mengapa kebiasaan menahan BAK terlalu lama sebaiknya tidak dilakukan terus-menerus.",
    readTime: "4 menit",
    level: "Dasar",
    introduction: "Sesekali menunda buang air kecil bisa terjadi, tetapi membiasakannya terlalu lama dapat menimbulkan rasa tidak nyaman dan mengganggu pola berkemih.",
    keyPoints: ["Dengarkan sinyal tubuh saat ingin buang air kecil.", "Menahan terlalu lama bukan kebiasaan yang dianjurkan.", "Nyeri atau sulit buang air kecil perlu dinilai."],
    sections: [
      { title: "Kenapa sebaiknya tidak dibiasakan?", content: ["Kandung kemih menyimpan urine sampai waktunya dikeluarkan. Menahan terlalu lama dapat membuat tidak nyaman dan mengganggu kebiasaan berkemih pada sebagian orang."] },
      { title: "Bangun kebiasaan sehat", content: ["Gunakan toilet saat tubuh memberi sinyal, terutama ketika akses toilet tersedia dan aman.", "Tetap cukupi cairan; jangan mengurangi minum hanya untuk menghindari buang air kecil."] },
    ],
    related: ["infeksi-saluran-kemih", "hidrasi-sehat", "mengenal-ginjal"],
  },
  {
    slug: "tanda-bahaya-urologi",
    title: "Tanda Bahaya Urologi",
    category: "Pencegahan",
    icon: "🚨",
    description: "Kenali gejala yang tidak sebaiknya ditunda untuk diperiksakan.",
    readTime: "5 menit",
    level: "Menengah",
    introduction: "Sebagian keluhan saluran kemih dapat dipantau, tetapi ada gejala tertentu yang memerlukan penilaian lebih cepat.",
    keyPoints: ["Darah pada urine perlu dievaluasi.", "Demam dengan nyeri pinggang dapat membutuhkan penanganan segera.", "Tidak bisa buang air kecil adalah kondisi yang perlu pertolongan medis."],
    sections: [
      { title: "Gejala yang perlu perhatian cepat", content: ["Darah pada urine, tidak dapat buang air kecil, nyeri pinggang berat dengan demam, atau nyeri testis mendadak merupakan contoh gejala yang tidak boleh diabaikan."] },
      { title: "Jangan menunggu diagnosis dari internet", content: ["Informasi daring dapat membantu memahami istilah, tetapi pemeriksaan fisik, riwayat kesehatan, dan tes tertentu mungkin diperlukan untuk menentukan penyebab."] },
    ],
    warningSigns: ["Tidak bisa buang air kecil", "Darah pada urine", "Demam tinggi disertai nyeri pinggang", "Nyeri testis mendadak dan berat"],
    related: ["infeksi-saluran-kemih", "batu-ginjal", "kesehatan-testis"],
  },
];

export function getEducationArticle(slug: string) {
  return educationArticles.find((article) => article.slug === slug);
}

export function getRelatedArticles(article: EducationArticle) {
  const wanted = article.related ?? [];
  return wanted
    .map((slug) => educationArticles.find((item) => item.slug === slug))
    .filter(Boolean) as EducationArticle[];
}
