import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  Share2, 
  FileText, 
  Download, 
  Printer, 
  Plane, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  ExternalLink, 
  MessageCircle, 
  Copy, 
  CheckCircle2, 
  X, 
  Info,
  Youtube,
  Send,
  ShieldCheck,
  Award,
  ChevronDown,
  Sparkles,
  Gift,
  UserCheck,
  Video,
  Droplet,
  Landmark
} from 'lucide-react';
import { PackageScheduleItem, ItineraryDayItem, FlightScheduleItem } from '../types';
import { OFFICIAL_WA_NUMBER, DETAILED_SCHEDULES, OFFICIAL_PACKAGE_FACILITIES, OFFICIAL_ACCOMMODATION } from '../data/packagesData';
import { subscribeToPackages } from '../lib/firestoreService';
import { 
  downloadOrOpenPackageFlyer, 
  downloadOrOpenPackageItinerary, 
  isCustomFlyerAvailable, 
  isCustomItineraryAvailable 
} from '../utils/packageDocManager';
import { jsPDF } from 'jspdf';

interface PackageDetailPageProps {
  packageId?: string | null;
  onBackToHome: () => void;
  onRegisterPackage?: (pkg: PackageScheduleItem) => void;
  onOpenConsultation?: (topic: string) => void;
}

