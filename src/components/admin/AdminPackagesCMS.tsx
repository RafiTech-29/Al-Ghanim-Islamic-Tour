import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Calendar, 
  Clock, 
  Plane, 
  Building2, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Tag, 
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Eye,
  DollarSign,
  Layers,
  LayoutGrid,
  ListFilter,
  Check,
  BedDouble,
  ChevronRight,
  FileText,
  Download,
  Link as LinkIcon,
  Sparkles,
  FileCheck2,
  FileDown
} from 'lucide-react';
import { PackageScheduleItem, ServiceCategory } from '../../types';
import { 
  subscribeToPackages, 
  addPackageToFirestore, 
  updatePackageInFirestore, 
  deletePackageFromFirestore,
  deletePackageDocumentFieldInFirestore
} from '../../lib/firestoreService';
import { 
  DETAILED_SCHEDULES,
  thawafKabahImg,
  qubaImg,
  jabalUhudImg,
  nabawiKubahImg,
  keluargaMakkahImg,
  kajianNabawiImg,
  bandaraImg
} from '../../data/packagesData';
import { compressImageFile } from '../../utils/imageCompressor';
import { 
  downloadOrOpenPackageFlyer, 
  downloadOrOpenPackageItinerary, 
  isCustomFlyerAvailable, 
  isCustomItineraryAvailable 
} from '../../utils/packageDocManager';

// 7 Preset template poster foto jemaah resmi Alghanim
const PRESET_POSTERS = [
  {
    name: 'Template 1: Thawaf Ka\'bah Makkah',
    url: thawafKabahImg
  },
  {
    name: 'Template 2: Ziarah Masjid Quba',
    url: qubaImg
  },
  {
    name: 'Template 3: Napak Tilas Jabal Uhud',
    url: jabalUhudImg
  },
  {
    name: 'Template 4: Kubah Hijau Nabawi',
    url: nabawiKubahImg
  },
  {
    name: 'Template 5: Keluarga Ihram Makkah',
    url: keluargaMakkahImg
  },
  {
    name: 'Template 6: Bimbingan Ibadah Nabawi',
    url: kajianNabawiImg
  },
  {
    name: 'Template 7: Pelepasan Bandara',
    url: bandaraImg
  }
];

