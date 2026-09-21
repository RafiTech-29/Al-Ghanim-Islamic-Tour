import { useState, useEffect } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyChooseSection } from './components/WhyChooseSection';
import { ProductCatalogSection } from './components/ProductCatalogSection';
import { TestimonialsGallerySection } from './components/TestimonialsGallerySection';
import { FAQSection } from './components/FAQSection';
import { PartnershipSection } from './components/PartnershipSection';
import { AboutSection } from './components/AboutSection';
import { PartnersMediaSection } from './components/PartnersMediaSection';
import { PackagesSliderSection } from './components/PackagesSliderSection';
import { PromoBannerSection } from './components/PromoBannerSection';
import { ManasikAndOfficesSection } from './components/ManasikAndOfficesSection';
import { ContactSection } from './components/ContactSection';
import { JamaahTransparencyPortal } from './components/JamaahTransparencyPortal';
import { PartnerPortal } from './components/PartnerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { SlimSocialBar } from './components/SlimSocialBar';
import { ScrollProgressAndQuickNav } from './components/ScrollProgressAndQuickNav';

// Modals & Drawers
import { ScheduleDetailModal } from './components/ScheduleDetailModal';
import { BadalUmrohModal } from './components/BadalUmrohModal';
import { CustomQuoteModal } from './components/CustomQuoteModal';
import { TabunganCalculatorModal } from './components/TabunganCalculatorModal';
import { ConsultationModal } from './components/ConsultationModal';
import { OfficesModal } from './components/OfficesModal';
import { LegalModal } from './components/LegalModal';
import { ConciergeDrawer } from './components/ConciergeDrawer';
import { RegulationRatesModal } from './components/RegulationRatesModal';

import { PackageScheduleItem, SelectedRegistrationPackage } from './types';
import { PackageDetailPage } from './components/PackageDetailPage';
import { DETAILED_SCHEDULES } from './data/packagesData';
import { subscribeToPackages } from './lib/firestoreService';

// Helper to determine package ID from URL hash or query params
const getPackageIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash || '';
  const search = window.location.search || '';

  if (hash.includes('id=')) {
    const match = hash.match(/[?&]id=([^&]+)/);
    if (match && match[1]) return decodeURIComponent(match[1]);
  }
  if (search.includes('id=')) {
    const params = new URLSearchParams(search);
    const id = params.get('id');
    if (id) return id;
  }
  return null;
};

// Helper to determine initial tab from URL hash or path
const getTabFromLocation = (allowAdmin: boolean = false): NavTabType => {
  if (typeof window === 'undefined') return 'beranda';
  const path = window.location.pathname.toLowerCase().replace(/^\/+/, '');
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
  const target = hash || path;

  // IMPORTANT: For initial load, NEVER automatically display Admin.
  // Always display the Jamaah Dashboard / Beranda to public visitors.
  if (target.includes('admin')) {
    if (!allowAdmin) {
      if (window.location.hash.toLowerCase().includes('admin')) {
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch {
          // ignore
        }
      }
      return 'beranda';
    }
    return 'admin-cms';
  }

  if (target.includes('detail') || target.includes('paket?id=')) return 'detail-paket';
  if (target.includes('portal-mitra') || target.includes('mitra-portal')) return 'portal-mitra';
  if (target.includes('kemitraan') || target.includes('mitra')) return 'kemitraan';
  if (target.includes('portal') || target.includes('transparansi') || target.includes('jamaah')) return 'portal-jamaah';
  if (target.includes('layanan') || target.includes('paket') || target.includes('umroh') || target.includes('haji')) return 'layanan';
  if (target.includes('tentang') || target.includes('profil') || target.includes('about')) return 'tentang-kami';
  if (target.includes('kontak') || target.includes('contact')) return 'kontak';
  if (target.includes('faq') || target.includes('tanya')) return 'faq';
  if (target.includes('testimoni') || target.includes('galeri') || target.includes('gallery')) return 'testimoni-galeri';

  return 'beranda';
};

