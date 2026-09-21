import { useState, FormEvent } from 'react';
import { 
  MessageCircle, 
  Search, 
  ShieldCheck, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Plane, 
  ExternalLink, 
  Play, 
  Flame, 
  Star, 
  Hotel,
  Instagram
} from 'lucide-react';
import { 
  BRAND_TAGLINES, 
  OFFICIAL_WA_LINK, 
  OFFICIAL_WA_NUMBER, 
  LEGAL_INFO 
} from '../data/packagesData';
import kaabaSunsetBg from '../assets/images/kaaba_golden_sunset_1787050348437.jpg';

interface HeroProps {
  onSearch?: (category: string, month: string) => void;
  onExplorePackages: () => void;
  onOpenConsultation: () => void;
  onOpenAbout?: () => void;
}

export const GOOGLE_DRIVE_VIDEO_ID = '1inctjFtosU0YppvwjIvIoFc51L479egJ';
export const GOOGLE_DRIVE_VIDEO_URL = `https://drive.google.com/file/d/${GOOGLE_DRIVE_VIDEO_ID}/preview`;
export const INSTAGRAM_REEL_URL = 'https://www.instagram.com/reel/DcDkVAUylrX/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==';

export const Hero = ({ onSearch, onExplorePackages, onOpenConsultation, onOpenAbout }: HeroProps) => {
  const [selectedCategory, setSelectedCategory] = useState('umroh-reguler');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleFilterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(selectedCategory, selectedMonth);
    } else {
      onExplorePackages();
    }
    const target = document.getElementById('katalog-unggulan-section') || document.getElementById('banyak-pilihan-paket');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToKatalog = () => {
    const target = document.getElementById('katalog-unggulan-section') || document.getElementById('banyak-pilihan-paket');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onExplorePackages();
    }
  };

  return (
    <section id="beranda-section" className="relative w-full max-w-full overflow-hidden z-20 pt-7 sm:pt-8 md:pt-10 lg:pt-12 pb-6 sm:pb-8 md:pb-9 min-w-0">
      {/* Background Architectural Canvas (Holy Kaaba Sunset & Grand Mosque Backdrop) - 100% Edge-to-Edge Full Width */}
      <div 
        className="absolute inset-0 w-full h-full z-0 bg-cover bg-bottom md:bg-bottom bg-no-repeat pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${kaabaSunsetBg})`,
          backgroundPosition: 'center 85%'
        }}
      />

      {/* Dark Overlay with horizontal + vertical gradient for maximum text readability while keeping Kaaba visible */}
      <div 
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ 
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.55) 50%, rgba(0, 0, 0, 0.85) 100%), linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.2) 100%)' 
        }}
      />

      {/* Container Content Max 7xl */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Main 2-Column Hero Grid: Desktop Video Shifted Left & Mobile Responsive Ordering */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-8 items-start lg:items-center">
        
        {/* Left Column: Headlines, Copywriting & CTA Button (Order 1 on Mobile, 7 Cols on Desktop) */}
        <div className="order-1 lg:col-span-7 xl:col-span-7 space-y-5 text-left w-full mt-1 sm:mt-0">
          
          {/* Badge: Kotak (rounded-xl) with high-contrast legibility */}
          <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl bg-white/95 border border-white/40 text-[11px] sm:text-xs text-[#9E836A] font-semibold shadow-sm backdrop-blur-md">
            <span className="font-bold text-[#2B2B2B]">ALGHANIM Islamic Tour</span>
            <span className="text-gray-400">•</span>
            <span className="text-[#9E836A] font-bold">Supported by @mandala525islamictour</span>
            <span className="text-gray-400">•</span>
            <span className="text-[#9E836A] font-semibold">PPIU No. 1030 Thn. 2019</span>
          </div>

          {/* Main Headline: White with High Contrast Clarity */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Wujudkan Perjalanan Ibadah yang Nyaman dan Berkesan
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] pt-1">
              <span className="font-serif text-white font-bold">Bersama</span>
              <span className="font-serif-luxury font-black bg-gradient-to-r from-white via-[#F5ECE2] to-[#DFC386] bg-clip-text text-transparent tracking-wide">Al-Ghanim</span>
              <span className="font-serif-luxury text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#DFC386] uppercase tracking-wider">Islamic Tour</span>
            </div>
          </div>

          {/* Subheadline: Slogan Badges & Copywriting with high-contrast legibility */}
          <div className="space-y-3.5 text-left max-w-2xl bg-black/35 lg:bg-transparent backdrop-blur-[2px] lg:backdrop-blur-none p-4 sm:p-0 rounded-2xl border border-white/10 lg:border-none">
            <p className="font-sans text-sm sm:text-base md:text-lg text-white font-medium leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              Nikmati kemudahan ibadah ke Tanah Suci dengan pelayanan terbaik, amanah, dan terpercaya sejak 2013 bersama ALGHANIM.
            </p>
            <div className="flex flex-wrap items-center gap-2 font-bold text-xs sm:text-sm text-[#F5ECE2] tracking-wider">
              <span className="bg-white/20 px-3 py-1 rounded-lg border border-white/30 shadow-sm text-white backdrop-blur-xs">#HEMAT</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg border border-white/30 shadow-sm text-white backdrop-blur-xs">#AMANAH</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg border border-white/30 shadow-sm text-white backdrop-blur-xs">#RAMAH</span>
            </div>
            <p className="font-sans text-xs sm:text-sm md:text-base text-gray-100 font-normal leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              Sudah bayar DP? Pantau seluruh kesiapan dokumen, visa, tiket, dan manasik secara transparan di <strong className="font-bold text-white underline decoration-[#DFC386] underline-offset-4">Portal Jamaah</strong> kami.
            </p>
          </div>

          {/* Action Button: TENTANG KAMI */}
          {onOpenAbout && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenAbout}
                className="px-7 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#E8DACB] via-[#CBB39C] to-[#9E836A] text-[#141414] hover:text-black font-sans text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>TENTANG KAMI</span>
                <ArrowRight className="w-4 h-4 text-[#141414]" />
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Clean Official Portrait Video Player (Centered on Mobile & Aligned on Desktop) */}
        <div className="order-2 lg:col-span-5 xl:col-span-5 w-full flex justify-center lg:justify-end items-center mt-4 sm:mt-6 lg:mt-0 relative z-20">
          <div className="w-full max-w-[240px] sm:max-w-[260px] lg:max-w-[280px] mx-auto lg:mx-0 p-2.5 sm:p-3 rounded-2xl bg-[#141414]/90 border border-[#C5A059]/40 shadow-2xl backdrop-blur-md relative overflow-hidden group space-y-2">
            
            {/* Portrait Video Player Container - Perfectly centered & scaled to eliminate black bars on mobile & desktop */}
            <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-black border border-gray-800 shadow-inner">
              <iframe
                src={GOOGLE_DRIVE_VIDEO_URL}
                className="w-[140%] h-[106%] max-w-none border-0 absolute -left-[20%] -top-[3%] rounded-xl"
                allow="autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
                title="Video Dokumentasi Umroh Al-Ghanim"
                onLoad={() => setIsVideoLoaded(true)}
              />

              {!isVideoLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1F1F1F] text-gray-400 space-y-2 p-4 text-center">
                  <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Memuat Video...</span>
                </div>
              )}
            </div>

            {/* Clean Footer Label with Official Instagram Reel Link */}
            <div className="flex items-center justify-between px-1.5 pt-1 text-[11px] text-[#D9D9D9]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DFC386]" />
                <span className="font-semibold text-white text-[10px] sm:text-[11px]">Dokumentasi Jamaah</span>
              </div>
              <a
                href={INSTAGRAM_REEL_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] sm:text-[11px] text-[#DFC386] hover:text-white flex items-center gap-1.5 transition-colors font-medium group"
                title="Lihat Video di Instagram Resmi"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E1306C] group-hover:scale-110 transition-transform" />
                <span className="underline underline-offset-2">Instagram</span>
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* Quick Search Filter Bar (Soft Luxury Off-White Card) */}
      <div id="hero-filter-form" className="w-full max-w-5xl mx-auto mt-10 p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EBEBEB] shadow-xl text-left relative overflow-hidden">
        <form onSubmit={handleFilterSubmit} className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          {/* Category Select */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#2B2B2B] block mb-1.5">
              Pilihan Kategori Program
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Semua Kategori Program</option>
              <option value="umroh-reguler">Umroh Reguler &amp; Syawal (Open Trip)</option>
              <option value="umroh-custom">Umroh Custom VIP &amp; Privat (Private Trip)</option>
              <option value="haji-khusus">Haji Khusus &amp; Furoda (Tanpa Antre)</option>
              <option value="tabungan">Program Tabungan Umroh Syariah</option>
              <option value="badal-umroh">Layanan Badal Umroh Amanah</option>
              <option value="wisata-halal">Wisata Halal (Turki / Dubai / Jordan)</option>
              <option value="visa-tiket-la">Land Arrangement (LA), Visa &amp; Tiket</option>
            </select>
          </div>

          {/* Month Select */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#2B2B2B] block mb-1.5">
              Rencana Keberangkatan
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#EBEBEB] rounded-xl px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Semua Bulan (2026 / 2027)</option>
              <option value="sep-2026">September 2026 (Promo Hemat)</option>
              <option value="oct-2026">Oktober 2026</option>
              <option value="nov-2026">November 2026</option>
              <option value="dec-2026">Desember 2026 (Akhir Tahun)</option>
              <option value="ramadhan-2027">Ramadhan 2027</option>
            </select>
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-[#C5A059] hover:bg-[#B38E46] text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              <span>Cari Paket &amp; Jadwal</span>
            </button>
          </div>
        </form>
      </div>

      {/* STATISTICS SECTION (Soft Charcoal #2B2B2B or Soft Off-White, Numbers: Luxury Bronze #C5A059, Labels: White) */}
      <div className="w-full max-w-5xl mx-auto mt-8 rounded-2xl bg-[#2B2B2B] border border-gray-700 shadow-xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-700">
          <div className="pt-3 md:pt-0">
            <p className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#DFC386]">
              10.000+
            </p>
            <p className="text-xs sm:text-sm font-semibold text-white mt-1">
              Jamaah Terlayani
            </p>
          </div>

          <div className="pt-3 md:pt-0 md:pl-6">
            <p className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#DFC386]">
              Akreditasi "A"
            </p>
            <p className="text-xs sm:text-sm font-semibold text-white mt-1">
              SK PPIU U.412/2021 Kemenag
            </p>
          </div>

          <div className="pt-3 md:pt-0 md:pl-6">
            <p className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#DFC386]">
              Sejak 2013
            </p>
            <p className="text-xs sm:text-sm font-semibold text-white mt-1">
              13+ Tahun Melayani Ibadah
            </p>
          </div>

          <div className="pt-3 md:pt-0 md:pl-6">
            <p className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#DFC386]">
              100%
            </p>
            <p className="text-xs sm:text-sm font-semibold text-white mt-1">
              Kepastian Berangkat
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
  );
};
