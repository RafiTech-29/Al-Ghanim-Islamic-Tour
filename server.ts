import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initializer for Google GenAI client
let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    try {
      genAIClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return genAIClient;
}

const ALGHANIM_SYSTEM_INSTRUCTION = `
Anda adalah "Spiritual Concierge AI" — Asisten Konsultasi Resmi dan Cerdas dari ALGHANIM Islamic Tour & Mandala 525 Garut (@mandala525islamictour).

TUGAS UTAMA:
- Menjawab pertanyaan calon jamaah dan pengunjung seputar pendaftaran Umroh & Haji, paket, harga, persyaratan paspor/visa, jadwal keberangkatan, manasik, fasilitas hotel, maskapai, program tabungan syariah, badal umroh, dan lokasi kantor resmi Al-Ghanim secara akurat, responsif, dan kontekstual.
- JANGAN PERNAH mengulang-ulang template jawaban yang sama. Pahami pertanyaan pengguna secara mendalam dan jawab tepat pada inti pertanyaannya. Jika percakapan berlanjut (multi-turn), sambungkan konteks sebelumnya (misalnya pengguna sebelumnya tanya cara daftar, lalu menyebut 'garut', maka jelaskan cara daftar langsung ke kantor Mandala Garut atau melalui WA Garut).

INFORMASI RESMI PERUSAHAAN (KNOWLEDGE BASE ALGHANIM):
1. LEGALITAS & REPUTASI:
   - PT. Al-Ghanimah Berkah Bersama (Supported by Mandala 525 Islamic Tour).
   - Izin Resmi PPIU Kemenag RI: PPIU No. 1030 Tahun 2019 / SK Kemenag No. U.412/2021 (Terakreditasi "A" BAN PPIU).
   - Terintegrasi sistem SISKOPATUH Kemenag RI & Anggota Resmi SAPUHI (No. 082/DPP/2021).
   - Berpengalaman sejak 2013, telah memberangkatkan lebih dari 10.000+ jamaah ke Tanah Suci.

2. LOKASI KANTOR RESMI & KONTAK:
   - KANTOR CABANG GARUT (Mandala Umroh):
     * Alamat: Jl. Sudirman Copong Garut, Sukamentri, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44116.
     * Telepon: (0262) 4890731 / Hotline WA: 0813-1670-218.
     * Jam Operasional: Senin – Sabtu: 08.30 – 17.00 WIB.
     * Konsultan: Ustadz Wildan Firdaus, S.Pd.I. & Tim Mandala 525.
   - KANTOR CABANG KOTA BANDUNG:
     * Alamat: Jl. Soekarno Hatta No. 590, Sekejati, Buahbatu, Kota Bandung, Jawa Barat 40286.
     * Jam Operasional: Senin – Sabtu: 09.00 – 17.30 WIB.
     * Telepon/WA: 0813-1670-218.
   - KANTOR PUSAT JAKARTA:
     * Alamat: Gedung Menara Kadin Indonesia Lt. 12, Jl. H.R. Rasuna Said Blok X-5 Kav. 2-3, Kuningan Timur, Setiabudi, Jakarta Selatan 12950.
     * Telepon/WA: 0813-1670-218.
   - HOTLINE WHATSAPP NASIONAL RESMI: 0813-1670-218 (Layanan 24 Jam).

3. PAKET IBADAH & PROGRAM UTAMA:
   - Umroh Reguler (OT) 9 & 12 Hari: Mulai Rp 28,9 Jt (Direct Saudia / Garuda Indonesia, Hotel Bintang 4/5 dekat 50m ke pelataran Haram/Nabawi seperti Swissotel / Pullman Zamzam / Rove / Dallah Taibah, makan 3x menu Indonesia, gratis air zam-zam 5L, koper fiber 24", muthawwif lulusan Madinah/Al-Azhar).
   - Umroh Jum'atain 12 Hari: Rp 34,5 Jt (Mendapatkan 2x Shalat Jum'at di Masjid Nabawi & Masjidil Haram).
   - Umroh Custom VIP Private (PT): Bespoke / Sesuai Permintaan (Jadwal bebas, mobil VIP GMC Yukon / Toyota Alphard, Suite View Ka'bah, 1 Muthawwif khusus keluarga).
   - Program Badal Umroh Amanah: Rp 2.500.000 / Jiwa (Dilaksanakan oleh asatidz/penuntut ilmu di Makkah & Madinah, 1 pelaksana untuk 1 nama almarhum/sakit berat, dapat sertifikat berbingkai, video dokumentasi niat & thawaf, serta air zam-zam 5L).
   - Program Tabungan Umroh Syariah: Setoran awal mulai Rp 5 Jt (mengunci seat), cicilan fleksibel 6 - 36 bulan (mulai Rp 800rb/bulan), akad wadiah & mudharabah syariah bebas riba bekerjasama dengan Bank Syariah.
   - Haji Furoda / Mujamalah VVIP: USD $19.500 (Langsung berangkat tahun berjalan tanpa antri, Visa Haji Mujamalah resmi Kerajaan Saudi, Maktab VVIP Mina/Arafah ber-AC & kasur springbed).
   - Haji Khusus PIHK Kuota Resmi Kemenag: USD $12.500 (Masa tunggu 5-7 tahun, Nomor Porsi resmi SISKOPATUH).

4. PERSYARATAN & CARA DAFTAR UMROH DI ALGHANIM:
   - Langkah Pendaftaran:
     1. Konsultasi & Pilih Paket: Tentukan tanggal keberangkatan dan jenis kamar (Quad/Triple/Double).
     2. Booking Seat & Pembayaran DP: Cukup DP awal Rp 5 - 10 Juta untuk mengunci nomor kursi penerbangan dan kamar hotel.
     3. Penyerahan Dokumen: Serahkan paspor asli (min. berlaku 7 bulan, nama min. 2 kata), copy KTP, KK, Buku Nikah (jika suami istri), dan pasfoto 4x6 latar belakang putih fokus 80%. (Bisa diantar ke kantor Copong Garut / Bandung / Jakarta atau dikirim via kurir aman).
     4. Bimbingan Manasik: Mengikuti sesi manasik teori dan praktik di hotel/kantor sebelum keberangkatan.
     5. Pelunasan & Penerbitan Visa: Pelunasan biaya sisa maksimal 1 bulan sebelum jadwal terbang. Visa Umroh diterbitkan secara resmi.
     6. Keberangkatan: Kumpul di Lounge Eksekutif Bandara Soekarno Hatta Terminal 3, siap terbang langsung ke Madinah/Jeddah.
   - Kebijakan Usia & Mahram: Tidak ada batasan umur (anak & lansia bisa berangkat). Wanita diperbolehkan berangkat tanpa mahram sesuai peraturan resmi otoritas Arab Saudi terkini.
   - Portal Jamaah: Jamaah yang sudah terdaftar bisa melacak progres visa, paspor, koper, dan jadwal manasik secara transparan di website Al-Ghanim pada menu "Portal Jamaah" hanya dengan memasukkan NIJ, KTP, atau No. WA.

GAYA KOMUNIKASI:
- Bahasa Indonesia yang santun, ramah, profesional, Islami, hangat, dan solutif.
- Gunakan format markdown yang rapi (poin-poin tebal/bullet points) agar nyaman dibaca.
- Jawab langsung inti pertanyaan pengguna.
`;

