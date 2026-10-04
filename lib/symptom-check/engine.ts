import type { AssessmentInput, AssessmentResult } from "@/types/symptom-check";
const hasAny=(items:string[],ids:string[])=>ids.some(id=>items.includes(id));
export function assessSymptoms(input:AssessmentInput):AssessmentResult{
 const s=input.symptoms; const redFlags:string[]=[];
 if(input.suddenSevereTesticularPain) redFlags.push("Nyeri testis mendadak dan sangat berat perlu dinilai segera karena beberapa penyebab membutuhkan penanganan cepat.");
 if(input.unableToUrinate) redFlags.push("Tidak dapat buang air kecil sama sekali, terutama disertai nyeri perut bawah, perlu pertolongan medis segera.");
 if(input.fainting) redFlags.push("Pingsan atau hampir pingsan bersama keluhan ini merupakan tanda untuk segera mencari bantuan.");
 if(input.blood) redFlags.push("Darah yang terlihat pada urine atau perdarahan yang tidak biasa perlu dievaluasi tenaga kesehatan.");
 if(input.vomiting&&(input.fever||hasAny(s,["flank-pain","testicular-pain"]))) redFlags.push("Muntah berulang bersama demam atau nyeri berat dapat menyebabkan dehidrasi dan perlu evaluasi segera.");
 if(input.fever&&hasAny(s,["flank-pain","pain-urination","testicular-pain","testicular-swelling"])) redFlags.push("Demam bersama nyeri saluran kemih, pinggang, atau testis perlu diperiksa lebih cepat.");
 if(s.includes("heavy-bleeding")&&(input.severity>=4||input.fainting||s.includes("dizziness"))) redFlags.push("Perdarahan sangat banyak disertai lemas, pusing, atau hampir pingsan perlu pertolongan segera.");
 const urgent=redFlags.length>0||input.severity===5;
 const soon=!urgent&&(input.severity>=4||input.duration==="more-than-week"||input.fever||input.blood);
 const possiblePatterns:string[]=[]; const prevention=new Set<string>(); const recovery=new Set<string>();
 if(hasAny(s,["pain-urination","frequent-urination","cloudy-urine","lower-abdominal-pain"])){
  possiblePatterns.push("Keluhan saluran kemih bawah — misalnya iritasi atau infeksi saluran kemih — dapat menimbulkan pola seperti nyeri saat BAK, sering BAK, urine berubah, atau rasa tidak nyaman di perut bawah.");
  prevention.add("Minum air secara teratur sesuai kebutuhan tubuh dan jangan sengaja menahan buang air kecil terlalu lama.");
  prevention.add("Jaga kebersihan area genital dengan lembut dan hindari produk berpewangi yang menimbulkan iritasi.");
  recovery.add("Istirahat, cukup minum, dan pantau apakah nyeri atau perubahan urine membaik dalam 24–48 jam.");
 }
 if(hasAny(s,["flank-pain","low-urine"])){
  possiblePatterns.push("Keluhan di area ginjal atau saluran kemih bagian atas dapat muncul sebagai nyeri pinggang/sisi tubuh atau perubahan jumlah urine. Penyebabnya beragam sehingga pemeriksaan menjadi penting bila menetap atau berat.");
  prevention.add("Jaga hidrasi yang cukup dan hindari kebiasaan menunda BAK berulang kali.");
  recovery.add("Kurangi aktivitas berat sementara bila nyeri meningkat saat bergerak dan catat perubahan jumlah serta warna urine.");
 }
 if(hasAny(s,["menstrual-cramp","irregular-cycle","heavy-bleeding"])){
  possiblePatterns.push("Perubahan menstruasi dapat berkaitan dengan variasi siklus, stres, perubahan aktivitas, atau kondisi lain. Pola, durasi, dan jumlah perdarahan membantu menentukan apakah perlu pemeriksaan.");
  prevention.add("Catat tanggal menstruasi, durasi, dan gejala agar perubahan pola lebih mudah dikenali.");
  prevention.add("Pertahankan tidur, makan, dan aktivitas fisik yang teratur untuk mendukung kesehatan umum.");
  recovery.add("Untuk kram ringan, istirahat dan kompres hangat pada perut bawah dapat membantu kenyamanan.");
 }
 if(hasAny(s,["itching","unusual-discharge","genital-sore"])){
  possiblePatterns.push("Gatal, iritasi, cairan yang berubah, atau luka di area genital dapat disebabkan iritasi, infeksi, atau kondisi kulit. Pemeriksaan diperlukan terutama bila gejalanya menetap, nyeri, atau disertai demam.");
  prevention.add("Gunakan pakaian dalam bersih dan kering, ganti setelah berkeringat, dan hindari sabun/pewangi keras pada area sensitif.");
  recovery.add("Hindari menggaruk atau mencoba obat sembarangan pada area sensitif sebelum penyebabnya lebih jelas.");
 }
 if(hasAny(s,["testicular-pain","testicular-swelling"])){
  possiblePatterns.push("Nyeri atau bengkak testis perlu diperhatikan karena penyebabnya dapat berkisar dari iritasi hingga kondisi yang membutuhkan penanganan cepat, terutama bila muncul mendadak.");
  prevention.add("Gunakan pelindung yang sesuai saat olahraga kontak dan jangan abaikan perubahan bentuk, benjolan, atau nyeri yang menetap.");
  recovery.add("Hindari aktivitas yang memperparah nyeri sampai kondisi dinilai lebih lanjut.");
 }
 if(hasAny(s,["fatigue","dizziness"])){
  possiblePatterns.push("Lelah atau pusing bersifat umum dan dapat berkaitan dengan kurang tidur, kurang makan/minum, perdarahan, atau banyak kondisi lain. Gejala lain yang menyertai menentukan langkah berikutnya.");
  prevention.add("Jaga pola makan, cairan, dan waktu tidur yang teratur.");
  recovery.add("Beristirahat dan hindari berdiri mendadak bila sedang pusing; minta bantuan bila terasa akan pingsan.");
 }
 if(possiblePatterns.length===0) possiblePatterns.push("Keluhan yang dipilih belum membentuk pola spesifik. Gunakan hasil ini untuk memantau gejala, bukan sebagai diagnosis.");
 prevention.add("Catat kapan gejala mulai, apa yang memperburuk atau memperbaiki, serta perubahan lain yang menyertai.");
 recovery.add("Jangan memaksakan aktivitas bila tubuh terasa memburuk dan cari bantuan bila muncul tanda bahaya.");
 return { urgency:urgent?"urgent":soon?"soon":"self-care", urgencyTitle:urgent?"Perlu bantuan medis lebih cepat":soon?"Sebaiknya diperiksa":"Dapat dipantau dengan perawatan awal", urgencyDescription:urgent?"Ada tanda yang tidak sebaiknya ditunda. Minta bantuan orang dewasa tepercaya dan cari fasilitas kesehatan sesegera mungkin.":soon?"Keluhan cukup berat, berlangsung lama, atau memiliki faktor yang perlu dinilai tenaga kesehatan.":"Belum terlihat tanda bahaya dari jawabanmu. Pantau kondisi dan gunakan langkah perawatan awal yang aman.", possiblePatterns, prevention:Array.from(prevention), recovery:Array.from(recovery), redFlags, followUp:urgent?"Jika kondisi memburuk cepat, nyeri sangat berat, sulit bernapas, pingsan, atau tidak bisa BAK, cari pertolongan darurat.":"Bila gejala tidak membaik dalam 24–48 jam, berulang, atau mulai mengganggu aktivitas, pertimbangkan konsultasi tenaga kesehatan." };
}
