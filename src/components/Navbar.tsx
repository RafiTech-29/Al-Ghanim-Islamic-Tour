import { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  ChevronDown, 
  Menu, 
  X, 
  ShieldCheck, 
  Award, 
  Users,
  MessageCircle,
  HelpCircle,
  Building2,
  FileText,
  Plane,
  HeartHandshake,
  ExternalLink,
  MapPin,
  Compass,
  Moon,
  CreditCard
} from 'lucide-react';
import { 
  OFFICIAL_WA_NUMBER, 
  OFFICIAL_WA_LINK
} from '../data/packagesData';
import { AlGhanimLogo } from './AlGhanimLogo';

export type NavTabType = 
  | 'beranda' 
  | 'layanan' 
  | 'portal-jamaah'
  | 'portal-mitra'
  | 'kemitraan' 
  | 'testimoni-galeri' 
  | 'faq' 
  | 'tentang-kami' 
  | 'kontak'
  | 'admin-cms'
  | 'detail-paket';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  onSelectServiceCategory?: (cat: string) => void;
  onSelectPartnershipTier?: (tier?: 'cabang' | 'agen' | 'marketer') => void;
  onOpenConsultation: (topic?: string) => void;
  onOpenOffices: (city: 'garut' | 'bandung') => void;
  onOpenLegal: () => void;
  onOpenRegulation?: (tab?: 'kurs' | 'musim' | 'visa' | 'kalkulator') => void;
  onMobileMenuChange?: (isOpen: boolean) => void;
}

