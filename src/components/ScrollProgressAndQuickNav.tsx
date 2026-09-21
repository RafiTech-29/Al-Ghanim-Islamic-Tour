import { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  MessageCircle, 
  Bot, 
  Compass, 
  Building2, 
  CheckCircle2, 
  ChevronUp,
  Layers
} from 'lucide-react';
import { OFFICIAL_WA_LINK, OFFICIAL_WA_NUMBER } from '../data/packagesData';

interface ScrollProgressAndQuickNavProps {
  onOpenConcierge: () => void;
  onNavigateTab: (tab: any) => void;
  phoneNumber?: string;
  defaultMessage?: string;
}

export const ScrollProgressAndQuickNav = ({
  onOpenConcierge,
  onNavigateTab,
  phoneNumber = '628131670218',
  defaultMessage = 'Halo Admin ALGHANIM, saya ingin konsultasi paket Umroh/Haji.'
}: ScrollProgressAndQuickNavProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const waUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
      setShowBackToTop(totalScroll > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Top Glowing Scroll Progress Bar */}
      <div 
        id="scroll-progress-bar-container"
        className="fixed top-0 left-0 right-0 h-[3.5px] z-50 bg-black/10 pointer-events-none"
      >
        <div 
          className="h-full bg-[#A67C52] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(166,124,82,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Floating Quick Nav & Action Cluster (Exact Match with Image 3) */}
      <div 
        id="floating-scroll-controls"
        className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-auto select-none"
      >
        {/* Quick Section Jump Floating Pills (Expanded when clicked) */}
        {isQuickMenuOpen && (
          <div className="p-3 rounded-2xl bg-[#1A1A1A]/95 text-white backdrop-blur-xl border border-white/20 shadow-2xl space-y-2 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-200 min-w-[220px] text-xs">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#DFC386] border-b border-white/10 flex items-center justify-between">
              <span>Navigasi Cepat</span>
              <span>{Math.round(scrollProgress)}%</span>
            </div>

            <button
              onClick={() => {
                onNavigateTab('layanan');
                scrollToSection('jadwal-layanan');
                setIsQuickMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#DFC386]" />
              <span>Paket &amp; Jadwal 2026/27</span>
            </button>

            <button
              onClick={() => {
                onNavigateTab('testimoni-galeri');
                setIsQuickMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#DFC386]" />
              <span>Testimoni &amp; Galeri</span>
            </button>

            <button
              onClick={() => {
                scrollToSection('footer-section');
                setIsQuickMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-gray-200 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#DFC386]" />
              <span>Kantor Pusat &amp; Cabang</span>
            </button>
          </div>
        )}

        {/* Back To Top Floating Pin */}
        {showBackToTop && (
          <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group self-end mb-1"
            title="Kembali ke Atas"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-4 h-4 text-gray-700 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* Individual Floating Action Buttons (Semi-transparan, elegan, tidak menghalangi konten) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 opacity-80 hover:opacity-100 transition-opacity duration-300">
          {/* Button 1: Layers / Menu Icon */}
          <button
            id="quick-menu-toggle-btn"
            onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md hover:scale-105 active:scale-95 backdrop-blur-md ${
              isQuickMenuOpen
                ? 'bg-[#A67C52] text-white border border-[#A67C52]'
                : 'bg-white/85 text-gray-700 hover:bg-white border border-gray-200/80'
            }`}
            title="Navigasi Menu Cepat"
            aria-label="Toggle Quick Navigation"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Button 2: TANYA AI Standalone Pill Button (Semi-transparan elegan) */}
          <button
            id="spiritual-concierge-btn"
            onClick={onOpenConcierge}
            className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-gray-200/80 text-gray-700 shadow-xs hover:shadow-md flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
            title="Tanya Asisten AI seputar rukun, syarat & panduan umroh"
          >
            <Bot className="w-3.5 h-3.5 text-[#A67C52] transition-transform" />
            <span className="font-semibold text-gray-800">Tanya AI</span>
          </button>

          {/* Button 3: WhatsApp Standalone Circular Logo Button */}
          <a
            id="btn-floating-whatsapp"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi WhatsApp Resmi ALGHANIM"
            title="Chat WhatsApp CS Resmi Al-Ghanim"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366]/90 hover:bg-[#25D366] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer flex-shrink-0 backdrop-blur-xs"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white" />
          </a>
        </div>
      </div>
    </>
  );
};
