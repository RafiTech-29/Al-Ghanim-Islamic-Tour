import React from 'react';
import { 
  MapPin, 
  MessageCircle, 
  Phone, 
  Clock, 
  Building2, 
  CheckCircle2,
  Compass,
  FileCheck
} from 'lucide-react';
import { 
  OFFICE_DETAILS, 
  OFFICIAL_WA_LINK, 
  MANASIK_GUIDELINES
} from '../data/packagesData';

interface ManasikAndOfficesSectionProps {
  onOpenConsultation?: (topic?: string) => void;
  onOpenOfficesModal?: (city: 'garut' | 'bandung') => void;
}

export const ManasikAndOfficesSection: React.FC<ManasikAndOfficesSectionProps> = ({
  onOpenConsultation,
  onOpenOfficesModal
}) => {
  return (
    <section id="manasik-section" className="py-10 sm:py-16 md:py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12 bg-white text-[#1A1A1A] scroll-mt-24 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#A67C52] bg-[#F5F5F5] px-3.5 py-1 rounded-full border border-gray-200 inline-block shadow-xs">
          Kantor Layanan &amp; Bimbingan Ibadah
        </span>
        <h2 className="font-serif-luxury text-xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight">
          Titik Kantor Resmi &amp; Bimbingan Ibadah
        </h2>
        <p className="font-sans-luxury text-[#555555] text-xs sm:text-sm leading-relaxed px-2">
          Layanan tatap muka, verifikasi dokumen, dan manasik di Garut, Bandung, &amp; Jakarta.
        </p>
      </div>

      {/* Grid Kantor Layanan: Lebih Ringkas, Proporsional & Ramping (Gambar 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Kantor Cabang Garut (Mandala Umroh) - KANTOR UTAMA (lg:col-span-6) */}
        <div className="lg:col-span-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#FAF8F5] via-white to-[#FDFCFB] border border-[#A67C52]/70 hover:border-[#A67C52] transition-all space-y-3.5 sm:space-y-4 flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#A67C52] text-white shadow-2xs">
                  Kantor Utama
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#A67C52] font-semibold bg-[#A67C52]/10 px-2 py-0.5 rounded-full border border-[#A67C52]/20">
                  Priangan Timur (Garut)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Buka Konsultasi</span>
              </div>
            </div>

            <div>
              <h3 className="font-serif-luxury text-lg sm:text-2xl font-bold text-[#1A1A1A] leading-snug">
                {OFFICE_DETAILS.garut.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mt-0.5">
                Jl. Sudirman Copong, Garut Kota
              </p>
            </div>

            <div className="bg-[#FAF8F5] sm:bg-transparent rounded-xl p-3 sm:p-0 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 sm:pt-3 sm:border-t sm:border-gray-100 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kontak &amp; Telepon</span>
                <p className="flex items-center gap-1.5 font-bold text-[#1A1A1A] text-xs">
                  <Phone className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                  <span className="truncate">(0262) 4890731 / 0813-1670-218</span>
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Jam Operasional</span>
                <p className="flex items-center gap-1.5 text-gray-700 text-xs">
                  <Clock className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                  <span>Senin – Sabtu: 09.00 – 17.00 WIB</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 relative z-10">
            <a
              href="https://share.google/fsqwRYJHLHFaiESVm"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-2.5 px-2 rounded-xl bg-white hover:bg-gray-50 text-[#1A1A1A] border border-gray-200 text-xs font-bold uppercase transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
              <span className="truncate">Petunjuk Maps</span>
            </a>
            <a
              href={OFFICE_DETAILS.garut.waLink}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-2.5 px-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white flex-shrink-0" />
              <span className="truncate">Chat CS Garut</span>
            </a>
          </div>
        </div>

        {/* Pengenalan Jaringan Kantor Cabang Bandung & Kantor Pusat Jakarta (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-3 sm:gap-3.5">
          {/* Cabang Bandung */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#A67C52] transition-all space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                Kantor Cabang Bandung
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Jawa Barat</span>
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#1A1A1A]">
                {OFFICE_DETAILS.bandung.title}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Jl. Soekarno Hatta No. 590, Buahbatu, Bandung
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
              <span className="text-[11px] text-gray-500 font-mono">WA: 0813-1670-218</span>
              <a
                href={OFFICE_DETAILS.bandung.waLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#A67C52] hover:underline inline-flex items-center gap-1"
              >
                <span>Chat Cabang</span>
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Kantor Pusat Jakarta */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#A67C52] transition-all space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                Kantor Pusat Jakarta
              </span>
              <span className="text-[10px] text-gray-400 font-medium">PPIU No. 1030/2019</span>
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#1A1A1A]">
                {OFFICE_DETAILS.jakarta.title}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Gedung Menara Kadin Lt. 12, Kuningan, Jakarta Selatan
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
              <span className="text-[11px] text-gray-500">Kuningan Rasuna Said</span>
              <a
                href={OFFICE_DETAILS.jakarta.waLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#A67C52] hover:underline inline-flex items-center gap-1"
              >
                <span>Chat Pusat</span>
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Bimbingan Manasik Ibadah (Transparan & Resmi - Refined Soft Wrapper) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#A67C52]/20 space-y-5 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#A67C52]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A67C52] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1A1A1A]">
                {MANASIK_GUIDELINES.title}
              </h3>
              <p className="text-xs text-gray-600">
                Pemantapan Rukun &amp; Wajib Ibadah Sesuai Sunnah Rasulullah SAW
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white text-[#A67C52] border border-[#A67C52]/25 shadow-2xs">
            Fasilitas Termasuk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700 pt-1">
          <div className="p-4 rounded-2xl bg-white border border-gray-150 hover:border-[#A67C52]/30 hover:shadow-xs transition-all space-y-1.5">
            <strong className="text-[#A67C52] block text-xs">Simulasi Miniatur Ka'bah &amp; Sa'i</strong>
            <p className="text-gray-600 leading-relaxed">Praktik thawaf, sa'i, dan pemakaian ihram sebelum berangkat agar ibadah lancar di Tanah Suci.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-150 hover:border-[#A67C52]/30 hover:shadow-xs transition-all space-y-1.5">
            <strong className="text-[#A67C52] block text-xs">Pembagian Perlengkapan</strong>
            <p className="text-gray-600 leading-relaxed">Seragam batik resmi, koper fiber 24-inch, tas paspor, kain ihram / mukena, dan buku doa saku.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-150 hover:border-[#A67C52]/30 hover:shadow-xs transition-all space-y-1.5">
            <strong className="text-[#A67C52] block text-xs">Pemberitahuan Jadwal Resmi</strong>
            <p className="text-gray-600 leading-relaxed">{MANASIK_GUIDELINES.note}</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 italic">
            *Untuk jamaah dari luar kota Priangan Timur, tersedia opsi bimbingan manasik daring / materi video panduan.
          </p>
          <a
            href={`${OFFICIAL_WA_LINK}?text=${encodeURIComponent('Halo Admin ALGHANIM, saya ingin tanya informasi bimbingan manasik ibadah umroh/haji.')}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm whitespace-nowrap cursor-pointer"
          >
            Tanya Info Manasik via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
