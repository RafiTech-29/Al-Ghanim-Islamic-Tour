import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plane, 
  Building2, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle, 
  Tag, 
  ShieldCheck, 
  AlertCircle, 
  Star,
  Table as TableIcon,
  LayoutGrid,
  ExternalLink,
  FileText,
  Landmark
} from 'lucide-react';
import { 
  DETAILED_SCHEDULES, 
  OFFICIAL_WA_LINK, 
  OFFICIAL_WA_NUMBER 
} from '../data/packagesData';
import { PackageScheduleItem, ServiceCategory } from '../types';
import { subscribeToPackages } from '../lib/firestoreService';

interface ProductCatalogSectionProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenDetailModal: (pkg: PackageScheduleItem) => void;
  onOpenCustomQuote: () => void;
  onOpenTabungan: () => void;
  onOpenBadalModal: () => void;
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

export const ProductCatalogSection = ({
  selectedCategory,
  onSelectCategory,
  onOpenDetailModal,
  onOpenCustomQuote,
  onOpenTabungan,
  onOpenBadalModal,
  onRegisterPackage
}: ProductCatalogSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [packagesList, setPackagesList] = useState<PackageScheduleItem[]>(DETAILED_SCHEDULES);

  useEffect(() => {
    const unsubscribe = subscribeToPackages((items) => {
      if (items && items.length > 0) {
        setPackagesList(items);
      }
    });
    return () => unsubscribe();
  }, []);

  const filterTabs: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: 'Semua Program' },
    { id: 'all-umroh', label: 'Paket Umroh' },
    { id: 'haji-khusus', label: 'Paket Haji' },
    { id: 'umroh-reguler', label: 'Umroh Reguler' },
    { id: 'umroh-custom', label: 'Umroh Privat (Custom)' },
    { id: 'tabungan', label: 'Tabungan Umroh' },
    { id: 'badal-umroh', label: 'Badal Umroh' },
    { id: 'wisata-halal', label: 'Wisata Halal' },
    { id: 'visa-tiket-la', label: 'Visa, Tiket & LA' }
  ];

  const filteredItems = packagesList.filter((item) => {
    let matchCategory = true;
    if (selectedCategory === 'all') {
      matchCategory = true;
    } else if (selectedCategory === 'all-umroh') {
      matchCategory = item.category === 'umroh-reguler' || item.category === 'umroh-custom' || item.category === 'tabungan' || item.category === 'badal-umroh' || item.title.toLowerCase().includes('umroh');
    } else if (selectedCategory === 'haji-khusus') {
      matchCategory = item.category === 'haji-khusus' || item.title.toLowerCase().includes('haji');
    } else if (selectedCategory === 'visa' || selectedCategory === 'tiket-pesawat' || selectedCategory === 'land-arrangements') {
      matchCategory = item.category === 'visa-tiket-la';
    } else {
      matchCategory = item.category === selectedCategory;
    }

    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.departureDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.airline.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCardAction = (item: PackageScheduleItem) => {
    if (item.category === 'tabungan') {
      onOpenTabungan();
    } else if (item.category === 'badal-umroh') {
      onOpenBadalModal();
    } else {
      onOpenDetailModal(item);
    }
  };

  return (
    <section id="jadwal-layanan" className="py-4 sm:py-8 md:py-12 px-3 sm:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#A67C52] bg-[#F5F5F5] px-3.5 py-1 rounded-full border border-gray-200 inline-block shadow-sm">
          Katalog Produk &amp; Jadwal
        </span>
        <h2 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
          Pilihan Paket Ibadah &amp; Layanan Lengkap
        </h2>
        <p className="text-[#555555] text-xs sm:text-base leading-relaxed">
          Temukan program perjalanan yang sesuai dengan kebutuhan Anda, mulai dari Umroh Reguler, VIP Custom, Tabungan Syariah, Badal Umroh, hingga Haji Khusus &amp; Furoda VVIP berizin resmi.
        </p>
      </div>

      {/* Category Tabs & View Mode Switcher - Pas dengan Ukuran Konten & Kartu */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full pt-1 pb-1">
        {/* Horizontal Category Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-[#A67C52] hover:bg-[#8E653E] text-white shadow-md font-bold'
                  : 'bg-[#F5F5F5] text-[#1A1A1A] hover:bg-gray-200 border border-gray-200 shadow-2xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Toggle: Table View vs Cards */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-1 rounded-xl shadow-2xs flex-shrink-0 self-center md:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#A67C52] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Tampilan Tabel Jadwal"
          >
            <TableIcon className="w-4 h-4" />
            <span>Tabel Jadwal</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-[#A67C52] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Tampilan Kartu Foto"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Kartu Foto</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          DEDICATED VENTOUR-STYLE VIEW FOR HAJI KHUSUS (GAMBAR 3 & LINK VENTOUR)
      ========================================================================== */}
      {selectedCategory === 'haji-khusus' ? (
        <div className="space-y-10">
          {/* Haji Hero Banner ala Ventour */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C160E] via-[#2B1F16] to-[#15100B] text-white p-6 sm:p-10 border border-[#C5A059]/30 shadow-xl">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E0B880] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Izin Resmi PIHK Kemenag RI No. 1030 Tahun 2019</span>
              </div>

              <h3 className="font-serif-luxury text-2xl sm:text-4xl font-bold leading-tight text-white">
                Paket Haji Khusus &amp; Haji Furoda VVIP AL-GHANIM
              </h3>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Wujudkan panggilan suci ke Baitullah dengan kepastian keberangkatan resmi, fasilitas Maktab VVIP ber-AC di Arafah &amp; Mina, akomodasi hotel bintang 5 depan pelataran Masjidil Haram, serta bimbingan ibadah intensif sesuai Sunnah.
              </p>

              {/* Trust Badges ala Ventour Haji */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                  <span className="text-xs font-bold text-[#E0B880] block">Pasti Izin</span>
                  <span className="text-[11px] text-gray-300">PIHK Kemenag RI</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                  <span className="text-xs font-bold text-[#E0B880] block">Pasti Visa</span>
                  <span className="text-[11px] text-gray-300">Resmi E-Hajj Saudi</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                  <span className="text-xs font-bold text-[#E0B880] block">Pasti Maktab</span>
                  <span className="text-[11px] text-gray-300">VVIP AC Mina-Arafah</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                  <span className="text-xs font-bold text-[#E0B880] block">Pasti Hotel</span>
                  <span className="text-[11px] text-gray-300">Bintang 5 Front-Row</span>
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Haji Packages Cards Grid (Simple Card Design - Gambar 4) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  Pilihan Program Haji 1447 H / 2026 M
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Pilih program haji sesuai waktu tunggu dan preferensi kenyamanan keluarga Anda.
                </p>
              </div>
              <button
                onClick={() => onSelectCategory('all-umroh')}
                className="text-xs font-bold text-[#A67C52] hover:underline cursor-pointer"
              >
                Lihat Paket Umroh &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl bg-white overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl border-2 border-[#A67C52]/40 group"
                >
                  {/* Photo Header */}
                  <div className="relative aspect-[4/3] sm:h-64 bg-gray-950 overflow-hidden flex items-center justify-center">
                    <img
                      src={pkg.image}
                      alt={pkg.imageAlt || pkg.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                        {pkg.duration || 'Program 24-27 Hari'}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-[#A67C52] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        VVIP Kuota Resmi
                      </span>
                    </div>

                    {/* Price Tag Overlay at Bottom */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/15">
                      <div>
                        <span className="text-[9px] uppercase text-gray-300 block font-medium tracking-wider leading-none mb-0.5">
                          {pkg.pricePrefix || 'Mulai Dari'}
                        </span>
                        <div className="font-serif-luxury text-lg sm:text-xl font-bold text-[#DFC386] leading-tight">
                          {pkg.price}
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-200 bg-white/10 px-2 py-0.5 rounded-md font-semibold">
                        {pkg.priceSuffix || 'Per Jamaah'}
                      </span>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between bg-white">
                    <div className="space-y-3">
                      <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A] group-hover:text-[#A67C52] transition-colors leading-snug">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Specs Box: Simple & Clear (Gambar 4) */}
                      <div className="bg-[#FAF8F5] border border-[#A67C52]/20 rounded-xl p-3.5 space-y-2 text-xs text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                          <span><strong>Waktu:</strong> {pkg.departureDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                          <span><strong>Makkah:</strong> {pkg.hotelMakkah} (Bintang 5 Front-Row)</span>
                        </div>
                        {pkg.hotelMadinah && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                            <span><strong>Madinah:</strong> {pkg.hotelMadinah} (Bintang 5)</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                          <span><strong>Maktab Mina &amp; Arafah:</strong> Tenda AC VVIP Maktab 111-112</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Detail Paket */}
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleCardAction(pkg)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#A67C52] bg-[#FAF8F5] hover:bg-[#F3ECE4] border border-[#A67C52]/30 hover:border-[#A67C52] transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Detail Paket</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Kepastian Haji Khusus AL-GHANIM ala Ventour */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#A67C52]">
                STANDAR LAYANAN VVIP
              </span>
              <h4 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">
                5 Jaminan Kepastian Ibadah Haji AL-GHANIM
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Komitmen kami memberikan kenyamanan lahiriah dan kekhusyukan batiniah bagi para Tamu Allah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#A67C52] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h5 className="font-bold text-sm text-[#1A1A1A]">Pasti Izin Resmi PIHK</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Penyelenggara Ibadah Haji Khusus (PIHK) resmi Kementerian Agama RI No. 1030 Tahun 2019 dengan Akreditasi A.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#A67C52] text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h5 className="font-bold text-sm text-[#1A1A1A]">Pasti Visa Terdaftar E-Hajj</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Visa Haji Mujamalah / Furoda &amp; Haji Khusus resmi terdaftar di sistem E-Hajj Kementerian Haji dan Umrah Arab Saudi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#A67C52] text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h5 className="font-bold text-sm text-[#1A1A1A]">Pasti Maktab VVIP AC</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Tenda Maktab VVIP berpendingin udara (AC) di Mina &amp; Arafah dengan fasilitas kasur dan sofa bed empuk.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#A67C52] text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h5 className="font-bold text-sm text-[#1A1A1A]">Pasti Hotel Bintang 5</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Akomodasi hotel bintang 5 terdepan di pelataran Masjidil Haram Makkah &amp; Masjid Nabawi Madinah.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-100 space-y-2 md:col-span-2">
                <div className="w-8 h-8 rounded-lg bg-[#A67C52] text-white flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <h5 className="font-bold text-sm text-[#1A1A1A]">Pasti Pembimbing Sunnah &amp; Tim Medis 24 Jam</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bimbingan manasik intensif oleh Asatidz Ahlus Sunnah berkompeten dan didampingi tim dokter medis standby 24 jam demi kesehatan jamaah.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* =========================================================================
              VIEW MODE 1: VENTOUR-STYLE TABLE VIEW (GAMBAR 1 - TOGGLEABLE)
          ========================================================================== */}
          {viewMode === 'table' && (
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
                    {filteredItems.map((pkg) => {
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
                                <span className="font-bold text-sm text-[#1A1A1A] hover:text-[#A67C52] cursor-pointer" onClick={() => handleCardAction(pkg)}>
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

                          {/* Action Buttons: Detail & Konsultasi WA */}
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleCardAction(pkg)}
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
            </div>
          )}

          {/* =========================================================================
              VIEW MODE 2: SIMPLE & ELEGANT PRODUCT CARDS GRID (GAMBAR 4 STYLE)
              Card design made simple, without airline clutter, with direct Daftar button
          ========================================================================== */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((pkg) => {
                const seatPercentage = Math.round(((pkg.totalSeats - pkg.availableSeats) / pkg.totalSeats) * 100);
                const isAlmostFull = pkg.availableSeats <= 6 && !pkg.isFullBooked;
                const isFeatured = pkg.badge?.variant === 'exclusive' || pkg.badge?.variant === 'premium';

                return (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl bg-white overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl group hover:-translate-y-1 ${
                      isFeatured 
                        ? 'border-2 border-[#A67C52] shadow-md' 
                        : 'border border-gray-200/90 hover:border-[#A67C52]/50'
                    }`}
                  >
                    {/* Image Header & Top Badges with Overlay */}
                    <div className="relative aspect-[16/11] sm:h-64 bg-gray-950 overflow-hidden flex items-center justify-center">
                      {pkg.image ? (
                        <img
                          src={pkg.image}
                          alt={pkg.imageAlt}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center p-6 text-center">
                          <Building2 className="w-12 h-12 text-[#A67C52]" />
                        </div>
                      )}

                      {/* Subtle Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {pkg.duration && (
                            <span className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#C5A059]" />
                              {pkg.duration}
                            </span>
                          )}
                          {pkg.badge && (
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                              isFeatured 
                                ? 'bg-[#A67C52] text-white' 
                                : 'bg-white/90 text-[#1A1A1A]'
                            }`}>
                              <Star className="w-3 h-3 fill-current" />
                              {typeof pkg.badge === 'string' ? pkg.badge : pkg.badge.text}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Compact Sleek Price Pill Overlay at Bottom of Image */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/15">
                        <div>
                          <span className="text-[9px] uppercase text-gray-300 block font-medium tracking-wider leading-none mb-0.5">
                            {pkg.pricePrefix || 'Mulai Dari'}
                          </span>
                          <div className="font-serif-luxury text-lg sm:text-xl font-bold text-[#DFC386] leading-tight">
                            {pkg.price}
                          </div>
                        </div>
                        <span className="text-[9px] font-semibold text-gray-200 bg-white/10 px-2 py-0.5 rounded-md">
                          {pkg.priceSuffix || 'Sekamar Ber-4'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body (Simple, Clean, Sesuai Gambar 1) */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-white">
                      <div className="space-y-3">
                        <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1A1A1A] group-hover:text-[#A67C52] transition-colors leading-snug line-clamp-1">
                          {pkg.title}
                        </h3>

                        {/* Specs Box (Gambar 1): Hotel Makkah, Madinah, Tiket Confirm, Durasi */}
                        <div className="bg-[#FAF9F7] border border-gray-100 rounded-2xl p-3.5 space-y-2 text-xs text-gray-700">
                          {/* Hotel Makkah */}
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                            <span className="truncate"><strong>Hotel Makkah:</strong> {pkg.hotelMakkah}</span>
                          </div>

                          {/* Hotel Madinah */}
                          {pkg.hotelMadinah && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                              <span className="truncate"><strong>Hotel Madinah:</strong> {pkg.hotelMadinah}</span>
                            </div>
                          )}

                          {/* Tiket Confirm */}
                          <div className="flex items-center gap-2 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>Tiket Confirm PP</span>
                          </div>

                          {/* Durasi */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                            <span>Mulai Dari <strong>{pkg.duration || '9 Hari'}</strong></span>
                          </div>
                        </div>

                        {/* Seat Availability Bar */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-[#666666] font-medium">Status Kursi:</span>
                            {pkg.isFullBooked ? (
                              <span className="font-bold text-gray-500">Penuh (Full Booked)</span>
                            ) : isAlmostFull ? (
                              <span className="font-bold text-amber-700 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                Sisa {pkg.availableSeats} Kursi!
                              </span>
                            ) : (
                              <span className="font-bold text-emerald-700">Tersedia ({pkg.availableSeats} Seat)</span>
                            )}
                          </div>
                          <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden border border-gray-200">
                            <div
                              className={`h-full rounded-full ${
                                pkg.isFullBooked
                                  ? 'bg-gray-400'
                                  : isAlmostFull
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pkg.isFullBooked ? 100 : seatPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action: Tombol Detail Saja */}
                      <div className="pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleCardAction(pkg)}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#A67C52] bg-[#FAF8F5] hover:bg-[#F3ECE4] border border-[#A67C52]/30 hover:border-[#A67C52] transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
};
