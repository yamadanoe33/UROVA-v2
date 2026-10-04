import type { SymptomOption } from "@/types/symptom-check";
export const symptomOptions: SymptomOption[] = [
{id:"pain-urination",label:"Nyeri saat BAK",description:"Perih, panas, atau tidak nyaman saat buang air kecil.",category:"urinary",icon:"💧"},
{id:"frequent-urination",label:"Sering BAK",description:"Lebih sering dari biasanya atau terasa ingin BAK terus.",category:"urinary",icon:"🚻"},
{id:"cloudy-urine",label:"Urine keruh / berbau",description:"Warna atau bau urine berubah cukup jelas.",category:"urinary",icon:"🫧"},
{id:"lower-abdominal-pain",label:"Nyeri perut bawah",description:"Rasa sakit atau tekanan di bawah pusar.",category:"urinary",icon:"🩹"},
{id:"flank-pain",label:"Nyeri pinggang / sisi tubuh",description:"Nyeri di punggung bawah atau sisi tubuh dekat ginjal.",category:"kidney",icon:"🫘"},
{id:"low-urine",label:"Urine jauh berkurang",description:"Jumlah urine terasa jauh lebih sedikit dari biasanya.",category:"kidney",icon:"📉"},
{id:"menstrual-cramp",label:"Nyeri menstruasi",description:"Kram atau nyeri saat atau menjelang menstruasi.",category:"menstrual",icon:"🌸"},
{id:"irregular-cycle",label:"Siklus tidak teratur",description:"Jadwal menstruasi berubah jauh dari pola biasanya.",category:"menstrual",icon:"📆"},
{id:"heavy-bleeding",label:"Perdarahan lebih banyak",description:"Aliran menstruasi terasa jauh lebih banyak dari biasanya.",category:"menstrual",icon:"🩸"},
{id:"itching",label:"Gatal / iritasi genital",description:"Gatal, kemerahan, atau rasa terbakar di area genital.",category:"genital",icon:"✨"},
{id:"unusual-discharge",label:"Cairan tidak biasa",description:"Perubahan warna, bau, atau jumlah cairan dari genital.",category:"genital",icon:"🧴"},
{id:"genital-sore",label:"Luka / benjolan",description:"Ada luka, lepuh, atau benjolan yang baru muncul.",category:"genital",icon:"🔎"},
{id:"testicular-pain",label:"Nyeri testis",description:"Nyeri, berat, atau tidak nyaman pada testis.",category:"testicular",icon:"🩺"},
{id:"testicular-swelling",label:"Bengkak testis",description:"Ukuran atau bentuk skrotum berubah / membengkak.",category:"testicular",icon:"⚪"},
{id:"fatigue",label:"Mudah lelah",description:"Energi berkurang atau cepat lelah dibanding biasanya.",category:"general",icon:"😴"},
{id:"dizziness",label:"Pusing",description:"Kepala terasa ringan, berkunang, atau tidak stabil.",category:"general",icon:"💫"}
];
export const durationOptions = [
{value:"today",label:"Hari ini"},{value:"1-3-days",label:"1–3 hari"},{value:"4-7-days",label:"4–7 hari"},{value:"more-than-week",label:"> 1 minggu"}
] as const;
