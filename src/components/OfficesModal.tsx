import { X, MapPin, Phone, Clock, UserCheck, ShieldCheck, Award, FileText } from 'lucide-react';
import { OFFICE_DETAILS, LEGAL_INFO } from '../data/packagesData';

interface OfficesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity?: 'garut' | 'bandung' | 'jakarta';
  initialCity?: 'garut' | 'bandung' | 'jakarta';
  onConsult?: (city: string) => void;
}

export const OfficesModal = ({ isOpen, onClose, selectedCity, initialCity, onConsult }: OfficesModalProps) => {
  const defaultCity = initialCity || selectedCity || 'jakarta';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-8 text-[#1A1A1A] max-h-[90vh] flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
          <div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#A67C52] text-white font-semibold uppercase tracking-wider">
              Kantor Layanan Resmi
            </span>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A] mt-1">
              Kantor Pusat &amp; Cabang ALGHANIM
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-[#666666] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* Jakarta Head Office */}
          <div className="p-5 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#A67C52]" />
                {OFFICE_DETAILS.jakarta.title}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#A67C52] text-white font-bold uppercase tracking-wider">
                Kantor Pusat
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#555555]">{OFFICE_DETAILS.jakarta.address}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#666666] pt-1">
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#A67C52]" /> {OFFICE_DETAILS.jakarta.phone}</p>
              <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#A67C52]" /> {OFFICE_DETAILS.jakarta.hours}</p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-gray-200">
              <span className="text-xs text-emerald-700 font-medium">Layanan: Konsultasi &amp; Pendaftaran</span>
              <a
                href={OFFICE_DETAILS.jakarta.waLink}
                target="_blank"
                rel="noreferrer"
                className="bg-[#A67C52] hover:bg-[#8E653E] text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase cursor-pointer transition-colors"
              >
                Chat WA Pusat
              </a>
            </div>
          </div>

          {/* Bandung Office */}
          <div className="p-5 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#A67C52]" />
                {OFFICE_DETAILS.bandung.title}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-200 text-[#1A1A1A] font-bold uppercase tracking-wider">
                Cabang Bandung
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#555555]">{OFFICE_DETAILS.bandung.address}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#666666] pt-1">
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#A67C52]" /> {OFFICE_DETAILS.bandung.phone}</p>
              <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#A67C52]" /> {OFFICE_DETAILS.bandung.hours}</p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-gray-200">
              <span className="text-xs text-emerald-700 font-medium">Layanan: Konsultasi &amp; Pendaftaran</span>
              <a
                href={OFFICE_DETAILS.bandung.waLink}
                target="_blank"
                rel="noreferrer"
                className="bg-[#A67C52] hover:bg-[#8E653E] text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase cursor-pointer transition-colors"
              >
                WA Sales Bandung
              </a>
            </div>
          </div>

          {/* Garut Office */}
          <div className="p-5 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#A67C52]" />
                {OFFICE_DETAILS.garut.title}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-200 text-[#1A1A1A] font-bold uppercase tracking-wider">
                Cabang Garut
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#555555]">{OFFICE_DETAILS.garut.address}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#666666] pt-1">
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#A67C52]" /> {OFFICE_DETAILS.garut.phone}</p>
              <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#A67C52]" /> {OFFICE_DETAILS.garut.hours}</p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200">
              <span className="text-xs text-emerald-700 font-medium">Layanan: Kantor Operasional Mandala 525</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://share.google/fsqwRYJHLHFaiESVm"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] border border-gray-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase cursor-pointer transition-colors"
                >
                  Buka Maps
                </a>
                <a
                  href={OFFICE_DETAILS.garut.waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#A67C52] hover:bg-[#8E653E] text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase cursor-pointer transition-colors"
                >
                  WA Sales Garut
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#F5F5F5] border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-[#555555] hover:text-[#1A1A1A] border border-gray-300 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
