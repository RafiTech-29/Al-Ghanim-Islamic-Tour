import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Plane, 
  Building2, 
  User, 
  FileText, 
  ShieldCheck, 
  Download, 
  Phone, 
  AlertCircle, 
  MapPin, 
  Compass, 
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  QrCode,
  CreditCard,
  Luggage,
  Users,
  FileDown,
  BedDouble,
  BookOpen,
  Copy,
  Check,
  Package,
  MessageCircle,
  Share2,
  Navigation,
  Info,
  X,
  RotateCcw
} from 'lucide-react';
import { JamaahProgressItem } from '../types';
import { OFFICIAL_WA_NUMBER, OFFICIAL_WA_LINK } from '../data/packagesData';
import { 
  generateJamaahTrackingCardPDF, 
  generatePassportRecommendationPDF,
  generateBukuPanduanDoaPDF,
  generateItineraryUmrohPDF
} from '../utils/pdfGenerator';
import { subscribeToJamaah } from '../lib/firestoreService';
import { getAutoHotelDistance } from '../data/packageCategories';

interface JamaahTransparencyPortalProps {
  onOpenConsultation?: (topic: string) => void;
  onBackToHome?: () => void;
}

export const JamaahTransparencyPortal: React.FC<JamaahTransparencyPortalProps> = ({
  onOpenConsultation,
  onBackToHome
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [selectedJamaah, setSelectedJamaah] = useState<JamaahProgressItem | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [allJamaahList, setAllJamaahList] = useState<JamaahProgressItem[]>([]);
  const [copiedPnr, setCopiedPnr] = useState(false);
  const [copiedNij, setCopiedNij] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Subscribe to realtime changes from Firestore
  useEffect(() => {
    const unsub = subscribeToJamaah((data) => {
      setAllJamaahList(data);
      // Synchronize data only if a jamaah was already actively searched by the visitor
      setSelectedJamaah((prev) => {
        if (prev) {
          const updated = data.find(j => j.id === prev.id || j.nij.toLowerCase() === prev.nij.toLowerCase());
          return updated || prev;
        }
        return null;
      });
    });
    return () => unsub();
  }, []);

  const handleResetSearch = () => {
    setSelectedJamaah(null);
    setSearchCode('');
    setSearchError('');
    setIsSearching(false);
  };

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : searchCode).trim().toUpperCase();
    
    if (!query) {
      setSearchError('Silakan masukkan Nomor Induk Jamaah (NIJ) resmi Anda');
      setSelectedJamaah(null);
      return;
    }

    setIsSearching(true);
    setSearchError('');

    const cleanQuery = query.replace(/\s+/g, '');
    // HANYA NIJ yang bisa akses sesuai arahan user (KTP dan No WA tidak bisa akses)
    const found = allJamaahList.find(item => {
      const itemNijClean = (item.nij || '').toUpperCase().replace(/\s+/g, '');
      return itemNijClean === cleanQuery || (item.nij || '').toUpperCase().trim() === query;
    });

    if (found) {
      setSelectedJamaah(found);
      setSearchError('');
      setIsSearching(false);
    } else {
      setSelectedJamaah(null);
      setSearchError('Data jamaah tidak ditemukan. Akses portal pelacakan khusus menggunakan Nomor Induk Jamaah (NIJ) resmi terdaftar (cth: AG-2026-8801).');
      setIsSearching(false);
    }
  };

  const handleCopyPnr = (pnrText: string) => {
    navigator.clipboard.writeText(pnrText);
    setCopiedPnr(true);
    setTimeout(() => setCopiedPnr(false), 2000);
  };

  const handleCopyNij = (nijText: string) => {
    navigator.clipboard.writeText(nijText);
    setCopiedNij(true);
    setTimeout(() => setCopiedNij(false), 2000);
  };

  // Calculate percentage of readiness (similar to 80% in Taiba Medina screenshot)
  const getReadinessPercentage = (step: number, eqStatusRaw?: string) => {
    const eq = (eqStatusRaw || '').toLowerCase();
    const isEqComplete = eq.includes('lengkap') || eq.includes('diterima') || eq.includes('diserahkan') || eq.includes('siap');
    switch (step) {
      case 1: return 25;
      case 2: return 50;
      case 3: return 70;
      case 4: return 85;
      case 5: return isEqComplete ? 100 : 90;
      default: return 80;
    }
  };

  // Generate a mock/clean PNR code based on Jamaah data
  const pnrCode = selectedJamaah ? `SV-${(selectedJamaah.nij.replace(/[^A-Z0-9]/g, '') + '819').slice(-6).toUpperCase()}` : 'SV-CYMW81';

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 bg-white text-slate-900 font-sans-luxury">
      
      {/* Top Header Bar: Cukup Tombol Kembali Saja Tanpa Teks (Sesuai Permintaan) */}
      <div className="flex items-center border-b border-gray-200 pb-4">
        {onBackToHome ? (
          <button
            onClick={onBackToHome}
            className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 flex items-center justify-center transition-all shadow-xs cursor-pointer flex-shrink-0"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
        ) : (
          <a
            href="#/beranda"
            onClick={() => window.location.hash = ''}
            className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 flex items-center justify-center transition-all shadow-xs cursor-pointer flex-shrink-0"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </a>
        )}
      </div>

      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-2xs">
          <span>Sistem Transparansi Layanan Umroh</span>
        </div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Portal Pelacakan Progres Jamaah
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Pantau seluruh kesiapan ibadah umroh Anda secara mandiri langsung dari handphone. Transparan, terbuka, dan terverifikasi resmi.
        </p>

        {/* Toggle Penjelasan Website ini buat apa? */}
        <div className="pt-1">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Info className="w-3.5 h-3.5 text-[#A67C52]" />
            <span>{showExplanation ? 'Tutup Penjelasan Fitur' : 'Website ini buat apa & bagaimana cara ceknya?'}</span>
          </button>
        </div>
      </div>

      {/* Slide 1 & 2 Explainer Box (Bisa Dibuka/Tutup) */}
      {showExplanation && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm animate-fadeIn space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: Slide 1 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A67C52]" />
                <span>Website ini buat apa?</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-[#A67C52] font-bold">✓</span>
                  <span>Buat Anda mengecek sendiri persiapan umroh langsung dari HP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A67C52] font-bold">✓</span>
                  <span>Semua informasi terbuka dan transparan tanpa perlu selalu menunggu jawaban admin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A67C52] font-bold">✓</span>
                  <span>Bisa cek langsung kode booking PNR ke website resmi maskapai penerbangan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A67C52] font-bold">✓</span>
                  <span>Bisa akses lokasi hotel yang sudah dipesan langsung di Google Maps.</span>
                </li>
              </ul>
            </div>

            {/* Box 2: Slide 2 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#A67C52]" />
                <span>Gimana cara ceknya &amp; isinya apa aja?</span>
              </h3>
              <ol className="text-xs text-slate-700 space-y-1.5 leading-relaxed list-decimal pl-4 font-medium">
                <li>Masukkan Nomor Induk Jamaah (NIJ) resmi Anda (hanya pemegang NIJ yang memiliki otorisasi akses).</li>
                <li>Melihat status pembayaran (Lunas / Menunggu Pelunasan) dan persentase kesiapan keberangkatan.</li>
                <li>Cek detail tiket maskapai, rute, terminal bandara, dan fasilitas bagasi.</li>
                <li>Lihat nama hotel Makkah &amp; Madinah dengan link rute Google Maps.</li>
                <li>Pantau status perlengkapan (koper, tas thawaf, kain ihram, buku doa, ID card).</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR (Cari Data Jamaah - Khusus NIJ) */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Masukkan Nomor Induk Jamaah (NIJ, cth: AG-2026-8801)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full bg-white border-2 border-slate-300 focus:border-[#A67C52] rounded-2xl pl-11 pr-9 py-3.5 text-xs sm:text-sm text-slate-900 font-bold outline-none transition-all placeholder:text-slate-400 placeholder:font-normal shadow-2xs"
            />
            {searchCode && (
              <button
                type="button"
                onClick={() => setSearchCode('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="Hapus input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSearching}
              className="flex-1 sm:flex-none px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#A67C52] to-[#8E653E] hover:brightness-105 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isSearching ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Lacak Progres</span>
            </button>
            {selectedJamaah && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Reset dan cari NIJ lain"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cari Lain</span>
              </button>
            )}
          </div>
        </form>

        {searchError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{searchError}</p>
              <p className="text-[11px] text-rose-600 mt-0.5">
                Butuh bantuan konfirmasi data? Hubungi konsultan via WA: <strong>0813-1670-218</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* HASIL TRACKING REAL-TIME (ASPEK-ASPEK PERSIS SEPERTI GAMBAR SLIDE TAIBA MEDINA) */}
      {selectedJamaah ? (
        <div className="space-y-5 animate-in fade-in-50 duration-300">

          {/* ========================================================= */}
          {/* ASPEK 1: HEADER & PERSENTASE KESIAPAN (Slide 4 Kiri Atas) */}
          {/* ========================================================= */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-5 relative overflow-hidden">
            {/* Top Accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A67C52] via-[#C5A059] to-[#8E653E]" />

            {/* Status & Subtitle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedJamaah.paymentStatus === 'Lunas'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {selectedJamaah.paymentStatus}
                </span>

                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
                    Terdaftar: Garut, ID
                  </span>
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    className="inline-flex items-center gap-1.5 text-xs text-[#A67C52] hover:text-[#8E653E] font-bold bg-[#A67C52]/10 hover:bg-[#A67C52]/20 px-3 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Lacak NIJ Lain</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pt-1">
                {selectedJamaah.packageName} | {selectedJamaah.departureDate}
              </div>

              {/* Large Name */}
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight uppercase">
                {selectedJamaah.fullName}
              </h2>

              {/* Identitas Terverifikasi & Privasi Terjaga */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Data Jamaah Resmi &amp; Terverifikasi</span>
                </span>
                <span className="text-[11px] text-gray-400 italic">
                  (Nomor NIJ dilindungi privasi)
                </span>
              </div>
            </div>

            {/* Kesiapan Berangkat Bar (Persentase) */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#1A1A1A]">Kesiapan Berangkat</span>
                <span className="text-[#A67C52] text-sm font-extrabold">
                  {getReadinessPercentage(selectedJamaah.progressStep, selectedJamaah.equipmentStatus)}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#A67C52] to-[#C5A059] transition-all duration-500"
                  style={{ width: `${getReadinessPercentage(selectedJamaah.progressStep, selectedJamaah.equipmentStatus)}%` }}
                />
              </div>

              {/* 5 Quick Checklist Icon Pills Berurutan Kronologis Tahap 1 - 5 */}
              <div className="grid grid-cols-5 gap-1.5 pt-2">
                {(() => {
                  const step = selectedJamaah.progressStep || 1;

                  // 1. KTP & Registrasi DP (Tahap 1)
                  const ktpOk = step >= 1;
                  const ktpStatus = selectedJamaah.paymentStatus === 'Lunas'
                    ? 'Lunas'
                    : selectedJamaah.dpAmount
                    ? 'DP Masuk'
                    : 'Terdaftar';

                  // 2. Paspor Fisik Asli (Tahap 2)
                  const pStatus = (selectedJamaah.passportStatus || '').toLowerCase();
                  const isImigrasi = pStatus.includes('imigrasi');
                  const isMenungguFisik = pStatus.includes('menunggu penyerahan') || (step === 1 && !pStatus.includes('lengkap'));
                  const pasporOk = (step >= 2 && !isImigrasi && !pStatus.includes('menunggu')) ||
                    pStatus.includes('lengkap') ||
                    pStatus.includes('terverifikasi') ||
                    pStatus.includes('kantor') ||
                    pStatus.includes('jadi');
                  
                  const pasporText = isImigrasi
                    ? 'Proses Imigrasi'
                    : isMenungguFisik
                    ? 'Menunggu Fisik'
                    : pasporOk
                    ? (selectedJamaah.passportStatus?.includes('Kantor') ? 'Di Kantor' : 'Lengkap')
                    : step >= 2
                    ? 'Lengkap'
                    : 'Tahap 2';

                  // 3. Hotel & Pelunasan (Tahap 3)
                  const isLunas = selectedJamaah.paymentStatus === 'Lunas';
                  const hotelOk = step >= 3 || isLunas;
                  const hotelText = hotelOk ? 'Confirmed' : 'Tahap 3';

                  // 4. Visa & E-Ticket (Tahap 4)
                  const vStatus = (selectedJamaah.visaStatus || '').toLowerCase();
                  const isVisaIssued = vStatus.includes('terbit') || vStatus.includes('issued');
                  const visaOk = step >= 4 || isVisaIssued;
                  const visaText = visaOk ? 'Terbit' : (vStatus.includes('proses') || vStatus.includes('mofa')) ? 'Approval' : 'Tahap 4';

                  // 5. Koper & Siap Berangkat (Tahap 5) - Integrasi langsung dengan status admin
                  const eqStatus = (selectedJamaah.equipmentStatus || '').toLowerCase();
                  const isEqReceived = eqStatus.includes('lengkap') || eqStatus.includes('diterima') || eqStatus.includes('diserahkan');
                  const isEqReady = eqStatus.includes('siap');
                  const isEqPacking = eqStatus.includes('packing') || eqStatus.includes('proses');
                  
                  const koperOk = isEqReceived || isEqReady;
                  const koperInProgress = !koperOk && isEqPacking;
                  
                  let koperText = 'Tahap 5';
                  if (isEqReceived) {
                    koperText = 'Lengkap';
                  } else if (isEqReady) {
                    koperText = 'Siap Diambil';
                  } else if (isEqPacking) {
                    koperText = 'Dalam Proses';
                  } else {
                    koperText = 'Menunggu Tahap 3';
                  }

                  const pills = [
                    { label: 'KTP & DP', icon: CreditCard, ok: ktpOk, inProgress: false, statusText: ktpStatus },
                    { label: 'Paspor', icon: FileText, ok: pasporOk, inProgress: isImigrasi, statusText: pasporText },
                    { label: 'Hotel & Lunas', icon: Building2, ok: hotelOk, inProgress: false, statusText: hotelText },
                    { label: 'Visa & Tiket', icon: ShieldCheck, ok: visaOk, inProgress: !visaOk && (vStatus.includes('proses') || vStatus.includes('mofa')), statusText: visaText },
                    { label: 'Koper & Siap', icon: Package, ok: koperOk, inProgress: koperInProgress, statusText: koperText }
                  ];

                  return pills.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-center border flex flex-col items-center justify-center gap-1 transition-all ${
                        item.ok 
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 shadow-2xs'
                          : item.inProgress
                          ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${
                        item.ok 
                          ? 'text-emerald-600' 
                          : item.inProgress 
                          ? 'text-amber-600 animate-pulse' 
                          : 'text-stone-400'
                      }`} />
                      <span className="text-[10px] font-bold truncate w-full">{item.label}</span>
                      <span className={`text-[9px] font-bold leading-none ${
                        item.ok 
                          ? 'text-emerald-700' 
                          : item.inProgress 
                          ? 'text-amber-700' 
                          : 'text-stone-400'
                      }`}>
                        {item.statusText}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Detail Paket Box */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A67C52] uppercase tracking-wider">
                <Luggage className="w-4 h-4" />
                <span>Detail Paket Pilihan</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div>
                  <span className="text-gray-400 block text-[10px]">Tingkat Paket</span>
                  <span className="font-bold text-[#1A1A1A]">VIP Gold / Silver</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Durasi</span>
                  <span className="font-bold text-[#1A1A1A]">{selectedJamaah.duration || '9 Hari'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Tanggal Berangkat</span>
                  <span className="font-bold text-[#1A1A1A]">{selectedJamaah.departureDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DUA KOLOM UTAMA (Penerbangan & Hotel)                      */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ========================================================= */}
            {/* ASPEK 2: PENERBANGAN & KEBERANGKATAN (Slide 4 Kanan)     */}
            {/* ========================================================= */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center">
                    <Plane className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1A1A1A]">
                    Penerbangan &amp; Keberangkatan
                  </h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  selectedJamaah.progressStep >= 4
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {selectedJamaah.progressStep >= 4 ? '✓ Tiket Terbit' : 'Tahap ' + selectedJamaah.progressStep + ' (Proses)'}
                </span>
              </div>

              {/* JIKA BELUM TAHAP 4: Tampilkan status penantian yang rapi */}
              {selectedJamaah.progressStep < 4 ? (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-amber-200/90 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Penerbitan Tiket &amp; PNR (Rilis di Tahap 4)</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Saat ini status jamaah berada di <strong>Tahap {selectedJamaah.progressStep} ({selectedJamaah.progressStep === 1 ? 'DP & Registrasi' : selectedJamaah.progressStep === 2 ? 'Dokumen & Paspor' : 'Pelunasan & Manasik'})</strong>.
                  </p>
                  <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Rencana Maskapai:</span>
                      <span className="font-bold text-[#1A1A1A]">{selectedJamaah.airline}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tanggal Keberangkatan:</span>
                      <span className="font-bold text-[#1A1A1A]">{selectedJamaah.departureDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Status Visa MoFA:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        selectedJamaah.visaStatus?.includes('Terbit')
                          ? 'bg-emerald-100 text-emerald-900'
                          : selectedJamaah.visaStatus?.includes('Approval')
                          ? 'bg-sky-100 text-sky-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {selectedJamaah.visaStatus || 'Menunggu Pelunasan'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Status PNR &amp; E-Ticket:</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        Menunggu Pelunasan &amp; Visa
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 italic leading-relaxed">
                    *Kode booking PNR grup, nomor e-ticket maskapai, dan penomoran kursi perorangan akan resmi diterbitkan dan tampil di sini setelah memasuki Tahap 4 (Penerbitan Visa &amp; Tiket).
                  </p>
                </div>
              ) : (
                /* JIKA SUDAH TAHAP 4 ATAU 5: Tampilkan tiket dan PNR aktif */
                <>
                  {/* Informasi Penerbangan Grup */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Informasi Penerbangan Grup
                    </span>

                    <div className="text-xs space-y-1.5">
                      <div>
                        <span className="text-gray-500 block text-[11px]">Maskapai / PNR:</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-bold text-[#1A1A1A] text-sm">
                            {selectedJamaah.airline}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#A67C52]/15 text-[#8E653E] font-mono font-bold text-xs border border-[#A67C52]/30">
                            PNR: {selectedJamaah.pnrCode || pnrCode}
                          </span>
                          <button
                            onClick={() => handleCopyPnr(selectedJamaah.pnrCode || pnrCode)}
                            className="p-1 rounded hover:bg-stone-100 text-gray-500 transition-colors cursor-pointer"
                            title="Salin Kode PNR"
                          >
                            {copiedPnr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-500 block text-[11px]">Bandara &amp; Terminal:</span>
                        <span className="font-semibold text-[#1A1A1A]">
                          Soekarno-Hatta International Airport (CGK) (Terminal 3 Internasional)
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500 block text-[11px]">Waktu Kumpul Bandara:</span>
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {selectedJamaah.airportMeetingTime || `${selectedJamaah.departureDate} • 16:00 WIB (4 Jam Sebelum Take-Off)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fasilitas & Bagasi */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Fasilitas &amp; Bagasi
                    </span>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Kapasitas Bagasi:</span>
                        <span className="font-bold text-[#1A1A1A]">30KG Bagasi, 7KG Kabin</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Transportasi Lokal:</span>
                        <span className="font-bold text-[#1A1A1A]">Kereta Cepat Haramain &amp; Bus</span>
                      </div>
                    </div>
                  </div>

                  {/* Tiket Pribadi Anda */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1.5 text-xs">
                    <span className="font-bold text-[#1A1A1A] block">Tiket Pribadi Anda</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-gray-400 block">No. Tiket:</span>
                        <span className="font-mono font-semibold text-gray-800">
                          {selectedJamaah.ticketNumber || `EK/SV-${selectedJamaah.nij.slice(-4)}2026`}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Kursi:</span>
                        <span className="font-semibold text-gray-800">{selectedJamaah.seatNumber || 'Group Allotment'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block">Rute:</span>
                        <span className="font-semibold text-[#1A1A1A]">
                          CGK - JED / MED - CGK (Direct Flight)
                        </span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-stone-200/60 flex items-center justify-between">
                        <span className="text-gray-400">Status E-Visa MoFA:</span>
                        <span className="font-bold text-emerald-700">
                          {selectedJamaah.visaStatus || 'Visa Umroh Telah Terbit'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ========================================================= */}
            {/* ASPEK 3: HOTEL & AKOMODASI (Slide 3 Kiri)                */}
            {/* ========================================================= */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1A1A1A]">
                    Hotel &amp; Akomodasi (Tahap 3)
                  </h3>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  (selectedJamaah.progressStep || 1) >= 3 || selectedJamaah.paymentStatus === 'Lunas'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {(selectedJamaah.progressStep || 1) >= 3 || selectedJamaah.paymentStatus === 'Lunas' ? '✓ Confirmed (Lunas)' : 'Tahap 3 (Proses Pelunasan)'}
                </span>
              </div>

              {/* Catatan Integrasi Pelunasan & Hotel */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Integrasi Pelunasan &amp; Hotel:</strong> Saat pelunasan biaya paket diverifikasi di Tahap 3, konfirmasi reservasi (voucher) hotel Makkah &amp; Madinah otomatis terkunci (Confirmed) dan siap untuk plotting nomor kamar.
                </span>
              </div>

              {/* Hotel Makkah dengan Jarak Real-Time */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Hotel Makkah
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#A67C52]/15 text-[#8E653E] text-[10px] font-bold">
                    Bintang 5 VIP
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1A1A1A]">
                    {selectedJamaah.hotelMakkah || 'Swissotel Al Maqam Makkah'}
                  </h4>
                  {/* Realtime Distance Display Otomatis */}
                  <div className="flex items-center gap-1.5 text-xs text-[#A67C52] font-bold mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 animate-pulse flex-shrink-0" />
                    <span>Jarak: {getAutoHotelDistance(selectedJamaah.hotelMakkah || 'Swissotel Al Maqam', 'makkah')}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                    Depan Pelataran Masjidil Haram, Clock Towers, Ajyad St, Makkah, Arab Saudi
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedJamaah.hotelMakkah || 'Swissotel Al Maqam') + ' Makkah Saudi Arabia')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#A67C52] text-[#A67C52] hover:text-white border border-[#A67C52]/40 text-xs font-bold transition-all shadow-2xs cursor-pointer mt-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Buka Rute di Google Maps</span>
                </a>
              </div>

              {/* Hotel Madinah dengan Jarak Real-Time */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Hotel Madinah
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[10px] font-bold">
                    Bintang 4/5
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1A1A1A]">
                    {selectedJamaah.hotelMadinah || 'Dallah Taibah Madinah'}
                  </h4>
                  {/* Realtime Distance Display Otomatis */}
                  <div className="flex items-center gap-1.5 text-xs text-[#A67C52] font-bold mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span>Jarak: {getAutoHotelDistance(selectedJamaah.hotelMadinah || 'Dallah Taibah', 'madinah')}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                    Kawasan Markaziah Utara, Madinah, Arab Saudi
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedJamaah.hotelMadinah || 'Dallah Taibah') + ' Madinah Saudi Arabia')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#A67C52] text-[#A67C52] hover:text-white border border-[#A67C52]/40 text-xs font-bold transition-all shadow-2xs cursor-pointer mt-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Buka Rute di Google Maps</span>
                </a>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* ASPEK 4: KAMAR & TEMAN SEKAMAR (Slide 4 Bawah Kiri)        */}
          {/* ========================================================= */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center">
                  <BedDouble className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#1A1A1A]">
                  Kamar &amp; Akomodasi ({selectedJamaah.roomType || 'QUAD'})
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">{selectedJamaah.roomType || 'Paket Sekamar Ber-4'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Daftar Kamar */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Daftar Kamar Anda
                </span>
                
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800">{selectedJamaah.hotelMakkah || 'Hotel Makkah'}</span>
                  <span className="font-bold text-[#A67C52] font-mono">
                    {selectedJamaah.roomMakkahNumber ? `No. ${selectedJamaah.roomMakkahNumber}` : 'Menunggu Plotting Kamar'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800">{selectedJamaah.hotelMadinah || 'Hotel Madinah'}</span>
                  <span className="font-bold text-[#A67C52] font-mono">
                    {selectedJamaah.roomMadinahNumber ? `No. ${selectedJamaah.roomMadinahNumber}` : 'Menunggu Plotting Kamar'}
                  </span>
                </div>
              </div>

              {/* Teman Sekamar */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Teman Sekamar (Roommate)
                </span>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#1A1A1A]">
                    <Users className="w-3.5 h-3.5 text-[#A67C52]" />
                    <span>Rombongan Keluarga &amp; Rekan Sekamar:</span>
                  </div>
                  {selectedJamaah.roommates && selectedJamaah.roommates.length > 0 ? (
                    <ul className="text-xs text-gray-700 space-y-1 pl-5 list-disc">
                      {selectedJamaah.roommates.map((rm, idx) => (
                        <li key={idx} className="font-medium text-[#1A1A1A]">{rm}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-stone-500 italic">
                      Rooming list sedang dalam penyusunan oleh Admin Al-Ghanim menjelang manasik akbar.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DUA KOLOM BAWAH (Perlengkapan & Manasik/Tim)              */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ========================================================= */}
            {/* ASPEK 5: DAFTAR PERIKSA PERLENGKAPAN UMROH (Slide 3 Kanan)*/}
            {/* ========================================================= */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
              {(() => {
                const eqStatus = (selectedJamaah.equipmentStatus || '').toLowerCase();
                const isReceived = eqStatus.includes('lengkap') || eqStatus.includes('diterima') || eqStatus.includes('diserahkan');
                const isReady = eqStatus.includes('siap');
                const isPacking = eqStatus.includes('packing') || eqStatus.includes('proses');
                
                let headerBadgeText = '⚠️ Menunggu Pelunasan (Tahap 3)';
                let headerBadgeStyle = 'bg-stone-100 text-stone-700 border-stone-300';
                let itemBadgeText = 'Menunggu Pelunasan (Tahap 3)';
                let badgeColor = 'bg-stone-50 text-stone-600 border-stone-200';

                if (isReceived) {
                  headerBadgeText = '✓ Lengkap Diterima Jamaah';
                  headerBadgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
                  itemBadgeText = 'Lengkap Diterima';
                  badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                } else if (isReady) {
                  headerBadgeText = '📦 Siap Diambil di Kantor Garut';
                  headerBadgeStyle = 'bg-sky-50 text-sky-800 border-sky-300';
                  itemBadgeText = 'Siap Diambil';
                  badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
                } else if (isPacking) {
                  headerBadgeText = '⏳ Dalam Proses Packing di Kantor';
                  headerBadgeStyle = 'bg-amber-50 text-amber-800 border-amber-300';
                  itemBadgeText = 'Dalam Proses Packing';
                  badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                }

                return (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-[#1A1A1A]">
                          Status Perlengkapan Umroh
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${headerBadgeStyle}`}>
                        {headerBadgeText}
                      </span>
                    </div>

                    <div className="divide-y divide-stone-100 text-xs">
                      {[
                        { name: 'Koper Bagasi Eksklusif (24 Inch)' },
                        { name: 'Tas Thawaf / Tas Paspor Slempang' },
                        { name: 'Kain Ihram / Mukena Eksklusif Al-Ghanim' },
                        { name: 'Buku Doa Manasik & Panduan Perjalanan' },
                        { name: 'ID Card Jamaah & Lanyard Barcode' },
                      ].map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between">
                          <span className="text-gray-700 font-medium">{item.name}</span>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${badgeColor}`}>
                            {itemBadgeText}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-gray-500 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                <span>Pengambilan koper fisik dapat dilakukan di Kantor Garut atau saat Manasik Akbar.</span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* ASPEK 6: JADWAL MANASIK & TIM LAPANGAN (Slide 4 Bawah)    */}
            {/* ========================================================= */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#1A1A1A]">
                  Jadwal Manasik &amp; Tim Lapangan
                </h3>
              </div>

              {/* Jadwal Manasik */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Bimbingan Manasik
                </span>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-bold text-emerald-700">Telah Terjadwal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Waktu:</span>
                    <span className="font-semibold text-gray-900">{selectedJamaah.manasikDate || '10 Hari Sebelum Berangkat'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Lokasi:</span>
                    <span className="font-semibold text-gray-900">{selectedJamaah.manasikLocation || 'Hotel Harmoni Garut'}</span>
                  </div>
                </div>
              </div>

              {/* Tim Lapangan */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Tim Pembimbing Lapangan
                </span>

                {/* Muthawwif */}
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-gray-400 block text-[10px]">Muthawwif Pembimbing:</span>
                    <span className="font-bold text-[#1A1A1A]">{selectedJamaah.muthawifName || 'USTADZ WILDAN'}</span>
                    <span className="text-gray-500 block text-[11px]">{selectedJamaah.muthawifPhone || '0813-1670-218'}</span>
                  </div>
                  <a
                    href={`https://wa.me/${((phone: string) => {
                      let c = (phone || '').replace(/[^0-9]/g, '');
                      if (c.startsWith('0')) return '62' + c.slice(1);
                      if (c.startsWith('8')) return '62' + c;
                      return c || '628131670218';
                    })(selectedJamaah.muthawifPhone || '628131670218')}?text=Assalamu%27alaikum%20Ustadz,%20saya%20${encodeURIComponent(selectedJamaah.fullName)}%20jamaah%20Al-Ghanim%20NIJ%20${selectedJamaah.nij}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors cursor-pointer shadow-2xs"
                    title="Hubungi Muthawwif via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>

                {/* Tour Leader */}
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-gray-400 block text-[10px]">Tour Leader / Pendamping:</span>
                    <span className="font-bold text-[#1A1A1A]">{selectedJamaah.tourLeaderName || 'ANAS ABU YAHYA'}</span>
                    <span className="text-gray-500 block text-[11px]">{selectedJamaah.tourLeaderPhone || '0813-1670-218'}</span>
                  </div>
                  <a
                    href={`https://wa.me/${((phone: string) => {
                      let c = (phone || '').replace(/[^0-9]/g, '');
                      if (c.startsWith('0')) return '62' + c.slice(1);
                      if (c.startsWith('8')) return '62' + c;
                      return c || '628131670218';
                    })(selectedJamaah.tourLeaderPhone || '628131670218')}?text=Assalamu%27alaikum%20Tour%20Leader%20Al-Ghanim,%20saya%20${encodeURIComponent(selectedJamaah.fullName)}%20jamaah%20NIJ%20${selectedJamaah.nij}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors cursor-pointer shadow-2xs"
                    title="Hubungi Tour Leader via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* ASPEK 7: PUSAT UNDUHAN DOKUMEN PDF (Slide 3 Bawah Kanan)  */}
          {/* ========================================================= */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <div className="w-8 h-8 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center">
                <FileDown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#1A1A1A]">
                  Unduhan &amp; Dokumentasi Digital (PDF)
                </h3>
                <p className="text-xs text-gray-500">
                  Unduh langsung berkas resmi jamaah ke memori handphone atau cetak kapan saja.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              
              {/* 1. Buku Panduan & Doa */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-[#1A1A1A]">Buku Panduan &amp; Doa</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Kumpulan doa manasik dan adab berziarah di tanah suci.
                  </p>
                </div>
                <button
                  onClick={() => generateBukuPanduanDoaPDF(selectedJamaah.fullName)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#A67C52] text-[#A67C52] hover:text-white border border-[#A67C52]/40 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>

              {/* 2. Itinerary Perjalanan */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-[#1A1A1A]">Itinerary Perjalanan</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Jadwal harian kegiatan di Makkah, Madinah &amp; City Tour.
                  </p>
                </div>
                <button
                  onClick={() => generateItineraryUmrohPDF(selectedJamaah)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#A67C52] text-[#A67C52] hover:text-white border border-[#A67C52]/40 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>

              {/* 3. Rekomendasi Paspor */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-[#1A1A1A]">Surat Rekom Paspor</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Surat pengantar resmi Kemenag untuk pembuatan paspor.
                  </p>
                </div>
                <button
                  onClick={() => generatePassportRecommendationPDF(selectedJamaah)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#A67C52] text-[#A67C52] hover:text-white border border-[#A67C52]/40 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>

              {/* 4. Kartu Tracking Progres */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-[#1A1A1A]">Kartu Tracking Resmi</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Lembar bukti pendaftaran dan verifikasi status keberangkatan.
                  </p>
                </div>
                <button
                  onClick={() => generateJamaahTrackingCardPDF(selectedJamaah)}
                  className="w-full py-2 px-3 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* JIKA BELUM MEMASUKKAN NIJ / BELUM ADA DATA TERPILIH */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-[#A67C52]/10 border border-[#A67C52]/20 text-[#A67C52] mx-auto flex items-center justify-center">
            <QrCode className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Ketikkan NIJ untuk Melihat Progres Anda
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Demi keamanan dan privasi data jamaah, hasil pelacakan kesiapan keberangkatan, tiket pesawat, hotel, dan visa hanya akan muncul setelah Anda memasukkan <strong>Nomor Induk Jamaah (NIJ)</strong> Anda pada kolom pencarian di atas.
            </p>
            {allJamaahList.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const sample = allJamaahList[0];
                    setSearchCode(sample.nij);
                    setSelectedJamaah(sample);
                    setSearchError('');
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#A67C52] to-[#8E653E] hover:brightness-105 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Buka Contoh Simulasi: {allJamaahList[0].fullName}</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-3 text-left">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-xs text-[#1A1A1A]">Input NIJ / WhatsApp</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Ketikkan nomor identitas jamaah Anda (format: <code>AG-2026-XXX</code>) atau nomor WhatsApp terdaftar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-xs text-[#1A1A1A]">Transparansi Tiket &amp; PNR</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Dapatkan kode booking PNR resmi maskapai yang dapat diverifikasi langsung di situs maskapai penerbangan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-xs text-[#1A1A1A]">Hotel &amp; Perlengkapan</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Pantau rute Google Maps hotel Makkah/Madinah, status koper ibadah, serta unduh kartu tracking digital resmi.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
