import React from 'react';
import officialLogoImg from '../assets/images/LOGO AL-GHANIM.png';

interface AlGhanimLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'badge' | 'footer' | 'centered' | 'light' | 'dark' | 'image';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showLegalBadge?: boolean;
  showText?: boolean;
  theme?: 'light' | 'dark';
}

export const AlGhanimLogo: React.FC<AlGhanimLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  // Box size for icon squircle on the left
  const boxSizes = {
    sm: 'h-9 w-9 p-1.5 rounded-xl',
    md: 'h-12 w-12 sm:h-13 sm:w-13 p-2 rounded-2xl',
    lg: 'h-14 w-14 sm:h-16 sm:w-16 p-2.5 rounded-2xl',
    xl: 'h-20 w-20 p-3.5 rounded-3xl'
  };

  // Text sizes for "alghanim"
  const titleSizes = {
    sm: 'text-lg font-bold',
    md: 'text-2xl sm:text-3xl font-extrabold tracking-tight',
    lg: 'text-3xl sm:text-4xl font-extrabold',
    xl: 'text-4xl sm:text-5xl font-black'
  };

  // Subtitle sizes for "ISLAMIC TOUR"
  const subSizes = {
    sm: 'text-[8px] tracking-[0.25em]',
    md: 'text-[9.5px] sm:text-[11px] tracking-[0.32em] font-bold',
    lg: 'text-xs tracking-[0.35em] font-bold',
    xl: 'text-sm tracking-[0.4em] font-bold'
  };

  return (
    <div className={`inline-flex items-center gap-3.5 select-none text-left ${className}`}>
      {/* 1. Left Icon Box (Squircle Dark Card bg-[#1A1A1A]) */}
      <div className={`${boxSizes[size]} relative flex items-center justify-center flex-shrink-0 bg-[#1A1A1A] shadow-md border border-[#2B2B2B] overflow-hidden`}>
        <img
          src={officialLogoImg}
          alt="ALGHANIM Logo"
          className="w-full h-full object-contain select-none"
        />
      </div>

      {/* 2. Right Text Branding: "alghanim" + "ISLAMIC TOUR" */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          {/* Row 1: alghanim (lowercase bold with metallic charcoal-to-gold gradient) */}
          <span
            className={`font-sans lowercase leading-tight inline-block bg-gradient-to-r ${
              isDark
                ? 'from-[#FFFFFF] via-[#E2E2E2] to-[#D5BA9F]'
                : 'from-[#2B2B2B] via-[#3D3D3D] to-[#A67C52]'
            } bg-clip-text text-transparent ${titleSizes[size]}`}
          >
            alghanim
          </span>

          {/* Row 2: ISLAMIC TOUR (all-caps wide tracking) */}
          <span
            className={`font-sans uppercase block mt-1 ${
              isDark ? 'text-[#AFAFAF]' : 'text-[#8C827A]'
            } ${subSizes[size]}`}
          >
            ISLAMIC TOUR
          </span>
        </div>
      )}
    </div>
  );
};
