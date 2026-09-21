export interface PackageCategoryOption {
  category: string;
  badge: string;
  packages: {
    name: string;
    duration: string;
    defaultPrice: string;
  }[];
}

export const CATEGORIZED_PACKAGES: PackageCategoryOption[] = [
  {
    category: 'Reguler',
    badge: 'Reguler',
    packages: [
      {
        name: 'Umroh Reguler Syawal 1448 H (9 Hari)',
        duration: '9 Hari',
        defaultPrice: 'Rp 28.500.000'
      },
      {
        name: 'Umroh Hemat 9 Hari (31 Januari 2027)',
        duration: '9 Hari',
        defaultPrice: 'Rp 28.000.000'
      },
      {
        name: 'Promo Umroh Hemat 9 Hari Direct Saudia (22 Sep 2026)',
        duration: '9 Hari',
        defaultPrice: 'Rp 26.000.000'
      },
      {
        name: 'Umroh Hemat 9 Hari (21 Oktober 2026)',
        duration: '9 Hari',
        defaultPrice: 'Rp 27.500.000'
      },
      {
        name: 'Umroh Friendly 9D WY (23 Sep 2026)',
        duration: '9 Hari',
        defaultPrice: 'Rp 26.500.000'
      },
      {
        name: 'Umroh Syawal Berkah 9 Hari Direct',
        duration: '9 Hari',
        defaultPrice: 'Rp 29.000.000'
      }
    ]
  },
  {
    category: 'Ramadhan',
    badge: 'Ramadhan',
    packages: [
      {
        name: 'Umroh Awal Ramadhan 1448 H (9 Hari)',
        duration: '9 Hari',
        defaultPrice: 'Rp 33.500.000'
      },
      {
        name: 'Umroh Pertengahan Ramadhan 1448 H (12 Hari)',
        duration: '12 Hari',
        defaultPrice: 'Rp 36.500.000'
      },
      {
        name: "Umroh Lailatul Qadar & I'tikaf Akhir Ramadhan (16 Hari)",
        duration: '16 Hari',
        defaultPrice: 'Rp 42.000.000'
      },
      {
        name: 'Umroh Full Ramadhan 1448 H (30 Hari)',
        duration: '30 Hari',
        defaultPrice: 'Rp 55.000.000'
      }
    ]
  },
  {
    category: 'Plus Wisata',
    badge: 'Plus Wisata',
    packages: [
      {
        name: 'Umroh Plus Turkey & Cappadocia 12 Hari',
        duration: '12 Hari',
        defaultPrice: 'Rp 36.500.000'
      },
      {
        name: 'Umroh Plus Dubai & Abu Dhabi 10 Hari',
        duration: '10 Hari',
        defaultPrice: 'Rp 34.000.000'
      },
      {
        name: 'Umroh Plus Aqsha, Jordan & Petra 12 Hari',
        duration: '12 Hari',
        defaultPrice: 'Rp 39.500.000'
      },
      {
        name: 'Umroh Plus Mesir & Cairo 12 Hari',
        duration: '12 Hari',
        defaultPrice: 'Rp 35.000.000'
      }
    ]
  },
  {
    category: 'Haji Resmi',
    badge: 'Haji Resmi',
    packages: [
      {
        name: 'Haji Khusus Kuota Resmi Kemenag RI (Masa Tunggu Cepat)',
        duration: '25-30 Hari',
        defaultPrice: 'USD 14.500'
      },
      {
        name: 'Haji Mujamalah / Furoda Visa Resmi (Langsung Berangkat)',
        duration: '21-25 Hari',
        defaultPrice: 'USD 22.000'
      }
    ]
  }
];

// Helper kalkulasi otomatis jarak hotel real-time (tanpa perlu admin ketik jarak)
export const getAutoHotelDistance = (hotelName: string, city: 'makkah' | 'madinah'): string => {
  if (!hotelName) {
    return city === 'makkah'
      ? '50m ke Pelataran Masjidil Haram (Ring 1)'
      : '50m ke Pelataran Masjid Nabawi (Markaziah)';
  }

  const h = hotelName.toLowerCase();
  if (city === 'makkah') {
    if (
      h.includes('swissotel') ||
      h.includes('zamzam') ||
      h.includes('clock') ||
      h.includes('fairmont') ||
      h.includes('dar al eiman') ||
      h.includes('makkah hotel') ||
      h.includes('abraj') ||
      h.includes('safwah')
    ) {
      return '50m ke Pelataran Masjidil Haram (Depan Menara Jam - Ring 1)';
    }
    if (h.includes('anjum')) {
      return '150m ke Pelataran Masjidil Haram (Kawasan Jabal Ka\'bah)';
    }
    if (h.includes('maysan')) {
      return '350m ke Pelataran Masjidil Haram';
    }
    if (h.includes('olayan') || h.includes('golden')) {
      return '450m ke Masjidil Haram (Shuttle Bus Siap 24 Jam)';
    }
    return '100m ke Pelataran Masjidil Haram (Ring 1 Dekat Pelataran)';
  } else {
    // Madinah
    if (
      h.includes('dallah') ||
      h.includes('taibah') ||
      h.includes('rawda') ||
      h.includes('maden') ||
      h.includes('frontel') ||
      h.includes('al harithia') ||
      h.includes('oberoi') ||
      h.includes('dar al taqwa')
    ) {
      return '50m ke Pintu Utama Masjid Nabawi (Kawasan Markaziah Utara)';
    }
    if (
      h.includes('riyadh') ||
      h.includes('zahra') ||
      h.includes('jawharat') ||
      h.includes('rasheed')
    ) {
      return '250m ke Pintu Masjid Nabawi (Markaziah)';
    }
    return '100m ke Pintu Masjid Nabawi (Kawasan Markaziah)';
  }
};
