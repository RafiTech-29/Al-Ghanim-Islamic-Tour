import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Coins, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  HelpCircle, 
  Calculator, 
  TrendingUp, 
  Lock, 
  Clock, 
  Building, 
  Plane, 
  QrCode, 
  Smartphone, 
  MessageSquare,
  Info
} from 'lucide-react';
import { OFFICIAL_WA_LINK } from '../data/packagesData';

interface RegulationRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'kurs' | 'musim' | 'visa' | 'kalkulator';
}

export const RegulationRatesModal: React.FC<RegulationRatesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'kurs'
}) => {
  const [activeTab, setActiveTab] = useState<'kurs' | 'musim' | 'visa' | 'kalkulator'>(initialTab);

  // Kurs Calculator state
  const [sarInput, setSarInput] = useState<number>(5000);
  const [usdInput, setUsdInput] = useState<number>(2000);
  const [rateSAR, setRateSAR] = useState<number>(4280); // IDR per SAR
  const [rateUSD, setRateUSD] = useState<number>(16250); // IDR per USD

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 text-[#1A1A1A] flex flex-col">
        
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#1A1A1A] via-[#2A2421] to-[#1A1A1A] text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#A67C52] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pusat Regulasi &amp; Kurs Resmi
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 text-[10px] font-bold">
              Update Musim 1448 H / 2027
            </span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold">
            Informasi Regulasi Pemerintah, Visa &amp; Fluktuasi Kurs
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
            Transparansi penuh mengenai fluktuasi SAR/USD, kepastian kuota Ramadhan &amp; Haji Khusus/Furoda, serta sistem Saudi Visa Bio &amp; Nusuk Raudhah.
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
            {[
              { id: 'kurs', label: '1. Fluktuasi Kurs & Komponen Valas', icon: Coins },
              { id: 'musim', label: '2. Dinamika Musim Ramadhan & Haji', icon: Calendar },
              { id: 'visa', label: '3. Bio Visa, Nusuk & Paspor', icon: FileText },
              { id: 'kalkulator', label: '4. Simulasi Kurs Valas', icon: Calculator }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#A67C52] text-white shadow-md'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 bg-white">

          {/* TAB 1: FLUKTUASI KURS SAR & USD */}
          {activeTab === 'kurs' && (
            <div className="space-y-6">
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#A67C52]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#A67C52] font-bold text-sm">
                  <Coins className="w-5 h-5" />
                  <span>Mengapa Harga Paket Umroh &amp; Haji Terpengaruh Kurs?</span>
                </div>
                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                  Sekitar <strong>75% - 85% biaya komponen ibadah</strong> dibayarkan langsung kepada pihak penyedia layanan di Kerajaan Arab Saudi dalam mata uang asing (<strong>SAR - Saudi Riyal</strong> dan <strong>USD - US Dollar</strong>).
                </p>
              </div>

              {/* Komponen Biaya Valas Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1A1A1A]">Hotel Makkah &amp; Madinah (SAR)</h4>
                  <p className="text-xs text-gray-600">
                    Sewa kamar di Hotel Pelataran Haramain (Clock Tower, Dar Al Eiman, Pullman) dibayar dalam SAR termasuk Pajak PPN Saudi (15%) dan Pajak Kota (Municipality Tax 5%).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                    <Plane className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1A1A1A]">Tiket Pesawat &amp; Fuel Surcharge (USD)</h4>
                  <p className="text-xs text-gray-600">
                    Avtur pesawat internasional (Garuda Indonesia, Saudia Airlines, Qatar Airways) dihitung dalam USD dengan regulasi IATA global.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1A1A1A]">Visa Umroh, Asuransi &amp; Bus (SAR)</h4>
                  <p className="text-xs text-gray-600">
                    Biaya penerbitan Visa Muassasah, asuransi kesehatan komprehensif Saudi Tawuniya, serta armada bus eksekutif SAPTCO / Haramain Train.
                  </p>
                </div>
              </div>

              {/* Kebijakan Rate Lock Al-Ghanim */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Lock className="w-5 h-5" />
                  <span>Garansi Penguncian Kurs (Rate Lock Guarantee) ALGHANIM</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  Untuk melindungi calon jamaah dari lonjakan nilai tukar mendadak, <strong>ALGHANIM memberlakukan kebijakan Rate Lock</strong>: Saat jamaah melakukan pembayaran DP resmi (Down Payment), harga paket dalam IDR otomatis <strong>terkunci</strong> dan tidak akan dikenakan biaya tambahan kenaikan kurs selama periode pelunasan sesuai jadwal kontrak.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PAKET MUSIM TERTENTU (RAMADHAN & HAJI KHUSUS / FURODA) */}
          {activeTab === 'musim' && (
            <div className="space-y-6">
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#A67C52]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#A67C52] font-bold text-sm">
                  <Calendar className="w-5 h-5" />
                  <span>Karakteristik Musiman &amp; Fluktuasi Seat Haramain</span>
                </div>
                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                  Ketersediaan seat penerbangan direct (CGK-JED/MED) dan kamar hotel bintang 5 di depan pelataran Ka'bah memiliki dinamika ketersediaan yang sangat ketat pada musim-musim puncak (High Season &amp; Peak Season).
                </p>
              </div>

              {/* Musim Breakdown */}
              <div className="space-y-4">
                {/* 1. Rajab & Syaban */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Musim Rajab – Sya'ban 1448 H
                    </span>
                    <h4 className="font-serif-luxury font-bold text-sm text-[#1A1A1A]">Pemanasan Menuju Ramadhan (Kondisi Nyaman &amp; Tenang)</h4>
                    <p className="text-xs text-gray-600">
                      Pelataran thawaf relatif lebih longgar dibanding Ramadhan. Sangat direkomendasikan bagi lansia dan keluarga dengan anak kecil.
                    </p>
                  </div>
                  <span className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Ketersediaan: Terbuka
                  </span>
                </div>

                {/* 2. Ramadhan Penuh / Lailatul Qadar */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Musim Ramadhan &amp; 10 Hari Terakhir (Itikaf)
                    </span>
                    <h4 className="font-serif-luxury font-bold text-sm text-[#1A1A1A]">Pahala Senilai Berhaji Bersama Rasulullah SAW</h4>
                    <p className="text-xs text-gray-600">
                      Hotel di pelataran Makkah menerapkan sistem sewa <strong>Paket Full Ramadhan / 10 Hari Terakhir</strong>. Kuota seat penerbangan direct sangat cepat habis (fast moving).
                    </p>
                  </div>
                  <span className="shrink-0 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold">
                    Ketersediaan: Cepat Penuh
                  </span>
                </div>

                {/* 3. Haji Furoda & Haji Khusus */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#A67C52] bg-[#A67C52]/10 px-2.5 py-0.5 rounded-full border border-[#A67C52]/20">
                      Haji Khusus (Kemenag) &amp; Haji Furoda (Mujamalah)
                    </span>
                    <h4 className="font-serif-luxury font-bold text-sm text-[#1A1A1A]">Ibadah Haji Resmi Tanpa Antrean Puluhan Tahun</h4>
                    <p className="text-xs text-gray-600">
                      Haji Furoda menggunakan <strong>Visa Undangan Resmi Kerajaan Saudi (Mujamalah)</strong> dengan fasilitas Maktab VIP 111 / 112 Mina dan Arafah ber-AC.
                    </p>
                  </div>
                  <span className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold">
                    Kuota Terbatas (50 Seat)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOKUMEN, BIO VISA, NUSUK & PASPOR */}
          {activeTab === 'visa' && (
            <div className="space-y-6">
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#A67C52]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#A67C52] font-bold text-sm">
                  <FileText className="w-5 h-5" />
                  <span>Standar Regulasi Dokumen &amp; Visa Kerajaan Arab Saudi Terkini</span>
                </div>
                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                  Pemerintah Saudi Arabia dan Kementerian Agama RI menerapkan sistem digitalisasi penuh. Tim ALGHANIM memberikan pendampingan teknis 100% untuk semua berkas.
                </p>
              </div>

              {/* Requirement Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Paspor */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#1A1A1A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Masa Berlaku Paspor Minimal 7-8 Bulan</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Paspor Republik Indonesia harus memiliki masa berlaku <strong>minimal 7–8 bulan sebelum tanggal kepulangan</strong>, dengan nama minimal 2–3 kata (contoh: <em>Muhammad Rizki Pratama</em>) serta minimal 4 halaman kosong.
                  </p>
                </div>

                {/* 2. Saudi Visa Bio */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#1A1A1A]">
                    <Smartphone className="w-4 h-4 text-[#A67C52] shrink-0" />
                    <span>Aplikasi "Saudi Visa Bio" (Biometrik)</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Seluruh jamaah wajib melakukan rekam biometrik sidik jari dan pindai retina/wajah melalui aplikasi resmi <strong>Saudi Visa Bio</strong> dari smartphone masing-masing didampingi staf kami.
                  </p>
                </div>

                {/* 3. Nusuk Raudhah */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#1A1A1A]">
                    <QrCode className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Tasreh Masuk Raudhah Asy-Syarifah (Nusuk)</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Izin masuk Raudhah di Masjid Nabawi dijadwalkan secara resmi melalui aplikasi <strong>Nusuk</strong> (Kementerian Haji Saudi) dengan jadwal terpisah antara rombongan pria dan wanita.
                  </p>
                </div>

                {/* 4. Vaksin Meningitis */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#1A1A1A]">
                    <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Vaksinasi Meningitis &amp; Kesehatan</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Sertifikat Vaksin Meningitis (ICV / Buku Kuning) yang diterbitkan oleh Kantor Kesehatan Pelabuhan (KKP) atau klinik mitra terdaftar Kemenkes RI maksimal 14 hari sebelum keberangkatan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIMULATOR KALKULATOR KURS VALAS */}
          {activeTab === 'kalkulator' && (
            <div className="space-y-6">
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#A67C52]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#A67C52] font-bold text-sm">
                  <Calculator className="w-5 h-5" />
                  <span>Kalkulator Estimasi Konversi Kurs SAR &amp; USD ke IDR</span>
                </div>
                <p className="text-xs sm:text-sm text-[#444444]">
                  Gunakan simulator ini untuk menghitung estimasi uang saku, biaya tambahan hotel, atau konversi paket dalam valuta asing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SAR to IDR */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-luxury font-bold text-base text-[#1A1A1A]">Saudi Riyal (SAR) ke Rupiah</h4>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Kurs: Rp {rateSAR.toLocaleString('id-ID')} / SAR
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Jumlah Uang (SAR)
                    </label>
                    <input
                      type="number"
                      value={sarInput}
                      onChange={(e) => setSarInput(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">Estimasi Nilai dalam Rupiah (IDR):</p>
                    <p className="text-xl font-bold font-serif-luxury text-[#A67C52] mt-0.5">
                      Rp {(sarInput * rateSAR).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* USD to IDR */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-luxury font-bold text-base text-[#1A1A1A]">US Dollar (USD) ke Rupiah</h4>
                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                      Kurs: Rp {rateUSD.toLocaleString('id-ID')} / USD
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Jumlah Uang (USD)
                    </label>
                    <input
                      type="number"
                      value={usdInput}
                      onChange={(e) => setUsdInput(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-[#F5F5F5] border border-gray-200 focus:border-[#A67C52] rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] outline-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200">
                    <p className="text-[10px] text-gray-500 font-semibold uppercase">Estimasi Nilai dalam Rupiah (IDR):</p>
                    <p className="text-xl font-bold font-serif-luxury text-sky-800 mt-0.5">
                      Rp {(usdInput * rateUSD).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Call to Action */}
          <div className="p-5 rounded-2xl bg-[#F5F5F5] border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
                Ada Pertanyaan Terkait Regulasi Paspor / Kurs Khusus?
              </p>
              <p className="text-[11px] text-[#666666]">
                Konsultan regulasi &amp; visa ALGHANIM siap membantu pengecekan berkas paspor Anda secara gratis.
              </p>
            </div>

            <a
              href={`${OFFICIAL_WA_LINK}&text=Assalamu%27alaikum%20Admin%20ALGHANIM,%20saya%20ingin%20konsultasi%20mengenai%20persyaratan%20visa,%20paspor,%20dan%20kurs%20paket%20ibadah.`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all whitespace-nowrap cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Konsultasi Regulasi via WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
