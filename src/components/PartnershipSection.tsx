import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Send, 
  PhoneCall, 
  Award, 
  ArrowRight, 
  TrendingUp, 
  Download, 
  FileText, 
  FileDown, 
  ShieldCheck, 
  HelpCircle, 
  Share2, 
  DollarSign, 
  Briefcase, 
  Check, 
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { 
  PARTNERSHIP_PROGRAMS, 
  OFFICIAL_WA_LINK, 
  OFFICIAL_WA_NUMBER,
  LEGAL_INFO,
  OFFICES_DATA
} from '../data/packagesData';
import { generatePartnershipProgramPDF, generateFullMarketingKitPDF } from '../utils/pdfGenerator';
import { addPartnerRegistrationToFirestore } from '../lib/firestoreService';

interface PartnershipSectionProps {
  onOpenPartnerPortal?: () => void;
  defaultMode?: 'daftar-baru' | 'sudah-bermitra';
  selectedTier?: 'cabang' | 'agen' | 'marketer';
}

export const PartnershipSection: React.FC<PartnershipSectionProps> = ({
  onOpenPartnerPortal,
  selectedTier
}) => {
  const [activeType, setActiveType] = useState<'cabang' | 'agen' | 'marketer'>(selectedTier || 'agen');

  useEffect(() => {
    if (selectedTier) {
      setActiveType(selectedTier);
      const timer = setTimeout(() => {
        const el = document.getElementById(`program-${selectedTier}`) || document.getElementById('form-kemitraan');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedTier]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingProgram, setDownloadingProgram] = useState<string | null>(null);
  const [downloadSuccessProgram, setDownloadSuccessProgram] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    const tierMap: Record<'cabang' | 'agen' | 'marketer', 'Cabang' | 'Agen' | 'Marketer Syiar'> = {
      'cabang': 'Cabang',
      'agen': 'Agen',
      'marketer': 'Marketer Syiar'
    };

    try {
      // 1. Simpan ke database Firestore secara realtime
      await addPartnerRegistrationToFirestore({
        name: fullName,
        phone: phone,
        city: city || 'Garut / Luar Kota',
        tier: tierMap[activeType],
        experience: notes || 'Pendaftaran kemitraan baru via web.',
        status: 'Menunggu Verifikasi',
        totalJamaah: 0,
        totalCommission: 'Rp 0',
        paidCommission: 'Rp 0',
        pendingCommission: 'Rp 0',
        binaanJamaah: []
      });
    } catch (err) {
      console.warn('Could not save to firestore, proceeding with WA:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);

      // 2. Hubungkan ke WhatsApp
      const message = `Halo Manajemen Kemitraan ALGHANIM (Supported by Mandala 525), saya berminat mendaftar Program Kemitraan: *${activeType.toUpperCase()}*.%0ANama: ${encodeURIComponent(fullName)}%0ANo. WA: ${encodeURIComponent(phone)}%0AKota/Domisili: ${encodeURIComponent(city || '-')}%0APengalaman/Rencana: ${encodeURIComponent(notes || '-')}`;
      window.open(`https://wa.me/628131670218?text=${message}`, '_blank');
    }
  };

  const handleDownloadProgramPDF = (programTitle: string) => {
    setDownloadingProgram(programTitle);
    try {
      generatePartnershipProgramPDF(programTitle);
      setDownloadSuccessProgram(programTitle);
      setTimeout(() => setDownloadSuccessProgram(null), 3500);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloadingProgram(null);
    }
  };

  const handleDownloadFullKitPDF = () => {
    setDownloadingProgram('full_kit');
    try {
      generateFullMarketingKitPDF();
      setDownloadSuccessProgram('full_kit');
      setTimeout(() => setDownloadSuccessProgram(null), 3500);
    } catch (err) {
      console.error('Error generating full marketing kit PDF:', err);
    } finally {
      setDownloadingProgram(null);
    }
  };

  return (
    <section id="kemitraan-section" className="py-4 sm:py-10 md:py-16 px-3 sm:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12 bg-white text-[#1A1A1A] w-full max-w-full overflow-x-hidden scroll-mt-20">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#A67C52] bg-[#F5F5F5] px-3.5 py-1 rounded-full border border-gray-200 inline-block shadow-sm">
          Peluang Syiar Baitullah &amp; Wirausaha Syariah
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
          Pusat Kemitraan Resmi ALGHANIM
        </h1>
        <p className="font-sans-luxury text-sm text-[#555555] leading-relaxed">
          Kemitraan resmi berizin Kemenag RI (PPIU No. 1030/2019) dengan sistem bagi hasil amanah untuk asatidz, yayasan, &amp; syiar umat.
        </p>

      </div>

      {/* SATU PINTU MASUK: KHUSUS MITRA TERDAFTAR (LANGSUNG BUKA TAB BARU) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#1A1A1A] text-white border border-amber-500/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-black text-[10px] font-extrabold uppercase tracking-wider">
                Khusus Mitra Terdaftar
              </span>
              <span className="text-xs text-amber-200/80">Cabang • Agen • Marketer</span>
            </div>
            <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white">
              Sudah Bermitra dengan Al-Ghanim?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Pantau status komisi syiar, kelola jamaah binaan, dan unduh materi promosi resmi.
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (onOpenPartnerPortal) {
                onOpenPartnerPortal();
              } else {
                window.location.hash = '#/portal-mitra';
              }
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 cursor-pointer whitespace-nowrap text-center"
            title="Buka Portal Mandiri Mitra Resmi"
          >
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>Portal Mitra Terdaftar</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {/* 4 Steps: Panduan Cara Bergabung Menjadi Mitra */}
        <div className="p-5 sm:p-8 rounded-2xl bg-[#FAF9F7] border border-gray-200/80 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-[#A67C52]">
                Alur Pendaftaran Mudah
              </span>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">
                4 Langkah Menjadi Mitra Resmi
              </h3>
              <p className="text-xs text-[#666666]">
                Proses verifikasi resmi cepat dan langsung didampingi oleh tim kantor cabang Garut &amp; Bandung.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-lg border border-[#A67C52]/20">
                  1
                </div>
                <h4 className="font-bold text-sm text-[#1A1A1A]">Pilih Program Kemitraan</h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Tentukan skema yang paling sesuai dengan kapasitas Anda (Kantor Cabang Resmi, Keagenan Travel, atau Marketer Syiar).
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-lg border border-[#A67C52]/20">
                  2
                </div>
                <h4 className="font-bold text-sm text-[#1A1A1A]">Isi Formulir &amp; Verifikasi</h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Lengkapi formulir pendaftaran di bawah. Data Anda otomatis tersimpan di database dan tim manajemen akan menghubungi via WhatsApp.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-lg border border-[#A67C52]/20">
                  3
                </div>
                <h4 className="font-bold text-sm text-[#1A1A1A]">Penandatanganan Akad</h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Konsolidasi tatap muka di Kantor Garut / Bandung atau sesi daring resmi, disusul penyerahan SK Kemitraan &amp; Sertifikat.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-lg border border-[#A67C52]/20">
                  4
                </div>
                <h4 className="font-bold text-sm text-[#1A1A1A]">Akses Marketing Kit &amp; Syiar</h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Dapatkan modul pelatihan, brosur fisik &amp; digital, serta pendampingan langsung closing jamaah dan reward berkah.
                </p>
              </div>
            </div>
          </div>

      {/* 3 Program Cards */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">
              Pilihan Skema Kemitraan
            </h3>
            <p className="text-xs text-[#666666]">
              Download rincian proposal PDF atau langsung daftar di skema yang Anda minati.
            </p>
          </div>

          <button
            onClick={handleDownloadFullKitPDF}
            className="px-4 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccessProgram === 'full_kit' ? 'Telah Terunduh!' : 'Download Semua Marketing Kit (PDF)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PARTNERSHIP_PROGRAMS.map((program) => (
            <div 
              key={program.id}
              id={`program-${program.id}`}
              className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-gray-200 hover:border-[#A67C52] transition-all space-y-6 flex flex-col justify-between shadow-md scroll-mt-24"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#F5F5F5] text-[#A67C52] text-xs font-bold uppercase tracking-wider border border-gray-200">
                    {program.title}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">{program.title}</h4>
                  <p className="text-xs text-[#666666] mt-1">{program.subtitle}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-gray-200">
                  <span className="text-[11px] text-gray-500 block">Sasaran Program:</span>
                  <span className="text-sm font-bold text-[#A67C52]">{program.target}</span>
                </div>

                <div className="space-y-2 text-xs text-[#444444]">
                  <span className="font-bold text-[#1A1A1A] block">Keuntungan &amp; Fasilitas:</span>
                  {program.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleDownloadProgramPDF(program.title)}
                  className="w-full py-2.5 rounded-xl bg-[#F5F5F5] hover:bg-gray-200 text-[#1A1A1A] text-xs font-bold flex items-center justify-center gap-2 border border-gray-200 transition-colors cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-[#A67C52]" />
                  <span>{downloadSuccessProgram === program.title ? 'Buku Panduan Terunduh' : 'Download Panduan (PDF)'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveType(program.id as any);
                    document.getElementById('form-kemitraan')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span>Daftar Skema Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulir Pendaftaran Mitra Online (Tersambung ke Realtime Database) */}
      <div id="form-kemitraan" className="p-8 sm:p-12 rounded-3xl bg-[#F5F5F5] border border-gray-200 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-[#A67C52]">
            Registrasi Online Real-Time
          </span>
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Formulir Pendaftaran Calon Mitra
          </h3>
          <p className="text-xs text-[#666666]">
            Data Anda akan langsung tersimpan di Database Cloud Staff Operasional Al-Ghanim &amp; Mandala 525 Garut.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 rounded-2xl bg-white border border-emerald-300 text-center space-y-4 max-w-md mx-auto shadow-md">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">Pendaftaran Berhasil Terkirim!</h4>
            <p className="text-xs text-gray-600">
              Terima kasih Bapak/Ibu <strong>{fullName}</strong>. Data Anda sudah tersimpan di database kami dan kami telah membuka sesi chat WhatsApp untuk konfirmasi berkas.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFullName('');
                setPhone('');
                setCity('');
                setNotes('');
              }}
              className="px-6 py-2 rounded-xl bg-[#A67C52] text-white text-xs font-bold uppercase tracking-wider"
            >
              Kirim Formulir Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white border border-gray-200">
              <button
                type="button"
                onClick={() => setActiveType('cabang')}
                className={`py-2.5 rounded-xl font-bold text-center transition-all cursor-pointer ${
                  activeType === 'cabang' ? 'bg-[#A67C52] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Kantor Cabang
              </button>
              <button
                type="button"
                onClick={() => setActiveType('agen')}
                className={`py-2.5 rounded-xl font-bold text-center transition-all cursor-pointer ${
                  activeType === 'agen' ? 'bg-[#A67C52] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Keagenan Travel
              </button>
              <button
                type="button"
                onClick={() => setActiveType('marketer')}
                className={`py-2.5 rounded-xl font-bold text-center transition-all cursor-pointer ${
                  activeType === 'marketer' ? 'bg-[#A67C52] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Marketer Syiar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Nama Lengkap / Instansi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ustadz Ahmad / Yayasan Al-Falah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Nomor WhatsApp Aktif *</label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Kota / Domisili Operasional *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Garut, Tasikmalaya, Bandung, Sumedang, dll."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
              />
            </div>

            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Latar Belakang / Rencana Syiar (Opsional)</label>
              <textarea
                rows={3}
                placeholder="Ceritakan rencana syiar, komunitas jamaah, atau potensi jamaah di daerah Anda..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#A67C52] hover:bg-[#8E653E] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan ke Cloud...' : 'Kirim Pendaftaran & Hubungkan ke WhatsApp'}</span>
            </button>
          </form>
        )}
      </div>
    </div>

      {/* LOKASI KANTOR RESMI UNTUK MITRA (RINGKAS & TIDAK OVERLY DETAILED) */}
      <div className="pt-10 border-t border-gray-200 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F5] border border-gray-200 text-[#A67C52] text-[11px] font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kantor Representatif Mitra</span>
          </div>
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Lokasi Kantor Resmi ALGHANIM
          </h3>
          <p className="text-xs sm:text-sm text-[#666666]">
            Kunjungi kantor representatif kami untuk silaturahmi &amp; konsultasi kemitraan langsung:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Garut */}
          <div className="p-5 rounded-2xl bg-[#FBFBFB] border border-gray-200 hover:border-[#A67C52]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#A67C52] text-white text-[10px] font-bold uppercase tracking-wider">
                  Cabang Garut
                </span>
                <span className="text-[11px] text-gray-500 font-medium">Kantor Operasional</span>
              </div>
              <h4 className="font-serif-luxury font-bold text-[#1A1A1A] text-base">
                PT. Al-Ghanim &amp; Mandala 525 Garut
              </h4>
              <p className="text-xs text-[#555555] leading-relaxed">
                Jl. Sudirman Copong, Garut Kota, Jawa Barat
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
              <a
                href={OFFICES_DATA.garut.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#A67C52] hover:text-[#8E653E] transition-colors"
              >
                <span>Buka Rute Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-gray-400">Garut Kota</span>
            </div>
          </div>

          {/* Card 2: Bandung */}
          <div className="p-5 rounded-2xl bg-[#FBFBFB] border border-gray-200 hover:border-[#A67C52]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                  Cabang Bandung
                </span>
                <span className="text-[11px] text-gray-500 font-medium">Jawa Barat</span>
              </div>
              <h4 className="font-serif-luxury font-bold text-[#1A1A1A] text-base">
                Metro Trade Center (MTC)
              </h4>
              <p className="text-xs text-[#555555] leading-relaxed">
                Jl. Soekarno Hatta No. 590, Sekejati, Buahbatu, Kota Bandung, Jawa Barat 40286
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
              <a
                href="https://maps.google.com/?q=Metro+Trade+Center+Jl.+Soekarno+Hatta+No.+590+Bandung"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#A67C52] hover:text-[#8E653E] transition-colors"
              >
                <span>Buka Rute Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-gray-400">Kota Bandung</span>
            </div>
          </div>

          {/* Card 3: Jakarta */}
          <div className="p-5 rounded-2xl bg-[#FBFBFB] border border-gray-200 hover:border-[#A67C52]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                  Kantor Pusat
                </span>
                <span className="text-[11px] text-gray-500 font-medium">DKI Jakarta</span>
              </div>
              <h4 className="font-serif-luxury font-bold text-[#1A1A1A] text-base">
                Menara Kadin Indonesia Lt. 12
              </h4>
              <p className="text-xs text-[#555555] leading-relaxed">
                Jl. H.R. Rasuna Said Blok X-5 Kav 2-3, Kuningan Timur, Jakarta Selatan 12950
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
              <a
                href="https://maps.google.com/?q=Menara+Kadin+Indonesia+Jl.+H.R.+Rasuna+Said+Jakarta+Selatan"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#A67C52] hover:text-[#8E653E] transition-colors"
              >
                <span>Buka Rute Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-gray-400">Jakarta Selatan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
