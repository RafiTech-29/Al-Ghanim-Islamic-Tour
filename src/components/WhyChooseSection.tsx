import { 
  DollarSign, 
  HeartHandshake, 
  ShieldCheck, 
  GraduationCap, 
  Plane, 
  Coffee, 
  Building2, 
  Coins, 
  Wifi, 
  Accessibility,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { WHY_CHOOSE_US, OFFICIAL_WA_LINK, OFFICIAL_WA_NUMBER } from '../data/packagesData';

const ICONS = [
  DollarSign,
  HeartHandshake,
  ShieldCheck,
  GraduationCap,
  Plane,
  Coffee,
  Building2,
  Coins,
  Wifi,
  Accessibility
];

interface WhyChooseSectionProps {
  onOpenConsultation: () => void;
  onOpenLegal: () => void;
}

export const WhyChooseSection = ({ onOpenConsultation, onOpenLegal }: WhyChooseSectionProps) => {
  return (
    <section id="keunggulan-section" className="py-10 sm:py-16 md:py-18 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 bg-white relative w-full max-w-full overflow-x-hidden">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto space-y-2"
      >
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] bg-[#FAFAFA] px-3 py-1 rounded-full border border-[#EBEBEB] inline-block">
          Keunggulan Utama
        </span>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-[#2B2B2B] leading-tight">
          Mengapa Memilih ALGHANIM?
        </h2>
        <p className="font-sans-luxury text-[#6E6E6E] text-xs sm:text-sm leading-relaxed">
          10 komitmen pelayanan prima untuk perjalanan ibadah hemat, aman, tenang, dan mabrur.
        </p>
      </motion.div>

      {/* 10 Keunggulan Grid: Padat, Rapi & Elegan */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {WHY_CHOOSE_US.map((item, idx) => {
          const Icon = ICONS[idx] || ShieldCheck;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: idx * 0.03, ease: "easeOut" }}
              className="bg-[#FAFAFA] p-3 sm:p-4 rounded-xl border border-[#EBEBEB] hover:border-[#C5A059] transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between group hover:-translate-y-0.5 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#EBEBEB] flex items-center justify-center text-[#C5A059] group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-white transition-all shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-serif-luxury font-bold text-[#C5A059] bg-white/80 px-1.5 py-0.5 rounded border border-[#EBEBEB]/60">
                    {item.number}
                  </span>
                </div>
                <h3 className="font-serif-luxury text-xs sm:text-sm font-bold text-[#2B2B2B] mb-1 group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-[11.5px] text-[#6E6E6E] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legal & Accreditation Verification Trust Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1A1A1A] via-[#242424] to-[#1A1A1A] border border-[#A67C52]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden"
      >
        <div className="space-y-1 text-center md:text-left relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A67C52]/20 border border-[#A67C52]/40 text-[#DFC386] text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <ShieldCheck className="w-3 h-3 text-[#DFC386]" />
            <span>Verifikasi Legalitas Resmi</span>
          </div>
          <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white">
            Legalitas Terdaftar &amp; Terakreditasi "A" Kemenag RI
          </h3>
          <p className="text-xs text-[#D9D9D9] leading-relaxed">
            Izin resmi PPIU No. 1030 Tahun 2019 dan terintegrasi sistem SISKOPATUH Kemenag RI.
          </p>
        </div>
        <div className="flex items-center justify-center relative z-10 flex-shrink-0">
          <button
            onClick={onOpenLegal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#A67C52] hover:from-[#B38E46] hover:to-[#8E653E] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-[#C5A059]/30 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Cek Izin Kemenag &amp; Legalitas</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};
