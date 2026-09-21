import React from 'react';
import jabalUhudRealImg from '../assets/images/jabal_uhud_real_1789544121355.jpg';
import { 
  Award, 
  ShieldCheck, 
  Users, 
  Building2, 
  HeartHandshake, 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  Clock,
  Compass,
  Plane,
  FileText,
  Target,
  Eye,
  BookOpen,
  Headphones,
  CalendarCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { 
  BRAND_TAGLINES, 
  LEGAL_INFO, 
  OFFICES_DATA, 
  OFFICIAL_WA_LINK, 
  OFFICIAL_WA_NUMBER 
} from '../data/packagesData';

interface AboutSectionProps {
  onOpenLegal: () => void;
  onOpenOffices: (city: 'garut' | 'bandung') => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenLegal, onOpenOffices }) => {
  return (
    <div id="tentang-kami-section" className="w-full max-w-full overflow-hidden bg-[#FAFAFA] text-[#1A1A1A] font-sans-luxury scroll-mt-20">
      
      {/* =========================================================================
          HERO BANNER PROFIL: TENTANG KAMI (Dipadatkan di Mobile, Langsung Menempel)
      ========================================================================== */}
      <section className="relative py-8 sm:py-12 md:py-16 bg-[#1A1A1A] border-b border-[#333333] overflow-hidden">
        {/* Background Ambient */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#A67C52_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2A2A2A] border border-[#A67C52]/40 text-[#DFC386] text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm">
            <span>Profil Resmi &amp; Filosofi</span>
          </div>

          <h1 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Tentang ALGHANIM Islamic Tour
          </h1>

          <p className="font-sans-luxury text-xs sm:text-base text-[#D9D9D9] max-w-3xl mx-auto leading-relaxed">
            Penyelenggara Perjalanan Ibadah Umroh resmi Kementerian Agama RI (PT. Al-Ghanimah Berkah Bersama) di bawah naungan bersama <strong>Mandala 525 Islamic Tour</strong>. Lahir dari perenungan di Jabal Uhud untuk menghadirkan umroh yang hemat, layak, dan terpercaya bagi umat.
          </p>

          {/* Quick Badges Row (Dipadatkan) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-lg bg-[#242424] border border-[#A67C52]/40 text-[11px] font-bold text-[#DFC386] flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              PPIU No. 1030 Thn. 2019
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#242424] border border-gray-700 text-[11px] font-bold text-white flex items-center gap-1.5 shadow-xs">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Akreditasi "A" Kemenag RI
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#242424] border border-[#A67C52]/40 text-[11px] font-bold text-[#DFC386] flex items-center gap-1.5 shadow-xs">
              <HeartHandshake className="w-3.5 h-3.5 text-[#C5A059]" />
              Supported by @mandala525islamictour
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* =========================================================================
            SECTION 1: FILOSOFI SATU NAUNGAN: MANDALA 525 & ALGHANIM (CORE IDENTITY)
        ========================================================================== */}
        <section className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#A67C52] bg-[#F5F5F5] px-3 py-1 rounded-full border border-gray-200 inline-block">
              Harmoni &amp; Karakter
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight">
              Satu Naungan, Dua Pilihan, Satu Tujuan Suci
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
              Bukan tentang mana yang lebih baik, tetapi tentang mana yang lebih sesuai dengan kebutuhan dan kemampuan masing-masing jamaah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8 items-stretch">
            {/* KARTU 1: MANDALA 525 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#EBEBEB] hover:border-[#A67C52] transition-all shadow-sm flex flex-col justify-between space-y-5 relative overflow-hidden group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#A67C52] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E8E2D9]">
                    Karakter Eksklusif
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Pilihan Nyaman</span>
                </div>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  Mandala 525 Islamic Tour
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                  Hadir khusus untuk jamaah yang mengutamakan <strong>kenyamanan maksimal, fasilitas bintang terbaik, penerbangan langsung, serta pendampingan yang lebih intensif &amp; lengkap</strong> sepanjang perjalanan ibadah.
                </p>
                <div className="space-y-2 pt-2 text-xs text-[#444444]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                    <span>Hotel bintang 5 sangat dekat dengan pelataran masjid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                    <span>Fasilitas eksekutif &amp; pendampingan private family</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                    <span>Layanan komprehensif bagi kenyamanan lansia &amp; keluarga</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Fokus Utama:</span>
                <strong className="text-[#A67C52] font-semibold">Kenyamanan &amp; Fasilitas Lengkap</strong>
              </div>
            </div>

            {/* KARTU 2: ALGHANIM ISLAMIC TOUR */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#1A1A1A] text-white border-2 border-[#A67C52] shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#DFC386] bg-[#2A2A2A] px-2.5 py-1 rounded-md border border-[#A67C52]/40">
                    Karakter Hemat &amp; Layak
                  </span>
                  <span className="text-xs text-[#DFC386] font-medium">Pilihan Umat</span>
                </div>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
                  ALGHANIM Islamic Tour
                </h3>
                <p className="text-xs sm:text-sm text-[#D9D9D9] leading-relaxed">
                  Hadir khusus untuk jamaah yang mengutamakan <strong>harga yang lebih hemat dan terjangkau</strong>, dengan komitmen fasilitas yang <strong>tetap sangat layak, amanah, transparan, dan bimbingan ibadah murni sesuai Sunnah</strong>.
                </p>
                <div className="space-y-2 pt-2 text-xs text-[#E0E0E0]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#DFC386] flex-shrink-0" />
                    <span>Biaya umroh terjangkau, transparan tanpa biaya tersembunyi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#DFC386] flex-shrink-0" />
                    <span>Hotel bintang 3 &amp; 4 yang bersih, nyaman, dan layak huni</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#DFC386] flex-shrink-0" />
                    <span>Kepastian 5 Pasti Umroh Kemenag RI terjamin 100%</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Fokus Utama:</span>
                <strong className="text-[#DFC386] font-semibold">Harga Lebih Hemat &amp; Fasilitas Layak</strong>
              </div>
            </div>
          </div>

          {/* Slogan Kebersamaan */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-[#F5ECE2] to-[#FAF8F5] border border-[#E8E2D9] text-center max-w-4xl mx-auto shadow-2xs">
            <p className="font-serif-luxury text-sm sm:text-base font-bold text-[#2B2B2B]">
              "Satu naungan, dua pilihan, dan satu tujuan: membantu lebih banyak jamaah mewujudkan niat menuju Tanah Suci."
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: LATAR BELAKANG: DARI JABAL UHUD HINGGA ARTI NAMA ALGHANIM
        ========================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Sisi Kiri: Visual Jabal Uhud & Suasana Ibadah */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#A67C52] shadow-xl bg-[#F5F5F5]">
              <img
                src={jabalUhudRealImg}
                alt="Foto Asli Bukit Jabal Uhud Madinah Al-Munawwarah"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#1A1A1A]/95 backdrop-blur-md border border-[#A67C52]/40 space-y-1 text-white shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DFC386] block">
                  Jabal Uhud • Madinah al-Munawwarah
                </span>
                <p className="text-xs text-[#D9D9D9] leading-relaxed italic">
                  "Tempat di mana keteguhan, ketaatan, dan ketulusan niat melahirkan gagasan hadirnya Alghanim."
                </p>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Narasi Autentik Sejarah & Arti Nama */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="space-y-2">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#A67C52] bg-[#F5F5F5] px-3 py-1 rounded-full border border-gray-200 inline-block">
                Awal Mula &amp; Makna Nama
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-tight">
                Lahir dari Perenungan Suci di Jabal Uhud
              </h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-[#555555] leading-relaxed font-sans-luxury">
              <p>
                Gagasan mendirikan <strong>ALGHANIM</strong> berawal dari sebuah momen perenungan mendalam saat berada di kaki bukit bersejarah <strong>Jabal Uhud</strong>, Madinah al-Munawwarah. Merenungi makna ketulusan perjuangan para sahabat dan hakikat rezeki dari Allah, terbit rasa kepedulian yang tulus: <em>begitu banyak saudara kita yang memiliki kerinduan membuncah ke Baitullah, namun sering kali terhambat oleh beban biaya atau kekhawatiran akan fasilitas yang tidak sesuai janji.</em>
              </p>
              <p>
                Dari bukit Uhud yang dicintai Rasulullah ﷺ inilah lahir tekad bulat: menghadirkan sebuah biro perjalanan umroh yang mampu menjadi jembatan kemudahan bagi siapa pun untuk bertamu ke rumah Allah dengan <strong>biaya yang lebih hemat namun fasilitasnya tetap sangat layak, aman, dan nyaman</strong>.
              </p>
              
              {/* Kotak Penjelasan Arti Nama ALGHANIM */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] space-y-1.5 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1A1A1A] font-serif-luxury">Arti Nama "ALGHANIM":</span>
                  <span className="text-xs font-bold text-[#A67C52] bg-white px-2 py-0.5 rounded border border-[#E8E2D9]">الغَانِم</span>
                </div>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Berasal dari kata <em>Al-Ghanimah</em> yang bermakna keberkahan, karunia yang berlimpah, dan kebaikan yang diperoleh dengan penuh rasa syukur. Nama ini disematkan sebagai doa abadi agar setiap rupiah yang dikeluarkan jamaah menjadi bekal amal berlipat, dan setiap jamaah pulang membawa <em>ghanimah maknawiyah</em>—yakni kemabruran ibadah dan ketenangan batin sejati.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-0.5 text-center">
                <span className="text-lg sm:text-xl font-serif-luxury font-bold text-[#A67C52]">Jabal Uhud</span>
                <p className="text-[10px] sm:text-[11px] text-[#666666] uppercase font-semibold">Awal Mula Gagasan</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-0.5 text-center">
                <span className="text-lg sm:text-xl font-serif-luxury font-bold text-[#A67C52]">Al-Ghanimah</span>
                <p className="text-[10px] sm:text-[11px] text-[#666666] uppercase font-semibold">Berkah Berlimpah</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-0.5 text-center">
                <span className="text-lg sm:text-xl font-serif-luxury font-bold text-[#1A1A1A]">100%</span>
                <p className="text-[10px] sm:text-[11px] text-[#666666] uppercase font-semibold">Amanah &amp; Pasti</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: VISI & MISI PERUSAHAAN (Dipadatkan)
        ========================================================================== */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#A67C52] bg-[#F5F5F5] px-3 py-1 rounded-full border border-gray-200 inline-block">
              Arah &amp; Tujuan
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Visi &amp; Misi ALGHANIM
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* VISI CARD */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-[#1A1A1A] text-white border-2 border-[#A67C52] shadow-xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#A67C52]/20 border border-[#A67C52] text-[#A67C52] flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  Visi Perusahaan
                </h3>
                <p className="text-xs sm:text-sm text-[#D9D9D9] leading-relaxed font-sans-luxury italic">
                  "Menjadi biro perjalanan ibadah Umroh pilihan utama keluarga muslim Indonesia yang terpercaya, amanah, dan terjangkau, memberikan pelayanan yang memuliakan tamu Allah sesuai Sunnah Rasulullah ﷺ."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#242424] border border-gray-700 text-[11px] text-[#D9D9D9] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                <span>Berorientasi pada kemabruran ibadah &amp; kemudahan umat.</span>
              </div>
            </div>

            {/* MISI CARD (4 Butir Ringkas) */}
            <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-[#F5F5F5] border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-[#A67C52] flex items-center justify-center shadow-2xs">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                  Misi Perusahaan
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs space-y-1">
                    <strong className="text-xs font-bold text-[#1A1A1A] block">1. Ibadah Sesuai Sunnah</strong>
                    <p className="text-[11px] text-[#555555] leading-relaxed">
                      Membimbing manasik murni berlandaskan tuntunan Al-Qur'an dan As-Sunnah melalui asatidz berpengalaman.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs space-y-1">
                    <strong className="text-xs font-bold text-[#1A1A1A] block">2. Amanah 5 Pasti Umroh</strong>
                    <p className="text-[11px] text-[#555555] leading-relaxed">
                      Kepastian izin, jadwal terbang, hotel, visa, dan manasik secara transparan tanpa biaya siluman.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs space-y-1">
                    <strong className="text-xs font-bold text-[#1A1A1A] block">3. Harga Hemat &amp; Layak</strong>
                    <p className="text-[11px] text-[#555555] leading-relaxed">
                      Akses pembiayaan ibadah yang ramah di kantong dengan standar fasilitas hotel dan handling yang tetap prima.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs space-y-1">
                    <strong className="text-xs font-bold text-[#1A1A1A] block">4. Khidmat Kekeluargaan</strong>
                    <p className="text-[11px] text-[#555555] leading-relaxed">
                      Mendampingi setiap jamaah dengan ketulusan dan kehangatan layaknya keluarga sendiri.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: LEGALITAS LENGKAP & 5 PASTI UMROH KEMENAG RI
        ========================================================================== */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#F5F5F5] border border-gray-200 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Kiri (7 Kolom): Legalitas */}
            <div className="lg:col-span-7 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#A67C52]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Legalitas &amp; Sertifikasi Resmi
                </span>
              </div>

              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A] leading-tight">
                Terdaftar Resmi Kemenag RI (PPIU No. 1030 Thn. 2019)
              </h3>

              <p className="text-xs text-[#555555] leading-relaxed">
                PT. Al-Ghanimah Berkah Bersama beroperasi dengan legalitas penuh Kementerian Agama Republik Indonesia, tersertifikasi ISO 9001:2015, dan terintegrasi sistem resmi SISKOPATUH.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-gray-200 text-center">
                  <span className="text-[#666666] text-[10px] block">Izin PPIU</span>
                  <strong className="text-[#1A1A1A] text-xs font-bold">{LEGAL_INFO.skKemenag}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-200 text-center">
                  <span className="text-[#666666] text-[10px] block">Akreditasi</span>
                  <strong className="text-[#A67C52] text-xs font-bold">Akreditasi "A"</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-200 text-center">
                  <span className="text-[#666666] text-[10px] block">Asosiasi</span>
                  <strong className="text-[#1A1A1A] text-xs font-bold">SAPUHI</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-gray-200 text-center">
                  <span className="text-[#666666] text-[10px] block">Sertifikasi Mutu</span>
                  <strong className="text-[#1A1A1A] text-xs font-bold">ISO 9001:2015</strong>
                </div>
              </div>

              <div className="pt-1 flex flex-wrap gap-2.5">
                <button
                  onClick={onOpenLegal}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-300 text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#A67C52]" />
                  <span>Lihat Dokumen Izin Lengkap</span>
                </button>
              </div>
            </div>

            {/* Kanan (5 Kolom): 5 Pasti Umroh Kemenag */}
            <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-white border border-[#A67C52]/40 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-[#A67C52]" />
                <h4 className="font-serif-luxury text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Komitmen 5 Pasti Umroh Kemenag:
                </h4>
              </div>

              <ul className="space-y-2 text-xs text-[#555555]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                  <span><strong>1. Pasti Travelnya:</strong> PPIU No. 1030 Thn. 2019 Kemenag RI.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                  <span><strong>2. Pasti Jadwalnya:</strong> Tanggal keberangkatan &amp; kepulangan pasti.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                  <span><strong>3. Pasti Terbangnya:</strong> Tiket pesawat PP resmi terkonfirmasi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                  <span><strong>4. Pasti Hotelnya:</strong> Hotel layak &amp; jelas jaraknya ke masjid.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                  <span><strong>5. Pasti Visanya:</strong> Visa Umroh Muassasah terbit tepat waktu.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 5: CTA BANNER KONSULTASI IBADAH
        ========================================================================== */}
        <section className="p-6 sm:p-10 rounded-2xl bg-[#1A1A1A] border-2 border-[#A67C52] shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left text-white">
          <div className="space-y-2 max-w-2xl">
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
              Wujudkan Niat ke Baitullah Bersama ALGHANIM
            </h3>
            <p className="text-xs sm:text-sm text-[#D9D9D9] leading-relaxed">
              Konsultasikan rencana keberangkatan umroh hemat &amp; amanah bersama staf perwakilan ALGHANIM dan Mandala 525.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 flex-shrink-0">
            <a
              href={OFFICIAL_WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Chat WhatsApp Resmi</span>
            </a>
            <button
              onClick={onOpenLegal}
              className="px-5 py-2.5 rounded-xl bg-[#242424] hover:bg-[#333333] border border-gray-700 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Cek Legalitas PPIU
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
