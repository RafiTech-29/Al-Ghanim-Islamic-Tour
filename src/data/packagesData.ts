import { 
  PackageItem, 
  PackageScheduleItem, 
  TestimonialItem, 
  GalleryPhotoItem, 
  FAQItem,
  JamaahProgressItem,
  InquiryItem,
  PartnerRegistrationItem
} from '../types';

// Real pilgrim documentation photos extracted from official Al-Ghanim archive
import thawafKabahImg from '../assets/images/jamaah_thawaf_kabah_real_1789632561174.jpg';
import qubaImg from '../assets/images/jamaah_masjid_quba_real_1789632579008.jpg';
import jabalUhudImg from '../assets/images/jamaah_jabal_uhud_real_1789632594196.jpg';
import nabawiKubahImg from '../assets/images/jamaah_nabawi_kubah_real_1789632612550.jpg';
import keluargaMakkahImg from '../assets/images/jamaah_keluarga_makkah_real_1789632625715.jpg';
import kajianNabawiImg from '../assets/images/jamaah_kajian_nabawi_real_1789632646013.jpg';
import bandaraImg from '../assets/images/jamaah_bandara_keberangkatan_real_1789632669210.jpg';

export {
  thawafKabahImg,
  qubaImg,
  jabalUhudImg,
  nabawiKubahImg,
  keluargaMakkahImg,
  kajianNabawiImg,
  bandaraImg
};

// Informasi Resmi Fasilitas Jamaah (Sesuai Brosur Resmi #SpesialisUmrohHemat)
export const OFFICIAL_PACKAGE_FACILITIES = {
  included: [
    'Tiket Pesawat PP (Direct Tanpa Transit)',
    'Akomodasi Hotel Sesuai Program',
    'Makan 3x Sehari Sesuai Program',
    'Tour Leader/Pembimbing Berpengalaman',
    'Asuransi Perjalanan',
    'Visa Umroh',
    'Handling Bandara Indonesia & Saudi',
    'Transportasi Bus AC Mekkah dan Madinah',
    'Manasik Umroh'
  ],
  excluded: [
    'Pembuatan Paspor',
    'Vaksin Meningitis & Polio',
    'Kelebihan Bagasi',
    'Koper'
  ],
  freePerks: [
    'Free Lounge Bandara Jakarta',
    'Free Transportasi Bandung - Jakarta PP',
    'Free Perlengkapan Umroh',
    'Free Air Zam-Zam 5 Liter',
    'Free City Tour Mekkah dan Madinah',
    'Free Bagasi 23 KG'
  ]
};

// Informasi Resmi Akomodasi Hotel
export const OFFICIAL_ACCOMMODATION = {
  makkah: {
    name: 'Maysan Al - Maqom',
    stars: '★★★★',
    rating: 4,
    distance: 'Dekat Dengan Masjid',
    note: 'atau setaraf',
    city: 'Makkah Al-Mukarramah'
  },
  madinah: {
    name: 'Jawharat Al Rasheed',
    stars: '★★★',
    rating: 3,
    distance: 'Dekat Dengan Masjid',
    note: 'atau setaraf',
    city: 'Madinah Al-Munawwarah'
  }
};

export const OFFICIAL_WA_NUMBER = '0813-1670-218';
export const OFFICIAL_WA_PHONE = '628131670218';

export const getCleanWhatsAppPhone = (phone?: string): string => {
  if (!phone) return '628131670218';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned.length >= 10 ? cleaned : '628131670218';
};

export const OFFICIAL_WA_LINK = 'https://wa.me/628131670218?text=Halo%20Admin%20Al-Ghanim,%20saya%20ingin%20konsultasi%20paket%20ibadah%20Umroh/Haji%20resmi.';

export const OFFICIAL_INSTAGRAM_URL = 'https://www.instagram.com/alghanimislamictour/';
export const OFFICIAL_INSTAGRAM_HANDLE = '@alghanimislamictour';

export const HERO_BG_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu14MqP5FaRC7u8QfJ3bvcpJHgDCoHkOgnWrzRP-snlFUXbCXTT7WullQ1qpYVSG8oow9ny8H3nNE6297iiN0RqUFKENIXn45qCrj9ZJ5r_DK7xMUAC84y0euARrRHknBaMj3_vG561-g3Qt0wQvdUaKOvI3KdsCpbaMGkNXF45Azy9A-PBVcaxhecyzoY5cQThjGmsNA-IbQkWw3cSq_347NgCVpz4JfwAryS4Im0sDb5mrQNhdrzSA';

// Copywriting Header & Slogan
export const BRAND_TAGLINES = {
  welcome: 'Selamat datang para tamu Allah di halaman website resmi Al-Ghanim',
  subheading: 'Nikmati kemudahan ibadah ke tanah suci dengan paket #HEMAT #AMANAH dan #RAMAH sejak 2013 hanya di Al-Ghanim',
  yearsExperience: 'Sejak 2013',
  alumniCount: '10.000+ Jamaah Telah Diberangkatkan',
  accreditation: 'Akreditasi A Kemenag RI'
};

// 10 Mengapa Memilih Al-Ghanim (Ringkas, Elegan, Padat & Jelas)
export const WHY_CHOOSE_US = [
  {
    number: '01',
    title: 'Harga Hemat & Transparan',
    desc: 'Biaya pasti dan transparan tanpa ada biaya siluman atau tersembunyi.'
  },
  {
    number: '02',
    title: 'Pelayanan Ramah & Nyaman',
    desc: 'Standar hospitality hangat yang siap memuliakan setiap tamu Allah.'
  },
  {
    number: '03',
    title: 'Legalitas Resmi Terjamin',
    desc: 'Izin resmi PPIU Kemenag RI & terintegrasi sistem SISKOPATUH.'
  },
  {
    number: '04',
    title: 'Pembimbing Berpengalaman',
    desc: 'Didampingi Asatidz & Muthawwif berkompeten sesuai tuntunan sunnah.'
  },
  {
    number: '05',
    title: 'Maskapai Unggulan Berjadwal',
    desc: 'Penerbangan terpercaya langsung (direct flight) ke Tanah Suci.'
  },
  {
    number: '06',
    title: 'Fasilitas Lounge Bandara',
    desc: 'Akses santai di Executive Airport Lounge sebelum penerbangan.'
  },
  {
    number: '07',
    title: 'Hotel Dekat Masjid',
    desc: 'Akomodasi nyaman berjarak dekat ke pelataran Haram & Nabawi.'
  },
  {
    number: '08',
    title: 'Bantuan Penukaran Riyal',
    desc: 'Fasilitas penukaran mata uang SAR resmi dengan kurs bersahabat.'
  },
  {
    number: '09',
    title: 'Paket Roaming & Internet',
    desc: 'Sim card dan paket data internet aktif sejak berangkat.'
  },
  {
    number: '10',
    title: 'Kursi Roda & Bantuan Medis',
    desc: 'Pendampingan jamaah lansia, kursi roda, dan bantuan kesehatan.'
  }
];