export const Navbar = ({
  activeTab,
  setActiveTab,
  onSelectServiceCategory,
  onSelectPartnershipTier,
  onOpenConsultation,
  onOpenOffices,
  onOpenLegal,
  onOpenRegulation,
  onMobileMenuChange
}: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePaketOpen, setMobilePaketOpen] = useState(false);
  const [mobileKemitraanOpen, setMobileKemitraanOpen] = useState(false);
  const [mobileUmrohOpen, setMobileUmrohOpen] = useState(false);
  const [mobileHajiOpen, setMobileHajiOpen] = useState(false);
  const [mobileWisataOpen, setMobileWisataOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [partnershipDropdownOpen, setPartnershipDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavTabType>('beranda');

  // Notify parent of mobile menu status so floating action buttons auto-hide
  const toggleMobileMenu = (val?: boolean) => {
    const nextState = typeof val === 'boolean' ? val : !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    onMobileMenuChange?.(nextState);
  };

  // ScrollSpy: Real-time active section detector when on Beranda
  useEffect(() => {
    if (activeTab !== 'beranda') {
      setActiveSection(activeTab);
      return;
    }

    const sections: Array<{ id: string; tab: NavTabType }> = [
      { id: 'beranda-section', tab: 'beranda' },
      { id: 'keunggulan-section', tab: 'beranda' },
      { id: 'banyak-pilihan-paket', tab: 'layanan' },
      { id: 'testimoni-section', tab: 'testimoni-galeri' },
      { id: 'faq-section', tab: 'faq' }
    ];

    let ticking = false;
    let animationFrameId: number | null = null;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      animationFrameId = window.requestAnimationFrame(() => {
        ticking = false;
        const scrollPosition = window.scrollY + 160;

        let currentTab: NavTabType = 'beranda';
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i].id);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (scrollPosition >= top) {
              currentTab = sections[i].tab;
              break;
            }
          }
        }
        setActiveSection(currentTab);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [activeTab]);

  const effectiveActiveTab: NavTabType = activeTab === 'beranda' ? activeSection : activeTab;

  const umrohSubmenus = [
    { id: 'umroh-reguler', label: 'Umroh Reguler (OT)', desc: 'Keberangkatan berjadwal pasti & pembimbing bersertifikasi' },
    { id: 'umroh-custom', label: 'Umroh Custom by Request (PT)', desc: 'Private VIP rombongan keluarga & korporat' },
    { id: 'tabungan', label: 'Tabungan Umroh', desc: 'Rencana simpanan & cicilan syariah tanpa riba' },
    { id: 'badal-umroh', label: 'Badal Umroh', desc: 'Amanah ibadah bagi keluarga yang udzur atau wafat' }
  ];

  const hajiSubmenus = [
    { id: 'haji-khusus', label: 'Haji Khusus', desc: 'Kuota resmi Kemenag RI (PIHK) & Haji Furoda VVIP tanpa antre' }
  ];

  const additionalSubmenus = [
    { id: 'wisata-halal', label: 'Wisata Halal', desc: 'Turki, Dubai, Al-Aqsha, Uzbekistan' },
    { id: 'visa', label: 'Visa', desc: 'E-Visa MoFA Saudi, Umrah & Turis Resmi' },
    { id: 'tiket-pesawat', label: 'Tiket Pesawat', desc: 'Tiket Group Saudia Airlines, Oman Air & Garuda' },
    { id: 'land-arrangements', label: 'Land Arrangements', desc: 'Handling Bandara, Bus VIP & Muthawwif Saudi' }
  ];

  const partnershipSubmenus = [
    { id: 'cabang', label: 'Kantor Cabang', desc: 'Kemitraan representatif kota' },
    { id: 'agen', label: 'Keagenan Resmi', desc: 'Daftar agen travel umroh' },
    { id: 'marketer', label: 'Marketer Syiar', desc: 'Syiar baitullah raih komisi' }
  ];

  const handleNavClick = (tab: NavTabType) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setPartnershipDropdownOpen(false);

    if (tab === 'portal-jamaah' || tab === 'portal-mitra') {
      setActiveTab(tab);
      window.history.pushState(null, '', `#/${tab}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
      toggleMobileMenu(false);
      return;
    }

    if (activeTab === 'beranda') {
      if (tab === 'beranda') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toggleMobileMenu(false);
        return;
      }
      if (tab === 'layanan') {
        const el = document.getElementById('banyak-pilihan-paket');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          toggleMobileMenu(false);
          return;
        }
      }
      if (tab === 'testimoni-galeri') {
        const el = document.getElementById('testimoni-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          toggleMobileMenu(false);
          return;
        }
      }
      if (tab === 'faq') {
        const el = document.getElementById('faq-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          toggleMobileMenu(false);
          return;
        }
      }
    }

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toggleMobileMenu(false);
  };

  const handleSubmenuClick = (category: string) => {
    setActiveTab('layanan');
    if (onSelectServiceCategory) {
      onSelectServiceCategory(category);
    }
    setServicesDropdownOpen(false);
    toggleMobileMenu(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full max-w-full z-50 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB] transition-all duration-300 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-x-clip min-w-0">
      {/* Top Notification / Trust Bar - Continuous Smooth Marquee Ticker */}
      <div className="w-full max-w-full min-w-0 bg-[#FAFAFA] border-b border-[#EBEBEB] py-2 sm:py-2.5 overflow-hidden relative text-xs text-[#6E6E6E]">
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10" />

        {/* Marquee Track (Repeated twice for continuous infinite seamless loop) */}
        <div className="animate-marquee-slow flex items-center whitespace-nowrap">
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex items-center gap-6 sm:gap-8 px-4 flex-shrink-0">
              {/* Item 1: Legalitas Utama */}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2B2B2B] font-medium">
                <Award className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                <span>PT. Al-Ghanimah Berkah Bersama • PPIU No. 1030 Thn. 2019 (Akreditasi A)</span>
              </div>

              <span className="text-[#C5A059]/40 font-bold">•</span>

              {/* Item 2: Official Instagram */}
              <a
                href="https://instagram.com/alghanimislamictour"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#A67C52] hover:text-[#8E653E] font-semibold transition-colors"
              >
                <span>Instagram: @alghanimislamictour</span>
              </a>

              <span className="text-[#C5A059]/40 font-bold">•</span>

              {/* Item 4: Legalitas Kemenag */}
              <button 
                onClick={onOpenLegal}
                className="text-[#6E6E6E] hover:text-[#C5A059] transition-colors cursor-pointer flex items-center gap-1.5 font-medium text-[11px] sm:text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                <span>Legalitas Resmi Kemenag RI</span>
              </button>

              <span className="text-[#C5A059]/40 font-bold">•</span>

              {/* Item 4B: Info Regulasi Visa & Kurs */}
              {onOpenRegulation && (
                <>
                  <button 
                    onClick={() => onOpenRegulation('kurs')}
                    className="text-[#1A1A1A] hover:text-[#A67C52] transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-[11px] sm:text-xs bg-[#A67C52]/10 px-2.5 py-0.5 rounded-full border border-[#A67C52]/20"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                    <span>Panduan Paspor, Syarat Visa &amp; Prosedur</span>
                  </button>
                  <span className="text-[#C5A059]/40 font-bold">•</span>
                </>
              )}

              {/* Item 5: Kantor Garut Mandala Umroh */}
              <a
                href="https://share.google/fsqwRYJHLHFaiESVm"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#555555] hover:text-[#A67C52] font-medium transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                <span>Kantor Garut: Jl. Sudirman Copong, Sukamentri</span>
              </a>

              <span className="text-[#C5A059]/40 font-bold">•</span>

              {/* Item 6: WA Sales */}
              <a
                href={OFFICIAL_WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6E6E6E] hover:text-[#C5A059] font-medium transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-[#25D366] flex-shrink-0" />
                <span>WA Sales: <strong className="text-[#2B2B2B] font-semibold">{OFFICIAL_WA_NUMBER}</strong></span>
              </a>

              <span className="text-[#C5A059]/40 font-bold">•</span>

              {/* Item 7: Fasilitas */}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6E6E6E]">
                <Building2 className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                <span>Hotel Bintang 5 Pelataran Masjidil Haram &amp; Nabawi</span>
              </div>

              <span className="text-[#C5A059]/40 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navbar (Clean White Background, Soft Charcoal Gray Text #2B2B2B) */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-12 py-3.5 lg:py-4 xl:py-4.5 flex items-center justify-between gap-6 lg:gap-8">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('beranda')}
          className="group cursor-pointer text-left flex-shrink-0"
        >
          <AlGhanimLogo size="md" theme="light" />
        </button>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
          {/* Beranda */}
          <button
            onClick={() => handleNavClick('beranda')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
              effectiveActiveTab === 'beranda'
                ? 'text-[#C5A059] font-bold'
                : 'text-[#2B2B2B] hover:text-[#C5A059] hover:bg-[#FAFAFA]'
            }`}
          >
            <span>Beranda</span>
            {effectiveActiveTab === 'beranda' && (
              <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#C5A059] rounded-full" />
            )}
          </button>

          {/* Tentang Kami */}
          <button
            onClick={() => handleNavClick('tentang-kami')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
              effectiveActiveTab === 'tentang-kami'
                ? 'text-[#C5A059] font-bold'
                : 'text-[#2B2B2B] hover:text-[#C5A059] hover:bg-[#FAFAFA]'
            }`}
          >
            <span>Tentang Kami</span>
            {effectiveActiveTab === 'tentang-kami' && (
              <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#C5A059] rounded-full" />
            )}
          </button>

          {/* Paket Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              onClick={() => handleNavClick('layanan')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer relative ${
                effectiveActiveTab === 'layanan'
                  ? 'text-[#C5A059] font-bold'
                  : 'text-[#2B2B2B] hover:text-[#C5A059] hover:bg-[#FAFAFA]'
              }`}
            >
              <span>Paket</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
              {effectiveActiveTab === 'layanan' && (
                <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#C5A059] rounded-full" />
              )}
            </button>

            {servicesDropdownOpen && (
              <div className="absolute top-full left-0 w-80 bg-[#161616]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 space-y-1.5 animate-fadeIn z-50 text-white">
                
                {/* 1. Paket Umroh (Ventour Link & Subitems) */}
                <div className="space-y-1">
                  <button
                    onClick={() => handleSubmenuClick('all-umroh')}
                    className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-xs font-bold tracking-wide group-hover:text-[#C5A059] transition-colors">
                        Paket Umroh
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover:text-[#C5A059] transition-colors">
                      Katalog →
                    </span>
                  </button>

                  <div className="pl-6 pr-1 space-y-0.5 border-l border-white/10 ml-3 mt-1">
                    {umrohSubmenus.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubmenuClick(sub.id)}
                        className="w-full text-left px-2 py-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-[#C5A059] text-[11px] font-medium transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>• {sub.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Paket Haji (Ventour Link & Subitems) */}
                <div className="pt-1.5 border-t border-white/10">
                  <button
                    onClick={() => handleSubmenuClick('haji-khusus')}
                    className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-[#E8BE65]" />
                      <span className="text-xs font-bold tracking-wide text-[#E8BE65] group-hover:text-[#D9A74A] transition-colors">
                        Paket Haji
                      </span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 font-semibold">
                      Resmi Kemenag
                    </span>
                  </button>

                  <div className="pl-6 pr-1 space-y-0.5 border-l border-white/10 ml-3 mt-1">
                    {hajiSubmenus.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubmenuClick(sub.id)}
                        className="w-full text-left px-2 py-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-[#C5A059] text-[11px] font-medium transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>• {sub.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Wisata Halal (Tanpa Bintang) */}
                <div className="pt-1.5 border-t border-white/10">
                  <button
                    onClick={() => handleSubmenuClick('wisata-halal')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-[#C5A059] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plane className="w-4 h-4 text-[#C5A059]" />
                    <span>Wisata Halal</span>
                  </button>
                </div>

                {/* 4. Privat Umroh (Umroh Custom) */}
                <div>
                  <button
                    onClick={() => handleSubmenuClick('umroh-custom')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-[#C5A059] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-[#C5A059]" />
                    <span>Privat Umroh (Custom Group)</span>
                  </button>
                </div>

                {/* 5. Pembiayaan Syariah (Tabungan & Cicilan) */}
                <div>
                  <button
                    onClick={() => handleSubmenuClick('tabungan')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-[#C5A059] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-[#C5A059]" />
                    <span>Pembiayaan Syariah &amp; Tabungan</span>
                  </button>
                </div>

                {/* Dashed Separator like Ventour (Gambar 8) */}
                <div className="border-t border-white/15 border-dashed my-1.5" />

                {/* Layanan Tambahan (Gambar 9: Visa, Tiket Pesawat, Land Arrangements - Tanpa Bintang) */}
                <div className="px-2 py-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                    Layanan Tambahan
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    <button
                      onClick={() => handleSubmenuClick('visa')}
                      className="text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-[11px] text-gray-300 hover:text-[#C5A059] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>Visa</span>
                      <span className="text-[10px] text-gray-500">Saudi MoFA</span>
                    </button>
                    <button
                      onClick={() => handleSubmenuClick('tiket-pesawat')}
                      className="text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-[11px] text-gray-300 hover:text-[#C5A059] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>Tiket Pesawat</span>
                      <span className="text-[10px] text-gray-500">Grup Direct</span>
                    </button>
                    <button
                      onClick={() => handleSubmenuClick('land-arrangements')}
                      className="text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-[11px] text-gray-300 hover:text-[#C5A059] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>Land Arrangements</span>
                      <span className="text-[10px] text-gray-500">Makkah &amp; Madinah</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Galeri & Testimoni */}
          <button
            onClick={() => handleNavClick('testimoni-galeri')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
              effectiveActiveTab === 'testimoni-galeri'
                ? 'text-[#C5A059] font-bold'
                : 'text-[#2B2B2B] hover:text-[#C5A059] hover:bg-[#FAFAFA]'
            }`}
          >
            <span>Galeri &amp; Testimoni</span>
            {effectiveActiveTab === 'testimoni-galeri' && (
              <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#C5A059] rounded-full" />
            )}
          </button>

          {/* Portal Jamaah (Pelacakan Pasca DP) */}
          <button
            onClick={() => handleNavClick('portal-jamaah')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
              effectiveActiveTab === 'portal-jamaah'
                ? 'text-[#A67C52] font-bold bg-[#A67C52]/10'
                : 'text-[#A67C52] hover:text-[#8E653E] hover:bg-[#A67C52]/5 font-bold'
            }`}
          >
            <span>Portal Jamaah</span>
            {effectiveActiveTab === 'portal-jamaah' && (
              <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#A67C52] rounded-full" />
            )}
          </button>

          {/* Kemitraan Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPartnershipDropdownOpen(true)}
            onMouseLeave={() => setPartnershipDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => {
                setPartnershipDropdownOpen(false);
                if (onSelectPartnershipTier) {
                  onSelectPartnershipTier(undefined);
                }
                handleNavClick('kemitraan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer relative ${
                effectiveActiveTab === 'kemitraan'
                  ? 'text-[#C5A059] font-bold'
                  : 'text-[#2B2B2B] hover:text-[#C5A059] hover:bg-[#FAFAFA]'
              }`}
            >
              <span>Kemitraan</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setPartnershipDropdownOpen((prev) => !prev);
                }}
                className="p-0.5 hover:text-[#C5A059] transition-colors"
                title="Pilihan Program Kemitraan"
              >
                <ChevronDown className={`w-3.5 h-3.5 opacity-75 transition-transform duration-200 ${partnershipDropdownOpen ? 'rotate-180' : ''}`} />
              </span>
              {effectiveActiveTab === 'kemitraan' && (
                <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#C5A059] rounded-full" />
              )}
            </button>

            {partnershipDropdownOpen && (
              <div className="absolute top-full left-0 w-72 bg-[#161616]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2.5 space-y-1 animate-fadeIn z-50 text-white">
                {partnershipSubmenus.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setPartnershipDropdownOpen(false);
                      if (onSelectPartnershipTier) {
                        onSelectPartnershipTier(sub.id as 'cabang' | 'agen' | 'marketer');
                      }
                      setActiveTab('kemitraan');
                      setTimeout(() => {
                        const targetCard = document.getElementById(`program-${sub.id}`) || document.getElementById('kemitraan-section') || document.getElementById('form-kemitraan');
                        if (targetCard) {
                          targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 150);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer block group"
                  >
                    <p className="text-xs font-bold text-gray-100 group-hover:text-[#C5A059] transition-colors">{sub.label}</p>
                    <p className="text-[11px] text-gray-100">{sub.desc}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FAQ */}
          <button
            onClick={() => handleNavClick('faq')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
              effectiveActiveTab === 'faq'
                ? 'text-[#C5A059] font-bold'
                : 'text-[#2B2B2B] hover:text-[#C5A059] hover:bg-[#FAFAFA]'
            }`}
          >
            <span>FAQ</span>
            {effectiveActiveTab === 'faq' && (
              <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#C5A059] rounded-full" />
            )}
          </button>

          {/* Kontak Kami */}
          <button
            onClick={() => handleNavClick('kontak')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
              effectiveActiveTab === 'kontak'
                ? 'text-[#C5A059] font-bold'
                : 'text-[#2B2B2B] hover:text-[#C5A059] hover:bg-[#FAFAFA]'
            }`}
          >
            <span>Kontak</span>
            {effectiveActiveTab === 'kontak' && (
              <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#C5A059] rounded-full" />
            )}
          </button>
        </nav>

        {/* Action Button: Single Clean Warm Luxury Bronze Soft CTA (Like Rabbani/Arrayyan) */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => onOpenConsultation('Pendaftaran Umroh & Haji')}
            className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-white font-sans-luxury text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-[#C5A059]/30 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Konsultasi &amp; Pendaftaran</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => toggleMobileMenu()}
          className="lg:hidden p-2 rounded-xl bg-[#FAFAFA] text-[#2B2B2B] hover:text-[#C5A059] border border-[#EBEBEB] cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EBEBEB] px-4 py-5 space-y-2 max-h-[85vh] overflow-y-auto w-full max-w-full overflow-x-hidden shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* 1. Beranda */}
          <button
            onClick={() => handleNavClick('beranda')}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
              effectiveActiveTab === 'beranda'
                ? 'text-[#C5A059] bg-[#C5A059]/10 font-bold'
                : 'text-[#2B2B2B] hover:bg-[#FAFAFA] hover:text-[#C5A059]'
            }`}
          >
            <span>Beranda</span>
          </button>

          {/* 2. Tentang Kami */}
          <button
            onClick={() => handleNavClick('tentang-kami')}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
              effectiveActiveTab === 'tentang-kami'
                ? 'text-[#C5A059] bg-[#C5A059]/10 font-bold'
                : 'text-[#2B2B2B] hover:bg-[#FAFAFA] hover:text-[#C5A059]'
            }`}
          >
            <span>Tentang Kami &amp; Legalitas</span>
          </button>

          {/* 3. Paket Umroh (Accordion) */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setMobileUmrohOpen(!mobileUmrohOpen)}
              className="w-full text-left py-3 px-4 bg-[#FAFAFA] hover:bg-gray-100 text-[#2B2B2B] text-sm font-bold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <span>Paket Umroh</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${mobileUmrohOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
            </button>
            {mobileUmrohOpen && (
              <div className="p-2 space-y-1 bg-white border-t border-gray-100">
                <button
                  onClick={() => handleNavClick('layanan')}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-[#C5A059] bg-[#C5A059]/10 block"
                >
                  Lihat Semua Katalog Umroh →
                </button>
                {umrohSubmenus.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubmenuClick(sub.id)}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs text-[#444444] hover:text-[#C5A059] hover:bg-[#FAFAFA] block"
                  >
                    • {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Layanan Haji Khusus & Furoda (Accordion) */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setMobileHajiOpen(!mobileHajiOpen)}
              className="w-full text-left py-3 px-4 bg-[#FAFAFA] hover:bg-gray-100 text-[#2B2B2B] text-sm font-bold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#E8BE65]" />
                <span>Layanan Haji Khusus &amp; Furoda</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${mobileHajiOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
            </button>
            {mobileHajiOpen && (
              <div className="p-2 space-y-1 bg-white border-t border-gray-100">
                <button
                  onClick={() => handleSubmenuClick('haji-khusus')}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-[#E8BE65] bg-[#C5A059]/10 block"
                >
                  Lihat Katalog Haji Khusus &amp; Furoda →
                </button>
                {hajiSubmenus.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubmenuClick(sub.id)}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-[#444444] hover:text-[#C5A059] hover:bg-[#FAFAFA] block"
                  >
                    • {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Wisata Halal & Layanan Tambahan (Accordion) */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setMobileWisataOpen(!mobileWisataOpen)}
              className="w-full text-left py-3 px-4 bg-[#FAFAFA] hover:bg-gray-100 text-[#2B2B2B] text-sm font-bold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#C5A059]" />
                <span>Wisata Halal &amp; Layanan Tambahan</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${mobileWisataOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
            </button>
            {mobileWisataOpen && (
              <div className="p-2 space-y-1 bg-white border-t border-gray-100 animate-in fade-in duration-150">
                <button
                  onClick={() => handleSubmenuClick('turki-plus')}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-[#C5A059] bg-[#C5A059]/10 block"
                >
                  Lihat Semua Wisata Halal →
                </button>
                {additionalSubmenus.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubmenuClick(sub.id)}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs text-[#555555] hover:text-[#C5A059] hover:bg-[#FAFAFA] block"
                  >
                    • {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 6. Galeri & Testimoni */}
          <button
            onClick={() => handleNavClick('testimoni-galeri')}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
              effectiveActiveTab === 'testimoni-galeri'
                ? 'text-[#C5A059] bg-[#C5A059]/10 font-bold'
                : 'text-[#2B2B2B] hover:bg-[#FAFAFA] hover:text-[#C5A059]'
            }`}
          >
            <span>Galeri &amp; Testimoni</span>
          </button>

          {/* 7. Portal Transparansi Jamaah */}
          <button
            onClick={() => handleNavClick('portal-jamaah')}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
              effectiveActiveTab === 'portal-jamaah'
                ? 'bg-[#A67C52] text-white shadow-sm'
                : 'text-[#A67C52] bg-[#A67C52]/10 hover:bg-[#A67C52]/20'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>Portal Transparansi Jamaah</span>
            </span>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
              effectiveActiveTab === 'portal-jamaah' ? 'bg-white text-[#A67C52]' : 'bg-[#A67C52] text-white'
            }`}>
              Lacak NIJ
            </span>
          </button>

          {/* 8. Kemitraan (Hanya "Kemitraan", klik panah muncul 3 pilihan) */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="w-full flex items-center justify-between bg-[#FAFAFA] hover:bg-gray-100 transition-colors">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSelectPartnershipTier) {
                    onSelectPartnershipTier(undefined);
                  }
                  handleNavClick('kemitraan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 text-left py-3 px-4 text-[#2B2B2B] text-sm font-bold flex items-center gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#C5A059]" />
                  <span>Kemitraan</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMobileKemitraanOpen(!mobileKemitraanOpen)}
                className="p-3 text-gray-500 hover:text-[#C5A059] cursor-pointer"
                aria-label="Pilihan Kemitraan"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileKemitraanOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
              </button>
            </div>
            {mobileKemitraanOpen && (
              <div className="p-2 space-y-1 bg-white border-t border-gray-100 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSelectPartnershipTier) {
                      onSelectPartnershipTier(undefined);
                    }
                    handleNavClick('kemitraan');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-[#A67C52] bg-amber-50/70 hover:bg-amber-100 block"
                >
                  Lihat Semua Program Kemitraan (Paling Atas) →
                </button>
                {partnershipSubmenus.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onSelectPartnershipTier) {
                        onSelectPartnershipTier(sub.id as any);
                      }
                      setActiveTab('kemitraan');
                      setTimeout(() => {
                        const targetCard = document.getElementById(`program-${sub.id}`) || document.getElementById('kemitraan-section') || document.getElementById('form-kemitraan');
                        if (targetCard) {
                          targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 200);
                    }}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs text-[#333333] hover:text-[#C5A059] hover:bg-[#FAFAFA] block font-medium"
                  >
                    • {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 9. FAQ */}
          <button
            onClick={() => handleNavClick('faq')}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
              effectiveActiveTab === 'faq'
                ? 'text-[#C5A059] bg-[#C5A059]/10 font-bold'
                : 'text-[#2B2B2B] hover:bg-[#FAFAFA] hover:text-[#C5A059]'
            }`}
          >
            <span>FAQ (Tanya Jawab &amp; Panduan)</span>
          </button>

          {/* 10. Regulasi Visa & Paspor */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegulation?.('visa');
            }}
            className="w-full text-left py-2.5 px-4 rounded-xl text-xs text-[#A67C52] bg-amber-50/70 hover:bg-amber-100 block font-bold border border-amber-200/60"
          >
            Regulasi Visa, Paspor &amp; Kurs Valas
          </button>

          {/* 11. Kontak & Lokasi Kantor */}
          <button
            onClick={() => handleNavClick('kontak')}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold transition-colors ${
              effectiveActiveTab === 'kontak'
                ? 'text-[#C5A059] bg-[#FAFAFA] font-bold'
                : 'text-[#2B2B2B] hover:bg-[#FAFAFA] hover:text-[#C5A059]'
            }`}
          >
            Kontak Cabang Garut &amp; Bandung
          </button>

          {/* 12. Action Button CTA */}
          <div className="pt-3 border-t border-[#EBEBEB]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation('Pendaftaran Umroh & Haji');
              }}
              className="w-full bg-[#C5A059] hover:bg-[#B38E46] text-white text-center font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi &amp; Pendaftaran</span>
            </button>
          </div>
        </div>
      )}
      </header>
      {/* Spacer agar konten tidak tertutup fixed navbar */}
      <div className="h-[92px] sm:h-[106px] lg:h-[116px] w-full flex-shrink-0" aria-hidden="true" />
    </>
  );
};

