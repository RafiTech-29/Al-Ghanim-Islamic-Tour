import { X, Award, ShieldCheck, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { LEGAL_INFO, OFFICIAL_WA_LINK, OFFICIAL_WA_NUMBER } from '../data/packagesData';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal = ({ isOpen, onClose }: LegalModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-8 text-[#1A1A1A] max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#A67C52] text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52]">
                Kemenag RI Terverifikasi
              </span>
              <h2 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                Legalitas &amp; Akreditasi Resmi ALGHANIM
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-[#666666] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm bg-white">
          
          {/* Certificate Card */}
          <div className="p-5 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <p className="text-[11px] text-[#666666]">Nama Badan Usaha:</p>
                <p className="font-bold text-[#1A1A1A] text-sm">{LEGAL_INFO.companyName}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#A67C52] text-white text-xs font-bold">
                {LEGAL_INFO.akreditasi}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <p className="text-[#666666]">Nomor Izin PPIU Kemenag:</p>
                <p className="font-bold text-[#1A1A1A] mt-0.5">{LEGAL_INFO.skKemenag}</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <p className="text-[#666666]">Keanggotaan Asosiasi:</p>
                <p className="font-bold text-[#1A1A1A] mt-0.5">{LEGAL_INFO.iathiMembership}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <p className="text-[#666666]">Integrasi Sistem Pengawasan SISKOPATUH:</p>
              <p className="font-bold text-[#1A1A1A] mt-0.5">{LEGAL_INFO.siskopatuhId}</p>
            </div>
          </div>

          {/* 5 Pasti Umroh Detail */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A67C52]" />
              Jaminan 5 Pasti Umroh Kemenag RI
            </h4>
            <div className="space-y-2 text-xs text-[#555555]">
              <div className="p-3 rounded-lg bg-[#F5F5F5] border border-gray-200">
                <p className="font-bold text-[#1A1A1A]">1. Pasti Travelnya Berizin</p>
                <p className="text-[#666666] mt-0.5">Memiliki izin operasional sah dari Kementerian Agama Republik Indonesia.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F5F5] border border-gray-200">
                <p className="font-bold text-[#1A1A1A]">2. Pasti Jadwal Keberangkatannya</p>
                <p className="text-[#666666] mt-0.5">Jadwal tanggal dan bulan keberangkatan terencana dengan kepastian seat.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F5F5] border border-gray-200">
                <p className="font-bold text-[#1A1A1A]">3. Pasti Terbangnya (Tiket PP)</p>
                <p className="text-[#666666] mt-0.5">Tiket pesawat Pulang-Pergi (PP) langsung atau transit terkonfirmasi sebelum manasik.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F5F5] border border-gray-200">
                <p className="font-bold text-[#1A1A1A]">4. Pasti Hotel &amp; Akomodasinya</p>
                <p className="text-[#666666] mt-0.5">Hotel berbintang di Makkah dan Madinah dengan jarak terukur dan terjamin.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F5F5] border border-gray-200">
                <p className="font-bold text-[#1A1A1A]">5. Pasti Visanya</p>
                <p className="text-[#666666] mt-0.5">Visa Umroh resmi terbit melalui muassasah resmi Kerajaan Arab Saudi.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F5F5F5] border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-[#666666]">WhatsApp Sales Admin: {OFFICIAL_WA_NUMBER}</span>
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