// Highlight Top 3 Packages for Cards
export const PACKAGES_DATA: PackageItem[] = [
  {
    id: 'reguler',
    badge: {
      text: 'Best Value',
      variant: 'default'
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhsNOtv9F9Sx44WYsi13CJjJLC5OPXjjZhc-QgjQR23Jdpfy83HgjUs0Cg-vvuJJUeBKoJFUFV962W0Q4ruwJt1sCT6pZ-VCnUOfIKnQAvqHjlD2u5Tw9fOJaKy8hFgAFdcfCqMU1I4qarqPNlpHVxx4mYnKw6JFBzMxWxCyXKQiI8FkdTiICBn-hQaicu339_rScZ3RAwsb3omuEnkfeSLQ_KAIWprRm6Fu_r3M7US3613L5Prg1UTQ',
    imageAlt: 'Foto Ka\'bah di Masjidil Haram Makkah saat senja yang khusyuk.',
    title: 'Umroh Reguler (OT)',
    description: 'Perjalanan ibadah 9-12 hari berjadwal pasti dengan hotel dekat masjid dan pembimbing asatidz sunnah.',
    pricePrefix: 'Mulai dari',
    priceAmount: 'Rp 28',
    priceSuffix: 'Jt',
    features: [
      { icon: 'flight', text: 'Direct Flights (Saudia/Garuda)' },
      { icon: 'hotel', text: 'Hotel Bintang 3/4/5 Dekat Masjid' },
      { icon: 'utensils', text: 'Full Board Makanan Khas Indonesia' },
      { icon: 'droplet', text: 'Free Air Zam-zam 5 Liter' }
    ],
    buttonText: 'Lihat Jadwal & Detail',
    buttonVariant: 'outline'
  },
  {
    id: 'custom',
    badge: {
      text: 'VIP Exclusive',
      variant: 'premium'
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFMBNSADfGr2ZkiJBhtHeZsCB6LJzBUDSlFiiEIyKxQEOnsxSJU0zpNY8cFYqda2sn3CjsNsvof_dqLsooxEx-Spwbz4zjDSwdXPJHm7QIu6nZi1e4PEwF03PyIvvmKH_1GLTYkAdmhcnvKRgq34zmql4HMqqr_wVtp_rmoT0e89VloN1KGArVBKO0Ibl519uW1J3GLS0elGQsr4LReSeBAcVB05KCZA7hALXVPl0JHyReUKcCgR80eA',
    imageAlt: 'Suite mewah dengan pemandangan langsung Masjid Nabawi.',
    title: 'Umroh Custom by Request (PT)',
    description: 'Paket ibadah privat eksklusif untuk keluarga besar & korporat dengan tanggal bebas, mobil GMC Yukon/Alphard, & hotel suite.',
    pricePrefix: 'Custom',
    priceAmount: 'Bespoke',
    features: [
      { icon: 'clock', text: 'Tanggal & Durasi Bebas Menentukan' },
      { icon: 'car', text: 'Transportasi Privat VIP (GMC / Alphard)' },
      { icon: 'star', text: 'Hotel Front-Row Ka\'bah / Suite' },
      { icon: 'user', text: 'Muthawwif Pribadi Berpengalaman' }
    ],
    buttonText: 'Kalkulator Custom',
    buttonVariant: 'filled'
  },
  {
    id: 'tabungan',
    image: '',
    bgPattern: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_gmH6PzWkYZFRAgmswCm5bkkSEJn-QSc5evfEYn3XSQjhYXMss7yPwH2l4_THfgCP_Th5MU3UQ-7RhQ9-V7_5P-V3Aq0z3dTJ6OI9Le_-5_53AAgU7c-EgMorsQ3wCeDW0ZQmENAjO5TvN5k83CKjwgSDw9it5mhmneMIOeR66nTfd1ca7d8fojLYrZMJM2ePWwROTDxjbAnVs4UBhCHRso0porVD1Sk6zpcPNLu1YqBBp82-WZnUBQ',
    centerIcon: 'piggy-bank',
    imageAlt: 'Tabungan Ibadah Umroh Syariah Al-Ghanim.',
    title: 'Tabungan Umroh',
    description: 'Rencanakan ibadah Anda dengan cicilan syariah terpercaya tanpa riba, setoran awal ringan, dan jaminan porsi seat.',
    pricePrefix: 'Setoran awal mulai',
    priceAmount: 'Rp 5',
    priceSuffix: 'Jt',
    features: [
      { icon: 'building', text: 'Akad Wadiah & Mudharabah Syariah' },
      { icon: 'sliders', text: 'Cicilan Bulanan Fleksibel (6 - 36 Bulan)' },
      { icon: 'shield-check', text: 'Dana Terjamin di Bank Syariah' },
      { icon: 'calendar-check', text: 'Prioritas Booking Jadwal Musim Pilihan' }
    ],
    buttonText: 'Simulasi Tabungan',
    buttonVariant: 'outline'
  }
];

// Comprehensive Products & Interactive Schedule Catalog (Arrayyan / Rabbani style)
export const DETAILED_SCHEDULES: PackageScheduleItem[] = [
  // 1. JADWAL 22 JULI 2026 (FULL SEAT - QATAR AIRWAYS)
  {
    id: 'pkg-umroh-hemat-22-jul-2026',
    category: 'umroh-reguler',
    title: 'Umroh Hemat 9 Hari (22 Juli 2026)',
    seriesTitle: 'UMROH HEMAT',
    badge: { text: 'FULL SEAT', variant: 'exclusive' },
    highlightTag: '#SpesialisUmrohHemat',
    image: thawafKabahImg,
    imageAlt: 'Umroh Hemat 22 Juli 2026 Al-Ghanim Thawaf Ka\'bah',
    departureDate: '22 Juli 2026',
    duration: 'Program 9 Hari',
    airline: 'Qatar Airways',
    airlineLogoText: 'Qatar Airways',
    hotelMakkah: 'Maysan Al - Maqom (Hotel Makkah ★★★★ / Setaraf)',
    hotelMadinah: 'Jawharat Al Rasheed (Hotel Madinah ★★★ / Setaraf)',
    hotelDistanceMakkah: 'Dekat Dengan Masjid',
    hotelDistanceMadinah: 'Dekat Dengan Masjid',
    price: 'Rp 26.000.000',
    originalPrice: 'Rp 28.500.000',
    discountedPrice: 'Rp 26.000.000',
    priceQuad: 'Rp 26.000.000',
    priceTriple: 'Rp 28.500.000',
    priceDouble: 'Rp 31.000.000',
    quadPrice: 'Rp 26.000.000',
    triplePrice: 'Rp 28.500.000',
    doublePrice: 'Rp 31.000.000',
    totalSeats: 45,
    availableSeats: 0,
    isFullBooked: true,
    features: [
      { icon: 'plane', text: 'Penerbangan: Qatar Airways' },
      { icon: 'building-2', text: 'Hotel Makkah: Maysan Al - Maqom ★★★★' },
      { icon: 'building-2', text: 'Hotel Madinah: Jawharat Al Rasheed ★★★' },
      { icon: 'shield-check', text: 'Status Keberangkatan: FULL SEAT' }
    ],
    description: 'Sesuai Brosur Promo Resmi Alghanim: Umroh Hemat 9 Hari keberangkatan 22 Juli 2026 bersama Qatar Airways. Status: FULL SEAT.',
    programHighlights: [
      'Harga promo hemat mulai dari 26 Jutaan (Quad)',
      'Hotel Makkah: Maysan Al - Maqom ★★★★ (Dekat Masjid)',
      'Hotel Madinah: Jawharat Al Rasheed ★★★ (Dekat Masjid)',
      'Penerbangan berkelas Qatar Airways',
      'Status: FULL SEAT (Daftar untuk Waiting List)'
    ],
    hotelMakkahDetail: {
      name: 'Maysan Al - Maqom',
      city: 'Makkah Al-Mukarramah',
      distance: 'Dekat Dengan Masjid',
      image: thawafKabahImg,
      rating: 4
    },
    hotelMadinahDetail: {
      name: 'Jawharat Al Rasheed',
      city: 'Madinah Al-Munawwarah',
      distance: 'Dekat Dengan Masjid',
      image: qubaImg,
      rating: 3
    }
  },

  // 2. JADWAL 19 AGUSTUS 2026 (FULL SEAT - QATAR AIRWAYS)
  {
    id: 'pkg-umroh-hemat-19-agu-2026',
    category: 'umroh-reguler',
    title: 'Umroh Hemat 9 Hari (19 Agustus 2026)',
    seriesTitle: 'UMROH HEMAT',
    badge: { text: 'FULL SEAT', variant: 'exclusive' },
    highlightTag: '#SpesialisUmrohHemat',
    image: qubaImg,
    imageAlt: 'Umroh Hemat 19 Agustus 2026 Al-Ghanim Masjid Quba',
    departureDate: '19 Agustus 2026',
    duration: 'Program 9 Hari',
    airline: 'Qatar Airways',
    airlineLogoText: 'Qatar Airways',
    hotelMakkah: 'Maysan Al - Maqom (Hotel Makkah ★★★★ / Setaraf)',
    hotelMadinah: 'Jawharat Al Rasheed (Hotel Madinah ★★★ / Setaraf)',
    hotelDistanceMakkah: 'Dekat Dengan Masjid',
    hotelDistanceMadinah: 'Dekat Dengan Masjid',
    price: 'Rp 26.000.000',
    originalPrice: 'Rp 28.500.000',
    discountedPrice: 'Rp 26.000.000',
    priceQuad: 'Rp 26.000.000',
    priceTriple: 'Rp 28.500.000',
    priceDouble: 'Rp 31.000.000',
    quadPrice: 'Rp 26.000.000',
    triplePrice: 'Rp 28.500.000',
    doublePrice: 'Rp 31.000.000',
    totalSeats: 45,
    availableSeats: 0,
    isFullBooked: true,
    features: [
      { icon: 'plane', text: 'Penerbangan: Qatar Airways' },
      { icon: 'building-2', text: 'Hotel Makkah: Maysan Al - Maqom ★★★★' },
      { icon: 'building-2', text: 'Hotel Madinah: Jawharat Al Rasheed ★★★' },
      { icon: 'shield-check', text: 'Status Keberangkatan: FULL SEAT' }
    ],
    description: 'Sesuai Brosur Promo Resmi Alghanim: Umroh Hemat 9 Hari keberangkatan 19 Agustus 2026 bersama Qatar Airways. Status: FULL SEAT.',
    programHighlights: [
      'Harga promo hemat mulai dari 26 Jutaan (Quad)',
      'Hotel Makkah: Maysan Al - Maqom ★★★★ (Dekat Masjid)',
      'Hotel Madinah: Jawharat Al Rasheed ★★★ (Dekat Masjid)',
      'Penerbangan berkelas Qatar Airways',
      'Status: FULL SEAT (Daftar untuk Waiting List)'
    ],
    hotelMakkahDetail: {
      name: 'Maysan Al - Maqom',
      city: 'Makkah Al-Mukarramah',
      distance: 'Dekat Dengan Masjid',
      image: thawafKabahImg,
      rating: 4
    },
    hotelMadinahDetail: {
      name: 'Jawharat Al Rasheed',
      city: 'Madinah Al-Munawwarah',
      distance: 'Dekat Dengan Masjid',
      image: qubaImg,
      rating: 3
    }
  },

  // 3. JADWAL 22 SEPTEMBER 2026 DIRECT SAUDIA (5 SEATS AVAILABLE)
  {
    id: 'pkg-umroh-hemat-22-sep-2026',
    category: 'umroh-reguler',
    title: 'Promo Umroh Hemat 9 Hari Direct Saudia (22 Sep 2026)',
    seriesTitle: 'PROMO UMROH HEMAT',
    badge: { text: '5 SEATS AVAILABLE', variant: 'premium' },
    highlightTag: 'DIRECT TANPA TRANSIT',
    image: jabalUhudImg,
    imageAlt: 'Promo Umroh Hemat 22 September 2026 Direct Saudia Jabal Uhud',
    departureDate: '22 September 2026',
    duration: 'Program 9 Hari',
    airline: 'Saudia Airlines (Direct Tanpa Transit)',
    airlineLogoText: 'Saudia Direct',
    hotelMakkah: 'Maysan Al - Maqom (Hotel Makkah ★★★★ / Setaraf)',
    hotelMadinah: 'Jawharat Al Rasheed (Hotel Madinah ★★★ / Setaraf)',
    hotelDistanceMakkah: 'Dekat Dengan Masjid',
    hotelDistanceMadinah: 'Dekat Dengan Masjid',
    price: 'Rp 26.000.000',
    originalPrice: 'Rp 28.500.000',
    discountedPrice: 'Rp 26.000.000',
    priceQuad: 'Rp 26.000.000',
    priceTriple: 'Rp 28.500.000',
    priceDouble: 'Rp 31.000.000',
    quadPrice: 'Rp 26.000.000',
    triplePrice: 'Rp 28.500.000',
    doublePrice: 'Rp 31.000.000',
    totalSeats: 45,
    availableSeats: 5,
    isFullBooked: false,
    features: [
      { icon: 'plane', text: 'Penerbangan Direct Saudia Tanpa Transit' },
      { icon: 'building-2', text: 'Hotel Makkah: Maysan Al - Maqom ★★★★' },
      { icon: 'building-2', text: 'Hotel Madinah: Jawharat Al Rasheed ★★★' },
      { icon: 'tag', text: 'Promo Coret Rp 28,5 JT Jadi Rp 26 JT-AN' }
    ],
    description: 'Sesuai Brosur Resmi: Promo Khusus Keberangkatan 22 September 2026 Direct Tanpa Transit Saudia Airlines. Sisa 5 Kursi Tersedia!',
    programHighlights: [
      'Penerbangan Direct Tanpa Transit Saudia Airlines',
      'Harga Promo Mulai Rp 26 JT-AN (Quad Sekamar ber-4)',
      'Hotel Makkah: Maysan Al - Maqom ★★★★ (Dekat Masjid)',
      'Hotel Madinah: Jawharat Al Rasheed ★★★ (Dekat Masjid)',
      'Sisa Kuota: 5 SEATS AVAILABLE (Segera Amankan Seat Anda)'
    ],
    hotelMakkahDetail: {
      name: 'Maysan Al - Maqom',
      city: 'Makkah Al-Mukarramah',
      distance: 'Dekat Dengan Masjid',
      image: thawafKabahImg,
      rating: 4
    },
    hotelMadinahDetail: {
      name: 'Jawharat Al Rasheed',
      city: 'Madinah Al-Munawwarah',
      distance: 'Dekat Dengan Masjid',
      image: qubaImg,
      rating: 3
    }
  },

  // 4. JADWAL 21 OKTOBER 2026 (TERSEDIA - QATAR / ETIHAD / OMAN)
  {
    id: 'pkg-umroh-hemat-21-okt-2026',
    category: 'umroh-reguler',
    title: 'Umroh Hemat 9 Hari (21 Oktober 2026)',
    seriesTitle: 'UMROH HEMAT',
    badge: { text: 'Bisa Daftar Sekarang', variant: 'default' },
    highlightTag: '#SpesialisUmrohHemat',
    image: nabawiKubahImg,
    imageAlt: 'Umroh Hemat 21 Oktober 2026 Al-Ghanim Kubah Hijau Nabawi',
    departureDate: '21 Oktober 2026',
    duration: 'Program 9 Hari',
    airline: 'Qatar Airways / Etihad Airways / Oman Air',
    airlineLogoText: 'Qatar / Etihad / Oman',
    hotelMakkah: 'Maysan Al - Maqom (Hotel Makkah ★★★★ / Setaraf)',
    hotelMadinah: 'Jawharat Al Rasheed (Hotel Madinah ★★★ / Setaraf)',
    hotelDistanceMakkah: 'Dekat Dengan Masjid',
    hotelDistanceMadinah: 'Dekat Dengan Masjid',
    price: 'Rp 26.000.000',
    originalPrice: 'Rp 28.500.000',
    discountedPrice: 'Rp 26.000.000',
    priceQuad: 'Rp 26.000.000',
    priceTriple: 'Rp 28.500.000',
    priceDouble: 'Rp 31.000.000',
    quadPrice: 'Rp 26.000.000',
    triplePrice: 'Rp 28.500.000',
    doublePrice: 'Rp 31.000.000',
    totalSeats: 45,
    availableSeats: 16,
    isFullBooked: false,
    features: [
      { icon: 'plane', text: 'Flight By: Qatar Airways, Etihad, Oman Air' },
      { icon: 'building-2', text: 'Hotel Makkah: Maysan Al - Maqom ★★★★' },
      { icon: 'building-2', text: 'Hotel Madinah: Jawharat Al Rasheed ★★★' },
      { icon: 'tag', text: 'Mulai Dari Rp 26 Jutaan' }
    ],
    description: 'Sesuai Brosur Promo Resmi Alghanim: Umroh Hemat 9 Hari Keberangkatan 21 Oktober 2026. Hotel dekat masjid dan bimbingan ibadah terpercaya.',
    programHighlights: [
      'Penerbangan berkelas: Qatar Airways / Etihad / Oman Air',
      'Harga Promo Mulai Rp 26 JT-AN (Quad Sekamar ber-4)',
      'Hotel Makkah: Maysan Al - Maqom ★★★★ (Dekat Masjid)',
      'Hotel Madinah: Jawharat Al Rasheed ★★★ (Dekat Masjid)',
      'Bimbingan manasik intensif Garut & Bandung'
    ],
    hotelMakkahDetail: {
      name: 'Maysan Al - Maqom',
      city: 'Makkah Al-Mukarramah',
      distance: 'Dekat Dengan Masjid',
      image: thawafKabahImg,
      rating: 4
    },
    hotelMadinahDetail: {
      name: 'Jawharat Al Rasheed',
      city: 'Madinah Al-Munawwarah',
      distance: 'Dekat Dengan Masjid',
      image: qubaImg,
      rating: 3
    }
  },

  // 5. JADWAL 21 NOVEMBER 2026 (TERSEDIA - QATAR / ETIHAD / OMAN)
  {
    id: 'pkg-umroh-hemat-21-nov-2026',
    category: 'umroh-reguler',
    title: 'Umroh Hemat 9 Hari (21 November 2026)',
    seriesTitle: 'UMROH HEMAT',
    badge: { text: 'Bisa Daftar Sekarang', variant: 'premium' },
    highlightTag: '#SpesialisUmrohHemat',
    image: keluargaMakkahImg,
    imageAlt: 'Umroh Hemat 21 November 2026 Al-Ghanim Keluarga Ihram',
    departureDate: '21 November 2026',
    duration: 'Program 9 Hari',
    airline: 'Qatar Airways / Etihad Airways / Oman Air',
    airlineLogoText: 'Qatar / Etihad / Oman',
    hotelMakkah: 'Maysan Al - Maqom (Hotel Makkah ★★★★ / Setaraf)',
    hotelMadinah: 'Jawharat Al Rasheed (Hotel Madinah ★★★ / Setaraf)',
    hotelDistanceMakkah: 'Dekat Dengan Masjid',
    hotelDistanceMadinah: 'Dekat Dengan Masjid',
    price: 'Rp 26.000.000',
    originalPrice: 'Rp 28.500.000',
    discountedPrice: 'Rp 26.000.000',
    priceQuad: 'Rp 26.000.000',
    priceTriple: 'Rp 28.500.000',
    priceDouble: 'Rp 31.000.000',
    quadPrice: 'Rp 26.000.000',
    triplePrice: 'Rp 28.500.000',
    doublePrice: 'Rp 31.000.000',
    totalSeats: 45,
    availableSeats: 18,
    isFullBooked: false,
    features: [
      { icon: 'plane', text: 'Penerbangan: Qatar, Etihad, Oman Air' },
      { icon: 'building-2', text: 'Hotel Makkah: Maysan Al - Maqom ★★★★' },
      { icon: 'building-2', text: 'Hotel Madinah: Jawharat Al Rasheed ★★★' },
      { icon: 'shield-check', text: 'Travel Resmi PPIU No. 1030 Thn. 2019' }
    ],
    description: 'Sesuai Brosur Promo Resmi Alghanim: Umroh Hemat 9 Hari keberangkatan 21 November 2026. Fasilitas lengkap hotel bintang 4 & 3 dekat masjid.',
    programHighlights: [
      'Harga terjangkau mulai dari Rp 26 Jutaan (Quad)',
      'Hotel Makkah: Maysan Al - Maqom ★★★★ (Dekat Masjid)',
      'Hotel Madinah: Jawharat Al Rasheed ★★★ (Dekat Masjid)',
      'Pilihan maskapai ternama (Qatar Airways, Etihad Airways, Oman Air)',
      'Didukung oleh Mandala 525 Garut & Terintegrasi SISKOPATUH Kemenag RI'
    ],
    hotelMakkahDetail: {
      name: 'Maysan Al - Maqom',
      city: 'Makkah Al-Mukarramah',
      distance: 'Dekat Dengan Masjid',
      image: thawafKabahImg,
      rating: 4
    },
    hotelMadinahDetail: {
      name: 'Jawharat Al Rasheed',
      city: 'Madinah Al-Munawwarah',
      distance: 'Dekat Dengan Masjid',
      image: qubaImg,
      rating: 3
    }
  },

  // 6. JADWAL 10 DESEMBER 2026 (TERSEDIA - LIBURAN AKHIR TAHUN)
  {
    id: 'pkg-umroh-hemat-10-des-2026',
    category: 'umroh-reguler',
    title: 'Umroh Hemat 9 Hari (10 Desember 2026)',
    seriesTitle: 'UMROH HEMAT',
    badge: { text: 'Liburan Akhir Tahun', variant: 'default' },
    highlightTag: 'Liburan Akhir Tahun',
    image: kajianNabawiImg,
    imageAlt: 'Umroh Hemat 10 Desember 2026 Al-Ghanim Bimbingan Ibadah',
    departureDate: '10 Desember 2026',
    duration: 'Program 9 Hari',
    airline: 'Qatar Airways / Etihad Airways / Oman Air',
    airlineLogoText: 'Qatar / Etihad / Oman',
    hotelMakkah: 'Maysan Al - Maqom (Hotel Makkah ★★★★ / Setaraf)',
    hotelMadinah: 'Jawharat Al Rasheed (Hotel Madinah ★★★ / Setaraf)',
    hotelDistanceMakkah: 'Dekat Dengan Masjid',
    hotelDistanceMadinah: 'Dekat Dengan Masjid',
    price: 'Rp 26.000.000',
    originalPrice: 'Rp 28.500.000',
    discountedPrice: 'Rp 26.000.000',
    priceQuad: 'Rp 26.000.000',
    priceTriple: 'Rp 28.500.000',
    priceDouble: 'Rp 31.000.000',
    quadPrice: 'Rp 26.000.000',
    triplePrice: 'Rp 28.500.000',
    doublePrice: 'Rp 31.000.000',
    totalSeats: 45,
    availableSeats: 22,
    isFullBooked: false,
    features: [
      { icon: 'plane', text: 'Pilihan Maskapai: Qatar, Etihad, Oman Air' },
      { icon: 'building-2', text: 'Hotel Makkah: Maysan Al - Maqom ★★★★' },
      { icon: 'building-2', text: 'Hotel Madinah: Jawharat Al Rasheed ★★★' },
      { icon: 'tag', text: 'Promo Mulai Dari 26 Jutaan' }
    ],
    description: 'Keberangkatan akhir tahun musim 2026 program Umroh Hemat 9 Hari Alghanim Islamic Tour.',
    programHighlights: [
      'Harga terjangkau mulai Rp 26 Jutaan',
      'Hotel Makkah: Maysan Al - Maqom ★★★★ (Dekat Masjid)',
      'Hotel Madinah: Jawharat Al Rasheed ★★★ (Dekat Masjid)',
      'Bimbingan manasik komprehensif di Garut & Bandung'
    ],
    hotelMakkahDetail: {
      name: 'Maysan Al - Maqom',
      city: 'Makkah Al-Mukarramah',
      distance: 'Dekat Dengan Masjid',
      image: thawafKabahImg,
      rating: 4
    },
    hotelMadinahDetail: {
      name: 'Jawharat Al Rasheed',
      city: 'Madinah Al-Munawwarah',
      distance: 'Dekat Dengan Masjid',
      image: qubaImg,
      rating: 3
    }
  },

  // 7. JADWAL 31 JANUARI 2027 (TERSEDIA - AWAL TAHUN)
  {
    id: 'pkg-umroh-hemat-31-jan-2027',
    category: 'umroh-reguler',
    title: 'Umroh Hemat 9 Hari (31 Januari 2027)',
    seriesTitle: 'UMROH HEMAT',
    badge: { text: 'Awal Tahun 2027', variant: 'default' },
    highlightTag: '#SpesialisUmrohHemat',
    image: bandaraImg,
    imageAlt: 'Umroh Hemat 31 Januari 2027 Al-Ghanim Pelepasan Bandara',
    departureDate: '31 Januari 2027',
    duration: 'Program 9 Hari',
    airline: 'Qatar Airways / Etihad Airways / Oman Air',
    airlineLogoText: 'Qatar / Etihad / Oman',
    hotelMakkah: 'Maysan Al - Maqom (Hotel Makkah ★★★★ / Setaraf)',
    hotelMadinah: 'Jawharat Al Rasheed (Hotel Madinah ★★★ / Setaraf)',
    hotelDistanceMakkah: 'Dekat Dengan Masjid',
    hotelDistanceMadinah: 'Dekat Dengan Masjid',
    price: 'Rp 26.000.000',
    originalPrice: 'Rp 28.500.000',
    discountedPrice: 'Rp 26.000.000',
    priceQuad: 'Rp 26.000.000',
    priceTriple: 'Rp 28.500.000',
    priceDouble: 'Rp 31.000.000',
    quadPrice: 'Rp 26.000.000',
    triplePrice: 'Rp 28.500.000',
    doublePrice: 'Rp 31.000.000',
    totalSeats: 45,
    availableSeats: 28,
    isFullBooked: false,
    features: [
      { icon: 'plane', text: 'Pilihan Maskapai: Qatar, Etihad, Oman Air' },
      { icon: 'building-2', text: 'Hotel Makkah: Maysan Al - Maqom ★★★★' },
      { icon: 'building-2', text: 'Hotel Madinah: Jawharat Al Rasheed ★★★' },
      { icon: 'tag', text: 'Promo Mulai Dari 26 Jutaan' }
    ],
    description: 'Keberangkatan awal tahun 2027 program Umroh Hemat 9 Hari Alghanim Islamic Tour.',
    programHighlights: [
      'Harga terjangkau mulai Rp 26 Jutaan',
      'Hotel Makkah: Maysan Al - Maqom ★★★★ (Dekat Masjid)',
      'Hotel Madinah: Jawharat Al Rasheed ★★★ (Dekat Masjid)',
      'Bimbingan manasik komprehensif di Garut & Bandung'
    ],
    hotelMakkahDetail: {
      name: 'Maysan Al - Maqom',
      city: 'Makkah Al-Mukarramah',
      distance: 'Dekat Dengan Masjid',
      image: thawafKabahImg,
      rating: 4
    },
    hotelMadinahDetail: {
      name: 'Jawharat Al Rasheed',
      city: 'Madinah Al-Munawwarah',
      distance: 'Dekat Dengan Masjid',
      image: qubaImg,
      rating: 3
    }
  },
  {
    id: 'pkg-friendly-9d-wy',
    category: 'umroh-reguler',
    title: 'FRIENDLY 9D WY',
    seriesTitle: 'UMROH FRIENDLY',
    badge: { text: '1 Tersisa', variant: 'premium' },
    highlightTag: 'Tour Museum Al Amoudi',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Umroh Friendly 9D WY Al-Ghanim',
    departureDate: '23 September 2026',
    duration: 'Program 9 Hari (23 Sep - 01 Okt 2026)',
    airline: 'Oman Air (WY)',
    airlineLogoText: 'Oman Air',
    hotelMakkah: 'Maysan Al Maqam',
    hotelMadinah: 'ODST',
    hotelDistanceMakkah: 'Setaraf Bintang 4/5 (Dekat Pelataran)',
    price: 'Rp 27.900.000',
    originalPrice: 'Rp 31.900.000',
    discountedPrice: 'Rp 27.900.000',
    priceQuad: 'Rp 27.900.000',
    priceTriple: 'Rp 34.900.000',
    priceDouble: 'Rp 35.400.000',
    quadPrice: 'Rp 27.900.000',
    triplePrice: 'Rp 34.900.000',
    doublePrice: 'Rp 35.400.000',
    totalSeats: 45,
    availableSeats: 1,
    isFullBooked: false,
    features: [
      { icon: 'plane', text: 'Penerbangan Nyaman Oman Air (WY)' },
      { icon: 'building-2', text: 'Hotel Maysan Al Maqam & ODST' },
      { icon: 'map-pin', text: 'Free Tour Museum Al Amoudi' },
      { icon: 'utensils', text: 'Makan 3x Sehari Fullboard Buffet' }
    ],
    description: 'Program Umroh Friendly 9 Hari bersama AL-GHANIM dengan fasilitas hotel strategis, ziarah Museum Al Amoudi, dan bimbingan manasik sesuai Sunnah.',
    programHighlights: [
      'Penerbangan berjadwal nyaman bersama Oman Air (WY)',
      'Free Tour & Edukasi Sejarah di Museum Al Amoudi Makkah',
      'Hotel Makkah: Maysan Al Maqam / Setaraf',
      'Hotel Madinah: ODST / Setaraf',
      'Ziarah Raudhah Asy-Syarifah dengan Tasreh resmi',
      'Free Air Zam-zam 5 Liter & Perlengkapan Koper Fiber Eksklusif'
    ],
    flightSchedules: [
      { flightNo: 'WY 850', date: '23SEP', route: 'CGKMCT', departureTime: '1425', arrivalTime: '1905', time: '14:25 - 19:05' },
      { flightNo: 'WY 673', date: '23SEP', route: 'MCTJED', departureTime: '2145', arrivalTime: '0005 (+1)', time: '21:45 - 00:05 (+1)' },
      { flightNo: 'WY 676', date: '30SEP', route: 'JEDMCT', departureTime: '1800', arrivalTime: '2215', time: '18:00 - 22:15' },
      { flightNo: 'WY 849', date: '01OCT', route: 'MCTCGK', departureTime: '0150', arrivalTime: '1255', time: '01:50 - 12:55' }
    ],
    hotelMakkahDetail: {
      name: 'MAYSAN AL MAQAM',
      city: 'Makkah Al-Mukarramah',
      distance: 'Dekat Pelataran Masjidil Haram',
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
      mapsUrl: 'https://maps.google.com/?q=Maysan+Al+Maqam+Makkah',
      youtubeUrl: 'https://www.youtube.com/results?search_query=review+hotel+maysan+al+maqam+makkah',
      rating: 4
    },
    hotelMadinahDetail: {
      name: 'ODST',
      city: 'Madinah Al-Munawwarah',
      distance: 'Dekat Pintu Gerbang Masjid Nabawi',
      image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80',
      mapsUrl: 'https://maps.google.com/?q=ODST+Hotel+Madinah',
      youtubeUrl: 'https://www.youtube.com/results?search_query=review+hotel+odst+madinah',
      rating: 4
    },
    itineraryDays: [
      {
        day: 1,
        dayName: 'Rabu, 23 Sep 2026',
        time: 'Pukul 07:25 WIB',
        title: 'JAKARTA - MUSCAT',
        meals: 'L/D*',
        desc: 'Berkumpul di Grand Anara Lounge (Parkiran Terminal 3 Domestik) Bandara Soekarno-Hatta 7 jam sebelum keberangkatan (Pukul 07.25) untuk briefing. Jamaah melakukan registrasi koper dengan Tim Handling, menikmati hidangan prasmanan, pembagian dokumen, pengarahan dan pelepasan jamaah, doa lalu foto bersama. Jamaah melakukan profiling dan menuju imigrasi. Jamaah take-off (Pukul 14.25) menuju Bandara Muscat (WY 850), dan tiba di Bandara Muscat (Pukul 19.05). Jamaah take-off kembali (Pukul 21.45) menuju Jeddah (WY 673). Jamaah berganti pakaian ihram di dalam pesawat dan mengambil miqat serta berniat umroh pertama di atas pesawat.',
        image: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=600&q=80'
      },
      {
        day: 2,
        dayName: 'Kamis, 24 Sep 2026',
        time: 'Pukul 00:05 WAS',
        title: 'JEDDAH - MAKKAH',
        meals: 'B/L/D',
        desc: 'Tiba di Bandara King Abdul Aziz Jeddah (Pukul 00.05). Setelah proses imigrasi, Jamaah keluar Bandara bertemu Muthawif dan menuju Makkah dengan bus rombongan eksekutif. Tiba di Makkah hotel melakukan proses check-in kemudian menuju Masjidil Haram untuk Ibadah Umroh Pertama (Tawaf, Sa\'i, Tahallul). Setelah Tahallul, jamaah kembali ke hotel untuk istirahat dan makan pagi.',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80'
      },
      {
        day: 3,
        dayName: 'Jumat, 25 Sep 2026',
        time: 'Pukul 14:00 WAS',
        title: 'MAKKAH (Museum Al Amoudi - Dresscode Batik Al-Ghanim)',
        meals: 'B/L/D',
        desc: 'Jamaah dipersilakan untuk Ibadah Sholat Jumat di Masjidil Haram kemudian persiapan untuk mengunjungi Museum Al Amoudi. Jamaah mengambil miqat di Hudaibiyah untuk melakukan Ibadah Umroh Badl (Jamaah laki-laki berganti kain ihram untuk umrah).',
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=600&q=80'
      },
      {
        day: 4,
        dayName: 'Sabtu, 26 Sep 2026',
        time: 'Pukul 07:00 WAS',
        title: 'MAKKAH (City Tour Makkah - Dresscode Batik Al-Ghanim)',
        meals: 'B/L/D',
        desc: 'City Tour/Ziarah luar dengan bus rombongan ke tempat bersejarah di Kota Makkah dan sekitarnya, seperti: Jabal Tsur, Jabal Rahmah dan melintasi Padang Arafah, Masjid Namiroh, Muzdalifah, Masjid Khaef di Mina dan Jabal Nur. Jamaah mengambil Miqat di Masjid Jironah untuk melakukan Ibadah Umroh Badl ke-2.',
        image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=600&q=80'
      },
      {
        day: 5,
        dayName: 'Ahad, 27 Sep 2026',
        time: 'Sepanjang Hari',
        title: 'MAKKAH (Ibadah Mandiri & Tawaf Sunnah)',
        meals: 'B/L/D',
        desc: 'Memperbanyak ibadah di Masjidil Haram, melaksanakan Tawaf Sunnah, tilawah Al-Qur\'an, dan kajian tafsir serta fiqih bersama Asatidz pembimbing di hotel.',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80'
      },
      {
        day: 6,
        dayName: 'Senin, 28 Sep 2026',
        time: 'Pukul 09:00 WAS',
        title: 'MAKKAH - MADINAH (Tawaf Wada\')',
        meals: 'B/L/D',
        desc: 'Pelaksanaan Tawaf Wada\' di Masjidil Haram, check-out hotel Makkah, kemudian menuju Madinah Al-Munawwarah via Kereta Cepat Haramain / Bus Eksekutif VIP. Tiba di Madinah, check-in hotel dan melaksanakan ziarah salam ke Makam Rasulullah SAW, Abu Bakar Ash-Siddiq, dan Umar bin Khattab.',
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=600&q=80'
      },
      {
        day: 7,
        dayName: 'Selasa, 29 Sep 2026',
        time: 'Pagi & Siang',
        title: 'MADINAH (Ziarah Raudhah & City Tour Madinah)',
        meals: 'B/L/D',
        desc: 'Ziarah Raudhah Asy-Syarifah (Taman Surga) dengan izin tasreh resmi Kemenag & Nusuk. Dilanjutkan City Tour Kota Madinah mengunjungi Masjid Quba (shalat sunnah pahala umroh), Kebun Kurma, dan Jabal Uhud.',
        image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80'
      },
      {
        day: 8,
        dayName: 'Rabu, 30 Sep 2026',
        time: 'Pukul 14:00 WAS',
        title: 'MADINAH - JEDDAH - MUSCAT',
        meals: 'B/L/D',
        desc: 'Shalat fardhu dan ziarah wada\' di Masjid Nabawi. Check-out hotel Madinah menuju Bandara untuk penerbangan kembali menuju Muscat dengan Oman Air (WY 676 pukul 18.00 WAS).',
        image: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=600&q=80'
      },
      {
        day: 9,
        dayName: 'Kamis, 01 Okt 2026',
        time: 'Pukul 12:55 WIB',
        title: 'MUSCAT - JAKARTA (SOEKARNO HATTA)',
        meals: 'In-flight Meals',
        desc: 'Penerbangan lanjutan WY 849 (01.50 - 12.55) menuju Bandara Soekarno Hatta Jakarta. Tiba di Jakarta, pembagian air zam-zam 5 liter, doa perpisahan dan kepulangan ke rumah masing-masing dengan membawa predikat Umroh Maqbullah.',
        image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'pkg-reg-sep-1',
    category: 'umroh-reguler',
    title: 'Umroh Reguler Syawal & Musim Awal (9 Hari)',
    badge: { text: 'Favorit Jamaah', variant: 'default' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhsNOtv9F9Sx44WYsi13CJjJLC5OPXjjZhc-QgjQR23Jdpfy83HgjUs0Cg-vvuJJUeBKoJFUFV962W0Q4ruwJt1sCT6pZ-VCnUOfIKnQAvqHjlD2u5Tw9fOJaKy8hFgAFdcfCqMU1I4qarqPNlpHVxx4mYnKw6JFBzMxWxCyXKQiI8FkdTiICBn-hQaicu339_rScZ3RAwsb3omuEnkfeSLQ_KAIWprRm6Fu_r3M7US3613L5Prg1UTQ',
    imageAlt: 'Umroh Reguler Al-Ghanim',
    departureDate: '12 September 2026',
    duration: '9 Hari (4 Hari Madinah, 5 Hari Makkah)',
    airline: 'Saudia Airlines (Direct CGK - MED / JED - CGK)',
    airlineLogoText: 'Saudia Direct',
    hotelMakkah: 'Swissotel Makkah / Pullman Zamzam (Bintang 5 - 50m)',
    hotelMadinah: 'Rove Madinah / Grand Plaza (Bintang 4 - 150m)',
    hotelDistanceMakkah: '50 Meter (Pelataran Masjidil Haram)',
    price: 'Rp 28.900.000',
    totalSeats: 45,
    availableSeats: 6,
    isFullBooked: false,
    features: [
      { icon: 'plane', text: 'Penerbangan Langsung Tanpa Transit' },
      { icon: 'building-2', text: 'Hotel Bintang 5 Depan Pelataran' },
      { icon: 'train', text: 'Opsi Free Kereta Cepat Haramain' },
      { icon: 'utensils', text: 'Makan 3x Sehari Masakan Nusantara' }
    ],
    description: 'Paket Umroh berjadwal pasti dengan kenyamanan maksimal dan bimbingan manasik intensif sesuai Sunnah.',
    programHighlights: [
      'Manasik intensif sebelum berangkat di Garut / Bandung',
      'Ziarah Raudhah Asy-Syarifah dengan tasreh resmi',
      'Pelaksanaan Umroh 2x (Miqat Bir Ali & Miqat Ji\'ranah/Tan\'im)',
      'Free City Tour Madinah & Makkah (Jabal Uhud, Quba, Arafah)',
      'Free Air Zam-zam 5 Liter & Perlengkapan Koper Premium'
    ]
  },
  {
    id: 'pkg-reg-oct-2',
    category: 'umroh-reguler',
    title: 'Umroh Jum\'atain 12 Hari (2x Shalat Jum\'at)',
    badge: { text: 'Paling Diminati', variant: 'premium' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu14MqP5FaRC7u8QfJ3bvcpJHgDCoHkOgnWrzRP-snlFUXbCXTT7WullQ1qpYVSG8oow9ny8H3nNE6297iiN0RqUFKENIXn45qCrj9ZJ5r_DK7xMUAC84y0euARrRHknBaMj3_vG561-g3Qt0wQvdUaKOvI3KdsCpbaMGkNXF45Azy9A-PBVcaxhecyzoY5cQThjGmsNA-IbQkWw3cSq_347NgCVpz4JfwAryS4Im0sDb5mrQNhdrzSA',
    imageAlt: 'Umroh Jumatain 12 Hari Al-Ghanim',
    departureDate: '08 Oktober 2026',
    duration: '12 Hari (5 Hari Madinah, 7 Hari Makkah)',
    airline: 'Garuda Indonesia (Direct CGK - JED)',
    airlineLogoText: 'Garuda Indonesia Direct',
    hotelMakkah: 'Movenpick Hajar Tower / Safwah Royale (Bintang 5 - 50m)',
    hotelMadinah: 'Dallah Taibah / Leader Al Muna Kareem (Bintang 5 - 100m)',
    hotelDistanceMakkah: '50 Meter (Pelataran Masjidil Haram)',
    price: 'Rp 34.500.000',
    totalSeats: 45,
    availableSeats: 3,
    isFullBooked: false,
    features: [
      { icon: 'plane', text: 'Garuda Indonesia Direct Flight' },
      { icon: 'clock', text: '2x Shalat Jum\'at (Makkah & Madinah)' },
      { icon: 'shield-check', text: 'Hotel Bintang 5 Front-Row' },
      { icon: 'users', text: 'Didampingi Muthawwif Senior Madinah' }
    ],
    description: 'Kesempatan istimewa merasakan dua kali Shalat Jum\'at di Masjid Nabawi dan Masjidil Haram dengan durasi lebih panjang.',
    programHighlights: [
      '2x Shalat Jum\'at di Masjidil Haram & Masjid Nabawi',
      'Free City Tour Thaif (Cable car, Pabrik Minyak Mawar, Nasi Mandhi)',
      'Free Baju Ihram / Mukena, Koper Fiber 24-inch, Tas Paspor',
      'Ziarah Raudhah & City Tour Ziarah Bersejarah'
    ]
  },
  {
    id: 'pkg-custom-vip',
    category: 'umroh-custom',
    title: 'Umroh Private & VIP Corporate Bespoke',
    badge: { text: 'VIP Sultan', variant: 'exclusive' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFMBNSADfGr2ZkiJBhtHeZsCB6LJzBUDSlFiiEIyKxQEOnsxSJU0zpNY8cFYqda2sn3CjsNsvof_dqLsooxEx-Spwbz4zjDSwdXPJHm7QIu6nZi1e4PEwF03PyIvvmKH_1GLTYkAdmhcnvKRgq34zmql4HMqqr_wVtp_rmoT0e89VloN1KGArVBKO0Ibl519uW1J3GLS0elGQsr4LReSeBAcVB05KCZA7hALXVPl0JHyReUKcCgR80eA',
    imageAlt: 'Umroh Custom VIP',
    departureDate: 'Sesuai Request Anda (Kapan Saja)',
    duration: 'Bebas (7, 9, 10, 12, 14+ Hari)',
    airline: 'Saudia / Emirates / Qatar Airways (Business / First Class)',
    airlineLogoText: 'Business / First Class',
    hotelMakkah: 'Raffles Makkah Palace / Fairmont Clock Tower Suite',
    hotelMadinah: 'The Oberoi Madinah / Dar Al Taqwa (Depan Gerbang Wanita & Pria)',
    hotelDistanceMakkah: '0 Meter (Akses Lift Khusus ke Haram)',
    price: 'Mulai Rp 48.000.000',
    totalSeats: 12,
    availableSeats: 8,
    isFullBooked: false,
    features: [
      { icon: 'star', text: 'Private Suite View Langsung Ka\'bah' },
      { icon: 'car', text: 'Mobil VIP GMC Yukon XL / Toyota Alphard' },
      { icon: 'user', text: '1 Muthawwif Pribadi Khusus Keluarga' },
      { icon: 'sparkles', text: 'Jadwal Fleksibel 100% Mengikuti Anda' }
    ],
    description: 'Layanan ibadah privat tanpa terikat rombongan lain, dengan kenyamanan mutlak bagi keluarga terkasih dan lansia.',
    programHighlights: [
      'Private Fast Track & Executive Airport Lounge Service',
      'Pemandangan langsung Ka\'bah dari jendela kamar suite',
      'Jadwal ziarah eksklusif tanpa terburu-buru',
      'Menu kuliner halal buffet internasional & privat room service'
    ]
  },
  {
    id: 'pkg-badal-umroh',
    category: 'badal-umroh',
    title: 'Program Badal Umroh Amanah (Untuk Almarhum/Sakit Berat)',
    badge: { text: 'Amanah & Syar\'i', variant: 'default' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhsNOtv9F9Sx44WYsi13CJjJLC5OPXjjZhc-QgjQR23Jdpfy83HgjUs0Cg-vvuJJUeBKoJFUFV962W0Q4ruwJt1sCT6pZ-VCnUOfIKnQAvqHjlD2u5Tw9fOJaKy8hFgAFdcfCqMU1I4qarqPNlpHVxx4mYnKw6JFBzMxWxCyXKQiI8FkdTiICBn-hQaicu339_rScZ3RAwsb3omuEnkfeSLQ_KAIWprRm6Fu_r3M7US3613L5Prg1UTQ',
    imageAlt: 'Program Badal Umroh Al-Ghanim',
    departureDate: 'Setiap Bulan Berjalan',
    duration: 'Pelaksanaan 1 Orang Badal untuk 1 Jiwa',
    airline: 'Pelaksana Muthawwif Mahasiswa Madinah',
    airlineLogoText: 'Muthawwif Madinah',
    hotelMakkah: 'Makkah Al-Mukarramah',
    hotelMadinah: 'Madinah Al-Munawwarah',
    hotelDistanceMakkah: 'Pelaksanaan di Masjidil Haram',
    price: 'Rp 2.500.000 / Jiwa',
    totalSeats: 50,
    availableSeats: 15,
    isFullBooked: false,
    features: [
      { icon: 'award', text: 'Sertifikat Badal Umroh Resmi Berbingkai' },
      { icon: 'video', text: 'Dokumentasi Video Niat, Thawaf, Sa\'i' },
      { icon: 'droplet', text: 'Free Air Zam-zam 5 Liter Dikirim ke Rumah' },
      { icon: 'gift', text: 'Souvenir Sajadah & Tasbih Digital' }
    ],
    description: 'Membadalkan ibadah Umroh bagi orang tua/keluarga yang telah wafat atau menderita sakit berat menahun sesuai tuntunan fiqih sunnah.',
    programHighlights: [
      'Dilaksanakan oleh para penuntut ilmu/asatidz di Makkah & Madinah',
      'Satu orang pembadal hanya membadalkan satu nama almarhum/ah',
      'Pengiriman video pelafalan niat atas nama almarhum dan dokumentasi thawaf',
      'Sertifikat resmi tanda pelaksanaan badal umroh'
    ]
  },
  {
    id: 'pkg-wisata-halal',
    category: 'wisata-halal',
    title: 'Umroh Plus Wisata Halal Turki / Dubai / Thaif',
    badge: { text: 'Spesial Liburan', variant: 'default' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFMBNSADfGr2ZkiJBhtHeZsCB6LJzBUDSlFiiEIyKxQEOnsxSJU0zpNY8cFYqda2sn3CjsNsvof_dqLsooxEx-Spwbz4zjDSwdXPJHm7QIu6nZi1e4PEwF03PyIvvmKH_1GLTYkAdmhcnvKRgq34zmql4HMqqr_wVtp_rmoT0e89VloN1KGArVBKO0Ibl519uW1J3GLS0elGQsr4LReSeBAcVB05KCZA7hALXVPl0JHyReUKcCgR80eA',
    imageAlt: 'Wisata Halal Al-Ghanim',
    departureDate: '24 November 2026',
    duration: '12 - 14 Hari',
    airline: 'Turkish Airlines / Emirates / Saudia',
    airlineLogoText: 'Turkish / Emirates',
    hotelMakkah: 'Swissotel Makkah (Bintang 5)',
    hotelMadinah: 'Dallah Taibah Madinah (Bintang 5)',
    hotelDistanceMakkah: '50 Meter',
    price: 'Rp 36.800.000',
    totalSeats: 40,
    availableSeats: 7,
    isFullBooked: false,
    features: [
      { icon: 'map-pin', text: 'Wisata Blue Mosque, Hagia Sophia & Bosphorus' },
      { icon: 'utensils', text: '100% Halal Food & Shalat Time Friendly' },
      { icon: 'camera', text: 'Tour Leader Berpengalaman & Fotografer' },
      { icon: 'gift', text: 'Free Souvenir & Bosphorus Cruise Tour' }
    ],
    description: 'Menikmati keindahan jejak peradaban Islam di Turki/Dubai disempurnakan dengan ibadah Umroh khusyuk di Baitullah.',
    programHighlights: [
      '3 Hari menjelajahi Istanbul: Hagia Sophia, Blue Mosque, Topkapi Palace',
      'Bosphorus Cruise menyaksikan dua benua Asia & Eropa',
      'Ibadah Umroh 2x dengan hotel bintang 5 di Makkah & Madinah',
      'Tiket masuk objek wisata dan makan halal terjamin'
    ]
  },
  {
    id: 'pkg-tabungan-syariah',
    category: 'tabungan',
    title: 'Program Tabungan Umroh Barakah (Akad Syariah)',
    badge: { text: 'Kemudahan Ibadah', variant: 'saving' },
    image: '',
    imageAlt: 'Tabungan Umroh Al-Ghanim',
    departureDate: 'Target Berangkat Fleksibel (2026 / 2027)',
    duration: 'Pilihan Masa Nabung: 6, 12, 24, 36 Bulan',
    airline: 'Bebas Pilih Maskapai Saat Pelunasan',
    airlineLogoText: 'Bank Syariah Mitra',
    hotelMakkah: 'Pilihan Bintang 3 / 4 / 5',
    hotelMadinah: 'Pilihan Bintang 3 / 4 / 5',
    hotelDistanceMakkah: 'Dekat Masjidil Haram',
    price: 'Setoran Awal Rp 5.000.000',
    pricePrefix: 'Cicilan mulai',
    priceSuffix: '/bln (Rp 800rb-an)',
    totalSeats: 100,
    availableSeats: 48,
    isFullBooked: false,
    features: [
      { icon: 'piggy-bank', text: 'Bebas Biaya Administrasi Bulanan' },
      { icon: 'shield-check', text: 'Bekerjasama dengan Bank Syariah Terkemuka' },
      { icon: 'sliders', text: 'Nominal Cicilan Dapat Disesuaikan Kemampuan' },
      { icon: 'calendar-check', text: 'Kunci Harga Paket (Price Lock Guarantee)' }
    ],
    description: 'Wujudkan niat suci ke Baitullah dengan menabung secara bertahap dan teratur tanpa bunga riba.',
    programHighlights: [
      'Buka tabungan langsung dapat souvenir mukena/kain ihram',
      'Dapat memilih tanggal keberangkatan saat saldo mencapai 70%',
      'Laporan saldo real-time berkala via WhatsApp & buku tabungan',
      'Dana 100% aman tersimpan di rekening an. Calon Jamaah'
    ]
  },
  {
    id: 'pkg-haji-furoda-vvip',
    category: 'haji-khusus',
    title: 'Haji Furoda / Mujamalah VVIP (Langsung Berangkat Tanpa Antri)',
    badge: { text: 'Tanpa Antre (Tahun Berjalan)', variant: 'exclusive' },
    image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Haji Furoda VVIP Al-Ghanim',
    departureDate: 'Musim Haji Tahun Berjalan (Dzulhijjah)',
    duration: '22 - 25 Hari',
    airline: 'Saudia Airlines (Direct CGK - JED)',
    airlineLogoText: 'Saudia Direct VVIP',
    hotelMakkah: 'Raffles Makkah Palace / Fairmont Clock Tower (Bintang 5)',
    hotelMadinah: 'The Oberoi Madinah / Dar Al Taqwa (Bintang 5)',
    hotelDistanceMakkah: 'Maktab 111/112 VIP Mina & Arafah',
    price: 'USD $19.500',
    totalSeats: 25,
    availableSeats: 4,
    isFullBooked: false,
    features: [
      { icon: 'shield-check', text: 'Visa Haji Mujamalah Resmi Kerajaan Saudi' },
      { icon: 'clock', text: 'Langsung Berangkat Tahun Berjalan Tanpa Antre' },
      { icon: 'star', text: 'Maktab VVIP Mina & Arafah Ber-AC & Kasur Springbed' },
      { icon: 'award', text: 'Bimbingan Asatidz Pembimbing Senior & Tim Medis' }
    ],
    description: 'Ibadah Haji tanpa masa tunggu dengan Visa Haji Mujamalah resmi Kerajaan Arab Saudi, fasilitas Maktab VVIP terdekat dari Jamarat, serta akomodasi hotel bintang 5.',
    programHighlights: [
      'Kepastian Visa Haji Furoda Resmi Terdaftar di E-Hajj Saudi',
      'Tenda AC VVIP Mina & Arafah dengan buffet katering masakan Indonesia',
      'Hotel Suite Bintang 5 di Makkah & Madinah (0 Meter ke Masjid)',
      'Transportasi Bus VIP Eksekutif & Pendampingan Penuh dari Jakarta'
    ]
  },
  {
    id: 'pkg-haji-khusus-pihk',
    category: 'haji-khusus',
    title: 'Haji Khusus / Haji Plus PIHK Kuota Resmi Kemenag RI',
    badge: { text: 'Kuota Resmi Kemenag', variant: 'premium' },
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Haji Khusus PIHK Al-Ghanim',
    departureDate: 'Pendaftaran Nomor Porsi Resmi SISKOPATUH (Masa Tunggu 5-7 Thn)',
    duration: '25 - 28 Hari',
    airline: 'Garuda Indonesia / Saudia Direct',
    airlineLogoText: 'Garuda / Saudia',
    hotelMakkah: 'Swissotel Makkah / Pullman Zamzam (Bintang 5)',
    hotelMadinah: 'Dallah Taibah / Rove Madinah (Bintang 5)',
    hotelDistanceMakkah: 'Tenda Maktab Khusus Ber-AC Mina',
    price: 'USD $12.500 (Setoran Awal $4.500)',
    totalSeats: 45,
    availableSeats: 12,
    isFullBooked: false,
    features: [
      { icon: 'file-text', text: 'Nomor Porsi Resmi SISKOPATUH Kemenag RI' },
      { icon: 'award', text: 'Penyelenggara Ibadah Haji Khusus (PIHK) Berizin' },
      { icon: 'building', text: 'Hotel Bintang 5 Dekat Pelataran Masjid' },
      { icon: 'users', text: 'Manasik Intensif Teori & Praktik di Hotel Tanah Air' }
    ],
    description: 'Pendaftaran Haji Khusus resmi berkuota pemerintah dengan masa tunggu yang jauh lebih singkat dan fasilitas akomodasi premium.',
    programHighlights: [
      'Mendapatkan Bukti Setoran BPIH & Nomor Porsi Haji Resmi Kemenag',
      'Masa tunggu hanya 5-7 tahun (dibandingkan reguler 25-35 tahun)',
      'Akomodasi Hotel Bintang 5 di Makkah & Madinah',
      'Bimbingan manasik komprehensif bersama asatidz berpengalaman'
    ]
  },
  {
    id: 'pkg-visa-la',
    category: 'visa-tiket-la',
    title: 'Layanan Visa Umroh, Tiket Pesawat & Land Arrangement (LA)',
    badge: { text: 'B2B & B2C Service', variant: 'default' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhsNOtv9F9Sx44WYsi13CJjJLC5OPXjjZhc-QgjQR23Jdpfy83HgjUs0Cg-vvuJJUeBKoJFUFV962W0Q4ruwJt1sCT6pZ-VCnUOfIKnQAvqHjlD2u5Tw9fOJaKy8hFgAFdcfCqMU1I4qarqPNlpHVxx4mYnKw6JFBzMxWxCyXKQiI8FkdTiICBn-hQaicu339_rScZ3RAwsb3omuEnkfeSLQ_KAIWprRm6Fu_r3M7US3613L5Prg1UTQ',
    imageAlt: 'Layanan Visa dan LA Al-Ghanim',
    departureDate: 'Proses Cepat & Resmi (E-Visa 24-48 Jam)',
    duration: 'Sesuai Request Tiket & Visa',
    airline: 'Semua Maskapai Internasional',
    airlineLogoText: 'IATA & Saudia System',
    hotelMakkah: 'Voucher Hotel Makkah All Category',
    hotelMadinah: 'Voucher Hotel Madinah All Category',
    hotelDistanceMakkah: 'Bebas Pilih Hotel',
    price: 'Hubungi Sales Admin',
    totalSeats: 200,
    availableSeats: 180,
    isFullBooked: false,
    features: [
      { icon: 'file-check', text: 'Penerbitan Visa Umroh E-Visa Cepat' },
      { icon: 'ticket', text: 'Tiket Group / FIT Maskapai Ternama' },
      { icon: 'bus', text: 'Armada Bus VIP & Handling Bandara Saudi' },
      { icon: 'building', text: 'Kontrak Kamar Hotel Makkah & Madinah' }
    ],
    description: 'Layanan lengkap untuk agen perjalanan, komunitas, dan perorangan: Visa Umroh resmi MoFA, tiket grup, dan paket LA menyeluruh di Saudi.',
    programHighlights: [
      'Provider Visa Umroh langsung dengan sistem Muassasah terpercaya',
      'Tiket grup maskapai Saudia, Garuda, Oman, Qatar, Emirates',
      'Layanan handling kedatangan & kepulangan di Bandara Jeddah/Madinah',
      'Katering masakan Indonesia higienis di Makkah & Madinah'
    ]
  }
];

// Testimonials & Reviews (Real Pilgrim Social Proof)
export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'H. Dedi Supriadi & Keluarga',
    city: 'Garut (Copong)',
    packageTaken: 'Umroh Reguler Syawal 9 Hari',
    rating: 5,
    comment: 'Alhamdulillah pengalaman umroh bersama Al-Ghanim sangat berkesan dan menenangkan hati. Hotelnya luar biasa dekat dengan pelataran Masjidil Haram, hanya jalan kaki 50 meter. Pembimbing asatidz sangat sabar membimbing manasik dari Garut sampai di depan Ka\'bah sesuai sunnah.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    date: 'April 2026'
  },
  {
    id: 't-2',
    name: 'Hj. Siti Rohmah, M.Pd.',
    city: 'Kota Bandung (Buahbatu)',
    packageTaken: 'Umroh Jum\'atain 12 Hari',
    rating: 5,
    comment: 'Pelayanan Al-Ghanim sejak pendaftaran di kantor Bandung, manasik di Hotel Grand Sunshine, sampai di Tanah Suci sangat amanah. Makanannya enak prasmanan khas Nusantara dan koper fiber eksekutifnya sangat kokoh. Ziarah Raudhah pun lancar dengan tasreh resmi.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    date: 'Februari 2026'
  },
  {
    id: 't-3',
    name: 'Ir. Hendra Gunawan & Ibu',
    city: 'Jakarta Selatan (Kuningan)',
    packageTaken: 'Umroh Custom VIP Family',
    rating: 5,
    comment: 'Kami memesan paket privat bespoke untuk orang tua yang sudah sepuh. Fasilitas mobil GMC Yukon sangat lapang, Muthawwif privat mendampingi dengan kursi roda setiap saat. Orang tua kami beribadah dengan sangat nyaman tanpa terburu-buru.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    date: 'Maret 2026'
  },
  {
    id: 't-4',
    name: 'Dra. Hj. Neneng Kurniasih',
    city: 'Tasikmalaya',
    packageTaken: 'Tabungan Umroh Barakah BSI',
    rating: 5,
    comment: 'Alhamdulillah program tabungan syariahnya sangat aman dan transparan. Didampingi buku rekening langsung, akad jelas, dan biaya dikunci tanpa kenaikan mendadak. Kini cita-cita ke Baitullah bersama suami telah terwujud dengan selamat.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    date: 'Mei 2026'
  },
  {
    id: 't-5',
    name: 'Ust. H. Cecep Miftahudin, S.Ag.',
    city: 'Tarogong, Garut',
    packageTaken: 'Haji Khusus / Furoda VVIP',
    rating: 5,
    comment: 'Penyelenggaraan Haji bersama Al-Ghanim luar biasa profesional. Tenda maktab ber-AC di Arafah & Mina sangat dekat dengan Jamarat, konsumsi melimpah, dan bimbingan ibadah sangat khusyuk sesuai tarjih fiqih.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    date: 'Musim Haji 1447 H'
  },
  {
    id: 't-6',
    name: 'Ibu Ratna Juwita & Suami',
    city: 'Ciamis & Priangan Timur',
    packageTaken: 'Umroh Plus Wisata Thaif',
    rating: 5,
    comment: 'Tour ke Thaif sangat berkesan! Naik kereta gantung cable car, mencicipi kuliner nasi mandhi khas Arab, dan berkunjung ke pabrik minyak mawar. Semua tim tour leader sigap melayani.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    date: 'Januari 2026'
  }
];

// Galeri Dokumentasi Foto & Real Keberangkatan Jamaah Al-Ghanim
export const GALLERY_DATA: GalleryPhotoItem[] = [
  {
    id: 'g-1',
    title: 'Thawaf & Doa Bersama di Depan Ka\'bah',
    category: 'Makkah',
    location: 'Pelataran Mataf Masjidil Haram, Makkah',
    image: thawafKabahImg,
    year: 'Musim 2026'
  },
  {
    id: 'g-2',
    title: 'Ziarah & Shalat Sunnah di Masjid Quba',
    category: 'Madinah',
    location: 'Pelataran Masjid Quba, Madinah Al-Munawwarah',
    image: qubaImg,
    year: 'Musim 2026'
  },
  {
    id: 'g-3',
    title: 'Napak Tilas Sejarah Syuhada di Jabal Uhud',
    category: 'Madinah',
    location: 'Kawasan Bersejarah Jabal Uhud, Madinah',
    image: jabalUhudImg,
    year: 'Musim 2026'
  },
  {
    id: 'g-4',
    title: 'Ziarah Raudhah & Kubah Hijau Masjid Nabawi',
    category: 'Madinah',
    location: 'Pelataran Kubah Hijau Masjid Nabawi, Madinah',
    image: nabawiKubahImg,
    year: 'Musim 2026'
  },
  {
    id: 'g-5',
    title: 'Kebersamaan Keluarga Jamaah Berpakaian Ihram',
    category: 'Makkah',
    location: 'Pelataran Suci Masjidil Haram, Makkah',
    image: keluargaMakkahImg,
    year: 'Musim 2026'
  },
  {
    id: 'g-6',
    title: 'Bimbingan Ibadah & Kajian Khusyuk di Nabawi',
    category: 'Manasik',
    location: 'Pelataran Naungan Payung Masjid Nabawi, Madinah',
    image: kajianNabawiImg,
    year: 'Musim 2026'
  },
  {
    id: 'g-7',
    title: 'Pelepasan & Keberangkatan Jamaah di Bandara Internasional',
    category: 'Keberangkatan',
    location: 'Bandara Internasional Soekarno-Hatta Terminal 3',
    image: bandaraImg,
    year: 'Musim 2026'
  }
];

// Informasi Layanan Manasik & Bimbingan Ibadah
export const MANASIK_GUIDELINES = {
  title: 'Bimbingan Manasik Ibadah Umroh & Haji',
  description: 'Setiap jamaah terdaftar akan mendapatkan bimbingan manasik intensif sesuai Sunnah Rasulullah SAW dengan fasilitas miniatur Ka\'bah & Sa\'i, audio receiver transmitter, dan buku panduan doa.',
  note: 'Jadwal, waktu, dan lokasi pelaksanaan manasik akbar akan diinformasikan secara resmi oleh Tim Operasional Al-Ghanim kepada masing-masing jamaah/koordinator menjelang jadwal keberangkatan.'
};

export const MANASIK_SCHEDULE_DATA = [
  {
    id: 'm-1',
    batch: 'Bimbingan Manasik Akbar (Garut)',
    date: 'Diinformasikan menjelang keberangkatan',
    location: 'Kantor Cabang / Lokasi Resmi Garut',
    agenda: 'Simulasi Miniatur Ka\'bah & Sa\'i, Pemantapan Fiqih Ibadah, dan Pengambilan Perlengkapan',
    speaker: 'Tim Pembimbing Ibadah Resmi Al-Ghanim',
    status: 'Khusus Jamaah Terdaftar'
  },
  {
    id: 'm-2',
    batch: 'Bimbingan Manasik Akbar (Bandung)',
    date: 'Diinformasikan menjelang keberangkatan',
    location: 'Kantor Cabang / Lokasi Resmi Bandung',
    agenda: 'Bimbingan Teori Manasik, Praktik Memakai Ihram, Tata Cara Shalat Jamak Qashar, & Briefing Keberangkatan',
    speaker: 'Tim Pembimbing Ibadah Resmi Al-Ghanim',
    status: 'Khusus Jamaah Terdaftar'
  }
];

// Mitra Pendukung (Regulators, Airlines, Associations)
export const PARTNERS_DATA = [
  { name: 'Kemenag RI', role: 'Regulator Resmi PPIU', logoText: 'KEMENTERIAN AGAMA RI' },
  { name: 'SISKOPATUH', role: 'Sistem Terpadu Umroh Kemenag', logoText: 'SISKOPATUH' },
  { name: 'SAPUHI', role: 'Asosiasi Resmi PPIU & PIHK', logoText: 'ANGGOTA RESMI SAPUHI' },
  { name: 'Saudia Airlines', role: 'Maskapai Penerbangan Utama', logoText: 'SAUDIA AIRLINES' },
  { name: 'Garuda Indonesia', role: 'Maskapai Nasional Direct', logoText: 'GARUDA INDONESIA' },
  { name: 'Etihad Airways', role: 'Maskapai Bintang 5', logoText: 'ETIHAD AIRWAYS' },
  { name: 'Qatar Airways', role: 'World Best Airline', logoText: 'QATAR AIRWAYS' },
  { name: 'Turkish Airlines', role: 'Maskapai Plus Wisata', logoText: 'TURKISH AIRLINES' },
  { name: 'Oman Air', role: 'Maskapai Timur Tengah', logoText: 'OMAN AIR' },
  { name: 'Scoot Airlines', role: 'Maskapai Budget Friendly', logoText: 'SCOOT' },
  { name: 'Bank Syariah Indonesia', role: 'Mitra Tabungan Syariah', logoText: 'BSI SYARIAH' }
];

// Media Coverage (Info Garut, Jajanan Garut, dsb.)
export const MEDIA_COVERAGE_DATA = [
  {
    name: 'Info Garut',
    title: 'Al-Ghanim Berangkatkan Ribuan Jamaah Priangan Timur dengan Layanan Berkualitas',
    tag: 'Media Partner Garut'
  },
  {
    name: 'Jajanan Garut & Kuliner',
    title: 'Pelayanan Umroh Ramah Keluarga & Fasilitas Katering Khas Nusantara Al-Ghanim',
    tag: 'Komunitas & Lifestyle'
  },
  {
    name: 'Tribun Jabar & Media Nasional',
    title: 'Komitmen 5 Pasti Umroh Al-Ghanim Raih Akreditasi "A" dari Kementerian Agama',
    tag: 'Berita Nasional'
  }
];

// FAQ Lengkap Sesuai Mindmap Gambar & Kebutuhan Jamaah
export const FAQ_DATA: FAQItem[] = [
  // PROFIL & LEGALITAS
  {
    category: 'profil',
    question: 'Apakah Al-Ghanim sudah berizin resmi Kemenag RI?',
    answer: 'Ya, PT. Al-Ghanimah Berkah Bersama telah berizin resmi sebagai Penyelenggara Perjalanan Ibadah Umrah (PPIU) dari Kementerian Agama Republik Indonesia dengan PPIU No. 1030 Tahun 2019 (Akreditasi A), serta terhubung langsung ke sistem SISKOPATUH Kemenag RI.',
    tags: ['izin', 'legalitas', 'kemenag', 'siskopatuh', 'resmi', 'akreditasi']
  },
  {
    category: 'profil',
    question: 'Sejak kapan Al-Ghanim berdiri dan melayani jamaah?',
    answer: 'Al-Ghanim telah berdiri dan melayani jamaah sejak tahun 2013 (lebih dari 12 tahun pengalaman) dan telah memberangkatkan lebih dari 10.000 jamaah dari Garut, Bandung, Priangan Timur, Jakarta, dan berbagai penjuru Nusantara.',
    tags: ['profil', 'pengalaman', 'sejarah', 'garut', 'bandung', 'jamaah']
  },
  {
    category: 'profil',
    question: 'Apakah Al-Ghanim tergabung dalam Asosiasi Resmi Umroh & Haji?',
    answer: 'Ya, Al-Ghanim merupakan anggota resmi aktif SAPUHI (Serikat Penyelenggara Umrah Haji Indonesia) yang senantiasa mematuhi kode etik dan standar baku pelayanan ibadah di Tanah Air dan Tanah Suci.',
    tags: ['asosiasi', 'sapuhi', 'legal', 'resmi']
  },
  {
    category: 'profil',
    question: 'Di mana alamat kantor resmi Al-Ghanim di Garut dan Bandung?',
    answer: 'Kantor Layanan Garut (Mandala Umroh) berlokasi di Jl. Sudirman Copong, Sukamentri, Garut Kota (Depan Bundaran Copong). Kantor Cabang Bandung berada di Jl. Soekarno Hatta No. 590 (Metro Indah Mall), Buahbatu, Kota Bandung. Sedangkan Kantor Pusat berada di Menara Kadin Indonesia, Kuningan Rasuna Said, Jakarta Selatan. Jamaah dapat berkonsultasi tatap muka setiap hari kerja.',
    tags: ['kantor', 'garut', 'bandung', 'alamat', 'lokasi', 'copong', 'mandala', 'tatap muka']
  },

  // PAKET, HOTEL & FASILITAS
  {
    category: 'paket',
    question: 'Berapa hari durasi paket umroh di Al-Ghanim?',
    answer: 'Paket Umroh di Al-Ghanim beragam: tersedia paket 9 hari untuk Umroh Reguler Direct, 10 hari untuk Umroh Premium Pelataran, 12 hari untuk Umroh Jum\'atain (2x Shalat Jum\'at di Masjid Nabawi & Masjidil Haram), serta 12-16 hari untuk Umroh Plus Wisata (Thaif/Turki/Dubai/Kazakhstan) dan Paket Ramadhan.',
    tags: ['durasi', 'paket', 'hari', '9 hari', '12 hari', 'jumatain', 'ramadhan']
  },
  {
    category: 'paket',
    question: 'Maskapai penerbangan apa yang digunakan oleh Al-Ghanim?',
    answer: 'Al-Ghanim memprioritaskan penerbangan direct tanpa transit menggunakan maskapai berjadwal terbaik seperti Saudia Airlines dan Garuda Indonesia (Direct Jakarta-Madinah/Jeddah). Untuk paket plus wisata tersedia Turkish Airlines, Emirates, dan Qatar Airways.',
    tags: ['pesawat', 'maskapai', 'airline', 'saudia', 'garuda', 'direct', 'transit', 'emirates']
  },
  {
    category: 'paket',
    question: 'Hotel apa yang digunakan dan berapa jaraknya ke pelataran Masjid?',
    answer: 'Untuk paket Reguler & VIP, Al-Ghanim menggunakan Hotel Bintang 4 & Bintang 5 terpilih seperti Swissotel Makkah, Pullman Zamzam, Movenpick Hajar Tower, Fairmont, Rove Madinah, Dallah Taibah, dan Leader Al Muna Kareem. Jarak hotel berkisar 0 s/d 50 meter langsung di depan pelataran Masjidil Haram dan Masjid Nabawi (front-row).',
    tags: ['hotel', 'makkah', 'madinah', 'jarak', 'bintang 5', 'pelataran', 'swissotel', 'pullman', 'fairmont']
  },
  {
    category: 'paket',
    question: 'Apa perbedaan tipe kamar Quad, Triple, dan Double?',
    answer: '• Kamar Quad: 1 kamar diisi 4 orang jamaah (4 kasur terpisah, harga paket paling hemat).\n• Kamar Triple: 1 kamar diisi 3 orang jamaah (3 kasur terpisah).\n• Kamar Double: 1 kamar diisi 2 orang jamaah (khusus pasangan suami-istri atau keluarga 2 orang).',
    tags: ['kamar', 'quad', 'triple', 'double', 'tipe kamar', 'suami istri', 'keluarga']
  },
  {
    category: 'paket',
    question: 'Apakah paket umroh sudah termasuk Kereta Cepat Haramain dan City Tour Thaif?',
    answer: 'Ya, mayoritas paket unggulan Al-Ghanim (seperti Umroh Premium, Jumatain, dan Plus Wisata) sudah include fasilitas tiket Kereta Cepat Haramain Express (Makkah-Madinah hanya 2 jam) dan Full City Tour ke Kota Sejuk Pegunungan Thaif (termasuk Cable Car, Museum & Nasi Mandhi).',
    tags: ['kereta cepat', 'haramain', 'thaif', 'city tour', 'cable car', 'ziarah']
  },
  {
    category: 'paket',
    question: 'Berapa kali ibadah umroh yang difasilitasi dalam satu program?',
    answer: 'Al-Ghanim memfasilitasi pelaksanaan ibadah Umroh minimal 2 (dua) kali: Umroh pertama mengambil miqat di Bir Ali/Yalamlam, dan Umroh kedua mengambil miqat di Ji\'ranah atau Tan\'im yang didampingi penuh oleh asatidz pembimbing dan muthawwif senior.',
    tags: ['umroh 2x', 'miqat', 'bir ali', 'jiranah', 'tanim', 'muthawwif']
  },
  {
    category: 'paket',
    question: 'Bagaimana fasilitas untuk jamaah lansia atau berkebutuhan khusus (kursi roda)?',
    answer: 'Al-Ghanim menyediakan layanan ramah lansia: hotel ring 1 tanpa tanjakan terjal, pendampingan muthawwif ramah, pendaftaran kursi roda resmi di Masjidil Haram & Nabawi, serta opsi paket Privat Bespoke untuk keluarga lansia.',
    tags: ['lansia', 'kursi roda', 'disabilitas', 'orang tua', 'pendampingan']
  },

  // PERSYARATAN, PASPOR & VISA
  {
    category: 'dokumen',
    question: 'Apa saja dokumen yang diperlukan untuk mendaftar umroh?',
    answer: 'Dokumen yang diperlukan antara lain:\n1. Paspor Asli (minimal 2-3 suku kata, masa berlaku minimal 7-8 bulan sebelum tanggal kepulangan).\n2. Fotokopi KTP dan Kartu Keluarga (KK).\n3. Pas Foto terbaru 1 lembar (background putih, fokus wajah 80%, ukuran 4x6).\n4. Fotokopi Buku Nikah (bagi pasangan suami istri) atau Akta Kelahiran (bagi anak).\n5. Sertifikat Vaksin Meningitis (buku kuning/ICV) dan BPJS Kesehatan aktif.',
    tags: ['dokumen', 'syarat', 'paspor', 'ktp', 'kk', 'foto', 'buku nikah', 'pendaftaran']
  },
  {
    category: 'dokumen',
    question: 'Bagaimana jika nama di paspor saya hanya 1 kata (misal: "Ahmad")?',
    answer: 'Pemerintah Arab Saudi mensyaratkan nama di paspor minimal 2 suku kata (contoh: "Ahmad Hidayat"). Jika nama di paspor lama Anda hanya 1 kata, staf Al-Ghanim di kantor Garut/Bandung akan membantu proses permohonan Endorsement (Penambahan Nama Ayah/Kakek) di Kantor Imigrasi.',
    tags: ['paspor', 'nama', 'endorsement', '1 kata', 'imigrasi', 'tambah nama']
  },
  {
    category: 'dokumen',
    question: 'Apakah Al-Ghanim membantu pengurusan paspor bagi pemula?',
    answer: 'Tentu! Al-Ghanim memberikan Surat Rekomendasi Resmi PPIU Kemenag RI dan panduan pendaftaran M-Paspor untuk pengurusan paspor baru di Kantor Imigrasi (Garut, Bandung, Tasikmalaya, dll.).',
    tags: ['paspor', 'rekomendasi', 'pembuatan paspor', 'm paspor', 'imigrasi garut', 'bantuan']
  },
  {
    category: 'dokumen',
    question: 'Apa itu aplikasi Saudi Visa Bio dan Nusuk Raudhah?',
    answer: 'Saudi Visa Bio adalah aplikasi resmi Kementerian Luar Negeri Arab Saudi untuk rekam biometrik sidik jari dan wajah dari smartphone jamaah (didampingi tim kami). Sedangkan aplikasi Nusuk digunakan untuk pendaftaran jadwal izin (tasreh) masuk Raudhah Asy-Syarifah di Masjid Nabawi.',
    tags: ['visa', 'bio visa', 'saudi visa bio', 'nusuk', 'raudhah', 'tasreh', 'biometrik']
  },
  {
    category: 'dokumen',
    question: 'Apakah wanita bisa berangkat umroh sendiri tanpa mahram?',
    answer: 'Ya, saat ini peraturan resmi Kerajaan Arab Saudi dan Kemenag RI telah membolehkan wanita dari segala usia untuk bepergian dan melaksanakan ibadah Umroh secara mandiri tanpa didampingi mahram.',
    tags: ['mahram', 'wanita', 'sendiri', 'perempuan', 'hukum']
  },
  {
    category: 'dokumen',
    question: 'Berapa batas usia untuk ikut berangkat umroh dan anak-anak?',
    answer: 'Tidak ada batasan umur. Bayi, anak-anak, remaja, hingga lansia sudah bisa berangkat. Al-Ghanim memberikan potongan biaya khusus:\n• Bayi (0-24 bulan): Diskon 50% dari harga paket (No Bed & No Seat pesawat terpisah).\n• Anak (2-5 tahun): Diskon 25% dari harga paket (No Bed di hotel).',
    tags: ['usia', 'anak', 'bayi', 'diskon', 'potongan', 'umur']
  },

  // PEMBAYARAN, DP, CICILAN & PEMBATALAN
  {
    category: 'pembayaran',
    question: 'Berapa uang muka (DP) minimal untuk booking seat umroh?',
    answer: 'Uang Muka (DP) resmi untuk mengamankan seat penerbangan dan hotel adalah sebesar Rp 5.000.000 per jamaah (atau USD $4.500 untuk Haji Khusus / Furoda). Begitu DP dibayarkan, jamaah langsung mendapatkan koper & perlengkapan awal, kuitansi resmi, serta jaminan Rate Lock (harga terkunci).',
    tags: ['dp', 'uang muka', 'booking', 'seat', 'biaya', '5 juta', 'rate lock', 'pembayaran']
  },
  {
    category: 'pembayaran',
    question: 'Kapan batas waktu pelunasan biaya paket umroh?',
    answer: 'Pelunasan sisa biaya paket dilakukan paling lambat 30 hari (1 bulan) sebelum tanggal keberangkatan, atau sesuai jadwal penyerahan berkas visa final.',
    tags: ['pelunasan', 'pembayaran', 'batas waktu', 'sisa biaya', 'kapan lunas']
  },
  {
    category: 'pembayaran',
    question: 'Apakah tersedia opsi Cicilan atau Tabungan Umroh Syariah?',
    answer: 'Ya! Al-Ghanim bekerja sama resmi dengan Bank Syariah Indonesia (BSI) menyediakan Program Tabungan Umroh Barakah (setoran fleksibel mulai Rp 100.000/bulan) dan Fasilitas Pembiayaan Syariah tanpa riba.',
    tags: ['cicilan', 'tabungan', 'bsi', 'syariah', 'bank syariah indonesia', 'angsuran']
  },
  {
    category: 'pembayaran',
    question: 'Bagaimana ketentuan dan kebijakan jika terjadi pembatalan (Refund)?',
    answer: 'Ketentuan pembatalan mengikuti standar asosiasi SAPUHI & Kemenag RI:\n1. Pembatalan setelah DP s.d. 45 hari sebelum berangkat: Pengembalian dana penuh setelah dipotong biaya administrasi & perlengkapan yang sudah diterima.\n2. Pembatalan 30-44 hari sebelum berangkat: Dipotong biaya deposit tiket pesawat & hotel yang sudah diterbitkan (non-refundable dari maskapai/hotel).\n3. Pengalihan Seat: Jamaah berhak mengalihkan seat kepada anggota keluarga inti (ayah/ibu/anak/saudara) dengan penyesuaian data paspor sebelum visa dicetak.',
    tags: ['pembatalan', 'refund', 'batal', 'pengembalian dana', 'pengalihan seat', 'ganti nama']
  },

  // MANASIK & KEBERANGKATAN
  {
    category: 'manasik',
    question: 'Di mana dan kapan pelaksanaan Manasik Akbar Al-Ghanim diadakan?',
    answer: 'Manasik Akbar dilaksanakan secara berkala 2-3 minggu sebelum keberangkatan bertempat di Ballroom Hotel Santika Garut dan Convention Hall Grand Sunshine Bandung. Manasik mencakup teori fiqih sunnah, simulasi miniatur Ka\'bah & Sa\'i, praktik ihram, dan pembagian audiophone transmitter.',
    tags: ['manasik', 'garut', 'bandung', 'santika', 'jadwal manasik', 'pembekalan', 'ka\'bah']
  },
  {
    category: 'manasik',
    question: 'Apakah jamaah dari luar Garut/Bandung bisa mengikuti manasik online?',
    answer: 'Bisa! Al-Ghanim menyediakan sesi Bimbingan Manasik Intensif Hybrid/Online via Zoom Meeting Interaktif setiap pekan bagi jamaah yang berdomisili di luar kota atau berhalangan hadir secara fisik.',
    tags: ['manasik online', 'zoom', 'luar kota', 'jakarta', 'bimbingan online']
  },
  {
    category: 'manasik',
    question: 'Apa saja perlengkapan yang didapatkan jamaah saat manasik?',
    answer: 'Setiap jamaah mendapatkan 1 set perlengkapan eksekutif: Koper Fiber Premium 24-inch (Hardcase beroda 360°), Tas Paspor, Tas Ransel/Sling Bag, Kain Ihram & Sabuk (Pria) atau Mukena & Bergo Syar\'i (Wanita), Buku Saku Doa, Batik Seragam Al-Ghanim, Syal, Tag Koper, dan Air Zam-zam 5 Liter saat kepulangan.',
    tags: ['perlengkapan', 'koper', 'fasilitas', 'seragam', 'batik', 'mukena', 'ihram', 'zamzam']
  }
];

// Data Kemitraan (Cabang, Agen, Marketer)
export const PARTNERSHIP_PROGRAMS = [
  {
    id: 'cabang',
    title: 'Kantor Cabang Resmi',
    subtitle: 'Buka kantor representatif Al-Ghanim di kota Anda',
    benefits: [
      'Hak penggunaan brand resmi Al-Ghanim',
      'Sistem booking & kuota terintegrasi real-time',
      'Training manajemen operasional & marketing kit lengkap',
      'Bagi hasil dan komisi tertinggi per jamaah'
    ],
    target: 'Pengusaha, Yayasan, & Pesantren'
  },
  {
    id: 'agen',
    title: 'Keagenan Resmi Travel',
    subtitle: 'Menjadi agen pendaftaran umroh bersertifikat',
    benefits: [
      'Komisi menarik per setiap jamaah yang terdaftar',
      'Bonus reward tour & umroh gratis berkala',
      'Spanduk, banner, brosur, dan materi digital gratis',
      'Dukungan penuh tim CS & pembimbing asatidz'
    ],
    target: 'Biro Tour Lokal, KBIHU, & Tokoh Masyarakat'
  },
  {
    id: 'marketer',
    title: 'Marketer / Syiar Baitullah',
    subtitle: 'Ajak keluarga dan kerabat meraih pahala baitullah',
    benefits: [
      'Daftar mudah tanpa modal awal besar',
      'Komisi langsung cair setelah jamaah lunas',
      'Materi konten harian promosi WhatsApp & Instagram',
      'Bimbingan langsung via grup komunitas syiar'
    ],
    target: 'Ustadz/ah, Majelis Taklim, Karyawan, & Umum'
  }
];

export const SOCIAL_MEDIA_LINKS = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@alghanimislamictour',
    url: 'https://www.instagram.com/alghanimislamictour/',
    followers: '25.8k',
    color: 'from-pink-500 via-purple-500 to-indigo-500'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@alghanimislamictour',
    url: 'https://www.tiktok.com/@alghanimislamictour',
    followers: '18.4k',
    color: 'from-cyan-400 to-pink-500'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: 'Al-Ghanim Islamic Tour Official',
    url: 'https://www.youtube.com/@alghanimislamictour',
    followers: '12.2k',
    color: 'from-red-600 to-rose-700'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Al-Ghanim Mandiri Wisata',
    url: 'https://www.facebook.com/alghanimislamictour',
    followers: '15.6k',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Official',
    handle: '0813-1670-218',
    url: 'https://wa.me/628131670218?text=Halo%20Admin%20Al-Ghanim,%20saya%20ingin%20konsultasi%20paket%20ibadah',
    followers: '24 Jam',
    color: 'from-emerald-500 to-teal-600'
  }
];

export const OFFICES_DATA = {
  jakarta: {
    city: 'Jakarta',
    type: 'Kantor Pusat',
    title: 'Kantor Pusat Jakarta',
    address: 'Gedung Menara Kadin Indonesia Lt. 12, Jl. H.R. Rasuna Said Blok X-5 Kav. 2-3, Kuningan Timur, Setiabudi, Jakarta Selatan 12950',
    phone: '+62 813-1670-218',
    waLink: 'https://wa.me/628131670218?text=Halo%20Admin%20Pusat%20Jakarta%20Al-Ghanim,%20saya%20ingin%20konsultasi%20layanan%20ibadah',
    hours: 'Senin - Jumat: 08:30 - 17:30 WIB | Sabtu: 08:30 - 14:00 WIB'
  },
  bandung: {
    city: 'Kota Bandung',
    type: 'Kantor Cabang',
    title: 'Kantor Cabang Kota Bandung',
    address: 'Jl. Soekarno Hatta No. 590, Sekejati, Buahbatu, Kota Bandung, Jawa Barat 40286',
    phone: '+62 813-1670-218',
    waLink: 'https://wa.me/628131670218?text=Halo%20Sales%20Admin%20Cabang%20Bandung%20Al-Ghanim,%20saya%20ingin%20konsultasi%20paket%20umroh',
    hours: 'Senin - Sabtu: 09:00 - 17:30 WIB'
  },
  garut: {
    city: 'Garut',
    type: 'Kantor Cabang',
    title: 'Kantor Operasional Garut (Mandala Umroh)',
    address: 'Jl. Sudirman Copong Garut, Sukamentri, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44116',
    phone: '(0262) 4890731 / 0813-1670-218',
    whatsapp: '0813-1670-218',
    mapsUrl: 'https://www.google.com/maps/place/Mandala+Umroh/@-7.1987676,107.9108831,17z/data=!3m1!4b1!4m6!3m5!1s0x2e68b104425f10ab:0xab1f9dc7619e16f9!8m2!3d-7.1987676!4d107.9108831!16s%2Fg%2F11t7k1s3_y',
    waLink: 'https://wa.me/628131670218?text=Halo%20Sales%20Admin%20Cabang%20Garut%20Al-Ghanim,%20saya%20ingin%20konsultasi%20paket%20umroh',
    hours: 'Senin - Sabtu: 09:00 - 17:00 WIB'
  }
};

export const OFFICE_DETAILS = OFFICES_DATA;

export const FOOTER_SERVICES_STRUCTURE = {
  umroh: {
    title: 'Umroh Reguler & Privat',
    items: [
      { id: 'umroh-reguler', name: 'Umroh Reguler (OT)', desc: 'Keberangkatan berkala 9 & 12 Hari maskapai direct' },
      { id: 'umroh-custom', name: 'Umroh Custom by Request (PT)', desc: 'Private tour keluarga/grup bebas tentukan tanggal & hotel' },
      { id: 'tabungan', name: 'Tabungan Umroh', desc: 'Program menabung syariah fleksibel mulai 500rb/bulan' },
      { id: 'badal-umroh', name: 'Badal Umroh', desc: 'Pelaksanaan amanah oleh muthawwif mukim terpercaya + sertifikat' }
    ]
  },
  umrohPlus: {
    title: 'Umroh Plus Wisata Halal',
    items: [
      { id: 'wisata-halal', name: 'Umroh Plus Turki / Cappadocia', desc: 'Eksplorasi Istanbul, Bosphorus Cruise & Cappadocia' },
      { id: 'wisata-halal', name: 'Umroh Plus Dubai & Thaif', desc: 'City Tour Dubai, Burj Khalifa & Desert Safari' },
      { id: 'wisata-halal', name: 'Umroh Plus Kazakhstan', desc: 'Destinasi musim dingin Almaty & Shymbulak' }
    ]
  },
  additionalServices: [
    { id: 'wisata-halal', name: 'Wisata Halal Mancanegara', desc: 'Tour muslim (Turki, Dubai, Thaif, Mesir, Aqsha)' },
    { id: 'visa', name: 'Visa Umroh & Tourist Saudi', desc: 'Layanan pengurusan Visa resmi & cepat' },
    { id: 'tiket-pesawat', name: 'Tiket Pesawat Internasional', desc: 'Ticketing maskapai Saudia, Garuda, Qatar, Emirates' },
    { id: 'land-arrangements', name: 'Land Arrangements (LA)', desc: 'Penyedia handling bandara, Bus VIP, dan hotel di Saudi' }
  ]
};

export const REGULER_ITINERARY = [
  {
    day: 'Hari 1',
    title: 'Keberangkatan Jakarta (CGK) Menuju Madinah (MED)',
    desc: 'Berkumpul di Terminal 3 Bandara Soekarno Hatta, proses briefing dan penerbangan langsung menuju Bandara Amir Muhammad bin Abdul Aziz Madinah. Check-in hotel dan istirahat.'
  },
  {
    day: 'Hari 2',
    title: 'Ziarah Raudhah & Masjid Nabawi',
    desc: 'Melaksanakan shalat berjamaah di Masjid Nabawi, ziarah ke Makam Rasulullah SAW, Abu Bakar Ash-Shiddiq, dan Umar bin Khattab, serta masuk ke Raudhah Syarifah dengan izin Tasreh resmi.'
  },
  {
    day: 'Hari 3',
    title: 'Ziarah Kota Madinah (Masjid Quba, Jabal Uhud, Kebun Kurma)',
    desc: 'Ziarah napak tilas ke Masjid Quba (shalat sunnah senilai 1x umroh), Jabal Uhud (Makam Syuhada Uhud), Masjid Qiblatain, dan perkebunan kurma Madinah.'
  },
  {
    day: 'Hari 4',
    title: 'Perjalanan Madinah ke Makkah & Pelaksanaan Umroh Pertama',
    desc: 'Mandi ihram di hotel, bertolak ke Masjid Miqat Bir Ali untuk berniat ihram. Naik Kereta Cepat Haramain / Bus VIP ke Makkah. Check-in hotel Makkah dan melaksanakan Thawaf, Sa\'i, dan Tahallul didampingi asatidz.'
  },
  {
    day: 'Hari 5',
    title: 'Ibadah Mandiri di Masjidil Haram',
    desc: 'Memperbanyak shalat berjamaah, thawaf sunnah, tilawah Al-Qur\'an, dan doa di Multazam serta Hijir Ismail.'
  },
  {
    day: 'Hari 6',
    title: 'City Tour Makkah & Pelaksanaan Umroh Kedua',
    desc: 'Ziarah ke Padang Arafah (Jabal Rahmah), Muzdalifah, Mina, Jabal Tsur, Jabal Nur (Gua Hira), lalu mengambil Miqat di Ji\'ranah untuk Umroh kedua.'
  },
  {
    day: 'Hari 7',
    title: 'Free Program / City Tour Thaif (Opsi)',
    desc: 'Melakukan perjalanan ke kota sejuk Thaif, mengunjungi Masjid Ibnu Abbas, menaiki Cable Car Teleferik, dan santap kuliner Nasi Mandhi khas Arab Saudi.'
  },
  {
    day: 'Hari 8',
    title: 'Thawaf Wada\' & Menuju Bandara Jeddah',
    desc: 'Melaksanakan Thawaf Perpisahan (Thawaf Wada\') di Masjidil Haram, kemudian bertolak menuju Bandara Internasional King Abdul Aziz Jeddah untuk penerbangan pulang ke Jakarta.'
  },
  {
    day: 'Hari 9',
    title: 'Tiba di Jakarta (Bandara Soekarno Hatta)',
    desc: 'Insya Allah tiba dengan selamat di Bandara Soekarno Hatta Jakarta. Pembagian air zam-zam dan kembali ke rumah masing-masing membawa predikat Umroh Maqbullah.'
  }
];

export const LEGAL_INFO = {
  companyName: 'PT. Al-Ghanimah Berkah Bersama',
  corporateEntity: 'PT. Al-Ghanimah Berkah Bersama (Supported by Mandala 525 Islamic Tour)',
  brandName: 'ALGHANIM Islamic Tour',
  skKemenag: 'PPIU No. 1030 Tahun 2019 (Akreditasi A)',
  akreditasi: 'Terakreditasi "A" BAN PPIU Kemenag RI',
  iathiMembership: 'Anggota Resmi SAPUHI (No. 082/DPP/2021) & ASITA',
  siskopatuhId: 'Terintegrasi Sistem SISKOPATUH Kemenag RI No. 1030/2019',
  supportedBy: 'Didukung Penuh oleh @mandala525islamictour (Mandala Umroh Garut)',
  insurance: 'Asuransi Perjalanan Syariah Zurich Syariah / Jasindo Syariah'
};

// Data Jamaah untuk Portal Transparansi Umroh (Cek Progres Pasca DP & Pelunasan)
export const INITIAL_JAMAAH_DATA: JamaahProgressItem[] = [
  {
    id: 'jam-1',
    nij: 'AG-2026-8801',
    ktp: '3205011508850002',
    fullName: 'H. Ahmad Fauzi Ridwan',
    phone: '081223344556',
    birthDate: '1985-08-15',
    packageName: 'Umroh Reguler Syawal 1448 H (9 Hari)',
    departureDate: '24 April 2027',
    duration: '9 Hari / 7 Malam',
    airline: 'Saudia Airlines (Direct)',
    flightNumber: 'Direct CGK - JED',
    hotelMakkah: 'Swissotel Al Maqam Makkah (Bintang 5)',
    hotelMadinah: 'Dallah Taibah Madinah (Bintang 4)',
    paymentStatus: 'DP Terbayar',
    dpAmount: 'Rp 10.000.000',
    totalAmount: 'Rp 31.500.000',
    remainingAmount: 'Rp 21.500.000',
    progressStep: 1, // 1: Pendaftaran, 2: Dokumen, 3: Pelunasan & Manasik, 4: Visa & Tiket, 5: Siap Berangkat
    muthawifName: 'Tim Muthawwif Resmi Al-Ghanim',
    muthawifPhone: '0813-1670-218',
    tourLeaderName: 'ANAS ABU YAHYA',
    tourLeaderPhone: '0813-1670-218',
    pnrCode: 'SV-801819',
    ticketNumber: 'EK/SV-88012026',
    seatNumber: 'Group Allotment',
    airportMeetingTime: '16:00 WIB (4 Jam Sebelum Take-Off)',
    hotelMakkahDistance: '50m ke Pelataran Masjidil Haram (Depan Clock Tower)',
    hotelMadinahDistance: '50m ke Pintu Utama Masjid Nabawi (Markaziah Utara)',
    roomType: 'QUAD (Ber-4)',
    roomMakkahNumber: '1204',
    roomMadinahNumber: '0712',
    roommates: ['TEGUH WIJAYATA (Garut)', 'H. AHMAD FAUZI (Garut)', 'H. SUPARMAN (Bandung)'],
    manasikDate: 'Dikonfirmasi Menjelang Keberangkatan',
    manasikLocation: 'Kantor Cabang / Lokasi Resmi Garut',
    passportStatus: 'Menunggu Penyerahan Fisik',
    visaStatus: 'Menunggu Pelunasan',
    equipmentStatus: 'Dalam Proses Packing',
    notes: 'Pendaftaran baru & DP telah terverifikasi resmi oleh Kantor Al-Ghanim Garut. Menunggu kelengkapan dokumen paspor.'
  },
  {
    id: 'jam-2',
    nij: 'AG-2026-8802',
    ktp: '3205022004900004',
    fullName: 'Hj. Siti Aminah Rahmawati',
    phone: '085220119988',
    birthDate: '1990-04-20',
    packageName: 'Umroh VIP Plus Kereta Cepat Haramain (12 Hari)',
    departureDate: '15 Oktober 2026',
    duration: '12 Hari / 10 Malam',
    airline: 'Garuda Indonesia (Direct)',
    flightNumber: 'Direct CGK - MED',
    pnrCode: 'GA-991204',
    ticketNumber: 'GA/126-88022026',
    seatNumber: 'Seat 18A / 18B',
    airportMeetingTime: '06:00 WIB (Terminal 3 Bandara CGK)',
    hotelMakkah: 'Pullman Zamzam Makkah (Bintang 5)',
    hotelMakkahDistance: 'Pelataran Langsung Masjidil Haram',
    hotelMadinah: 'Rove Hotel Madinah (Bintang 5)',
    hotelMadinahDistance: '70m ke Pelataran Masjid Nabawi',
    roomType: 'DOUBLE (Ber-2)',
    roomMakkahNumber: '2108',
    roomMadinahNumber: '0915',
    roommates: ['H. RAHMAT HIDAYAT (Suami)'],
    paymentStatus: 'Lunas',
    dpAmount: 'Rp 15.000.000',
    totalAmount: 'Rp 38.500.000',
    remainingAmount: 'Rp 0 (LUNAS)',
    progressStep: 5, // Siap Berangkat
    muthawifName: 'Tim Muthawwif & Tour Leader Al-Ghanim',
    muthawifPhone: '0813-1670-218',
    tourLeaderName: 'ANAS ABU YAHYA',
    tourLeaderPhone: '0813-1670-218',
    manasikDate: 'Selesai Dilaksanakan',
    manasikLocation: 'Kantor Al-Ghanim Copong Garut',
    passportStatus: 'Lengkap & Terverifikasi',
    visaStatus: 'Visa Umroh Telah Terbit',
    equipmentStatus: 'Telah Diserahkan',
    notes: 'Dokumen visa elektronik (e-Visa) dan tiket Garuda sudah terbit. Harap kumpul di Terminal 3 Bandara CGK pukul 06:00 WIB pada hari H.'
  },
  {
    id: 'jam-3',
    nij: 'AG-2026-8803',
    ktp: '3205031012780001',
    fullName: 'Drs. H. Mulyadi Kusuma, M.Pd.',
    phone: '081394556677',
    birthDate: '1978-12-10',
    packageName: 'Umroh Awal Ramadhan 1448 H (12 Hari)',
    departureDate: '12 Maret 2027',
    duration: '12 Hari',
    airline: 'Saudia Airlines',
    flightNumber: 'SV-817 Direct CGK - JED',
    pnrCode: 'SV-771890',
    ticketNumber: 'EK/SV-88032026',
    seatNumber: 'Group Allotment',
    airportMeetingTime: '14:00 WIB (Terminal 3 Bandara CGK)',
    hotelMakkah: 'Movenpick Hotel Hajar Tower Makkah (Bintang 5)',
    hotelMakkahDistance: 'Pelataran Menara Jam Makkah',
    hotelMadinah: 'Nozol Royal Inn Madinah (Bintang 4)',
    hotelMadinahDistance: '100m ke Masjid Nabawi',
    roomType: 'QUAD (Ber-4)',
    roomMakkahNumber: '0814',
    roomMadinahNumber: '0520',
    roommates: ['H. ASEP SAEPUDIN (Garut)', 'H. DADANG KURNIA (Bandung)', 'H. ENDANG (Tasikmalaya)'],
    paymentStatus: 'DP Terbayar',
    dpAmount: 'Rp 10.000.000',
    totalAmount: 'Rp 35.000.000',
    remainingAmount: 'Rp 25.000.000',
    progressStep: 1, // Pendaftaran & DP
    muthawifName: 'Tim Muthawwif Resmi Al-Ghanim',
    muthawifPhone: '0813-1670-218',
    tourLeaderName: 'ANAS ABU YAHYA',
    tourLeaderPhone: '0813-1670-218',
    manasikDate: 'Dikonfirmasi Menjelang Keberangkatan',
    manasikLocation: 'Kantor Cabang Al-Ghanim',
    passportStatus: 'Dalam Proses Kantor Imigrasi',
    visaStatus: 'Menunggu Pelunasan',
    equipmentStatus: 'Dalam Proses Packing',
    notes: 'Surat rekomendasi pembuatan paspor dari Kemenag sudah diterbitkan oleh admin Al-Ghanim.'
  }
];

// Data Pertanyaan Jamaah / Chat AI / Leads untuk Admin CMS (Kosong default agar tidak muncul fake leads)
export const INITIAL_INQUIRIES_DATA: InquiryItem[] = [];

export const INITIAL_PARTNER_REGISTRATIONS: PartnerRegistrationItem[] = [
  {
    id: 'part-1',
    partnerCode: 'AG-AGN-525',
    name: 'Ustadz Deden Koswara, S.Pd.I',
    phone: '082112233445',
    city: 'Limbangan, Garut',
    tier: 'Agen',
    experience: 'Pimpinan Majelis Ta\'lim di Limbangan Garut dengan jamaah 200+ orang.',
    createdAt: '2026-08-28 19:40',
    status: 'Disetujui',
    totalJamaah: 18,
    totalCommission: 'Rp 27.000.000',
    paidCommission: 'Rp 22.500.000',
    pendingCommission: 'Rp 4.500.000',
    address: 'Jl. Raya Limbangan No. 45, Garut',
    binaanJamaah: [
      { id: 'bin-1', name: 'H. Dedi Suhendar & Istri', registeredDate: '04 Mar 2026', packageName: 'Umroh Friendly 9D WY', status: 'DP Terkonfirmasi', commissionAmount: 'Rp 3.000.000' },
      { id: 'bin-2', name: 'Hj. Siti Rohimah', registeredDate: '28 Feb 2026', packageName: 'Umroh Awal Ramadhan 1448 H', status: 'Lunas', commissionAmount: 'Rp 1.500.000' },
      { id: 'bin-3', name: 'Ahmad Fauzi & Keluarga (4 Pax)', registeredDate: '15 Feb 2026', packageName: 'Umroh Syawal Berkah', status: 'Lunas', commissionAmount: 'Rp 6.000.000' },
      { id: 'bin-4', name: 'Drs. H. Supriyadi', registeredDate: '02 Feb 2026', packageName: 'Haji Khusus Furoda VVIP', status: 'Proses Visa', commissionAmount: 'Rp 10.000.000' }
    ]
  },
  {
    id: 'part-2',
    partnerCode: 'AG-CAB-001',
    name: 'H. Cecep Supriatna',
    phone: '081398877665',
    city: 'Tarogong Kaler, Garut',
    tier: 'Cabang',
    experience: 'Memiliki kantor representatif di Jl. Otista Garut dan jejaring KBIHU.',
    createdAt: '2026-08-27 10:15',
    status: 'Disetujui',
    totalJamaah: 42,
    totalCommission: 'Rp 75.000.000',
    paidCommission: 'Rp 65.000.000',
    pendingCommission: 'Rp 10.000.000',
    address: 'Jl. Otista No. 112, Tarogong Kaler, Garut',
    binaanJamaah: [
      { id: 'bin-c1', name: 'Rombongan KBIH Al-Falah (20 Pax)', registeredDate: '10 Jan 2026', packageName: 'Umroh Akbar Syawal', status: 'Lunas', commissionAmount: 'Rp 40.000.000' },
      { id: 'bin-c2', name: 'Keluarga Bpk. H. Mahmudin (6 Pax)', registeredDate: '18 Jan 2026', packageName: 'Umroh VIP Bintang 5', status: 'Lunas', commissionAmount: 'Rp 15.000.000' },
      { id: 'bin-c3', name: 'Ibu Hj. Mariam & Rombongan (8 Pax)', registeredDate: '02 Feb 2026', packageName: 'Umroh Ramadhan', status: 'Proses Visa', commissionAmount: 'Rp 20.000.000' }
    ]
  },
  {
    id: 'part-3',
    partnerCode: 'AG-MKT-108',
    name: 'Ibu Hj. Nining Ratnaningsih',
    phone: '085798112233',
    city: 'Cibatu, Garut',
    tier: 'Marketer',
    experience: 'Koordinator majelis taklim ibu-ibu se-Kecamatan Cibatu.',
    createdAt: '2026-08-29 11:20',
    status: 'Disetujui',
    totalJamaah: 8,
    totalCommission: 'Rp 8.000.000',
    paidCommission: 'Rp 6.000.000',
    pendingCommission: 'Rp 2.000.000',
    address: 'Kp. Pasantren RT 02/RW 04 Cibatu, Garut'
  }
];

export function calculatePartnerCommissions(partner: PartnerRegistrationItem) {
  if (partner.binaanJamaah && partner.binaanJamaah.length > 0) {
    let total = 0;
    let paid = 0;
    let pending = 0;
    for (const b of partner.binaanJamaah) {
      const commStr = (b as any).commissionAmount || (b as any).commission || '0';
      const val = parseInt(commStr.replace(/[^0-9]/g, ''), 10) || 0;
      total += val;
      if (b.status === 'Lunas' || (b.status as string) === 'Selesai') {
        paid += val;
      } else {
        pending += val;
      }
    }
    const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;
    return {
      totalCommission: total > 0 ? formatRp(total) : (partner.totalCommission || 'Rp 0'),
      paidCommission: paid > 0 ? formatRp(paid) : (partner.paidCommission || 'Rp 0'),
      pendingCommission: pending > 0 ? formatRp(pending) : (partner.pendingCommission || 'Rp 0'),
      totalJamaah: Math.max(partner.totalJamaah || 0, partner.binaanJamaah.length)
    };
  }
  return {
    totalCommission: partner.totalCommission || 'Rp 0',
    paidCommission: partner.paidCommission || 'Rp 0',
    pendingCommission: partner.pendingCommission || 'Rp 0',
    totalJamaah: partner.totalJamaah || 0
  };
}

export const INITIAL_PROMO_BANNERS = [
  {
    id: 'banner-promo-1',
    title: 'PROMO UMROH HEMAT 9 HARI - MULAI RP 26 JUTAAN',
    subtitle: 'Hotel Bintang Dekat Masjid di Makkah & Madinah. Maskapai Ternama (Saudia, Qatar, Etihad, Oman Air). Keberangkatan 21 Nov 2026, 10 Des 2026, 31 Jan 2027 Masih Dibuka (Kuota Terbatas)!',
    badgeText: '#SPESIALIS UMROH HEMAT',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    targetLink: OFFICIAL_WA_LINK,
    ctaText: 'Daftar Promo Umroh Hemat',
    startDate: '2026-08-01',
    endDate: '2027-02-28',
    isActive: true,
    aspectRatio: 'portrait' as const,
    posterSizeFormat: 'flyer-vertical' as const
  },
  {
    id: 'banner-promo-2',
    title: 'SEAT TERBATAS: HAJI FURODA & KHUSUS 2027',
    subtitle: 'Visa Haji Resmi Kerajaan Saudi, Maktab VVIP Arafah Mina 111-112, Hotel 0 Meter Ka\'bah.',
    badgeText: 'KUOTA TERBATAS',
    imageUrl: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80',
    targetLink: OFFICIAL_WA_LINK,
    ctaText: 'Konsultasi Haji VVIP',
    startDate: '2026-08-01',
    endDate: '2027-04-30',
    isActive: true,
    aspectRatio: 'landscape' as const,
    posterSizeFormat: 'banner-horizontal' as const
  }
];



