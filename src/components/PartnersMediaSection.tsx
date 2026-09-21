import { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Award, 
  Users, 
  ExternalLink, 
  Newspaper, 
  Plane, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import { 
  MEDIA_COVERAGE_DATA, 
  BRAND_TAGLINES, 
  LEGAL_INFO 
} from '../data/packagesData';
import { OfficialPartnerLogo } from './OfficialPartnerLogo';

export interface OfficialPartner {
  id: string;
  name: string;
  subname: string;
  category: 'regulator' | 'association' | 'airline';
  categoryLabel: string;
  fallbackText: string;
  websiteUrl?: string;
}

export const OFFICIAL_9_PARTNERS: OfficialPartner[] = [
  // 1. Lembaga & Asosiasi (3)
  {
    id: 'kemenag',
    name: 'Kementerian Agama RI',
    subname: 'Regulator Izin PPIU No. U.444/2021',
    category: 'regulator',
    categoryLabel: 'Lembaga Regulator',
    fallbackText: 'KEMENAG RI',
    websiteUrl: 'https://kemenag.go.id'
  },
  {
    id: 'siskopatuh',
    name: 'Sistem SISKOPATUH',
    subname: 'Pengawasan Terpadu Umrah Kemenag',
    category: 'regulator',
    categoryLabel: 'Sistem Komputerisasi',
    fallbackText: 'SISKOPATUH',
    websiteUrl: 'https://siskopatuh.kemenag.go.id'
  },
  {
    id: 'sapuhi',
    name: 'SAPUHI',
    subname: 'Asosiasi Resmi PPIU/PIHK Indonesia',
    category: 'association',
    categoryLabel: 'Asosiasi PPIU/PIHK',
    fallbackText: 'SAPUHI',
    websiteUrl: 'https://sapuhi.id'
  },

  // 2. Maskapai Penerbangan (6)
  {
    id: 'saudia',
    name: 'Saudia Airlines',
    subname: 'Maskapai Nasional Arab Saudi',
    category: 'airline',
    categoryLabel: 'Maskapai Penerbangan',
    fallbackText: 'SAUDIA',
    websiteUrl: 'https://www.saudia.com'
  },
  {
    id: 'etihad',
    name: 'Etihad Airways',
    subname: 'Maskapai Bintang 5 Abu Dhabi UAE',
    category: 'airline',
    categoryLabel: 'Maskapai Penerbangan',
    fallbackText: 'ETIHAD',
    websiteUrl: 'https://www.etihad.com'
  },
  {
    id: 'qatar',
    name: 'Qatar Airways',
    subname: 'Skytrax World Best Airline',
    category: 'airline',
    categoryLabel: 'Maskapai Penerbangan',
    fallbackText: 'QATAR AIRWAYS',
    websiteUrl: 'https://www.qatarairways.com'
  },
  {
    id: 'turkish',
    name: 'Turkish Airlines',
    subname: 'Rute Favorit Umroh Plus Turki',
    category: 'airline',
    categoryLabel: 'Maskapai Penerbangan',
    fallbackText: 'TURKISH AIRLINES',
    websiteUrl: 'https://www.turkishairlines.com'
  },
  {
    id: 'oman',
    name: 'Oman Air',
    subname: 'Maskapai Nyaman Rute Muskat',
    category: 'airline',
    categoryLabel: 'Maskapai Penerbangan',
    fallbackText: 'OMAN AIR',
    websiteUrl: 'https://www.omanair.com'
  },
  {
    id: 'scoot',
    name: 'Scoot Airlines',
    subname: 'Singapore Airlines Group',
    category: 'airline',
    categoryLabel: 'Maskapai Penerbangan',
    fallbackText: 'SCOOT',
    websiteUrl: 'https://www.flyscoot.com'
  }
];

export const ALL_PARTNERS_LIST = OFFICIAL_9_PARTNERS.map(p => ({
  name: p.name,
  role: p.subname,
  code: p.id,
  category: p.category
}));

interface PartnersMediaSectionProps {
  onOpenLegal: () => void;
}

export const PartnersMediaSection = ({ onOpenLegal }: PartnersMediaSectionProps) => {
  return (
    <section id="mitra-section" className="py-8 sm:py-12 md:py-14 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 bg-white w-full max-w-full overflow-x-hidden">
      {/* =========================================================================
          SEJAJAR MARQUEE SLIDING LOGOS & TRUST BADGE (OPTIMIZED CLEAN WRAPPER)
          5 Bintang Emas + Ringkasan Legalitas Resmi + Logo Slider + Tombol Detail
          ========================================================================= */}
      <div className="space-y-6 text-center overflow-hidden relative">
        {/* 5 Golden Stars Header */}
        <div className="flex items-center justify-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-[#F59E0B] text-[#F59E0B] drop-shadow-xs" />
          ))}
        </div>

        {/* Ringkas Legalitas & Tombol Detail */}
        <div className="max-w-2xl mx-auto space-y-2 px-4">
          <p className="font-sans-luxury text-sm sm:text-base text-[#2B2B2B] font-semibold leading-relaxed">
            Izin Resmi PPIU No. 1030 Tahun 2019 (Akreditasi &quot;A&quot; Kemenag RI) &amp; Anggota Asosiasi SAPUHI
          </p>
          <div>
            <button
              onClick={onOpenLegal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A67C52] hover:text-[#8E653E] underline underline-offset-4 cursor-pointer transition-colors"
            >
              <span>Lihat Detail Izin PPIU &amp; Sertifikat Legalitas</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Horizontal Sejajar Logo Marquee Slider (Clean Float with Edge Fade) */}
        <div className="relative w-full pt-2 pb-2 overflow-hidden mask-fade-edges">
          <div className="animate-marquee-logos flex items-center gap-4 sm:gap-5">
            {/* First Set of Logos */}
            {OFFICIAL_9_PARTNERS.map((partner) => (
              <div
                key={`p1-${partner.id}`}
                onClick={onOpenLegal}
                className="w-44 sm:w-52 h-20 sm:h-24 flex-shrink-0 bg-white rounded-2xl border border-gray-100 hover:border-[#A67C52]/50 hover:shadow-md transition-all duration-300 flex items-center justify-center p-3.5 cursor-pointer group shadow-2xs"
              >
                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <OfficialPartnerLogo partnerId={partner.id} />
                </div>
              </div>
            ))}

            {/* Duplicate Second Set for Seamless Infinite Scrolling */}
            {OFFICIAL_9_PARTNERS.map((partner) => (
              <div
                key={`p2-${partner.id}`}
                onClick={onOpenLegal}
                className="w-44 sm:w-52 h-20 sm:h-24 flex-shrink-0 bg-white rounded-2xl border border-gray-100 hover:border-[#A67C52]/50 hover:shadow-md transition-all duration-300 flex items-center justify-center p-3.5 cursor-pointer group shadow-2xs"
              >
                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <OfficialPartnerLogo partnerId={partner.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          LIPUTAN MEDIA TERPERCAYA (OPTIMIZED: FLATTENED CONTAINER)
          ========================================================================= */}
      <div className="pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#A67C52] border border-[#A67C52]/20">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1A1A1A]">
                Liputan Media
              </h4>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Publikasi &amp; Partner Informasi Resmi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Info Garut (Matching Gambar 3) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-gray-150 hover:border-[#CBB39C] hover:shadow-md transition-all duration-200 flex items-center gap-4">
            {/* Info Garut Profile Avatar (Image 3) */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FF0055] via-[#FF5500] to-[#FFCC00] flex-shrink-0 shadow-sm">
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-2 relative overflow-hidden border border-black/10">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                  {/* Top-Right Yellow Accent Triangles */}
                  <polygon points="58,16 78,28 58,38" fill="#FDB813" />
                  <polygon points="70,26 90,38 70,48" fill="#FDB813" />
                  <polygon points="76,36 96,48 76,58" fill="#FDB813" />

                  {/* INFO Text - Bold Sharp Navy Blue */}
                  <text x="10" y="44" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="26" fill="#0C326F" letterSpacing="0">
                    INFO
                  </text>
                  
                  {/* GARUT Text - Bold Sharp Navy Blue */}
                  <text x="10" y="70" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="25" fill="#0C326F" letterSpacing="0">
                    GARUT
                  </text>

                  {/* Sundanese Script & .ID */}
                  <text x="12" y="88" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="11" fill="#0C326F" letterSpacing="0.5">
                    ᮌᮛᮥᮒ᮪.ID
                  </text>
                </svg>
              </div>
            </div>

            <div className="space-y-0.5 text-left">
              <div className="flex items-center gap-1.5">
                <h5 className="font-bold text-base text-[#1A1A1A]">Info Garut</h5>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                  @infogarut
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Media Informasi &amp; Portal Berita Terbesar Garut
              </p>
              <span className="text-[11px] text-[#9E836A] font-semibold flex items-center gap-1 pt-0.5">
                <span>Partner Liputan Jamaah</span>
              </span>
            </div>
          </div>

          {/* Card 2: Jajanan Garut (Matching Gambar 4) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-gray-150 hover:border-[#CBB39C] hover:shadow-md transition-all duration-200 flex items-center gap-4">
            {/* Jajanan Garut Profile Avatar (Image 4) */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-[#1A1A1A] flex-shrink-0 shadow-sm">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#D91B24] via-[#B80F17] to-[#8C0810] flex flex-col items-center justify-center p-1.5 relative overflow-hidden text-white border border-red-400/30">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                  {/* Sparkling Diamond atop Jajanan */}
                  <g transform="translate(38, 12)">
                    <polygon points="12,0 18,7 12,14 6,7" fill="#FFFFFF" />
                    <line x1="12" y1="-2" x2="12" y2="-5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="4" y1="1" x2="1" y2="-2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="20" y1="1" x2="23" y2="-2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                  </g>

                  {/* "Jajanan" in stylish cursive white text */}
                  <text x="50" y="42" fontFamily="Brush Script MT, cursive, sans-serif" fontWeight="bold" fontSize="22" fill="#FFFFFF" textAnchor="middle">
                    Jajanan
                  </text>

                  {/* Crossed Fork & Spoon Icon */}
                  <g transform="translate(42, 45) scale(0.65)" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none">
                    <line x1="4" y1="4" x2="20" y2="20" />
                    <line x1="20" y1="4" x2="4" y2="20" />
                    <path d="M 3 2 L 6 8 L 8 2" fill="none" />
                    <circle cx="21" cy="4" r="2.5" fill="#FFFFFF" />
                  </g>

                  {/* "Garut" in stylish cursive white text */}
                  <text x="50" y="76" fontFamily="Brush Script MT, cursive, sans-serif" fontWeight="bold" fontSize="26" fill="#FFFFFF" textAnchor="middle">
                    Garut
                  </text>
                </svg>
              </div>
            </div>

            <div className="space-y-0.5 text-left">
              <div className="flex items-center gap-1.5">
                <h5 className="font-bold text-base text-[#1A1A1A]">Jajanan Garut</h5>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                  @jajanangarut
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Partner Komunitas Kuliner &amp; Media Kreatif
              </p>
              <span className="text-[11px] text-[#9E836A] font-semibold flex items-center gap-1 pt-0.5">
                <span>Partner Publikasi Lokal</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
