import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Share2, 
  DollarSign, 
  Check, 
  Phone, 
  MapPin, 
  Search, 
  QrCode, 
  FileText, 
  Clock, 
  MessageCircle, 
  ExternalLink,
  Award,
  ChevronRight,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { PartnerRegistrationItem } from '../types';
import { subscribeToPartnerRegistrations, addPartnerRegistrationToFirestore, updatePartnerInFirestore } from '../lib/firestoreService';
import { INITIAL_PARTNER_REGISTRATIONS, OFFICIAL_WA_NUMBER, calculatePartnerCommissions } from '../data/packagesData';

interface PartnerPortalProps {
  onBackToHome: () => void;
  onGoToKemitraan?: () => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  onBackToHome,
  onGoToKemitraan
}) => {
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [activePartner, setActivePartner] = useState<PartnerRegistrationItem | null>(null);
  const [partnersList, setPartnersList] = useState<PartnerRegistrationItem[]>(INITIAL_PARTNER_REGISTRATIONS);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // New Jamaah Input inside Partner Dashboard
  const [newJamaahName, setNewJamaahName] = useState('');
  const [newJamaahPhone, setNewJamaahPhone] = useState('');
  const [newJamaahPackage, setNewJamaahPackage] = useState('Umroh Friendly 9D WY (23 Sep 2026)');
  const [jamaahSubmitted, setJamaahSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Realtime subscription from Firestore
  useEffect(() => {
    const unsub = subscribeToPartnerRegistrations((data) => {
      if (data && data.length > 0) {
        // Merge with initial registrations if missing
        const merged = [...data];
        INITIAL_PARTNER_REGISTRATIONS.forEach((init) => {
          if (!merged.find(m => m.id === init.id || m.partnerCode === init.partnerCode)) {
            merged.push(init);
          }
        });
        setPartnersList(merged);

        // Keep active partner updated if logged in
        setActivePartner((prev) => {
          if (prev) {
            const updated = merged.find(p => p.id === prev.id || (p.partnerCode && p.partnerCode.toLowerCase() === prev.partnerCode?.toLowerCase()));
            return updated || prev;
          }
          return null;
        });
      }
    });

    return () => unsub();
  }, []);

  // Posisi pas masuk portal mitra selalu kosong/reset (tidak langsung memuat session sebelumnya)
  useEffect(() => {
    setActivePartner(null);
    setPartnerCodeInput('');
    setSearchError('');
  }, []);

  const handleSearchPartner = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const query = (customCode !== undefined ? customCode : partnerCodeInput).trim().toLowerCase();
    
    if (!query) {
      setSearchError('Silakan masukkan Kode Kemitraan (misal: AG-CAB-001, AG-AGN-525) atau No. WhatsApp terdaftar');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    const cleanQuery = query.replace(/\s+/g, '');
    const found = partnersList.find(p => {
      const codeMatch = p.partnerCode && p.partnerCode.toLowerCase().replace(/\s+/g, '') === cleanQuery;
      const phoneMatch = p.phone && p.phone.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, ''));
      const nameMatch = p.name.toLowerCase().includes(cleanQuery);
      return codeMatch || phoneMatch || nameMatch;
    });

    if (found) {
      setActivePartner(found);
      setPartnerCodeInput(found.partnerCode || '');
      setSearchError('');
      if (typeof window !== 'undefined' && found.partnerCode) {
        localStorage.setItem('alghanim_active_partner_code', found.partnerCode);
      }
    } else {
      setSearchError(`Data mitra dengan kata kunci "${query}" tidak ditemukan. Pastikan Anda telah memiliki Kode Kemitraan resmi dari AL-GHANIM.`);
    }
    setIsSearching(false);
  };

  const handleLogoutPartner = () => {
    setActivePartner(null);
    setPartnerCodeInput('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('alghanim_active_partner_code');
    }
  };

  const handleCopyPartnerCode = () => {
    if (!activePartner?.partnerCode) return;
    navigator.clipboard.writeText(activePartner.partnerCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendToWa = (jamaah: any) => {
    if (!activePartner) return;
    const waMsg = `Assalamu'alaikum PIC Kemitraan AL-GHANIM, saya Mitra Resmi *${activePartner.name}* (${activePartner.tier.toUpperCase()} - Kode: *${activePartner.partnerCode || '-'}*) ingin mengonfirmasi pendaftaran calon jamaah binaan:%0A%0A👤 *Nama Jamaah*: ${encodeURIComponent(jamaah.name)}%0A📱 *ID/NIJ*: ${encodeURIComponent(jamaah.nij || '-')}%0A🕋 *Program Paket*: ${encodeURIComponent(jamaah.packageName)}%0A📍 *Wilayah Mitra*: ${encodeURIComponent(activePartner.city)}%0A💰 *Estimasi Hak Ujrah*: ${encodeURIComponent(jamaah.commission || 'Rp 1.500.000')}%0A%0AMohon bantu verifikasi & catat dalam mutasi komisi kemitraan saya. Terima kasih.`;
    window.open(`https://wa.me/628131670218?text=${waMsg}`, '_blank');
  };

  const handleRegisterJamaah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJamaahName || !newJamaahPhone || !activePartner) return;

    setJamaahSubmitted(true);
    setSuccessNotice(null);
    const dateNow = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const newEntry = {
      id: `bin-${Date.now()}`,
      name: newJamaahName,
      nij: `AG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      packageName: newJamaahPackage,
      status: 'DP Terkonfirmasi' as const,
      commission: 'Rp 1.500.000',
      date: dateNow
    };

    const existingList = activePartner.binaanJamaah || [];
    const updatedBinaan = [newEntry, ...existingList];
    const candidatePartner = {
      ...activePartner,
      binaanJamaah: updatedBinaan,
      totalJamaah: updatedBinaan.length
    };
    const comms = calculatePartnerCommissions(candidatePartner);

    try {
      await updatePartnerInFirestore(activePartner.id, {
        binaanJamaah: updatedBinaan,
        totalJamaah: comms.totalJamaah,
        totalCommission: comms.totalCommission,
        paidCommission: comms.paidCommission,
        pendingCommission: comms.pendingCommission
      });
      setActivePartner({
        ...activePartner,
        binaanJamaah: updatedBinaan,
        totalJamaah: comms.totalJamaah,
        totalCommission: comms.totalCommission,
        paidCommission: comms.paidCommission,
        pendingCommission: comms.pendingCommission
      });
      setSuccessNotice(`Alhamdulillah! Calon jamaah "${newJamaahName}" berhasil didaftarkan dan langsung tersimpan di sistem pusat. Nama telah tercatat di tabel jamaah binaan sebelah kanan. Anda dapat memilih untuk mengirim konfirmasi ke WA Admin atau membiarkan sistem mencatatnya.`);
      setNewJamaahName('');
      setNewJamaahPhone('');
    } catch (err) {
      console.error('Error saving binaan to Firestore:', err);
    } finally {
      setJamaahSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1A1A1A] font-sans-luxury pb-20 selection:bg-[#A67C52] selection:text-white">
      
      {/* Top Standalone Header with Back to Home Button (NO GLOBAL NAVBAR OR FOOTER) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/90 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#F0EAE1] text-gray-800 flex items-center justify-center transition-all border border-[#A67C52]/30 cursor-pointer shadow-2xs flex-shrink-0"
              title="Kembali ke Beranda"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4 text-[#A67C52]" />
            </button>

            {onGoToKemitraan && (
              <button
                onClick={onGoToKemitraan}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Info Kemitraan</span>
              </button>
            )}
          </div>

          <div className="text-center">
            <h1 className="font-serif-luxury font-black text-sm sm:text-base tracking-wide text-[#1A1A1A]">
              PORTAL MITRA RESMI
            </h1>
            <p className="text-[10px] text-[#A67C52] font-bold uppercase tracking-wider">
              ALGHANIM ISLAMIC TOUR • PPIU NO. 1030/2019
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/628131670218?text=Halo%20PIC%20Kemitraan%20AL-GHANIM,%20saya%20butuh%20bantuan%20mengenai%20Portal%20Mitra."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PIC Mitra</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Search & Login Box with Quick Demo Chips */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#A67C52]/10 text-[#A67C52] border border-[#A67C52]/20 inline-block mb-1">
                Akses Dashboard Mitra
              </span>
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Cek Akun &amp; KTA Digital Mitra
              </h2>
            </div>
            <p className="text-xs text-gray-500 max-w-sm">
              Gunakan Kode Kemitraan resmi yang telah diberikan oleh admin travel untuk masuk ke portal.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchPartner} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={partnerCodeInput}
                onChange={(e) => setPartnerCodeInput(e.target.value)}
                placeholder="Masukkan Kode Kemitraan (cth: AG-CAB-001, AG-AGN-525, AG-MKT-108)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20 text-xs sm:text-sm outline-none bg-gray-50/50"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="py-2.5 px-6 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? 'Memeriksa...' : 'Buka Akun'}</span>
            </button>
            {activePartner && (
              <button
                type="button"
                onClick={handleLogoutPartner}
                className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                title="Keluar dari akun mitra ini"
              >
                Ganti Akun
              </button>
            )}
          </form>

          {searchError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="font-bold">Perhatian:</span> {searchError}
            </div>
          )}
        </section>

        {/* ACTIVE PARTNER DASHBOARD (Once Loaded) */}
        {activePartner && (() => {
          const partnerComms = calculatePartnerCommissions(activePartner);
          const isApproved = activePartner.status === 'Disetujui';

          const totalJamaahDisplay = (activePartner.totalJamaah !== undefined && activePartner.totalJamaah !== null && activePartner.totalJamaah > 0)
            ? activePartner.totalJamaah
            : partnerComms.totalJamaah;
          const totalCommissionDisplay = (activePartner.totalCommission && activePartner.totalCommission !== 'Rp 0')
            ? activePartner.totalCommission
            : partnerComms.totalCommission;
          const paidCommissionDisplay = (activePartner.paidCommission && activePartner.paidCommission !== 'Rp 0')
            ? activePartner.paidCommission
            : partnerComms.paidCommission;
          const pendingCommissionDisplay = (activePartner.pendingCommission && activePartner.pendingCommission !== 'Rp 0')
            ? activePartner.pendingCommission
            : partnerComms.pendingCommission;

          return (
            <div className="space-y-6">
              {/* Alert jika belum disetujui / masih menunggu verifikasi */}
              {!isApproved && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm flex items-start sm:items-center gap-3 shadow-xs">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-amber-900">
                      Status Akun: Menunggu Verifikasi Admin
                    </div>
                    <div className="text-amber-800 text-xs">
                      Permohonan kemitraan Anda telah tersimpan dan sedang menunggu persetujuan verifikasi oleh tim pusat AL-GHANIM. Komisi dan binaan akan otomatis disinkronkan saat akun Anda aktif.
                    </div>
                  </div>
                </div>
              )}

              {/* DIGITAL PARTNER ID CARD (KTA RESMI MITRA) */}
              <div className={`bg-gradient-to-br from-[#1F1F1F] via-[#2D2319] to-[#1A1A1A] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border ${
                isApproved ? 'border-[#A67C52]/40' : 'border-amber-400/50'
              }`}>
                {/* Gold watermark badge */}
                <div className="absolute right-[-20px] top-[-20px] w-48 h-48 rounded-full bg-[#A67C52]/10 blur-2xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  {/* Left: Info Mitra */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-[#A67C52] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>{activePartner.tier.toUpperCase()}</span>
                      </span>
                      {isApproved ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Status: Disetujui (Aktif)
                        </span>
                      ) : activePartner.status === 'Dihubungi' ? (
                        <span className="px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[11px] font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3 text-sky-300" />
                          Status: Dihubungi
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-300" />
                          Status: Menunggu Verifikasi
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-wide">
                        {activePartner.name}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E8C26E]" />
                        <span>{activePartner.city} • {activePartner.address || 'Wilayah Garut & Priangan Timur'}</span>
                      </p>
                    </div>

                    {/* Partner Code Box */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 font-mono text-xs font-bold text-[#E8C26E] flex items-center gap-2">
                        <span>Kode Mitra: <strong>{activePartner.partnerCode || 'AG-MITRA-525'}</strong></span>
                        <button
                          onClick={handleCopyPartnerCode}
                          className="p-1 hover:bg-white/20 rounded text-gray-200 transition-colors cursor-pointer"
                          title="Salin Kode Kemitraan"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        Bergabung sejak: {activePartner.createdAt ? activePartner.createdAt.split(' ')[0] : '2026'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KEY METRICS GRID (Total Jamaah & Ujrah Komisi) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-gray-500 text-[11px] font-medium block">Total Jamaah Binaan</span>
                  <p className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">
                    {totalJamaahDisplay} <span className="text-xs font-normal text-gray-500">Jamaah</span>
                  </p>
                  {isApproved ? (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold inline-block">
                      Terdaftar Resmi
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded font-semibold inline-block">
                      Menunggu Verifikasi
                    </span>
                  )}
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-gray-500 text-[11px] font-medium block">Estimasi Komisi/Ujrah</span>
                  <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#A67C52]">
                    {totalCommissionDisplay}
                  </p>
                  <span className="text-[10px] text-[#A67C52] bg-[#FAF8F5] px-2 py-0.5 rounded font-semibold inline-block">
                    Akumulasi
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-gray-500 text-[11px] font-medium block">Komisi Sedang Proses</span>
                  <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-amber-700">
                    {pendingCommissionDisplay}
                  </p>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold inline-block">
                    Menunggu Pelunasan
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-gray-500 text-[11px] font-medium block">Komisi Sudah Cair</span>
                  <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-emerald-700">
                    {paidCommissionDisplay}
                  </p>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold inline-block">
                    Transfer Berhasil
                  </span>
                </div>
              </div>

            {/* FORM INPUT JAMAAH BARU & LIST JAMAAH */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Daftarkan Jamaah Binaan */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="space-y-1 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A67C52]">
                    <UserPlus className="w-4 h-4" />
                    <span>Daftarkan Calon Jamaah</span>
                  </div>
                  <h4 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                    Input Data Jamaah Baru
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Setiap jamaah yang didaftarkan lewat form ini otomatis terkait dengan kode <strong>{activePartner.partnerCode}</strong> Anda.
                  </p>
                </div>

                <form onSubmit={handleRegisterJamaah} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Nama Lengkap Jamaah</label>
                    <input
                      type="text"
                      required
                      value={newJamaahName}
                      onChange={(e) => setNewJamaahName(e.target.value)}
                      placeholder="Contoh: H. Ahmad Supriyatna"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">No. WhatsApp Jamaah</label>
                    <input
                      type="tel"
                      required
                      value={newJamaahPhone}
                      onChange={(e) => setNewJamaahPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Pilihan Paket Ibadah</label>
                    <select
                      value={newJamaahPackage}
                      onChange={(e) => setNewJamaahPackage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20 outline-none bg-white"
                    >
                      <option value="Umroh Friendly 9D WY (23 Sep 2026)">Umroh Friendly 9D WY (23 Sep 2026)</option>
                      <option value="Umroh Awal Ramadhan 1448 H">Umroh Awal Ramadhan 1448 H</option>
                      <option value="Umroh Syawal Berkah (9 Hari)">Umroh Syawal Berkah (9 Hari)</option>
                      <option value="Umroh Plus Turki / Dubai">Umroh Plus Turki / Dubai</option>
                      <option value="Haji Khusus Kuota Kemenag RI">Haji Khusus Kuota Kemenag RI</option>
                      <option value="Haji Furoda VVIP Tanpa Antre">Haji Furoda VVIP Tanpa Antre</option>
                    </select>
                  </div>

                  {successNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold">Pendaftaran Berhasil</p>
                        <p className="text-[11px] leading-relaxed text-emerald-700">{successNotice}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={jamaahSubmitted}
                    className="w-full py-3 px-4 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{jamaahSubmitted ? 'Menyimpan Data Jamaah...' : 'Daftarkan Jamaah Binaan (Simpan ke Sistem)'}</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Riwayat Jamaah Binaan */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A67C52]">
                      <Users className="w-4 h-4" />
                      <span>Data Jamaah Binaan</span>
                    </div>
                    <h4 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                      Daftar Pendaftaran Terakhir
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-500 font-semibold bg-gray-100 px-2.5 py-1 rounded-lg">
                    Realtime Sync
                  </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                        <th className="py-2.5 px-2">Nama Jamaah</th>
                        <th className="py-2.5 px-2">Program Paket</th>
                        <th className="py-2.5 px-2">Status</th>
                        <th className="py-2.5 px-2 text-right">Hak Ujrah</th>
                        <th className="py-2.5 px-2 text-center">Aksi / WA Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {((activePartner.binaanJamaah && activePartner.binaanJamaah.length > 0) ? activePartner.binaanJamaah : []).map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <span className="font-bold text-gray-900 block">{item.name}</span>
                            <span className="text-[10px] text-gray-400">
                              {item.date || 'Telah Terdaftar'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-gray-700">{item.packageName}</td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.status === 'Lunas' || item.status === 'Selesai'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'DP Terkonfirmasi' || item.status === 'DP Masuk'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right font-serif-luxury font-bold text-[#A67C52] whitespace-nowrap">
                            {item.commission || 'Rp 1.500.000'}
                          </td>
                          <td className="py-3 px-2 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleSendToWa(item)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                              title="Kirim detail jamaah ini ke WhatsApp Admin Kemitraan"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Kirim ke WA Admin</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!activePartner.binaanJamaah || activePartner.binaanJamaah.length === 0) && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">
                            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="font-semibold text-gray-600 text-xs">Belum Ada Jamaah Binaan Terdaftar</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              Daftarkan jamaah baru lewat form di samping untuk mulai mengumpulkan komisi syiar Anda.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Marketing Kit Download Shortcut */}
                <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#FAF8F5] p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-[#A67C52] font-semibold">
                    <Download className="w-4 h-4" />
                    <span>Perlu Bahan Promosi &amp; Flyer Ber-Kode Anda?</span>
                  </div>
                  <a
                    href={`https://wa.me/628131670218?text=Halo%20Admin%20Desain%20ALGHANIM,%20mohon%20kirimkan%20bahan%20flyer%20promosi%20dengan%20Kode%20Kemitraan%20saya:%20${activePartner.partnerCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold text-[11px] whitespace-nowrap transition-colors"
                  >
                    Request Flyer Resmi
                  </a>
                </div>
              </div>

            </div>

          </div>
          );
        })()}

      </main>
    </div>
  );
};
