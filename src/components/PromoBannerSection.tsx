import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Clock,
  Maximize2,
  X,
  Sparkles
} from 'lucide-react';
import { PromoBannerItem } from '../types';
import { subscribeToPromoBanners } from '../lib/firestoreService';
import { OFFICIAL_WA_LINK } from '../data/packagesData';

interface PromoBannerSectionProps {
  onOpenConsultation?: (topic: string) => void;
}

export const PromoBannerSection: React.FC<PromoBannerSectionProps> = () => {
  const [banners, setBanners] = useState<PromoBannerItem[]>([]);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; ctaLink?: string } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPromoBanners((items) => {
      const activeItems = items.filter(b => b.isActive !== false);
      setBanners(activeItems);
    });
    return () => unsubscribe();
  }, []);

  if (banners.length === 0) return null;

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 w-full max-w-full overflow-x-hidden">
      {/* Lightbox Modal for HD Flyer Viewing */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 transition-all"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-2xl w-full max-h-[94vh] flex flex-col bg-[#1A1816] border border-[#C5A059]/40 rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full bg-[#A67C52]/20 border border-[#A67C52]/40 text-[#C5A059] text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                  Flyer Promo
                </span>
                <h4 className="text-white text-xs sm:text-sm font-bold truncate">
                  {lightboxImage.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Poster Image Container */}
            <div className="flex-1 my-3 flex items-center justify-center overflow-auto min-h-[260px] max-h-[68vh] rounded-2xl bg-neutral-950 p-2 border border-stone-800">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                loading="lazy"
                decoding="async"
                className="max-h-[64vh] w-auto max-w-full object-contain rounded-lg shadow-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-800">
              <a
                href={lightboxImage.ctaLink || OFFICIAL_WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Daftar Promo via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Package-Style Card (Bukan full screen, seperti kartu paketan, fokus judul & daftar promo) */}
      <div className="max-w-4xl mx-auto">
        <div className={`grid grid-cols-1 ${banners.length > 1 ? 'md:grid-cols-2 gap-6' : 'max-w-md mx-auto'}`}>
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image Preview Container */}
              <div 
                onClick={() => setLightboxImage({ 
                  url: banner.imageUrl || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80', 
                  title: banner.title,
                  ctaLink: banner.targetLink || OFFICIAL_WA_LINK
                })}
                className="relative aspect-[4/3] bg-neutral-900 overflow-hidden cursor-pointer flex items-center justify-center"
                title="Klik untuk melihat flyer promo ukuran penuh"
              >
                <img
                  src={banner.imageUrl || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80'}
                  alt={banner.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Badge Promo */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#A67C52] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>{banner.badgeText || '#SPESIALIS UMROH HEMAT'}</span>
                </div>

                {/* Klik Perbesar Indicator */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm border border-white/20 text-white text-[11px] font-medium flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Lihat Flyer</span>
                </div>
              </div>

              {/* Simple Card Body: Title & Promo Button */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {banner.endDate && (
                    <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#A67C52]" />
                      <span>Berlaku s/d {banner.endDate}</span>
                    </div>
                  )}

                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A] group-hover:text-[#A67C52] transition-colors leading-snug">
                    {banner.title}
                  </h3>
                </div>

                {/* Action CTA Button */}
                <a
                  href={banner.targetLink || OFFICIAL_WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#A67C52] hover:bg-[#8E653E] text-white font-sans-luxury py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-[#A67C52]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>{banner.ctaText || 'Daftar Promo Umroh Hemat'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
