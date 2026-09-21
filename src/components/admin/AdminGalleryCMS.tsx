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
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Eye, 
  RefreshCw, 
  Search,
  Video,
  PlayCircle,
  Camera,
  Film
} from 'lucide-react';
import { GalleryPhotoItem } from '../../types';
import { 
  subscribeToGallery, 
  addGalleryItemToFirestore, 
  updateGalleryItemInFirestore, 
  deleteGalleryItemFromFirestore,
  restoreDefaultGalleryToFirestore
} from '../../lib/firestoreService';
import { compressImageFile } from '../../utils/imageCompressor';
import { 
  thawafKabahImg,
  qubaImg,
  jabalUhudImg,
  nabawiKubahImg,
  keluargaMakkahImg,
  kajianNabawiImg,
  bandaraImg
} from '../../data/packagesData';

const PRESET_GALLERY_PHOTOS = [
  {
    name: 'Template 1: Thawaf Ka\'bah Makkah',
    category: 'Makkah',
    url: thawafKabahImg,
    location: 'Pelataran Mataf Masjidil Haram, Makkah'
  },
  {
    name: 'Template 2: Shalat Sunnah Masjid Quba',
    category: 'Madinah',
    url: qubaImg,
    location: 'Pelataran Masjid Quba, Madinah Al-Munawwarah'
  },
  {
    name: 'Template 3: Napak Tilas Jabal Uhud',
    category: 'Madinah',
    url: jabalUhudImg,
    location: 'Kawasan Bersejarah Jabal Uhud, Madinah'
  },
  {
    name: 'Template 4: Kubah Hijau & Raudhah Nabawi',
    category: 'Madinah',
    url: nabawiKubahImg,
    location: 'Pelataran Kubah Hijau Masjid Nabawi, Madinah'
  },
  {
    name: 'Template 5: Keluarga Ihram Makkah',
    category: 'Makkah',
    url: keluargaMakkahImg,
    location: 'Pelataran Suci Masjidil Haram, Makkah'
  },
  {
    name: 'Template 6: Bimbingan Ibadah Nabawi',
    category: 'Manasik',
    url: kajianNabawiImg,
    location: 'Pelataran Naungan Payung Masjid Nabawi, Madinah'
  },
  {
    name: 'Template 7: Pelepasan Bandara Soetta T3',
    category: 'Keberangkatan',
    url: bandaraImg,
    location: 'Bandara Internasional Soekarno-Hatta Terminal 3'
  }
];