// Helper to determine initial category from URL hash or path
const getInitialCategoryFromLocation = (): string => {
  const target = (window.location.hash || window.location.pathname).toLowerCase();
  if (target.includes('paket-haji') || target.includes('haji')) return 'haji-khusus';
  if (target.includes('paket-umroh') || target.includes('umroh')) return 'all-umroh';
  return 'all';
};

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>(() => getTabFromLocation(false));
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>(getInitialCategoryFromLocation);
  const [selectedPartnershipTier, setSelectedPartnershipTier] = useState<'cabang' | 'agen' | 'marketer' | undefined>(undefined);
  const [detailPackageId, setDetailPackageId] = useState<string | null>(getPackageIdFromUrl);
  const [livePackages, setLivePackages] = useState<PackageScheduleItem[]>(DETAILED_SCHEDULES);
  const [scrollToCatalogOnReturn, setScrollToCatalogOnReturn] = useState(false);

  // Subscribe to live packages from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToPackages((items) => {
      if (items && items.length > 0) {
        setLivePackages(items);
      }
    });
    return () => unsubscribe();
  }, []);

  // Change tab, update URL hash for shareable role-based links, and scroll to top
  const handleTabChange = (tab: NavTabType, pkgId?: string, skipScrollTop?: boolean) => {
    setActiveTab(tab);
    if (!skipScrollTop) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (tab === 'detail-paket') {
      const targetId = pkgId || detailPackageId || 'pkg-friendly-9d-wy';
      setDetailPackageId(targetId);
      window.history.pushState(null, '', `#/detail-paket?id=${targetId}`);
      return;
    }

    // Update URL hash smoothly without reloading
    const tabUrlMap: Record<NavTabType, string> = {
      'beranda': '',
      'layanan': selectedServiceCategory === 'haji-khusus' ? 'paket-haji' : 'paket-umroh',
      'portal-jamaah': 'portal-jamaah',
      'portal-mitra': 'portal-mitra',
      'kemitraan': 'kemitraan',
      'testimoni-galeri': 'galeri-testimoni',
      'faq': 'faq',
      'tentang-kami': 'tentang-kami',
      'kontak': 'kontak',
      'admin-cms': 'admin',
      'detail-paket': 'detail-paket'
    };

    const newHash = tabUrlMap[tab];
    if (newHash) {
      window.history.pushState(null, '', `#${newHash}`);
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  // Sync state if user uses browser Back / Forward buttons or alters hash + Secret Admin Shortcut
  useEffect(() => {
    // If the browser was previously stuck on #admin from past dev session, immediately clear it
    if (window.location.hash.toLowerCase().includes('admin')) {
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch {
        // ignore
      }
      setActiveTab('beranda');
    }

    const handleLocationChange = () => {
      const detectedTab = getTabFromLocation(true);
      if (detectedTab === 'beranda' && activeTab === 'detail-paket') {
        setScrollToCatalogOnReturn(true);
      }
      setActiveTab(detectedTab);
      const id = getPackageIdFromUrl();
      if (id) {
        setDetailPackageId(id);
      }
      const rawTarget = (window.location.hash || window.location.pathname).toLowerCase();
      if (rawTarget.includes('paket-haji') || rawTarget.includes('haji')) {
        setSelectedServiceCategory('haji-khusus');
      } else if (rawTarget.includes('paket-umroh') || rawTarget.includes('umroh')) {
        setSelectedServiceCategory('all-umroh');
      }

      // Check if URL specifies package registration context (e.g. #/kontak?pkg=... or #kontak?paket=...)
      if (rawTarget.includes('kontak') && (rawTarget.includes('pkg=') || rawTarget.includes('paket=') || rawTarget.includes('id='))) {
        const hashStr = window.location.hash || '';
        const match = hashStr.match(/[?&](pkg|paket|id)=([^&]+)/i);
        if (match && match[2]) {
          const pkgParam = decodeURIComponent(match[2]);
          const found = livePackages.find(
            p => p.id === pkgParam || p.title.toLowerCase().includes(pkgParam.toLowerCase())
          ) || DETAILED_SCHEDULES.find(
            p => p.id === pkgParam || p.title.toLowerCase().includes(pkgParam.toLowerCase())
          );
          if (found) {
            setSelectedRegistrationPackage({
              id: found.id,
              name: found.title,
              category: found.category,
              price: found.priceQuad || found.price,
              duration: found.duration,
              date: found.departureDate,
              airline: found.airline,
              hotelMakkah: found.hotelMakkah,
              hotelMadinah: found.hotelMadinah,
              makkahDistance: found.hotelDistanceMakkah,
              quadPrice: found.priceQuad || found.price,
              triplePrice: found.priceTriple,
              doublePrice: found.priceDouble,
              programHighlights: found.programHighlights
            });
            setTimeout(() => {
              const el = document.getElementById('registration-hub-form');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 250);
          }
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Shortcut: Ctrl + Shift + A or Cmd + Shift + A opens Admin Portal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleTabChange('admin-cms');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Scroll otomatis ke "Katalog Unggulan & Keberangkatan Terdekat - Banyak Pilihan Paket Umroh & Haji Khusus" ketika kembali dari halaman detail paket
  useEffect(() => {
    if (activeTab === 'beranda' && scrollToCatalogOnReturn) {
      setScrollToCatalogOnReturn(false);
      const doScrollToCatalog = () => {
        const target = document.getElementById('katalog-unggulan-section') || document.getElementById('banyak-pilihan-paket');
        if (target) {
          const navOffset = 90;
          const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: 'smooth'
          });
          return true;
        }
        return false;
      };

      if (!doScrollToCatalog()) {
        setTimeout(doScrollToCatalog, 60);
      }
      setTimeout(doScrollToCatalog, 180);
      setTimeout(doScrollToCatalog, 380);
    }
  }, [activeTab, scrollToCatalogOnReturn]);

  // Modal States
  const [selectedSchedulePkg, setSelectedSchedulePkg] = useState<PackageScheduleItem | null>(null);
  const [selectedRegistrationPackage, setSelectedRegistrationPackage] = useState<SelectedRegistrationPackage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBadalModalOpen, setIsBadalModalOpen] = useState(false);
  const [isCustomQuoteOpen, setIsCustomQuoteOpen] = useState(false);
  const [isTabunganOpen, setIsTabunganOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationTopic, setConsultationTopic] = useState('Konsultasi Umum');
  const [isOfficesOpen, setIsOfficesOpen] = useState(false);
  const [selectedOfficeCity, setSelectedOfficeCity] = useState<'garut' | 'bandung'>('garut');
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isRegulationOpen, setIsRegulationOpen] = useState(false);
  const [regulationTab, setRegulationTab] = useState<'kurs' | 'musim' | 'visa' | 'kalkulator'>('kurs');

  // Centralized Registration Handler: Directs users to the single registration hub with context
  const handleRegisterPackage = (pkgInfo: SelectedRegistrationPackage) => {
    setSelectedRegistrationPackage(pkgInfo);
    handleTabChange('kontak');
    setTimeout(() => {
      const el = document.getElementById('registration-hub-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Handlers
  const handleOpenDetailModal = (pkg: PackageScheduleItem) => {
    setSelectedSchedulePkg(pkg);
    setIsDetailModalOpen(true);
  };

  const handleOpenRegulation = (tab?: 'kurs' | 'musim' | 'visa' | 'kalkulator') => {
    setRegulationTab(tab || 'kurs');
    setIsRegulationOpen(true);
  };

  const handleOpenConsultation = (topic?: string) => {
    setConsultationTopic(topic || 'Konsultasi Umum');
    setIsConsultationOpen(true);
  };

  const handleOpenOffices = (city: 'garut' | 'bandung') => {
    setSelectedOfficeCity(city);
    setIsOfficesOpen(true);
  };

  const handleSelectServiceCategory = (cat: string) => {
    setSelectedServiceCategory(cat);
    handleTabChange('layanan');
  };

  const handleHeroSearch = (category: string) => {
    if (activeTab !== 'beranda') {
      setActiveTab('beranda');
    }
    setTimeout(() => {
      const el = document.getElementById('banyak-pilihan-paket');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleExplorePackages = () => {
    if (activeTab !== 'beranda') {
      setActiveTab('beranda');
    }
    setTimeout(() => {
      const el = document.getElementById('banyak-pilihan-paket');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // IF IN ADMIN CMS BACK-OFFICE MODE: Render standalone isolated Admin Dashboard
  if (activeTab === 'admin-cms') {
    return (
      <div className="min-h-screen bg-[#141414] text-[#1A1A1A] font-sans-luxury">
        <AdminDashboard onBackToPublicWebsite={() => handleTabChange('beranda')} />
      </div>
    );
  }

  // IF IN PACKAGE DETAIL STANDALONE VIEW (Ala venom.ventour.co.id):
  if (activeTab === 'detail-paket') {
    return (
      <PackageDetailPage
        packageId={detailPackageId || 'pkg-friendly-9d-wy'}
        onBackToHome={() => {
          setScrollToCatalogOnReturn(true);
          handleTabChange('beranda', undefined, true);
        }}
        onRegisterPackage={(pkg) => {
          handleRegisterPackage({
            id: pkg.id,
            name: pkg.title,
            category: pkg.category,
            price: pkg.quadPrice || pkg.priceQuad || pkg.price,
            duration: pkg.duration,
            date: pkg.departureDate,
            airline: pkg.airline,
            hotelMakkah: pkg.hotelMakkah,
            hotelMadinah: pkg.hotelMadinah,
            makkahDistance: pkg.hotelDistanceMakkah,
            quadPrice: pkg.quadPrice || pkg.priceQuad || pkg.price,
            triplePrice: pkg.triplePrice || pkg.priceTriple,
            doublePrice: pkg.doublePrice || pkg.priceDouble,
            programHighlights: pkg.programHighlights
          });
        }}
        onOpenConsultation={handleOpenConsultation}
      />
    );
  }

  // IF IN STANDALONE JAMAAH TRANSPARENCY PORTAL VIEW: No Navbar, No Footer, Only Back to Home
  if (activeTab === 'portal-jamaah') {
    return (
      <div className="min-h-screen bg-stone-50/50 text-[#1A1A1A] font-sans-luxury">
        <JamaahTransparencyPortal
          onBackToHome={() => handleTabChange('beranda')}
          onOpenConsultation={(topic) => handleOpenConsultation(topic || 'Bantuan Portal Jamaah')}
        />
      </div>
    );
  }

  // IF IN STANDALONE PARTNER PORTAL VIEW: No Navbar, No Footer, Only Back to Home / Kemitraan
  if (activeTab === 'portal-mitra') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans-luxury">
        <PartnerPortal
          onBackToHome={() => handleTabChange('beranda')}
          onGoToKemitraan={() => handleTabChange('kemitraan')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#2B2B2B] flex flex-col font-sans-luxury selection:bg-[#C5A059] selection:text-white w-full max-w-full overflow-x-hidden min-w-0">
      {/* Top Fixed Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onSelectServiceCategory={handleSelectServiceCategory}
        onSelectPartnershipTier={(tier) => {
          setSelectedPartnershipTier(tier);
          handleTabChange('kemitraan');
        }}
        onOpenConsultation={handleOpenConsultation}
        onOpenOffices={handleOpenOffices}
        onOpenLegal={() => setIsLegalOpen(true)}
        onOpenRegulation={handleOpenRegulation}
      />

      {/* Main Content Areas: Strictly Standalone & Isolated Views */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden min-w-0">
        {/* VIEW 1: BERANDA (Menampilkan Seluruh Konten Lengkap dengan Spacing Lega & Rapi) */}
        {activeTab === 'beranda' && (
          <div className="w-full max-w-full overflow-x-hidden space-y-12 sm:space-y-16 md:space-y-24 pb-16 sm:pb-24">
            {/* HERO + BAR MEDIA SOSIAL RESMI (Diposisikan Rapi & Menyatu di Bawah Hero) */}
            <div>
              <Hero
                onSearch={handleHeroSearch}
                onExplorePackages={handleExplorePackages}
                onOpenConsultation={() => handleOpenConsultation('Konsultasi Beranda')}
                onOpenAbout={() => handleTabChange('tentang-kami')}
              />
              <SlimSocialBar />
            </div>

            <WhyChooseSection
              onOpenConsultation={() => handleOpenConsultation('10 Keunggulan')}
              onOpenLegal={() => setIsLegalOpen(true)}
            />
            {/* BANNER PROMOSI BULANAN (CMS) */}
            <PromoBannerSection
              onOpenConsultation={(topic) => handleOpenConsultation(topic)}
            />
            {/* CAROUSEL GESER OTOMATIS LAMBAT DARI KANAN KE KIRI (UMROH & HAJI KHUSUS) */}
            <PackagesSliderSection
              onOpenDetailModal={handleOpenDetailModal}
              onOpenConsultation={(pkgName) => handleOpenConsultation(pkgName)}
              onExploreAllPackages={() => handleTabChange('layanan')}
              onRegisterPackage={handleRegisterPackage}
            />
            {/* JADWAL MANASIK & DETAIL KANTOR LAYANAN ALGHANIM (Penempatan logis di Beranda) */}
            <ManasikAndOfficesSection
              onOpenConsultation={handleOpenConsultation}
              onOpenOfficesModal={handleOpenOffices}
            />
            <PartnersMediaSection onOpenLegal={() => setIsLegalOpen(true)} />
            <TestimonialsGallerySection />
            <FAQSection onOpenConsultation={(title) => handleOpenConsultation(title || 'Konsultasi FAQ')} />
          </div>
        )}

        {/* VIEW 2: LAYANAN & PAKET UMROH */}
        {activeTab === 'layanan' && (
          <div className="pt-2 sm:pt-6 pb-12 w-full max-w-full overflow-x-hidden">
            <ProductCatalogSection
              selectedCategory={selectedServiceCategory}
              onSelectCategory={setSelectedServiceCategory}
              onOpenDetailModal={handleOpenDetailModal}
              onOpenCustomQuote={() => setIsCustomQuoteOpen(true)}
              onOpenTabungan={() => setIsTabunganOpen(true)}
              onOpenBadalModal={() => setIsBadalModalOpen(true)}
              onRegisterPackage={handleRegisterPackage}
            />
          </div>
        )}

        {/* VIEW 3: TENTANG KAMI / PROFIL PERUSAHAAN (Langsung menempel di bawah navbar tanpa gap putih) */}
        {activeTab === 'tentang-kami' && (
          <div className="pt-0 pb-0 w-full max-w-full overflow-x-hidden">
            <AboutSection
              onOpenLegal={() => setIsLegalOpen(true)}
              onOpenOffices={handleOpenOffices}
            />
          </div>
        )}

        {/* VIEW 4: KEMITRAAN */}
        {activeTab === 'kemitraan' && (
          <div className="pt-2 sm:pt-6 pb-12 w-full max-w-full overflow-x-hidden">
            <PartnershipSection 
              onOpenPartnerPortal={() => handleTabChange('portal-mitra')} 
              selectedTier={selectedPartnershipTier}
            />
          </div>
        )}

        {/* VIEW 5: GALERI & TESTIMONI */}
        {activeTab === 'testimoni-galeri' && (
          <div className="pt-2 sm:pt-6 pb-12 w-full max-w-full overflow-x-hidden">
            <TestimonialsGallerySection />
          </div>
        )}

        {/* VIEW 6: FAQ & PANDUAN IBADAH */}
        {activeTab === 'faq' && (
          <div className="pt-2 sm:pt-6 pb-12 w-full max-w-full overflow-x-hidden">
            <FAQSection onOpenConsultation={(title) => handleOpenConsultation(title || 'Konsultasi FAQ')} />
          </div>
        )}

        {/* VIEW 7: KONTAK & LOKASI KANTOR (PENDAFTARAN SATU PINTU) */}
        {activeTab === 'kontak' && (
          <div className="pt-0 sm:pt-4 pb-12 w-full max-w-full overflow-x-hidden">
            <ContactSection
              selectedPackage={selectedRegistrationPackage}
              onResetSelectedPackage={() => setSelectedRegistrationPackage(null)}
            />
          </div>
        )}
      </main>

      {/* Footer (3-Column Grid + Light Background + Sub-footer + Scroll to Top) */}
      <Footer
        onNavClick={handleTabChange}
        onOpenLegal={() => setIsLegalOpen(true)}
        onOpenOffices={handleOpenOffices}
        onSelectServiceCategory={handleSelectServiceCategory}
        onOpenRegulation={handleOpenRegulation}
      />

      {/* Floating Action Controls Dock (Image 3: Layers Nav + Tanya Asisten AI + WhatsApp) */}
      <ScrollProgressAndQuickNav
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        phoneNumber="628131670218"
        defaultMessage="Halo Admin ALGHANIM, saya ingin konsultasi paket Umroh/Haji."
      />

      {/* Modals & Drawers */}
      <ScheduleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        pkg={selectedSchedulePkg}
        onBookNow={(title) => handleOpenConsultation(`Booking Paket ${title}`)}
        onRegisterDirectly={(pkg) => {
          handleRegisterPackage({
            id: pkg.id,
            name: pkg.title,
            category: pkg.category,
            price: pkg.quadPrice || pkg.priceQuad || pkg.price,
            duration: pkg.duration,
            date: pkg.departureDate,
            airline: pkg.airline,
            hotelMakkah: pkg.hotelMakkah,
            hotelMadinah: pkg.hotelMadinah,
            makkahDistance: pkg.hotelDistanceMakkah,
            quadPrice: pkg.quadPrice || pkg.priceQuad || pkg.price,
            triplePrice: pkg.triplePrice || pkg.priceTriple,
            doublePrice: pkg.doublePrice || pkg.priceDouble,
            programHighlights: pkg.programHighlights
          });
        }}
      />

      <BadalUmrohModal
        isOpen={isBadalModalOpen}
        onClose={() => setIsBadalModalOpen(false)}
      />

      <CustomQuoteModal
        isOpen={isCustomQuoteOpen}
        onClose={() => setIsCustomQuoteOpen(false)}
      />

      <TabunganCalculatorModal
        isOpen={isTabunganOpen}
        onClose={() => setIsTabunganOpen(false)}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialTopic={consultationTopic}
      />

      <OfficesModal
        isOpen={isOfficesOpen}
        onClose={() => setIsOfficesOpen(false)}
        initialCity={selectedOfficeCity}
      />

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />

      <ConciergeDrawer
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

      <RegulationRatesModal
        isOpen={isRegulationOpen}
        onClose={() => setIsRegulationOpen(false)}
        initialTab={regulationTab}
      />
    </div>
  );
}
export default App;
