import React from 'react';
import { 
  Printer, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  MessageSquare, 
  Users, 
  Package, 
  Image as ImageIcon, 
  FileText, 
  Key, 
  Award, 
  HelpCircle,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';
import { AlGhanimLogo } from '../AlGhanimLogo';
import { OFFICIAL_WA_NUMBER } from '../../data/packagesData';

export const AdminUserGuide: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#A67C52]/10 text-[#A67C52] text-[11px] font-bold uppercase tracking-wider">
              Buku Panduan Penggunaan Resmi
            </span>
            <span className="text-xs text-gray-500">• Standar Operasional Staf Al-Ghanim</span>
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            Buku Panduan &amp; Manual Operasional Admin CMS
          </h2>
          <p className="text-xs text-gray-500">
            Panduan lengkap langkah-demi-langkah bagi staf operasional Al-Ghanim untuk mengelola data jamaah, leads, paket umroh/haji, dan banner promo tanpa perlu koding.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-3 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2 flex-shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF Panduan</span>
        </button>
      </div>

      {/* DOCUMENT CONTAINER (PRINT-OPTIMIZED) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-10 print-full-width">
        
        {/* KOP SURAT RESMI */}
        <div className="border-b-2 border-[#A67C52] pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AlGhanimLogo variant="light" size="md" showText={false} />
            <div>
              <h1 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-wide">
                PT. AL-GHANIMAH BERKAH BERSAMA
              </h1>
              <p className="text-xs font-bold text-[#A67C52] tracking-wider uppercase">
                ALGHANIM ISLAMIC TOUR &amp; TRAVEL • SUPPORTED BY MANDALA 525
              </p>
              <p className="text-[11px] text-gray-600">
                Izin PPIU Kemenag RI No. U.444 / 2021 | Terakreditasi "A" | Anggota SAPUHI &amp; IATA
              </p>
              <p className="text-[10px] text-gray-500">
                Kantor Pusat: Jl. Jend. Sudirman No. 525 (Mandala 525), Garut - Jawa Barat | WA: {OFFICIAL_WA_NUMBER}
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider border border-gray-200">
              Dokumen Panduan Teknis (SOP)
            </span>
            <p className="text-[10px] text-gray-400 mt-1">Edisi: 2026 / 2027</p>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center space-y-2">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
            BUKU PANDUAN PENGGUNAAN SISTEM KONTROL &amp; CMS AL-GHANIM
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
            Pedoman Standar Operasional Pengelolaan Website, Katalog Paket Umroh/Haji, Banner Promo, dan Portal Transparansi Jamaah Pasca-Magang.
          </p>
        </div>

        {/* BAB 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="w-7 h-7 rounded-lg bg-[#A67C52] text-white flex items-center justify-center text-xs font-bold">1</span>
            <h3 className="font-bold text-base text-[#1A1A1A]">
              BAB I: Akses Masuk &amp; Keamanan Staf Operasional
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-700 space-y-2 leading-relaxed pl-9">
            <p>
              Sistem Admin Dashboard ALGHANIM dirancang agar dapat diakses kapan pun dari HP maupun Laptop staf tanpa perlu instalasi aplikasi tambahan.
            </p>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <p><strong>1. Cara Akses Menu Admin:</strong></p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
                <li>Klik tombol <strong>"Admin CMS"</strong> di navigasi bar atas / footer website.</li>
                <li>Atau gunakan jalan pintas keyboard cepat: tekan kombinasi <code className="font-bold bg-white px-1.5 py-0.5 rounded border">Ctrl + Shift + A</code> (Windows) atau <code className="font-bold bg-white px-1.5 py-0.5 rounded border">Cmd + Shift + A</code> (Mac).</li>
                <li>Atau tambahkan akhiran <code className="font-bold bg-white px-1.5 py-0.5 rounded border">#admin</code> di akhir alamat website.</li>
              </ul>
              <p className="pt-2"><strong>2. Kata Sandi Staf Resmi:</strong></p>
              <p className="text-gray-600 pl-2">
                Gunakan kata sandi: <code className="font-bold text-[#A67C52] bg-white px-2 py-0.5 rounded border border-[#A67C52]/30">alghanim2026</code> atau <code className="font-bold text-[#A67C52] bg-white px-2 py-0.5 rounded border border-[#A67C52]/30">garut525</code>.
              </p>
            </div>
          </div>
        </section>

        {/* BAB 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="w-7 h-7 rounded-lg bg-[#A67C52] text-white flex items-center justify-center text-xs font-bold">2</span>
            <h3 className="font-bold text-base text-[#1A1A1A]">
              BAB II: Pengelolaan Progres Jamaah (5 Tahap Transparansi)
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-700 space-y-2 leading-relaxed pl-9">
            <p>
              Portal Transparansi Jamaah adalah fitur unggulan ALGHANIM di mana jamaah yang telah mendaftar dapat memeriksa kepastian keberangkatan secara mandiri menggunakan Nomor Induk Jamaah (NIJ) atau Nomor HP.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="font-bold text-[#A67C52] text-xs">Tahap 1</span>
                <p className="font-semibold text-xs mt-1">Booking &amp; DP</p>
                <p className="text-[10px] text-gray-500 mt-1">Rekam pembayaran DP &amp; terbitkan NIJ resmi.</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="font-bold text-[#A67C52] text-xs">Tahap 2</span>
                <p className="font-semibold text-xs mt-1">Dokumen &amp; Paspor</p>
                <p className="text-[10px] text-gray-500 mt-1">Verifikasi paspor 3 kata nama &amp; buku vaksin.</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="font-bold text-[#A67C52] text-xs">Tahap 3</span>
                <p className="font-semibold text-xs mt-1">Pelunasan &amp; Manasik</p>
                <p className="text-[10px] text-gray-500 mt-1">Rekam pelunasan &amp; jadwal manasik akbar.</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="font-bold text-[#A67C52] text-xs">Tahap 4</span>
                <p className="font-semibold text-xs mt-1">Visa &amp; Tiket Pesawat</p>
                <p className="text-[10px] text-gray-500 mt-1">Input nomor visa Nusuk &amp; e-ticket Saudia/Garuda.</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="font-bold text-[#A67C52] text-xs">Tahap 5</span>
                <p className="font-semibold text-xs mt-1">Siap Berangkat</p>
                <p className="text-[10px] text-gray-500 mt-1">Pengambilan koper, seragam &amp; briefing lounge CGK.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mt-3">
              <strong>Tips Notifikasi Otomatis:</strong> Di samping nama setiap jamaah, terdapat tombol hijau <span className="font-bold">"Kirim Info WA"</span>. Cukup klik tombol tersebut untuk mengirim pesan WhatsApp berformat rapi lengkap dengan link cek progres mandiri jamaah.
            </div>
          </div>
        </section>

        {/* BAB 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="w-7 h-7 rounded-lg bg-[#A67C52] text-white flex items-center justify-center text-xs font-bold">3</span>
            <h3 className="font-bold text-base text-[#1A1A1A]">
              BAB III: Pengelolaan Paket Umroh &amp; Haji (CMS Sederhana Tanpa Koding)
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-700 space-y-2 leading-relaxed pl-9">
            <p>
              <strong>Pertanyaan Penguji Magang &amp; Pimpinan:</strong> <em>"Bagaimana cara update paket tiap bulan/tahun setelah mahasiswa magang selesai?"</em>
            </p>
            <p className="text-gray-600">
              <strong>Jawaban &amp; Solusi:</strong> Seluruh paket di halaman website tidak lagi dikoding secara manual. Admin Al-Ghanim cukup membuka tab <strong>"Kelola Paket Umroh &amp; Haji"</strong> di dashboard admin.
            </p>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5">
              <p className="font-bold text-[#1A1A1A]">Langkah-Langkah Menambah / Mengubah Paket:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-700">
                <li>Klik tombol <strong className="text-[#A67C52]">+ Tambah Paket Baru</strong> (atau klik <strong>Edit</strong> pada paket lama).</li>
                <li>Isi <strong>Judul Paket</strong> (contoh: <em>Umroh Awal Ramadhan 1448 H / 2027</em>).</li>
                <li>Pilih <strong>Kategori</strong> (Reguler, VIP/Custom, Haji Khusus, Tabungan, atau Badal).</li>
                <li>Masukkan <strong>Harga Paket</strong> (contoh: <em>Rp 31.500.000</em>).</li>
                <li>Masukkan <strong>Maskapai</strong> (contoh: <em>Saudia Airlines SV-819 Direct CGK-JED</em>), serta <strong>Hotel Makkah &amp; Madinah</strong>.</li>
                <li>Tentukan <strong>Total Seat</strong> dan <strong>Sisa Seat</strong>. (Jika seat habis, sistem otomatis menandai PENUH).</li>
                <li><strong>Unggah Poster Flyer:</strong> Klik tombol <em>"Pilih Foto dari HP/Laptop"</em> untuk memilih foto brosur baru dari komputer/HP Anda, atau pilih preset Ka'bah/Madinah yang telah tersedia.</li>
                <li>Klik tombol <strong className="text-emerald-700">Terbitkan Paket</strong>. Paket akan langsung tampil secara realtime di beranda &amp; katalog website tanpa perlu me-restart server!</li>
              </ol>
            </div>
          </div>
        </section>

        {/* BAB 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="w-7 h-7 rounded-lg bg-[#A67C52] text-white flex items-center justify-center text-xs font-bold">4</span>
            <h3 className="font-bold text-base text-[#1A1A1A]">
              BAB IV: Penggantian Poster &amp; Banner Promo Bulanan
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-700 space-y-2 leading-relaxed pl-9">
            <p>
              Untuk mengganti materi promo seperti <em>"Promo Umroh Ramadhan"</em>, <em>"Cashback Awal Tahun"</em>, atau <em>"Haji Furoda VVIP"</em>:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-gray-600 pl-2">
              <li>Buka tab <strong>"Banner Promo Bulanan"</strong> di Admin Dashboard.</li>
              <li>Klik tombol <strong>"+ Upload Poster Promo Baru"</strong>.</li>
              <li>Isi judul promosi, rincian diskon/cashback, dan tanggal batas akhir promosi.</li>
              <li>Pilih file foto flyer promosi dari HP atau laptop Anda.</li>
              <li>Klik tombol <strong>"Terbitkan Poster"</strong>. Poster akan langsung aktif dan dapat di-toggle On/Off kapan saja.</li>
            </ol>
          </div>
        </section>

        {/* BAB 5 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="w-7 h-7 rounded-lg bg-[#A67C52] text-white flex items-center justify-center text-xs font-bold">5</span>
            <h3 className="font-bold text-base text-[#1A1A1A]">
              BAB V: Penanganan Leads Konsultasi &amp; Pendaftaran Mitra
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-700 space-y-2 leading-relaxed pl-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <h4 className="font-bold text-xs text-[#1A1A1A]">A. Leads Pesan Masuk (Tab Inquiries):</h4>
                <p className="text-[11px] text-gray-600">
                  Setiap calon jamaah yang mengisi form konsultasi, mengunduh e-Brosur, atau bertanya ke AI Concierge akan otomatis tercatat di sini lengkap dengan nomor WA, waktu, dan paket yang diminati. Staf cukup klik <em>"Hubungi WA"</em> untuk follow up.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <h4 className="font-bold text-xs text-[#1A1A1A]">B. Pendaftaran Mitra (Tab Kemitraan):</h4>
                <p className="text-[11px] text-gray-600">
                  Ustadz, pimpinan majelis ta'lim, atau perorangan yang mendaftar sebagai Agen/Cabang Syiar Al-Ghanim akan muncul di tab ini untuk diverifikasi berkas dan dihubungi MoU kemitraannya.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BAB 6 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="w-7 h-7 rounded-lg bg-[#A67C52] text-white flex items-center justify-center text-xs font-bold">6</span>
            <h3 className="font-bold text-base text-[#1A1A1A]">
              BAB VI: Checklist Serah Terima &amp; Pembersihan Data Simulasi (Go-Live)
            </h3>
          </div>
          <div className="text-xs sm:text-sm text-gray-700 space-y-3 leading-relaxed pl-9">
            <p>
              Sebelum website dipublikasikan secara penuh ke seluruh jamaah umum dan media sosial Al-Ghanim, tim staf operasional disarankan mengikuti 4 langkah checklist berikut:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>1. Bersihkan Data Simulasi / Contoh</span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  Pada tab <strong>Manifest Jamaah</strong>, klik tombol <em>"Bersihkan Data Contoh"</em>. Pada tab <strong>Pesan &amp; Leads</strong>, klik <em>"Hapus Massal &gt; Hapus Semua"</em>. Database akan bersih dari contoh dummy dan siap menampung pendaftar asli Al-Ghanim.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>2. Sesuaikan Harga &amp; Tanggal Paket</span>
                </div>
                <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                  Buka tab <strong>Katalog Paket (CMS)</strong>. Periksa harga kamar Quad, hotel pelataran Makkah/Madinah, dan maskapai penerbangan (Saudia/Garuda) sesuai ketentuan rilis resmi Al-Ghanim.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0" />
                  <span>3. Perbarui Kata Sandi Staf Admin</span>
                </div>
                <p className="text-[11px] text-blue-900/90 leading-relaxed">
                  Di pojok bawah navigasi admin, klik <em>"Ganti Sandi"</em> untuk menetapkan kata sandi staf resmi internal Al-Ghanim yang aman dan tersimpan di database cloud.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 flex-shrink-0" />
                  <span>4. Uji Formulir Pendaftaran &amp; PDF</span>
                </div>
                <p className="text-[11px] text-purple-900/90 leading-relaxed">
                  Lakukan 1 kali simulasi pendaftaran di website publik: isi form, unduh PDF rincian biaya, dan periksa apakah pesan langsung masuk ke tab Pesan &amp; Leads di Admin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LEMBAR PENGESAHAN / SIGNATURE */}
        <div className="border-t-2 border-gray-200 pt-8 mt-10 print-page-break">
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
              Lembar Pengesahan Serah Terima Sistem Informasi &amp; CMS
            </p>
            <p className="text-sm font-serif-luxury font-bold text-[#1A1A1A]">
              PT. AL-GHANIMAH BERKAH BERSAMA (MANDALA 525 GARUT)
            </p>
            <p className="text-xs text-gray-500">Garut, 30 Agustus 2026</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center pt-4">
            <div className="space-y-16">
              <p className="text-xs text-gray-600 font-semibold">Diserahkan Oleh (Tim Pengembang Magang):</p>
              <div>
                <p className="text-xs font-bold text-[#1A1A1A] underline">TIM MAHASISWA MAGANG IT</p>
                <p className="text-[10px] text-gray-500">Pengembang Sistem &amp; Platform Web Al-Ghanim</p>
              </div>
            </div>

            <div className="space-y-16">
              <p className="text-xs text-gray-600 font-semibold">Diterima &amp; Disahkan Oleh:</p>
              <div>
                <p className="text-xs font-bold text-[#1A1A1A] underline">MANAJEMEN AL-GHANIM ISLAMIC TOUR</p>
                <p className="text-[10px] text-gray-500">PT. Al-Ghanimah Berkah Bersama (Mandala 525)</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
