import React, { useState } from 'react';
import { Star, X, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { addTestimonialToFirestore } from '../lib/firestoreService';

interface SubmitTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillName?: string;
  prefillNij?: string;
  prefillPackage?: string;
  onSuccess?: () => void;
}

const PACKAGE_OPTIONS = [
  'Umroh Reguler Syawal 1448 H (9 Hari)',
  'Umroh VIP Plus Kereta Cepat Haramain (12 Hari)',
  'Umroh Liburan Akhir Tahun Bintang 5 (10 Hari)',
  'Umroh Awal Musim 1448 H / Promo Berkah',
  'Haji Khusus / Furoda Mujamalah Kuota Resmi',
  'Badal Umroh / Badal Haji Amanah ALGHANIM',
  'Paket Kustom / Umroh Keluarga Mandiri'
];

export const SubmitTestimonialModal: React.FC<SubmitTestimonialModalProps> = ({
  isOpen,
  onClose,
  prefillName = '',
  prefillPackage = '',
  onSuccess
}) => {
  const [name, setName] = useState(prefillName);
  const [city, setCity] = useState('');
  const [packageTaken, setPackageTaken] = useState(prefillPackage || PACKAGE_OPTIONS[0]);
  const [customPackage, setCustomPackage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Mohon cantumkan nama lengkap Anda.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMsg('Mohon tuliskan testimoni atau pengalaman minimal 10 karakter.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const finalPackage = packageTaken === 'Lainnya' ? (customPackage || 'Umroh ALGHANIM') : packageTaken;
      const defaultAvatar = `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80`;

      await addTestimonialToFirestore({
        name: name.trim(),
        city: city.trim() || 'Garut',
        packageTaken: finalPackage,
        rating,
        comment: comment.trim(),
        avatar: defaultAvatar,
        isVerified: true,
        status: 'approved', // Live but manageable by admin
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2200);
    } catch (error) {
      console.error('Failed to submit testimonial:', error);
      setErrorMsg('Gagal mengirim testimoni. Silakan coba sesaat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5: return '⭐⭐⭐⭐⭐ Sangat Memuaskan & Amanah';
      case 4: return '⭐⭐⭐⭐ Memuaskan & Nyaman';
      case 3: return '⭐⭐⭐ Cukup Baik';
      case 2: return '⭐⭐ Kurang Memuaskan';
      case 1: return '⭐ Perlu Banyak Perbaikan';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
              Jazakumullah Khairan Katsiran!
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Terima kasih Bpk/Ibu <strong className="text-[#1A1A1A]">{name}</strong> telah memberikan ulasan dan rating berharga. Testimoni Anda sangat berarti bagi kemajuan pelayanan ALGHANIM.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Testimoni Anda telah berhasil tersimpan
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-[#A67C52]/30 text-[#A67C52] text-xs font-semibold uppercase tracking-wider mb-2">
                <Heart className="w-3.5 h-3.5 fill-[#A67C52]" />
                Suara &amp; Pengalaman Jamaah
              </div>
              <h3 className="text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
                Tulis Testimoni &amp; Rating Ibadah
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                Bagikan pengalaman ibadah, kenyamanan hotel, dan bimbingan muthawwif ALGHANIM untuk mempererat tali ukhuwah serta referensi calon jamaah lainnya.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Interactive Star Rating */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 text-center space-y-2">
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Berapa Rating Kepuasan Anda?
                </label>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const active = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        type="button"
                        key={starVal}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starVal)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        title={`${starVal} Bintang`}
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            active
                              ? 'fill-[#C5A059] text-[#C5A059] drop-shadow-sm'
                              : 'fill-gray-200 text-gray-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs font-bold text-[#A67C52] min-h-[18px]">
                  {getRatingLabel(hoverRating || rating)}
                </div>
              </div>

              {/* Grid: Nama & Kota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: H. Ahmad Fauzi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kota Asal / Domisili
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Garut / Bandung"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52]"
                  />
                </div>
              </div>

              {/* Program Paket Ibadah */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Program Paket Ibadah <span className="text-gray-400 font-normal">(Pilihan Paket yang Diikuti)</span>
                </label>
                <select
                  value={packageTaken}
                  onChange={(e) => setPackageTaken(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52] bg-white cursor-pointer"
                >
                  {PACKAGE_OPTIONS.map((pkg) => (
                    <option key={pkg} value={pkg}>
                      {pkg}
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya (Ketik Sendiri)</option>
                </select>
                {packageTaken === 'Lainnya' && (
                  <input
                    type="text"
                    value={customPackage}
                    onChange={(e) => setCustomPackage(e.target.value)}
                    placeholder="Nama program paket Anda"
                    className="mt-2 w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#A67C52]"
                  />
                )}
              </div>

              {/* Isi Testimoni */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Pengalaman &amp; Kesan Ibadah Anda <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {comment.length} karakter
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda mengenai pelayanan muthawwif, ketepatan jadwal, jarak hotel ke Masjidil Haram/Nabawi, makanan, dan bimbingan manasik..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#A67C52] focus:ring-1 focus:ring-[#A67C52] resize-none"
                />
              </div>

              {/* Info Moderasi */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-[#A67C52] shrink-0 mt-0.5" />
                <span>
                  ALGHANIM menjaga kenyamanan bersama. Setiap ulasan dimoderasi secara berkala oleh Admin untuk mencegah ujaran kebencian atau spam.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8d6641] text-white text-xs font-bold transition-all shadow-md shadow-[#A67C52]/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Mengirimkan...</span>
                    </>
                  ) : (
                    <>
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Kirim Testimoni &amp; Rating</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