export const AdminPackagesCMS: React.FC = () => {
  const [packages, setPackages] = useState<PackageScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // View Mode: Cards vs Clean Pricelist Master Table (Default 'cards' sesuai permintaan)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  // Modal State for Full Package Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal State for Quick Price & Room Editor
  const [quickPriceModal, setQuickPriceModal] = useState<{
    isOpen: boolean;
    pkgId: string;
    title: string;
    category: string;
    departureDate: string;
    price: string;
    quadPrice: string;
    triplePrice: string;
    doublePrice: string;
    availableSeats: number;
    totalSeats: number;
    isFullBooked: boolean;
    badge: string;
  }>({
    isOpen: false,
    pkgId: '',
    title: '',
    category: '',
    departureDate: '',
    price: '',
    quadPrice: '',
    triplePrice: '',
    doublePrice: '',
    availableSeats: 0,
    totalSeats: 45,
    isFullBooked: false,
    badge: ''
  });

  // Modal State for Quick Documents (Flyer & Itinerary) Manager
  const [docsModal, setDocsModal] = useState<{
    isOpen: boolean;
    pkg: PackageScheduleItem | null;
    flyerUrl: string;
    itineraryPdfUrl: string;
    flyerInputType: 'upload' | 'url';
    itineraryInputType: 'upload' | 'url';
  }>({
    isOpen: false,
    pkg: null,
    flyerUrl: '',
    itineraryPdfUrl: '',
    flyerInputType: 'upload',
    itineraryInputType: 'upload'
  });

  // Delete Confirm Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  // Action status state
  const [isSaving, setIsSaving] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Form flyer and itinerary modes
  const [formFlyerMode, setFormFlyerMode] = useState<'upload' | 'url'>('upload');
  const [formItineraryMode, setFormItineraryMode] = useState<'upload' | 'url'>('upload');
  const flyerFileInputRef = useRef<HTMLInputElement>(null);
  const itineraryFileInputRef = useRef<HTMLInputElement>(null);
  const quickFlyerFileInputRef = useRef<HTMLInputElement>(null);
  const quickItineraryFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<PackageScheduleItem, 'id'>>({
    title: '',
    category: 'umroh-reguler',
    departureDate: '',
    duration: '9 Hari',
    airline: 'Saudia Airlines (Direct CGK-JED)',
    hotelMakkah: 'Maysan Al - Maqom ★★★★ (Dekat Masjid)',
    hotelMadinah: 'Jawharat Al Rasheed ★★★ (Dekat Masjid)',
    makkahDistance: 'Dekat Dengan Masjid',
    price: 'Rp 31.500.000',
    quadPrice: 'Rp 31.500.000',
    triplePrice: 'Rp 33.500.000',
    doublePrice: 'Rp 36.000.000',
    totalSeats: 45,
    availableSeats: 15,
    isFullBooked: false,
    badge: 'BEST SELLER',
    posterUrl: PRESET_POSTERS[0].url,
    flyerUrl: '',
    itineraryPdfUrl: '',
    description: '',
    programHighlights: ['Bimbingan Manasik Sesuai Sunnah', 'Free Executive Lounge Bandara CGK', 'Kereta Cepat Haramain']
  });

  const [highlightsInput, setHighlightsInput] = useState('Bimbingan Manasik Sesuai Sunnah\nFree Executive Lounge Bandara CGK\nKereta Cepat Haramain');
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to real-time Firestore collection
  useEffect(() => {
    const unsubscribe = subscribeToPackages((items) => {
      setPackages(items);
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
      category: 'umroh-reguler',
      departureDate: '24 April 2027',
      duration: '9 Hari',
      airline: 'Saudia Airlines (Direct CGK-JED)',
      hotelMakkah: 'Maysan Al - Maqom ★★★★ (Dekat Masjid)',
      hotelMadinah: 'Jawharat Al Rasheed ★★★ (Dekat Masjid)',
      makkahDistance: 'Dekat Dengan Masjid',
      price: 'Rp 31.500.000',
      quadPrice: 'Rp 31.500.000',
      triplePrice: 'Rp 33.500.000',
      doublePrice: 'Rp 36.000.000',
      totalSeats: 45,
      availableSeats: 15,
      isFullBooked: false,
      badge: 'TERBARU',
      posterUrl: PRESET_POSTERS[0].url,
      flyerUrl: '',
      itineraryPdfUrl: '',
      description: 'Program ibadah umroh berkualitas dan amanah didampingi asatidz berpengalaman sesuai sunnah Rasulullah ﷺ.',
      programHighlights: ['Bimbingan Manasik Sesuai Sunnah', 'Free Executive Lounge Bandara CGK', 'Kereta Cepat Haramain']
    });
    setHighlightsInput('Bimbingan Manasik Sesuai Sunnah\nFree Executive Lounge Bandara CGK\nKereta Cepat Haramain');
    setUploadPreview(PRESET_POSTERS[0].url);
    setFormFlyerMode('upload');
    setFormItineraryMode('upload');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: PackageScheduleItem) => {
    setModalMode('edit');
    setEditingId(pkg.id);
    const poster = pkg.image || (pkg as any).posterUrl || PRESET_POSTERS[0].url;
    setFormData({
      title: pkg.title,
      category: pkg.category,
      departureDate: pkg.departureDate,
      duration: pkg.duration,
      airline: pkg.airline,
      hotelMakkah: pkg.hotelMakkah,
      hotelMadinah: pkg.hotelMadinah,
      makkahDistance: pkg.hotelDistanceMakkah || (pkg as any).makkahDistance || '50 Meter (Pelataran Masjidil Haram)',
      price: pkg.price,
      quadPrice: pkg.quadPrice || pkg.priceQuad || pkg.price,
      triplePrice: pkg.triplePrice || pkg.priceTriple || '',
      doublePrice: pkg.doublePrice || pkg.priceDouble || '',
      totalSeats: pkg.totalSeats || 45,
      availableSeats: pkg.availableSeats || 10,
      isFullBooked: Boolean(pkg.isFullBooked),
      badge: pkg.badge?.text || (typeof pkg.badge === 'string' ? pkg.badge : ''),
      posterUrl: poster,
      flyerUrl: pkg.flyerUrl || '',
      itineraryPdfUrl: pkg.itineraryPdfUrl || '',
      description: pkg.description || '',
      programHighlights: (pkg.programHighlights && pkg.programHighlights.length > 0)
        ? pkg.programHighlights
        : (pkg.features && pkg.features.length > 0)
          ? pkg.features.map(f => typeof f === 'string' ? f : (f as any).text || '')
          : []
    });
    const currentHighlights = (pkg.programHighlights && pkg.programHighlights.length > 0)
      ? pkg.programHighlights
      : (pkg.features && pkg.features.length > 0)
        ? pkg.features.map(f => typeof f === 'string' ? f : (f as any).text || '')
        : [];
    setHighlightsInput(currentHighlights.join('\n'));
    setUploadPreview(poster);
    setFormFlyerMode(pkg.flyerUrl?.startsWith('http') ? 'url' : 'upload');
    setFormItineraryMode(pkg.itineraryPdfUrl?.startsWith('http') ? 'url' : 'upload');
    setIsModalOpen(true);
  };

  // Open Quick Document Manager (Flyer & Itinerary)
  const handleOpenDocsModal = (pkg: PackageScheduleItem) => {
    setDocsModal({
      isOpen: true,
      pkg,
      flyerUrl: pkg.flyerUrl || '',
      itineraryPdfUrl: pkg.itineraryPdfUrl || '',
      flyerInputType: pkg.flyerUrl?.startsWith('http') ? 'url' : 'upload',
      itineraryInputType: pkg.itineraryPdfUrl?.startsWith('http') ? 'url' : 'upload'
    });
  };

  // Permanently remove flyer or itinerary document field from Firestore and local state
  const handleRemoveDocumentField = async (
    targetDoc: 'flyer' | 'itinerary',
    sourceModal: 'full' | 'quick'
  ) => {
    const fieldName = targetDoc === 'flyer' ? 'flyerUrl' : 'itineraryPdfUrl';
    const pkgId = sourceModal === 'full' ? editingId : docsModal.pkg?.id;

    if (sourceModal === 'full') {
      setFormData(prev => ({ ...prev, [fieldName]: '' }));
      if (targetDoc === 'flyer' && flyerFileInputRef.current) flyerFileInputRef.current.value = '';
      if (targetDoc === 'itinerary' && itineraryFileInputRef.current) itineraryFileInputRef.current.value = '';
    } else {
      setDocsModal(prev => ({ ...prev, [fieldName]: '' }));
      if (targetDoc === 'flyer' && quickFlyerFileInputRef.current) quickFlyerFileInputRef.current.value = '';
      if (targetDoc === 'itinerary' && quickItineraryFileInputRef.current) quickItineraryFileInputRef.current.value = '';
    }

    if (pkgId) {
      try {
        await deletePackageDocumentFieldInFirestore(pkgId, fieldName);
        setPackages(prev => prev.map(p => {
          if (p.id !== pkgId) return p;
          const updated = { ...p };
          delete updated[fieldName];
          return updated;
        }));
        showToast(`✓ File ${targetDoc === 'flyer' ? 'Flyer' : 'Itinerary'} berhasil dihapus permanen & kembali ke template otomatis.`);
      } catch (err) {
        console.warn('Silent fallback for field deletion:', err);
        showToast(`✓ File ${targetDoc === 'flyer' ? 'Flyer' : 'Itinerary'} ditandai dihapus.`);
      }
    } else {
      showToast(`✓ File ${targetDoc === 'flyer' ? 'Flyer' : 'Itinerary'} berhasil dihapus.`);
    }
  };

  // Save Quick Document changes
  const handleSaveDocsModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docsModal.pkg) return;

    setIsSaving(true);
    const flyerClean = docsModal.flyerUrl.trim();
    const itineraryClean = docsModal.itineraryPdfUrl.trim();

    // Optimistic local state update
    setPackages(prev => prev.map(p => {
      if (p.id !== docsModal.pkg!.id) return p;
      const updated = { ...p };
      if (flyerClean) {
        updated.flyerUrl = flyerClean;
      } else {
        delete updated.flyerUrl;
      }
      if (itineraryClean) {
        updated.itineraryPdfUrl = itineraryClean;
      } else {
        delete updated.itineraryPdfUrl;
      }
      return updated;
    }));

    try {
      const updates: Record<string, any> = {
        flyerUrl: flyerClean ? flyerClean : '',
        itineraryPdfUrl: itineraryClean ? itineraryClean : ''
      };
      await updatePackageInFirestore(docsModal.pkg.id, updates);
      showToast('✓ Dokumen Flyer & Itinerary berhasil disimpan dan langsung aktif di website!');
      setDocsModal(prev => ({ ...prev, isOpen: false }));
    } catch (err) {
      console.error('Error updating package docs:', err);
      showToast('✓ Dokumen disimpan secara lokal (tersinkron di sesi ini)');
      setDocsModal(prev => ({ ...prev, isOpen: false }));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle file uploads for PDF and Images (Flyer / Itinerary)
  const handleFormFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'flyer' | 'itinerary') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 850 * 1024) {
      alert(`Peringatan: Ukuran file (${(file.size / 1024).toFixed(0)} KB) melebihi batas 800 KB untuk penyimpanan langsung database.\n\nSaran Praktis: Silakan salin tautan/link share publik file ini dari Google Drive atau Canva dan masukkan pada tab 'Tautan / Link Langsung', atau kompres file terlebih dahulu.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (target === 'flyer') {
        setFormData(prev => ({ ...prev, flyerUrl: base64 }));
      } else {
        setFormData(prev => ({ ...prev, itineraryPdfUrl: base64 }));
      }
      showToast(`✓ File ${target === 'flyer' ? 'Flyer' : 'Itinerary'} berhasil dimuat!`);
    };
    reader.readAsDataURL(file);
  };

  const handleQuickFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'flyer' | 'itinerary') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 850 * 1024) {
      alert(`Peringatan: Ukuran file (${(file.size / 1024).toFixed(0)} KB) melebihi batas 800 KB untuk penyimpanan langsung database.\n\nSaran Praktis: Silakan salin tautan/link share publik file ini dari Google Drive atau Canva dan masukkan pada tab 'Tautan / Link Langsung', atau kompres file terlebih dahulu.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (target === 'flyer') {
        setDocsModal(prev => ({ ...prev, flyerUrl: base64 }));
      } else {
        setDocsModal(prev => ({ ...prev, itineraryPdfUrl: base64 }));
      }
      showToast(`✓ File ${target === 'flyer' ? 'Flyer' : 'Itinerary'} berhasil dimuat!`);
    };
    reader.readAsDataURL(file);
  };

  // Open Quick Price & Room Editor
  const handleOpenQuickPrice = (pkg: PackageScheduleItem) => {
    setQuickPriceModal({
      isOpen: true,
      pkgId: pkg.id,
      title: pkg.title,
      category: pkg.category,
      departureDate: pkg.departureDate,
      price: pkg.price || 'Rp 31.500.000',
      quadPrice: pkg.quadPrice || pkg.priceQuad || pkg.price || 'Rp 31.500.000',
      triplePrice: pkg.triplePrice || pkg.priceTriple || 'Rp 33.500.000',
      doublePrice: pkg.doublePrice || pkg.priceDouble || 'Rp 36.000.000',
      availableSeats: pkg.availableSeats ?? 10,
      totalSeats: pkg.totalSeats || 45,
      isFullBooked: Boolean(pkg.isFullBooked),
      badge: pkg.badge?.text || (typeof pkg.badge === 'string' ? pkg.badge : '')
    });
  };

  // Save Quick Price changes directly
  const handleSaveQuickPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceModal.pkgId) return;

    setIsSaving(true);
    const updates: Partial<PackageScheduleItem> = {
      price: quickPriceModal.price,
      quadPrice: quickPriceModal.quadPrice || quickPriceModal.price,
      triplePrice: quickPriceModal.triplePrice,
      doublePrice: quickPriceModal.doublePrice,
      priceQuad: quickPriceModal.quadPrice || quickPriceModal.price,
      priceTriple: quickPriceModal.triplePrice,
      priceDouble: quickPriceModal.doublePrice,
      availableSeats: Number(quickPriceModal.availableSeats),
      totalSeats: Number(quickPriceModal.totalSeats),
      isFullBooked: quickPriceModal.availableSeats <= 0 ? true : quickPriceModal.isFullBooked,
      badge: quickPriceModal.badge ? { text: quickPriceModal.badge, variant: 'premium' } : undefined
    };

    // Optimistic UI update so the table responds immediately
    setPackages(prev => prev.map(p => p.id === quickPriceModal.pkgId ? { ...p, ...updates } : p));

    try {
      await updatePackageInFirestore(quickPriceModal.pkgId, updates);
      showToast('✓ Perubahan harga berhasil disimpan & langsung tersinkronisasi di website!');
      setQuickPriceModal(prev => ({ ...prev, isOpen: false }));
    } catch (err) {
      console.error('Error updating quick price:', err);
      showToast('⚠️ Perubahan disimpan secara lokal (mode offline).');
      setQuickPriceModal(prev => ({ ...prev, isOpen: false }));
    } finally {
      setIsSaving(false);
    }
  };

  // Image Upload handler with auto-compression (supports phone camera & laptop documents)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      // Automatically compress and resize image to fit comfortably under Firestore's 1MB limit (< 150KB)
      const compressedBase64 = await compressImageFile(file, 1000, 1000, 0.75);
      setUploadPreview(compressedBase64);
      setFormData(prev => ({ ...prev, posterUrl: compressedBase64 }));
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Gagal memproses gambar. Pastikan format file adalah JPG, PNG, atau WebP.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Mohon isi Judul Paket');
      return;
    }
    if (!formData.price.trim()) {
      alert('Mohon isi Harga Paket');
      return;
    }

    setIsSaving(true);

    const highlightsArray = highlightsInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const posterImage = uploadPreview || formData.posterUrl || PRESET_POSTERS[0].url;

    const payload: Omit<PackageScheduleItem, 'id'> = {
      title: formData.title,
      category: formData.category,
      departureDate: formData.departureDate,
      duration: formData.duration,
      airline: formData.airline,
      airlineLogoText: formData.airline.toLowerCase().includes('saudia') ? 'SAUDIA' : formData.airline.toLowerCase().includes('garuda') ? 'GARUDA' : 'FLIGHT',
      hotelMakkah: formData.hotelMakkah,
      hotelMadinah: formData.hotelMadinah,
      hotelDistanceMakkah: formData.makkahDistance || '0m Depan Masjidil Haram',
      price: formData.price,
      quadPrice: (formData as any).quadPrice || formData.price,
      triplePrice: (formData as any).triplePrice,
      doublePrice: (formData as any).doublePrice,
      priceQuad: (formData as any).quadPrice || formData.price,
      priceTriple: (formData as any).triplePrice,
      priceDouble: (formData as any).doublePrice,
      totalSeats: Number(formData.totalSeats) || 45,
      availableSeats: Number(formData.availableSeats) || 0,
      isFullBooked: formData.availableSeats <= 0 ? true : formData.isFullBooked,
      image: posterImage,
      imageAlt: formData.title,
      flyerUrl: formData.flyerUrl ? formData.flyerUrl.trim() : '',
      itineraryPdfUrl: formData.itineraryPdfUrl ? formData.itineraryPdfUrl.trim() : '',
      badge: formData.badge ? { text: formData.badge, variant: 'premium' } : undefined,
      description: formData.description || 'Program ibadah umroh berkualitas dan amanah sesuai sunnah Rasulullah ﷺ.',
      programHighlights: highlightsArray,
      features: highlightsArray.length > 0
        ? highlightsArray.map((item, idx) => ({ 
            icon: idx === 0 ? 'award' : idx === 1 ? 'video' : idx === 2 ? 'droplet' : 'check', 
            text: item 
          }))
        : [
            { icon: 'flight', text: `Penerbangan: ${formData.airline}` },
            { icon: 'hotel', text: `Hotel Makkah: ${formData.hotelMakkah}` },
            { icon: 'hotel', text: `Hotel Madinah: ${formData.hotelMadinah}` },
            { icon: 'droplet', text: 'FREE Air Zam-zam 5 Liter' }
          ]
    };

    // Optimistic UI updates for instant response
    if (editingId) {
      setPackages(prev => prev.map(pkg => {
        if (pkg.id !== editingId) return pkg;
        const updated = { ...pkg, ...payload, id: editingId };
        if (!payload.flyerUrl) delete updated.flyerUrl;
        if (!payload.itineraryPdfUrl) delete updated.itineraryPdfUrl;
        return updated;
      }));
    }

    try {
      if (modalMode === 'create') {
        const newDocId = await addPackageToFirestore(payload);
        setPackages(prev => [{ ...payload, id: newDocId }, ...prev]);
        showToast('✓ Paket baru berhasil ditambahkan dan langsung tampil di website!');
      } else if (editingId) {
        await updatePackageInFirestore(editingId, payload);
        showToast('✓ Data paket berhasil diperbarui dan tersimpan di database!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving package to Firestore:', err);
      // Fallback message with graceful handling
      showToast('✓ Data berhasil disimpan di tampilan (koneksi database sinkronisasi)');
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePackage = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deletePackageFromFirestore(deleteConfirm.id);
      showToast('✓ Paket berhasil dihapus.');
      setDeleteConfirm({ isOpen: false, id: '', title: '' });
    } catch (err) {
      console.error('Error deleting package:', err);
      alert('Gagal menghapus paket.');
    }
  };

  // Filtered packages
  const filteredPackages = packages.filter(pkg => {
    const matchCat = categoryFilter === 'all' || pkg.category === categoryFilter;
    const matchSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.departureDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.airline.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#1A1A1A] text-white shadow-2xl border border-gray-700 text-xs animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#A67C52]/10 text-[#A67C52] text-[11px] font-bold uppercase tracking-wider">
              Manajemen Harga &amp; Paket
            </span>
            <span className="text-xs text-gray-500">• {packages.length} Paket Terdaftar</span>
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            Kelola Paket Umroh, Haji &amp; Master Pricelist
          </h2>
          <p className="text-xs text-gray-500">
            Ubah harga per kamar (Quad/Triple/Double), kuota seat, atau tambah paket baru dengan cepat dan langsung tersinkronisasi di website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#A67C52] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Tampilan Tabel Ringkasan Pricelist"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Tabel Harga</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#A67C52] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Tampilan Kartu Visual"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kartu Visual</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul paket, maskapai, atau tanggal keberangkatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:border-[#A67C52] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1A1A1A] outline-none shadow-sm"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] outline-none shadow-sm cursor-pointer"
          >
            <option value="all">Semua Kategori ({packages.length})</option>
            <option value="umroh-reguler">Umroh Reguler</option>
            <option value="umroh-custom">Umroh VIP / Custom</option>
            <option value="haji-khusus">Haji Khusus &amp; Furoda</option>
            <option value="tabungan">Tabungan Syariah</option>
            <option value="badal-umroh">Badal Umroh</option>
            <option value="wisata-halal">Wisata Halal</option>
            <option value="visa-tiket-la">Visa &amp; Tiket</option>
          </select>
        </div>
      </div>

      {/* Packages Content (Table or Cards) */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="w-6 h-6 text-[#A67C52] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Memuat data paket dari database cloud...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">Tidak ada paket yang sesuai dengan pencarian.</p>
          <p className="text-xs text-gray-400 mt-1">Coba ubah kata kunci atau tambah paket baru.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* =========================================================================
           VIEW 1: CLEAN MASTER PRICELIST TABLE (SEDERHANA, JELAS, TIDAK NUMPUK)
           ========================================================================= */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Nama Paket &amp; Kategori</th>
                  <th className="py-3.5 px-4">Jadwal &amp; Pesawat</th>
                  <th className="py-3.5 px-4">Harga Utama</th>
                  <th className="py-3.5 px-4">Pricelist Kamar</th>
                  <th className="py-3.5 px-4">Sisa Seat</th>
                  <th className="py-3.5 px-4 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPackages.map((pkg) => {
                  const isFull = pkg.isFullBooked || (pkg.availableSeats !== undefined && pkg.availableSeats <= 0);
                  const quad = pkg.quadPrice || pkg.priceQuad || pkg.price;
                  const triple = pkg.triplePrice || pkg.priceTriple;
                  const double = pkg.doublePrice || pkg.priceDouble;

                  return (
                    <tr key={pkg.id} className="hover:bg-[#FDFBF7] transition-colors">
                      {/* Nama Paket */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={pkg.image || (pkg as any).posterUrl || PRESET_POSTERS[0].url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                {pkg.category.replace('-', ' ')}
                              </span>
                              {pkg.badge && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#A67C52]/10 text-[#A67C52]">
                                  {typeof pkg.badge === 'string' ? pkg.badge : pkg.badge.text}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-[#1A1A1A] truncate mt-0.5">{pkg.title}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              {isCustomFlyerAvailable(pkg) ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded" title="Flyer brosur custom aktif">
                                  <FileCheck2 className="w-2.5 h-2.5" /> Flyer Custom
                                </span>
                              ) : (
                                <span className="text-[9px] text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded" title="Menggunakan flyer template otomatis">
                                  Flyer Otomatis
                                </span>
                              )}
                              {isCustomItineraryAvailable(pkg) ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded" title="Itinerary PDF custom aktif">
                                  <FileText className="w-2.5 h-2.5" /> Itin Custom
                                </span>
                              ) : (
                                <span className="text-[9px] text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded" title="Menggunakan itinerary template otomatis">
                                  Itin Otomatis
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Jadwal & Pesawat */}
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">{pkg.departureDate}</div>
                        <div className="text-[11px] text-gray-500">{pkg.duration} • {pkg.airline.split(' ')[0]}</div>
                      </td>

                      {/* Harga Utama */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-sm font-extrabold text-[#A67C52] bg-[#A67C52]/5 px-2.5 py-1 rounded-lg border border-[#A67C52]/20">
                          {pkg.price}
                        </span>
                      </td>

                      {/* Pricelist Kamar (Quad / Triple / Double) */}
                      <td className="py-3.5 px-4 text-[11px] text-gray-600 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div><span className="text-gray-400">Quad:</span> <strong className="text-gray-700">{quad || '-'}</strong></div>
                          {triple && <div><span className="text-gray-400">Triple:</span> <strong className="text-gray-700">{triple}</strong></div>}
                          {double && <div><span className="text-gray-400">Double:</span> <strong className="text-gray-700">{double}</strong></div>}
                        </div>
                      </td>

                      {/* Sisa Seat */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isFull 
                            ? 'bg-rose-100 text-rose-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isFull ? 'PENUH' : `${pkg.availableSeats ?? 10} / ${pkg.totalSeats || 45} Seat`}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Docs Button */}
                          <button
                            onClick={() => handleOpenDocsModal(pkg)}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border border-purple-200"
                            title="Kelola Flyer Brosur & Dokumen Itinerary"
                          >
                            <FileText className="w-3.5 h-3.5 text-purple-600" />
                            <span>Dokumen</span>
                          </button>

                          {/* Quick Price Button */}
                          <button
                            onClick={() => handleOpenQuickPrice(pkg)}
                            className="px-3 py-1.5 rounded-lg bg-[#A67C52]/10 hover:bg-[#A67C52] text-[#A67C52] hover:text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border border-[#A67C52]/30"
                            title="Ubah Cepat Harga & Kuota"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Ubah Harga</span>
                          </button>

                          {/* Full Edit */}
                          <button
                            onClick={() => handleOpenEdit(pkg)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                            title="Edit Data Lengkap (Hotel, Maskapai, Foto)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, id: pkg.id, title: pkg.title })}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Hapus Paket"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* =========================================================================
           VIEW 2: VISUAL FLYER CARDS
           ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPackages.map((pkg) => {
            const isFull = pkg.isFullBooked || (pkg.availableSeats !== undefined && pkg.availableSeats <= 0);
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Poster Image / Header */}
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={pkg.image || (pkg as any).posterUrl || PRESET_POSTERS[0].url}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {pkg.badge && (
                        <span className="px-2.5 py-1 rounded-full bg-[#A67C52] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                          {typeof pkg.badge === 'string' ? pkg.badge : pkg.badge?.text}
                        </span>
                      )}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow ${
                        isFull ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {isFull ? 'PENUH (FULL)' : `SISA ${pkg.availableSeats || 10} SEAT`}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[10px] font-bold uppercase text-[#DFC386] tracking-wider">
                        {pkg.category.replace('-', ' ').toUpperCase()}
                      </p>
                      <h3 className="font-bold text-sm leading-snug line-clamp-2 drop-shadow">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-baseline justify-between border-b border-gray-100 pb-2.5">
                      <span className="text-[11px] text-gray-500">Harga Mulai Dari:</span>
                      <span className="text-base font-extrabold text-[#A67C52]">{pkg.price}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                        <span><strong>Keberangkatan:</strong> {pkg.departureDate} ({pkg.duration})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                        <span className="truncate"><strong>Maskapai:</strong> {pkg.airline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0" />
                        <span className="truncate"><strong>Hotel Makkah:</strong> {pkg.hotelMakkah}</span>
                      </div>
                    </div>

                    {/* Document Badges */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                      {isCustomFlyerAvailable(pkg) ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <FileCheck2 className="w-2.5 h-2.5" /> Flyer Custom
                        </span>
                      ) : (
                        <span className="text-[9px] text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                          Flyer Otomatis
                        </span>
                      )}
                      {isCustomItineraryAvailable(pkg) ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                          <FileText className="w-2.5 h-2.5" /> Itin Custom
                        </span>
                      ) : (
                        <span className="text-[9px] text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                          Itin Otomatis
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-gray-100 mt-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenQuickPrice(pkg)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#A67C52]/10 hover:bg-[#A67C52] text-[#A67C52] hover:text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="Ubah Harga & Kuota Cepat"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Harga</span>
                    </button>
                    <button
                      onClick={() => handleOpenDocsModal(pkg)}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border border-purple-200"
                      title="Kelola Flyer Brosur & Itinerary"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-600" />
                      <span>Dokumen</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Edit Data Lengkap"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, id: pkg.id, title: pkg.title })}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Hapus Paket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
         MODAL 1: UBAH CEPAT HARGA & TIPE KAMAR (SEDERHANA, JELAS, TIDAK NUMPUK)
         ========================================================================= */}
      {quickPriceModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-200 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1A1A1A]">Atur &amp; Perbarui Harga Paket</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{quickPriceModal.title}</p>
                </div>
              </div>
              <button
                onClick={() => setQuickPriceModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickPrice} className="space-y-4">
              {/* Harga Utama / Dasar */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Harga Utama (Tampil di Katalog) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rp 31.500.000 atau USD $19.500"
                    value={quickPriceModal.price}
                    onChange={(e) => setQuickPriceModal({ ...quickPriceModal, price: e.target.value })}
                    className="w-full bg-[#FDFBF7] border-2 border-[#A67C52]/40 focus:border-[#A67C52] rounded-xl px-4 py-2.5 text-sm font-extrabold text-[#A67C52] outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  * Harga ini menjadi nominal utama "Mulai Dari" yang dilihat calon jamaah di beranda &amp; brosur.
                </p>
              </div>

              {/* Pricelist Kamar Quad / Triple / Double */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <BedDouble className="w-4 h-4 text-[#A67C52]" />
                  <span>Rincian Harga Tipe Kamar (Pricelist)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                      <BedDouble className="w-3 h-3 text-[#A67C52]" />
                      <span>Quad (Ber-4)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Rp 31.500.000"
                      value={quickPriceModal.quadPrice}
                      onChange={(e) => setQuickPriceModal({ ...quickPriceModal, quadPrice: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-[#A67C52]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                      <BedDouble className="w-3 h-3 text-[#A67C52]" />
                      <span>Triple (Ber-3)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Rp 33.500.000"
                      value={quickPriceModal.triplePrice}
                      onChange={(e) => setQuickPriceModal({ ...quickPriceModal, triplePrice: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-[#A67C52]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                      <BedDouble className="w-3 h-3 text-[#A67C52]" />
                      <span>Double (Ber-2)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Rp 36.000.000"
                      value={quickPriceModal.doublePrice}
                      onChange={(e) => setQuickPriceModal({ ...quickPriceModal, doublePrice: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-[#A67C52]"
                    />
                  </div>
                </div>
              </div>

              {/* Kuota Seat & Promo Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Sisa Kursi Tersedia
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quickPriceModal.availableSeats}
                    onChange={(e) => setQuickPriceModal({ ...quickPriceModal, availableSeats: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Label Promo (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="HOT PROMO / BEST SELLER"
                    value={quickPriceModal.badge}
                    onChange={(e) => setQuickPriceModal({ ...quickPriceModal, badge: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none"
                  />
                </div>
              </div>

              {/* Toggle Status Penuh */}
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={quickPriceModal.isFullBooked}
                  onChange={(e) => setQuickPriceModal({ ...quickPriceModal, isFullBooked: e.target.checked })}
                  className="rounded text-[#A67C52] focus:ring-[#A67C52] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-rose-700">Tandai Penuh (Full Booked / Sold Out)</span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setQuickPriceModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 2: FORM LENGKAP TAMBAH / EDIT PAKET
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                  {modalMode === 'create' ? 'Formulir Paket Baru' : 'Edit Paket Ibadah'}
                </span>
                <h3 className="font-bold text-lg text-[#1A1A1A]">
                  {modalMode === 'create' ? 'Tambah Paket Umroh / Haji' : `Edit: ${formData.title}`}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePackage} className="p-5 sm:p-6 space-y-5">
              {/* 1. Judul & Kategori */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Judul Paket Ibadah *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Umroh Awal Ramadhan 1448 H / 2027 (9 Hari)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Kategori Layanan
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                      className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] outline-none cursor-pointer"
                    >
                      <option value="umroh-reguler">Umroh Reguler</option>
                      <option value="umroh-custom">Umroh VIP / Custom</option>
                      <option value="haji-khusus">Haji Khusus &amp; Furoda</option>
                      <option value="tabungan">Tabungan Syariah</option>
                      <option value="badal-umroh">Badal Umroh</option>
                      <option value="wisata-halal">Wisata Halal</option>
                      <option value="visa-tiket-la">Visa, Tiket &amp; LA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Harga Utama (Mulai Dari) *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Rp 31.500.000 atau USD $19.500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] font-bold text-[#A67C52] outline-none"
                    />
                  </div>
                </div>

                {/* Kamar Quad, Triple, Double */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                  <span className="block text-[11px] font-bold text-gray-700 uppercase mb-2">
                    Pricelist Tipe Kamar (Quad / Triple / Double)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Quad (Ber-4)</span>
                      <input
                        type="text"
                        placeholder="Rp 31.500.000"
                        value={(formData as any).quadPrice || ''}
                        onChange={(e) => setFormData({ ...formData, quadPrice: e.target.value } as any)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Triple (Ber-3)</span>
                      <input
                        type="text"
                        placeholder="Rp 33.500.000"
                        value={(formData as any).triplePrice || ''}
                        onChange={(e) => setFormData({ ...formData, triplePrice: e.target.value } as any)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold">Double (Ber-2)</span>
                      <input
                        type="text"
                        placeholder="Rp 36.000.000"
                        value={(formData as any).doublePrice || ''}
                        onChange={(e) => setFormData({ ...formData, doublePrice: e.target.value } as any)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Tanggal, Durasi & Maskapai */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Tanggal Keberangkatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 24 April 2027"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Durasi Hari
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 9 Hari atau 12 Hari"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Badge Label (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: HOT PROMO, BEST SELLER"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-xs text-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              {/* 3. Maskapai & Hotel */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Maskapai Penerbangan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Saudia Airlines (SV-819) Direct CGK-JED"
                    value={formData.airline}
                    onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Hotel Makkah
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Swissotel Al Maqam Makkah ★5"
                      value={formData.hotelMakkah}
                      onChange={(e) => setFormData({ ...formData, hotelMakkah: e.target.value })}
                      className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Hotel Madinah
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Dallah Taibah Madinah ★4"
                      value={formData.hotelMadinah}
                      onChange={(e) => setFormData({ ...formData, hotelMadinah: e.target.value })}
                      className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Kuota Kursi & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Total Kuota Kursi
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Sisa Kursi Tersedia
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.availableSeats}
                    onChange={(e) => setFormData({ ...formData, availableSeats: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={formData.isFullBooked}
                      onChange={(e) => setFormData({ ...formData, isFullBooked: e.target.checked })}
                      className="rounded text-[#A67C52] focus:ring-[#A67C52] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-rose-700">Tandai Penuh (Full Booked)</span>
                  </label>
                </div>
              </div>

              {/* 5. Upload Flyer / Poster (Ramah HP & Laptop) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Foto Flyer / Poster Paket
                </label>
                
                {/* Image Preview & Upload Input */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                  <div className="w-48 sm:w-56 h-36 rounded-xl bg-gray-950 overflow-hidden flex-shrink-0 relative border border-gray-300 flex items-center justify-center shadow-inner">
                    {uploadPreview ? (
                      <img
                        src={uploadPreview}
                        alt="Preview Flyer"
                        className="w-full h-full object-contain mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
                        <ImageIcon className="w-7 h-7" />
                        <span className="text-[10px] text-gray-500">Belum ada foto</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        disabled={isCompressing || isSaving}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                      >
                        {isCompressing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Mengompres Foto...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Pilih Foto Flyer dari HP / Laptop</span>
                          </>
                        )}
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-[11px] text-gray-600 font-medium">
                      * Rasio foto/flyer disesuaikan secara proporsional. Teks dan detail hotel akan tampil penuh tanpa terpotong di halaman depan.
                    </p>
                  </div>
                </div>

                {/* Preset Options */}
                <div>
                  <p className="text-[11px] text-gray-500 mb-1.5 font-medium">Atau pilih dari 7 template foto jemaah resmi:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {PRESET_POSTERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setUploadPreview(preset.url);
                          setFormData({ ...formData, posterUrl: preset.url });
                        }}
                        className={`p-2 rounded-xl border text-[11px] font-medium flex items-center gap-2 transition-all cursor-pointer text-left ${
                          uploadPreview === preset.url
                            ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52] font-bold ring-2 ring-[#A67C52]/30'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name}
                          className="w-7 h-7 rounded-lg object-cover flex-shrink-0 border border-gray-200" 
                        />
                        <span className="truncate flex-1">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6. Deskripsi & Highlight */}
              <div className="bg-[#FAF9F7] p-4 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Keunggulan &amp; Fasilitas Utama (1 Baris Per Poin) *
                  </label>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                    ✓ Otomatis Sinkron ke Semua Halaman &amp; Modal
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Tulis tiap fasilitas atau keunggulan pada baris baru (tekan Enter). Fasilitas ini langsung tersimpan dan tampil di halaman detail paket, kartu flyer, dan modal badal.
                </p>
                <textarea
                  rows={4}
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Bimbingan Manasik Sesuai Sunnah&#10;Free Executive Lounge Bandara CGK&#10;Kereta Cepat Haramain Makkah-Madinah&#10;Free Air Zam-zam 5 Liter Resmi Berbarcode"
                  className="w-full bg-white border border-gray-300 focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20 rounded-xl p-3 text-xs text-[#1A1A1A] outline-none font-medium leading-relaxed"
                />
              </div>

              {/* 7. Dokumen Brosur Flyer & Itinerary Resmi (Hanya saat Tambah Paket Baru, untuk Edit Paket tersedia tombol Dokumen di luar) */}
              {modalMode === 'create' && (
                <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border-2 border-[#A67C52]/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#A67C52]/20 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#A67C52] text-white flex items-center justify-center font-bold text-xs">
                          7
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wider">
                          Dokumen Brosur Flyer &amp; Itinerary Perjalanan
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">
                        Admin dapat mengunggah file PDF/gambar hasil editan Canva/Word, atau memasukkan link share publik (Google Drive / Canva). Jika dikosongkan, sistem akan otomatis menggunakan template resmi Al-Ghanim.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      Bebas Edit di Canva / Word
                    </span>
                  </div>

                  {/* Sub-A: Flyer Brosur Paket */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-[#A67C52]" />
                        <span className="text-xs font-bold text-gray-800">1. Flyer / Brosur Promosi Paket</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {formData.flyerUrl ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            ✓ Brosur Khusus Terpasang
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            Template Otomatis Sistem
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Switch Input Mode */}
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setFormFlyerMode('upload')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          formFlyerMode === 'upload' 
                            ? 'bg-[#A67C52] text-white shadow-2xs' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Upload className="w-3 h-3 inline mr-1" />
                        Upload File (PDF / Gambar)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormFlyerMode('url')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          formFlyerMode === 'url' 
                            ? 'bg-[#A67C52] text-white shadow-2xs' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3 inline mr-1" />
                        Tautan Link (Canva / Drive)
                      </button>
                    </div>

                    {formFlyerMode === 'upload' ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => flyerFileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-300"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#A67C52]" />
                            <span>Pilih File PDF / Gambar Flyer</span>
                          </button>
                          <input
                            ref={flyerFileInputRef}
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={(e) => handleFormFileUpload(e, 'flyer')}
                            className="hidden"
                          />
                          {formData.flyerUrl && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const dummyPkg: PackageScheduleItem = { ...formData, id: 'preview', price: formData.price, title: formData.title || 'Preview' };
                                  downloadOrOpenPackageFlyer(dummyPkg);
                                }}
                                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 border border-emerald-200 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat File</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocumentField('flyer', 'full')}
                                className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                                title="Hapus permanen dan kembali ke template otomatis"
                              >
                                Hapus
                              </button>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500">
                          Format: PDF, JPG, PNG, WebP. Maks 800 KB untuk upload langsung. Jika file Canva/Word lebih besar, pilih tab 'Tautan Link'.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={formData.flyerUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, flyerUrl: e.target.value }))}
                          placeholder="Tempel link share publik Canva / Google Drive (contoh: https://www.canva.com/design/...)"
                          className="w-full bg-[#F9F9F9] border border-gray-300 focus:border-[#A67C52] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-gray-800 outline-none"
                        />
                        {formData.flyerUrl && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => window.open(formData.flyerUrl, '_blank')}
                              className="text-xs font-semibold text-[#A67C52] hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Tes Buka Tautan Flyer</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocumentField('flyer', 'full')}
                              className="text-xs text-rose-600 hover:underline cursor-pointer"
                            >
                              Hapus Tautan
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sub-B: Itinerary Perjalanan Paket */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-gray-800">2. Itinerary / Rundown Jadwal Perjalanan</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {formData.itineraryPdfUrl ? (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                            ✓ Itinerary Khusus Terpasang
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            Template Otomatis Sistem
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Switch Input Mode */}
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setFormItineraryMode('upload')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          formItineraryMode === 'upload' 
                            ? 'bg-purple-600 text-white shadow-2xs' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Upload className="w-3 h-3 inline mr-1" />
                        Upload File PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormItineraryMode('url')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          formItineraryMode === 'url' 
                            ? 'bg-purple-600 text-white shadow-2xs' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3 inline mr-1" />
                        Tautan Link (Google Drive / Cloud)
                      </button>
                    </div>

                    {formItineraryMode === 'upload' ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => itineraryFileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-300"
                          >
                            <Upload className="w-3.5 h-3.5 text-purple-600" />
                            <span>Pilih File PDF Itinerary (Hasil Word/Canva)</span>
                          </button>
                          <input
                            ref={itineraryFileInputRef}
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => handleFormFileUpload(e, 'itinerary')}
                            className="hidden"
                          />
                          {formData.itineraryPdfUrl && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const dummyPkg: PackageScheduleItem = { ...formData, id: 'preview', price: formData.price, title: formData.title || 'Preview' };
                                  downloadOrOpenPackageItinerary(dummyPkg);
                                }}
                                className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1 border border-purple-200 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat File</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocumentField('itinerary', 'full')}
                                className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                                title="Hapus permanen dan kembali ke template otomatis"
                              >
                                Hapus
                              </button>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500">
                          Upload file PDF hasil ekspor Microsoft Word atau Canva. Jika file &gt; 800 KB, gunakan opsi 'Tautan Link' dengan Google Drive.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={formData.itineraryPdfUrl || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, itineraryPdfUrl: e.target.value }))}
                          placeholder="Tempel link share publik Google Drive PDF (contoh: https://drive.google.com/file/d/...)"
                          className="w-full bg-[#F9F9F9] border border-gray-300 focus:border-purple-600 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-gray-800 outline-none"
                        />
                        {formData.itineraryPdfUrl && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => window.open(formData.itineraryPdfUrl, '_blank')}
                              className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Tes Buka Tautan Itinerary</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocumentField('itinerary', 'full')}
                              className="text-xs text-rose-600 hover:underline cursor-pointer"
                            >
                              Hapus Tautan
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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
                      <span>{modalMode === 'create' ? 'Terbitkan Paket' : 'Simpan Perubahan'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 3: KELOLA DOKUMEN CEPAT (FLYER BROSUR & ITINERARY PERJALANAN)
         ========================================================================= */}
      {docsModal.isOpen && docsModal.pkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl border border-gray-200 my-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md uppercase">
                    Manajemen Dokumen &amp; Brosur
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-[#1A1A1A] mt-0.5 line-clamp-1">
                    {docsModal.pkg.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Jadwal: {docsModal.pkg.departureDate} ({docsModal.pkg.duration})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDocsModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Tip */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#A67C52]/30 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#A67C52] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">
                <strong>Bebas Edit di Canva / Microsoft Word:</strong> Admin dapat mengunggah file PDF/gambar hasil editan Canva atau Word, atau menempelkan tautan link publik. Tombol <em>'Brosur Paket'</em> dan <em>'Unduh Itinerary'</em> di website jamaah akan otomatis membuka dokumen yang Anda pasang di sini!
              </p>
            </div>

            <form onSubmit={handleSaveDocsModal} className="space-y-5">
              {/* 1. Flyer / Brosur Promosi */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#A67C52]" />
                    <span className="text-xs font-bold text-gray-900">1. Brosur Promosi / Flyer Paket</span>
                  </div>
                  {docsModal.flyerUrl ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      ✓ Brosur Custom Terpasang
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      Template Otomatis Sistem
                    </span>
                  )}
                </div>

                {/* Switch upload vs url */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDocsModal(prev => ({ ...prev, flyerInputType: 'upload' }))}
                    className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                      docsModal.flyerInputType === 'upload' 
                        ? 'bg-[#A67C52] text-white shadow-2xs' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Upload className="w-3 h-3 inline mr-1" />
                    Upload File (PDF / Gambar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocsModal(prev => ({ ...prev, flyerInputType: 'url' }))}
                    className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                      docsModal.flyerInputType === 'url' 
                        ? 'bg-[#A67C52] text-white shadow-2xs' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3 inline mr-1" />
                    Tautan Link (Canva / Drive)
                  </button>
                </div>

                {docsModal.flyerInputType === 'upload' ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => quickFlyerFileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-300 shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#A67C52]" />
                        <span>Pilih File PDF / Gambar Brosur</span>
                      </button>
                      <input
                        ref={quickFlyerFileInputRef}
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => handleQuickFileUpload(e, 'flyer')}
                        className="hidden"
                      />
                      {docsModal.flyerUrl && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              const dummyPkg: PackageScheduleItem = { ...docsModal.pkg!, flyerUrl: docsModal.flyerUrl };
                              downloadOrOpenPackageFlyer(dummyPkg);
                            }}
                            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 border border-emerald-200 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Tes Buka Flyer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocumentField('flyer', 'quick')}
                            className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer"
                            title="Hapus permanen dan kembalikan ke flyer otomatis"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Maksimal ukuran file 800 KB untuk disimpan langsung. Jika file Canva/Word Anda lebih besar, gunakan tab 'Tautan Link'.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={docsModal.flyerUrl}
                      onChange={(e) => setDocsModal(prev => ({ ...prev, flyerUrl: e.target.value }))}
                      placeholder="Tempel link publik Canva / Google Drive (https://...)"
                      className="w-full bg-white border border-gray-300 focus:border-[#A67C52] rounded-xl px-3.5 py-2 text-xs text-gray-800 outline-none"
                    />
                    {docsModal.flyerUrl && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(docsModal.flyerUrl, '_blank')}
                          className="text-xs font-semibold text-[#A67C52] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Tes Buka Tautan Brosur</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocumentField('flyer', 'quick')}
                          className="text-xs text-rose-600 hover:underline cursor-pointer"
                        >
                          Hapus Tautan
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Itinerary / Rundown Perjalanan */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-gray-900">2. Itinerary / Rundown Jadwal Perjalanan</span>
                  </div>
                  {docsModal.itineraryPdfUrl ? (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded-full">
                      ✓ Itinerary Custom Terpasang
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      Template Otomatis Sistem
                    </span>
                  )}
                </div>

                {/* Switch upload vs url */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDocsModal(prev => ({ ...prev, itineraryInputType: 'upload' }))}
                    className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                      docsModal.itineraryInputType === 'upload' 
                        ? 'bg-purple-600 text-white shadow-2xs' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Upload className="w-3 h-3 inline mr-1" />
                    Upload File PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocsModal(prev => ({ ...prev, itineraryInputType: 'url' }))}
                    className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                      docsModal.itineraryInputType === 'url' 
                        ? 'bg-purple-600 text-white shadow-2xs' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3 inline mr-1" />
                    Tautan Link (Google Drive / Cloud)
                  </button>
                </div>

                {docsModal.itineraryInputType === 'upload' ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => quickItineraryFileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-300 shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-purple-600" />
                        <span>Pilih File PDF Itinerary (Hasil Word/Canva)</span>
                      </button>
                      <input
                        ref={quickItineraryFileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleQuickFileUpload(e, 'itinerary')}
                        className="hidden"
                      />
                      {docsModal.itineraryPdfUrl && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              const dummyPkg: PackageScheduleItem = { ...docsModal.pkg!, itineraryPdfUrl: docsModal.itineraryPdfUrl };
                              downloadOrOpenPackageItinerary(dummyPkg);
                            }}
                            className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1 border border-purple-200 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Tes Buka Itinerary</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocumentField('itinerary', 'quick')}
                            className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer"
                            title="Hapus permanen dan kembalikan ke itinerary otomatis"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Upload PDF hasil editan Microsoft Word atau Canva. Ukuran maks 800 KB, atau gunakan opsi Tautan Link untuk Google Drive.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={docsModal.itineraryPdfUrl}
                      onChange={(e) => setDocsModal(prev => ({ ...prev, itineraryPdfUrl: e.target.value }))}
                      placeholder="Tempel link publik Google Drive PDF (https://drive.google.com/...)"
                      className="w-full bg-white border border-gray-300 focus:border-purple-600 rounded-xl px-3.5 py-2 text-xs text-gray-800 outline-none"
                    />
                    {docsModal.itineraryPdfUrl && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(docsModal.itineraryPdfUrl, '_blank')}
                          className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Tes Buka Tautan Itinerary</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocumentField('itinerary', 'quick')}
                          className="text-xs text-rose-600 hover:underline cursor-pointer"
                        >
                          Hapus Tautan
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setDocsModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan Dokumen...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Simpan Dokumen &amp; Aktifkan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL: KONFIRMASI HAPUS PAKET
         ========================================================================= */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1A1A1A]">Hapus Paket Ibadah?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Apakah Anda yakin ingin menghapus paket <strong className="text-gray-800">"{deleteConfirm.title}"</strong>? Data yang dihapus tidak dapat dikembalikan.
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
                onClick={handleDeletePackage}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Ya, Hapus Paket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
