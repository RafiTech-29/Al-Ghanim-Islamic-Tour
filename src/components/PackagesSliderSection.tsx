import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Plane, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  ShieldCheck, 
  Gift, 
  Building2, 
  Check, 
  Flame,
  Award,
  Train,
  ArrowRight,
  Star,
  Calendar,
  MapPin,
  Users,
  TableProperties,
  LayoutGrid,
  FileText,
  Landmark
} from 'lucide-react';
import { OFFICIAL_WA_NUMBER, OFFICIAL_WA_LINK, DETAILED_SCHEDULES } from '../data/packagesData';
import { PackageScheduleItem } from '../types';
import { subscribeToPackages } from '../lib/firestoreService';


export interface SliderPackageItem {
  id: string;
  category: 'reguler' | 'plus' | 'premium' | 'ramadhan' | 'haji';
  flyerImage: string;
  flyerTitle: string;
  flyerDurationBadge: string;
  flyerRouteText: string;
  flyerFreePerks: string[];
  pricing: {
    quad: string;
    triple: string;
    double: string;
  };
  hotelInfo: {
    madinah: string;
    makkah: string;
    extra?: string;
  };
  cardTitle: string;
  durationPill: string;
  flightPill: string;
  flightType: 'Direct' | 'Transit' | 'VIP Direct';
  availableSeats: number;
  totalSeats: number;
  isPopular?: boolean;
  isPromo?: boolean;
  scheduleItemData?: Partial<PackageScheduleItem>;
}

