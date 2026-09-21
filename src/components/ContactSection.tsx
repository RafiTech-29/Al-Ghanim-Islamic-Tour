import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Lock,
  ShieldCheck,
  RotateCcw,
  FileDown,
  Building2,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Globe
} from 'lucide-react';
import { 
  OFFICIAL_WA_NUMBER, 
  OFFICIAL_WA_LINK, 
  OFFICIAL_INSTAGRAM_URL, 
  OFFICIAL_INSTAGRAM_HANDLE,
  LEGAL_INFO,
  DETAILED_SCHEDULES,
  OFFICES_DATA
} from '../data/packagesData';
import { generateConsultationBrochurePDF } from '../utils/pdfGenerator';
import { addInquiryToFirestore, subscribeToPackages } from '../lib/firestoreService';
import { PackageScheduleItem, SelectedRegistrationPackage } from '../types';

interface ContactSectionProps {
  selectedPackage?: SelectedRegistrationPackage | null;
  onResetSelectedPackage?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  selectedPackage,
  onResetSelectedPackage
}) => {
  const [selectedMapCity, setSelectedMapCity] = useState<'garut' | 'bandung' | 'jakarta'>('garut');
  const [availablePackages, setAvailablePackages] = useState<PackageScheduleItem[]>(DETAILED_SCHEDULES);

  const MAPS_EMBED_URLS = {
    garut: 'https://maps.google.com/maps?q=Mandala+Umroh,+Jl.+Sudirman+Copong+Garut,+Sukamentri&t=&z=17&ie=UTF8&iwloc=&output=embed',
    bandung: 'https://maps.google.com/maps?q=Metro+Trade+Center,+Jl.+Soekarno-Hatta+No.+590,+Sekejati,+Buahbatu,+Kota+Bandung&t=&z=16&ie=UTF8&iwloc=&output=embed',
    jakarta: 'https://maps.google.com/maps?q=Menara+Kadin+Indonesia,+Jl.+H.R.+Rasuna+Said,+Jakarta+Selatan&t=&z=16&ie=UTF8&iwloc=&output=embed'
  };

  // Subscribe to real-time packages from CMS / Firestore
  useEffect(() => {
    const unsubscribe = subscribeToPackages((items) => {
      if (items && items.length > 0) {
        setAvailablePackages(items);
      }
    });
    return () => unsubscribe();
  }, []);
  
  const [formData, setFormData] = useState({
    fullName: '',
    ktp: '',
    phone: '',
    email: '',
    programType: selectedPackage?.name || 'Umroh Reguler Direct 9 Hari (Saudia Airlines)',
    roomType: 'Quad (Sekamar Ber-4)',
    jamaahCount: '1 - 2 Orang',
    targetMonth: selectedPackage?.date || 'Bulan Depan / Terdekat',
    message: ''
  });

  // Sync formData with selectedPackage if prop updates
  useEffect(() => {
    if (selectedPackage) {
      setFormData((prev) => ({
        ...prev,
        programType: selectedPackage.name,
        targetMonth: selectedPackage.date || prev.targetMonth
      }));
    }
  }, [selectedPackage]);

  const [submittedSnapshot, setSubmittedSnapshot] = useState<{
    fullName: string;
    ktp: string;
    phone: string;
    email: string;
    programType: string;
    roomType: string;
    jamaahCount: string;
    targetMonth: string;
    message: string;
    refCode: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfDownloadedSuccess, setPdfDownloadedSuccess] = useState(false);

  const handleDownloadPDF = async () => {
    const dataToUse = submittedSnapshot || formData;
    const matchedPkg = availablePackages.find(p => p.title === dataToUse.programType || p.id === (selectedPackage as any)?.id) ||
                       (selectedPackage?.name === dataToUse.programType ? (selectedPackage as any) : null);

    setIsDownloadingPdf(true);
    try {
      // Calculate dynamic price based on room type
      let calculatedPrice = matchedPkg?.price || selectedPackage?.price || '';
      if (dataToUse.roomType?.includes('Quad')) {
        calculatedPrice = matchedPkg?.quadPrice || matchedPkg?.priceQuad || matchedPkg?.price || selectedPackage?.quadPrice || selectedPackage?.price || '';
      } else if (dataToUse.roomType?.includes('Triple')) {
        calculatedPrice = matchedPkg?.triplePrice || matchedPkg?.priceTriple || selectedPackage?.triplePrice || matchedPkg?.price || selectedPackage?.price || '';
      } else if (dataToUse.roomType?.includes('Double')) {
        calculatedPrice = matchedPkg?.doublePrice || matchedPkg?.priceDouble || selectedPackage?.doublePrice || matchedPkg?.price || selectedPackage?.price || '';
      }

      generateConsultationBrochurePDF({
        fullName: dataToUse.fullName || 'Calon Jamaah ALGHANIM',
        phone: dataToUse.phone || '-',
        email: dataToUse.email,
        programType: dataToUse.programType,
        jamaahCount: dataToUse.jamaahCount,
        message: dataToUse.message,
        ktp: dataToUse.ktp,
        roomType: dataToUse.roomType,
        targetMonth: dataToUse.targetMonth,
        refCode: (dataToUse as any).refCode || 'REG-ALGHANIM',
        // Dynamic specifications connected to CMS
        price: calculatedPrice,
        airline: matchedPkg?.airline || selectedPackage?.airline,
        hotelMakkah: matchedPkg?.hotelMakkah || selectedPackage?.hotelMakkah,
        hotelMadinah: matchedPkg?.hotelMadinah || selectedPackage?.hotelMadinah,
        makkahDistance: matchedPkg?.hotelDistanceMakkah || matchedPkg?.makkahDistance || selectedPackage?.makkahDistance,
        duration: matchedPkg?.duration || selectedPackage?.duration,
        departureDate: matchedPkg?.departureDate || selectedPackage?.date,
        programHighlights: matchedPkg?.programHighlights || selectedPackage?.programHighlights
      });
      setPdfDownloadedSuccess(true);
      setTimeout(() => setPdfDownloadedSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    setIsSubmitting(true);
    const refCode = `REF/AG-${Date.now().toString().slice(-6)}/${new Date().getFullYear()}`;
    const snapshot = { ...formData, refCode };

    try {
      // 1. Simpan ke Firestore secara realtime
      await addInquiryToFirestore({
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        type: 'Formulir Pendaftaran Paket Ibadah',
        packageInterest: formData.programType,
        message: `[${refCode}]\nNIK: ${formData.ktp && formData.ktp.trim() ? formData.ktp.trim() : 'Belum diisi'}\nRencana: ${formData.jamaahCount} (${formData.targetMonth})\nKamar: ${formData.roomType}\nEmail: ${formData.email || '-'}\nPesan: ${formData.message || 'Pendaftaran via Formulir Pendaftaran Paket Ibadah Website.'}`,
        status: 'Baru'
      });
    } catch (err) {
      console.warn('Error saving contact to firestore:', err);
    } finally {
      setIsSubmitting(false);
      setSubmittedSnapshot(snapshot);
    }
  };

  const handleSendToWhatsApp = (snapshotToUse: any = submittedSnapshot || formData) => {
    const nikVal = snapshotToUse.ktp && snapshotToUse.ktp.trim() ? snapshotToUse.ktp.trim() : '';
    const nikLine = nikVal ? `\n*NIK / No. KTP:* ${nikVal}` : '';
    const roomLine = snapshotToUse.roomType ? `\n*Tipe Kamar:* ${snapshotToUse.roomType}` : '';

    const text = `Halo Admin ALGHANIM (Mandala 525 Garut), saya ingin konsultasi paket ibadah.
*No. Registrasi:* ${snapshotToUse && 'refCode' in snapshotToUse ? snapshotToUse.refCode : 'WEB-INQUIRY'}
*Nama:* ${snapshotToUse.fullName || '-'}${nikLine}
*No. WhatsApp:* ${snapshotToUse.phone || '-'}
*Email:* ${snapshotToUse.email || '-'}
*Pilihan Paket:* ${snapshotToUse.programType}${roomLine}
*Rencana Jumlah Jamaah:* ${snapshotToUse.jamaahCount}
*Perkiraan Waktu:* ${snapshotToUse.targetMonth}
*Pesan:* ${snapshotToUse.message || 'Mohon kirimkan brosur PDF dan konfirmasi jadwal pendaftaran.'}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/628131670218?text=${encoded}`, '_blank');
  };

  const handleFastWhatsApp = () => {
    let text = '';
    if (selectedPackage) {
      const parts = [
        `Assalamu'alaikum Admin ALGHANIM & Mandala 525 Garut, saya tertarik dan ingin mendaftar paket:`,
        `*Nama Paket:* ${selectedPackage.name}`,
        selectedPackage.date ? `*Jadwal Keberangkatan:* ${selectedPackage.date}` : '',
        selectedPackage.duration ? `*Durasi Program:* ${selectedPackage.duration}` : '',
        selectedPackage.quadPrice ? `*Pilihan Quad:* ${selectedPackage.quadPrice}` : '',
        selectedPackage.triplePrice ? `*Pilihan Triple:* ${selectedPackage.triplePrice}` : '',
        selectedPackage.doublePrice ? `*Pilihan Double:* ${selectedPackage.doublePrice}` : '',
        (!selectedPackage.quadPrice && selectedPackage.price) ? `*Harga:* ${selectedPackage.price}` : '',
        `\nMohon informasi ketersediaan kuota (seat) dan langkah pendaftaran selanjutnya. Terima kasih.`
      ].filter(Boolean).join('\n');
      text = parts;
    } else if (formData.programType) {
      text = `Assalamu'alaikum Admin ALGHANIM & Mandala 525 Garut, saya ingin konsultasi paket ibadah:
*Pilihan Paket:* ${formData.programType}
*Rencana Jumlah Jamaah:* ${formData.jamaahCount} Orang
*Perkiraan Waktu:* ${formData.targetMonth}

Mohon panduan pendaftaran dan ketersediaan jadwalnya. Terima kasih.`;
    } else {
      text = `Assalamu'alaikum Admin ALGHANIM Islamic Tour, saya ingin konsultasi langsung dan tanya mengenai paket Umroh & Haji yang tersedia. Mohon dibimbing. Terima kasih.`;
    }

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/628131670218?text=${encoded}`, '_blank');
  };

  return (
    <section id="kontak-section" className="py-4 sm:py-10 md:py-14 bg-white text-[#1A1A1A] relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 space-y-6 sm:space-y-10 relative z-10 w-full max-w-full">
        
        {/* =========================================================================
            BANNER KONSULTASI CEPAT VIA WHATSAPP (SESUAI GAMBAR DENGAN ADAPTASI PAKET)
            Bagi jamaah yang ingin langsung tanya/daftar via WA tanpa repot formulir panjang
            ========================================================================= */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0C6A48] via-[#0A5C3E] to-[#07472E] text-white p-5 sm:p-8 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden">
          <div className="space-y-2.5 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
              <span>KONSULTASI LANGSUNG TANPA RIBET</span>
            </div>
            
            <h3 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide leading-tight">
              Ingin Tanya Langsung atau Dibimbing via WhatsApp?
            </h3>
            
            <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
              Bagi jamaah lansia atau yang ingin konsultasi cepat tanpa mengisi formulir panjang di web, Anda bisa langsung terhubung dengan Customer Service kami.
            </p>

            {/* Dynamic Package Context Pill if Jamaah Came from Package Selection */}
            {selectedPackage && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/25 backdrop-blur-xs border border-white/20 text-xs text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                  <span>
                    Paket Pilihan: <strong className="text-amber-200">{selectedPackage.name}</strong>
                    {selectedPackage.date ? ` • ${selectedPackage.date}` : ''}
                    {selectedPackage.quadPrice || selectedPackage.price ? ` • ${selectedPackage.quadPrice || selectedPackage.price}` : ''}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-100 font-medium">
                  ✓ Template WA otomatis disesuaikan
                </span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 w-full lg:w-auto relative z-10">
            <button
              type="button"
              onClick={handleFastWhatsApp}
              className="w-full lg:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-[#0C6A48] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-102 active:scale-98 cursor-pointer whitespace-nowrap group"
            >
              <Phone className="w-4 h-4 text-[#0C6A48] group-hover:rotate-12 transition-transform" />
              <span>{selectedPackage ? 'CHAT WA DAFTAR PAKET INI' : 'CHAT WHATSAPP KONSULTAN'}</span>
            </button>
          </div>
        </div>

        {/* PUSAT KONSULTASI RESMI & PENDAFTARAN SATU PINTU (OPTIMIZED SOFTENED WRAPPER) */}
        <div id="registration-hub-form" className="p-6 sm:p-10 rounded-3xl bg-[#FAFAFA] border border-gray-150 space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#A67C52] bg-white px-3 py-0.5 rounded-full border border-[#A67C52]/20 inline-block shadow-2xs">
              Pusat Layanan Pendaftaran &amp; Konsultasi
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A]">
              Formulir Pendaftaran Paket Ibadah
            </h2>
            <p className="text-xs sm:text-sm text-[#666666]">
              Lengkapi data di bawah ini untuk pendaftaran seat dan konfirmasi ketersediaan paket ibadah Anda.
            </p>
          </div>

          {/* HIGHLIGHT BANNER: PAKET YANG TERPILIH (CLEAN, MINIMALIST & TIDAK BERDESAKAN) */}
          {selectedPackage && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#A67C52]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#A67C52] text-white text-[10px] font-bold uppercase tracking-wider">
                    Paket Pilihan
                  </span>
                  {selectedPackage.duration && (
                    <span className="text-xs text-gray-600 font-medium">
                      • {selectedPackage.duration}
                    </span>
                  )}
                  {selectedPackage.date && (
                    <span className="text-xs text-[#A67C52] font-semibold">
                      • {selectedPackage.date}
                    </span>
                  )}
                </div>
                <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1A1A1A]">
                  {selectedPackage.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                  {selectedPackage.quadPrice && (
                    <span>Quad: <strong className="text-[#A67C52]">{selectedPackage.quadPrice}</strong></span>
                  )}
                  {selectedPackage.triplePrice && (
                    <span>Triple: <strong className="text-[#A67C52]">{selectedPackage.triplePrice}</strong></span>
                  )}
                  {selectedPackage.doublePrice && (
                    <span>Double: <strong className="text-[#A67C52]">{selectedPackage.doublePrice}</strong></span>
                  )}
                </div>
              </div>

              {onResetSelectedPackage && (
                <button
                  type="button"
                  onClick={onResetSelectedPackage}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition-all cursor-pointer whitespace-nowrap self-end sm:self-auto"
                >
                  Ganti Paket
                </button>
              )}
            </div>
          )}

          {submittedSnapshot ? (
            <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#A67C52]/30 shadow-xl max-w-2xl mx-auto space-y-6 text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] px-3 py-1 rounded-full bg-[#A67C52]/15 text-[#A67C52] font-bold uppercase tracking-wider">
                  No. Registrasi: {submittedSnapshot.refCode}
                </span>
                <h4 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A] pt-2">
                  Pendaftaran Seat Berhasil Tercatat!
                </h4>
                <p className="text-xs sm:text-sm text-[#555555] max-w-md mx-auto leading-relaxed">
                  Jazakallahu khairan, Bapak/Ibu <strong className="text-[#1A1A1A]">{submittedSnapshot.fullName}</strong>. Pendaftaran paket Anda telah resmi tercatat di database Al-Ghanim &amp; Mandala 525 Garut.
                </p>
              </div>

              {/* Data Summary Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] border border-gray-200 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Program Dipilih:</span>
                  <span className="font-bold text-[#A67C52]">{submittedSnapshot.programType}</span>
                </div>
                {submittedSnapshot.ktp && submittedSnapshot.ktp.trim() && submittedSnapshot.ktp !== 'Belum diisi' && (
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">NIK / No. KTP:</span>
                    <span className="font-semibold text-gray-800 font-mono tracking-wide">{submittedSnapshot.ktp}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Pilihan Kamar:</span>
                  <span className="font-semibold text-gray-800">{submittedSnapshot.roomType}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Jumlah Jamaah:</span>
                  <span className="font-semibold text-gray-800">{submittedSnapshot.jamaahCount}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">WhatsApp Terdaftar:</span>
                  <span className="font-semibold text-gray-800">{submittedSnapshot.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-semibold text-gray-800">{submittedSnapshot.email || '- (Konfirmasi via WA)'}</span>
                </div>
              </div>

              {/* Action Buttons: Unduh Bukti PDF & WhatsApp Konsultan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPdf}
                  className="py-3.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider border-2 border-[#A67C52] flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer hover:border-[#8E653E]"
                >
                  <FileDown className="w-4 h-4 text-[#A67C52]" />
                  <span>{pdfDownloadedSuccess ? '✓ Bukti PDF Terunduh' : 'Unduh Bukti Pendaftaran (PDF)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendToWhatsApp(submittedSnapshot)}
                  className="py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Lanjutkan Chat WhatsApp</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedSnapshot(null);
                    if (onResetSelectedPackage) onResetSelectedPackage();
                    setFormData({
                      fullName: '',
                      ktp: '',
                      phone: '',
                      email: '',
                      programType: 'Umroh Reguler Direct 9 Hari',
                      roomType: 'Quad (Sekamar Ber-4)',
                      jamaahCount: '1 - 2 Orang',
                      targetMonth: 'Bulan Depan / Terdekat',
                      message: ''
                    });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4 text-xs">
              {/* Row 1: Nama Lengkap, NIK/KTP, WA Aktif */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">
                    Nama Lengkap Jamaah *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: H. Suparman"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">
                    Nomor NIK / KTP <span className="text-gray-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="320501xxxxxxxxxx (16 Digit)"
                    value={formData.ktp}
                    onChange={(e) => setFormData({ ...formData, ktp: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[#1A1A1A] font-mono outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              {/* Row 2: Email, Kategori Pilihan Paket Ibadah & Tipe Kamar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">
                    Email <span className="text-gray-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">
                    Kategori &amp; Pilihan Paket Ibadah *
                  </label>
                  <select
                    value={formData.programType}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const found = availablePackages.find(p => p.title === selectedVal);
                      setFormData(prev => ({
                        ...prev,
                        programType: selectedVal,
                        targetMonth: found?.departureDate || prev.targetMonth
                      }));
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[#1A1A1A] font-semibold outline-none focus:border-[#A67C52] cursor-pointer truncate"
                  >
                    {selectedPackage?.name && !availablePackages.some(p => p.title === selectedPackage.name) && (
                      <optgroup label="Paket yang Anda Pilih">
                        <option value={selectedPackage.name}>
                          {selectedPackage.name} {selectedPackage.price ? `(${selectedPackage.price})` : ''}
                        </option>
                      </optgroup>
                    )}

                    <optgroup label="Paket Umroh &amp; Haji (Update Realtime)">
                      {availablePackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.title}>
                          {pkg.title} ({pkg.duration}) - {pkg.price}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="Layanan Khusus &amp; Lainnya">
                      <option value="Umroh Privat Keluarga & Komunitas (Custom Jadwal)">Umroh Privat Keluarga &amp; Komunitas (Custom Jadwal)</option>
                      <option value="Haji Furoda / Mujamalah 1448 H (Langsung Berangkat)">Haji Furoda / Mujamalah 1448 H (Direct Visa Resmi)</option>
                      <option value="Program Tabungan Umroh Syariah BSI (Cicilan Ringan)">Program Tabungan Umroh Syariah BSI</option>
                      <option value="Layanan Badal Umroh Amanah (Sertifikat & Dokumentasi)">Layanan Badal Umroh Amanah (Rp 2,5 Jt)</option>
                      <option value="Konsultasi Kustom / Lainnya">Lainnya (Tuliskan di Catatan)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Pilihan Tipe Kamar Hotel</label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  >
                    <option value="Quad (Sekamar Ber-4)">Quad (Sekamar Ber-4 - Hemat &amp; Berkah)</option>
                    <option value="Triple (Sekamar Ber-3)">Triple (Sekamar Ber-3)</option>
                    <option value="Double (Sekamar Ber-2 / Suami-Istri)">Double (Sekamar Ber-2 / Pasutri)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Jumlah Jamaah & Rencana Bulan Berangkat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Rencana Jumlah Jamaah</label>
                  <input
                    type="text"
                    value={formData.jamaahCount}
                    onChange={(e) => setFormData({ ...formData, jamaahCount: e.target.value })}
                    placeholder="Contoh: 2 Orang (Suami &amp; Istri)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Target Bulan / Tanggal Keberangkatan</label>
                  <input
                    type="text"
                    value={formData.targetMonth}
                    onChange={(e) => setFormData({ ...formData, targetMonth: e.target.value })}
                    placeholder="Contoh: November 2026 / Syawal / Akhir Tahun"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              {/* Row 4: Catatan Tambahan */}
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Catatan Tambahan / Kebutuhan Khusus</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan jika ada kebutuhan lansia/kursi roda, penggabungan kamar keluarga, request paspor, atau jadwal manasik tatap muka di Garut/Bandung..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Menyimpan Pendaftaran...' : 'Kirim Pendaftaran & Dapatkan Lembar PDF Resmi'}</span>
                </button>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#A67C52]" />
                    Pendaftaran terverifikasi resmi oleh Customer Service ALGHANIM Garut.
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>

{/* =========================================================================
          LOKASI KANTOR RESMI & GOOGLE MAPS INTERAKTIF
      ========================================================================== */}
      <div id="lokasi-kantor-resmi" className="space-y-12 pt-8 border-t border-gray-200 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#A67C52] bg-[#F5F5F5] px-3.5 py-1 rounded-full border border-gray-200 inline-block shadow-sm">
            Kantor Operasional &amp; Legalitas
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Lokasi Kantor Resmi ALGHANIM
          </h2>
          <p className="font-sans-luxury text-sm sm:text-base text-[#555555] leading-relaxed">
            Kunjungi kantor representatif kami di Garut, Bandung, dan Jakarta untuk konsultasi langsung, penyerahan berkas jamaah, maupun silaturahmi tatap muka.
          </p>
        </div>

{/* 3 KARTU KANTOR RESMI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Kantor Cabang Garut (Highlight Utama) */}
          <div 
            onClick={() => setSelectedMapCity('garut')}
            className={`p-6 sm:p-8 rounded-3xl bg-white shadow-lg space-y-6 relative flex flex-col justify-between cursor-pointer transition-all ${
              selectedMapCity === 'garut' ? 'border-2 border-[#A67C52] ring-2 ring-[#A67C52]/20' : 'border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#A67C52] text-white text-xs font-bold uppercase tracking-wider">
                  Kantor Operasional Garut
                </span>
                <div className="p-2 rounded-xl bg-[#F5F5F5] text-[#A67C52]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">
                  Kantor Operasional Garut (Mandala Umroh)
                </h3>
                <p className="text-xs text-[#A67C52] font-semibold mt-0.5">
                  Pusat Layanan &bull; Supported by @mandala525islamictour
                </p>
              </div>

              <div className="space-y-3 text-xs text-[#555555]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#A67C52] flex-shrink-0 mt-0.5" />
                  <span>Jl. Sudirman Copong Garut, Sukamentri, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44116</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                  <span className="font-bold text-[#1A1A1A]">0813-1670-218 / (0262) 4890731</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                  <span>Senin – Sabtu: 09.00 – 17.00 WIB</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMapCity('garut');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Lihat di Peta</span>
              </button>
              <a
                href={OFFICES_DATA.garut.mapsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] transition-colors"
                title="Buka Aplikasi Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Kantor Cabang Bandung */}
          <div 
            onClick={() => setSelectedMapCity('bandung')}
            className={`p-6 sm:p-8 rounded-3xl bg-white shadow-md space-y-6 flex flex-col justify-between cursor-pointer transition-all ${
              selectedMapCity === 'bandung' ? 'border-2 border-[#A67C52] ring-2 ring-[#A67C52]/20' : 'border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#F5F5F5] text-[#A67C52] text-xs font-bold uppercase tracking-wider border border-gray-200">
                  Kantor Cabang Bandung
                </span>
                <div className="p-2 rounded-xl bg-[#F5F5F5] text-[#A67C52]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">
                  Al-Ghanim Bandung
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  Layanan Konsultasi Priangan
                </p>
              </div>

              <div className="space-y-3 text-xs text-[#555555]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#A67C52] flex-shrink-0 mt-0.5" />
                  <span>Jl. Soekarno Hatta No. 590, Sekejati, Buahbatu, Kota Bandung, Jawa Barat 40286</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                  <span>0813-1670-218</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                  <span>Senin – Sabtu: 09.00 – 17.30 WIB</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMapCity('bandung');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#F5F5F5] hover:bg-gray-200 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Lihat di Peta</span>
              </button>
              <a
                href={OFFICES_DATA.bandung.waLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] transition-colors"
                title="Hubungi Cabang Bandung"
              >
                <Phone className="w-4 h-4 text-[#A67C52]" />
              </a>
            </div>
          </div>

          {/* Kantor Pusat Jakarta */}
          <div 
            onClick={() => setSelectedMapCity('jakarta')}
            className={`p-6 sm:p-8 rounded-3xl bg-white shadow-md space-y-6 flex flex-col justify-between cursor-pointer transition-all ${
              selectedMapCity === 'jakarta' ? 'border-2 border-[#A67C52] ring-2 ring-[#A67C52]/20' : 'border border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#F5F5F5] text-[#A67C52] text-xs font-bold uppercase tracking-wider border border-gray-200">
                  Kantor Pusat Jakarta
                </span>
                <div className="p-2 rounded-xl bg-[#F5F5F5] text-[#A67C52]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">
                  PT. Al-Ghanimah Berkah Bersama
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  PPIU No. 1030 Tahun 2019 (Akreditasi A)
                </p>
              </div>

              <div className="space-y-3 text-xs text-[#555555]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#A67C52] flex-shrink-0 mt-0.5" />
                  <span>Gedung Menara Kadin Indonesia Lt. 12, Jl. H.R. Rasuna Said, Jakarta Selatan 12950</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                  <span>0813-1670-218</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
                  <span>Senin – Jumat: 08.30 – 17.30 WIB</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMapCity('jakarta');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#F5F5F5] hover:bg-gray-200 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Lihat di Peta</span>
              </button>
              <a
                href={OFFICES_DATA.jakarta.waLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] transition-colors"
                title="Hubungi Kantor Pusat"
              >
                <Phone className="w-4 h-4 text-[#A67C52]" />
              </a>
            </div>
          </div>

        </div>

        {/* SECTION INTERAKTIF: GOOGLE MAPS EMBEDDED VIEW */}
        <div className="rounded-3xl bg-[#F5F5F5] border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#A67C52]" />
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  Peta Lokasi Google Maps Kantor
                </h3>
              </div>
              <p className="text-xs text-[#666666] mt-0.5">
                Pilih lokasi kantor untuk melihat rute jalan langsung di peta interaktif:
              </p>
            </div>

            {/* City Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedMapCity('garut')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedMapCity === 'garut'
                    ? 'bg-[#A67C52] text-white shadow-md'
                    : 'bg-white text-[#1A1A1A] hover:bg-gray-200 border border-gray-200'
                }`}
              >
                📍 Cabang Garut
              </button>

              <button
                type="button"
                onClick={() => setSelectedMapCity('bandung')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedMapCity === 'bandung'
                    ? 'bg-[#A67C52] text-white shadow-md'
                    : 'bg-white text-[#1A1A1A] hover:bg-gray-200 border border-gray-200'
                }`}
              >
                📍 Cabang Bandung
              </button>

              <button
                type="button"
                onClick={() => setSelectedMapCity('jakarta')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedMapCity === 'jakarta'
                    ? 'bg-[#A67C52] text-white shadow-md'
                    : 'bg-white text-[#1A1A1A] hover:bg-gray-200 border border-gray-200'
                }`}
              >
                📍 Pusat Jakarta
              </button>
            </div>
          </div>

          {/* Embedded Google Maps Container */}
          <div className="relative w-full h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border border-gray-300 shadow-inner bg-gray-100">
            <iframe
              title={`Google Maps ${selectedMapCity}`}
              src={MAPS_EMBED_URLS[selectedMapCity]}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />

            {/* Bottom floating details badge on map */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#A67C52] text-white">
                  {selectedMapCity === 'garut' ? 'Kantor Cabang Garut' : selectedMapCity === 'bandung' ? 'Kantor Cabang Bandung' : 'Kantor Pusat Jakarta'}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold">0813-1670-218</span>
              </div>
              <p className="text-xs text-[#1A1A1A] font-medium leading-snug">
                {selectedMapCity === 'garut' 
                  ? 'Jl. Sudirman Copong Garut, Sukamentri, Kec. Garut Kota, Kab. Garut, Jawa Barat 44116'
                  : selectedMapCity === 'bandung'
                  ? 'Jl. Soekarno Hatta No. 590, Sekejati, Buahbatu, Kota Bandung, Jawa Barat 40286'
                  : 'Gedung Menara Kadin Indonesia Lt. 12, Jl. H.R. Rasuna Said, Jakarta Selatan 12950'
                }
              </p>
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={selectedMapCity === 'garut' ? 'https://www.google.com/maps/place/Mandala+Umroh/@-7.1987676,107.9108831,17z/data=!3m1!4b1!4m6!3m5!1s0x2e68b104425f10ab:0xab1f9dc7619e16f9!8m2!3d-7.1987676!4d107.9108831!16s%2Fg%2F11t7k1s3_y' : selectedMapCity === 'bandung' ? 'https://maps.google.com/?q=Jl.+Soekarno+Hatta+No.+590+Bandung' : 'https://maps.google.com/?q=Menara+Kadin+Indonesia+Jakarta'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-[#A67C52] hover:bg-[#8E653E] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Petunjuk Arah Rute</span>
                </a>
                <a
                  href={`https://wa.me/628131670218?text=Halo%20Admin%20Al-Ghanim%20${selectedMapCity.toUpperCase()},%20saya%20ingin%20berkunjung%20ke%20kantor`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>WA</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION SOSIAL MEDIA RESMI ALGHANIM (MINIMALIS & LOGO FOCUS)
        ========================================================================== */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm text-center">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A67C52]">
              Kanal Resmi
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Terhubung dengan AL-GHANIM
            </h3>
          </div>

          {/* Minimalist Logo-Only Row (Rapi, Elegan & Tidak Bertumpuk) */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto flex-wrap">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/alghanimislamictour/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-gray-200 hover:border-[#E1306C] shadow-2xs hover:shadow-md transition-all flex items-center justify-center group cursor-pointer"
              title="Instagram @alghanimislamictour"
              aria-label="Instagram Resmi AL-GHANIM"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Instagram className="w-4 h-4" />
              </div>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@alghanimislamictour"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-gray-200 hover:border-black shadow-2xs hover:shadow-md transition-all flex items-center justify-center group cursor-pointer"
              title="TikTok @alghanimislamictour"
              aria-label="TikTok Resmi AL-GHANIM"
            >
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform font-bold text-xs">
                Tk
              </div>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@alghanimislamictour"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-gray-200 hover:border-[#FF0000] shadow-2xs hover:shadow-md transition-all flex items-center justify-center group cursor-pointer"
              title="YouTube AL-GHANIM Official"
              aria-label="YouTube Resmi AL-GHANIM"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Youtube className="w-4 h-4" />
              </div>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/alghanimislamictour"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-gray-200 hover:border-[#1877F2] shadow-2xs hover:shadow-md transition-all flex items-center justify-center group cursor-pointer"
              title="Facebook AL-GHANIM"
              aria-label="Facebook Resmi AL-GHANIM"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Facebook className="w-4 h-4" />
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/628131670218?text=Halo%20Admin%20ALGHANIM,%20saya%20ingin%20konsultasi%20paket%20ibadah"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-gray-200 hover:border-[#25D366] shadow-2xs hover:shadow-md transition-all flex items-center justify-center group cursor-pointer"
              title="WhatsApp Resmi 0813-1670-218"
              aria-label="WhatsApp Resmi AL-GHANIM"
            >
              <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>
        
      </div>

    
      </div>
    </section>
  );
};
