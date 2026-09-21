import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Package, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Trash2, 
  Edit3,
  Search, 
  Phone, 
  Bot, 
  RefreshCw, 
  LogOut, 
  AlertCircle,
  Database,
  CheckCircle,
  Clock,
  ExternalLink,
  HelpCircle,
  Check,
  X,
  MapPin,
  Eye,
  Info,
  Copy,
  Flame,
  MessageCircle,
  Image as ImageIcon,
  BookOpen,
  FileText,
  Camera,
  Key,
  Globe,
  Settings,
  EyeOff,
  UserCheck,
  UserPlus,
  FileDown,
  Download,
  CheckCircle2,
  Printer,
  Share2,
  Menu,
  ChevronRight,
  Bell,
  Star,
  CreditCard,
  Calendar,
  BedDouble,
  Mail,
  LayoutGrid,
  Table,
  Plane,
  Sparkles
} from 'lucide-react';
import { JamaahProgressItem, InquiryItem, PartnerRegistrationItem, TestimonialItem } from '../types';
import { DETAILED_SCHEDULES, calculatePartnerCommissions, INITIAL_JAMAAH_DATA } from '../data/packagesData';

const COMMON_REGIONS = [
  'Garut',
  'Bandung',
  'Tasikmalaya',
  'Ciamis',
  'Sumedang',
  'Majalengka',
  'Banjar',
  'Pangandaran',
  'Cianjur',
  'Sukabumi',
  'Bogor',
  'Depok',
  'Bekasi',
  'Jakarta Selatan',
  'Jakarta Timur',
  'Jakarta Pusat',
  'Tangerang'
];
import { AdminPackagesCMS } from './admin/AdminPackagesCMS';
import { AdminBannersCMS } from './admin/AdminBannersCMS';
import { AdminGalleryCMS } from './admin/AdminGalleryCMS';
import { AdminTestimonialsCMS } from './admin/AdminTestimonialsCMS';
import { AdminUserGuide } from './admin/AdminUserGuide';
import { AlGhanimLogo } from './AlGhanimLogo';
import { PackageCategorySelector } from './PackageCategorySelector';
import { 
  generateJamaahRegistrationSlipPDF, 
  generateJamaahTrackingCardPDF, 
  generatePassportRecommendationPDF 
} from '../utils/pdfGenerator';
import { 
  subscribeToJamaah, 
  addJamaahToFirestore, 
  updateJamaahInFirestore, 
  deleteJamaahFromFirestore,
  deleteAllDemoJamaahFromFirestore,
  subscribeToInquiries,
  addInquiryToFirestore,
  deleteInquiryFromFirestore,
  deleteMultipleInquiriesFromFirestore,
  deleteAllInquiriesFromFirestore,
  updateInquiryStatusInFirestore,
  updateInquiryInFirestore,
  subscribeToPartnerRegistrations,
  addPartnerRegistrationToFirestore,
  deletePartnerFromFirestore,
  updatePartnerStatusInFirestore,
  updatePartnerInFirestore,
  subscribeToTestimonials,
  addTestimonialToFirestore,
  updateTestimonialInFirestore,
  deleteTestimonialFromFirestore,
  seedInitialFirestoreData,
  reloadDemoJamaahToFirestore,
  formatDateTimeFriendly,
  isRecentActivity,
  parseTimestampToMillis,
  subscribeToAdminAuth,
  updateAdminAuthInFirestore,
  AdminAuthConfig,
  DEFAULT_ADMIN_PASSWORDS
} from '../lib/firestoreService';