export const SLIDER_PACKAGES: SliderPackageItem[] = [
  {
    id: 'pkg-friendly-9d-wy',
    category: 'reguler',
    flyerImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'FRIENDLY 9D WY (OMAN AIR)',
    flyerDurationBadge: '9 HARI',
    flyerRouteText: 'Keberangkatan 23 September 2026 • CGK - MCT - JED / MED • Free Museum Al Amoudi',
    flyerFreePerks: ['Free Tour Museum Al Amoudi', 'Free Kereta Cepat Haramain', 'Air Zamzam 5L & Koper Eksklusif'],
    pricing: {
      quad: 'Rp 27,9 Jt',
      triple: 'Rp 29,9 Jt',
      double: 'Rp 32,5 Jt'
    },
    hotelInfo: {
      madinah: 'ODST Madinah ★4 (150m)',
      makkah: 'Maysan Al Maqam ★4 (350m)'
    },
    cardTitle: 'FRIENDLY 9D WY',
    durationPill: '9 Hari',
    flightPill: 'Oman Air (WY)',
    flightType: 'Transit',
    availableSeats: 1,
    totalSeats: 45,
    isPopular: true
  },
  {
    id: 'pkg-slider-haji-furoda',
    category: 'haji',
    flyerImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'HAJI FURODA VVIP (LANGSUNG BERANGKAT)',
    flyerDurationBadge: '22 - 25 HARI',
    flyerRouteText: 'Tanpa Antre Tahun Berjalan • Visa Mujamalah Resmi Saudi • Maktab VVIP 111/112 Dekat Jamarat',
    flyerFreePerks: ['FREE Maktab VVIP Mina & Arafah', 'FREE Hotel Front-Row 0 Meter', 'Lounge VIP Bandara & Fast Track'],
    pricing: {
      quad: 'USD $19.500',
      triple: 'USD $21.500',
      double: 'USD $23.500'
    },
    hotelInfo: {
      madinah: 'The Oberoi / Dar Al Taqwa ★5',
      makkah: 'Fairmont / Raffles Palace ★5 (0m)'
    },
    cardTitle: 'Haji Furoda VVIP Tanpa Antre',
    durationPill: '22-25 Hari',
    flightPill: 'Direct Saudia VVIP',
    flightType: 'VIP Direct',
    availableSeats: 4,
    totalSeats: 25,
    isPopular: true
  },
  {
    id: 'pkg-slider-haji-khusus',
    category: 'haji',
    flyerImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'HAJI KHUSUS PIHK KEMENAG RI',
    flyerDurationBadge: '26 HARI',
    flyerRouteText: 'Nomor Porsi Resmi SISKOPATUH Kemenag • Masa Tunggu Singkat 5-7 Tahun • Tenda AC Mina',
    flyerFreePerks: ['Setoran Awal USD $4.500', 'Manasik Intensif Hotel Bintang 5', 'Dokter & Pembimbing Senior'],
    pricing: {
      quad: 'USD $12.500',
      triple: 'USD $13.800',
      double: 'USD $15.500'
    },
    hotelInfo: {
      madinah: 'Rove Madinah ★5 (100m)',
      makkah: 'Swissotel Makkah ★5 (50m)'
    },
    cardTitle: 'Haji Khusus PIHK Resmi',
    durationPill: '26 Hari',
    flightPill: 'Garuda / Saudia Direct',
    flightType: 'Direct',
    availableSeats: 12,
    totalSeats: 45,
    isPromo: true
  },
  {
    id: 'pkg-slider-kazakhstan',
    category: 'plus',
    flyerImage: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'UMROH PLUS KAZAKHSTAN',
    flyerDurationBadge: '15 HARI',
    flyerRouteText: 'Keberangkatan 19 Nov & 23 Des • Madinah - Makkah - Almaty - Shymbulak',
    flyerFreePerks: ['FREE Kereta Cepat Haramain', 'FREE Set Ayam Al Baik', 'FREE Lounge Bandara'],
    pricing: {
      quad: 'Rp 48,9 Jt',
      triple: 'Rp 50,9 Jt',
      double: 'Rp 53,9 Jt'
    },
    hotelInfo: {
      madinah: 'Rove Madinah (★4/5 - 100m)',
      makkah: 'Swissotel Makkah (★5 Pelataran)',
      extra: 'Almaty Rahat Palace ★5'
    },
    cardTitle: 'Umroh Plus Kazakhstan',
    durationPill: '15 Hari',
    flightPill: 'Transit Air Astana',
    flightType: 'Transit',
    availableSeats: 6,
    totalSeats: 45,
    isPopular: true
  },
  {
    id: 'pkg-slider-reguler-direct',
    category: 'reguler',
    flyerImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'UMROH REGULER DIRECT',
    flyerDurationBadge: '9 HARI',
    flyerRouteText: 'Keberangkatan Tersedia Setiap Bulan • Direct Saudia / Garuda CGK-MED/JED',
    flyerFreePerks: ['FULL BOARD Masakan Nusantara', 'GRATIS Al Baik & Koper Premium', 'FREE City Tour Thaif'],
    pricing: {
      quad: 'Rp 30,5 Jt',
      triple: 'Rp 32,5 Jt',
      double: 'Rp 34,5 Jt'
    },
    hotelInfo: {
      madinah: 'Grand Plaza / Dallah Taibah ★4/5',
      makkah: 'Mather Al Eiman / Swissotel ★4/5'
    },
    cardTitle: 'Umroh Reguler Direct',
    durationPill: '9 Hari',
    flightPill: 'Direct Flight',
    flightType: 'Direct',
    availableSeats: 4,
    totalSeats: 45,
    isPromo: true
  },
  {
    id: 'pkg-slider-premium-pelataran',
    category: 'premium',
    flyerImage: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'UMROH PREMIUM HOTEL PELATARAN',
    flyerDurationBadge: '10 HARI',
    flyerRouteText: 'Akses 50 Meter ke Masjidil Haram & Nabawi • Pembimbing Asatidz Sunnah Senior',
    flyerFreePerks: ['FREE Kereta Cepat Haramain', 'FREE City Tour Thaif Cable Car', 'VIP Executive Lounge'],
    pricing: {
      quad: 'Rp 39,5 Jt',
      triple: 'Rp 42,5 Jt',
      double: 'Rp 47,5 Jt'
    },
    hotelInfo: {
      madinah: 'Dar Al Eiman Royal ★5 (50m)',
      makkah: 'Pullman Zamzam / Fairmont ★5 (50m)'
    },
    cardTitle: 'Umroh Premium Pelataran',
    durationPill: '10 Hari',
    flightPill: 'Direct Saudia',
    flightType: 'Direct',
    availableSeats: 5,
    totalSeats: 40,
    isPopular: true
  },
  {
    id: 'pkg-slider-turki-cappadocia',
    category: 'plus',
    flyerImage: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'UMROH PLUS TURKI CAPPADOCIA',
    flyerDurationBadge: '15 HARI',
    flyerRouteText: 'Cappadocia - Istanbul - Bursa - Madinah - Makkah • Bosphorus Cruise',
    flyerFreePerks: ['FREE Kereta Cepat Haramain', 'FREE City Tour Istanbul & Bursa', 'Hot Air Balloon Spot'],
    pricing: {
      quad: 'Rp 41,5 Jt',
      triple: 'Rp 43,5 Jt',
      double: 'Rp 45,5 Jt'
    },
    hotelInfo: {
      madinah: 'Rove Madinah ★5 (100m)',
      makkah: 'Swissotel Makkah ★5 (50m)',
      extra: 'Cave Hotel Cappadocia ★5'
    },
    cardTitle: 'Umroh Plus Turki Cappadocia',
    durationPill: '15 Hari',
    flightPill: 'Transit Turkish Air',
    flightType: 'Transit',
    availableSeats: 7,
    totalSeats: 45,
    isPopular: true
  },
  {
    id: 'pkg-slider-jumatain',
    category: 'reguler',
    flyerImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'UMROH JUM\'ATAIN 12 HARI',
    flyerDurationBadge: '12 HARI',
    flyerRouteText: '2x Shalat Jum\'at di Masjidil Haram & Nabawi • Durasi Ibadah Lebih Puas',
    flyerFreePerks: ['FREE City Tour Thaif', 'FREE Koper Fiber 24-inch', 'Free Air Zam-zam 5 Liter'],
    pricing: {
      quad: 'Rp 34,5 Jt',
      triple: 'Rp 36,5 Jt',
      double: 'Rp 38,5 Jt'
    },
    hotelInfo: {
      madinah: 'Leader Al Muna Kareem ★5 (100m)',
      makkah: 'Movenpick Hajar Tower ★5 (50m)'
    },
    cardTitle: 'Umroh Jum\'atain 12 Hari',
    durationPill: '12 Hari',
    flightPill: 'Direct Garuda',
    flightType: 'Direct',
    availableSeats: 8,
    totalSeats: 45
  },
  {
    id: 'pkg-slider-dubai-thaif',
    category: 'plus',
    flyerImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'UMROH PLUS DUBAI & THAIF',
    flyerDurationBadge: '12 HARI',
    flyerRouteText: 'Desert Safari - Burj Khalifa - Miracle Garden - Madinah - Makkah',
    flyerFreePerks: ['FREE Desert Safari & BBQ Dinner', 'FREE Monorail Palm Jumeirah', 'FREE Kereta Cepat'],
    pricing: {
      quad: 'Rp 38,5 Jt',
      triple: 'Rp 40,5 Jt',
      double: 'Rp 42,5 Jt'
    },
    hotelInfo: {
      madinah: 'Rove Madinah ★5 (100m)',
      makkah: 'Swissotel Makkah ★5 (50m)',
      extra: 'Grand Millennium Dubai ★5'
    },
    cardTitle: 'Umroh Plus Dubai & Thaif',
    durationPill: '12 Hari',
    flightPill: 'Transit Emirates',
    flightType: 'Transit',
    availableSeats: 9,
    totalSeats: 45
  },
  {
    id: 'pkg-slider-ramadhan',
    category: 'ramadhan',
    flyerImage: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    flyerTitle: 'UMROH RAMADHAN LAILATUL QADAR',
    flyerDurationBadge: '16 HARI',
    flyerRouteText: 'I\'tikaf 10 Malam Terakhir di Masjidil Haram • Keutamaan Pahala Seperti Haji',
    flyerFreePerks: ['Sahur & Iftar Masakan Indonesia', 'Bimbingan I\'tikaf Khusus', 'Hotel Terhubung Pelataran'],
    pricing: {
      quad: 'Rp 45,9 Jt',
      triple: 'Rp 48,9 Jt',
      double: 'Rp 52,9 Jt'
    },
    hotelInfo: {
      madinah: 'Dallah Taibah ★5 (100m)',
      makkah: 'Swissotel / Pullman Zamzam ★5 (50m)'
    },
    cardTitle: 'Umroh Ramadhan I\'tikaf',
    durationPill: '16 Hari',
    flightPill: 'Direct Saudia',
    flightType: 'Direct',
    availableSeats: 2,
    totalSeats: 40,
    isPopular: true
  }
];

