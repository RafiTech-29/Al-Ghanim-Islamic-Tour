import { 
  X, 
  Calendar, 
  Clock, 
  Plane, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Users, 
  MessageCircle, 
  ShieldCheck, 
  Ticket,
  FileCheck,
  Check,
  Luggage,
  Award
} from 'lucide-react';
import { PackageScheduleItem } from '../types';
import { OFFICIAL_WA_NUMBER, OFFICIAL_WA_PHONE, getCleanWhatsAppPhone } from '../data/packagesData';

interface ScheduleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: PackageScheduleItem | null;
  onBookNow?: (packageName: string) => void;
  onRegisterDirectly?: (pkg: PackageScheduleItem) => void;
}

export const ScheduleDetailModal = ({
  isOpen,
  onClose,
  pkg
}: ScheduleDetailModalProps) => {
  if (!isOpen || !pkg) return null;

  // Format tailored WhatsApp message
  const waText = encodeURIComponent(
    `Assalamu'alaikum Admin AL-GHANIM, saya ingin konsultasi dan pendaftaran untuk:\n\n` +
    `*Paket: ${pkg.title}*\n` +
    `*Durasi: ${pkg.duration}*\n` +
    `*Keberangkatan: ${pkg.departureDate}*\n` +
    `*Biaya: ${pkg.price}*\n` +
    `*Hotel Makkah: ${pkg.hotelMakkah}*\n` +
    `*Hotel Madinah: ${pkg.hotelMadinah}*\n\n` +
    `Mohon informasi ketersediaan seat dan panduan pendaftarannya. Terima kasih.`
  );
  // Valid international WhatsApp number format without dashes or leading zeros
  const cleanPhone = OFFICIAL_WA_PHONE || '628131670218';
  const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

  // Helper to determine specific badges and highlights
  const isVip = pkg.id.includes('custom') || pkg.category === 'umroh-custom';
  const isFuroda = pkg.id.includes('furoda') || pkg.title.toLowerCase().includes('furoda');
  const isHajiKhusus = pkg.id.includes('pihk') || pkg.title.toLowerCase().includes('khusus');
  const isJumatain = pkg.title.toLowerCase().includes('jumatain') || pkg.title.toLowerCase().includes("jum'atain");
  const isVisaLa = pkg.id.includes('visa-la') || pkg.category === 'visa-tiket-la';
  const isWisataHalal = pkg.id.includes('wisata-halal') || pkg.title.toLowerCase().includes('wisata halal');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 text-[#1A1A1A] max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#FAF9F7]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#A67C52] text-white font-bold uppercase tracking-wider">
                Rincian Lengkap &amp; Syar'i
              </span>
              {pkg.badge && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#A67C52]/10 text-[#A67C52] border border-[#A67C52]/30 font-bold">
                  {typeof pkg.badge === 'string' ? pkg.badge : pkg.badge.text}
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                <Ticket className="w-3 h-3 text-emerald-600" />
                Tiket Confirm PP
              </span>
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1.5 leading-snug">
              {pkg.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Tutup Rincian"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Informasi Lengkap Tanpa Form Pengisian Apapun */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm bg-white">
          
          {/* Key Specs Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F7] p-4 rounded-2xl border border-gray-200">
            <div>
              <p className="text-gray-500 text-[11px] uppercase font-semibold">Keberangkatan</p>
              <p className="font-bold text-[#1A1A1A] text-xs sm:text-sm mt-0.5">{pkg.departureDate}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[11px] uppercase font-semibold">Durasi Program</p>
              <p className="font-bold text-[#1A1A1A] text-xs sm:text-sm mt-0.5">{pkg.duration}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[11px] uppercase font-semibold">Legalitas PPIU &amp; PIHK</p>
              <p className="font-bold text-emerald-700 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                Resmi Kemenag RI
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-[11px] uppercase font-semibold">Biaya Paket</p>
              <p className="font-bold text-[#A67C52] text-xs sm:text-sm mt-0.5">{pkg.price}</p>
            </div>
          </div>

          {/* Penerbangan & Status Tiket */}
          <div className="p-4 rounded-xl bg-[#FAF9F7] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#A67C52] shadow-sm flex-shrink-0">
                <Plane className="w-5 h-5 text-[#A67C52]" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 font-semibold block">Maskapai &amp; Rute Penerbangan:</span>
                <span className="font-bold text-[#1A1A1A] text-xs sm:text-sm">{pkg.airline}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-xs border border-emerald-300">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                Tiket Confirm PP
              </span>
            </div>
          </div>

          {/* Hotels Detail */}
          <div className="p-4 rounded-xl bg-[#FAF9F7] border border-gray-200 space-y-3">
            <h3 className="font-serif-luxury text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#A67C52]" />
              Akomodasi Hotel &amp; Posisi Dekat Masjid
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold text-[11px] uppercase">Makkah Al-Mukarramah:</span>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                    Bintang 5
                  </span>
                </div>
                <p className="font-bold text-[#1A1A1A] text-xs sm:text-sm">
                  {isVip || isFuroda
                    ? 'Raffles Makkah Palace / Fairmont Clock Tower Suite'
                    : pkg.hotelMakkah}
                </p>
                <p className="text-[#A67C52] text-[11px] font-medium flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {isVip ? '0 Meter (Akses Lift Langsung ke Pelataran Ka\'bah)' : (pkg.hotelDistanceMakkah || 'Depan Pelataran Masjidil Haram')}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold text-[11px] uppercase">Madinah Al-Munawwarah:</span>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                    Bintang 5
                  </span>
                </div>
                <p className="font-bold text-[#1A1A1A] text-xs sm:text-sm">
                  {isVip || isFuroda
                    ? 'The Oberoi Madinah / Dar Al Taqwa (Depan Gerbang Wanita & Pria)'
                    : pkg.hotelMadinah}
                </p>
                <p className="text-[#A67C52] text-[11px] font-medium flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {isVip || isFuroda ? 'Depan Gerbang Wanita & Pria (0 - 50 Meter ke Pintu Nabawi)' : '50 - 150 meter ke pelataran Nabawi'}
                </p>
              </div>
            </div>
          </div>

          {/* Fasilitas & Keunggulan Program */}
          <div className="space-y-2">
            <h3 className="font-serif-luxury text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A67C52]" />
              Fasilitas &amp; Keunggulan Layanan Al-Ghanim
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pkg.programHighlights && pkg.programHighlights.length > 0 ? (
                pkg.programHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-[#FAF9F7] p-2.5 rounded-xl border border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C52] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-800">{hl}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2 bg-[#FAF9F7] p-2.5 rounded-xl border border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C52] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-800">Tiket Pesawat Confirm PP &amp; Visa Resmi Terbit</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#FAF9F7] p-2.5 rounded-xl border border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C52] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-800">Bimbingan Ibadah &amp; Muthawwif Berpengalaman Sesuai Sunnah</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#FAF9F7] p-2.5 rounded-xl border border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C52] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-800">Koper &amp; Perlengkapan Ibadah Lengkap Eksklusif</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#FAF9F7] p-2.5 rounded-xl border border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C52] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-800">Handling Bandara Soekarno-Hatta &amp; Airport Saudi</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tata Cara & Alur Pendaftaran (Simulasi Praktis - Tanpa Mengisi Form Web) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A67C52]" />
                Tata Cara Pendaftaran Praktis (Mudah &amp; Langsung via WhatsApp)
              </h3>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                Tanpa Ribet
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Jamaah tidak perlu repot mengisi formulir online di website. Pendaftaran dipandu langsung oleh Konsultan Haji &amp; Umroh resmi Al-Ghanim:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#A67C52] text-white font-bold text-[11px] flex items-center justify-center">1</span>
                <p className="font-bold text-[#1A1A1A]">Klik WhatsApp</p>
                <p className="text-gray-500 text-[11px]">Hubungi Admin untuk cek sisa kuota dan jadwal.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#A67C52] text-white font-bold text-[11px] flex items-center justify-center">2</span>
                <p className="font-bold text-[#1A1A1A]">Kirim Foto Paspor</p>
                <p className="text-gray-500 text-[11px]">Kirimkan foto paspor / KTP jamaah via chat WhatsApp.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#A67C52] text-white font-bold text-[11px] flex items-center justify-center">3</span>
                <p className="font-bold text-[#1A1A1A]">DP &amp; Booking Seat</p>
                <p className="text-gray-500 text-[11px]">Pembayaran via Rekening Resmi PT Al-Ghanim Amanah Prima.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#A67C52] text-white font-bold text-[11px] flex items-center justify-center">4</span>
                <p className="font-bold text-[#1A1A1A]">Manasik &amp; Koper</p>
                <p className="text-gray-500 text-[11px]">Terima koper perlengkapan dan jadwal manasik berkala.</p>
              </div>
            </div>
          </div>

          {/* Syarat Pendaftaran */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
            <h4 className="font-bold text-gray-700 flex items-center gap-1.5 text-xs">
              <FileCheck className="w-3.5 h-3.5 text-[#A67C52]" />
              Persyaratan Dokumen Jamaah:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gray-600">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Paspor aktif min. 7 bulan (nama min. 2 suku kata)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Foto KTP &amp; Kartu Keluarga (dikirim via WA)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Buku / Kartu Vaksin Meningitis (ICV)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer - Langsung ke WhatsApp Tanpa Form Pengisian Apapun */}
        <div className="px-5 sm:px-6 py-4 bg-[#FAF9F7] border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto text-left">
            <span className="text-[11px] text-gray-500 block uppercase font-bold tracking-wider">Biaya Paket All-in:</span>
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#A67C52] block">{pkg.price}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-5 py-3 rounded-xl text-xs font-bold uppercase text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer shadow-2xs"
            >
              Tutup Rincian
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#20ba59] text-white px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white flex-shrink-0" />
              <span>Konsultasi &amp; Booking via WA</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