// Dynamic Knowledge-Based Contextual Engine
function generateKnowledgeBaseReply(message: string, history: Array<{ sender?: string; text?: string }> = []): string {
  const lower = message.toLowerCase().trim();
  
  // Look at last messages in history for conversational context
  const previousUserMessages = (history || [])
    .filter(m => m && m.sender === 'user')
    .map(m => (m.text || '').toLowerCase());
  const lastUserTopic = previousUserMessages.length > 1 ? previousUserMessages[previousUserMessages.length - 2] : '';

  // 1. KEMITRAAN & KEAGENAN (Mitra, Agen, Syiar, Kerjasama, Reseller, Buka Cabang)
  if (
    lower.includes("mitra") || 
    lower.includes("agen") || 
    lower.includes("keagenan") || 
    lower.includes("reseller") || 
    lower.includes("syiar") || 
    lower.includes("kerjasama") || 
    lower.includes("komisi") || 
    lower.includes("buka cabang") || 
    lower.includes("representative") ||
    lower.includes("gabung kemitraan")
  ) {
    return `**Program Kemitraan & Keagenan Syiar ALGHANIM (Mandala 525):**\n\nALGHANIM membuka peluang bagi para asatidz, tokoh masyarakat, pimpinan majelis ta'lim, pimpinan pondok pesantren, instansi, maupun perorangan untuk menjadi **Mitra Syiar Baitullah Resmi**:\n\n🌟 **Pilihan Model Kemitraan:**\n1. **Mitra Syiar Perorangan / Agen Referral:**\n   • Mendapatkan ujrah/komisi syiar berkah hingga **Rp 1.500.000 – Rp 2.500.000 per jamaah** yang diberangkatkan.\n   • Gratis bimbingan berkala, materi promosi (flyer digital, katalog fisik, video dokumentasi).\n   • Reward program: Berangkat Umroh GRATIS dengan akumulasi target jamaah tertentu.\n\n2. **Mitra Kantor Cabang Representatif:**\n   • Hak pembukaan kantor perwakilan resmi di kecamatan/kabupaten (khususnya wilayah Jawa Barat & sekitarnya).\n   • Didukung legalitas PPIU Kemenag Akreditasi "A" & sistem SISKOPATUH terintegrasi.\n\n📝 **Cara & Syarat Menjadi Mitra:**\n• Cukup mengisi formulir pendaftaran kemitraan di menu website **"Kemitraan"** atau menghubungi Tim Kemitraan Mandala 525 Garut.\n• Syarat: KTP, No. WA aktif, dan komitmen syiar amanah sesuai Sunnah.\n\n📞 **Hotline Khusus Kemitraan:** Hubungi kami via WhatsApp di **0813-1670-218** (Ketuk tombol Follow Up / WA) atau datang ke Kantor Mandala Copong Garut.`;
  }

  // 2. BADAL UMROH & HAJI
  if (lower.includes("badal") || lower.includes("almarhum") || lower.includes("gantikan orang tua")) {
    return `**Program Badal Umroh Amanah ALGHANIM:**\n\nProgram pelaksanaan Umroh bagi orang tua/keluarga yang telah wafat atau menderita sakit fisik berat (udzur syar'i permanen).\n\n• 💰 **Biaya:** **Rp 2.500.000 / Jiwa** (Amanah & Transparan).\n• 👳‍♂️ **Pelaksana:** Asatidz dan penuntut ilmu syar'i mukim di Makkah & Madinah (1 pelaksana mendedikasikan ihram khusus untuk 1 nama almarhum/jamaah).\n• 📜 **Fasilitas untuk Keluarga di Indonesia:**\n  1. Sertifikat Badal Umroh resmi berbingkai elegan.\n  2. Video dokumentasi saat pelafalan niat ihram di Miqat dan proses pelaksanaan Thawaf & Sa'i.\n  3. Gratis 5 Liter Air Zam-zam asli dikirimkan ke alamat rumah keluarga.\n\n*Pendaftaran badal umroh dibuka setiap bulan. Silakan hubungi konsultan kami di **0813-1670-218**.*`;
  }

  // 3. TABUNGAN UMROH SYARIAH & SIMULASI CICILAN
  if (lower.includes("tabung") || lower.includes("nabung") || lower.includes("cicil") || lower.includes("angsuran") || lower.includes("wadiah") || lower.includes("mudharabah")) {
    return `**Program Tabungan Umroh Syariah ALGHANIM:**\n\nSolusi menabung ibadah ke Tanah Suci secara terencana, aman, dan murni syariah:\n\n• 🛡️ **Akad Syariah Murni:** Menggunakan akad *Wadiah Yad Dhamanah* & *Mudharabah* (100% bebas bunga/riba, bebas denda, dan tanpa sita).\n• 🔑 **Setoran Awal Ringan:** Mulai dari **Rp 5.000.000** (langsung mengunci kuota kursi penerbangan & proteksi kenaikan kurs).\n• 📆 **Pilihan Tenor Fleksibel:**\n  - 6 Bulan : ± Rp 4.000.000 / bulan\n  - 12 Bulan : ± Rp 2.000.000 / bulan\n  - 24 Bulan : ± Rp 1.050.000 / bulan\n  - 36 Bulan : ± Rp 750.000 - Rp 800.000-an / bulan\n• 🏦 **Keamanan Dana:** Rekening penampungan khusus Bank Syariah (BSI & Muamalat).\n\n*Simulasi detail dan pembukaan rekening tabungan dapat dibantu langsung melalui konsultan di Garut via WA **0813-1670-218**.*`;
  }

  // 4. HAJI FURODA & HAJI KHUSUS
  if (lower.includes("furoda") || lower.includes("mujamalah") || lower.includes("haji khusus") || lower.includes("pihk") || (lower.includes("haji") && !lower.includes("umroh"))) {
    return `**Program Haji Resmi ALGHANIM (Musim Haji 1447H):**\n\n1. 🕋 **Haji Furoda / Mujamalah VVIP (USD $19.500):**\n   • **Langsung Berangkat Tahun Ini:** Tanpa antre / tanpa masa tunggu bertahun-tahun.\n   • **Legalitas:** Menggunakan Visa Haji Mujamalah resmi Kerajaan Arab Saudi (Tercatat resmi di e-Hajj Kementerian Haji Saudi).\n   • **Fasilitas:** Hotel Bintang 5 depan Masjidil Haram & Nabawi, Tenda Maktab VVIP di Mina & Arafah ber-AC dingin dengan kasur springbed, dokter pendamping, dan pembimbing ibadah sunnah.\n\n2. 🕌 **Haji Khusus PIHK Kuota Kemenag (USD $12.500):**\n   • Nomor Porsi resmi SISKOPATUH Kementerian Agama RI.\n   • Masa tunggu lebih singkat (5–7 tahun) dengan fasilitas hotel bintang 5.\n\n*Konsultasi pendaftaran Haji Furoda dapat menghubungi WhatsApp VIP di **0813-1670-218**.*`;
  }

  // 5. LOKASI KANTOR (GARUT / COPONG / BANDUNG / JAKARTA)
  if (lower === "garut" || lower.includes("garut") || lower.includes("copong") || lower.includes("mandala")) {
    if (lastUserTopic.includes("daftar") || lastUserTopic.includes("gimana") || lastUserTopic.includes("cara")) {
      return `**Pendaftaran Langsung di Kantor Cabang Garut (Mandala 525):**\n\n📍 **Alamat:** Jl. Sudirman Copong Garut, Sukamentri, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44116\n📞 **Hotline WA:** **0813-1670-218** / Telp: (0262) 4890731\n⏰ **Jam Buka:** Senin – Sabtu: 08.30 – 17.00 WIB\n👳‍♂️ **Konsultan Ibadah:** Ustadz Wildan Firdaus & Tim Mandala 525\n\n**Dokumen Cukup Dibawa:**\n1. KTP & Kartu Keluarga (KK)\n2. Paspor Asli (jika sudah ada)\n3. Uang Muka (DP) mulai Rp 5.000.000 untuk kunci seat penerbangan\n\n*Tim kami di Copong Garut siap melayani bimbingan pengurusan paspor, penyerahan koper, dan konsultasi manasik.*`;
    }
    return `**Kantor Operasional Cabang Garut (Mandala Umroh):**\n\n🏢 **Alamat:** Jl. Sudirman Copong Garut, Sukamentri, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44116\n📞 **Hotline WhatsApp:** **0813-1670-218**\n☎️ **Telepon Kantor:** (0262) 4890731\n⏰ **Jam Buka:** Senin – Sabtu: 08.30 – 17.00 WIB\n👳‍♂️ **Konsultan:** Ustadz Wildan Firdaus, S.Pd.I. & Tim Mandala 525 (@mandala525islamictour)\n\n*Fasilitas kantor: Konsultasi tatap muka, display koper & seragam, pembuatan surat rekomendasi paspor Kemenag, dan bimbingan manasik.*`;
  }

  if (lower === "bandung" || lower.includes("bandung")) {
    return `**Kantor Cabang Bandung ALGHANIM:**\n\n🏢 **Alamat:** Jl. Soekarno Hatta No. 590, Sekejati, Buahbatu, Kota Bandung, Jawa Barat 40286\n📞 **Hotline WhatsApp:** **0813-1670-218**\n⏰ **Jam Operasional:** Senin – Sabtu: 09.00 – 17.30 WIB\n\n*Melayani konsultasi, pendaftaran, dan penyerahan berkas bagi jamaah wilayah Bandung Raya & Priangan.*`;
  }

  if (lower === "jakarta" || lower.includes("jakarta") || lower.includes("pusat")) {
    return `**Kantor Pusat Jakarta ALGHANIM:**\n\n🏢 **Alamat:** Gedung Menara Kadin Indonesia Lt. 12, Jl. H.R. Rasuna Said Blok X-5 Kav. 2-3, Kuningan Timur, Jakarta Selatan 12950\n📞 **Hotline WhatsApp:** **0813-1670-218**\n📜 **Legalitas:** PT. Al-Ghanimah Berkah Bersama — Izin PPIU No. 1030 Tahun 2019 (Akreditasi A).`;
  }

  // 6. SYARAT, PASPOR, DOKUMEN & VISA
  if (
    lower.includes("syarat") || 
    lower.includes("paspor") || 
    lower.includes("dokumen") || 
    lower.includes("visa") || 
    lower.includes("mahram") || 
    lower.includes("buku nikah") || 
    lower.includes("rekomendasi") ||
    lower.includes("foto") ||
    lower.includes("usia")
  ) {
    return `**Persyaratan Dokumen Pendaftaran Umroh ALGHANIM:**\n\n1. **Paspor Asli:** Masa berlaku minimal 7 bulan sebelum tanggal keberangkatan, nama minimal 2 suku kata (contoh: *Ahmad Fauzi*).\n2. **Salinan KTP & Kartu Keluarga (KK).**\n3. **Pasfoto Terbaru:** Ukuran 4x6 sebanyak 2 lembar, latar belakang putih, fokus wajah 80%.\n4. **Buku Nikah Asli/Copy:** Bagi pasangan suami-istri.\n5. **BPJS Kesehatan Aktif.**\n\n💡 **Ketentuan Otoritas Saudi Terkini:**\n• Jamaah wanita diperbolehkan berangkat **tanpa mahram**.\n• Tidak ada batasan usia (anak-anak dan lansia diperbolehkan berangkat).\n• ALGHANIM menyediakan **Surat Rekomendasi Resmi Kemenag** untuk pengurusan paspor baru di Kantor Imigrasi.`;
  }

  // 7. HOTEL, AKOMODASI & MAKANAN
  if (
    lower.includes("hotel") || 
    lower.includes("jarak") || 
    lower.includes("dekat") || 
    lower.includes("makkah") || 
    lower.includes("madinah") || 
    lower.includes("akomodasi") || 
    lower.includes("katering") || 
    lower.includes("makan") || 
    lower.includes("swissotel") || 
    lower.includes("pullman")
  ) {
    return `**Fasilitas Hotel & Akomodasi Bintang 5 ALGHANIM:**\n\n🕋 **Makkah (Bintang 5 — Jarak 50 Meter / Depan Pelataran):**\n• Swissotel Makkah / Pullman Zamzam Tower / Movenpick Hajar di kawasan Clock Tower Masjidil Haram. Akses mudah langsung ke pelataran Thawaf.\n\n🕌 **Madinah (Bintang 4 & 5 — Jarak 50 - 100 Meter):**\n• Rove Madinah / Dallah Taibah / Grand Plaza dekat pintu masuk utama Raudhah & Masjid Nabawi.\n\n🍱 **Katering:** 3x sehari full-board masakan khas Indonesia (Nusantara) yang higienis, lezat, dan bergizi seimbang.`;
  }

  // 8. HARGA, BIAYA & PAKET
  if (
    lower.includes("harga") || 
    lower.includes("biaya") || 
    lower.includes("biayanya") || 
    lower.includes("ongkos") || 
    lower.includes("paket reguler") || 
    lower.includes("berapa") || 
    lower.includes("promo") || 
    lower.includes("jumatain")
  ) {
    return `**Daftar Paket & Rincian Biaya Umroh ALGHANIM (Musim 1447H/2026):**\n\n1. 🕋 **Umroh Reguler (9 Hari):** Mulai **Rp 28.900.000**\n   • Penerbangan Direct Saudia / Garuda Indonesia\n   • Hotel Bintang 4/5 (50-100m ke Masjidil Haram & Nabawi)\n\n2. 🕌 **Umroh Jum'atain (12 Hari):** Mulai **Rp 34.500.000**\n   • Merasakan 2x Shalat Jum'at di Tanah Suci (1x Makkah, 1x Madinah)\n\n3. 👑 **Umroh VIP Bintang 5 (Bespoke):** By Request\n   • Suite Room View Ka'bah & Mobil Eksekutif GMC Yukon / Alphard\n\n4. 🤲 **Badal Umroh Amanah:** **Rp 2.500.000 / Jiwa**\n   • Sertifikat + Video dokumentasi + Air Zam-zam 5L\n\n5. 💰 **Tabungan Umroh Syariah:** Setoran awal **Rp 5.000.000**, cicilan mulai Rp 800rb/bulan\n\n*Semua paket sudah termasuk: Tiket Pesawat PP, Visa Umroh, Hotel Bintang 5, Makan 3x Menu Indonesia, Koper Fiber 24", Seragam, Air Zamzam 5L, & Muthawwif Ahli Sunnah.*`;
  }

  // 9. JADWAL KEBERANGKATAN & BULAN
  if (
    lower.includes("jadwal") || 
    lower.includes("kapan") || 
    lower.includes("keberangkatan") || 
    lower.includes("bulan") || 
    lower.includes("tanggal") || 
    lower.includes("ramadhan") || 
    lower.includes("syawal")
  ) {
    return `**Jadwal Keberangkatan Umroh ALGHANIM:**\n\n• **Paket Syawal & Pasca-Lebaran:** Seat tersedia (Direct Saudia).\n• **Paket Awal Musim 1447 H:** Tersedia keberangkatan setiap bulan (Pilihan 9 Hari & 12 Hari).\n• **Paket Akhir Tahun & Liburan Sekolah:** Seat favorit keluarga, pendaftaran dibuka sekarang.\n• **Paket Ramadhan (Awal/Tengah/Lailatul Qadr):** Tersedia program iktikaf 10 hari terakhir.\n\n*Untuk melihat kepastian tanggal penerbangan atau memilih jadwal khusus, hubungi konsultan kami di WhatsApp **0813-1670-218**.*`;
  }

  // 10. CARA DAFTAR UMROH (Sebagai Calon Jamaah)
  if (
    lower.includes("daftar umroh") || 
    lower.includes("cara daftar") || 
    lower.includes("gimana cara daftar") || 
    lower.includes("alur pendaftaran") || 
    lower.includes("prosedur pendaftaran") || 
    lower.includes("booking seat") ||
    lower.includes("kunci seat")
  ) {
    return `**Tata Cara & Alur Pendaftaran Umroh di ALGHANIM:**\n\n1. **Pilih Paket & Tanggal:** Tentukan program (Reguler 9/12 hari, VIP Bintang 5, atau Tabungan Syariah).\n2. **Booking Seat & DP:** Setorkan uang muka (DP) mulai dari Rp 5.000.000 untuk mengunci nomor kursi penerbangan dan kamar hotel.\n3. **Serahkan Dokumen:** Paspor asli (masa berlaku min. 7 bulan, min. 2 kata), salinan KTP, KK, dan pasfoto 4x6 latar belakang putih (fokus wajah 80%).\n4. **Bimbingan Manasik:** Ikuti bimbingan manasik intensif sesuai Sunnah di Garut / Bandung.\n5. **Pelunasan & Berangkat:** Pelunasan biaya maksimal H-30 sebelum keberangkatan, lalu kumpul di Terminal 3 Bandara Soekarno Hatta.\n\n📍 *Bisa mendaftar langsung di Kantor Cabang Garut (Jl. Sudirman Copong) atau online via WhatsApp di **0813-1670-218**.*`;
  }

  // 11. FASILITAS & PERLENGKAPAN
  if (lower.includes("koper") || lower.includes("perlengkapan") || lower.includes("seragam") || lower.includes("zamzam") || lower.includes("fasilitas")) {
    return `**Fasilitas & Perlengkapan Jamaah ALGHANIM:**\n\n🎁 **Perlengkapan Eksklusif yang Diterima:**\n• Koper Fiber Hardcase 24" Premium\n• Tas Selempang & Tas Sandal\n• Kain Ihram + Sabuk (Jamaah Pria) / Mukena & Bergo (Jamaah Wanita)\n• Bahan Batik Seragam Resmi Al-Ghanim\n• Buku Panduan Doa & Manasik Saku\n• Syal / ID Card Barcode Jamaah\n• Air Zam-zam 5 Liter (Gratis dibagikan saat tiba di tanah air)\n• Akses Lounge Eksekutif Bandara Soekarno Hatta T3.`;
  }

  // 12. LEGALITAS & KEAMANAN
  if (lower.includes("legalitas") || lower.includes("izin") || lower.includes("resmi") || lower.includes("kemenag") || lower.includes("ppiu") || lower.includes("akreditasi") || lower.includes("siskopatuh") || lower.includes("sapuhi")) {
    return `**Legalitas & Reputasi Resmi ALGHANIM:**\n\n🏛️ **PT. Al-Ghanimah Berkah Bersama (Mandala 525 Garut):**\n• **Izin PPIU Kemenag RI:** No. 1030 Tahun 2019 / SK Kemenag No. U.412/2021\n• **Akreditasi:** Terakreditasi **"A"** oleh Badan Akreditasi Nasional PPIU\n• **Sistem Resmi:** Terintegrasi langsung dengan **SISKOPATUH** Kemenag RI\n• **Asosiasi:** Anggota Resmi SAPUHI (No. 082/DPP/2021)\n• **Pengalaman:** Telah melayani sejak 2013 dan memberangkatkan lebih dari 10.000+ jamaah ke Tanah Suci secara amanah dan tepat waktu.`;
  }

  // 13. PORTAL JAMAAH
  if (lower.includes("portal") || lower.includes("cek status") || lower.includes("lacak") || lower.includes("nij")) {
    return `**Portal Transparansi Jamaah ALGHANIM:**\n\nBagi jamaah yang sudah terdaftar, Anda dapat memantau seluruh progres keberangkatan secara transparan melalui menu **"Portal Jamaah"** di website ini:\n\n🔍 **Yang Bisa Dicek:**\n• Status verifikasi Paspor & Kemenag\n• Status penerbitan Visa Umroh resmi Kerajaan Saudi\n• Jadwal & lokasi bimbingan Manasik\n• Status pengiriman koper & perlengkapan ibadah\n• Rincian nomor kamar hotel dan penerbangan\n\n*Cukup masukkan Nomor Induk Jamaah (NIJ), NIK KTP, atau Nomor WhatsApp terdaftar.*`;
  }

  // 14. KONTAK & CS
  if (lower.includes("kontak") || lower.includes("wa") || lower.includes("whatsapp") || lower.includes("telepon") || lower.includes("call center") || lower.includes("cs")) {
    return `**Kontak Resmi ALGHANIM & Mandala 525 Garut:**\n\n📱 **Hotline WhatsApp Resmi (24 Jam):** **0813-1670-218**\n☎️ **Telepon Kantor Garut:** (0262) 4890731\n📍 **Kantor Garut:** Jl. Sudirman Copong Garut, Sukamentri, Kec. Garut Kota, Garut 44116\n📍 **Kantor Bandung:** Jl. Soekarno Hatta No. 590, Sekejati, Buahbatu, Kota Bandung\n\n*Konsultan kami siap membantu konsultasi ibadah, cek paspor, dan simulasi biaya.*`;
  }

  // 15. SALAM & SAPAAN
  if (lower.includes("assalamu") || lower === "halo" || lower === "hai" || lower === "selamat pagi" || lower === "selamat siang" || lower === "selamat malam") {
    return `Assalamu'alaikum warahmatullah wabarakatuh. Selamat datang di **Spiritual Concierge ALGHANIM & Mandala 525 Garut**.\n\nAda yang bisa kami bantu seputar:\n• 🌟 **Peluang Kemitraan / Agen Syiar**\n• 🕋 **Pendaftaran & Pilihan Paket Umroh / Haji**\n• 💰 **Simulasi Tabungan Umroh Syariah**\n• 🤲 **Program Badal Umroh Amanah**\n• 📍 **Alamat Kantor Garut (Copong), Bandung, atau Jakarta**?`;
  }

  // Default intelligent contextual fallback
  return `Assalamu'alaikum warahmatullah. Terima kasih atas pertanyaan Anda seputar **"${message}"**.\n\n**ALGHANIM Islamic Tour & Mandala 525 Garut** siap melayani:\n\n• 🌟 **Program Kemitraan & Agen:** Ujrah syiar berkah & bimbingan kemitraan cabang.\n• 🕋 **Paket Ibadah:** Umroh Reguler 9/12 Hari (Direct Saudia, Bintang 5), VIP Ka'bah View, Badal Umroh, & Tabungan Syariah.\n• 🏢 **Kantor Operasional Garut:** Jl. Sudirman Copong Garut (Hotline WA: **0813-1670-218**).\n\nSilakan ketik pertanyaan spesifik mengenai kemitraan, harga paket, syarat paspor, atau lokasi kantor kami.`;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "alghanim-backend" });
});

