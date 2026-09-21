import React from 'react';
import { Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';
import { OFFICIAL_WA_LINK } from '../data/packagesData';

// Logo TikTok Asli (SVG)
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.32a6.34 6.34 0 0 0-.85-.06A6.33 6.33 0 0 0 3.1 15.6a6.34 6.34 0 0 0 10.74 4.54 6.27 6.27 0 0 0 1.94-4.52V8.92a8.28 8.28 0 0 0 4.81 1.52v-3.45a4.85 4.85 0 0 1-1-.3z" />
  </svg>
);

export const SlimSocialBar: React.FC = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@alghanimtour',
      url: 'https://instagram.com/alghanimtour',
      icon: Instagram,
      hoverClass: 'hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]',
      activeColor: 'text-[#E1306C]'
    },
    {
      name: 'YouTube',
      handle: 'AL-GHANIM Official',
      url: 'https://youtube.com/@alghanimtour',
      icon: Youtube,
      hoverClass: 'hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]',
      activeColor: 'text-[#FF0000]'
    },
    {
      name: 'TikTok',
      handle: '@alghanim.travel',
      url: 'https://tiktok.com/@alghanim.travel',
      icon: TikTokIcon,
      hoverClass: 'hover:bg-black hover:text-white hover:border-black',
      activeColor: 'text-gray-900'
    },
    {
      name: 'Facebook',
      handle: 'Al-Ghanim Islamic Tour',
      url: 'https://facebook.com/alghanimtour',
      icon: Facebook,
      hoverClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
      activeColor: 'text-[#1877F2]'
    },
    {
      name: 'WhatsApp',
      handle: '0813-1670-218',
      url: OFFICIAL_WA_LINK,
      icon: MessageCircle,
      hoverClass: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
      activeColor: 'text-[#25D366]'
    }
  ];

  return (
    <aside aria-label="Media Sosial Resmi AL-GHANIM" className="w-full bg-[#FAF8F5] border-b border-[#EBEBEB] py-1.5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-3 text-xs">
        {/* Label Syiar Resmi Singkat */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="font-serif-luxury font-bold text-gray-800 text-[11px] sm:text-xs tracking-tight">
            Media Sosial Resmi AL-GHANIM:
          </span>
        </div>

        {/* Barisan Logo Media Sosial Saja (Logo Bulat Elegan, Bersih, Tidak Bertumpuk) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka ${item.name} AL-GHANIM (${item.handle})`}
                title={`${item.name}: ${item.handle}`}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-200/90 text-gray-600 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${item.hoverClass}`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
