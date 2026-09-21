export interface PackageFeature {
  icon: string;
  text: string;
}

export type ServiceCategory = 
  | 'all'
  | 'all-umroh'
  | 'umroh-reguler'
  | 'umroh-custom'
  | 'tabungan'
  | 'badal-umroh'
  | 'haji-khusus'
  | 'wisata-halal'
  | 'visa-tiket-la'
  | 'visa'
  | 'tiket-pesawat'
  | 'land-arrangements';

export interface FlightScheduleItem {
  flightNo: string;
  date: string;
  route: string;
  departureTime?: string;
  arrivalTime?: string;
  time?: string;
}

export interface HotelDetailItem {
  name: string;
  city?: string;
  distance?: string;
  image?: string;
  mapsUrl?: string;
  youtubeUrl?: string;
  rating?: number;
}

export interface ItineraryDayItem {
  day: number;
  dayName?: string;
  date?: string;
  time?: string;
  title: string;
  desc: string;
  meals?: string;
  image?: string;
}

export interface PackageScheduleItem {
  id: string;
  category: ServiceCategory;
  title: string;
  seriesTitle?: string;
  badge?: {
    text: string;
    variant: 'default' | 'premium' | 'exclusive' | 'saving';
  };
  highlightTag?: string;
  image: string;
  imageAlt: string;
  departureDate: string;
  duration: string;
  airline: string;
  airlineLogoText?: string;
  hotelMakkah: string;
  hotelMadinah: string;
  hotelDistanceMakkah: string;
  hotelDistanceMadinah?: string;
  price: string;
  originalPrice?: string;
  discountedPrice?: string;
  pricePrefix?: string;
  priceSuffix?: string;
  priceQuad?: string;
  priceTriple?: string;
  priceDouble?: string;
  quadPrice?: string;
  triplePrice?: string;
  doublePrice?: string;
  totalSeats: number;
  availableSeats: number;
  isFullBooked?: boolean;
  features: PackageFeature[];
  description: string;
  programHighlights: string[];
  flightSchedules?: FlightScheduleItem[];
  hotelMakkahDetail?: HotelDetailItem;
  hotelMadinahDetail?: HotelDetailItem;
  itineraryDays?: ItineraryDayItem[];
  flyerUrl?: string;
  itineraryPdfUrl?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface PackageItem {
  id: 'reguler' | 'custom' | 'tabungan' | 'badal' | 'haji' | 'halal-tour';
  badge?: {
    text: string;
    variant: 'default' | 'premium' | 'exclusive' | 'saving';
  };
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  pricePrefix: string;
  priceAmount: string;
  priceSuffix?: string;
  features: PackageFeature[];
  buttonText: string;
  buttonVariant: 'outline' | 'filled';
  bgPattern?: string;
  centerIcon?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  city: string;
  packageTaken: string;
  rating: number; // 1 - 5
  comment: string;
  avatar?: string;
  date: string;
  videoUrl?: string;
  nij?: string; // Optional NIJ for verification
  isVerified?: boolean;
  status?: 'approved' | 'pending' | 'hidden';
  adminReply?: {
    replyText: string;
    repliedAt: string;
    repliedBy: string; // e.g. "Manajemen ALGHANIM"
  };
  createdAt?: any;
  createdTimestamp?: number;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface GalleryPhotoItem {
  id: string;
  title: string;
  category: 'Makkah' | 'Madinah' | 'Keberangkatan' | 'Manasik' | 'Thaif' | string;
  image: string;
  location: string;
  year: string;
  mediaType?: 'photo' | 'video';
  videoUrl?: string;
  caption?: string;
  date?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'profil' | 'paket' | 'dokumen' | 'pembayaran' | 'manasik' | string;
  tags?: string[];
}

export interface SelectedRegistrationPackage {
  id?: string;
  name: string;
  category?: string;
  price?: string;
  duration?: string;
  date?: string;
  airline?: string;
  hotelMakkah?: string;
  hotelMadinah?: string;
  makkahDistance?: string;
  roomType?: 'Quad' | 'Triple' | 'Double' | string;
  quadPrice?: string;
  triplePrice?: string;
  doublePrice?: string;
  programHighlights?: string[];
}

export interface JamaahProgressItem {
  id: string;
  nij: string; // Nomor Induk Jamaah / Kode Booking e.g. AG-2026-001
  ktp: string; // No KTP e.g. 3205011234560001
  fullName: string;
  phone: string;
  birthDate: string; // YYYY-MM-DD
  packageName: string;
  departureDate: string;
  duration: string;
  airline: string;
  flightNumber: string;
  pnrCode?: string;
  ticketNumber?: string;
  seatNumber?: string;
  airportMeetingTime?: string;
  hotelMakkah: string;
  hotelMakkahDistance?: string;
  hotelMadinah: string;
  hotelMadinahDistance?: string;
  roomType?: string; // e.g. 'QUAD (Ber-4)' | 'TRIPLE (Ber-3)' | 'DOUBLE (Ber-2)'
  roomMakkahNumber?: string; // e.g. '1204'
  roomMadinahNumber?: string; // e.g. '0712'
  roommates?: string[]; // e.g. ['TEGUH WIJAYATA (Garut)', 'H. AHMAD FAUZI (Garut)', 'H. SUPARMAN (Bandung)']
  paymentStatus: 'DP Terbayar' | 'Lunas' | 'Menunggu Pelunasan';
  dpAmount: string;
  totalAmount: string;
  remainingAmount: string;
  progressStep: 1 | 2 | 3 | 4 | 5; // 1: Pendaftaran, 2: Dokumen, 3: Pelunasan & Manasik, 4: Visa & Tiket, 5: Siap Berangkat
  muthawifName: string;
  muthawifPhone: string;
  tourLeaderName?: string;
  tourLeaderPhone?: string;
  manasikDate: string;
  manasikLocation: string;
  passportStatus: 'Lengkap & Terverifikasi' | 'Lengkap & Terverifikasi di Kantor' | 'Dalam Proses Kantor Imigrasi' | 'Proses Pembuatan di Kantor Imigrasi' | 'Menunggu Penyerahan Fisik' | 'Menunggu Penyerahan Fisik Jamaah' | 'Paspor Sudah Jadi (Siap Diambil)' | string;
  visaStatus: 'Visa Umroh Telah Terbit' | 'Proses Approval Kemenag/MoFA' | 'Proses Pengajuan' | 'Menunggu Pelunasan' | string;
  equipmentStatus: 'Telah Diserahkan' | 'Lengkap Diterima Jamaah' | 'Siap Diambil di Kantor Garut' | 'Dalam Proses Packing' | 'Menunggu Pelunasan' | string;
  notes: string;
  isConvertedFromInquiry?: boolean;
  conversionDate?: string;
  createdAt?: any;
  createdTimestamp?: number;
  createdAtFormatted?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'Pesan Kontak' | 'Pesan Kontak & Brosur' | 'Tanya AI' | 'Download Brosur' | 'Pendaftaran Mitra' | 'Konsultasi Layanan' | 'Badal Umroh' | string;
  packageInterest: string;
  message: string;
  createdAt: string;
  status: 'Baru' | 'Dihubungi' | 'Selesai';
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface PartnerPilgrimItem {
  id: string;
  name: string;
  phone?: string;
  packageName: string;
  registeredDate: string;
  status: 'DP Terkonfirmasi' | 'Lunas' | 'Proses Visa' | 'Menunggu Pelunasan';
  commissionAmount: string; // e.g. "Rp 1.500.000"
}

export interface PartnerRegistrationItem {
  id: string;
  partnerCode?: string;
  name: string;
  phone: string;
  city: string;
  tier: 'Cabang' | 'Agen' | 'Marketer' | 'Marketer Syiar' | 'Marketer / Syiar Baitullah';
  experience?: string;
  createdAt: string;
  status: 'Menunggu Verifikasi' | 'Disetujui' | 'Dihubungi' | 'Aktif' | 'Nonaktif';
  totalJamaah?: number;
  totalCommission?: string;
  paidCommission?: string;
  pendingCommission?: string;
  binaanJamaah?: PartnerPilgrimItem[];
  address?: string;
  nik?: string;
  notes?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface ConsultationFormData {
  name: string;
  phone: string;
  email: string;
  preferredCity: 'Garut' | 'Bandung' | 'Online Zoom';
  packageInterest: string;
  pilgrimCount: number;
  plannedDate: string;
  notes: string;
}

export interface CustomQuoteState {
  pilgrimCount: number;
  durationDays: number;
  hotelClass: '5-star-front' | '5-star-standard' | '4-star-luxury';
  flightClass: 'Economy' | 'Business' | 'Private Charter';
  vehicleType: 'GMC Yukon / Alphard VIP' | 'Luxury HiAce VIP' | 'Coaster VIP';
  includeExecutiveLounge: boolean;
  dedicatedMutawwifLanguage: string;
  fullName: string;
  whatsapp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface PartnerItem {
  name: string;
  category: 'regulator' | 'airline' | 'media' | 'association';
  description: string;
}

export interface PromoBannerItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  imageUrl: string;
  targetLink: string;
  ctaText: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  aspectRatio?: 'portrait' | 'landscape' | 'square' | 'auto';
  posterSizeFormat?: 'flyer-vertical' | 'banner-horizontal' | 'story-9-16';
  createdAt?: any;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface SelectedRegistrationPackage {
  name: string;
  category?: string;
  price?: string;
  duration?: string;
  date?: string;
  quadPrice?: string;
  triplePrice?: string;
  doublePrice?: string;
}

export type TrashCategoryType = 'jamaah' | 'inquiry' | 'partner' | 'package' | 'banner' | 'gallery' | 'testimonial';

export interface TrashArchiveItem {
  id: string;
  collectionName: string;
  category: TrashCategoryType;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  deletedAt: string;
  deletedBy?: string;
  originalData: any;
}