interface PackagesSliderSectionProps {
  onOpenDetailModal: (pkg: PackageScheduleItem) => void;
  onOpenConsultation?: (packageName: string) => void;
  onExploreAllPackages?: () => void;
  onRegisterPackage?: (pkgInfo: {
    name: string;
    category?: string;
    price?: string;
    duration?: string;
    date?: string;
    quadPrice?: string;
    triplePrice?: string;
    doublePrice?: string;
  }) => void;
}

export const PackagesSliderSection: React.FC<PackagesSliderSectionProps> = ({
  onOpenDetailModal,
  onOpenConsultation,
  onExploreAllPackages,
  onRegisterPackage
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'reguler' | 'plus' | 'premium' | 'haji'>('all');
  const [viewMode, setViewMode] = useState<'slider' | 'table'>('slider');
  const [sliderItems, setSliderItems] = useState<SliderPackageItem[]>(SLIDER_PACKAGES);
  const [scheduleList, setScheduleList] = useState<PackageScheduleItem[]>(DETAILED_SCHEDULES);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInViewport, setIsInViewport] = useState(true);

  // Viewport intersection observer to avoid any lag or CPU usage when scrolled away
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { rootMargin: '150px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPackages((firestoreItems) => {
      if (firestoreItems && firestoreItems.length > 0) {
        setScheduleList(firestoreItems);
        const mappedItems: SliderPackageItem[] = firestoreItems.map((item) => {
          let cat: SliderPackageItem['category'] = 'reguler';
          if (item.category === 'haji-khusus') cat = 'haji';
          else if (item.category === 'wisata-halal') cat = 'plus';
          else if (item.category === 'umroh-custom') cat = 'premium';
          else if (item.title.toLowerCase().includes('ramadhan')) cat = 'ramadhan';

          return {
            id: item.id,
            category: cat,
            flyerImage: item.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
            flyerTitle: item.title.toUpperCase(),
            flyerDurationBadge: (item.duration || '9 Hari').toUpperCase(),
            flyerRouteText: item.description || 'Program Ibadah Sesuai Sunnah • Fasilitas Hotel Bintang 5',
            flyerFreePerks: (item.programHighlights && item.programHighlights.length > 0)
              ? item.programHighlights.slice(0, 4)
              : item.features && item.features.length > 0
                ? item.features.map(f => typeof f === 'string' ? f : (f as any).text || '').slice(0, 4)
                : ['FREE Air Zam-zam 5L', 'FREE Perlengkapan Koper', 'Full Board Masakan Nusantara'],
            pricing: {
              quad: item.priceQuad || item.quadPrice || item.price,
              triple: item.priceTriple || item.triplePrice || (item as any).pricing?.triple || item.price,
              double: item.priceDouble || item.doublePrice || (item as any).pricing?.double || item.price
            },
            hotelInfo: {
              madinah: item.hotelMadinah || 'Hotel Bintang 4/5',
              makkah: item.hotelMakkah || 'Hotel Bintang 5 Dekat Masjid'
            },
            cardTitle: item.title,
            durationPill: item.duration || '9 Hari',
            flightPill: item.airline || 'Direct Flight',
            flightType: (item.airline || '').toLowerCase().includes('saudia') || (item.airline || '').toLowerCase().includes('garuda') ? 'Direct' : 'Transit',
            availableSeats: item.availableSeats,
            totalSeats: item.totalSeats,
            isPopular: item.badge?.variant === 'premium' || item.badge?.variant === 'exclusive',
            isPromo: item.badge?.variant === 'saving',
            scheduleItemData: item
          };
        });
        setSliderItems(mappedItems);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredPackages = activeFilter === 'all' 
    ? sliderItems 
    : sliderItems.filter(p => p.category === activeFilter);

  const filteredScheduleList = scheduleList.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'reguler') {
      return item.category === 'umroh-reguler' || item.category === 'tabungan' || item.category === 'badal-umroh' || item.title.toLowerCase().includes('reguler') || item.title.toLowerCase().includes('syawal') || item.title.toLowerCase().includes('amanah');
    }
    if (activeFilter === 'plus') {
      return item.category === 'wisata-halal' || item.title.toLowerCase().includes('plus') || item.title.toLowerCase().includes('wisata');
    }
    if (activeFilter === 'premium') {
      return item.category === 'umroh-custom' || item.title.toLowerCase().includes('vip') || item.title.toLowerCase().includes('private') || item.title.toLowerCase().includes('jum\'atain');
    }
    if (activeFilter === 'haji') {
      return item.category === 'haji-khusus' || item.title.toLowerCase().includes('haji');
    }
    return true;
  });

  const handleScheduleAction = (pkg: PackageScheduleItem) => {
    const targetId = pkg.id === 'pkg-friendly-9d-wy' ? 'pkg-friendly-9d-wy' : pkg.id;
    const targetUrl = `#/detail-paket?id=${encodeURIComponent(targetId)}`;
    window.open(targetUrl, '_blank');
  };

  // Tripled list for seamless infinite marquee effect without stuttering
  const displayPackages = [...filteredPackages, ...filteredPackages, ...filteredPackages];

  // Auto-scroll loop from right to left: ultra slow, butter-smooth delta-timed animation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || viewMode !== 'slider' || !isInViewport) return;

    let animationFrameId: number;
    let lastTime: number | null = null;
    let accumulatedPos = container.scrollLeft;
    // Speed: 20 pixels per second - very slow, gentle, smooth, no jumping/micro-stutter
    const pixelsPerSecond = 20;

    const step = (currentTime: number) => {
      if (lastTime === null) {
        lastTime = currentTime;
      }
      const deltaSeconds = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isPaused && container && !document.hidden) {
        // Safe delta cap to prevent jumps when browser tabs throttle
        accumulatedPos += pixelsPerSecond * Math.min(deltaSeconds, 0.05);

        // Continuous seamless loop across the tripled list
        const oneThird = container.scrollWidth / 3;
        if (oneThird > 0 && accumulatedPos >= oneThird) {
          accumulatedPos -= oneThird;
        }
        container.scrollLeft = accumulatedPos;
      } else if (container) {
        accumulatedPos = container.scrollLeft;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, filteredPackages.length, viewMode, isInViewport]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 360;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleDetailClick = (pkg: SliderPackageItem) => {
    const targetId = pkg.id === 'pkg-friendly-9d-wy' ? 'pkg-friendly-9d-wy' : (pkg.scheduleItemData?.id || pkg.id);
    const targetUrl = `#/detail-paket?id=${encodeURIComponent(targetId)}`;
    window.open(targetUrl, '_blank');
  };

  return (
    <section 
      ref={sectionRef}
      id="katalog-unggulan-section"
      className="py-10 sm:py-16 md:py-20 bg-white text-[#1A1A1A] relative overflow-hidden scroll-mt-24 w-full max-w-full"
      aria-label="Pilihan Paket Umroh ALGHANIM - Katalog Unggulan & Keberangkatan Terdekat"
    >
      <div id="banyak-pilihan-paket" className="absolute -top-24 left-0 pointer-events-none" />
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 space-y-6 sm:space-y-8">
        
        {/* =========================================================================
            HEADER SECTION (Exact matching user request text)
        ========================================================================== */}
        <div className="text-center max-w-4xl mx-auto space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#FAF8F5] border border-[#A67C52]/30 text-[#A67C52] text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] shadow-2xs">
            <span>Katalog Unggulan &amp; Keberangkatan Terdekat</span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Banyak Pilihan Paket Umroh &amp; Haji Khusus
          </h2>
        </div>

        {/* Filter Category Tabs & View Mode Switcher - Full-width flex container */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 pb-1 w-full">
          {/* Category Tabs: Sebaris Elegan Mengikuti Lebar Konten */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none no-scrollbar w-full md:w-auto">
            {[
              { id: 'all', label: 'Semua Paket' },
              { id: 'reguler', label: 'Umroh Reguler' },
              { id: 'plus', label: 'Umroh Plus Wisata' },
              { id: 'premium', label: 'Umroh Premium' },
              { id: 'haji', label: 'Haji Khusus & Furoda' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold shadow-sm'
                    : 'bg-white text-[#1A1A1A] hover:bg-gray-100 border border-gray-200 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Mode Switcher: Slider vs Tabel Jadwal */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs flex-shrink-0 self-center md:self-auto">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'slider'
                  ? 'bg-[#A67C52] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Slider Kartu</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#A67C52] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <TableProperties className="w-4 h-4" />
              <span>Tabel Jadwal</span>
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          CONTENT: TABEL JADWAL ATAU CONTINUOUS SLIDING CAROUSEL (FULL WIDTH)
      ========================================================================== */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-6 sm:mt-8 relative">
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-gray-200 text-[#4D2D18] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4 font-extrabold">Nama Paket</th>
                    <th className="py-4 px-4 font-extrabold">Keberangkatan</th>
                    <th className="py-4 px-4 font-extrabold">Hotel Mekah</th>
                    <th className="py-4 px-4 font-extrabold">Hotel Madinah</th>
                    <th className="py-4 px-4 font-extrabold">Harga (Mulai)</th>
                    <th className="py-4 px-4 font-extrabold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredScheduleList.map((pkg) => {
                    const isFeatured = pkg.id === 'pkg-friendly-9d-wy';

                    return (
                      <tr 
                        key={pkg.id} 
                        className={`hover:bg-[#FAF8F5]/80 transition-colors ${
                          isFeatured ? 'bg-[#FFFDF9]' : ''
                        }`}
                      >
                        {/* Nama Paket */}
                        <td className="py-4 px-4 font-semibold text-gray-900">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span 
                                className="font-bold text-sm text-[#1A1A1A] hover:text-[#A67C52] cursor-pointer"
                                onClick={() => handleScheduleAction(pkg)}
                              >
                                {pkg.title}
                              </span>
                            </div>
                            {pkg.highlightTag && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBE4FF] text-[#5538B5] text-[10px] font-bold">
                                <Landmark className="w-2.5 h-2.5" />
                                <span>{pkg.highlightTag}</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Keberangkatan */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className="font-medium text-gray-900 block">
                              {pkg.departureDate}
                            </span>
                            {pkg.availableSeats > 0 ? (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-extrabold">
                                {pkg.availableSeats} Tersisa
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px] font-bold">
                                Penuh
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Hotel Mekah */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-gray-800 block">
                            {pkg.hotelMakkah}
                          </span>
                        </td>

                        {/* Hotel Madinah */}
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-700 block">
                            {pkg.hotelMadinah || '-'}
                          </span>
                        </td>

                        {/* Biaya Paket Mulai */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-serif-luxury font-bold text-sm sm:text-base text-[#A67C52] block">
                            {pkg.price}
                          </span>
                          <span className="text-[10px] text-gray-500">Sekamar Ber-4</span>
                        </td>

                        {/* Action Buttons: HANYA DETAIL */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleScheduleAction(pkg)}
                              className="py-1.5 px-4 rounded-lg text-xs font-bold text-[#A67C52] bg-[#FAF8F5] hover:bg-[#F3ECE4] border border-[#A67C52]/30 hover:border-[#A67C52] transition-all cursor-pointer shadow-2xs"
                            >
                              Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden px-4 py-2 bg-gray-50/80 border-t border-gray-100 text-[11px] text-gray-500 text-center font-medium">
              ← Geser tabel ke kanan untuk melihat rincian hotel &amp; harga →
            </div>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsPaused(false), 3000);
            }}
            className="flex gap-3.5 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar py-2 sm:py-4 px-1 sm:px-2 cursor-grab active:cursor-grabbing"
            style={{ scrollBehavior: 'auto' }}
          >
          {displayPackages.map((pkg, index) => {
            const isAlmostFull = pkg.availableSeats <= 4;

            return (
              <div
                key={`${pkg.id}-${index}`}
                style={{ contentVisibility: 'auto' }}
                className="flex-shrink-0 w-[285px] sm:w-[320px] md:w-[335px] bg-white rounded-2xl border border-gray-200 hover:border-[#A67C52]/50 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Header with Full Elegant Fit and Badges */}
                <div className="relative aspect-[16/11] sm:h-64 w-full overflow-hidden bg-gray-950 flex items-center justify-center">
                  <img
                    src={pkg.flyerImage}
                    alt={pkg.cardTitle}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Dark Gradient for readability without obscuring flyer details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

                  {/* Top Tag Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-black/75 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C5A059]" />
                      {pkg.durationPill}
                    </span>

                    {pkg.isPopular ? (
                      <span className="px-2.5 py-1 rounded-lg bg-[#A67C52] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white text-white" />
                        Favorit
                      </span>
                    ) : pkg.isPromo ? (
                      <span className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Promo
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Berjadwal
                      </span>
                    )}
                  </div>

                  {/* Compact Sleek Price Pill Overlay on Image Bottom */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/15">
                    <div>
                      <span className="text-[9px] uppercase font-medium text-gray-300 block tracking-wider leading-none mb-0.5">
                        Mulai Dari
                      </span>
                      <div className="font-serif-luxury text-lg sm:text-xl font-bold text-[#DFC386] tracking-tight leading-tight">
                        {pkg.pricing.quad}
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold text-gray-200 bg-white/10 px-2 py-0.5 rounded-md">
                      Sekamar Ber-4
                    </span>
                  </div>
                </div>

                {/* Card Content: Clean, High-Readability Specs */}
                <div className="p-4 sm:p-4.5 space-y-3.5 bg-white flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Title */}
                    <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1A1A1A] group-hover:text-[#A67C52] transition-colors leading-snug line-clamp-1">
                      {pkg.cardTitle}
                    </h3>

                    {/* Meta Specs Grid (Hotels & Facilities) */}
                    <div className="bg-[#FBFBFB] border border-gray-100 rounded-xl p-2.5 space-y-2 text-xs">
                      {/* Hotel Makkah */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                        <span className="text-[11px] text-gray-600 truncate">
                          <strong className="text-gray-800 font-semibold">Makkah:</strong> {pkg.hotelInfo.makkah}
                        </span>
                      </div>

                      {/* Hotel Madinah */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                        <span className="text-[11px] text-gray-600 truncate">
                          <strong className="text-gray-800 font-semibold">Madinah:</strong> {pkg.hotelInfo.madinah}
                        </span>
                      </div>
                    </div>

                    {/* Free Perks Tags */}
                    {pkg.flyerFreePerks && pkg.flyerFreePerks.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pkg.flyerFreePerks.slice(0, 2).map((perk, pIdx) => (
                          <span
                            key={pIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4EFEA] text-[#704828] text-[10px] font-medium"
                          >
                            <Check className="w-2.5 h-2.5 text-[#A67C52]" />
                            {perk}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Seat Indicator */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-gray-500 font-medium">Ketersediaan Kursi</span>
                      <span className={`font-bold ${isAlmostFull ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {isAlmostFull ? `Tersisa ${pkg.availableSeats} Seat!` : `Tersedia (${pkg.availableSeats} Seat)`}
                      </span>
                    </div>
                  </div>

                  {/* Action CTA: Hanya Tombol Detail */}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleDetailClick(pkg)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#A67C52] hover:text-white bg-[#FAF8F5] hover:bg-[#A67C52] border border-[#A67C52]/40 transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs"
                      title="Lihat Detail Paket Lengkap"
                    >
                      <span>Lihat Detail Paket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        )}

        {/* Clean Center Action Button to View Full Catalog */}
        {onExploreAllPackages && (
          <div className="mt-8 text-center px-4">
            <button
              onClick={onExploreAllPackages}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Lihat Semua Paket di Katalog Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Helper Indicator for Mobile */}
        <div className="flex sm:hidden items-center justify-center gap-2 pt-4 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] animate-ping" />
          <span>Geser untuk melihat pilihan paket lainnya</span>
        </div>
      </div>
    </section>
  );
};
