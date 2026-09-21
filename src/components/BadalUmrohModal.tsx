import { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  Video, 
  Droplet, 
  CheckCircle2, 
  MessageCircle,
  Calendar,
  Check,
  Phone,
  FileText,
  ShieldCheck,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { OFFICIAL_WA_NUMBER, DETAILED_SCHEDULES } from '../data/packagesData';
import { PackageScheduleItem } from '../types';
import { subscribeToPackages } from '../lib/firestoreService';

interface BadalUmrohModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData?: PackageScheduleItem | null;
}

export const BadalUmrohModal = ({ isOpen, onClose, packageData }: BadalUmrohModalProps) => {
  const [livePackage, setLivePackage] = useState<PackageScheduleItem | null>(() => {
    if (packageData) return packageData;
    return DETAILED_SCHEDULES.find(p => p.category === 'badal-umroh' || p.id.includes('badal')) || null;
  });

  // Keep livePackage synchronized with Firestore real-time updates
  useEffect(() => {
    if (packageData) {
      setLivePackage(packageData);
    }
    const unsubscribe = subscribeToPackages((items) => {
      const found = items.find(p => p.category === 'badal-umroh' || p.id.includes('badal') || p.title.toLowerCase().includes('badal'));
      if (found) {
        setLivePackage(found);
      }
    });
    return () => unsubscribe();
  }, [packageData]);

  if (!isOpen) return null;

  const currentPkg = livePackage || packageData;
  const priceDisplay = currentPkg?.price || 'Rp 2.500.000 / Jiwa';
  const pkgTitle = currentPkg?.title || 'Program Badal Umroh Amanah';

  // Dynamic Facilities & Highlights directly from Admin CMS
  const dynamicHighlights: string[] = (currentPkg?.programHighlights && currentPkg.programHighlights.length > 0)
    ? currentPkg.programHighlights
    : (currentPkg?.features && currentPkg.features.length > 0)
      ? currentPkg.features.map(f => typeof f === 'string' ? f : (f as any).text || '')
      : [
          '1 Jiwa 1 Pembadal: Satu Muthawwif mukim berpengalaman hanya membadalkan satu nama jiwa.',
          'Dokumentasi Video Lengkap: Video rekaman niat ihram, thawaf, sa\'i, dan tahallul.',
          'Sertifikat Berbingkai: Piagam Badal Umroh resmi berbingkai kaca dikirim ke alamat rumah.',
          'Air Zam-zam 5 Liter: Air zam-zam murni berbarcode resmi & souvenir untuk keluarga.'
        ];

  const waUrl = `https://wa.me/628131670218?text=${encodeURIComponent(
    `Assalamu'alaikum Admin AL-GHANIM, saya ingin konsultasi dan mendaftar ${pkgTitle} (${priceDisplay}). Mohon panduannya.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-6 text-[#1A1A1A] max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#FAF9F7]">
          <div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#A67C52] text-white font-bold uppercase tracking-wider">
              Informasi Resmi &amp; Syar'i
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1">
              {pkgTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Informasi Lengkap Tanpa Form Pengisian */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm bg-white">
          
          {/* Ringkasan Penjelasan Biaya & Fasilitas */}
          <div className="p-5 rounded-2xl bg-[#FAF9F7] border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
              <div>
                <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">Biaya Program Badal:</span>
                <span className="font-serif-luxury text-2xl font-bold text-[#A67C52]">
                  {priceDisplay}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Sesuai Kaidah Sunnah
              </span>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A67C52]" />
                Keunggulan &amp; Fasilitas Utama (Resmi Al-Ghanim):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700">
                {dynamicHighlights.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-gray-800">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tata Cara Pendaftaran Badal Umroh (Jelas, Praktis, Sederhana) */}
          <div className="space-y-3">
            <h3 className="font-serif-luxury text-base font-bold text-[#1A1A1A]">
              Tata Cara &amp; Alur Pendaftaran Badal Umroh:
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-gray-200">
                <div className="w-7 h-7 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  1
                </div>
                <div className="text-xs text-gray-700">
                  <p className="font-bold text-[#1A1A1A]">Hubungi Admin via WhatsApp</p>
                  <p className="text-gray-500">Klik tombol di bawah untuk langsung terhubung dengan admin bimbingan Badal Umroh resmi AL-GHANIM.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-gray-200">
                <div className="w-7 h-7 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  2
                </div>
                <div className="text-xs text-gray-700">
                  <p className="font-bold text-[#1A1A1A]">Kirim Data Jiwa yang Dibadalkan</p>
                  <p className="text-gray-500">Cukup sampaikan nama lengkap almarhum/almarhumah (atau orang tua sakit uzur) beserta nama ayah kandung (Bin/Binti) dan alamat pengiriman sertifikat.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-gray-200">
                <div className="w-7 h-7 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  3
                </div>
                <div className="text-xs text-gray-700">
                  <p className="font-bold text-[#1A1A1A]">Pembayaran Biaya Badal Amanah</p>
                  <p className="text-gray-500">Transfer biaya {priceDisplay} ke rekening resmi PT. Al-Ghanimah Berkah Bersama, disusul penerbitan Surat Bukti Akad Badal.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-gray-200">
                <div className="w-7 h-7 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  4
                </div>
                <div className="text-xs text-gray-700">
                  <p className="font-bold text-[#1A1A1A]">Pelaksanaan di Tanah Suci &amp; Pengiriman Bukti</p>
                  <p className="text-gray-500">Muthawwif melaksanakan manasik badal di Makkah. Video dokumentasi dikirimkan melalui WhatsApp, dan sertifikat berbingkai serta zam-zam dikirimkan ke alamat Anda.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Call to Action Button */}
          <div className="pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>Konsultasi &amp; Pendaftaran Badal via WhatsApp</span>
            </a>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Langsung ditangani oleh staf bimbingan ibadah AL-GHANIM (Mandala 525 Garut).
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF9F7] border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-white transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
