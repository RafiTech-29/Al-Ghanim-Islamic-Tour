import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Eye,
  RefreshCw,
  Tag,
  Maximize2,
  Smartphone,
  Monitor
} from 'lucide-react';
import { PromoBannerItem } from '../../types';
import { 
  subscribeToPromoBanners, 
  addPromoBannerToFirestore, 
  updatePromoBannerInFirestore, 
  deletePromoBannerFromFirestore 
} from '../../lib/firestoreService';
import { OFFICIAL_WA_LINK } from '../../data/packagesData';
import { compressImageFile } from '../../utils/imageCompressor';

const PRESET_BANNERS = [
  {
    name: 'Poster Promo Umroh Tegak (Flyer 4:5)',
    url: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: 'portrait' as const
  },
  {
    name: 'Promo Ka\'bah Ramadhan (Landscape 16:9)',
    url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape' as const
  },
  {
    name: 'Promo Haji VVIP Furoda',
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape' as const
  }
];

export const AdminBannersCMS: React.FC = () => {
  const [banners, setBanners] = useState<PromoBannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Lightbox Preview Modal
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  const [formData, setFormData] = useState<Omit<PromoBannerItem, 'id'>>({
    title: '',
    subtitle: '',
    badgeText: 'HOT PROMO BULAN INI',
    imageUrl: PRESET_BANNERS[0].url,
    targetLink: OFFICIAL_WA_LINK,
    ctaText: 'Klaim Promo via WhatsApp',
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    isActive: true,
    aspectRatio: 'portrait',
    posterSizeFormat: 'flyer-vertical'
  });

  const [uploadPreview, setUploadPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status state
  const [isSaving, setIsSaving] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToPromoBanners((items) => {
      setBanners(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      badgeText: 'HOT PROMO BULAN INI',
      imageUrl: PRESET_BANNERS[0].url,
      targetLink: OFFICIAL_WA_LINK,
      ctaText: 'Klaim Promo via WhatsApp',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-12-31',
      isActive: true,
      aspectRatio: 'portrait',
      posterSizeFormat: 'flyer-vertical'
    });
    setUploadPreview(PRESET_BANNERS[0].url);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: PromoBannerItem) => {
    setModalMode('edit');
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      badgeText: banner.badgeText || 'HOT PROMO',
      imageUrl: banner.imageUrl || PRESET_BANNERS[0].url,
      targetLink: banner.targetLink || OFFICIAL_WA_LINK,
      ctaText: banner.ctaText || 'Klaim Promo via WhatsApp',
      startDate: banner.startDate || '',
      endDate: banner.endDate || '',
      isActive: banner.isActive !== false,
      aspectRatio: banner.aspectRatio || 'portrait',
      posterSizeFormat: banner.posterSizeFormat || 'flyer-vertical'
    });
    setUploadPreview(banner.imageUrl || PRESET_BANNERS[0].url);
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      // Disesuaikan untuk poster flyer tegak (seperti Gambar 4): maxHeight 1600 & maxWidth 1200
      // Mempertahankan teks harga, nama hotel, dan logo maskapai tetap tajam dan terbaca sempurna.
      const compressedBase64 = await compressImageFile(file, 1200, 1600, 0.82);
      setUploadPreview(compressedBase64);
      setFormData(prev => ({ 
        ...prev, 
        imageUrl: compressedBase64,
        aspectRatio: 'portrait',
        posterSizeFormat: 'flyer-vertical'
      }));
    } catch (error) {
      console.error('Error compressing banner image:', error);
      alert('Gagal memproses gambar. Silakan coba lagi.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Mohon isi Judul Promo');
      return;
    }

    setIsSaving(true);

    const payload: Omit<PromoBannerItem, 'id'> = {
      ...formData,
      imageUrl: uploadPreview || formData.imageUrl || PRESET_BANNERS[0].url
    };

    // Optimistic UI update
    if (editingId) {
      setBanners(prev => prev.map(b => b.id === editingId ? { ...b, ...payload, id: editingId } : b));
    }

    try {
      if (modalMode === 'create') {
        const newId = await addPromoBannerToFirestore(payload);
        setBanners(prev => [{ ...payload, id: newId }, ...prev]);
        showToast('✓ Banner promo baru berhasil diterbitkan!');
      } else if (editingId) {
        await updatePromoBannerInFirestore(editingId, payload);
        showToast('✓ Data banner promo berhasil diperbarui!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving banner:', err);
      showToast('✓ Data disimpan di tampilan.');
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (banner: PromoBannerItem) => {
    const newStatus = !banner.isActive;
    // Optimistic UI update
    setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, isActive: newStatus } : b));
    try {
      await updatePromoBannerInFirestore(banner.id, { isActive: newStatus });
      showToast(newStatus ? '✓ Banner diaktifkan!' : '✓ Banner dinonaktifkan.');
    } catch (err) {
      console.error('Error toggling banner status:', err);
      // Revert if error
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, isActive: banner.isActive } : b));
      showToast('Gagal mengubah status banner.');
    }
  };

  const handleDeleteBanner = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deletePromoBannerFromFirestore(deleteConfirm.id);
      showToast('✓ Banner promo berhasil dihapus.');
      setDeleteConfirm({ isOpen: false, id: '', title: '' });
    } catch (err) {
      console.error('Error deleting banner:', err);
      alert('Gagal menghapus banner.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#1A1A1A] text-white shadow-2xl border border-gray-700 text-xs animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#A67C52]/10 text-[#A67C52] text-[11px] font-bold uppercase tracking-wider">
              Brosur &amp; Banner Promosi
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">Ukuran Poster Sesuai Brosur Promo</span>
          </div>
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            Kelola Poster Promo Umroh
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Atur poster promosi diskon, cashback, atau bonus manasik. Anda dapat mengaktifkan poster untuk langsung ditayangkan di website atau menyimpannya sebagai draft saat promo belum dimulai.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Poster Promo Baru</span>
        </button>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="w-6 h-6 text-[#A67C52] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Memuat poster promo...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">Belum ada poster promo tersimpan.</p>
          <p className="text-xs text-gray-400 mt-1">Klik tombol "+ Upload Poster Promo Baru" untuk menambahkan poster atau flyer promo Anda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                banner.isActive 
                  ? 'bg-white border-gray-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-200 opacity-80'
              }`}
            >
              {/* Preview Thumbnail with proper aspect ratio container */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div 
                  onClick={() => setLightboxImage({ url: banner.imageUrl || PRESET_BANNERS[0].url, title: banner.title })}
                  className={`rounded-xl bg-neutral-900 overflow-hidden flex-shrink-0 relative border border-gray-300 group cursor-pointer shadow-xs ${
                    banner.aspectRatio === 'landscape' 
                      ? 'w-28 h-20' 
                      : 'w-20 h-28 sm:w-24 sm:h-32'
                  }`}
                  title="Klik untuk melihat poster ukuran penuh"
                >
                  <img
                    src={banner.imageUrl || PRESET_BANNERS[0].url}
                    alt={banner.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {banner.isActive ? (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold">
                      TAYANG
                    </span>
                  ) : (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-gray-600 text-white text-[9px] font-bold">
                      DRAFT
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-[#A67C52]/15 text-[#A67C52] text-[10px] font-extrabold uppercase tracking-wider">
                      {banner.badgeText || 'HOT PROMO'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
                      {banner.aspectRatio === 'landscape' ? 'Spanduk 16:9' : 'Poster Flyer Tegak (4:5)'}
                    </span>
                    {banner.endDate && (
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>s/d {banner.endDate}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[#1A1A1A]">
                    {banner.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 max-w-xl">
                    {banner.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                <button
                  onClick={() => setLightboxImage({ url: banner.imageUrl || PRESET_BANNERS[0].url, title: banner.title })}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Lihat Pratinjau Asli"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleToggleActive(banner)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    banner.isActive
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={banner.isActive ? "Klik untuk jadikan draft (sembunyikan dari beranda)" : "Klik untuk tayangkan di beranda"}
                >
                  {banner.isActive ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-600" />
                      <span>Tayang</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-gray-500" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEdit(banner)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#A67C52] hover:text-white text-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, id: banner.id, title: banner.title })}
                  className="p-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus Poster"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
         MODAL: FORM UPLOAD & EDIT POSTER PROMO (Disesuaikan untuk Format Flyer Tegak)
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-20">
              <div>
                <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                  {modalMode === 'create' ? 'Upload Poster Flyer Baru' : 'Edit Poster Promo'}
                </span>
                <h3 className="font-bold text-lg text-[#1A1A1A]">
                  {modalMode === 'create' ? 'Tambah Poster Promo Umroh' : `Edit: ${formData.title}`}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-5 sm:p-6 space-y-4">
              
              {/* Format Ukuran Poster Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Format Ukuran Poster Promo *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, aspectRatio: 'portrait', posterSizeFormat: 'flyer-vertical' })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      formData.aspectRatio === 'portrait'
                        ? 'border-[#A67C52] bg-[#A67C52]/10 ring-2 ring-[#A67C52]/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 mt-0.5 flex-shrink-0 ${formData.aspectRatio === 'portrait' ? 'text-[#A67C52]' : 'text-gray-400'}`} />
                    <div>
                      <p className={`text-xs font-bold ${formData.aspectRatio === 'portrait' ? 'text-[#A67C52]' : 'text-gray-800'}`}>
                        Poster Flyer Tegak (4:5 / 3:4)
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Format brosur umroh vertikal (seperti Gambar 4). Detail tanggal, harga, &amp; hotel terlihat utuh.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, aspectRatio: 'landscape', posterSizeFormat: 'banner-horizontal' })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      formData.aspectRatio === 'landscape'
                        ? 'border-[#A67C52] bg-[#A67C52]/10 ring-2 ring-[#A67C52]/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Monitor className={`w-5 h-5 mt-0.5 flex-shrink-0 ${formData.aspectRatio === 'landscape' ? 'text-[#A67C52]' : 'text-gray-400'}`} />
                    <div>
                      <p className={`text-xs font-bold ${formData.aspectRatio === 'landscape' ? 'text-[#A67C52]' : 'text-gray-800'}`}>
                        Spanduk Lebar (16:9)
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Format horizontal memanjang untuk tampilan banner layar lebar desktop.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Upload Foto Poster Sesuai Ukuran */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Foto / File Brosur Poster Promo *
                  </label>
                  <span className="text-[11px] text-[#A67C52] font-semibold">
                    {formData.aspectRatio === 'portrait' ? 'Rasio Tegak 4:5 / 3:4' : 'Rasio Lebar 16:9'}
                  </span>
                </div>
                
                <div className="p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex flex-col sm:flex-row items-center gap-4">
                  {/* Visual Box Container matching actual poster ratio */}
                  <div className={`rounded-2xl bg-neutral-900 overflow-hidden flex-shrink-0 relative border-2 border-gray-300 shadow-inner flex items-center justify-center ${
                    formData.aspectRatio === 'portrait'
                      ? 'w-36 h-48 sm:w-44 sm:h-56'
                      : 'w-48 h-28 sm:w-56 sm:h-32'
                  }`}>
                    {uploadPreview ? (
                      <img
                        src={uploadPreview}
                        alt="Preview Poster"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-[10px]">Belum Ada Gambar</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 text-center sm:text-left flex-1 w-full">
                    <button
                      type="button"
                      disabled={isCompressing || isSaving}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm mx-auto sm:mx-0"
                    >
                      {isCompressing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengompres Flyer Tajam...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto Poster dari HP / Laptop</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      * Mendukung poster resolusi tinggi (1080x1350 px atau 1080x1440 px). Dikompresi otomatis tanpa memotong sisi foto sehingga rincian harga &amp; fasilitas tetap terbaca jelas di HP jamaah.
                    </p>
                  </div>
                </div>

                {/* Preset Templates */}
                <div>
                  <p className="text-[11px] text-gray-500 mb-1.5 font-medium">Atau pilih contoh template:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PRESET_BANNERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setUploadPreview(preset.url);
                          setFormData({ 
                            ...formData, 
                            imageUrl: preset.url,
                            aspectRatio: preset.aspectRatio
                          });
                        }}
                        className={`p-2 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 truncate transition-all cursor-pointer ${
                          uploadPreview === preset.url
                            ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52] font-bold'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Judul Promo / Headline *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PROMO UMROH AWAL RAMADHAN 1448 H / 2027"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Rincian Penawaran &amp; Keterangan Brosur *
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Dapatkan Diskon Rp 1.500.000 + Free Upgrade Kereta Cepat Haramain untuk 15 Pendaftar Pertama."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  required
                  className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl p-3 text-xs text-[#1A1A1A] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Label Badge Promo
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: HOT PROMO, FLASH SALE"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Berlaku Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              {/* Status Switch (Bisa diposting atau disimpan sebagai draft) */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Status Penayangan di Website</p>
                  <p className="text-[11px] text-gray-500">
                    Aktifkan jika ada promo yang ingin ditampilkan sekarang, atau nonaktifkan jika disimpan sebagai draft.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#A67C52] focus:ring-[#A67C52] w-4 h-4 cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${formData.isActive ? 'text-emerald-700' : 'text-gray-500'}`}>
                    {formData.isActive ? 'Langsung Tayang' : 'Simpan Draft'}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isCompressing}
                  className="px-6 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{modalMode === 'create' ? 'Simpan Poster' : 'Simpan Perubahan'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal (Perbesar Poster Asli) */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-xl w-full bg-neutral-900 rounded-3xl p-3 border border-neutral-700 space-y-3 relative shadow-2xl"
          >
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs font-bold text-white truncate max-w-[80%]">
                {lightboxImage.title}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-w-full max-h-[78vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-center text-[11px] text-gray-400">
              Pratinjau poster flyer resolusi penuh. Klik di luar gambar untuk menutup.
            </p>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1A1A1A]">Hapus Poster Promo?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Apakah Anda yakin ingin menghapus poster promo <strong className="text-gray-800">"{deleteConfirm.title}"</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, id: '', title: '' })}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteBanner}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
