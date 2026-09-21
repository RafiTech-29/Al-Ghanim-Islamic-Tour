import React from 'react';

interface OfficialPartnerLogoProps {
  partnerId: string;
  className?: string;
}

export const OfficialPartnerLogo: React.FC<OfficialPartnerLogoProps> = ({ partnerId, className = 'h-14 w-auto' }) => {
  switch (partnerId) {
    case 'kemenag':
      return (
        <div className={`flex items-center justify-center gap-2.5 ${className}`}>
          {/* Official Kemenag Green-Gold Pentagon Badge (Image 1) */}
          <svg viewBox="0 0 100 115" className="h-12 w-auto flex-shrink-0 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,4 95,36 78,110 22,110 5,36" fill="#006837" stroke="#F5C400" strokeWidth="5" strokeLinejoin="round" />
            <polygon points="50,9 89,37 74,104 26,104 11,37" fill="#0A773F" stroke="#004D25" strokeWidth="1.5" />
            {/* Top Star */}
            <path d="M50,16 L52.5,23 L60,23 L54,27.5 L56.5,34.5 L50,30 L43.5,34.5 L46,27.5 L40,23 L47.5,23 Z" fill="#F5C400" />
            {/* White Cotton Stalks Left */}
            <circle cx="28" cy="48" r="3" fill="#FFFFFF" />
            <circle cx="24" cy="56" r="3.2" fill="#FFFFFF" />
            <circle cx="26" cy="65" r="3.2" fill="#FFFFFF" />
            <circle cx="31" cy="73" r="3" fill="#FFFFFF" />
            <path d="M28,45 C21,60 26,76 36,80" stroke="#004D25" strokeWidth="1.5" fill="none" />
            {/* Golden Rice Ears Right */}
            <path d="M72,45 C79,60 74,76 64,80" stroke="#F5C400" strokeWidth="2.5" fill="none" />
            <ellipse cx="72" cy="48" rx="2.5" ry="4" fill="#F5C400" transform="rotate(25 72 48)" />
            <ellipse cx="76" cy="57" rx="2.5" ry="4.5" fill="#F5C400" transform="rotate(15 76 57)" />
            <ellipse cx="74" cy="66" rx="2.5" ry="4.5" fill="#F5C400" transform="rotate(-10 74 66)" />
            <ellipse cx="68" cy="74" rx="2.5" ry="4" fill="#F5C400" transform="rotate(-30 68 74)" />
            {/* Center Golden Quran on Rehal */}
            <path d="M36,50 L50,44 L64,50 L64,65 L50,59 L36,65 Z" fill="#F5C400" />
            <path d="M38,53 L49,48 L49,61 L38,63 Z" fill="#FFF9D6" />
            <path d="M51,48 L62,53 L62,63 L51,61 Z" fill="#FFF9D6" />
            <line x1="41" y1="54" x2="47" y2="52" stroke="#B48200" strokeWidth="1" />
            <line x1="41" y1="57" x2="47" y2="55" stroke="#B48200" strokeWidth="1" />
            <line x1="53" y1="52" x2="59" y2="54" stroke="#B48200" strokeWidth="1" />
            <line x1="53" y1="55" x2="59" y2="57" stroke="#B48200" strokeWidth="1" />
            {/* Black Rehal Base */}
            <path d="M38,66 L62,77 M62,66 L38,77" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
            {/* White Ribbon Banner IKHLAS BERAMAL */}
            <path d="M22,86 L78,86 L72,97 L28,97 Z" fill="#FFFFFF" stroke="#004D25" strokeWidth="1" />
            <text x="50" y="94.5" fill="#004D25" fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">IKHLAS BERAMAL</text>
          </svg>
          <div className="text-left leading-tight">
            <span className="block text-[11px] font-black uppercase tracking-wider text-[#006837]">KEMENTERIAN AGAMA</span>
            <span className="block text-[8.5px] font-bold text-gray-700 tracking-wider">REPUBLIK INDONESIA</span>
            <span className="block text-[7.5px] font-semibold text-[#A67C52]">Izin PPIU No. U.444/2021</span>
          </div>
        </div>
      );

    case 'siskopatuh':
      return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
          {/* Siskopatuh Kaaba with Checkmark (Image 2) */}
          <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Kaaba Hexagon Shape */}
              <polygon points="50,5 92,28 92,72 50,95 8,72 8,28" fill="#064E3B" />
              {/* Top Gold Kiswah Band */}
              <polygon points="50,15 84,33 84,41 50,23 16,41 16,33" fill="#EAB308" />
              {/* White Checkmark slashing through */}
              <path d="M22,54 L44,76 L88,26" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-left leading-none">
            <div className="flex items-baseline">
              <span className="text-base font-black tracking-tight text-[#064E3B]">SISKO</span>
              <span className="text-base font-black tracking-tight text-[#064E3B] ml-0.5">PATUH</span>
            </div>
            <span className="block text-[7.5px] font-bold text-gray-500 uppercase tracking-wider mt-1">Kemenag Pengawasan Terpadu</span>
          </div>
        </div>
      );

    case 'sapuhi':
      return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
          {/* SAPUHI Kaaba & Golden Laurel Wreath (Image 3) */}
          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Laurel Wreath */}
              <circle cx="50" cy="50" r="42" stroke="#EAB308" strokeWidth="4" strokeDasharray="6 4" />
              <path d="M14,65 C10,45 22,20 48,12" stroke="#EAB308" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M86,65 C90,45 78,20 52,12" stroke="#EAB308" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Center Black Kaaba */}
              <polygon points="50,22 74,34 74,62 50,74 26,62 26,34" fill="#18181B" />
              {/* Gold Top Trim */}
              <polygon points="50,26 68,35 68,40 50,31 32,40 32,35" fill="#EAB308" />
              <line x1="50" y1="31" x2="50" y2="74" stroke="#27272A" strokeWidth="2" />
            </svg>
          </div>
          <div className="text-left leading-none">
            <span className="text-base font-black tracking-widest text-[#18181B] block">SAPUHI</span>
            <span className="block text-[7.5px] font-semibold text-gray-600 uppercase tracking-tight mt-1 max-w-[125px]">
              Syarikat Penyelenggara Umrah Haji Indonesia
            </span>
          </div>
        </div>
      );

    case 'saudia':
      return (
        <div className={`flex items-center justify-center gap-2.5 ${className}`}>
          {/* Saudia Green Crest & Typography (Image 4) */}
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Top Palm Tree */}
              <path d="M50,10 C50,26 50,34 50,34" stroke="#006C35" strokeWidth="5" strokeLinecap="round" />
              <path d="M50,14 C42,10 34,16 32,24" stroke="#006C35" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M50,14 C58,10 66,16 68,24" stroke="#006C35" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M50,20 C40,18 36,26 34,32" stroke="#006C35" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M50,20 C60,18 64,26 66,32" stroke="#006C35" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Geometric Wing Chevrons */}
              <polygon points="50,35 90,48 50,92 10,48" fill="#006C35" />
              <polygon points="50,45 80,55 50,82 20,55" fill="#FFFFFF" />
              <polygon points="50,52 72,60 50,75 28,60" fill="#006C35" />
            </svg>
          </div>
          <div className="text-left leading-none">
            <span className="block text-[13px] font-arabic font-bold text-[#006C35]">السعودية</span>
            <span className="block text-sm font-black tracking-widest text-[#006C35] mt-0.5">saudia</span>
          </div>
        </div>
      );

    case 'etihad':
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          {/* Etihad Gold Arabic & English (Image 5) */}
          <span className="text-[13px] font-arabic font-black text-[#B8860B] leading-none tracking-widest">
            الاتحاد
          </span>
          <span className="font-serif-luxury text-base font-black tracking-[0.28em] text-[#B8860B] leading-none mt-1">
            ETIHAD
          </span>
          <span className="text-[6.5px] font-bold uppercase tracking-[0.35em] text-[#8C6B17] mt-0.5">
            AIRWAYS
          </span>
        </div>
      );

    case 'qatar':
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          {/* Qatar Airways Official Wordmark (Image 2) */}
          <div className="leading-none">
            <span className="font-serif-luxury text-2xl sm:text-[27px] font-extrabold tracking-tight text-[#5C0632] block">
              QATAR
            </span>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="font-sans-luxury text-[9px] sm:text-[10px] font-bold tracking-[0.16em] text-[#4A5568]">
                AIRWAYS
              </span>
              <span className="font-arabic text-[12px] sm:text-[13px] font-black text-[#5C0632] leading-none">
                القطرية
              </span>
            </div>
          </div>
        </div>
      );

    case 'turkish':
      return (
        <div className={`flex items-center justify-center gap-2.5 ${className}`}>
          {/* Official Turkish Airlines Red Roundel Logo (Mesut Manioğlu emblem matching official guidelines) */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#C8102E] flex items-center justify-center text-white flex-shrink-0 shadow-xs p-1">
            <svg viewBox="0 0 61 61" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* White Bird Emblem */}
              <path
                d="M 35,58.4 C 50.5,55.8 61,41.1 58.4,25.5 56.2,12.6 45.7,3.2 33.3,1.9 30.8,1.6 28.2,1.7 25.6,2.1 22.5,2.6 19.6,3.6 17,5 c 13.6,4.7 21,11.8 21.5,19 0.3,4.5 -1.8,7.7 -4.6,10.3 L 53.3,33 c 0.5,0 0.7,0.6 0.1,0.8 L 7.1,47 c 4.7,6.5 12,10.8 20.1,11.6 2.6,0.3 5.2,0.3 7.8,-0.2 Z M 22.3,30.9 C 24.8,21.4 21.9,11.4 15,6.1 5.6,12.1 0.1,23.3 2.1,35 c 0.6,3.9 2,7.4 4,10.5 7.4,-2 13.9,-5.9 16.2,-14.6 Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
          <div className="text-left leading-[1.08]">
            <span className="block font-sans font-black text-[13px] sm:text-[14px] tracking-tight text-[#111827]">
              TURKISH
            </span>
            <span className="block font-sans font-black text-[13px] sm:text-[14px] tracking-tight text-[#111827]">
              AIRLINES
            </span>
          </div>
        </div>
      );

    case 'oman':
      return (
        <div className={`flex items-center justify-center gap-3 ${className}`}>
          {/* Left: Typography (Arabic in Gold, OMAN AIR in Gray Italic) */}
          <div className="text-right leading-none">
            <span className="block text-[12px] sm:text-[13px] font-arabic font-extrabold text-[#B59A57] tracking-normal">
              الطيران العُماني
            </span>
            <span className="block font-sans-luxury text-xs sm:text-[13px] font-black italic tracking-wider text-[#8C939D] uppercase mt-1">
              OMAN AIR
            </span>
          </div>

          {/* Right: Iconic Oman Air Ribbon Wing (Silver Gray S-Curve + Golden Wing Feathers) */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Right Gold Wing Feathers */}
              <path
                d="M48,36 C58,35 78,35 90,36 C80,41 68,43 54,43 Z"
                fill="#B59A57"
              />
              <path
                d="M52,43 C64,43 78,44 86,47 C76,52 64,54 55,54 Z"
                fill="#B59A57"
              />
              <path
                d="M54,54 C66,54 75,56 80,60 C70,64 60,65 52,65 Z"
                fill="#B59A57"
              />

              {/* Left Silver-Gray Flowing S-Ribbon */}
              <path
                d="M48,36 C38,36 30,42 30,50 C30,60 48,64 48,74 C48,82 40,86 34,86 C42,86 52,82 52,72 C52,62 34,58 34,48 C34,40 42,36 48,36 Z"
                fill="#8C939D"
              />
              <path
                d="M34,48 C34,42 40,36 48,36 C42,36 30,42 30,52 C30,65 52,68 52,78 C52,86 44,90 35,90 C45,90 56,84 56,74 C56,60 34,58 34,48 Z"
                fill="#9DA4AF"
              />
            </svg>
          </div>
        </div>
      );

    case 'scoot':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {/* Scoot Yellow Circle & Black Text (Image 9) */}
          <div className="relative w-12 h-12 rounded-full bg-[#FFE600] flex items-center justify-center text-black flex-shrink-0 shadow-sm">
            <span className="font-sans font-black text-sm tracking-tighter text-[#111827]">
              scoot
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
};
