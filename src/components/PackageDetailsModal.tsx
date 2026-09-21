import { useState } from 'react';
import { 
  X, 
  Plane, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Droplets,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { REGULER_ITINERARY } from '../data/packagesData';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (packageName: string) => void;
}

export const PackageDetailsModal = ({ isOpen, onClose, onBookNow }: PackageDetailsModalProps) => {
  const [selectedDuration, setSelectedDuration] = useState<'9 Hari' | '12 Hari'>('9 Hari');
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotel' | 'fasilitas' | 'jadwal'>('itinerary');

  if (!isOpen) return null;

  const departureSchedules = [
    { date: '15 September 2026', airline: 'Saudia Airlines (Direct)', seatsLeft: '4 Kursi Tersisa', status: 'Hampir Penuh', price: 'Rp 28.500.000' },
    { date: '04 Oktober 2026', airline: 'Garuda Indonesia (Direct)', seatsLeft: '12 Kursi Tersisa', status: 'Tersedia', price: 'Rp 29.800.000' },
    { date: '18 November 2026', airline: 'Saudia Airlines (Direct)', seatsLeft: '8 Kursi Tersisa', status: 'Tersedia', price: 'Rp 28.900.000' },
    { date: '10 Desember 2026 (Musim Dingin)', airline: 'Garuda Indonesia (Direct)', seatsLeft: '6 Kursi Tersisa', status: 'Favorit', price: 'Rp 31.500.000' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1a1a1a] border border-[#8e9192]/40 rounded-2xl shadow-2xl overflow-hidden my-8 text-[#e5e2e1] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#444748] flex items-center justify-between bg-[#131313]/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dcdcdc] text-[#131313] uppercase tracking-wider">
                Paket Unggulan
              </span>
              <span className="text-xs text-[#8e9192]">Bimbingan Sesuai Sunnah</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#dcdcdc] mt-1">
              Umroh Reguler Premium
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#2a2a2a] text-[#8e9192] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Duration & Tab Switchers */}
        <div className="px-6 pt-4 pb-2 bg-[#201f1f] border-b border-[#444748] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-[#8e9192] tracking-wider">Pilihan Durasi:</span>
            <div className="flex bg-[#131313] p-1 rounded-lg border border-[#444748]">
              <button
                onClick={() => setSelectedDuration('9 Hari')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                  selectedDuration === '9 Hari'
                    ? 'bg-[#dcdcdc] text-[#131313]'
                    : 'text-[#8e9192] hover:text-white'
                }`}
              >
                9 Hari (Program Inti)
              </button>
              <button
                onClick={() => setSelectedDuration('12 Hari')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                  selectedDuration === '12 Hari'
                    ? 'bg-[#dcdcdc] text-[#131313]'
                    : 'text-[#8e9192] hover:text-white'
                }`}
              >
                12 Hari (Plus Taif / Madinah Lebih Lama)
              </button>
            </div>
          </div>

          <div className="flex gap-2 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'itinerary' ? 'bg-[#dcdcdc]/15 text-[#dcdcdc] border border-[#dcdcdc]/40' : 'text-[#8e9192] hover:text-white'
              }`}
            >
              Rencana Perjalanan
            </button>
            <button
              onClick={() => setActiveTab('hotel')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'hotel' ? 'bg-[#dcdcdc]/15 text-[#dcdcdc] border border-[#dcdcdc]/40' : 'text-[#8e9192] hover:text-white'
              }`}
            >
              Akomodasi &amp; Maskapai
            </button>
            <button
              onClick={() => setActiveTab('fasilitas')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'fasilitas' ? 'bg-[#dcdcdc]/15 text-[#dcdcdc] border border-[#dcdcdc]/40' : 'text-[#8e9192] hover:text-white'
              }`}
            >
              Fasilitas &amp; Syarat
            </button>
            <button
              onClick={() => setActiveTab('jadwal')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'jadwal' ? 'bg-[#dcdcdc]/15 text-[#dcdcdc] border border-[#dcdcdc]/40' : 'text-[#8e9192] hover:text-white'
              }`}
            >
              Jadwal &amp; Seat
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#131313] border border-[#444748]/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#dcdcdc]" />
                  <div>
                    <p className="text-sm font-semibold text-white">Program Umroh Reguler {selectedDuration}</p>
                    <p className="text-xs text-[#8e9192]">Bimbingan Manasik Teori &amp; Praktik sebelum keberangkatan</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded bg-[#2a2a2a] text-[#dcdcdc] border border-[#8e9192]/30">
                  Direct Flight (Tanpa Transit)
                </span>
              </div>

              <div className="space-y-3">
                {REGULER_ITINERARY.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#201f1f] border border-[#444748]/50 hover:border-[#8e9192]/50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif-luxury text-sm font-bold text-[#dcdcdc] tracking-wider uppercase">
                        {item.day}
                      </span>
                      <span className="text-xs text-[#8e9192]">Pendampingan Muthawwif Resmi</span>
                    </div>
                    <h3 className="font-semibold text-[#e5e2e1] text-base mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#c4c7c7] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hotel' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#dcdcdc] mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#dcdcdc]" />
                  Akomodasi Hotel Pilihan Dekat Masjid
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#201f1f] border border-[#444748]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2.5 py-0.5 rounded bg-[#353534] text-[#dcdcdc] font-semibold">Makkah Al-Mukarramah</span>
                      <span className="text-xs text-yellow-400">★★★★ (Bintang 4)</span>
                    </div>
                    <h4 className="font-bold text-white text-base">Maysan Al - Maqom ★★★★</h4>
                    <p className="text-xs text-[#c4c7c7] mt-1">Akomodasi berjarak dekat dengan pelataran Masjidil Haram (atau setaraf), memberikan kenyamanan maksimal dalam menjalankan shalat berjamaah 5 waktu.</p>
                    <p className="text-xs text-[#8e9192] mt-2">✓ Full board makan 3x sehari masakan Indonesia / Internasional</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#201f1f] border border-[#444748]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2.5 py-0.5 rounded bg-[#353534] text-[#dcdcdc] font-semibold">Madinah Al-Munawwarah</span>
                      <span className="text-xs text-yellow-400">★★★ (Bintang 3)</span>
                    </div>
                    <h4 className="font-bold text-white text-base">Jawharat Al Rasheed ★★★</h4>
                    <p className="text-xs text-[#c4c7c7] mt-1">Akomodasi berjarak dekat dengan pelataran Masjid Nabawi (atau setaraf), akses sangat mudah menuju pelataran shalat, Raudhah &amp; Makam Rasulullah SAW.</p>
                    <p className="text-xs text-[#8e9192] mt-2">✓ Fasilitas bersih, nyaman, dan pelayanan ramah jamaah</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#dcdcdc] mb-3 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-[#dcdcdc]" />
                  Maskapai Penerbangan Resmi
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#201f1f] border border-[#444748]">
                    <div className="font-bold text-white text-base">Saudia Airlines (SV)</div>
                    <p className="text-xs text-[#c4c7c7] mt-1">Boeing 777-300ER / Dreamliner 787. Penerbangan direct tanpa transit Jakarta (CGK) - Madinah (MED) / Jeddah (JED).</p>
                    <span className="inline-block mt-2 text-xs text-[#dcdcdc] bg-[#131313] px-2.5 py-1 rounded">Bagasi: 23kg + Free Lounge Bandara Jakarta</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#201f1f] border border-[#444748]">
                    <div className="font-bold text-white text-base">Garuda Indonesia (GA) / Oman Air</div>
                    <p className="text-xs text-[#c4c7c7] mt-1">Maskapai bereputasi tinggi dengan pelayanan ramah, makanan halal, dan bimbingan ibadah selama penerbangan.</p>
                    <span className="inline-block mt-2 text-xs text-[#dcdcdc] bg-[#131313] px-2.5 py-1 rounded">Bagasi: 23kg - 30kg + Bagasi Kabin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fasilitas' && (
            <div className="space-y-6">
              {/* Free Perks Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#A67C52]/20 via-[#A67C52]/10 to-transparent border border-[#A67C52]/40">
                <h4 className="font-bold text-sm text-[#dcdcdc] mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#A67C52]" /> Fasilitas Istimewa &amp; Free Tambahan Resmi:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-emerald-300">
                  <div className="flex items-center gap-1.5">✓ Free Lounge Bandara Jakarta</div>
                  <div className="flex items-center gap-1.5">✓ Free Transportasi Bandung-Jakarta PP</div>
                  <div className="flex items-center gap-1.5">✓ Free Perlengkapan Umroh</div>
                  <div className="flex items-center gap-1.5">✓ Free Air Zam-Zam 5 Liter</div>
                  <div className="flex items-center gap-1.5">✓ Free City Tour Mekkah &amp; Madinah</div>
                  <div className="flex items-center gap-1.5">✓ Free Bagasi 23 KG</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-[#201f1f] border border-[#444748]">
                  <h4 className="font-serif-luxury text-base font-bold text-[#dcdcdc] mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Harga Sudah Termasuk (Inclusions)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#c4c7c7]">
                    <li className="flex items-center gap-2">✓ Tiket Pesawat PP (Direct Tanpa Transit)</li>
                    <li className="flex items-center gap-2">✓ Akomodasi Hotel Sesuai Program (Maysan Al - Maqom / Jawharat Al Rasheed)</li>
                    <li className="flex items-center gap-2">✓ Makan 3x Sehari Sesuai Program</li>
                    <li className="flex items-center gap-2">✓ Tour Leader &amp; Pembimbing Berpengalaman</li>
                    <li className="flex items-center gap-2">✓ Asuransi Perjalanan</li>
                    <li className="flex items-center gap-2">✓ Visa Umroh Resmi</li>
                    <li className="flex items-center gap-2">✓ Handling Bandara Indonesia &amp; Saudi</li>
                    <li className="flex items-center gap-2">✓ Transportasi Bus AC Mekkah dan Madinah</li>
                    <li className="flex items-center gap-2">✓ Manasik Umroh Intensif</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-[#201f1f] border border-[#444748]">
                  <h4 className="font-serif-luxury text-base font-bold text-[#dcdcdc] mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    Belum Termasuk (Exclusions)
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#c4c7c7]">
                    <li className="flex items-center gap-2">✗ Pembuatan / Perpanjangan Paspor</li>
                    <li className="flex items-center gap-2">✗ Vaksin Meningitis &amp; Polio</li>
                    <li className="flex items-center gap-2">✗ Kelebihan Bagasi Pribadi</li>
                    <li className="flex items-center gap-2">✗ Koper (Pengadaan Mandiri / Opsional)</li>
                  </ul>
                  <div className="mt-4 p-3 bg-[#131313] rounded-lg border border-[#444748] text-xs text-[#8e9192]">
                    <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#dcdcdc]" /> Dokumen Pendaftaran:
                    </p>
                    <p>1. Foto Paspor asli | 2. KTP &amp; KK | 3. Buku Nikah (suami-istri) / Akta Lahir (anak) | 4. Pasfoto 4x6</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jadwal' && (
            <div className="space-y-4">
              <div className="text-xs text-[#8e9192] flex items-center justify-between">
                <span>Pilih tanggal keberangkatan yang sesuai dengan rencana keluarga Anda:</span>
                <span className="text-[#dcdcdc]">Tahun Keberangkatan 1448 H / 2026 M</span>
              </div>
              <div className="space-y-3">
                {departureSchedules.map((schedule, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#201f1f] border border-[#444748] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#dcdcdc]" />
                        <span className="font-bold text-white text-base">{schedule.date}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#353534] text-[#dcdcdc] font-medium">
                          {schedule.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#c4c7c7] mt-1">{schedule.airline} • {schedule.seatsLeft}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-serif-luxury text-lg font-bold text-[#dcdcdc]">{schedule.price}</span>
                      <button
                        onClick={() => {
                          onClose();
                          onBookNow(`Umroh Reguler - ${schedule.date}`);
                        }}
                        className="btn-outline-silver px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#dcdcdc] cursor-pointer"
                      >
                        Pilih Jadwal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#131313] border-t border-[#444748] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#8e9192]">
            <Droplets className="w-4 h-4 text-[#dcdcdc]" />
            <span>Garansi 5 Pasti Umroh Kemenag RI (Pasti Travel, Jadwal, Terbang, Hotel, Visa)</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-[#8e9192] hover:text-white border border-[#444748] cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow('Umroh Reguler 9-12 Hari');
              }}
              className="btn-outline-silver px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold text-[#dcdcdc] flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              Konsultasi Paket Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