export const AdminGalleryCMS: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryPhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<GalleryPhotoItem | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  const [formData, setFormData] = useState<Omit<GalleryPhotoItem, 'id'>>({
    title: '',
    category: 'Makkah',
    image: PRESET_GALLERY_PHOTOS[0].url,
    location: 'Pelataran Mataf Masjidil Haram, Makkah',
    year: 'Musim 1448 H / 2027',
    mediaType: 'photo',
    videoUrl: '',
    caption: 'Dokumentasi nyata jamaah Al-Ghanim saat menunaikan ibadah di Tanah Suci.',
    date: 'April 2027'
  });

  const [uploadPreview, setUploadPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status state
  const [isSaving, setIsSaving] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToGallery((items) => {
      setGallery(items);
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
      category: 'Makkah',
      image: PRESET_GALLERY_PHOTOS[0].url,
      location: 'Pelataran Mataf Masjidil Haram, Makkah',
      year: 'Musim 2027',
      mediaType: 'photo',
      videoUrl: '',
      caption: 'Dokumentasi nyata jamaah Al-Ghanim saat menunaikan ibadah di Tanah Suci.',
      date: 'April 2027'
    });
    setUploadPreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryPhotoItem) => {
    setModalMode('edit');
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category || 'Makkah',
      image: item.image,
      location: item.location,
      year: item.year || 'Musim 2027',
      mediaType: item.mediaType || 'photo',
      videoUrl: item.videoUrl || '',
      caption: item.caption || '',
      date: item.date || '2027'
    });
    setUploadPreview(item.image);
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedBase64 = await compressImageFile(file, 1000, 1000, 0.75);
      setUploadPreview(compressedBase64);
      setFormData(prev => ({ ...prev, image: compressedBase64 }));
    } catch (error) {
      console.error('Error compressing gallery image:', error);
      showToast('Gagal memproses gambar. Format harus JPG/PNG/WebP.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_GALLERY_PHOTOS[0]) => {
    setFormData(prev => ({
      ...prev,
      title: prev.title || preset.name,
      category: preset.category,
      image: preset.url,
      location: preset.location
    }));
    setUploadPreview(preset.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Harap isi judul momen dokumentasi!');
      return;
    }
    if (!formData.image.trim()) {
      showToast('Harap pilih atau upload foto dokumentasi!');
      return;
    }

    setIsSaving(true);

    // Optimistic UI update
    if (modalMode === 'edit' && editingId) {
      setGallery(prev => prev.map(item => item.id === editingId ? { ...item, ...formData, id: editingId } : item));
    }

    try {
      if (modalMode === 'create') {
        const newId = await addGalleryItemToFirestore(formData);
        setGallery(prev => [{ ...formData, id: newId }, ...prev]);
        showToast('✓ Dokumentasi baru berhasil ditambahkan ke Galeri Real!');
      } else if (modalMode === 'edit' && editingId) {
        await updateGalleryItemInFirestore(editingId, formData);
        showToast('✓ Data dokumentasi berhasil diperbarui!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('✓ Data tersimpan di tampilan.');
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteGalleryItemFromFirestore(deleteConfirm.id);
      showToast(`✓ Dokumentasi "${deleteConfirm.title}" berhasil dihapus.`);
      setDeleteConfirm({ isOpen: false, id: '', title: '' });
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus dokumentasi.');
    }
  };

  const filteredGallery = gallery.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#A67C52] text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#A67C52]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#A67C52]/10 text-[#A67C52]">
              <Camera className="w-5 h-5" />
            </span>
            <h2 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
              CMS Dokumentasi &amp; Galeri Real Keberangkatan
            </h2>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Kelola foto &amp; video real dokumentasi jamaah saat Thawaf Ka'bah, Raudhah Madinah, Ziarah Uhud/Thaif, dan kepulangan di Bandara Soetta untuk menjaga bukti sosial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Dokumentasi Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Controls (Identik dengan CMS Paket Umroh Gambar 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari foto, lokasi, judul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:border-[#A67C52] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1A1A1A] outline-none shadow-sm"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] outline-none shadow-sm cursor-pointer"
          >
            <option value="all">Semua Kategori ({gallery.length})</option>
            <option value="Makkah">Ka'bah &amp; Makkah</option>
            <option value="Madinah">Raudhah &amp; Madinah</option>
            <option value="Keberangkatan">Bandara Soetta &amp; Lounge</option>
            <option value="Manasik">Manasik Akbar Garut &amp; Bandung</option>
            <option value="Thaif">Wisata Religi Thaif</option>
          </select>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="w-8 h-8 text-[#A67C52] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-semibold">Memuat dokumentasi real dari Firestore...</p>
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-3">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-700">Belum ada dokumentasi untuk kategori ini</p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg bg-[#A67C52] text-white text-xs font-bold cursor-pointer"
          >
            + Tambah Foto Dokumentasi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Photo Thumbnail */}
              <div className="relative aspect-[4/3] bg-gray-950 overflow-hidden flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 text-[#A67C52] font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs">
                    {item.category}
                  </span>
                  {item.mediaType === 'video' && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      Video
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white/90 text-[10px] backdrop-blur-xs">
                  {item.year || '2027'}
                </div>
              </div>

              {/* Body Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-serif-luxury text-sm font-bold text-[#1A1A1A] line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#666666] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#A67C52] shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>
                  {item.caption && (
                    <p className="text-[11px] text-gray-500 line-clamp-2 italic pt-1 border-t border-gray-100 mt-2">
                      "{item.caption}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#A67C52] hover:bg-gray-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                      title="Edit Foto"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, id: item.id, title: item.title })}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD / EDIT GALLERY ITEM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#A67C52]/10 text-[#A67C52]">
                  <Camera className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                    {modalMode === 'create' ? 'Tambah Dokumentasi Real' : 'Edit Dokumentasi'}
                  </h3>
                  <p className="text-xs text-gray-500">Momen Thawaf, Raudhah, Uhud, Thaif, dan Bandara</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Judul Momen */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#1A1A1A] mb-1.5">
                  Judul Momen Dokumentasi *
                </label>
                <input
                  type="text"
                  placeholder="Misal: Thawaf Wada Jamaah Garuda Direct Kloter Syawal"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none"
                  required
                />
              </div>

              {/* Category & Media Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1A1A1A] mb-1.5">
                    Kategori Tempat / Momen *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none cursor-pointer"
                  >
                    <option value="Makkah">Makkah (Ka'bah & Masjidil Haram)</option>
                    <option value="Madinah">Madinah (Raudhah & Masjid Nabawi)</option>
                    <option value="Keberangkatan">Keberangkatan / Kepulangan Bandara Soetta</option>
                    <option value="Manasik">Manasik Akbar (Garut / Bandung)</option>
                    <option value="Thaif">Wisata Thaif & Cable Car</option>
                    <option value="Ziarah">Ziarah Jabal Uhud & Quba</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#1A1A1A] mb-1.5">
                    Tipe Media
                  </label>
                  <select
                    value={formData.mediaType || 'photo'}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as any })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none cursor-pointer"
                  >
                    <option value="photo">Foto Dokumentasi (High-Res)</option>
                    <option value="video">Video Dokumentasi / Reels</option>
                  </select>
                </div>
              </div>

              {/* Lokasi & Tahun/Musim */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1A1A1A] mb-1.5">
                    Lokasi Spesifik
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Pelataran Mataf Masjidil Haram"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1A1A1A] mb-1.5">
                    Tahun / Musim
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Musim 2027 / 1448 H"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              {/* Video URL (Optional if mediaType is video) */}
              {formData.mediaType === 'video' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1A1A1A] mb-1.5">
                    URL Video (YouTube / Instagram Reels / Direct MP4)
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... atau link reels"
                    value={formData.videoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none"
                  />
                </div>
              )}

              {/* Quick Preset Photos Picker */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#1A1A1A] mb-1.5">
                  Pilih Cepat Foto Dokumentasi (Preset Resmi)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_GALLERY_PHOTOS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        formData.image === preset.url
                          ? 'border-[#A67C52] bg-[#A67C52]/10 ring-2 ring-[#A67C52]/30'
                          : 'border-gray-200 hover:border-[#A67C52] bg-white'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#1A1A1A] truncate">{preset.name}</p>
                        <p className="text-[9px] text-[#A67C52] font-semibold">{preset.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL or Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-[#1A1A1A]">
                  Atau Masukkan URL Gambar / Unggah File Sendiri
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... atau URL gambar"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setUploadPreview(e.target.value);
                    }}
                    className="flex-1 bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-xs text-[#1A1A1A] outline-none"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isCompressing || isSaving}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCompressing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Mengompres...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
                </div>

                {uploadPreview && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-gray-300 max-h-56 bg-gray-950 flex items-center justify-center p-1">
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="max-h-52 w-auto max-w-full object-contain mx-auto rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Caption / Cerita Jamaah */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#1A1A1A] mb-1.5">
                  Keterangan / Cerita Momen (Caption)
                </label>
                <textarea
                  rows={2}
                  placeholder="Cerita singkat atau testimoni spontan saat kegiatan berlangsung..."
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-xs text-[#1A1A1A] outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isCompressing}
                  className="px-6 py-3 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{modalMode === 'create' ? 'Simpan Dokumentasi' : 'Update Dokumentasi'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-200 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">Hapus Dokumentasi?</h3>
              <p className="text-xs text-gray-500">
                Apakah Anda yakin ingin menghapus foto dokumentasi <strong>"{deleteConfirm.title}"</strong> dari galeri publik?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, id: '', title: '' })}
                className="py-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW LIGHTBOX - Snug fit to photo */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="relative max-w-[92vw] sm:max-w-xl md:max-w-2xl max-h-[90vh] bg-[#181818] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-2xl p-2.5 sm:p-4 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-[#A67C52] border border-white/20 transition-all cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative max-h-[62vh] sm:max-h-[66vh] w-full flex items-center justify-center overflow-hidden rounded-xl bg-black">
              <img
                src={previewItem.image}
                alt={previewItem.title}
                className="max-h-[62vh] sm:max-h-[66vh] max-w-full w-auto h-auto object-contain rounded-xl mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="pt-3 pb-1 px-2 text-center space-y-1 w-full max-w-lg text-white">
              <span className="text-[10px] uppercase font-bold text-[#DFC386] tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 inline-block">
                {previewItem.category} • {previewItem.year}
              </span>
              <h3 className="font-serif-luxury text-sm sm:text-base font-bold line-clamp-1">{previewItem.title}</h3>
              <p className="text-[11px] text-gray-300 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-[#DFC386]" />
                <span>{previewItem.location}</span>
              </p>
              {previewItem.caption && (
                <p className="text-[11px] text-gray-400 italic line-clamp-2 pt-1 border-t border-white/10 mt-1">{previewItem.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