// Helper to format WhatsApp Link with Indonesian country code (+62)
const cleanWhatsAppNumber = (phone: string): string => {
  let cleaned = (phone || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

const formatWhatsAppLink = (phone: string, text: string) => {
  const cleaned = cleanWhatsAppNumber(phone);
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
};

const getInquiryWAMessage = (inq: InquiryItem, parsedMsg?: any) => {
  let text = `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nYth. Bpk/Ibu *${inq.name}*,\n\nKami dari *ALGHANIM Islamic Tour Garut (PT. Al-Ghanimah Berkah Bersama)* menindaklanjuti permohonan konsultasi Anda mengenai *${inq.packageInterest || 'Paket Umroh & Haji'}*.`;
  
  if (parsedMsg?.refCode) {
    text += `\n\n📌 *No. Referensi:* ${parsedMsg.refCode}`;
  }
  
  if (parsedMsg?.pesanText && parsedMsg.pesanText !== '-') {
    text += `\n💬 *Pertanyaan / Catatan Anda:* "${parsedMsg.pesanText}"`;
  }
  
  text += `\n\nApakah ada waktu luang untuk kami bantu jelaskan detail paket, promo terbaru, fasilitas hotel, serta jadwal keberangkatan yang sesuai?\n\nJazakumullah khairan katsiran.`;
  return text;
};

const getJamaahRegistrationWAMessage = (jamaah: JamaahProgressItem) => {
  return `Assalamu'alaikum Warahmatullahi Wabarakatuh,

Yth. Bpk/Ibu *${jamaah.fullName}*,

Alhamdulillah, pendaftaran Ibadah Umroh Anda telah resmi terdaftar di *PT. AL-GHANIMAH BERKAH BERSAMA* (Cabang Garut - Mandala 525).

📋 *Data Registrasi Anda:*
• *Nomor Induk Jamaah (NIJ):* *${jamaah.nij}*
• *Program Paket:* ${jamaah.packageName}
• *Rencana Keberangkatan:* ${jamaah.departureDate}
• *Status Pembayaran:* ${jamaah.paymentStatus} (${jamaah.dpAmount})

🔍 *Cara Cek Progres Live Tracking Mandiri:*
1. Buka website resmi ALGHANIM
2. Masuk ke menu *Portal Jamaah*
3. Masukkan Nomor NIJ (*${jamaah.nij}*) atau Nomor WhatsApp ini

Lembar PDF tanda terima registrasi resmi juga telah diterbitkan oleh sistem operasional kami.

Jazakumullah khairan katsiran atas amanah dan kepercayaannya. Semoga Allah SWT memudahkan setiap langkah persiapan ibadah Bapak/Ibu menuju Baitullah. Aamiin ya Rabbal 'Alamin.`;
};

interface AdminDashboardProps {
  onBackToPublicWebsite?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToPublicWebsite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'jamaah' | 'inquiries' | 'partners' | 'packages' | 'banners' | 'galeri' | 'testimonials' | 'guide'>('jamaah');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Admin Auth Settings from Firestore
  const [adminAuth, setAdminAuth] = useState<AdminAuthConfig | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [changePwForm, setChangePwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    adminName: '',
    adminPhone: ''
  });
  const [changePwError, setChangePwError] = useState('');
  const [showChangePwFields, setShowChangePwFields] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);


  // Real-time Firestore State
  const [jamaahList, setJamaahList] = useState<JamaahProgressItem[]>([]);
  const [inquiriesList, setInquiriesList] = useState<InquiryItem[]>([]);
  const [partnersList, setPartnersList] = useState<PartnerRegistrationItem[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search Filter in Jamaah Tab
  const [jamaahSearch, setJamaahSearch] = useState('');
  const [jamaahStatusFilter, setJamaahStatusFilter] = useState<'pending' | 'ready' | 'all'>('pending');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<'pending' | 'Disetujui' | 'all'>('pending');
  const [showDemoOptionsDropdown, setShowDemoOptionsDropdown] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'Baru' | 'Dihubungi' | 'Selesai'>('Baru');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<string>('all');
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [partnerSearch, setPartnerSearch] = useState('');

  // Guide accordion toggle (default closed / hidden)
  const [showDataFlowGuide, setShowDataFlowGuide] = useState(false);

  // Manifest View Mode (default 'cards' as requested: pas masuk langsung di kartu visual)
  const [jamaahViewMode, setJamaahViewMode] = useState<'cards' | 'table'>('cards');

  // Delete Confirmation Modal State (Avoids window.confirm blocked in iframes)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'jamaah' | 'inquiry' | 'partner';
    id: string;
    name: string;
  }>({
    isOpen: false,
    type: 'jamaah',
    id: '',
    name: ''
  });

  // In-App Modal for Clearing & Reloading Demo Jamaah (Avoids window.confirm blocked in iframes)
  const [isClearDemoModalOpen, setIsClearDemoModalOpen] = useState(false);
  const [isReloadDemoModalOpen, setIsReloadDemoModalOpen] = useState(false);
  const [isClearingDemoLoading, setIsClearingDemoLoading] = useState(false);
  const [isReloadingDemoLoading, setIsReloadingDemoLoading] = useState(false);

  // Modal: Add Jamaah Form State
  const [isAddJamaahOpen, setIsAddJamaahOpen] = useState(false);
  const [savedJamaahSuccess, setSavedJamaahSuccess] = useState<JamaahProgressItem | null>(null);
  const [activePdfDropdownId, setActivePdfDropdownId] = useState<string | null>(null);
  const [newJamaah, setNewJamaah] = useState<Partial<JamaahProgressItem>>({
    fullName: '',
    nij: `AG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    ktp: '',
    phone: '',
    birthDate: '1990-01-01',
    packageName: 'Umroh Reguler Syawal 1448 H (9 Hari)',
    departureDate: '24 April 2027',
    duration: '9 Hari',
    airline: 'Saudia Airlines (SV-819)',
    flightNumber: 'SV-819 Direct CGK-JED',
    hotelMakkah: 'Swissotel Al Maqam Makkah (Bintang 5)',
    hotelMadinah: 'Dallah Taibah Madinah (Bintang 4)',
    roomType: 'QUAD (Sekamar Ber-4)',
    roomMakkahNumber: '',
    roomMadinahNumber: '',
    roommates: [],
    paymentStatus: 'Menunggu Pelunasan',
    dpAmount: 'Rp 10.000.000',
    totalAmount: 'Rp 31.500.000',
    remainingAmount: 'Rp 21.500.000',
    progressStep: 1,
    muthawifName: 'Tim Muthawwif Resmi',
    muthawifPhone: '0813-1670-218',
    manasikDate: 'Diinformasikan Menjelang Keberangkatan',
    manasikLocation: 'Kantor Cabang / Titik Resmi',
    passportStatus: 'Dalam Proses Kantor Imigrasi',
    visaStatus: 'Menunggu Pelunasan',
    equipmentStatus: 'Dalam Proses Packing',
    notes: 'Pendaftaran baru via Kantor Garut.'
  });

  // Modal: Edit Jamaah Form State
  const [isEditJamaahOpen, setIsEditJamaahOpen] = useState(false);
  const [editingJamaah, setEditingJamaah] = useState<JamaahProgressItem | null>(null);

  // Modal: Add/Edit Inquiry Form State
  const [isAddInquiryOpen, setIsAddInquiryOpen] = useState(false);
  const [isEditInquiryOpen, setIsEditInquiryOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<InquiryItem | null>(null);
  const [selectedInquiryIds, setSelectedInquiryIds] = useState<string[]>([]);
  const [bulkDeleteModal, setBulkDeleteModal] = useState<{
    isOpen: boolean;
    mode: 'selected' | 'completed' | 'all';
    count: number;
  }>({
    isOpen: false,
    mode: 'selected',
    count: 0
  });

  const [newInquiry, setNewInquiry] = useState<{
    name: string;
    phone: string;
    email: string;
    type: 'Pesan Kontak' | 'Konsultasi Layanan' | 'Download Brosur' | 'Pesan Kontak & Brosur' | 'Tanya AI';
    packageInterest: string;
    message: string;
  }>({
    name: '',
    phone: '',
    email: '',
    type: 'Konsultasi Layanan',
    packageInterest: 'Umroh Reguler Direct 9 Hari (Saudia)',
    message: ''
  });

  // Modal: Add/Edit Partner Form State
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [isEditPartnerOpen, setIsEditPartnerOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerRegistrationItem | null>(null);
  const [newBinaanItem, setNewBinaanItem] = useState<{
    name: string;
    nij: string;
    packageName: string;
    status: 'DP Masuk' | 'Lunas' | 'Selesai';
    commission: string;
  }>({
    name: '',
    nij: '',
    packageName: 'Umroh Reguler Syawal 1448 H (9 Hari)',
    status: 'DP Masuk',
    commission: 'Rp 1.500.000'
  });
  const [newPartner, setNewPartner] = useState<{
    name: string;
    phone: string;
    city: string;
    tier: 'Cabang' | 'Agen' | 'Marketer';
    partnerCode: string;
    experience: string;
    totalJamaah: number;
    totalCommission: string;
    pendingCommission: string;
    paidCommission: string;
    status: 'Disetujui' | 'Menunggu Verifikasi';
  }>({
    name: '',
    phone: '',
    city: 'Garut',
    tier: 'Agen',
    partnerCode: 'AG-AGN-528',
    experience: '',
    totalJamaah: 0,
    totalCommission: 'Rp 0',
    pendingCommission: 'Rp 0',
    paidCommission: 'Rp 0',
    status: 'Disetujui'
  });

  const generatePartnerCode = (tier: 'Cabang' | 'Agen' | 'Marketer' | string) => {
    const prefix = tier.includes('Cabang') ? 'AG-CAB' : tier.includes('Agen') ? 'AG-AGN' : 'AG-MKT';
    const rand = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${rand}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Subscribe to Realtime Firestore collections & Admin Auth
  useEffect(() => {
    const unsubJamaah = subscribeToJamaah((data) => setJamaahList(data));
    const unsubInquiries = subscribeToInquiries((data) => setInquiriesList(data));
    const unsubPartners = subscribeToPartnerRegistrations((data) => setPartnersList(data));
    const unsubTestimonials = subscribeToTestimonials((data) => setTestimonialsList(data));
    const unsubAuth = subscribeToAdminAuth((config) => {
      setAdminAuth(config);
      if (config?.adminName && !changePwForm.adminName) {
        setChangePwForm(prev => ({
          ...prev,
          adminName: config.adminName || '',
          adminPhone: config.adminPhone || ''
        }));
      }
    });

    return () => {
      unsubJamaah();
      unsubInquiries();
      unsubPartners();
      unsubTestimonials();
      unsubAuth();
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const input = passwordInput.trim();
    const validPasswords = [
      ...(adminAuth?.customPassword ? [adminAuth.customPassword] : []),
      ...DEFAULT_ADMIN_PASSWORDS
    ];

    if (validPasswords.includes(input)) {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('✓ Berhasil masuk ke Back Office ALGHANIM');
    } else {
      setAuthError('Kata sandi salah. Silakan masukkan kata sandi staf yang sesuai.');
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwError('');

    const validCurrent = [
      ...(adminAuth?.customPassword ? [adminAuth.customPassword] : []),
      ...DEFAULT_ADMIN_PASSWORDS
    ];

    if (!validCurrent.includes(changePwForm.currentPassword.trim())) {
      setChangePwError('Kata sandi saat ini tidak sesuai!');
      return;
    }

    if (!changePwForm.newPassword || changePwForm.newPassword.length < 6) {
      setChangePwError('Kata sandi baru minimal 6 karakter!');
      return;
    }

    if (changePwForm.newPassword !== changePwForm.confirmPassword) {
      setChangePwError('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }

    setIsSavingPassword(true);
    try {
      await updateAdminAuthInFirestore(
        changePwForm.newPassword.trim(),
        changePwForm.adminName.trim() || 'Admin Resmi ALGHANIM',
        changePwForm.adminPhone.trim() || '0813-1670-218'
      );
      showToast('✓ Kata sandi berhasil diperbarui & disimpan di Cloud Database!');
      setIsChangePasswordOpen(false);
      setChangePwForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        adminName: changePwForm.adminName,
        adminPhone: changePwForm.adminPhone
      });
    } catch (err) {
      console.error(err);
      setChangePwError('Gagal menyimpan kata sandi ke Firestore. Silakan coba lagi.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Quick Progress Step Update
  const handleUpdateStep = async (id: string, newStep: 1 | 2 | 3 | 4 | 5) => {
    try {
      const updates: Partial<JamaahProgressItem> = {
        progressStep: newStep,
        paymentStatus: newStep >= 3 ? 'Lunas' : 'Menunggu Pelunasan',
        visaStatus: newStep >= 4 ? 'Visa Umroh Telah Terbit' : (newStep >= 2 ? 'Proses Pengajuan' : 'Menunggu Pelunasan')
      };
      if (newStep >= 2) {
        updates.passportStatus = 'Lengkap & Terverifikasi di Kantor';
      }
      if (newStep >= 3) {
        updates.remainingAmount = 'Rp 0 (LUNAS)';
      }
      if (newStep >= 5) {
        updates.equipmentStatus = 'Lengkap Diterima Jamaah';
      }
      // Optimistic update to immediately reflect in current tab view
      setJamaahList(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      await updateJamaahInFirestore(id, updates);
      showToast(newStep === 5 ? '✓ Jamaah berhasil dipindahkan ke daftar "Siap Berangkat"!' : `Progres jamaah berhasil diubah ke Tahap ${newStep}`);
    } catch (err) {
      console.error('Error updating step in Firestore:', err);
      showToast('Gagal mengubah progres jamaah');
    }
  };

  // CREATE: Add Jamaah
  const handleAddJamaah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJamaah.fullName || !newJamaah.ktp) return;

    try {
      const itemToSave: Omit<JamaahProgressItem, 'id'> = {
        nij: newJamaah.nij || `AG-${Math.floor(1000 + Math.random() * 9000)}`,
        ktp: newJamaah.ktp || '',
        fullName: newJamaah.fullName || '',
        phone: newJamaah.phone || '',
        birthDate: newJamaah.birthDate || '1990-01-01',
        packageName: newJamaah.packageName || 'Umroh Reguler',
        departureDate: newJamaah.departureDate || '24 April 2027',
        duration: newJamaah.duration || '9 Hari',
        airline: newJamaah.airline || 'Saudia Airlines',
        flightNumber: newJamaah.flightNumber || 'SV-819 Direct CGK-JED',
        hotelMakkah: newJamaah.hotelMakkah || 'Swissotel Al Maqam Makkah (Bintang 5)',
        hotelMadinah: newJamaah.hotelMadinah || 'Dallah Taibah Madinah (Bintang 4)',
        paymentStatus: (newJamaah.paymentStatus as any) || 'Menunggu Pelunasan',
        dpAmount: newJamaah.dpAmount || 'Rp 10.000.000',
        totalAmount: newJamaah.totalAmount || 'Rp 31.500.000',
        remainingAmount: newJamaah.remainingAmount || 'Rp 21.500.000',
        progressStep: (newJamaah.progressStep as any) || 1,
        muthawifName: newJamaah.muthawifName || 'Tim Muthawwif Resmi',
        muthawifPhone: newJamaah.muthawifPhone || '0813-1670-218',
        manasikDate: newJamaah.manasikDate || 'Diinformasikan Menjelang Keberangkatan',
        manasikLocation: newJamaah.manasikLocation || 'Kantor Cabang Resmi',
        passportStatus: (newJamaah.passportStatus as any) || 'Dalam Proses Kantor Imigrasi',
        visaStatus: (newJamaah.visaStatus as any) || 'Menunggu Pelunasan',
        equipmentStatus: (newJamaah.equipmentStatus as any) || 'Dalam Proses Packing',
        notes: newJamaah.notes || 'Data pendaftaran baru via Portal Staff.'
      };

      await addJamaahToFirestore(itemToSave);
      setIsAddJamaahOpen(false);
      setSavedJamaahSuccess({ id: `saved-${Date.now()}`, ...itemToSave });
      showToast(`Data jamaah "${itemToSave.fullName}" berhasil disimpan ke Cloud!`);

      // Reset form
      setNewJamaah({
        fullName: '',
        nij: `AG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        ktp: '',
        phone: '',
        birthDate: '1990-01-01',
        packageName: 'Umroh Reguler Syawal 1448 H (9 Hari)',
        departureDate: '24 April 2027',
        duration: '9 Hari',
        airline: 'Saudia Airlines (SV-819)',
        flightNumber: 'SV-819 Direct CGK-JED',
        hotelMakkah: 'Swissotel Al Maqam Makkah (Bintang 5)',
        hotelMadinah: 'Dallah Taibah Madinah (Bintang 4)',
        paymentStatus: 'Menunggu Pelunasan',
        dpAmount: 'Rp 10.000.000',
        totalAmount: 'Rp 31.500.000',
        remainingAmount: 'Rp 21.500.000',
        progressStep: 1,
        muthawifName: 'Tim Muthawwif Resmi',
        muthawifPhone: '0813-1670-218',
        manasikDate: 'Diinformasikan Menjelang Keberangkatan',
        manasikLocation: 'Kantor Cabang Resmi',
        passportStatus: 'Dalam Proses Kantor Imigrasi',
        visaStatus: 'Menunggu Pelunasan',
        equipmentStatus: 'Dalam Proses Packing',
        notes: 'Pendaftaran baru via Kantor Garut.'
      });
    } catch (err) {
      console.error('Error adding jamaah:', err);
      showToast('Gagal menambahkan data jamaah');
    }
  };

  // UPDATE: Save Edit Jamaah
  const handleSaveEditJamaah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJamaah) return;

    try {
      await updateJamaahInFirestore(editingJamaah.id, editingJamaah);
      setIsEditJamaahOpen(false);
      setEditingJamaah(null);
      showToast(`Data jamaah "${editingJamaah.fullName}" berhasil diperbarui!`);
    } catch (err) {
      console.error('Error updating jamaah:', err);
      showToast('Gagal memperbarui data jamaah');
    }
  };

  // CLEAR / RESET: In-App Modal handlers for clearing demo jamaah (bypasses blocked window.confirm)
  const handleOpenClearDemoModal = () => {
    setIsClearDemoModalOpen(true);
  };

  const handleExecuteClearDemoJamaah = async () => {
    setIsClearingDemoLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('alghanim_demo_cleared', 'true');
      }
      setJamaahList([]);
      await deleteAllDemoJamaahFromFirestore();
      setIsClearDemoModalOpen(false);
      showToast('✓ Semua data contoh jamaah berhasil dibersihkan!');
    } catch (err) {
      console.error('Error clearing demo jamaah:', err);
      setIsClearDemoModalOpen(false);
      showToast('✓ Data contoh telah dibersihkan dari tampilan manifest.');
    } finally {
      setIsClearingDemoLoading(false);
    }
  };

  const handleOpenReloadDemoModal = () => {
    setIsReloadDemoModalOpen(true);
  };

  const handleExecuteReloadDemoJamaah = async () => {
    setIsReloadingDemoLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('alghanim_demo_cleared');
      }
      // Instantly populate local state so user sees simulated jamaah immediately
      setJamaahList([...INITIAL_JAMAAH_DATA]);
      // Persist un-deletion and documents in Firestore for realtime sync
      await reloadDemoJamaahToFirestore();
      setIsReloadDemoModalOpen(false);
      showToast('✓ Data contoh simulasi (3 jamaah) berhasil dimuat!');
    } catch (err) {
      console.error('Error reloading demo jamaah:', err);
      // Fallback: ensure UI displays data regardless
      setJamaahList([...INITIAL_JAMAAH_DATA]);
      setIsReloadDemoModalOpen(false);
      showToast('✓ Data contoh simulasi berhasil dimuat!');
    } finally {
      setIsReloadingDemoLoading(false);
    }
  };

  // CREATE: Add Manual Inquiry
  const handleAddInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiry.name || !newInquiry.phone) return;

    try {
      await addInquiryToFirestore({
        name: newInquiry.name,
        phone: newInquiry.phone,
        email: newInquiry.email,
        type: newInquiry.type,
        packageInterest: newInquiry.packageInterest,
        message: newInquiry.message || 'Pesan/prospek diinput langsung oleh staf admin.',
        status: 'Baru'
      });
      setIsAddInquiryOpen(false);
      setNewInquiry({
        name: '',
        phone: '',
        email: '',
        type: 'Konsultasi Layanan',
        packageInterest: 'Umroh Reguler Direct 9 Hari (Saudia)',
        message: ''
      });
      showToast('Pesan/prospek berhasil ditambahkan ke database!');
    } catch (err) {
      console.error('Error adding inquiry:', err);
      showToast('Gagal menambahkan pesan');
    }
  };

  // EDIT: Open Inquiry Edit Modal
  const handleOpenEditInquiry = (inq: InquiryItem) => {
    setEditingInquiry({ ...inq });
    setIsEditInquiryOpen(true);
  };

  // EDIT: Save Inquiry Updates
  const handleSaveEditInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInquiry) return;

    try {
      await updateInquiryInFirestore(editingInquiry.id, {
        name: editingInquiry.name,
        phone: editingInquiry.phone,
        email: editingInquiry.email,
        packageInterest: editingInquiry.packageInterest,
        type: editingInquiry.type,
        status: editingInquiry.status,
        message: editingInquiry.message
      });
      setIsEditInquiryOpen(false);
      setEditingInquiry(null);
      showToast(`✓ Perubahan data pesan/leads "${editingInquiry.name}" berhasil disimpan!`);
    } catch (err) {
      console.error('Error saving edited inquiry:', err);
      showToast('Gagal menyimpan perubahan pesan');
    }
  };

  // 1-CLICK CONVERT TO MANIFEST JAMAAH (Opsi 1)
  const [convertingInquiryId, setConvertingInquiryId] = useState<string | null>(null);

  const handleConvertToManifest = async (inq: InquiryItem) => {
    try {
      setConvertingInquiryId(inq.id);
      const parsed = cleanInquiryMessage(inq.message);
      
      const currentYear = new Date().getFullYear();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const autoNij = `AG-${currentYear}-${randomSuffix}`;
      
      // Sesuai instruksi: isi hanya apa yang diisi oleh jamaah (NIK & WA), sisanya biarkan admin yang edit
      const ktpVal = (parsed.nik && parsed.nik !== 'Belum diisi' && parsed.nik !== '-') 
        ? parsed.nik.trim() 
        : '-';

      const targetPkg = inq.packageInterest || '-';

      const itemToSave: Omit<JamaahProgressItem, 'id'> = {
        nij: autoNij,
        ktp: ktpVal,
        fullName: inq.name,
        phone: inq.phone,
        birthDate: '-',
        packageName: targetPkg,
        departureDate: parsed.rencana && parsed.rencana !== '-' ? parsed.rencana : '-',
        duration: '-',
        airline: '-',
        flightNumber: '-',
        hotelMakkah: '-',
        hotelMadinah: '-',
        paymentStatus: 'Menunggu Pelunasan',
        dpAmount: '-',
        totalAmount: '-',
        remainingAmount: '-',
        progressStep: 1, // Tahap 1: Booking Seat (Menunggu Kelengkapan Data Admin)
        muthawifName: '-',
        muthawifPhone: '-',
        manasikDate: '-',
        manasikLocation: parsed.kantor ? `Kantor Cabang ${parsed.kantor}` : 'Kantor Garut',
        passportStatus: 'Menunggu Penyerahan Fisik',
        visaStatus: 'Menunggu Pelunasan',
        equipmentStatus: 'Belum Diserahkan',
        roomType: parsed.kamar && parsed.kamar !== '-' ? parsed.kamar : '-',
        notes: `[Hasil Konversi dari Formulir Pendaftaran Kontak] ${parsed.refCode ? `Ref: ${parsed.refCode}. ` : ''}${inq.message || ''}`,
        isConvertedFromInquiry: true,
        conversionDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      await addJamaahToFirestore(itemToSave);
      await updateInquiryStatusInFirestore(inq.id, 'Selesai');

      showToast(`✓ Berhasil konversi "${inq.name}" ke Manifest! (NIK & WA tersalin otomatis, silakan lengkapi data)`);
      setActiveAdminTab('jamaah');
    } catch (err) {
      console.error('Error converting inquiry to manifest:', err);
      showToast('Gagal mengonversi data ke Manifest');
    } finally {
      setConvertingInquiryId(null);
    }
  };

  // BULK: Toggle Select Inquiry
  const handleToggleSelectInquiry = (id: string) => {
    setSelectedInquiryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // BULK: Select All / Deselect All
  const handleSelectAllInquiries = (currentFiltered: InquiryItem[]) => {
    if (selectedInquiryIds.length === currentFiltered.length && currentFiltered.length > 0) {
      setSelectedInquiryIds([]);
    } else {
      setSelectedInquiryIds(currentFiltered.map((i) => i.id));
    }
  };

  // BULK: Mark Selected Status
  const handleBulkMarkStatus = async (status: 'Dihubungi' | 'Selesai') => {
    if (selectedInquiryIds.length === 0) return;
    try {
      await Promise.all(
        selectedInquiryIds.map((id) => updateInquiryStatusInFirestore(id, status))
      );
      showToast(`✓ ${selectedInquiryIds.length} pesan berhasil ditandai sebagai "${status}"`);
      setSelectedInquiryIds([]);
    } catch (err) {
      console.error('Error bulk updating status:', err);
      showToast('Gagal memperbarui status terpilih');
    }
  };

  // BULK: Request Delete Modal
  const handleRequestBulkDelete = (mode: 'selected' | 'completed' | 'all') => {
    let count = 0;
    if (mode === 'selected') {
      count = selectedInquiryIds.length;
    } else if (mode === 'completed') {
      count = inquiriesList.filter((i) => i.status === 'Selesai').length;
    } else if (mode === 'all') {
      count = inquiriesList.length;
    }

    if (count === 0) {
      showToast('Tidak ada item yang dapat dihapus.');
      return;
    }

    setBulkDeleteModal({
      isOpen: true,
      mode,
      count
    });
  };

  // BULK: Confirm Delete Execution
  const handleConfirmBulkDelete = async () => {
    const { mode } = bulkDeleteModal;
    setBulkDeleteModal({ ...bulkDeleteModal, isOpen: false });

    try {
      if (mode === 'selected') {
        await deleteMultipleInquiriesFromFirestore(selectedInquiryIds);
        showToast(`✓ ${selectedInquiryIds.length} pesan terpilih berhasil dihapus.`);
        setSelectedInquiryIds([]);
      } else if (mode === 'completed') {
        const completedIds = inquiriesList.filter((i) => i.status === 'Selesai').map((i) => i.id);
        await deleteMultipleInquiriesFromFirestore(completedIds);
        showToast(`✓ ${completedIds.length} pesan berstatus 'Selesai' berhasil dibersihkan.`);
        setSelectedInquiryIds((prev) => prev.filter((id) => !completedIds.includes(id)));
      } else if (mode === 'all') {
        await deleteAllInquiriesFromFirestore();
        showToast('✓ Semua log pesan & leads berhasil dihapus bersih.');
        setSelectedInquiryIds([]);
      }
    } catch (err) {
      console.error('Error executing bulk delete:', err);
      showToast('Gagal menghapus pesan');
    }
  };

  // CREATE: Add Manual Partner with Custom / Generated Partner Code
  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.phone) return;

    try {
      const finalCode = (newPartner.partnerCode && newPartner.partnerCode.trim()) || generatePartnerCode(newPartner.tier);

      await addPartnerRegistrationToFirestore({
        name: newPartner.name.trim(),
        phone: newPartner.phone.trim(),
        city: newPartner.city.trim() || 'Garut',
        tier: newPartner.tier,
        partnerCode: finalCode,
        experience: newPartner.experience.trim() || 'Mitra resmi terverifikasi ALGHANIM.',
        status: newPartner.status || 'Disetujui',
        totalJamaah: Number(newPartner.totalJamaah) || 0,
        totalCommission: newPartner.totalCommission || 'Rp 0',
        pendingCommission: newPartner.pendingCommission || 'Rp 0',
        paidCommission: newPartner.paidCommission || 'Rp 0'
      });
      setIsAddPartnerOpen(false);
      setNewPartner({
        name: '',
        phone: '',
        city: 'Garut',
        tier: 'Agen',
        partnerCode: generatePartnerCode('Agen'),
        experience: '',
        totalJamaah: 0,
        totalCommission: 'Rp 0',
        pendingCommission: 'Rp 0',
        paidCommission: 'Rp 0',
        status: 'Disetujui'
      });
      showToast(`✓ Mitra ${newPartner.name} berhasil ditambahkan dengan Kode Akses: ${finalCode}!`);
    } catch (err) {
      console.error('Error adding partner:', err);
      showToast('Gagal menambahkan pendaftaran mitra');
    }
  };

  // EDIT PARTNER & BINAAN HANDLERS
  const handleOpenEditPartner = (p: PartnerRegistrationItem) => {
    const comms = calculatePartnerCommissions(p);
    setEditingPartner({
      ...p,
      totalJamaah: comms.totalJamaah,
      totalCommission: (p.totalCommission && p.totalCommission !== 'Rp 0') ? p.totalCommission : comms.totalCommission,
      paidCommission: (p.paidCommission && p.paidCommission !== 'Rp 0') ? p.paidCommission : comms.paidCommission,
      pendingCommission: (p.pendingCommission && p.pendingCommission !== 'Rp 0') ? p.pendingCommission : comms.pendingCommission,
      binaanJamaah: p.binaanJamaah ? [...p.binaanJamaah] : []
    });
    setIsEditPartnerOpen(true);
  };

  const handleSaveEditPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;

    const payload: Partial<PartnerRegistrationItem> = {
      ...editingPartner,
      totalJamaah: typeof editingPartner.totalJamaah === 'number' 
        ? editingPartner.totalJamaah 
        : parseInt(String(editingPartner.totalJamaah || '0'), 10) || 0,
      totalCommission: editingPartner.totalCommission?.trim() || 'Rp 0',
      paidCommission: editingPartner.paidCommission?.trim() || 'Rp 0',
      pendingCommission: editingPartner.pendingCommission?.trim() || 'Rp 0'
    };

    try {
      await updatePartnerInFirestore(editingPartner.id, payload);
      setIsEditPartnerOpen(false);
      setEditingPartner(null);
      showToast(`✓ Data kemitraan & jamaah binaan "${editingPartner.name}" berhasil diperbarui!`);
    } catch (err) {
      console.error('Error updating partner:', err);
      showToast('Gagal memperbarui data mitra');
    }
  };

  const handleAddBinaanToPartner = () => {
    if (!editingPartner || !newBinaanItem.name) {
      showToast('Mohon masukkan nama jamaah binaan');
      return;
    }
    const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const newEntry = {
      id: `bin-${Date.now()}`,
      name: newBinaanItem.name.trim(),
      nij: newBinaanItem.nij.trim() || `AG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      packageName: newBinaanItem.packageName.trim(),
      status: newBinaanItem.status,
      commission: newBinaanItem.commission.trim() || 'Rp 1.500.000',
      date: dateStr
    };

    const currentList = editingPartner.binaanJamaah || [];
    const updatedList = [newEntry, ...currentList];
    const dummy = { ...editingPartner, binaanJamaah: updatedList };
    const comms = calculatePartnerCommissions(dummy);

    setEditingPartner({
      ...editingPartner,
      binaanJamaah: updatedList,
      totalJamaah: comms.totalJamaah,
      totalCommission: comms.totalCommission,
      paidCommission: comms.paidCommission,
      pendingCommission: comms.pendingCommission
    });

    setNewBinaanItem({
      name: '',
      nij: '',
      packageName: 'Umroh Reguler Syawal 1448 H (9 Hari)',
      status: 'DP Masuk',
      commission: 'Rp 1.500.000'
    });
    showToast(`✓ Jamaah binaan "${newEntry.name}" ditambahkan ke draft.`);
  };

  const handleRemoveBinaanFromPartner = (binaanId: string) => {
    if (!editingPartner) return;
    const updatedList = (editingPartner.binaanJamaah || []).filter(b => b.id !== binaanId);
    const dummy = { ...editingPartner, binaanJamaah: updatedList };
    const comms = calculatePartnerCommissions(dummy);

    setEditingPartner({
      ...editingPartner,
      binaanJamaah: updatedList,
      totalJamaah: comms.totalJamaah,
      totalCommission: comms.totalCommission,
      paidCommission: comms.paidCommission,
      pendingCommission: comms.pendingCommission
    });
    showToast('Jamaah binaan dihapus dari daftar.');
  };

  // DELETE: Trigger In-App Modal
  const requestDelete = (type: 'jamaah' | 'inquiry' | 'partner', id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      type,
      id,
      name
    });
  };

  // DELETE: Confirm Execution
  const handleConfirmDelete = async () => {
    const { type, id, name } = deleteModal;
    setDeleteModal({ ...deleteModal, isOpen: false });

    try {
      if (type === 'jamaah') {
        await deleteJamaahFromFirestore(id);
        showToast(`Data jamaah "${name}" berhasil dihapus.`);
      } else if (type === 'inquiry') {
        await deleteInquiryFromFirestore(id);
        showToast(`Pesan "${name}" berhasil dihapus.`);
      } else if (type === 'partner') {
        await deletePartnerFromFirestore(id);
        showToast(`Data permohonan mitra "${name}" berhasil dihapus.`);
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      showToast('Gagal menghapus data dari cloud database.');
    }
  };

  // Reset / Reseed
  const handleSeedData = async () => {
    setIsSeeding(true);
    await seedInitialFirestoreData();
    setIsSeeding(false);
    showToast('Data awal tersinkronisasi ke Cloud Database!');
  };

  const filteredJamaah = jamaahList
    .filter(j => {
      const q = jamaahSearch.toLowerCase();
      const matchesSearch = 
        j.fullName.toLowerCase().includes(q) ||
        j.nij.toLowerCase().includes(q) ||
        j.ktp.includes(q) ||
        j.phone.includes(q) ||
        j.packageName.toLowerCase().includes(q);
      const matchesStatus = 
        jamaahStatusFilter === 'all' 
          ? true 
          : jamaahStatusFilter === 'ready' 
          ? (j.progressStep || 1) === 5 
          : (j.progressStep || 1) < 5;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = parseTimestampToMillis(a.createdAt) || (a as any).createdTimestamp || 0;
      const timeB = parseTimestampToMillis(b.createdAt) || (b as any).createdTimestamp || 0;
      return timeB - timeA;
    });

  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
    showToast(`Nomor WA ${phone} berhasil disalin!`);
  };

  const cleanInquiryMessage = (msg: string) => {
    if (!msg) {
      return {
        mainText: '-',
        contextText: null,
        isAiChat: false,
        refCode: null,
        nik: null,
        rencana: null,
        kamar: null,
        email: null,
        kantor: null,
        badalNama: null,
        alamat: null,
        pesanText: null,
        isStructured: false,
        isBrochureDownload: false
      };
    }

    // 1. Detect if this was submitted from AI chat
    if (msg.includes('AI Concierge') || msg.includes('chat AI') || msg.includes('Tanya AI')) {
      let main = 'Permintaan Follow-up Konsultasi (Tanya AI)';
      let context: string | null = null;

      if (msg.includes('Pertanyaan: "')) {
        const match = msg.match(/Pertanyaan:\s*"([^"]+)"/);
        if (match) context = match[1];
      } else if (msg.includes('Riwayat chat terakhir:')) {
        const parts = msg.split('Riwayat chat terakhir:');
        if (parts[1]) {
          context = parts[1].replace(/\*\*/g, '').replace(/\*/g, '').replace(/###/g, '').trim();
          if (context.length > 250) {
            context = context.substring(0, 250) + '...';
          }
        }
      }

      return {
        mainText: main,
        contextText: context,
        isAiChat: true,
        refCode: null,
        nik: null,
        rencana: null,
        kamar: null,
        email: null,
        kantor: null,
        badalNama: null,
        alamat: null,
        pesanText: main,
        isStructured: false,
        isBrochureDownload: false
      };
    }

    // 2. Download Brosur detection
    if (msg.includes('Mengunduh e-Brosur')) {
      const pkg = msg.replace(/Mengunduh e-Brosur (?:Paket )?/i, '').trim();
      return {
        mainText: `Mengunduh e-Brosur: ${pkg}`,
        contextText: null,
        isAiChat: false,
        refCode: null,
        nik: null,
        rencana: null,
        kamar: null,
        email: null,
        kantor: null,
        badalNama: null,
        alamat: null,
        pesanText: `Mengunduh e-Brosur Paket ${pkg}`,
        isStructured: false,
        isBrochureDownload: true
      };
    }

    // 3. Structured parsing for Web Forms (ContactSection, Badal, ConsultationModal)
    const refMatch = msg.match(/\[([A-Z0-9\-\/]+)\]/);
    const refCode = refMatch ? refMatch[1] : null;

    const nikMatch = msg.match(/NIK:\s*([^.\n\r]+)/i);
    const nik = nikMatch ? nikMatch[1].trim() : null;

    const rencanaMatch = msg.match(/(?:Rencana|Rencana Berangkat):\s*([^.\n\r]+)/i);
    let rawRencana = rencanaMatch ? rencanaMatch[1].trim() : null;
    let rencana: string | null = null;
    if (rawRencana && rawRencana !== '-' && rawRencana.toLowerCase() !== 'null') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawRencana)) {
        const [y, m, d] = rawRencana.split('-');
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const monthName = months[parseInt(m, 10) - 1] || m;
        rencana = `${parseInt(d, 10)} ${monthName} ${y}`;
      } else {
        rencana = rawRencana;
      }
    }

    const kamarMatch = msg.match(/Kamar:\s*([^.\n\r]+)/i);
    const kamar = kamarMatch ? kamarMatch[1].trim() : null;

    const emailMatch = msg.match(/Email:\s*([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/i);
    const email = emailMatch ? emailMatch[1].trim() : null;

    const kantorMatch = msg.match(/Kantor:\s*([^,.\n\r]+)/i);
    const kantor = kantorMatch ? kantorMatch[1].trim() : null;

    const badalMatch = msg.match(/Badal Atas Nama:\s*([^.\n\r]+)/i);
    const badalNama = badalMatch ? badalMatch[1].trim() : null;

    const alamatMatch = msg.match(/Alamat(?: Sertifikat)?:\s*([^.\n\r]+)/i);
    const alamat = alamatMatch ? alamatMatch[1].trim() : null;

    let pesanText: string | null = null;
    const pesanMatch = msg.match(/(?:Pesan|Catatan|Pertanyaan):\s*(.+)/is);
    if (pesanMatch) {
      pesanText = pesanMatch[1].trim();
    } else {
      // Fallback: jika pesan berisi [REF/...] tetapi tidak ada awalan "Pesan:",
      // ambil teks sisa (misal teks "promo" atau permohonan konsultasi)
      let leftover = msg.replace(/\[[A-Z0-9\-\/]+\]/g, '').trim();
      leftover = leftover
        .replace(/NIK:\s*[^.\n\r]+/i, '')
        .replace(/(?:Rencana|Rencana Berangkat):\s*[^.\n\r]+/i, '')
        .replace(/Kamar:\s*[^.\n\r]+/i, '')
        .replace(/Email:\s*[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/i, '')
        .replace(/Kantor:\s*[^,.\n\r]+/i, '')
        .replace(/Badal Atas Nama:\s*[^.\n\r]+/i, '')
        .replace(/Alamat(?: Sertifikat)?:\s*[^.\n\r]+/i, '')
        .trim();
      if (leftover && leftover !== '-') {
        pesanText = leftover;
      }
    }

    const isStructured = Boolean(refCode || nik || rencana || kamar || kantor || badalNama);

    // Clean standard message text
    const cleanText = msg.replace(/\*\*/g, '').replace(/###/g, '').trim();

    return {
      mainText: cleanText,
      contextText: null,
      isAiChat: false,
      refCode,
      nik,
      rencana,
      kamar,
      email,
      kantor,
      badalNama,
      alamat,
      pesanText: pesanText || (isStructured ? null : cleanText),
      isStructured,
      isBrochureDownload: false
    };
  };

  const filteredInquiries = inquiriesList.filter(i => {
    const q = inquirySearch.toLowerCase();
    const matchesSearch = 
      i.name.toLowerCase().includes(q) ||
      i.phone.includes(q) ||
      (i.email && i.email.toLowerCase().includes(q)) ||
      i.packageInterest.toLowerCase().includes(q) ||
      (i.message && i.message.toLowerCase().includes(q));

    const itemStatus = i.status || 'Baru';
    const matchesStatus = inquiryStatusFilter === 'all' || itemStatus === inquiryStatusFilter;
    const matchesType = inquiryTypeFilter === 'all' || i.type === inquiryTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const newInquiriesCount = inquiriesList.filter(i => (i.status || 'Baru') === 'Baru').length;
  const aiInquiriesCount = inquiriesList.filter(i => i.type === 'Tanya AI').length;
  const pendingPartnersCount = partnersList.filter(p => (p.status || 'Menunggu Verifikasi') === 'Menunggu Verifikasi' || (p.status as string) === 'Pending').length;

  const filteredPartners = partnersList.filter(p => {
    const q = partnerSearch.toLowerCase().trim();
    const matchesSearch = !q || (
      p.name.toLowerCase().includes(q) ||
      (p.partnerCode && p.partnerCode.toLowerCase().includes(q)) ||
      p.phone.includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.tier.toLowerCase().includes(q)
    );

    const isApproved = p.status === 'Disetujui';
    const matchesStatus = 
      partnerStatusFilter === 'all' 
        ? true 
        : partnerStatusFilter === 'Disetujui' 
        ? isApproved 
        : !isApproved; // 'pending' matches Menunggu Verifikasi, Dihubungi, etc.

    return matchesSearch && matchesStatus;
  });

  // ---------------- LOGIN SCREEN (KHUSUS ADMIN, TANPA NAVBAR PUBLIK) ----------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#141414] text-white relative">
        {/* Back Office Top Bar on Login */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:px-8 flex items-center justify-between border-b border-white/10 bg-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <AlGhanimLogo />
            <div className="hidden sm:block">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block">
                Back Office &amp; CMS Console
              </span>
              <span className="text-[11px] text-gray-400">
                PT. Al-Ghanimah Berkah Bersama (Mandala 525)
              </span>
            </div>
          </div>

          {onBackToPublicWebsite && (
            <button
              onClick={onBackToPublicWebsite}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Lihat Website Jamaah</span>
            </button>
          )}
        </div>

        <div className="w-full max-w-md p-8 rounded-3xl bg-[#1E1E1E] border border-white/10 shadow-2xl space-y-6 text-white mt-12">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#141414] p-2 flex items-center justify-center mx-auto border border-[#C5A059]/40 shadow-xl overflow-hidden">
              <img
                src="/alghanim_logo.png"
                alt="Logo Resmi ALGHANIM"
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
              Selamat Datang, Admin ALGHANIM
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Portal Otentikasi Khusus Staf &amp; Manajemen ALGHANIM untuk mengelola manifest jamaah, pesan calon jamaah, dan CMS paket.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-1.5">
                Kata Sandi Otorisasi Admin
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi admin..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#C5A059] rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-gray-300 space-y-1">
                <p className="font-semibold text-[#C5A059] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>Petunjuk Akses Sistem:</span>
                </p>
                <p className="text-gray-400">
                  {adminAuth?.customPassword ? (
                    <span>Gunakan kata sandi kustom yang telah diatur oleh admin resmi (atau sandi master).</span>
                  ) : (
                    <span>Kata sandi bawaan awal: <code className="text-[#C5A059] font-bold">alghanim2026</code> atau <code className="text-[#C5A059] font-bold">garut525</code></span>
                  )}
                </p>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#C5A059] hover:bg-[#B38E46] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-[#C5A059]/20 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              <span>Buka Dashboard Operasional</span>
            </button>

            {onBackToPublicWebsite && (
              <button
                type="button"
                onClick={onBackToPublicWebsite}
                className="w-full py-2.5 text-center text-xs text-gray-400 hover:text-white transition-colors cursor-pointer block"
              >
                ← Kembali ke Halaman Utama Jamaah
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // ---------------- AUTHENTICATED DASHBOARD (KHUSUS ADMIN) ----------------
  return (
    <div className="h-screen w-full bg-[#F4F6F8] text-[#1A1A1A] flex flex-col md:flex-row overflow-hidden font-sans-luxury">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1A1A1A] text-white shadow-2xl border border-gray-700 text-xs animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* MOBILE SIDEBAR BACKDROP */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* =========================================================================
          1. NAVIGASI KIRI (SIDEBAR) - MODERN BACK OFFICE ARCHETYPE
      ========================================================================== */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#141414] text-white flex flex-col border-r border-white/10 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:h-screen md:overflow-hidden flex-shrink-0 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header: Brand & Admin Identity (Satu-satunya Tampilan Profil Admin & Logo) */}
        <div className="p-5 border-b border-white/10 flex flex-col gap-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlGhanimLogo size="sm" theme="dark" />
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profil Admin Resmi & Status Real-Time */}
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div className="min-w-0">
              <p className="font-bold text-white text-xs truncate">{adminAuth?.adminName || 'Admin ALGHANIM'}</p>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <span>Staf Operasional</span>
              </p>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono flex-shrink-0">
              ONLINE
            </span>
          </div>
        </div>

        {/* Sidebar Menu Sections */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Section 1: Operasional & Data Jamaah */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Operasional &amp; Jamaah
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveAdminTab('jamaah');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeAdminTab === 'jamaah'
                    ? 'bg-[#C5A059] text-white font-bold shadow-md shadow-[#C5A059]/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Manifest Jamaah</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeAdminTab === 'jamaah' ? 'bg-white/25 text-white' : 'bg-white/10 text-gray-300'
                }`}>
                  {jamaahList.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab('inquiries');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeAdminTab === 'inquiries'
                    ? 'bg-[#C5A059] text-white font-bold shadow-md shadow-[#C5A059]/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Pesan &amp; Leads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {newInquiriesCount > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                      {newInquiriesCount} Baru
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeAdminTab === 'inquiries' ? 'bg-white/25 text-white' : 'bg-white/10 text-gray-300'
                  }`}>
                    {inquiriesList.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab('partners');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeAdminTab === 'partners'
                    ? 'bg-[#C5A059] text-white font-bold shadow-md shadow-[#C5A059]/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4" />
                  <span>Mitra Syiar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pendingPartnersCount > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                      {pendingPartnersCount} Baru
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeAdminTab === 'partners' ? 'bg-white/25 text-white' : 'bg-white/10 text-gray-300'
                  }`}>
                    {partnersList.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Section 2: CMS & Pengaturan Konten */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Manajemen Konten (CMS)
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveAdminTab('packages');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeAdminTab === 'packages'
                    ? 'bg-[#C5A059] text-white font-bold shadow-md shadow-[#C5A059]/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Paket Umroh &amp; Haji</span>
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab('banners');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeAdminTab === 'banners'
                    ? 'bg-[#C5A059] text-white font-bold shadow-md shadow-[#C5A059]/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Banner Promo Bulanan</span>
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab('galeri');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeAdminTab === 'galeri'
                    ? 'bg-[#C5A059] text-white font-bold shadow-md shadow-[#C5A059]/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Dokumentasi Galeri Real</span>
              </button>

              <button
                onClick={() => {
                  setActiveAdminTab('testimonials');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeAdminTab === 'testimonials'
                    ? 'bg-[#C5A059] text-white font-bold shadow-md shadow-[#C5A059]/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4" />
                  <span>Ulasan &amp; Testimoni</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeAdminTab === 'testimonials' ? 'bg-white/25 text-white' : 'bg-white/10 text-gray-300'
                }`}>
                  {testimonialsList.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Section 3: Dokumentasi & Bantuan */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Sistem &amp; Panduan
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveAdminTab('guide');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeAdminTab === 'guide'
                    ? 'bg-[#C5A059] text-white font-bold shadow-md shadow-[#C5A059]/20'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Buku Panduan Admin (SOP)</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: Quick Actions & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#101010] flex-shrink-0">
          {/* Quick Actions in Sidebar Footer */}
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
              title="Ganti Kata Sandi & Kelola Akses Admin"
            >
              <Key className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Ganti Sandi</span>
            </button>

            {onBackToPublicWebsite && (
              <button
                onClick={onBackToPublicWebsite}
                className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#C5A059] hover:text-[#DFC285] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                title="Buka Website Publik Jamaah"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Lihat Web</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            title="Keluar dari sesi admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Admin</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          2. KONTEN UTAMA (HEADER ATAS + METRIC CARDS + TABEL & WIDGET)
      ========================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden">
        
        {/* HEADER ATAS (TOP BAR) - Sticky top-0 mengikuti scroll admin */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-sm flex-shrink-0">
          {/* Sisi Kiri: Hamburger Mobile & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>Back Office</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="font-semibold text-[#A67C52]">
                  {activeAdminTab === 'jamaah' && 'Manifest Jamaah'}
                  {activeAdminTab === 'inquiries' && 'Pesan & Leads'}
                  {activeAdminTab === 'partners' && 'Mitra Syiar'}
                  {activeAdminTab === 'packages' && 'CMS Paket Umroh & Haji'}
                  {activeAdminTab === 'banners' && 'CMS Banner Promo'}
                  {activeAdminTab === 'galeri' && 'CMS Galeri & Dokumentasi'}
                  {activeAdminTab === 'guide' && 'Buku Panduan (SOP)'}
                </span>
              </div>
              <h1 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1A1A1A] truncate">
                {activeAdminTab === 'jamaah' && 'Kelola Manifest & Live Tracking Jamaah'}
                {activeAdminTab === 'inquiries' && 'Log Pesan Konsultasi & Leads Calon Jamaah'}
                {activeAdminTab === 'partners' && 'Permohonan Kemitraan Cabang & Agen'}
                {activeAdminTab === 'packages' && 'Kelola Katalog Paket Umroh & Haji'}
                {activeAdminTab === 'banners' && 'Kelola Banner & Flyer Promo'}
                {activeAdminTab === 'galeri' && 'Kelola Foto & Galeri Keberangkatan'}
                {activeAdminTab === 'guide' && 'Buku Panduan Penggunaan Sistem Admin'}
              </h1>
            </div>
          </div>

          {/* Sisi Kanan: Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Tombol Notifikasi Pesan Baru */}
            <button
              onClick={() => setActiveAdminTab('inquiries')}
              className={`relative p-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                newInquiriesCount > 0 
                  ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100' 
                  : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
              }`}
              title={`${newInquiriesCount} pesan baru belum dihubungi`}
            >
              <Bell className="w-4 h-4" />
              {newInquiriesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {newInquiriesCount}
                </span>
              )}
            </button>

            {/* Tombol Sinkron Data Awal */}
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="hidden sm:flex px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-semibold text-gray-700 items-center gap-1.5 transition-colors cursor-pointer"
              title="Sinkronisasi Data Awal ke Cloud Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">Sinkron Data</span>
            </button>

            {/* Tombol Lihat Web Publik */}
            {onBackToPublicWebsite && (
              <button
                onClick={onBackToPublicWebsite}
                className="px-3 py-2 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Buka Website Publik Jamaah"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lihat Web</span>
              </button>
            )}
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">

          {/* =========================================================================
              3. METRIC CARDS (RINGKASAN STATISTIK ATAS)
          ========================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Jamaah */}
            <div 
              onClick={() => setActiveAdminTab('jamaah')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                activeAdminTab === 'jamaah' ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Manifest Jamaah</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1">
                {jamaahList.length}
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between">
                <span>{jamaahList.filter(j => (j.progressStep || 1) < 5).length} Antrean Persiapan</span>
                <span className="font-semibold text-emerald-600">{jamaahList.filter(j => (j.progressStep || 1) === 5).length} Siap Berangkat</span>
              </div>
            </div>

            {/* Card 2: Pesan & Leads */}
            <div 
              onClick={() => setActiveAdminTab('inquiries')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                activeAdminTab === 'inquiries' ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Pesan &amp; Leads</span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1 flex items-center gap-2">
                <span>{inquiriesList.length}</span>
                {newInquiriesCount > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {newInquiriesCount} Baru
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between">
                <span>{inquiriesList.filter(i => (i.status || 'Baru') === 'Baru').length} Belum Dihubungi</span>
                <span className="font-semibold text-blue-600">Klik untuk kelola</span>
              </div>
            </div>

            {/* Card 3: Mitra Syiar */}
            <div 
              onClick={() => setActiveAdminTab('partners')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                activeAdminTab === 'partners' ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Mitra Syiar</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1 flex items-center gap-2">
                <span>{partnersList.length}</span>
                {pendingPartnersCount > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                    {pendingPartnersCount} Menunggu
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between">
                <span>{partnersList.filter(p => p.status === 'Disetujui').length} Disetujui</span>
                <span className="font-semibold text-amber-600">{pendingPartnersCount} Menunggu</span>
              </div>
            </div>

            {/* Card 4: Katalog & Dokumentasi CMS */}
            <div 
              onClick={() => setActiveAdminTab('packages')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                activeAdminTab === 'packages' ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Katalog CMS</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1">
                {DETAILED_SCHEDULES.length} Paket
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between">
                <span>Banner &amp; Galeri</span>
                <span className="font-semibold text-purple-600">Aktif Real-Time</span>
              </div>
            </div>
          </div>

          {/* PANDUAN: DI MANA DATA INI DIISI? (ACCORDION) */}
          <div className="rounded-2xl border border-[#A67C52]/30 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowDataFlowGuide(!showDataFlowGuide)}>
              <div className="flex items-center gap-2.5">
                <Info className="w-5 h-5 text-[#A67C52]" />
                <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
                  Panduan Alur Pengisian Data &amp; Integrasi Front-to-Back:
                </h4>
              </div>
              <button className="text-xs font-semibold text-[#A67C52] hover:underline cursor-pointer">
                {showDataFlowGuide ? 'Sembunyikan Panduan' : 'Lihat Panduan'}
              </button>
            </div>

            {showDataFlowGuide && (
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-4 text-xs text-[#444444]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 1. Manifest Jamaah */}
                  <div className="p-3 bg-[#FBF9F6] rounded-xl border border-[#A67C52]/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#A67C52]">
                      <Users className="w-3.5 h-3.5" />
                      <span>1. Manifest Jamaah Pasca-DP</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Diinput oleh <strong>Staf Admin</strong> melalui tombol <em>"+ Tambah Jamaah Baru"</em>. Jamaah kemudian dapat melacak progres visa, paspor, dan tiketnya di menu <strong>"PORTAL JAMAAH"</strong>.
                    </p>
                  </div>

                  {/* 2. Log Pesan & Leads */}
                  <div className="p-3 bg-[#FBF9F6] rounded-xl border border-[#A67C52]/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#A67C52]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>2. Log Pesan &amp; Leads</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Diisi oleh <strong>Calon Jamaah</strong> via formulir <em>"KONSULTASI &amp; PENDAFTARAN"</em> di header, form di bagian Kontak, form FAQ, atau tombol Unduh Brosur PDF.
                    </p>
                  </div>

                  {/* 3. Pendaftaran Mitra Syiar */}
                  <div className="p-3 bg-[#FBF9F6] rounded-xl border border-[#A67C52]/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#A67C52]">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>3. Pendaftaran Mitra Syiar</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Diisi oleh <strong>Calon Mitra</strong> (Cabang / Agen / Marketer) melalui formulir registrasi di section <em>"KEMITRAAN"</em>.
                    </p>
                  </div>
                </div>

                {/* SOP 4 LANGKAH OPERASIONAL (Disatukan ke dalam accordion) */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A]">Alur Kerja Operasional Admin (SOP Manifest &amp; Tracking):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-white border border-gray-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#A67C52]">
                        <span className="w-4 h-4 rounded-full bg-[#A67C52]/15 text-[#A67C52] flex items-center justify-center text-[10px] font-extrabold">1</span>
                        <span>Input Jamaah Baru</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        Klik <strong>+ Tambah Jamaah</strong>, pilih kategori paket tanpa ketik manual, sistem otomatis menerbitkan <strong>Nomor NIJ</strong>.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-gray-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-extrabold">2</span>
                        <span>Kirim NIJ ke WhatsApp</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        Klik tombol hijau <strong>WA ↗</strong>. Format pesan bukti &amp; nomor NIJ terkirim otomatis ke HP jamaah.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-gray-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-blue-700">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-extrabold">3</span>
                        <span>Update Step 1-5 &amp; Kamar</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        Klik angka <strong>1-5</strong> atau tombol <strong>Edit</strong> untuk input nomor kamar &amp; status visa tiket.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-gray-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-purple-700">
                        <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-extrabold">4</span>
                        <span>Jamaah Lacak Mandiri</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        Jamaah cukup buka menu <strong>Portal Jamaah</strong> di web publik dan masukkan NIJ untuk transparansi akomodasi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tab Pills on mobile / small screens for fast switching */}
          <div className="md:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-none">
            <button
              onClick={() => setActiveAdminTab('jamaah')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeAdminTab === 'jamaah' ? 'bg-[#A67C52] text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              Manifest ({jamaahList.length})
            </button>
            <button
              onClick={() => setActiveAdminTab('inquiries')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeAdminTab === 'inquiries' ? 'bg-[#A67C52] text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              Pesan ({inquiriesList.length})
            </button>
            <button
              onClick={() => setActiveAdminTab('partners')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeAdminTab === 'partners' ? 'bg-[#A67C52] text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              Mitra ({partnersList.length})
            </button>
            <button
              onClick={() => setActiveAdminTab('packages')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeAdminTab === 'packages' ? 'bg-[#A67C52] text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              CMS Paket
            </button>
            <button
              onClick={() => setActiveAdminTab('banners')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeAdminTab === 'banners' ? 'bg-[#A67C52] text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              Banner
            </button>
            <button
              onClick={() => setActiveAdminTab('galeri')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeAdminTab === 'galeri' ? 'bg-[#A67C52] text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              Galeri
            </button>
            <button
              onClick={() => setActiveAdminTab('guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeAdminTab === 'guide' ? 'bg-[#A67C52] text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              Panduan
            </button>
          </div>

          {/* =========================================================================
              4. TABEL & WIDGET (AREA KONTEN FITUR REAL ALGHANIM)
          ========================================================================== */}
          {activeAdminTab === 'jamaah' && (
        <div className="space-y-4">
          {/* TOOLBAR AKSI ADMIN: SEARCH, FILTER, VIEW SWITCHER & PRIMARY CTA */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                    Manifest &amp; Live Tracking Jamaah
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    {jamaahList.length} Jamaah
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Semua perubahan data langsung tersinkronisasi detik itu juga ke Portal Jamaah.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Visual Cards View Only (Sesuai Permintaan User: Hanya Kartu Visual, Hapus Tabel) */}
                <div className="flex items-center bg-[#FAF8F5] px-3 py-2 rounded-xl border border-[#A67C52]/30 text-[#A67C52] text-xs font-bold gap-1.5 shadow-2xs">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Tampilan Kartu Visual</span>
                </div>

                {/* Tombol Primary: Tambah Jamaah */}
                <button
                  onClick={() => setIsAddJamaahOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Jamaah Baru</span>
                </button>

                {/* Dropdown / Opsi Data Contoh (agar rapi dan tidak acak-acakan) */}
                <div className="relative">
                  <button
                    onClick={() => setShowDemoOptionsDropdown(!showDemoOptionsDropdown)}
                    className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-200"
                    title="Opsi data simulasi dan reset"
                  >
                    <span>Opsi Data</span>
                    <span className="text-[10px]">▾</span>
                  </button>

                  {showDemoOptionsDropdown && (
                    <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-30 space-y-1 text-left">
                      {jamaahList.length > 0 ? (
                        <button
                          onClick={() => {
                            setShowDemoOptionsDropdown(false);
                            handleOpenClearDemoModal();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                          <span>Bersihkan Data Contoh</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowDemoOptionsDropdown(false);
                            handleExecuteReloadDemoJamaah();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-amber-800 hover:bg-amber-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4 text-amber-600" />
                          <span>Muat Data Contoh</span>
                        </button>
                      )}
                      <div className="text-[10px] text-gray-400 px-3 py-1 border-t border-gray-100">
                        Gunakan untuk mengosongkan manifest sebelum input jamaah asli.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BARIS PENCARIAN & FILTER STATUS (Hapus Opsi DP sesuai Permintaan User) */}
            <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 sm:max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari Nama / NIJ / KTP / No HP / Paket..."
                  value={jamaahSearch}
                  onChange={(e) => setJamaahSearch(e.target.value)}
                  className="w-full bg-[#F8F7F5] border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52] focus:bg-white transition-all"
                />
                {jamaahSearch && (
                  <button
                    onClick={() => setJamaahSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter Badges: Antrean Persiapan (Step 1-4) vs Siap Berangkat (Step 5) vs Semua Riwayat */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => setJamaahStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    jamaahStatusFilter === 'pending'
                      ? 'bg-[#A67C52] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Antrean Persiapan ({jamaahList.filter(j => (j.progressStep || 1) < 5).length})
                </button>
                <button
                  type="button"
                  onClick={() => setJamaahStatusFilter('ready')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    jamaahStatusFilter === 'ready'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  Siap Berangkat ({jamaahList.filter(j => (j.progressStep || 1) === 5).length})
                </button>
                <button
                  type="button"
                  onClick={() => setJamaahStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    jamaahStatusFilter === 'all'
                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Semua Riwayat ({jamaahList.length})
                </button>
              </div>
            </div>
          </div>

          {filteredJamaah.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#F5F5F5] border border-dashed border-gray-300 space-y-3">
              <Users className="w-10 h-10 text-gray-400 mx-auto" />
              <h4 className="font-bold text-sm text-[#1A1A1A]">Belum Ada Data Jamaah</h4>
              <p className="text-xs text-[#666666] max-w-md mx-auto leading-relaxed">
                Database manifest bersih dari data simulasi dan siap digunakan untuk mencatat jamaah riil Al-Ghanim. Gunakan tombol "+ Tambah Jamaah Baru" untuk mendaftarkan jamaah.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setIsAddJamaahOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  + Tambah Jamaah Baru
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReloadDemoJamaah}
                  disabled={isReloadingDemoLoading}
                  className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReloadingDemoLoading ? 'animate-spin' : ''}`} />
                  <span>{isReloadingDemoLoading ? 'Memuat Simulasi...' : 'Muat Contoh Simulasi'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================================
               TAMPILAN KARTU VISUAL (SESUAI PERMINTAAN USER: KARTU VISUAL TANPA TABEL)
            ========================================================================== */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredJamaah.map((jamaah) => (
                <div
                  key={jamaah.id}
                  className="bg-white rounded-2xl border border-gray-200/90 hover:border-[#A67C52]/50 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  {/* Top Color Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    jamaah.paymentStatus === 'Lunas' ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#A67C52] to-amber-500'
                  }`} />

                  {/* Header Kartu: Nama & Badge */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-[#1A1A1A] leading-tight">{jamaah.fullName}</h4>
                          {(jamaah.isConvertedFromInquiry || jamaah.notes?.includes('Hasil Konversi')) && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-900 border border-amber-500/40 flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              <span>Hasil Konversi dari Pesan</span>
                            </span>
                          )}
                          {isRecentActivity(jamaah.createdAt || (jamaah as any).createdTimestamp, 24) && !(jamaah.isConvertedFromInquiry || jamaah.notes?.includes('Hasil Konversi')) && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                              Baru
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#A67C52] font-semibold">
                          <span>NIJ: {jamaah.nij}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(jamaah.nij);
                              showToast(`NIJ ${jamaah.nij} disalin!`);
                            }}
                            className="text-gray-400 hover:text-[#A67C52] transition-colors p-0.5"
                            title="Salin NIJ"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        jamaah.paymentStatus === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {jamaah.paymentStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span>KTP: {jamaah.ktp || '-'}</span>
                      <span>•</span>
                      <span>WA: {jamaah.phone}</span>
                    </div>
                  </div>

                  {/* Ringkasan Paket & Akomodasi */}
                  <div className="p-3 rounded-xl bg-[#F9F8F6] border border-stone-200/80 space-y-2 text-xs">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Paket &amp; Jadwal:</div>
                      <div className="font-bold text-xs text-[#A67C52] leading-snug">{jamaah.packageName}</div>
                      <div className="text-[11px] text-gray-600 flex items-center gap-1.5 mt-0.5">
                        <Plane className="w-3 h-3 text-gray-500" />
                        <span>{jamaah.departureDate} ({jamaah.airline})</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 space-y-1 text-[11px] text-gray-600">
                      <div className="flex items-start gap-1.5">
                        <BedDouble className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-gray-800">Makkah:</span> {jamaah.hotelMakkah}
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <BedDouble className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-gray-800">Madinah:</span> {jamaah.hotelMadinah}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banner Informasi untuk Data Hasil Konversi dari Pesan */}
                  {(jamaah.isConvertedFromInquiry || jamaah.notes?.includes('Hasil Konversi')) && (
                    <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 flex items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-amber-950">Data Konversi dari Formulir Web</p>
                          <p className="text-[10px] text-amber-800 truncate">NIK &amp; WA tersalin. Silakan lengkapi akomodasi &amp; paspor.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingJamaah(jamaah);
                          setIsEditJamaahOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] whitespace-nowrap cursor-pointer transition-colors shadow-xs"
                      >
                        Lengkapi Data
                      </button>
                    </div>
                  )}

                  {/* Tahapan Progres 5-Step Interaktif */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-gray-700">Progres Kesiapan:</span>
                      <span className={`font-bold ${jamaah.progressStep === 5 ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200' : 'text-[#A67C52]'}`}>
                        {jamaah.progressStep === 1 && 'Tahap 1: DP & Pendaftaran'}
                        {jamaah.progressStep === 2 && 'Tahap 2: Dokumen & Paspor'}
                        {jamaah.progressStep === 3 && 'Tahap 3: Pelunasan, Hotel & Manasik'}
                        {jamaah.progressStep === 4 && 'Tahap 4: E-Visa & Tiket'}
                        {jamaah.progressStep === 5 && 'Tahap 5: Siap Berangkat'}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => {
                        const isReached = jamaah.progressStep >= s;
                        const isCurrentStep5 = jamaah.progressStep === 5 && s === 5;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleUpdateStep(jamaah.id, s as any)}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isCurrentStep5
                                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                                : isReached
                                ? 'bg-[#A67C52] text-white shadow-xs'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700'
                            }`}
                            title={s === 5 ? 'Tahap 5: Pindahkan ke Siap Berangkat' : `Ubah ke Tahap ${s}`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                      <span>DP Masuk: <strong className="text-gray-700">{jamaah.dpAmount}</strong></span>
                      <span>Pelunasan: <strong className={jamaah.paymentStatus === 'Lunas' ? 'text-emerald-700' : 'text-amber-700'}>{jamaah.paymentStatus}</strong></span>
                    </div>
                  </div>

                  {/* Tombol Aksi Lengkap Kartu */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5">
                    {/* Tombol WA Langsung */}
                    <a
                      href={formatWhatsAppLink(jamaah.phone, getJamaahRegistrationWAMessage(jamaah))}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      title="Kirim Bukti Registrasi & NIJ ke WhatsApp Jamaah"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Kirim WA</span>
                    </a>

                    {/* PDF Dropdown Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActivePdfDropdownId(activePdfDropdownId === jamaah.id ? null : jamaah.id)}
                        className="py-2 px-3 rounded-xl bg-[#A67C52]/10 hover:bg-[#A67C52]/20 text-[#A67C52] text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer border border-[#A67C52]/30"
                        title="Unduh Dokumen PDF"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>PDF ▾</span>
                      </button>

                      {activePdfDropdownId === jamaah.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-30 animate-in fade-in-50 duration-150 text-left">
                          <button
                            onClick={() => {
                              generateJamaahRegistrationSlipPDF(jamaah);
                              setActivePdfDropdownId(null);
                              showToast(`PDF Lembar Registrasi ${jamaah.nij} diunduh!`);
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-[#A67C52]/10 hover:text-[#A67C52] text-[#1A1A1A] font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#A67C52]" />
                            <div>
                              <div className="font-bold">Lembar Registrasi &amp; NIJ</div>
                              <div className="text-[10px] text-gray-500 font-normal">Bukti Booking &amp; Spesifikasi</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              generateJamaahTrackingCardPDF(jamaah);
                              setActivePdfDropdownId(null);
                              showToast(`PDF Kartu Tracking ${jamaah.nij} diunduh!`);
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-[#A67C52]/10 hover:text-[#A67C52] text-[#1A1A1A] font-semibold flex items-center gap-2 cursor-pointer transition-colors border-t border-gray-100"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#A67C52]" />
                            <div>
                              <div className="font-bold">Kartu Status &amp; Tracking</div>
                              <div className="text-[10px] text-gray-500 font-normal">Milestone Step 1-5</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              generatePassportRecommendationPDF(jamaah);
                              setActivePdfDropdownId(null);
                              showToast(`PDF Surat Rekomendasi Paspor diunduh!`);
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-[#A67C52]/10 hover:text-[#A67C52] text-[#1A1A1A] font-semibold flex items-center gap-2 cursor-pointer transition-colors border-t border-gray-100"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#A67C52]" />
                            <div>
                              <div className="font-bold">Surat Rekomendasi Paspor</div>
                              <div className="text-[10px] text-gray-500 font-normal">Untuk Kantor Imigrasi</div>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Tombol Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingJamaah(jamaah);
                        setIsEditJamaahOpen(true);
                      }}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                      title="Edit Data Lengkap Jamaah"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Tombol Hapus */}
                    <button
                      type="button"
                      onClick={() => requestDelete('jamaah', jamaah.id, jamaah.fullName)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Hapus Jamaah"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB 2: LOG PESAN & PERTANYAAN (CRUD) ---------------- */}
      {activeAdminTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F8F7F5] border border-gray-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                  Log Pesan, Konsultasi &amp; Leads Jamaah
                </h3>
                {newInquiriesCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-xs animate-pulse">
                    {newInquiriesCount} Pesan Baru
                  </span>
                )}
              </div>
              <p className="text-xs text-[#666666] mt-0.5">
                Setiap pesan chat AI, formulir konsultasi, unduh e-brosur, dan kontak tersimpan otomatis &amp; terurut realtime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, no WA, pesan..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                />
              </div>

              <button
                onClick={() => setIsAddInquiryOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Input Log Baru</span>
              </button>
            </div>
          </div>

          {/* Quick Sub-Filter Tabs & Bulk Action Controls */}
          <div className="space-y-3 border-b border-gray-200 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => { setInquiryStatusFilter('all'); setInquiryTypeFilter('all'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    inquiryStatusFilter === 'all' && inquiryTypeFilter === 'all'
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semua ({inquiriesList.length})
                </button>

                <button
                  onClick={() => { setInquiryStatusFilter('Baru'); setInquiryTypeFilter('all'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    inquiryStatusFilter === 'Baru'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Baru / Belum Dihubungi ({newInquiriesCount})</span>
                </button>


                <button
                  onClick={() => { setInquiryStatusFilter('Dihubungi'); setInquiryTypeFilter('all'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    inquiryStatusFilter === 'Dihubungi'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  Dihubungi ({inquiriesList.filter(i => i.status === 'Dihubungi').length})
                </button>

                <button
                  onClick={() => { setInquiryStatusFilter('Selesai'); setInquiryTypeFilter('all'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    inquiryStatusFilter === 'Selesai'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  Selesai ({inquiriesList.filter(i => i.status === 'Selesai').length})
                </button>
              </div>

              {/* Master Select All and Bulk Clean Options */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectAllInquiries(filteredInquiries)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <input
                    type="checkbox"
                    checked={filteredInquiries.length > 0 && selectedInquiryIds.length === filteredInquiries.length}
                    onChange={() => {}} // Handled by button onClick
                    className="rounded text-[#A67C52] cursor-pointer"
                  />
                  <span>Pilih Semua ({selectedInquiryIds.length}/{filteredInquiries.length})</span>
                </button>

                {inquiriesList.some(i => i.status === 'Selesai') && (
                  <button
                    onClick={() => handleRequestBulkDelete('completed')}
                    title="Hapus semua pesan yang sudah bertatus 'Selesai'"
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-700 text-xs font-semibold transition-colors cursor-pointer border border-gray-200 hover:border-rose-200"
                  >
                    Bersihkan Status 'Selesai'
                  </button>
                )}

                {inquiriesList.length > 0 && (
                  <button
                    onClick={() => handleRequestBulkDelete('all')}
                    title="Kosongkan seluruh log pesan & leads"
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer border border-rose-200 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Semua Log</span>
                  </button>
                )}
              </div>
            </div>

            {/* FLOATING / STICKY BULK ACTION BAR */}
            {selectedInquiryIds.length > 0 && (
              <div className="p-3 rounded-2xl bg-[#1A1A1A] text-white flex flex-wrap items-center justify-between gap-3 shadow-lg animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A67C52] animate-ping"></span>
                  <span className="text-xs font-bold">
                    {selectedInquiryIds.length} Pesan Terpilih
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleBulkMarkStatus('Dihubungi')}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Tandai Dihubungi
                  </button>

                  <button
                    onClick={() => handleBulkMarkStatus('Selesai')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Tandai Selesai
                  </button>

                  <button
                    onClick={() => handleRequestBulkDelete('selected')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Terpilih ({selectedInquiryIds.length})</span>
                  </button>

                  <button
                    onClick={() => setSelectedInquiryIds([])}
                    className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          {filteredInquiries.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#F8F7F5] border border-dashed border-gray-300 space-y-3">
              <MessageSquare className="w-10 h-10 text-gray-400 mx-auto" />
              <h4 className="font-bold text-sm text-[#1A1A1A]">Tidak Ada Pesan yang Sesuai</h4>
              <p className="text-xs text-[#666666]">
                Ubah kata kunci pencarian atau ganti filter status di atas untuk melihat data lainnya.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInquiries.map((inq) => {
                const isNew = (inq.status || 'Baru') === 'Baru';
                const isRecent = isRecentActivity((inq as any).timestampISO || (inq as any).timestamp || inq.createdAt, 48);
                const formattedTime = formatDateTimeFriendly((inq as any).timestampISO || (inq as any).timestamp || inq.createdAt);
                const parsedMsg = cleanInquiryMessage(inq.message);
                const isSelected = selectedInquiryIds.includes(inq.id);

                return (
                  <div 
                    key={inq.id} 
                    className={`p-5 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md relative ${
                      isSelected
                        ? 'border-[#A67C52] ring-2 ring-[#A67C52]/40 bg-[#FAF8F5]'
                        : isNew 
                        ? 'border-amber-300 ring-1 ring-amber-200/60 bg-gradient-to-b from-amber-50/20 to-white' 
                        : 'border-gray-200 hover:border-[#A67C52]/40'
                    }`}
                  >
                    {/* Top Meta Bar */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Selection Checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectInquiry(inq.id)}
                            className="rounded text-[#A67C52] w-4 h-4 cursor-pointer focus:ring-[#A67C52]"
                            title="Pilih item untuk aksi massal"
                          />

                          {/* Type Badge */}
                          <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#A67C52] text-[10px] font-bold uppercase tracking-wider border border-[#A67C52]/20 flex items-center gap-1">
                            {inq.type === 'Tanya AI' ? <Bot className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                            <span>{inq.type}</span>
                          </span>

                          {/* New Message Highlight */}
                          {isNew && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                              <span>Pesan Baru</span>
                            </span>
                          )}
                        </div>

                        {/* Date Time */}
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{formattedTime}</span>
                        </div>
                      </div>

                      {/* Contact Info Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-bold text-base text-[#1A1A1A] leading-snug">
                            {inq.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs">
                            <span className="text-[#A67C52] font-semibold">Minat:</span>
                            <span className="text-gray-700 bg-stone-100 px-2 py-0.5 rounded-md font-medium text-[11px]">
                              {inq.packageInterest || 'Konsultasi Umum'}
                            </span>
                          </div>
                          {inq.email && (
                            <p className="text-[11px] text-gray-500 mt-0.5">{inq.email}</p>
                          )}
                        </div>

                        {/* Status Selector */}
                        <div className="flex-shrink-0">
                          <select
                            value={inq.status || 'Baru'}
                            onChange={async (e) => {
                              const newStatus = e.target.value as 'Baru' | 'Dihubungi' | 'Selesai';
                              await updateInquiryStatusInFirestore(inq.id, newStatus);
                              showToast(`Status pesan "${inq.name}" diubah ke "${newStatus}"`);
                            }}
                            className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border outline-none cursor-pointer transition-colors shadow-2xs ${
                              inq.status === 'Selesai'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : inq.status === 'Dihubungi'
                                ? 'bg-sky-50 text-sky-800 border-sky-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Baru">🟡 Status: Baru</option>
                            <option value="Dihubungi">🔵 Status: Dihubungi</option>
                            <option value="Selesai">🟢 Status: Selesai</option>
                          </select>
                        </div>
                      </div>

                      {/* Formatted Content Area - Tata Letak Beruntun ke Bawah */}
                      <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 text-xs text-[#2A2A2A] space-y-2.5 leading-relaxed">
                        {parsedMsg.isStructured ? (
                          <div className="space-y-2.5">
                            {/* Ref Code Badge if available */}
                            {parsedMsg.refCode && (
                              <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/70">
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#A67C52]/15 text-[#8E653E] border border-[#A67C52]/30 font-mono">
                                  {parsedMsg.refCode}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  Rincian Pendaftaran
                                </span>
                              </div>
                            )}

                            {/* Stacked Fields (Beruntun ke bawah) */}
                            <div className="space-y-1.5 divide-y divide-stone-200/40">
                              {/* NIK / No. KTP */}
                              {parsedMsg.nik && (
                                <div className="flex items-start gap-2 pt-1 text-[11px]">
                                  <span className="text-gray-500 w-28 flex-shrink-0 font-medium flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-[#A67C52]" />
                                    NIK / No. KTP:
                                  </span>
                                  <span className={`font-semibold ${parsedMsg.nik === 'Belum diisi' ? 'text-gray-400 italic' : 'text-gray-900 font-mono tracking-wide'}`}>
                                    {parsedMsg.nik}
                                  </span>
                                </div>
                              )}

                              {/* Rencana Berangkat */}
                              {parsedMsg.rencana && parsedMsg.rencana !== '-' && (
                                <div className="flex items-start gap-2 pt-1 text-[11px]">
                                  <span className="text-gray-500 w-28 flex-shrink-0 font-medium flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#A67C52]" />
                                    Rencana Berangkat:
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    {parsedMsg.rencana}
                                  </span>
                                </div>
                              )}

                              {/* Tipe Kamar */}
                              {parsedMsg.kamar && (
                                <div className="flex items-start gap-2 pt-1 text-[11px]">
                                  <span className="text-gray-500 w-28 flex-shrink-0 font-medium flex items-center gap-1.5">
                                    <BedDouble className="w-3.5 h-3.5 text-[#A67C52]" />
                                    Tipe Kamar:
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    {parsedMsg.kamar}
                                  </span>
                                </div>
                              )}

                              {/* Email */}
                              {parsedMsg.email && parsedMsg.email !== '-' && (
                                <div className="flex items-start gap-2 pt-1 text-[11px]">
                                  <span className="text-gray-500 w-28 flex-shrink-0 font-medium flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-[#A67C52]" />
                                    Email:
                                  </span>
                                  <span className="text-gray-800 font-medium">
                                    {parsedMsg.email}
                                  </span>
                                </div>
                              )}

                              {/* Kantor Cabang */}
                              {parsedMsg.kantor && (
                                <div className="flex items-start gap-2 pt-1 text-[11px]">
                                  <span className="text-gray-500 w-28 flex-shrink-0 font-medium flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-[#A67C52]" />
                                    Kantor:
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    {parsedMsg.kantor}
                                  </span>
                                </div>
                              )}

                              {/* Badal Atas Nama */}
                              {parsedMsg.badalNama && (
                                <div className="flex items-start gap-2 pt-1 text-[11px]">
                                  <span className="text-gray-500 w-28 flex-shrink-0 font-medium">
                                    Badal Jiwa:
                                  </span>
                                  <span className="font-bold text-[#A67C52]">
                                    {parsedMsg.badalNama}
                                  </span>
                                </div>
                              )}

                              {/* Alamat Sertifikat */}
                              {parsedMsg.alamat && (
                                <div className="flex items-start gap-2 pt-1 text-[11px]">
                                  <span className="text-gray-500 w-28 flex-shrink-0 font-medium">
                                    Alamat:
                                  </span>
                                  <span className="text-gray-800">
                                    {parsedMsg.alamat}
                                  </span>
                                </div>
                              )}

                              {/* Pesan / Catatan Khusus */}
                              {parsedMsg.pesanText && parsedMsg.pesanText !== '-' && (
                                <div className="pt-1.5">
                                  <div className="text-[11px] text-gray-500 font-medium mb-1 flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3 text-[#A67C52]" />
                                    Pertanyaan / Catatan Jamaah:
                                  </div>
                                  <p className="text-gray-900 bg-white p-2.5 rounded-lg border border-stone-200/90 leading-relaxed text-xs font-medium shadow-2xs">
                                    {parsedMsg.pesanText}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : parsedMsg.isBrochureDownload ? (
                          <div className="flex items-center gap-2.5 text-emerald-800 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200">
                            <FileDown className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div>
                              <span className="font-bold text-xs">Aktivitas Calon Jamaah:</span>
                              <p className="text-xs text-emerald-900 font-medium">{parsedMsg.pesanText}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-[#A67C52] flex-shrink-0 mt-0.5" />
                            <div className="space-y-1 w-full">
                              <p className="font-semibold text-gray-900 leading-relaxed">
                                {parsedMsg.mainText}
                              </p>
                              {parsedMsg.contextText && (
                                <div className="p-2 rounded-lg bg-white border border-stone-200 text-gray-700 italic text-[11px]">
                                  "{parsedMsg.contextText}"
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">No. WA:</span>
                        <code className="text-xs font-bold text-[#1A1A1A] bg-gray-100 px-2 py-0.5 rounded-md font-mono">
                          {inq.phone}
                        </code>
                        <button
                          onClick={() => handleCopyPhone(inq.id, inq.phone)}
                          title="Salin Nomor WhatsApp"
                          className="p-1 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                          {copiedPhoneId === inq.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <a
                          href={formatWhatsAppLink(inq.phone, getInquiryWAMessage(inq, parsedMsg))}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            if ((inq.status || 'Baru') === 'Baru') {
                              updateInquiryStatusInFirestore(inq.id, 'Dihubungi');
                            }
                          }}
                          className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Hubungi via WA</span>
                        </a>

                        {/* 1-CLICK CONVERSION TO MANIFEST: Hanya untuk jamaah yang mengisi NIK & mengisi Formulir Pendaftaran Paket Ibadah */}
                        {(() => {
                          const isFormulirPendaftaran = Boolean(
                            inq.type === 'Formulir Pendaftaran Paket Ibadah' ||
                            inq.type?.toLowerCase().includes('pendaftaran') ||
                            inq.message?.toLowerCase().includes('formulir pendaftaran') ||
                            (parsedMsg.refCode && parsedMsg.refCode.startsWith('REF/AG')) ||
                            inq.message?.includes('Pendaftaran via Formulir')
                          );

                          const hasFilledNik = Boolean(
                            parsedMsg.nik &&
                            parsedMsg.nik !== 'Belum diisi' &&
                            parsedMsg.nik !== '-' &&
                            parsedMsg.nik.trim().length >= 4
                          );

                          // Tombol konversi HANYA muncul untuk Formulir Pendaftaran yang telah mengisi NIK
                          if (!isFormulirPendaftaran || !hasFilledNik) {
                            return null;
                          }

                          const alreadyInManifest = jamaahList.some(
                            j => j.fullName.trim().toLowerCase() === inq.name.trim().toLowerCase() ||
                            (j.phone && j.phone === inq.phone) ||
                            (parsedMsg.nik && j.ktp === parsedMsg.nik.trim())
                          );

                          if (alreadyInManifest) {
                            return (
                              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Tersedia di Manifest</span>
                              </span>
                            );
                          }

                          return (
                            <button
                              onClick={() => handleConvertToManifest(inq)}
                              disabled={convertingInquiryId === inq.id}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#A67C52] to-[#8E653E] hover:from-[#8E653E] hover:to-[#735130] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50 whitespace-nowrap"
                              title="Konversi otomatis NIK & WA calon jamaah ini ke Manifest resmi"
                            >
                              {convertingInquiryId === inq.id ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                              ) : (
                                <UserPlus className="w-3.5 h-3.5 text-white" />
                              )}
                              <span>Konversi ke Manifest</span>
                            </button>
                          );
                        })()}

                        {/* EDIT BUTTON */}
                        <button
                          onClick={() => handleOpenEditInquiry(inq)}
                          className="p-1.5 rounded-xl bg-gray-100 hover:bg-amber-50 text-gray-600 hover:text-amber-700 transition-colors cursor-pointer border border-transparent hover:border-amber-200"
                          title="Edit Data Pesan & Catatan Admin"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* DELETE SINGLE BUTTON */}
                        <button
                          onClick={() => requestDelete('inquiry', inq.id, inq.name)}
                          className="p-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-700 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                          title="Hapus Pesan Ini"
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
        </div>
      )}

      {/* ---------------- TAB 3: PENDAFTARAN MITRA (CRUD) ---------------- */}
      {activeAdminTab === 'partners' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                Permohonan Kemitraan (Cabang / Agen / Marketer)
              </h3>
              <p className="text-xs text-[#666666]">
                Calon mitra yang mengajukan pendaftaran kemitraan resmi syiar baitullah ALGHANIM &amp; Mandala 525.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari Nama / Kode Akses / WA / Kota..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                />
                {partnerSearch && (
                  <button
                    onClick={() => setPartnerSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsAddPartnerOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Mitra Manual</span>
              </button>
            </div>
          </div>

          {/* Status Category Tabs: Menunggu Verifikasi (Antrean) vs Disetujui (Resmi) vs Semua */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setPartnerStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                partnerStatusFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Menunggu Verifikasi ({partnersList.filter(p => p.status !== 'Disetujui').length})
            </button>
            <button
              onClick={() => setPartnerStatusFilter('Disetujui')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                partnerStatusFilter === 'Disetujui'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Disetujui / Aktif ({partnersList.filter(p => p.status === 'Disetujui').length})
            </button>
            <button
              onClick={() => setPartnerStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                partnerStatusFilter === 'all'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semua Mitra ({partnersList.length})
            </button>
          </div>

          {filteredPartners.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#F5F5F5] border border-dashed border-gray-300 space-y-3">
              <Building2 className="w-10 h-10 text-gray-400 mx-auto" />
              <h4 className="font-bold text-sm text-[#1A1A1A]">
                {partnerStatusFilter === 'pending' 
                  ? 'Tidak Ada Mitra Menunggu Verifikasi' 
                  : partnerStatusFilter === 'Disetujui' 
                  ? 'Belum Ada Mitra yang Disetujui' 
                  : 'Belum Ada Pendaftaran Mitra'}
              </h4>
              <p className="text-xs text-[#666666]">
                {partnerStatusFilter === 'pending'
                  ? 'Semua permohonan kemitraan telah disetujui atau belum ada pendaftaran baru.'
                  : 'Formulir kemitraan yang diisi di halaman kemitraan akan otomatis tersimpan di sini.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-left text-xs text-[#1A1A1A]">
                <thead className="bg-[#F5F5F5] border-b border-gray-200 font-bold uppercase tracking-wider text-[#666666]">
                  <tr>
                    <th className="p-4">Nama Mitra &amp; Kontak</th>
                    <th className="p-4">Kode Akses Portal</th>
                    <th className="p-4">Skema Kemitraan</th>
                    <th className="p-4">Domisili</th>
                    <th className="p-4">Status &amp; Jamaah</th>
                    <th className="p-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPartners.map((p) => {
                    const currentCode = p.partnerCode || (p.tier === 'Cabang' ? 'AG-CAB-001' : p.tier === 'Agen' ? 'AG-AGN-525' : 'AG-MKT-108');
                    const portalUrl = `${window.location.origin}${window.location.pathname}#/portal-mitra`;
                    const waShareMessage = `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nYth. Bpk/Ibu *${p.name}*,\n\nSelamat! Akun Kemitraan *${p.tier}* ALGHANIM Islamic Tour Anda telah aktif.\n\n*Kode Akses Portal Mitra Anda:* *${currentCode}*\n\nSilakan akses Portal Mandiri Kemitraan melalui tautan berikut:\n${portalUrl}\n\nMasukkan Kode Mitra di atas untuk melihat KTA digital, memantau komisi, mengunduh materi promosi, serta mendaftarkan jamaah binaan Anda.\n\nJazakumullah khairan katsiran.`;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-sm text-[#1A1A1A]">{p.name}</div>
                          <div className="text-[11px] text-gray-500 font-mono">WA: {p.phone}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {formatDateTimeFriendly((p as any).timestampISO || (p as any).timestamp || p.createdAt)}
                          </div>
                        </td>

                        {/* KODE KHUSUS PORTAL MITRA */}
                        <td className="p-4">
                          {p.partnerCode ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-300 font-mono font-bold text-xs text-[#1A1A1A]">
                              <span>{p.partnerCode}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(p.partnerCode!);
                                  showToast(`✓ Kode ${p.partnerCode} disalin!`);
                                }}
                                className="text-gray-400 hover:text-[#A67C52] cursor-pointer"
                                title="Salin Kode Mitra"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={async () => {
                                const newCode = generatePartnerCode(p.tier);
                                await updatePartnerInFirestore(p.id, { partnerCode: newCode });
                                showToast(`✓ Kode baru ${newCode} dibuat untuk ${p.name}!`);
                              }}
                              className="px-2 py-1 rounded-lg bg-[#FAF8F5] border border-[#A67C52]/40 text-[#A67C52] hover:bg-[#A67C52] hover:text-white text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                              title="Buat Kode Khusus Sekarang"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Buat Kode</span>
                            </button>
                          )}
                        </td>

                        {/* TINGKAT / SKEMA */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                            p.tier === 'Cabang'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : p.tier === 'Agen'
                              ? 'bg-sky-100 text-sky-900 border-sky-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            {p.tier}
                          </span>
                        </td>

                        <td className="p-4 font-medium text-gray-800">{p.city}</td>

                        {/* STATUS & BINAAN */}
                        <td className="p-4 space-y-1.5">
                          <select
                            value={p.status || 'Menunggu Verifikasi'}
                            onChange={async (e) => {
                              const newStatus = e.target.value as 'Menunggu Verifikasi' | 'Disetujui' | 'Dihubungi';
                              await updatePartnerStatusInFirestore(p.id, newStatus);
                              showToast(`Status mitra "${p.name}" diubah ke "${newStatus}"`);
                            }}
                            className={`text-xs font-bold rounded-xl px-2.5 py-1 border outline-none cursor-pointer block ${
                              p.status === 'Disetujui'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : p.status === 'Dihubungi'
                                ? 'bg-sky-50 text-sky-800 border-sky-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Menunggu Verifikasi">🟡 Menunggu Verifikasi</option>
                            <option value="Dihubungi">🔵 Dihubungi</option>
                            <option value="Disetujui">🟢 Disetujui (Aktif)</option>
                          </select>
                          {(() => {
                            const comms = calculatePartnerCommissions(p);
                            return (
                              <div className="text-[10px] text-gray-600 font-medium">
                                <span className="font-bold text-gray-900">{comms.totalJamaah} Jamaah</span>
                                <span className="mx-1 text-gray-300">•</span>
                                <span>Komisi: <strong className="text-emerald-700 font-serif-luxury">{comms.totalCommission}</strong></span>
                                {comms.pendingCommission && comms.pendingCommission !== 'Rp 0' && (
                                  <span className="block text-[9px] text-amber-700 font-semibold mt-0.5">
                                    Sedang Diproses: {comms.pendingCommission}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        {/* AKSI */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditPartner(p)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Edit Mitra, Atur Komisi & Kelola Jamaah Binaan"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                              <span>Kelola</span>
                            </button>

                            <a
                              href={formatWhatsAppLink(p.phone, waShareMessage)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                              title="Kirim Kode Akses & Tautan Portal via WhatsApp"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Kirim WA</span>
                            </a>

                            <button
                              onClick={() => requestDelete('partner', p.id, p.name)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Hapus Permohonan"
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
          )}
        </div>
      )}

      {/* ---------------- TAB 4: KELOLA PAKET UMROH & HAJI (CMS) ---------------- */}
      {activeAdminTab === 'packages' && (
        <AdminPackagesCMS />
      )}

      {/* ---------------- TAB 5: BANNER PROMO BULANAN (CMS) ---------------- */}
      {activeAdminTab === 'banners' && (
        <AdminBannersCMS />
      )}

      {/* ---------------- TAB 6: DOKUMENTASI & GALERI REAL (CMS) ---------------- */}
      {activeAdminTab === 'galeri' && (
        <AdminGalleryCMS />
      )}

      {/* ---------------- TAB: ULASAN & TESTIMONI JAMAAH (CMS) ---------------- */}
      {activeAdminTab === 'testimonials' && (
        <AdminTestimonialsCMS
          testimonials={testimonialsList}
          onAddTestimonial={addTestimonialToFirestore}
          onUpdateTestimonial={updateTestimonialInFirestore}
          onDeleteTestimonial={deleteTestimonialFromFirestore}
          onShowToast={showToast}
        />
      )}

      {/* ---------------- TAB 7: BUKU PANDUAN PENGGUNAAN ADMIN ---------------- */}
      {activeAdminTab === 'guide' && (
        <AdminUserGuide />
      )}


      {/* ---------------- MODAL IN-APP DELETE CONFIRMATION ---------------- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-gray-200 shadow-2xl text-[#1A1A1A]">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                Konfirmasi Hapus Data
              </h3>
              <p className="text-xs text-gray-600">
                Apakah Anda yakin ingin menghapus data <strong className="text-rose-600">"{deleteModal.name}"</strong> secara permanen dari Cloud Database Firestore?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-colors"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL INPUT JAMAAH BARU ---------------- */}
      {isAddJamaahOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                Input Data Jamaah Baru (Cloud Database)
              </h3>
              <button
                onClick={() => setIsAddJamaahOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddJamaah} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nama Lengkap Jamaah *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: H. Suparman"
                    value={newJamaah.fullName}
                    onChange={(e) => setNewJamaah({ ...newJamaah, fullName: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nomor KTP (16 Digit) *</label>
                  <input
                    type="text"
                    required
                    placeholder="320501xxxxxx"
                    value={newJamaah.ktp}
                    onChange={(e) => setNewJamaah({ ...newJamaah, ktp: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxx"
                    value={newJamaah.phone}
                    onChange={(e) => setNewJamaah({ ...newJamaah, phone: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Tanggal Lahir (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={newJamaah.birthDate}
                    onChange={(e) => setNewJamaah({ ...newJamaah, birthDate: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Pilihan Paket Ibadah *</label>
                <PackageCategorySelector
                  value={newJamaah.packageName || ''}
                  onChange={(selectedPkg) => setNewJamaah({ ...newJamaah, packageName: selectedPkg })}
                  onAutoSetPrice={(price) => setNewJamaah((prev) => ({ ...prev, totalAmount: price }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Tanggal Keberangkatan</label>
                  <input
                    type="text"
                    value={newJamaah.departureDate}
                    onChange={(e) => setNewJamaah({ ...newJamaah, departureDate: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Maskapai Penerbangan</label>
                  <input
                    type="text"
                    value={newJamaah.airline}
                    onChange={(e) => setNewJamaah({ ...newJamaah, airline: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              {/* HOTEL & ALOKASI NOMOR KAMAR */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#A67C52]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-[#A67C52]" />
                    <span>Akomodasi Hotel &amp; Alokasi Nomor Kamar</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    ✨ Jarak Otomatis Terhitung di Portal
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Hotel Makkah</label>
                    <input
                      type="text"
                      placeholder="Cth: Swissotel Al Maqam Makkah"
                      value={newJamaah.hotelMakkah || ''}
                      onChange={(e) => setNewJamaah({ ...newJamaah, hotelMakkah: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">No. Kamar Makkah</label>
                    <input
                      type="text"
                      placeholder="Cth: 1204 / Tower 2 (Kosongkan jika belum plotting)"
                      value={newJamaah.roomMakkahNumber || ''}
                      onChange={(e) => setNewJamaah({ ...newJamaah, roomMakkahNumber: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Hotel Madinah</label>
                    <input
                      type="text"
                      placeholder="Cth: Dallah Taibah Madinah"
                      value={newJamaah.hotelMadinah || ''}
                      onChange={(e) => setNewJamaah({ ...newJamaah, hotelMadinah: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">No. Kamar Madinah</label>
                    <input
                      type="text"
                      placeholder="Cth: 815 (Kosongkan jika belum plotting)"
                      value={newJamaah.roomMadinahNumber || ''}
                      onChange={(e) => setNewJamaah({ ...newJamaah, roomMadinahNumber: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Status Pembayaran</label>
                  <select
                    value={newJamaah.paymentStatus}
                    onChange={(e) => setNewJamaah({ ...newJamaah, paymentStatus: e.target.value as any })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none"
                  >
                    <option value="Lunas">Lunas</option>
                    <option value="Menunggu Pelunasan">Menunggu Pelunasan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Tahap Progres (1-5)</label>
                  <select
                    value={newJamaah.progressStep}
                    onChange={(e) => {
                      const step = Number(e.target.value) as any;
                      const patch: any = { progressStep: step };
                      if (step >= 2) patch.passportStatus = 'Lengkap & Terverifikasi di Kantor';
                      if (step >= 3) {
                        patch.paymentStatus = 'Lunas';
                        patch.remainingAmount = 'Rp 0 (LUNAS)';
                      }
                      if (step >= 4) patch.visaStatus = 'Visa Umroh Telah Terbit';
                      if (step >= 5) patch.equipmentStatus = 'Lengkap Diterima Jamaah';
                      setNewJamaah({ ...newJamaah, ...patch });
                    }}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none font-semibold"
                  >
                    <option value={1}>Tahap 1: DP &amp; Registrasi</option>
                    <option value={2}>Tahap 2: Dokumen &amp; Paspor Fisik</option>
                    <option value={3}>Tahap 3: Pelunasan, Hotel &amp; Manasik</option>
                    <option value={4}>Tahap 4: Visa Umroh &amp; Tiket PNR</option>
                    <option value={5}>Tahap 5: Siap Berangkat &amp; Perlengkapan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Jumlah DP Masuk</label>
                  <input
                    type="text"
                    value={newJamaah.dpAmount}
                    onChange={(e) => setNewJamaah({ ...newJamaah, dpAmount: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Catatan Tambahan untuk Jamaah</label>
                <textarea
                  rows={2}
                  value={newJamaah.notes}
                  onChange={(e) => setNewJamaah({ ...newJamaah, notes: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddJamaahOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Simpan Data Jamaah ke Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL SUCCESS & PDF GENERATION SETELAH INPUT JAMAAH ---------------- */}
      {savedJamaahSuccess && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[92vh] overflow-y-auto space-y-6 border border-[#A67C52]/30 shadow-2xl relative text-left">
            {/* Close X */}
            <button
              onClick={() => setSavedJamaahSuccess(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Header / Success Indicator */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="inline-block text-[11px] font-bold tracking-widest text-[#A67C52] uppercase bg-[#A67C52]/10 px-3 py-1 rounded-full">
                Registrasi Berhasil Disimpan
              </span>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">
                Alhamdulillah, Jamaah Terdaftar!
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Data resmi telah tersimpan di Cloud Database ALGHANIM. Silakan unduh dokumen PDF spesifikasi dan bagikan NIJ ke jamaah untuk live tracking.
              </p>
            </div>

            {/* Highlighted NIJ Card */}
            <div className="bg-[#FAF6F0] border-2 border-[#A67C52]/40 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#A67C52] uppercase tracking-wider">
                  Nomor Induk Jamaah (NIJ)
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {savedJamaahSuccess.paymentStatus}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#A67C52]/20">
                <div>
                  <div className="font-mono text-xl font-extrabold text-[#1A1A1A] tracking-wider">
                    {savedJamaahSuccess.nij}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Gunakan NIJ ini untuk cek progres di Portal Jamaah
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(savedJamaahSuccess.nij);
                    showToast(`NIJ ${savedJamaahSuccess.nij} berhasil disalin!`);
                  }}
                  className="px-3 py-2 bg-[#A67C52]/10 hover:bg-[#A67C52] text-[#A67C52] hover:text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  title="Salin Nomor NIJ"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </button>
              </div>

              {/* Summary Details */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#A67C52]/15">
                <div>
                  <span className="text-gray-400 text-[10px] block">Nama Lengkap</span>
                  <span className="font-bold text-[#1A1A1A]">{savedJamaahSuccess.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Nomor WhatsApp</span>
                  <span className="font-bold text-[#1A1A1A]">{savedJamaahSuccess.phone || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Program / Paket</span>
                  <span className="font-bold text-[#1A1A1A] line-clamp-1">{savedJamaahSuccess.packageName}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Jadwal Keberangkatan</span>
                  <span className="font-bold text-[#1A1A1A]">{savedJamaahSuccess.departureDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Pilih Aksi Dokumen &amp; Notifikasi:
              </div>

              {/* 1. Primary Button: Lembar Registrasi PDF */}
              <button
                type="button"
                onClick={() => {
                  generateJamaahRegistrationSlipPDF(savedJamaahSuccess);
                  showToast('PDF Lembar Registrasi & Spesifikasi berhasil diunduh!');
                }}
                className="w-full p-3.5 rounded-2xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold flex items-center justify-between transition-all shadow-md hover:shadow-lg cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <FileDown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold tracking-wide">Unduh Lembar Registrasi &amp; Spesifikasi (PDF)</div>
                    <div className="text-[11px] text-white/80 font-normal">Tanda terima resmi ber-NIJ, rincian biaya, akomodasi &amp; legalitas</div>
                  </div>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg group-hover:bg-white group-hover:text-[#A67C52] transition-colors">
                  PDF A4
                </span>
              </button>

              {/* 2. WhatsApp Direct Notify & Copy Message Action */}
              <div className="space-y-2">
                <a
                  href={formatWhatsAppLink(savedJamaahSuccess.phone, getJamaahRegistrationWAMessage(savedJamaahSuccess))}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold flex items-center justify-between transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold tracking-wide">Kirim Nomor NIJ &amp; Bukti via WhatsApp</div>
                      <div className="text-[11px] text-white/90 font-normal">Otomatis buka WhatsApp ke no HP ({savedJamaahSuccess.phone || '-'})</div>
                    </div>
                  </div>
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg font-bold">
                    Kirim WA ↗
                  </span>
                </a>

                {/* Copy WhatsApp Message Text Button */}
                <button
                  type="button"
                  onClick={() => {
                    const msg = getJamaahRegistrationWAMessage(savedJamaahSuccess);
                    navigator.clipboard.writeText(msg);
                    showToast('Format pesan WhatsApp berhasil disalin ke clipboard!');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-gray-200"
                >
                  <Copy className="w-3.5 h-3.5 text-[#A67C52]" />
                  <span>Salin Format Teks Pesan WhatsApp</span>
                </button>
              </div>

              {/* 3. Secondary Actions Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    generateJamaahTrackingCardPDF(savedJamaahSuccess);
                    showToast('PDF Kartu Tracking Progres berhasil diunduh!');
                  }}
                  className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] font-bold text-xs flex items-center gap-2.5 justify-center transition-colors cursor-pointer border border-gray-200"
                >
                  <ShieldCheck className="w-4 h-4 text-[#A67C52]" />
                  <span>Kartu Tracking (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    generatePassportRecommendationPDF(savedJamaahSuccess);
                    showToast('PDF Surat Rekomendasi Paspor berhasil diunduh!');
                  }}
                  className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] font-bold text-xs flex items-center gap-2.5 justify-center transition-colors cursor-pointer border border-gray-200"
                >
                  <Printer className="w-4 h-4 text-[#A67C52]" />
                  <span>Rekom Paspor (PDF)</span>
                </button>
              </div>
            </div>

            {/* Done & Return */}
            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSavedJamaahSuccess(null)}
                className="px-6 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Selesai &amp; Kembali ke Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL EDIT JAMAAH (UPDATE) ---------------- */}
      {isEditJamaahOpen && editingJamaah && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#A67C52] uppercase">Edit Data Jamaah</span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                  {editingJamaah.fullName} ({editingJamaah.nij})
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditJamaahOpen(false);
                  setEditingJamaah(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditJamaah} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nama Lengkap Jamaah *</label>
                  <input
                    type="text"
                    required
                    value={editingJamaah.fullName}
                    onChange={(e) => setEditingJamaah({ ...editingJamaah, fullName: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nomor KTP (16 Digit) *</label>
                  <input
                    type="text"
                    required
                    value={editingJamaah.ktp}
                    onChange={(e) => setEditingJamaah({ ...editingJamaah, ktp: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={editingJamaah.phone}
                    onChange={(e) => setEditingJamaah({ ...editingJamaah, phone: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Paket Ibadah Terdaftar</label>
                  <div className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[#1A1A1A] flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="w-2 h-2 rounded-full bg-[#A67C52] flex-shrink-0" />
                      <span className="font-semibold text-xs text-gray-800 truncate" title={editingJamaah.packageName}>
                        {editingJamaah.packageName || 'Paket Belum Ditentukan'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded-md flex-shrink-0 font-medium">
                      Sesuai Pendaftaran
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Tahap Progres (1-5)</label>
                  <select
                    value={editingJamaah.progressStep}
                    onChange={(e) => {
                      const step = Number(e.target.value) as 1 | 2 | 3 | 4 | 5;
                      const patch: Partial<JamaahProgressItem> = { progressStep: step };
                      if (step >= 2 && (!editingJamaah.passportStatus || editingJamaah.passportStatus.includes('Imigrasi') || editingJamaah.passportStatus.includes('Menunggu'))) {
                        patch.passportStatus = 'Lengkap & Terverifikasi di Kantor';
                      }
                      if (step >= 3) {
                        patch.paymentStatus = 'Lunas';
                        patch.remainingAmount = 'Rp 0 (LUNAS)';
                      }
                      if (step >= 4 && (!editingJamaah.visaStatus || editingJamaah.visaStatus.includes('Menunggu'))) {
                        patch.visaStatus = 'Visa Umroh Telah Terbit';
                      }
                      if (step < 3 && (!editingJamaah.equipmentStatus || editingJamaah.equipmentStatus === '')) {
                        patch.equipmentStatus = 'Menunggu Pelunasan';
                      }
                      if (step >= 3 && (!editingJamaah.equipmentStatus || editingJamaah.equipmentStatus === '' || editingJamaah.equipmentStatus === 'Menunggu Pelunasan')) {
                        patch.equipmentStatus = 'Dalam Proses Packing';
                      }
                      setEditingJamaah({ ...editingJamaah, ...patch });
                    }}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] font-semibold outline-none focus:border-[#A67C52]"
                  >
                    <option value={1}>Tahap 1: DP &amp; Registrasi</option>
                    <option value={2}>Tahap 2: Dokumen &amp; Paspor Fisik</option>
                    <option value={3}>Tahap 3: Pelunasan, Hotel &amp; Manasik</option>
                    <option value={4}>Tahap 4: Visa Umroh &amp; Tiket PNR</option>
                    <option value={5}>Tahap 5: Siap Berangkat &amp; Perlengkapan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Status Pembayaran</label>
                  <select
                    value={editingJamaah.paymentStatus}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      const patch: Partial<JamaahProgressItem> = { paymentStatus: val };
                      if (val === 'Lunas') {
                        patch.remainingAmount = 'Rp 0 (LUNAS)';
                        if (editingJamaah.progressStep < 3) {
                          patch.progressStep = 3;
                        }
                      }
                      setEditingJamaah({ ...editingJamaah, ...patch });
                    }}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  >
                    <option value="Lunas">Lunas (Otomatis Confirm Hotel)</option>
                    <option value="Menunggu Pelunasan">Menunggu Pelunasan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Status E-Visa Umroh</label>
                  <select
                    value={editingJamaah.visaStatus || 'Menunggu Pelunasan'}
                    onChange={(e) => setEditingJamaah({ ...editingJamaah, visaStatus: e.target.value as any })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  >
                    <option value="Visa Umroh Telah Terbit">✓ Visa Umroh Telah Terbit (Issued)</option>
                    <option value="Proses Approval Kemenag/MoFA">⏳ Proses Approval Kemenag/MoFA</option>
                    <option value="Menunggu Pelunasan">⚠️ Menunggu Pelunasan (Tahap 3)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">DP Masuk</label>
                  <input
                    type="text"
                    value={editingJamaah.dpAmount}
                    onChange={(e) => setEditingJamaah({ ...editingJamaah, dpAmount: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Total Biaya Paket</label>
                  <input
                    type="text"
                    value={editingJamaah.totalAmount}
                    onChange={(e) => setEditingJamaah({ ...editingJamaah, totalAmount: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Sisa Pembayaran</label>
                  <input
                    type="text"
                    value={editingJamaah.remainingAmount}
                    onChange={(e) => setEditingJamaah({ ...editingJamaah, remainingAmount: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              {/* DOKUMEN & PERLENGKAPAN */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#A67C52]/20 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Status Dokumen &amp; Perlengkapan Jamaah</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Status Paspor Fisik</label>
                    <select
                      value={editingJamaah.passportStatus || 'Lengkap & Terverifikasi di Kantor'}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, passportStatus: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    >
                      <option value="Lengkap & Terverifikasi di Kantor">✓ Lengkap &amp; Terverifikasi di Kantor (Siap)</option>
                      <option value="Proses Pembuatan di Kantor Imigrasi">⏳ Proses Pembuatan di Kantor Imigrasi</option>
                      <option value="Menunggu Penyerahan Fisik Jamaah">⚠️ Menunggu Penyerahan Fisik Jamaah</option>
                      <option value="Paspor Sudah Jadi (Siap Diambil)">📦 Paspor Sudah Jadi (Siap Diambil)</option>
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">
                      *Paspor fisik asli disimpan di kantor travel untuk scan biometrik &amp; pengajuan visa.
                    </p>
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Status Koper &amp; Perlengkapan</label>
                    <select
                      value={editingJamaah.equipmentStatus || 'Dalam Proses Packing'}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, equipmentStatus: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    >
                      <option value="Lengkap Diterima Jamaah">✓ Lengkap Diterima Jamaah</option>
                      <option value="Siap Diambil di Kantor Garut">📦 Siap Diambil di Kantor Garut</option>
                      <option value="Dalam Proses Packing">⏳ Dalam Proses Packing di Kantor</option>
                      <option value="Menunggu Pelunasan">⚠️ Menunggu Pelunasan (Tahap 3)</option>
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">
                      *Koper 24", tas paspor, kain ihram/mukena, dan batik resmi Al-Ghanim.
                    </p>
                  </div>
                </div>
              </div>

              {/* HOTEL & JARAK REALTIME */}
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#A67C52]" />
                    <span>Akomodasi Hotel &amp; Alokasi Kamar</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    ✨ Jarak Otomatis Dihitung di Portal Jamaah
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Nama Hotel Makkah</label>
                    <input
                      type="text"
                      placeholder="Cth: Swissotel Al Maqam Makkah"
                      value={editingJamaah.hotelMakkah || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, hotelMakkah: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Nama Hotel Madinah</label>
                    <input
                      type="text"
                      placeholder="Cth: Dallah Taibah Madinah"
                      value={editingJamaah.hotelMadinah || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, hotelMadinah: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>
                </div>
              </div>

              {/* KAMAR & REKAN SEKAMAR */}
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-[#A67C52]" />
                  <span>Pengaturan Kamar &amp; Rekan Sekamar</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Tipe Kamar</label>
                    <select
                      value={editingJamaah.roomType || 'QUAD (Sekamar Ber-4)'}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, roomType: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none"
                    >
                      <option value="QUAD (Sekamar Ber-4)">QUAD (Sekamar Ber-4)</option>
                      <option value="TRIPLE (Sekamar Ber-3)">TRIPLE (Sekamar Ber-3)</option>
                      <option value="DOUBLE (Sekamar Ber-2)">DOUBLE (Sekamar Ber-2)</option>
                      <option value="SINGLE (Sekamar Sendiri)">SINGLE (Sekamar Sendiri)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">No. Kamar Makkah</label>
                    <input
                      type="text"
                      placeholder="Cth: 1204 / Tower 2"
                      value={editingJamaah.roomMakkahNumber || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, roomMakkahNumber: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">No. Kamar Madinah</label>
                    <input
                      type="text"
                      placeholder="Cth: 815"
                      value={editingJamaah.roomMadinahNumber || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, roomMadinahNumber: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">
                    Rekan Sekamar (Pisahkan dengan koma atau baris baru)
                  </label>
                  <input
                    type="text"
                    placeholder="Cth: H. Dedi Suhendar, H. Ahmad Fauzi, H. Ridwan"
                    value={Array.isArray(editingJamaah.roommates) ? editingJamaah.roommates.join(', ') : (editingJamaah.roommates || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      const arr = val.split(',').map(s => s.trim()).filter(Boolean);
                      setEditingJamaah({ ...editingJamaah, roommates: arr });
                    }}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Nama rekan sekamar akan langsung tampil di portal transparansi jamaah.</p>
                </div>
              </div>

              {/* TIM PEMBIMBING LAPANGAN REAL */}
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#A67C52]" />
                  <span>Tim Pembimbing Lapangan (Muthawwif &amp; Tour Leader)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Nama Muthawwif / Pembimbing Ibadah</label>
                    <input
                      type="text"
                      placeholder="Cth: Ustadz H. Ahmad Fauzi, Lc."
                      value={editingJamaah.muthawifName || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, muthawifName: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">No. WhatsApp Muthawwif</label>
                    <input
                      type="text"
                      placeholder="Cth: 0813-1670-218"
                      value={editingJamaah.muthawifPhone || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, muthawifPhone: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Nama Tour Leader (TL)</label>
                    <input
                      type="text"
                      placeholder="Cth: H. Salman Al-Farisi"
                      value={editingJamaah.tourLeaderName || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, tourLeaderName: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">No. WhatsApp Tour Leader</label>
                    <input
                      type="text"
                      placeholder="Cth: 0812-9876-5432"
                      value={editingJamaah.tourLeaderPhone || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, tourLeaderPhone: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* TIKET & PENERBANGAN (Untuk Tahap 4 - Visa & Tiket) */}
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#A67C52]" />
                  <span>Detail Penerbangan &amp; Tiket (Muncul di Portal Jamaah Tahap 4-5)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Kode Booking (PNR)</label>
                    <input
                      type="text"
                      placeholder="Cth: SV-8192X"
                      value={editingJamaah.pnrCode || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, pnrCode: e.target.value.toUpperCase() })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono text-[#1A1A1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">No. E-Ticket</label>
                    <input
                      type="text"
                      placeholder="Cth: 065-241890123"
                      value={editingJamaah.ticketNumber || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, ticketNumber: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono text-[#1A1A1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Nomor Kursi (Seat)</label>
                    <input
                      type="text"
                      placeholder="Cth: 24K"
                      value={editingJamaah.seatNumber || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, seatNumber: e.target.value.toUpperCase() })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono text-[#1A1A1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs">Jam Kumpul Bandara</label>
                    <input
                      type="text"
                      placeholder="Cth: 4 Jam Sebelum Terbang"
                      value={editingJamaah.airportMeetingTime || ''}
                      onChange={(e) => setEditingJamaah({ ...editingJamaah, airportMeetingTime: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Catatan Staf / Info Khusus</label>
                <textarea
                  rows={2}
                  value={editingJamaah.notes}
                  onChange={(e) => setEditingJamaah({ ...editingJamaah, notes: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditJamaahOpen(false);
                    setEditingJamaah(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Perbarui Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL INPUT INQUIRY MANUAL ---------------- */}
      {isAddInquiryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 border border-gray-200 shadow-2xl text-[#1A1A1A]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                Input Log Pesan / Prospek Manual
              </h3>
              <button
                onClick={() => setIsAddInquiryOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInquiry} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Nama Calon Jamaah *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={newInquiry.name}
                  onChange={(e) => setNewInquiry({ ...newInquiry, name: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxx"
                    value={newInquiry.phone}
                    onChange={(e) => setNewInquiry({ ...newInquiry, phone: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Kategori</label>
                  <select
                    value={newInquiry.type}
                    onChange={(e) => setNewInquiry({ ...newInquiry, type: e.target.value as any })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none"
                  >
                    <option value="Konsultasi Layanan">Konsultasi Layanan</option>
                    <option value="Pesan Kontak">Pesan Kontak</option>
                    <option value="Download Brosur">Download Brosur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Minat Paket</label>
                <input
                  type="text"
                  placeholder="Umroh Reguler / VIP / Badal / dll"
                  value={newInquiry.packageInterest}
                  onChange={(e) => setNewInquiry({ ...newInquiry, packageInterest: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Isi Pesan / Catatan</label>
                <textarea
                  rows={3}
                  placeholder="Catatan kebutuhan calon jamaah..."
                  value={newInquiry.message}
                  onChange={(e) => setNewInquiry({ ...newInquiry, message: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddInquiryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold uppercase tracking-wider cursor-pointer"
                >
                  Simpan Pesan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL INPUT MITRA MANUAL ---------------- */}
      {isAddPartnerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 border border-gray-200 shadow-2xl text-[#1A1A1A]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                Input Pendaftaran Mitra Manual
              </h3>
              <button
                onClick={() => setIsAddPartnerOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Nama Calon Mitra *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap / Instansi"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxx"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Domisili / Kota</label>
                  <select
                    value={COMMON_REGIONS.includes(newPartner.city) ? newPartner.city : (newPartner.city ? 'other' : 'Garut')}
                    onChange={(e) => {
                      if (e.target.value === 'other') {
                        setNewPartner({ ...newPartner, city: '' });
                      } else {
                        setNewPartner({ ...newPartner, city: e.target.value });
                      }
                    }}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-[#1A1A1A] outline-none focus:border-[#A67C52] cursor-pointer text-sm"
                  >
                    <option value="">-- Pilih Kota / Domisili --</option>
                    {COMMON_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                    <option value="other">Kota Lainnya (Ketik Manual)...</option>
                  </select>
                  {(!COMMON_REGIONS.includes(newPartner.city) && newPartner.city !== undefined && newPartner.city !== '') && (
                    <input
                      type="text"
                      placeholder="Ketik nama kota/daerah..."
                      value={newPartner.city}
                      onChange={(e) => setNewPartner({ ...newPartner, city: e.target.value })}
                      className="w-full mt-2 bg-white border border-[#A67C52] rounded-xl px-3.5 py-2 text-sm text-[#1A1A1A] outline-none"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Tingkat / Skema Kemitraan *</label>
                  <select
                    value={newPartner.tier}
                    onChange={(e) => {
                      const selectedTier = e.target.value as 'Cabang' | 'Agen' | 'Marketer';
                      setNewPartner({ 
                        ...newPartner, 
                        tier: selectedTier,
                        partnerCode: generatePartnerCode(selectedTier)
                      });
                    }}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none"
                  >
                    <option value="Cabang">Kantor Cabang Resmi</option>
                    <option value="Agen">Keagenan Resmi Travel</option>
                    <option value="Marketer">Marketer Syiar Baitullah</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Status Kemitraan</label>
                  <select
                    value={newPartner.status}
                    onChange={(e) => setNewPartner({ ...newPartner, status: e.target.value as any })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none"
                  >
                    <option value="Disetujui">🟢 Disetujui (Langsung Aktif)</option>
                    <option value="Menunggu Verifikasi">🟡 Menunggu Verifikasi</option>
                  </select>
                </div>
              </div>

              {/* Input Kode Khusus Masuk Portal Mitra */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#A67C52]/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#1A1A1A] block">
                    Kode Khusus Mitra (Akses Masuk Portal) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPartner({ ...newPartner, partnerCode: generatePartnerCode(newPartner.tier) })}
                    className="text-[10px] font-bold text-[#A67C52] hover:text-[#8E653E] cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Acak Kode Baru</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: AG-CAB-101 / AG-AGN-525"
                    value={newPartner.partnerCode}
                    onChange={(e) => setNewPartner({ ...newPartner, partnerCode: e.target.value.toUpperCase() })}
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3.5 py-2 font-mono font-bold text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                  />
                  <span className="text-[11px] text-gray-500 hidden sm:inline">
                    Untuk login di Portal Mitra
                  </span>
                </div>
                <p className="text-[10px] text-gray-500">
                  Kode ini wajib diberikan kepada mitra agar bisa login ke Portal Mandiri Mitra di halaman kemitraan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1 text-xs whitespace-nowrap">Total Jamaah Awal</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={newPartner.totalJamaah === 0 ? '' : String(newPartner.totalJamaah)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      setNewPartner({ ...newPartner, totalJamaah: raw === '' ? 0 : parseInt(raw, 10) });
                    }}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1 text-xs whitespace-nowrap">Akumulasi Total Komisi</label>
                  <input
                    type="text"
                    placeholder="Rp 0"
                    value={newPartner.totalCommission}
                    onChange={(e) => setNewPartner({ ...newPartner, totalCommission: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none font-semibold text-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1 text-xs whitespace-nowrap">Komisi Menunggu Cair</label>
                  <input
                    type="text"
                    placeholder="Rp 0"
                    value={newPartner.pendingCommission}
                    onChange={(e) => setNewPartner({ ...newPartner, pendingCommission: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1 text-xs whitespace-nowrap">Komisi Sudah Cair</label>
                  <input
                    type="text"
                    placeholder="Rp 0"
                    value={newPartner.paidCommission}
                    onChange={(e) => setNewPartner({ ...newPartner, paidCommission: e.target.value })}
                    className="w-full bg-emerald-50/50 border border-emerald-300 text-emerald-900 font-bold rounded-xl px-3.5 py-2 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Latar Belakang / Catatan</label>
                <textarea
                  rows={2}
                  placeholder="Pengalaman atau rencana syiar kemitraan..."
                  value={newPartner.experience}
                  onChange={(e) => setNewPartner({ ...newPartner, experience: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold uppercase tracking-wider cursor-pointer"
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL EDIT MITRA & KELOLA JAMAAH BINAAN (CRUD REAL) ---------------- */}
      {isEditPartnerOpen && editingPartner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                    Kelola Mitra &amp; Jamaah Binaan
                  </h3>
                  <p className="text-xs text-gray-500">
                    Edit profil, hak komisi ujrah, dan kelola daftar jamaah binaan resmi
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditPartnerOpen(false);
                  setEditingPartner(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPartner} className="space-y-6 text-xs">
              {/* SECTION 1: PROFIL MITRA & KODE PORTAL */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#A67C52]/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Profil Mitra &amp; Akses Portal</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                    ID: {editingPartner.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Nama Lengkap Mitra *</label>
                    <input
                      type="text"
                      required
                      value={editingPartner.name}
                      onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">No. WhatsApp Mitra *</label>
                    <input
                      type="tel"
                      required
                      value={editingPartner.phone}
                      onChange={(e) => setEditingPartner({ ...editingPartner, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Jenjang Kemitraan</label>
                    <select
                      value={editingPartner.tier}
                      onChange={(e) => setEditingPartner({ ...editingPartner, tier: e.target.value as any })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none"
                    >
                      <option value="Cabang">Kantor Cabang Resmi</option>
                      <option value="Agen">Keagenan Resmi Travel</option>
                      <option value="Marketer">Marketer Syiar Baitullah</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Status Kemitraan</label>
                    <select
                      value={editingPartner.status}
                      onChange={(e) => setEditingPartner({ ...editingPartner, status: e.target.value as any })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none"
                    >
                      <option value="Disetujui">🟢 Disetujui (Aktif)</option>
                      <option value="Menunggu Verifikasi">🟡 Menunggu Verifikasi</option>
                      <option value="Dihubungi">🔵 Dihubungi</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Kode Akses Portal Mitra *</label>
                    <input
                      type="text"
                      required
                      value={editingPartner.partnerCode || ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, partnerCode: e.target.value.toUpperCase() })}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 font-mono font-bold text-[#A67C52] outline-none focus:border-[#A67C52]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: KOMISI & AKUMULASI */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#A67C52]" />
                    <span>Pengaturan Hak Komisi &amp; Ujrah</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const comms = calculatePartnerCommissions(editingPartner);
                      setEditingPartner({
                        ...editingPartner,
                        totalJamaah: comms.totalJamaah,
                        totalCommission: comms.totalCommission,
                        paidCommission: comms.paidCommission,
                        pendingCommission: comms.pendingCommission
                      });
                      showToast('✓ Komisi berhasil dihitung ulang otomatis dari data binaan');
                    }}
                    className="text-[11px] font-bold text-[#A67C52] hover:text-[#8E653E] cursor-pointer flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
                    title="Kalkulasi otomatis komisi dari jumlah dan status jamaah binaan"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Hitung Otomatis dari Binaan</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs whitespace-nowrap">Total Jamaah Binaan</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={editingPartner.totalJamaah !== undefined && editingPartner.totalJamaah !== null ? String(editingPartner.totalJamaah) : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setEditingPartner({ 
                          ...editingPartner, 
                          totalJamaah: raw === '' ? ('' as any) : parseInt(raw, 10) 
                        });
                      }}
                      onBlur={() => {
                        if (editingPartner.totalJamaah === '' || editingPartner.totalJamaah === undefined) {
                          setEditingPartner({ ...editingPartner, totalJamaah: 0 });
                        }
                      }}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs whitespace-nowrap">Akumulasi Total Komisi</label>
                    <input
                      type="text"
                      placeholder="Rp 0"
                      value={editingPartner.totalCommission !== undefined && editingPartner.totalCommission !== null ? editingPartner.totalCommission : ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, totalCommission: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none font-semibold text-[#A67C52] focus:border-[#A67C52]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs whitespace-nowrap">Komisi Menunggu Cair</label>
                    <input
                      type="text"
                      placeholder="Rp 0"
                      value={editingPartner.pendingCommission !== undefined && editingPartner.pendingCommission !== null ? editingPartner.pendingCommission : ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, pendingCommission: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1 text-xs whitespace-nowrap">Komisi Sudah Cair</label>
                    <input
                      type="text"
                      placeholder="Rp 0"
                      value={editingPartner.paidCommission !== undefined && editingPartner.paidCommission !== null ? editingPartner.paidCommission : ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, paidCommission: e.target.value })}
                      className="w-full bg-emerald-50/50 border border-emerald-300 text-emerald-900 font-bold rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: KELOLA DAFTAR JAMAAH BINAAN */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#A67C52]" />
                    <span className="font-serif-luxury text-base font-bold text-[#1A1A1A]">
                      Daftar Jamaah Binaan ({editingPartner.binaanJamaah?.length || 0})
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    Tampil langsung di Portal Mitra saat login
                  </span>
                </div>

                {/* Table Binaan */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                        <th className="py-2 px-2.5">Nama Jamaah</th>
                        <th className="py-2 px-2.5">Program Paket</th>
                        <th className="py-2 px-2.5">Status</th>
                        <th className="py-2 px-2.5">Komisi</th>
                        <th className="py-2 px-2.5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(editingPartner.binaanJamaah && editingPartner.binaanJamaah.length > 0) ? (
                        editingPartner.binaanJamaah.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="py-2.5 px-2.5">
                              <span className="font-bold text-gray-900 block">{b.name}</span>
                              <span className="text-[10px] text-gray-400">{b.date || '-'}</span>
                            </td>
                            <td className="py-2.5 px-2.5 text-gray-700">{b.packageName}</td>
                            <td className="py-2.5 px-2.5 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                b.status === 'Lunas' || b.status === 'Selesai'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-2.5 font-bold text-[#A67C52] whitespace-nowrap">
                              {b.commission}
                            </td>
                            <td className="py-2.5 px-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveBinaanFromPartner(b.id)}
                                className="p-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                title="Hapus Jamaah Binaan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-400">
                            Belum ada jamaah binaan terdaftar untuk mitra ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Sub-Form: Tambah Jamaah Binaan Manual */}
                <div className="pt-3 border-t border-gray-100 space-y-2.5 bg-[#FAF8F5] p-3.5 rounded-xl">
                  <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#A67C52]" />
                    <span>Tambah Jamaah Binaan ke Mitra Ini</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">Pilih Paket Jamaah Binaan (Kategori):</label>
                      <PackageCategorySelector
                        value={newBinaanItem.packageName}
                        onChange={(pkg) => setNewBinaanItem({ ...newBinaanItem, packageName: pkg })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-semibold text-gray-500 block mb-1">Nama Jamaah Binaan</label>
                        <input
                          type="text"
                          placeholder="Nama Jamaah (cth: H. Ridwan & Istri)..."
                          value={newBinaanItem.name}
                          onChange={(e) => setNewBinaanItem({ ...newBinaanItem, name: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-gray-500 block mb-1">Status Progres</label>
                        <select
                          value={newBinaanItem.status}
                          onChange={(e) => setNewBinaanItem({ ...newBinaanItem, status: e.target.value as any })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                        >
                          <option value="DP Masuk">DP Masuk / Terkonfirmasi</option>
                          <option value="Lunas">Lunas</option>
                          <option value="Selesai">Selesai Berangkat</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end gap-2.5 pt-1">
                      <div className="flex-1 w-full">
                        <label className="text-[10px] font-semibold text-gray-500 block mb-1">Estimasi Hak Ujrah / Komisi</label>
                        <input
                          type="text"
                          placeholder="Komisi (cth: Rp 1.500.000)"
                          value={newBinaanItem.commission}
                          onChange={(e) => setNewBinaanItem({ ...newBinaanItem, commission: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddBinaanToPartner}
                        className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Jamaah Binaan</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditPartnerOpen(false);
                    setEditingPartner(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Simpan Perubahan Mitra &amp; Binaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GANTI KATA SANDI & SERAH TERIMA ADMIN (FIRESTORE SYNC) */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#141414] border border-[#C5A059]/40 p-1 flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0">
                  <img
                    src="/alghanim_logo.png"
                    alt="Logo ALGHANIM"
                    className="w-full h-full object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                    Pengaturan Kata Sandi &amp; Akses Admin
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Sandi tersimpan di Cloud Database Firestore (Real-time Sync)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setChangePwError('');
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Info Status Akun Saat Ini */}
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-gray-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Pemegang Akses Admin:</span>
                <span className="font-bold text-[#1A1A1A]">
                  {adminAuth?.adminName || 'Admin ALGHANIM Garut'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Kontak WhatsApp Recovery:</span>
                <span className="font-bold text-[#1A1A1A]">
                  {adminAuth?.adminPhone || '0813-1670-218'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                <span className="text-gray-500 font-medium">Status Kata Sandi:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {adminAuth?.customPassword ? 'Sandi Kustom Aktif di Cloud' : 'Menggunakan Sandi Bawaan Awal'}
                </span>
              </div>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">
                  Kata Sandi Saat Ini / Sandi Master *
                </label>
                <input
                  type={showChangePwFields ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi saat ini atau master (alghanim2026 / garut525)"
                  value={changePwForm.currentPassword}
                  onChange={(e) => setChangePwForm({ ...changePwForm, currentPassword: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">
                    Kata Sandi Baru * (Min 6 Karakter)
                  </label>
                  <input
                    type={showChangePwFields ? 'text' : 'password'}
                    required
                    placeholder="Sandi baru..."
                    value={changePwForm.newPassword}
                    onChange={(e) => setChangePwForm({ ...changePwForm, newPassword: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">
                    Ulangi Sandi Baru *
                  </label>
                  <input
                    type={showChangePwFields ? 'text' : 'password'}
                    required
                    placeholder="Ketik ulang sandi baru..."
                    value={changePwForm.confirmPassword}
                    onChange={(e) => setChangePwForm({ ...changePwForm, confirmPassword: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPw"
                  checked={showChangePwFields}
                  onChange={(e) => setShowChangePwFields(e.target.checked)}
                  className="rounded text-[#A67C52] focus:ring-[#A67C52]"
                />
                <label htmlFor="showPw" className="text-gray-600 cursor-pointer select-none">
                  Tampilkan karakter kata sandi
                </label>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-3">
                <h4 className="font-bold text-[#1A1A1A] text-xs flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#A67C52]" />
                  <span>Identitas Pemegang Admin Baru (Opsional untuk Serah Terima):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Nama Pemegang Akun Admin</label>
                    <input
                      type="text"
                      placeholder="Contoh: Bu Hj. Siti (Admin Garut)"
                      value={changePwForm.adminName}
                      onChange={(e) => setChangePwForm({ ...changePwForm, adminName: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Nomor WA Pemegang Admin</label>
                    <input
                      type="tel"
                      placeholder="0813-1670-218"
                      value={changePwForm.adminPhone}
                      onChange={(e) => setChangePwForm({ ...changePwForm, adminPhone: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>
              </div>

              {changePwError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{changePwError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
                <p className="text-[10px] text-gray-500 leading-tight">
                  * Sandi master cadangan tetap dapat digunakan sewaktu-waktu oleh pihak berwenang jika sandi kustom terlupa.
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangePasswordOpen(false);
                      setChangePwError('');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="px-5 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {isSavingPassword ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan Sandi Baru</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DATA PESAN / LEADS INQUIRY */}
      {isEditInquiryOpen && editingInquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                    Edit Log Pesan &amp; Catatan Leads
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    ID Dokumen: <code className="font-mono text-gray-700">{editingInquiry.id}</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditInquiryOpen(false);
                  setEditingInquiry(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditInquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={editingInquiry.name}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, name: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={editingInquiry.phone}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, phone: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="nama@email.com (opsional)"
                    value={editingInquiry.email || ''}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, email: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Status Prospek</label>
                  <select
                    value={editingInquiry.status || 'Baru'}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, status: e.target.value as any })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none font-bold"
                  >
                    <option value="Baru">🟡 Status: Baru</option>
                    <option value="Dihubungi">🔵 Status: Dihubungi</option>
                    <option value="Selesai">🟢 Status: Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Kategori Pesan</label>
                  <select
                    value={editingInquiry.type}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, type: e.target.value as any })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none"
                  >
                    <option value="Konsultasi Layanan">Konsultasi Layanan</option>
                    <option value="Pesan Kontak">Pesan Kontak</option>
                    <option value="Download Brosur">Download Brosur</option>
                    <option value="Pesan Kontak & Brosur">Pesan Kontak &amp; Brosur</option>
                    <option value="Tanya AI">Tanya AI</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Paket yang Diminati</label>
                  <input
                    type="text"
                    value={editingInquiry.packageInterest}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, packageInterest: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Isi Pesan / Catatan Admin</label>
                <textarea
                  rows={4}
                  value={editingInquiry.message}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, message: e.target.value })}
                  className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditInquiryOpen(false);
                    setEditingInquiry(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI BULK DELETE / HAPUS BANYAK */}
      {bulkDeleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-rose-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif-luxury text-xl font-bold text-gray-900">
                {bulkDeleteModal.mode === 'all'
                  ? 'Hapus Semua Log Pesan?'
                  : bulkDeleteModal.mode === 'completed'
                  ? 'Bersihkan Pesan Berstatus Selesai?'
                  : `Hapus ${bulkDeleteModal.count} Pesan Terpilih?`}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {bulkDeleteModal.mode === 'all'
                  ? `Tindakan ini akan menghapus permanen seluruh (${bulkDeleteModal.count}) riwayat pesan, prospek, dan log chat AI dari Cloud Database Firestore.`
                  : bulkDeleteModal.mode === 'completed'
                  ? `Tindakan ini akan menghapus (${bulkDeleteModal.count}) pesan yang sudah berstatus 'Selesai' secara permanen untuk merapikan daftar.`
                  : `Sebanyak ${bulkDeleteModal.count} pesan yang Anda centang akan dihapus permanen dari Cloud Database Firestore.`}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>Data yang telah dihapus tidak dapat dipulihkan kembali. Pastikan data penting telah dihubungi atau disimpan.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBulkDeleteModal({ ...bulkDeleteModal, isOpen: false })}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IN-APP KONFIRMASI BERSIHKAN DATA CONTOH JAMAAH */}
      {isClearDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-rose-100 text-[#1A1A1A]">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif-luxury text-xl font-bold text-gray-900">
                Bersihkan Data Contoh?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tindakan ini akan mengosongkan seluruh data simulasi jamaah dari database Firestore. Database manifest akan bersih dan siap digunakan untuk pencatatan jamaah asli PT. Al-Ghanim dari nol.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>Data contoh akan dibersihkan agar database siap dipakai operasional resmi. Anda tetap dapat memuat ulang data contoh kapan saja bila ingin melakukan uji coba simulasi.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isClearingDemoLoading}
                onClick={() => setIsClearDemoModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isClearingDemoLoading}
                onClick={handleExecuteClearDemoJamaah}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isClearingDemoLoading ? 'Sedang Membersihkan...' : 'Ya, Bersihkan Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IN-APP KONFIRMASI MUAT KEMBALI DATA CONTOH JAMAAH */}
      {isReloadDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-amber-100 text-[#1A1A1A]">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <RefreshCw className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif-luxury text-xl font-bold text-gray-900">
                Muat Data Contoh Simulasi?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Data contoh simulasi jamaah akan dimuat kembali ke dalam database Firestore untuk keperluan demonstrasi fitur, pengetesan cetak berkas PDF, dan simulasi alur progres jamaah.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isReloadingDemoLoading}
                onClick={() => setIsReloadDemoModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isReloadingDemoLoading}
                onClick={handleExecuteReloadDemoJamaah}
                className="flex-1 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isReloadingDemoLoading ? 'Sedang Memuat...' : 'Ya, Muat Data Contoh'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

        </main>
      </div>
    </div>
  );
};