// Concierge Chat Endpoint
app.post("/api/concierge/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Pesan tidak boleh kosong." });
  }

  const ai = getGenAI();

  // 1. Try Gemini API first if client exists
  if (ai) {
    try {
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.text) {
            const role = item.sender === "user" ? "user" : "model";
            contents.push({
              role,
              parts: [{ text: item.text }],
            });
          }
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      let response: any = null;
      const candidateModels = ["gemini-flash-latest", "gemini-3.7-flash", "gemini-3.1-flash-lite"];
      
      for (const modelName of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: ALGHANIM_SYSTEM_INSTRUCTION,
              temperature: 0.7,
              topP: 0.95,
            },
          });
          if (response && response.text) {
            break;
          }
        } catch (modelErr: any) {
          // If project denied / 403 / 404, don't throw, attempt next model or seamless knowledge engine fallback
          if (modelErr?.status === "PERMISSION_DENIED" || modelErr?.status === 403) {
            // Permission denied indicates API key / quota restrictions on current cloud project; break early to knowledge engine
            break;
          }
        }
      }

      if (response && response.text) {
        return res.json({
          reply: response.text,
          source: "gemini-ai",
        });
      }
    } catch (apiErr) {
      // Graceful fallback to knowledge base
    }
  }

  // 2. Fallback to Dynamic Knowledge-Based Contextual Engine
  try {
    const contextualReply = generateKnowledgeBaseReply(message, history);
    return res.json({
      reply: contextualReply,
      source: "knowledge-engine",
    });
  } catch (err) {
    console.error("Error in fallback reply generator:", err);
    return res.json({
      reply: `Assalamu'alaikum warahmatullah. Terima kasih atas pertanyaan Anda. Untuk konsultasi paket Umroh & Haji Al-Ghanim (Mandala 525 Garut), silakan hubungi hotline WhatsApp resmi kami di **0813-1670-218** atau kunjungi kantor kami di Jl. Sudirman Copong Garut.`,
      source: "static-fallback",
    });
  }
});

// Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ALGHANIM Server running on:`);
    console.log(`  > Local:   http://localhost:${PORT}`);
    console.log(`  > Network: http://127.0.0.1:${PORT}`);
  });
}

startServer();