export const PackageDetailPage: React.FC<PackageDetailPageProps> = ({
  packageId,
  onBackToHome,
  onRegisterPackage,
  onOpenConsultation
}) => {
  const [packagesList, setPackagesList] = useState<PackageScheduleItem[]>(DETAILED_SCHEDULES);

  // Subscribe to real-time package updates from Firestore (synchronizes with Admin CMS)
  useEffect(() => {
    const unsubscribe = subscribeToPackages((items) => {
      if (items && items.length > 0) {
        setPackagesList(items);
      }
    });
    return () => unsubscribe();
  }, []);

  // Find target package from live packages list or fallback
  const pkg: PackageScheduleItem = packagesList.find(p => p.id === packageId) 
    || (packageId?.toLowerCase().includes('badal') ? packagesList.find(p => p.category === 'badal-umroh' || p.id.includes('badal') || p.title.toLowerCase().includes('badal')) : null)
    || packagesList[0];

  // Check if current package is Badal Umroh
  const isBadal = Boolean(
    pkg.category?.toLowerCase().includes('badal') || 
    pkg.id?.includes('badal') || 
    pkg.title.toLowerCase().includes('badal')
  );

  // Dynamic Facilities / Perks for this specific package (Real-time synced with Admin CMS)
  const packagePerks: string[] = (pkg.programHighlights && pkg.programHighlights.length > 0)
    ? pkg.programHighlights
    : (pkg.features && pkg.features.length > 0)
      ? pkg.features.map(f => typeof f === 'string' ? f : (f as any).text || '')
      : isBadal
        ? [
            '1 Jiwa 1 Pembadal (Muthawwif Mukim Khusus)',
            'Dokumentasi Video Lengkap (Niat, Thawaf, Sa\'i & Tahallul)',
            'Sertifikat Badal Umroh Resmi Berbingkai Kaca',
            'Air Zam-zam 5 Liter Murni Berbarcode Resmi'
          ]
        : OFFICIAL_PACKAGE_FACILITIES.freePerks;

  const packageInclusions: string[] = isBadal
    ? [
        'Pelaksanaan ibadah umroh lengkap (Niat di Miqat, Thawaf, Sa\'i, Tahallul)',
        'Muthawwif amanah penuntut ilmu / mukim di Makkah & Madinah',
        'Dokumentasi video rekaman niat ihram atas nama almarhum/ah & manasik lengkap',
        'Sertifikat resmi tanda pelaksanaan badal umroh berbingkai kaca',
        'Air zam-zam 5 liter murni berbarcode resmi & souvenir dikirim ke alamat rumah',
        'Laporan progress dan konsultasi langsung via WhatsApp'
      ]
    : OFFICIAL_PACKAGE_FACILITIES.included;

  const packageExclusions: string[] = isBadal
    ? [
        'Tiket pesawat jamaah (program khusus amanah pembadalan di Tanah Suci)',
        'Akomodasi hotel jamaah di Saudi',
        'Paspor dan visa pribadi pemesan'
      ]
    : OFFICIAL_PACKAGE_FACILITIES.excluded;

  // States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloadingItinerary, setIsDownloadingItinerary] = useState(false);
  const [isDownloadingFlyer, setIsDownloadingFlyer] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Construct current shareable link
  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}#/detail-paket?id=${pkg.id}`
    : `https://alghanim.co.id/#/detail-paket?id=${pkg.id}`;

  const shareText = `Assalamu'alaikum, cek detail Paket ${pkg.title} (${pkg.departureDate}) bersama AL-GHANIM Islamic Tour. Akses Itinerary & Flyer resmi di sini: ${currentUrl}`;
  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pkg.title} - AL-GHANIM Islamic Tour`,
          text: `Detail Paket ${pkg.title} (${pkg.departureDate}) bersama AL-GHANIM. Buka Itinerary & Flyer lengkap:`,
          url: currentUrl
        });
      } catch {
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  // Download or Open Itinerary PDF (Prioritizes Admin-uploaded PDF/Word/Canva, falls back to Al-Ghanim generator)
  const handleDownloadItineraryPdf = () => {
    setIsDownloadingItinerary(true);
    setDownloadNotice(isCustomItineraryAvailable(pkg) ? 'Membuka dokumen resmi Itinerary...' : 'Sedang mengunduh dokumen PDF Itinerary...');
    setTimeout(() => setDownloadNotice(null), 3500);

    try {
      downloadOrOpenPackageItinerary(pkg);
    } catch (e) {
      console.error('PDF error', e);
      window.print();
    } finally {
      setIsDownloadingItinerary(false);
    }
  };

  // Download or Open Flyer PDF (Prioritizes Admin-uploaded Flyer/Canva, falls back to Al-Ghanim generator)
  const handleDownloadFlyerPdf = () => {
    setIsDownloadingFlyer(true);
    setDownloadNotice(isCustomFlyerAvailable(pkg) ? 'Membuka dokumen resmi Brosur Flyer...' : 'Sedang mengunduh dokumen PDF Flyer Brosur...');
    setTimeout(() => setDownloadNotice(null), 3500);

    try {
      downloadOrOpenPackageFlyer(pkg);
    } catch (e) {
      console.error('Flyer PDF error', e);
      window.print();
    } finally {
      setIsDownloadingFlyer(false);
    }
  };

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pkg]);

  const isHaji = pkg.category?.toLowerCase().includes('haji') || pkg.id?.includes('haji') || pkg.title.toLowerCase().includes('haji');
  const isPlus = pkg.category?.toLowerCase().includes('plus') || pkg.title.toLowerCase().includes('plus') || pkg.title.toLowerCase().includes('wisata');
  
  const bannerCategoryText = isHaji 
    ? 'HAJI RESMI KEMENAG RI' 
    : isPlus 
      ? 'UMROH PLUS WISATA HALAL' 
      : 'PROGRAM UMROH BERKAH';

  const displayTitle = pkg.seriesTitle 
    ? pkg.seriesTitle.replace(/^(UMROH|HAJI)\s+/i, '')
    : pkg.title.replace(/\([^)]*\)/g, '').trim().toUpperCase();

  const heroBackdrop = isHaji
    ? 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1400&q=85'
    : 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1400&q=85';

  const handleDaftarClick = () => {
    if (onRegisterPackage) {
      onRegisterPackage(pkg);
    } else {
      window.location.hash = `#/kontak?pkg=${encodeURIComponent(pkg.id || pkg.title)}`;
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans-luxury pb-10 selection:bg-[#C5A059] selection:text-white">
      
      {/* =========================================================================
          TOP STICKY HEADER WITH AL-GHANIM BRANDING (GAMBAR 5)
      ========================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-3 sm:px-4 py-2.5 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Kembali ke Beranda"
            title="Kembali ke Katalog Paket"
          >
            <ArrowLeft className="w-4 h-4 text-gray-800" />
          </button>
          
          <div className="text-center">
            <div className="font-serif-luxury font-black text-sm tracking-wider text-[#1A1A1A] leading-tight">
              ALGHANIM ISLAMIC TOUR
            </div>
            <p className="text-[10px] text-[#A67C52] font-bold tracking-wider uppercase leading-none">
              Perjalanan Suci Penuh Berkah • PPIU No. 1030/2019
            </p>
          </div>

          <div className="w-9" />
        </div>
      </header>

      {/* Floating Download Toast */}
      {downloadNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-white px-4 py-2 rounded-full shadow-2xl border border-[#C5A059] flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Main Container - Ventour Style Mobile-Friendly Centered Canvas */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 space-y-4">
        
        {/* =========================================================================
            HERO CARD BANNER (GAMBAR 2, 6 & 7)
            Dynamic Title & Image adapting to Umroh or Haji Furoda
        ========================================================================== */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-gray-900">
          
          {/* Background Image of Ka'bah / Haram */}
          <div className="relative h-96 sm:h-[430px] w-full overflow-hidden">
            <img 
              src={heroBackdrop} 
              alt={pkg.title}
              className="w-full h-full object-cover opacity-60 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
            
            {/* Center Curved Banner (Brown box matching Gambar 2 & 7) */}
            <div className="absolute inset-x-4 top-10 sm:top-12 bottom-6 flex flex-col justify-between">
              
              <div className="bg-[#4D2D18]/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 text-white text-center shadow-2xl border border-white/10 space-y-3 sm:space-y-4 my-auto">
                
                {/* Dynamic Category Tag */}
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#E0B880] uppercase">
                    {bannerCategoryText}
                  </p>
                  <h1 className="font-serif-luxury text-2xl sm:text-4xl font-black text-white tracking-wider drop-shadow-md uppercase leading-tight">
                    {displayTitle}
                  </h1>
                </div>

                {/* Big Date Banner */}
                <div className="bg-white text-[#2B1B12] rounded-full py-2 px-4 max-w-xs mx-auto shadow-md">
                  <p className="font-sans-luxury text-xs sm:text-sm font-extrabold tracking-wider uppercase">
                    {pkg.departureDate}
                  </p>
                </div>

                {/* 3 Column Spec: Makkah, Madinah, Maskapai */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-center">
                  <div>
                    <span className="block text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">
                      MAKKAH
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white truncate mt-0.5">
                      {pkg.hotelMakkah.split('/')[0].trim()}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">
                      MADINAH
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white truncate mt-0.5">
                      {pkg.hotelMadinah.split('/')[0].trim()}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">
                      MASKAPAI
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white truncate mt-0.5 flex items-center justify-center gap-1">
                      <Plane className="w-3 h-3 text-[#E0B880] inline" />
                      <span>{pkg.airlineLogoText || pkg.airline.split(' ')[0]}</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TITLE, HIGHLIGHT TAG & SHARE BUTTON (GAMBAR 2 & 6)
        ========================================================================== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-200/80 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 flex-1">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                {pkg.title}
              </h2>
              {pkg.highlightTag && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE4FF] text-[#5538B5] text-xs font-semibold">
                  <Landmark className="w-3.5 h-3.5 text-[#5538B5]" />
                  <span>{pkg.highlightTag}</span>
                </div>
              )}
            </div>

            {/* Circular Share Button (Gambar 2 & 6) */}
            <button
              onClick={handleNativeShare}
              aria-label="Share Link Paket"
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex-shrink-0"
              title="Bagikan Tautan Paket Ini"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* =========================================================================
              ACTION BUTTONS: DIRECT PDF ITINERARY & FLYER DOWNLOAD (USER REQUEST 5 & GAMBAR 2)
              Clicking directly opens/downloads the official PDF document!
          ========================================================================== */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Itinerary Direct Download Button */}
            <button
              onClick={handleDownloadItineraryPdf}
              disabled={isDownloadingItinerary}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5E3BEE] to-[#7B52F4] hover:from-[#512FE0] hover:to-[#6E44EB] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.98] disabled:opacity-75"
              title="Download PDF Itinerary Lengkap"
            >
              <span>{isDownloadingItinerary ? 'Mengunduh...' : 'Itinerary (PDF)'}</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-white" />
              </span>
            </button>

            {/* Flyer Direct Download Button */}
            <button
              onClick={handleDownloadFlyerPdf}
              disabled={isDownloadingFlyer}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5E3BEE] to-[#7B52F4] hover:from-[#512FE0] hover:to-[#6E44EB] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.98] disabled:opacity-75"
              title="Download PDF Flyer Brosur Resmi"
            >
              <span>{isDownloadingFlyer ? 'Mengunduh...' : 'Flyer (PDF)'}</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Download className="w-3.5 h-3.5 text-white" />
              </span>
            </button>
          </div>

          {/* Pricing Highlight Pill (Gambar 4) */}
          <div className="bg-[#FAF8F5] border border-[#A67C52]/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-500 font-medium block">Biaya Paket Quad Room (Mulai)</span>
              <div className="flex items-baseline gap-2">
                {pkg.originalPrice && (
                  <span className="text-xs text-red-500 line-through font-semibold">
                    {pkg.originalPrice}
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-bold text-[#A67C52]">
                  {pkg.price}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {pkg.availableSeats > 0 ? `Tersisa ${pkg.availableSeats} Seat` : 'Seat Penuh'}
              </span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            AKSI PENDAFTARAN (PERKECIL, LABEL "Daftar", PINTU KELUAR KE HALAMAN KONTAK)
        ========================================================================== */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-gray-900 block">
              Pendaftaran Seat Jamaah
            </span>
            <span className="text-[11px] text-gray-500">
              DP {isHaji ? 'Rp 20 Jt' : 'Mulai Rp 5 Jt'} • Formulir Pendaftaran Terbimbing
            </span>
          </div>

          <button
            onClick={handleDaftarClick}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D9A74A] to-[#C5A059] hover:brightness-105 text-[#2B1B12] font-black text-xs sm:text-sm tracking-wide shadow-sm transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Daftar
          </button>
        </div>

        {/* =========================================================================
            KETENTUAN PELAKSANAAN ATAU FLIGHT SCHEDULE RESMI (NO ALAY ICONS)
        ========================================================================== */}
        {isBadal ? (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-200/80 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#A67C52]" />
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Keunggulan &amp; Fasilitas Utama Badal Umroh (Resmi Al-Ghanim)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {packagePerks.map((perk, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#FAF9F7] p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-200/80 space-y-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-[#A67C52]" />
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Flight Schedule
              </h3>
            </div>

            <div className="space-y-2 bg-[#F9F9FB] rounded-2xl p-4 border border-gray-100">
              {(pkg.flightSchedules || [
                { flightNo: 'WY 850', date: '23SEP', route: 'CGKMCT', time: '1425 1905' },
                { flightNo: 'WY 673', date: '23SEP', route: 'MCTJED', time: '2145 0005 (+1)' },
                { flightNo: 'WY 676', date: '30SEP', route: 'JEDMCT', time: '1800 2215' },
                { flightNo: 'WY 849', date: '01OCT', route: 'MCTCGK', time: '0150 1255' }
              ]).map((flight, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 font-mono py-1 border-b border-gray-100 last:border-0">
                  <Plane className="w-4 h-4 text-[#A67C52] rotate-45 flex-shrink-0" />
                  <span className="font-bold text-gray-900">{flight.flightNo}</span>
                  <span className="text-gray-500">{flight.date}</span>
                  <span className="font-semibold text-[#1A1A1A]">{flight.route}</span>
                  <span className="text-gray-600 ml-auto font-sans text-xs">
                    {flight.departureTime && flight.arrivalTime 
                      ? `${flight.departureTime} - ${flight.arrivalTime}` 
                      : flight.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            HOTEL / LOKASI PELAKSANAAN SECTION (NO ALAY ICONS)
        ========================================================================== */}
        {isBadal ? (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-200/80 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#A67C52]" />
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Lokasi Pelaksanaan Ibadah &amp; Ziarah
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-gray-100 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#A67C52] tracking-wider">Makkah Al-Mukarramah</span>
                <h4 className="font-bold text-sm text-gray-900">Masjidil Haram &amp; Miqat Syar'i</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Pelaksanaan rukun umroh (Ihram di Miqat Bir Ali / Tan'im, Thawaf, Sa'i, dan Tahallul) langsung di pelataran Ka'bah Masjidil Haram.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-gray-100 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#A67C52] tracking-wider">Madinah Al-Munawwarah</span>
                <h4 className="font-bold text-sm text-gray-900">Masjid Nabawi &amp; Raudhah</h4>
                <p className="text-xs text-gray-600 leading-relaxed">Ziarah makam Rasulullah ﷺ dan para sahabat serta doa khusus bagi almarhum/ah di Raudhah Syarifah.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-200/80 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#A67C52]" />
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Hotel
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hotel Makkah Card */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col group">
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={pkg.hotelMakkahDetail?.image || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80"}
                    alt={pkg.hotelMakkahDetail?.name || pkg.hotelMakkah}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
                    Makkah
                  </div>
                </div>
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase">
                      {pkg.hotelMakkahDetail?.name || pkg.hotelMakkah}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {pkg.hotelDistanceMakkah || 'Dekat Pelataran Masjidil Haram'}
                    </p>
                  </div>
                  <div className="pt-1">
                    <a
                      href={pkg.hotelMakkahDetail?.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(pkg.hotelMakkah)}+Makkah`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-[#A67C52]/10 hover:text-[#A67C52] text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-gray-200"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Lihat Lokasi di Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Hotel Madinah Card */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col group">
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={pkg.hotelMadinahDetail?.image || "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=600&q=80"}
                    alt={pkg.hotelMadinahDetail?.name || pkg.hotelMadinah}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
                    Madinah
                  </div>
                </div>
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase">
                      {pkg.hotelMadinahDetail?.name || pkg.hotelMadinah}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Dekat Pintu Gerbang Masjid Nabawi
                    </p>
                  </div>
                  <div className="pt-1">
                    <a
                      href={pkg.hotelMadinahDetail?.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(pkg.hotelMadinah)}+Madinah`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-[#A67C52]/10 hover:text-[#A67C52] text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-gray-200"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Lihat Lokasi di Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PROGRAM HIGHLIGHTS & FASILITAS RESMI (NO ALAY ICONS, DYNAMIC SYNC)
        ========================================================================== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-200/80 space-y-5">
          {/* Free Perks / Highlights Banner (Ditampilkan untuk paket non-badal, karena Badal sudah tampil di section utama di atas) */}
          {!isBadal && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#A67C52]/15 via-[#A67C52]/10 to-amber-50/50 border border-[#A67C52]/30">
              <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] mb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A67C52]" /> Fasilitas Istimewa &amp; Free Tambahan Resmi:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-semibold text-emerald-800">
                {packagePerks.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white/95 p-2.5 rounded-xl border border-emerald-200 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug break-words">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fasilitas Termasuk */}
            <div className="p-4 rounded-2xl bg-[#FBFBFB] border border-gray-200">
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Fasilitas Sudah Termasuk (Inclusions)
              </h4>
              <ul className="space-y-2 text-xs text-gray-700">
                {packageInclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fasilitas Belum Termasuk */}
            <div className="p-4 rounded-2xl bg-[#FBFBFB] border border-gray-200">
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 mb-3 flex items-center gap-2">
                <X className="w-4 h-4 text-rose-500" />
                Belum Termasuk (Exclusions)
              </h4>
              <ul className="space-y-2 text-xs text-gray-700">
                {packageExclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold flex-shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200 text-[11px] text-gray-500">
                <p className="font-semibold text-gray-800 mb-1">Catatan Penting:</p>
                <p>
                  {isBadal 
                    ? 'Badal Umroh dilaksanakan dengan penuh amanah oleh asatidz/pembadal mukim berpengalaman (satu pembadal khusus untuk satu nama jiwa).' 
                    : 'Paspor berlaku minimal 7 bulan sebelum keberangkatan. Biaya dapat berubah sewaktu-waktu mengikuti kebijakan maskapai & regulasi pemerintah Arab Saudi.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TATA CARA PENDAFTARAN & RESERVASI (JELAS, SEDERHANA, TANPA FORM PENGISIAN)
        ========================================================================== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-200/80 space-y-4">
          <div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#A67C52]/10 text-[#A67C52] font-bold uppercase tracking-wider">
              Panduan Praktis Jamaah
            </span>
            <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1A1A1A] mt-1">
              Tata Cara Pendaftaran &amp; Reservasi
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Proses mudah, cepat, dan transparan tanpa perlu mengisi formulir rumit di website:
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF9F7] border border-gray-100">
              <div className="w-7 h-7 rounded-xl bg-[#A67C52] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                1
              </div>
              <div className="text-xs text-gray-700">
                <p className="font-bold text-[#1A1A1A]">Konsultasi Kuota &amp; Jadwal</p>
                <p className="text-gray-500">Hubungi konsultan resmi AL-GHANIM melalui WhatsApp untuk memastikan ketersediaan kamar dan kursi penerbangan.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF9F7] border border-gray-100">
              <div className="w-7 h-7 rounded-xl bg-[#A67C52] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                2
              </div>
              <div className="text-xs text-gray-700">
                <p className="font-bold text-[#1A1A1A]">Kirimkan Dokumen via WhatsApp</p>
                <p className="text-gray-500">Cukup kirimkan foto KTP, Kartu Keluarga, dan Paspor yang masih berlaku (minimal 7 bulan sebelum keberangkatan).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF9F7] border border-gray-100">
              <div className="w-7 h-7 rounded-xl bg-[#A67C52] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                3
              </div>
              <div className="text-xs text-gray-700">
                <p className="font-bold text-[#1A1A1A]">Booking Seat (DP Resmi)</p>
                <p className="text-gray-500">Pembayaran DP resmi langsung ke rekening perusahaan PT. Al-Ghanimah Berkah Bersama dengan kuitansi &amp; bukti booking sah.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF9F7] border border-gray-100">
              <div className="w-7 h-7 rounded-xl bg-[#A67C52] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                4
              </div>
              <div className="text-xs text-gray-700">
                <p className="font-bold text-[#1A1A1A]">Bimbingan Manasik &amp; Berangkat</p>
                <p className="text-gray-500">Mengikuti pembekalan manasik intensif, pembagian koper &amp; perlengkapan, serta berangkat didampingi Muthawwif berpengalaman.</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FOOTER BRANDING (GAMBAR 5)
        ========================================================================== */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 text-center space-y-3">
          <div className="space-y-0.5">
            <h4 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
              AL-GHANIM
            </h4>
            <p className="text-xs text-gray-500 font-medium tracking-wider">
              Umroh | Moslem Tour
            </p>
            <p className="text-[11px] text-[#A67C52] font-semibold">
              Izin PPIU No. 1030 Tahun 2019 • Akreditasi A Kemenag RI
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <a 
              href="https://wa.me/628131670218" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href="https://www.instagram.com/alghanimislamictour/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#E1306C] text-white flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Instagram"
            >
              <span className="font-bold text-xs">IG</span>
            </a>
            <a 
              href="https://www.youtube.com/@alghanimtour" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MODAL 1: SHARE POPUP (GAMBAR 6)
          Direct Copy Link, WhatsApp Button, Social Channels
      ========================================================================== */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-5 text-[#1A1A1A] relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#5E3BEE]" />
                <span>Bagikan Paket Umroh</span>
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanatory text */}
            <p className="text-xs text-gray-600 leading-relaxed">
              Bagikan tautan paket <strong>{pkg.title}</strong> ini ke keluarga, rekan, atau grup WhatsApp agar bisa mempelajari itinerary dan flyer resmi sebelum mendaftar.
            </p>

            {/* URL Input Box with Copy Button */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-transparent text-xs text-gray-700 outline-none truncate font-mono px-1"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                  copiedLink 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#5E3BEE] hover:bg-[#512FE0] text-white'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Share Grid */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Pilih Aplikasi Berbagi:
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* WhatsApp (Paling Utama) */}
                <a
                  href={waShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 flex flex-col items-center justify-center gap-1.5 transition-transform hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold">WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 flex flex-col items-center justify-center gap-1.5 transition-transform hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                    <span className="font-bold text-xs">f</span>
                  </div>
                  <span className="text-[11px] font-bold">Facebook</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 flex flex-col items-center justify-center gap-1.5 transition-transform hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <span className="font-bold text-xs">𝕏</span>
                  </div>
                  <span className="text-[11px] font-bold">Twitter/X</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 flex flex-col items-center justify-center gap-1.5 transition-transform hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0088cc] text-white flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold">Telegram</span>
                </a>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ITINERARY VIEWER & PDF DOWNLOAD (GAMBAR 3)
          Exact match to Itinerary FRIENDLY 9D WY 23 Sep - 01 Oct 2026
      ========================================================================== */}
      {isItineraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden my-auto text-[#1A1A1A]">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#FAF8F5] border-b border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#A67C52] border border-gray-200 font-bold uppercase tracking-wider">
                  Rencana Perjalanan Resmi
                </span>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1A1A1A] mt-0.5">
                  ITINERARY {pkg.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadItineraryPdf}
                  disabled={isDownloadingItinerary}
                  className="py-1.5 px-3 rounded-xl bg-[#5E3BEE] hover:bg-[#512FE0] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloadingItinerary ? 'Mengunduh...' : 'Download PDF'}</span>
                </button>
                <button
                  onClick={() => setIsItineraryModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - PDF Document Simulation */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white text-xs sm:text-sm">
              
              {/* Document Header Banner (Like Gambar 3) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#A67C52] text-white flex items-center justify-center font-serif-luxury font-black text-sm">
                      AG
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight">AL-GHANIM ISLAMIC TOUR</h4>
                      <p className="text-[10px] text-gray-500">PT. Al-Ghanimah Berkah Bersama (PPIU No. 1030/2019)</p>
                    </div>
                  </div>
                  <h2 className="font-serif-luxury text-lg sm:text-xl font-extrabold text-[#A67C52] pt-1">
                    ITINERARY UMROH {pkg.title}
                  </h2>
                  <p className="text-xs text-gray-600 font-medium">
                    {pkg.departureDate} (9 Hari Perjalanan Ibadah)
                  </p>
                </div>

                {/* Flight Box Header (Gambar 3) */}
                <div className="bg-[#FAF8F5] border border-[#A67C52]/30 rounded-xl p-3 text-[11px] font-mono space-y-1 text-gray-700">
                  <span className="font-bold text-[#A67C52] block font-sans text-xs">Penerbangan (Oman Air):</span>
                  <div>WY 850 23SEP CGKMCT 1425 1905</div>
                  <div>WY 673 23SEP MCTJED 2145 0005 (+1)</div>
                  <div>WY 676 30SEP JEDMCT 1800 2215</div>
                  <div>WY 849 01OCT MCTCGK 0150 1255</div>
                </div>
              </div>

              {/* Day-by-Day Detailed Rows (Gambar 3) */}
              <div className="space-y-5">
                {(pkg.itineraryDays || []).map((dayItem) => (
                  <div key={dayItem.day} className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pb-4 border-b border-gray-100 last:border-0">
                    
                    {/* Left: Day Badge & Time & Image */}
                    <div className="sm:col-span-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-white text-xs font-black uppercase tracking-wider">
                          DAY {dayItem.day}
                        </span>
                        {dayItem.meals && (
                          <span className="text-[11px] font-semibold text-[#A67C52] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#A67C52]/20">
                            {dayItem.meals}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-gray-800">
                        {dayItem.dayName}
                      </p>
                      {dayItem.time && (
                        <p className="text-[10px] text-gray-500 font-mono">
                          {dayItem.time}
                        </p>
                      )}
                      {dayItem.image && (
                        <div className="rounded-xl overflow-hidden h-24 w-full bg-gray-100 border border-gray-200">
                          <img 
                            src={dayItem.image} 
                            alt={dayItem.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Right: Description Content */}
                    <div className="sm:col-span-8 space-y-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                        {dayItem.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed text-justify">
                        {dayItem.desc}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div className="bg-gray-50 rounded-xl p-3.5 text-[11px] text-gray-500 space-y-1 border border-gray-200">
                <p className="font-semibold text-gray-700">Catatan Operasional:</p>
                <p>Jadwal dan rute ziarah dapat berubah sewaktu-waktu menyesuaikan regulasi muassasah dan otoritas bandara Arab Saudi tanpa mengurangi hak dan kenyamanan ibadah jamaah.</p>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Dokumen resmi AL-GHANIM Tour Garut
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadItineraryPdf}
                  className="py-2 px-4 rounded-xl bg-[#5E3BEE] hover:bg-[#512FE0] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: FLYER VIEWER & PDF DOWNLOAD (GAMBAR 4)
          Exact match to Flyer FRIENDLY 9D WY (Harga Quad, Triple, Double, Promo)
      ========================================================================== */}
      {isFlyerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden my-auto text-[#1A1A1A]">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#FAF8F5] border-b border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#A67C52] border border-gray-200 font-bold uppercase tracking-wider">
                  Flyer Promosi Resmi
                </span>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1A1A1A] mt-0.5">
                  FLYER {pkg.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="py-1.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
                <button
                  onClick={() => setIsFlyerModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Visual Flyer Representation (Gambar 4) */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#F9F6F0] text-xs sm:text-sm">
              
              {/* Flyer Art Card */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-[#A67C52]/20 space-y-5 relative overflow-hidden">
                
                {/* Brand Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#A67C52] text-white flex items-center justify-center font-serif-luxury font-black text-sm">
                      AG
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 tracking-wide">AL-GHANIM ISLAMIC TOUR</h4>
                      <p className="text-[10px] text-gray-500">PT. AL-GHANIMAH BERKAH BERSAMA</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#A67C52] font-semibold bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#A67C52]/30">
                    IZIN PPIU No. 1030/2019
                  </span>
                </div>

                {/* Big Flyer Hero Title (Gambar 4) */}
                <div className="text-center space-y-1 py-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#A67C52] font-bold">
                    PROGRAM 9 HARI
                  </p>
                  <h2 className="font-serif-luxury text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
                    UMROH FRIENDLY
                  </h2>
                  <div className="inline-flex items-center gap-1 bg-[#A67C52] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase mt-1">
                    <Calendar className="w-3 h-3 inline text-white" />
                    <span>{pkg.departureDate}</span>
                  </div>
                </div>

                {/* Pricing Box (Gambar 4) */}
                <div className="bg-gradient-to-r from-[#FAF6F0] to-[#F5EFE6] border-2 border-[#A67C52]/40 rounded-2xl p-5 text-center space-y-3 shadow-inner">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Biaya Kamar Quad (Sekamar Ber-4)</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-red-500 line-through font-bold">Rp 31,9 Jt</span>
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#A67C52]">
                        Rp 27,9 Jt
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      Diskon Spesial Rp 4.000.000 (Terbatas)
                    </span>
                  </div>

                  {/* Triple & Double Room Option */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#A67C52]/20 text-xs">
                    <div className="bg-white/80 rounded-xl p-2.5 border border-gray-200">
                      <p className="text-gray-500 text-[10px]">Triple Room (Ber-3)</p>
                      <p className="font-bold text-gray-900 text-sm">Rp 34,9 Jt</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-2.5 border border-gray-200">
                      <p className="text-gray-500 text-[10px]">Double Room (Ber-2)</p>
                      <p className="font-bold text-gray-900 text-sm">Rp 35,4 Jt</p>
                    </div>
                  </div>
                </div>

                {/* Hotel & Maskapai Specs */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">HOTEL MAKKAH</span>
                    <p className="font-bold text-gray-800 mt-0.5">Maysan Al Maqam</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">HOTEL MADINAH</span>
                    <p className="font-bold text-gray-800 mt-0.5">ODST</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">MASKAPAI</span>
                    <p className="font-bold text-gray-800 mt-0.5">Oman Air (WY)</p>
                  </div>
                </div>

                {/* Termasuk & Tidak Termasuk */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] pt-2">
                  <div className="space-y-1.5">
                    <p className="font-bold text-emerald-800 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Biaya Sudah Termasuk:
                    </p>
                    <ul className="space-y-1 text-gray-600 pl-4 list-disc">
                      <li>Tiket Pesawat PP Internasional</li>
                      <li>Visa Umroh Resmi Kemenag</li>
                      <li>Hotel Bintang 4/5 Dekat Masjid</li>
                      <li>Makan 3x Sehari Fullboard Buffet</li>
                      <li>Transportasi Bus Full AC Executive</li>
                      <li>Muthawif & Tour Leader Bersertifikat</li>
                      <li>Ziarah Makkah, Madinah & Museum</li>
                      <li>Air Zam-zam 5 Liter & Lounge Bandara</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-bold text-gray-700 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-gray-500" />
                      Biaya Tidak Termasuk:
                    </p>
                    <ul className="space-y-1 text-gray-600 pl-4 list-disc">
                      <li>Pembuatan Paspor Baru / Perpanjangan</li>
                      <li>Vaksinasi Meningitis / Polio</li>
                      <li>Pengeluaran Pribadi (Laundry, Room Service)</li>
                      <li>Kelebihan Bagasi Pesawat</li>
                    </ul>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Pendaftaran &amp; Konsultasi: 0813-1670-218
              </span>
              <a
                href={`https://wa.me/628131670218?text=${encodeURIComponent(`Assalamu'alaikum Admin AL-GHANIM, saya ingin booking/daftar Paket ${pkg.title}. Mohon bantu proses administrasinya.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Daftar / Konsultasi via WA</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
