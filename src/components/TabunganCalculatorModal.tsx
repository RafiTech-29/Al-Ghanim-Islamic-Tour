import { useState, FormEvent } from 'react';
import { 
  X, 
  PiggyBank, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  CreditCard
} from 'lucide-react';

interface TabunganCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (data: any) => void;
}

export const TabunganCalculatorModal = ({ isOpen, onClose, onRegistered }: TabunganCalculatorModalProps) => {
  const [packageGoal, setPackageGoal] = useState<'reguler4' | 'reguler5' | 'vip'>('reguler4');
  const [initialDeposit, setInitialDeposit] = useState(5_000_000);
  const [targetMonths, setTargetMonths] = useState(18);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bankPreference, setBankPreference] = useState('Bank Syariah Indonesia (BSI)');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetAndClose = () => {
    setName('');
    setPhone('');
    setInitialDeposit(5_000_000);
    setTargetMonths(18);
    setPackageGoal('reguler4');
    setBankPreference('Bank Syariah Indonesia (BSI)');
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  const packagePrices = {
    reguler4: { name: 'Umroh Reguler Bintang 4', price: 28_500_000 },
    reguler5: { name: 'Umroh Eksekutif Bintang 5', price: 33_000_000 },
    vip: { name: 'Umroh VIP Custom Bespoke', price: 46_000_000 },
  };

  const selectedTargetPrice = packagePrices[packageGoal].price;
  const remainingAmount = Math.max(0, selectedTargetPrice - initialDeposit);
  const monthlyDeposit = Math.ceil(remainingAmount / targetMonths);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (onRegistered) {
      onRegistered({
        name,
        phone,
        bankPreference,
        packageGoal: packagePrices[packageGoal].name,
        initialDeposit,
        targetMonths,
        monthlyDeposit
      });
    }
    const msg = `Halo Admin Tabungan Syariah ALGHANIM, saya ingin membuka Program Tabungan Umroh:%0ANama: ${encodeURIComponent(name)}%0ANo. WhatsApp: ${encodeURIComponent(phone)}%0APilihan Paket: ${packagePrices[packageGoal].name}%0ASetoran Awal: Rp ${(initialDeposit).toLocaleString('id-ID')}%0ATarget Durasi: ${targetMonths} Bulan%0AEstimasi Setoran/Bulan: Rp ${(monthlyDeposit).toLocaleString('id-ID')}%0AMitra Bank: ${encodeURIComponent(bankPreference)}`;
    window.open(`https://wa.me/628131670218?text=${msg}`, '_blank');
    setIsSuccess(true);
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-8 text-[#1A1A1A] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-gray-200 text-[#A67C52] shadow-sm">
              <PiggyBank className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-[#A67C52] border border-gray-200 font-semibold uppercase tracking-wider shadow-sm">
                Simulasi Tabungan Syariah
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-0.5">
                Kalkulator Tabungan Umroh
              </h2>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-6 flex-1 flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="max-w-md">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A] mb-2">Pendaftaran Rekening Tabungan Berhasil</h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                Alhamdulillah! Rekening Virtual Tabungan Umroh Syariah atas nama <span className="text-[#1A1A1A] font-semibold">{name}</span> telah dibuat. Nomor VA dan panduan autodebet telah dikirimkan ke WhatsApp <span className="text-[#A67C52] font-semibold">{phone}</span>.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-xs text-left w-full max-w-md space-y-2">
              <div className="flex justify-between">
                <span className="text-[#666666]">Program Target:</span>
                <span className="text-[#1A1A1A] font-semibold">{packagePrices[packageGoal].name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Setoran Awal:</span>
                <span className="text-[#1A1A1A] font-semibold">{formatIDR(initialDeposit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Cicilan Per Bulan:</span>
                <span className="font-serif-luxury text-[#A67C52] font-bold text-sm">{formatIDR(monthlyDeposit)} / bulan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Target Berangkat:</span>
                <span className="text-emerald-700 font-semibold">{targetMonths} Bulan ke Depan</span>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="bg-[#A67C52] hover:bg-[#8E653E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md transition-all"
            >
              Selesai &amp; Kembali
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="overflow-y-auto flex-1 p-6 space-y-6 bg-white">
            {/* Step 1: Target Package */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider block">
                1. Pilih Target Paket Umroh
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'reguler4', title: 'Reguler Bintang 4', price: 'Rp 28.5 Jt', desc: '9 Hari Direct Garuda/Saudia' },
                  { id: 'reguler5', title: 'Eksekutif Bintang 5', price: 'Rp 33.0 Jt', desc: '12 Hari Clock Tower Suites' },
                  { id: 'vip', title: 'VIP Bespoke Suite', price: 'Rp 46.0 Jt', desc: 'Private Ground & Front Row' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setPackageGoal(item.id as any)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      packageGoal === item.id
                        ? 'bg-[#F5F5F5] border-2 border-[#A67C52] text-[#1A1A1A] shadow-md'
                        : 'bg-white border-gray-200 text-[#666666] hover:border-[#A67C52]'
                    }`}
                  >
                    <p className="font-bold text-[#1A1A1A] text-sm">{item.title}</p>
                    <p className="font-serif-luxury text-base font-semibold text-[#A67C52] mt-1">{item.price}</p>
                    <p className="text-[11px] text-[#666666] mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Deposit & Duration Sliders */}
            <div className="p-5 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-[#1A1A1A] font-semibold uppercase tracking-wider">
                    Setoran Awal (Booking Seat Tabungan)
                  </label>
                  <span className="font-serif-luxury text-lg font-bold text-[#A67C52]">
                    {formatIDR(initialDeposit)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5_000_000}
                  max={20_000_000}
                  step={1_000_000}
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(Number(e.target.value))}
                  className="w-full accent-[#A67C52] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#666666] mt-1">
                  <span>Min. Rp 5 Juta</span>
                  <span>Rp 10 Juta</span>
                  <span>Rp 20 Juta</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-[#1A1A1A] font-semibold uppercase tracking-wider">
                    Rencana Jangka Waktu Menabung
                  </label>
                  <span className="font-serif-luxury text-lg font-bold text-[#A67C52] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#A67C52]" />
                    {targetMonths} Bulan ({Math.floor(targetMonths / 12) > 0 ? `${Math.floor(targetMonths / 12)} Thn ` : ''}{targetMonths % 12 > 0 ? `${targetMonths % 12} Bln` : ''})
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[6, 12, 18, 24, 36].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setTargetMonths(m)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        targetMonths === m
                          ? 'bg-[#A67C52] text-white border-[#A67C52]'
                          : 'bg-white text-[#555555] border-gray-200 hover:border-[#A67C52]'
                      }`}
                    >
                      {m} Bulan
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Calculation Output Card */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <p className="text-xs text-[#666666]">Estimasi Menabung Setiap Bulan:</p>
                  <p className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#A67C52]">
                    {formatIDR(monthlyDeposit)} <span className="text-xs font-sans-luxury text-[#666666]">/ bulan</span>
                  </p>
                </div>
                <div className="text-right sm:text-right text-xs text-[#666666] space-y-0.5">
                  <p>Total Nilai Paket: <span className="text-[#1A1A1A] font-medium">{formatIDR(selectedTargetPrice)}</span></p>
                  <p>Sisa Dana Diangsur: <span className="text-[#1A1A1A] font-medium">{formatIDR(remainingAmount)}</span></p>
                </div>
              </div>
            </div>

            {/* Step 3: Sharia Principles Assurance */}
            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-gray-200 flex items-start gap-3 text-xs text-[#444444]">
              <ShieldCheck className="w-5 h-5 text-[#A67C52] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1A1A]">Akad Wadiah Yad Dhamanah &amp; Wakalah bil Ujrah</p>
                <p className="text-[#666666] mt-0.5 leading-relaxed">
                  Dana tabungan Anda disimpan aman dalam rekening terpisah (escrow account) atas nama jamaah di bank syariah rekanan resmi yang diawasi OJK &amp; DSN-MUI. Bebas riba, tanpa denda keterlambatan, dan dapat dialihkan ke ahli waris.
                </p>
              </div>
            </div>

            {/* Step 4: Account Registration Form */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider block">
                2. Data Pembukaan Akun Tabungan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#555555] block mb-1">Nama Lengkap Sesuai KTP *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Hj. Siti Nurjanah"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#F5F5F5] border border-gray-200 text-[#1A1A1A] text-xs focus:border-[#A67C52] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#555555] block mb-1">Nomor WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2.5 rounded-lg bg-[#F5F5F5] border border-gray-200 text-[#1A1A1A] text-xs focus:border-[#A67C52] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#555555] block mb-1">Pilihan Bank Syariah Rekanan</label>
                <select
                  value={bankPreference}
                  onChange={(e) => setBankPreference(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#F5F5F5] border border-gray-200 text-[#1A1A1A] text-xs focus:border-[#A67C52] focus:outline-none"
                >
                  <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI) - Tabungan Mabrur</option>
                  <option value="Bank Muamalat Indonesia">Bank Muamalat - Tabungan Hijrah Umroh</option>
                  <option value="BCA Syariah">BCA Syariah - Tabungan Rencana Umroh</option>
                  <option value="Bank Mega Syariah">Bank Mega Syariah - Tabungan Haji &amp; Umroh</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-[#555555] hover:text-[#1A1A1A] border border-gray-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-[#A67C52] hover:bg-[#8E653E] text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Buka Tabungan Umroh
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
