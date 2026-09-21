import { useState, useEffect } from 'react';
import { 
  Star, 
  Quote, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  ExternalLink,
  Film,
  MessageSquarePlus,
  ShieldCheck
} from 'lucide-react';
import { 
  TESTIMONIALS_DATA, 
  GALLERY_DATA 
} from '../data/packagesData';
import { subscribeToGallery, subscribeToTestimonials } from '../lib/firestoreService';
import { GalleryPhotoItem, TestimonialItem } from '../types';
import { SubmitTestimonialModal } from './SubmitTestimonialModal';

export const TestimonialsGallerySection = () => {
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>(TESTIMONIALS_DATA);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryPhotoItem[]>(GALLERY_DATA);
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>('all');
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsubTestimonials = subscribeToTestimonials((items) => {
      if (items && items.length > 0) {
        setTestimonialsList(items);
      }
    });

    const unsubGallery = subscribeToGallery((items) => {
      if (items && items.length > 0) {
        setGalleryItems(items);
      }
    });

    return () => {
      unsubTestimonials();
      unsubGallery();
    };
  }, []);

  const activeTestimonials = testimonialsList.filter((t) => t.status !== 'hidden');
  const displayedTestimonials = showAllTestimonials ? activeTestimonials : activeTestimonials.slice(0, 6);

  const avgRating = (
    activeTestimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0) /
    (activeTestimonials.length || 1)
  ).toFixed(1);

  const filteredGallery = galleryItems.filter((item) => {
    if (selectedPhotoCategory === 'all') return true;
    return item.category === selectedPhotoCategory;
  });

  const displayedGallery = showAllGallery ? filteredGallery : filteredGallery.slice(0, 6);

  const handleOpenLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const handleNextPhoto = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev! + 1) % filteredGallery.length);
  };

  const handlePrevPhoto = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev! - 1 + filteredGallery.length) % filteredGallery.length);
  };

  return (
    <section id="testimoni-section" className="py-10 sm:py-16 md:py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16 bg-[#FAFAFA] rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-sm scroll-mt-24 relative overflow-hidden w-full max-w-full">
      {/* Testimonials Section (Testimoni Jamaah & Alumnus) */}
      <div className="space-y-6 sm:space-y-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#A67C52] bg-white px-3.5 py-1 rounded-full border border-[#A67C52]/30 inline-block shadow-sm">
            Ulasan &amp; Pengalaman Nyata
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
            Testimoni &amp; Rating Jamaah
          </h2>
          <p className="font-sans-luxury text-[#555555] text-sm sm:text-base leading-relaxed">
            Ulasan nyata dari jamaah yang telah menunaikan ibadah umroh dan haji bersama ALGHANIM.
          </p>

          {/* Social Proof & Add Testimonial Action Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-amber-200/80 shadow-sm">
              <div className="flex items-center text-[#A67C52]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#A67C52] text-[#A67C52]" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">
                {avgRating} / 5.0
              </span>
              <span className="text-[11px] text-gray-500">
                ({activeTestimonials.length} Ulasan)
              </span>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A67C52] hover:bg-[#8e653d] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#A67C52]/20 hover:scale-[1.02] cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Tulis Testimoni &amp; Rating</span>
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid: Clean White cards, Luxury Brown stars, Charcoal text */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#A67C52] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 relative group"
            >
              <Quote className="w-8 h-8 text-[#A67C52]/15 absolute top-6 right-6 group-hover:text-[#A67C52]/30 transition-colors" />

              <div className="space-y-3">
                {/* Rating Stars: Luxury Brown + Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#A67C52] text-[#A67C52]" />
                    ))}
                    <span className="text-xs font-bold text-[#1A1A1A] ml-1">
                      {(t.rating || 5).toFixed(1)}
                    </span>
                  </div>
                  {t.isVerified || t.nij ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200" title="Jamaah Terverifikasi Resmi ALGHANIM">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Jamaah Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                      Jamaah ALGHANIM
                    </span>
                  )}
                </div>

                <p className="font-sans-luxury text-xs sm:text-sm text-[#1A1A1A] leading-relaxed italic line-clamp-5">
                  "{t.comment}"
                </p>

                {/* Official Admin Reply from ALGHANIM if present */}
                {t.adminReply && t.adminReply.replyText && (
                  <div className="mt-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-left space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#A67C52]">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {t.adminReply.repliedBy || 'Tanggapan Manajemen ALGHANIM'}
                      </span>
                      {t.adminReply.repliedAt && (
                        <span className="text-gray-400 font-normal">{t.adminReply.repliedAt}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      "{t.adminReply.replyText}"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100">
                {/* Elegant Letter Avatar sesuai permintaan: Huruf inisial jamaah, tanpa foto orang tak dikenal */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#A67C52] to-[#8E653E] text-white flex items-center justify-center font-bold text-sm shadow-xs border-2 border-[#A67C52]/40 flex-shrink-0">
                  {t.name
                    ? t.name
                        .replace(/^(H\.|Hj\.|Ustadz|Drs\.|Dr\.|Bapak|Ibu)\s+/i, '')
                        .trim()
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'J'
                    : 'J'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif-luxury text-sm font-bold text-[#1A1A1A] group-hover:text-[#A67C52] transition-colors truncate">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-[#666666] truncate">
                    {t.city} • <span className="text-[#A67C52] font-semibold">{t.packageTaken}</span>
                  </p>
                  <span className="text-[10px] text-gray-400 block">{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button for Testimonials */}
        {activeTestimonials.length > 6 && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAllTestimonials(!showAllTestimonials)}
              className="px-6 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-[#A67C52] text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#A67C52] transition-all shadow-sm cursor-pointer"
            >
              {showAllTestimonials ? 'Tampilkan Lebih Sedikit' : `Lihat Lengkapnya (${activeTestimonials.length} Testimoni)`}
            </button>
          </div>
        )}
      </div>

      {/* Modal Tulis Testimoni */}
      <SubmitTestimonialModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      {/* Galeri Keberangkatan & Dokumentasi */}
      <div id="galeri-section" className="space-y-8 pt-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#A67C52] bg-white px-3.5 py-1 rounded-full border border-[#A67C52]/30 inline-block mb-2 shadow-sm">
              Dokumentasi Perjalanan
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              Galeri Keberangkatan
            </h3>
            <p className="font-sans-luxury text-xs sm:text-sm text-[#666666] mt-1">
              Dokumentasi pelaksanaan ibadah jamaah di Makkah, Madinah, dan kegiatan manasik.
            </p>
          </div>

          {/* Photo Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Semua' },
              { key: 'Makkah', label: 'Makkah' },
              { key: 'Madinah', label: 'Madinah' },
              { key: 'Keberangkatan', label: 'Bandara' },
              { key: 'Manasik', label: 'Manasik' },
              { key: 'Thaif', label: 'Thaif' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedPhotoCategory(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedPhotoCategory === tab.key
                    ? 'bg-[#A67C52] text-white shadow-sm'
                    : 'bg-white text-[#666666] border border-gray-200 hover:border-[#A67C52]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGallery.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => handleOpenLightbox(index)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-gray-200 hover:border-[#A67C52] shadow-sm hover:shadow-md cursor-pointer transition-all bg-gray-950 flex items-center justify-center"
            >
              <img
                src={photo.image}
                alt={photo.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80';
                  }
                }}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-end p-4 transition-opacity">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#A67C52] tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 w-fit border border-[#A67C52]/30 shadow-sm">
                    {photo.category}
                  </span>
                  {photo.mediaType === 'video' ? (
                    <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      Video
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-white/80 bg-black/50 px-2 py-0.5 rounded-full">
                      Foto
                    </span>
                  )}
                </div>
                <h4 className="font-serif-luxury text-base font-bold text-white group-hover:text-[#A67C52] transition-colors leading-snug">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-[#D9D9D9] flex items-center gap-1.5 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                  <span className="truncate">{photo.location}</span>
                </p>
              </div>

              {/* View Overlay Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                {photo.mediaType === 'video' ? (
                  <PlayCircle className="w-5 h-5 text-[#A67C52]" />
                ) : (
                  <Camera className="w-4 h-4 text-[#A67C52]" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button for Gallery */}
        {filteredGallery.length > 6 && (
          <div className="text-center pt-2">
            <button
              onClick={() => {
                if (showAllGallery) {
                  setShowAllGallery(false);
                  const el = document.getElementById('galeri-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                } else {
                  setShowAllGallery(true);
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-[#A67C52] text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#A67C52] transition-all shadow-sm cursor-pointer"
            >
              {showAllGallery ? 'Tampilkan Lebih Sedikit' : `Lihat Lengkapnya (${filteredGallery.length} Foto/Video)`}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal: Snug fit to photo, not oversized */}
      {activeLightboxIndex !== null && filteredGallery[activeLightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={handleCloseLightbox}
        >
          {/* Active Image Box fitted perfectly */}
          <div 
            className="relative max-w-[92vw] sm:max-w-xl md:max-w-2xl max-h-[90vh] bg-[#181818] rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl p-2.5 sm:p-4 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseLightbox}
              aria-label="Close Lightbox"
              className="absolute top-3 right-3 p-2 rounded-full bg-black/75 text-white hover:bg-[#a67c52] border border-white/20 transition-colors z-20 cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Nav arrows */}
            <button
              onClick={handlePrevPhoto}
              aria-label="Previous Photo"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#201f1f] text-white hover:bg-[#a67c52] border border-white/20 transition-colors z-20 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextPhoto}
              aria-label="Next Photo"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#201f1f] text-white hover:bg-[#a67c52] border border-white/20 transition-colors z-20 cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Active Image */}
            <div className="relative max-h-[62vh] sm:max-h-[66vh] w-full flex items-center justify-center overflow-hidden rounded-xl bg-black">
              <img
                src={filteredGallery[activeLightboxIndex].image}
                alt={filteredGallery[activeLightboxIndex].title}
                className="max-h-[62vh] sm:max-h-[66vh] max-w-full w-auto h-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
              {filteredGallery[activeLightboxIndex].mediaType === 'video' && filteredGallery[activeLightboxIndex].videoUrl && (
                <a
                  href={filteredGallery[activeLightboxIndex].videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Putar Video</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Snug Caption */}
            <div className="pt-3 pb-1 px-2 text-center space-y-1 w-full max-w-lg">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#DFC386] font-bold">
                {filteredGallery[activeLightboxIndex].category} • {filteredGallery[activeLightboxIndex].year || '2027'}
              </span>
              <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-white line-clamp-1">
                {filteredGallery[activeLightboxIndex].title}
              </h4>
              <p className="text-[11px] text-gray-300 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-[#DFC386]" />
                <span>{filteredGallery[activeLightboxIndex].location}</span>
              </p>
              {filteredGallery[activeLightboxIndex].caption && (
                <p className="text-[11px] text-gray-400 italic line-clamp-2 pt-1 border-t border-white/10 mt-1">
                  "{filteredGallery[activeLightboxIndex].caption}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
