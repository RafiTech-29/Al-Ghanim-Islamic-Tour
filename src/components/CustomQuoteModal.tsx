import { useState, FormEvent } from 'react';
import { 
  X, 
  Sliders, 
  Users, 
  Building2, 
  Car, 
  Send,
  Check,
  CheckCircle2
} from 'lucide-react';

interface CustomQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuote?: (data: any) => void;
}

export const CustomQuoteModal = ({ isOpen, onClose, onSubmitQuote }: CustomQuoteModalProps) => {
  const [pilgrims, setPilgrims] = useState(2);
  const [durationDays, setDurationDays] = useState(12);
  const [hotelTier, setHotelTier] = useState<'raffles' | 'fairmont' | 'dar_altawhid'>('raffles');
  const [flightTier, setFlightTier] = useState<'business' | 'first' | 'economy_plus'>('business');
  const [carType, setCarType] = useState<'gmc' | 'alphard' | 'sprinter'>('gmc');
  const [includeLounge, setIncludeLounge] = useState(true);
  const [includeBulletTrain, setIncludeBulletTrain] = useState(true);
  const [includeTaifTour, setIncludeTaifTour] = useState(true);
  const [mutawwifLang, setMutawwifLang] = useState('Bahasa Indonesia & Sunda');
  
  // Contact details
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetAndClose = () => {
    setName('');
    setWhatsapp('');
    setEmail('');
    setSpecialNotes('');
    setPilgrims(2);
    setDurationDays(12);
    setHotelTier('raffles');
    setFlightTier('business');
    setCarType('gmc');
    setIncludeLounge(true);
    setIncludeBulletTrain(true);
    setIncludeTaifTour(true);
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  // Calculation heuristic for approximate estimate
  const baseCostPerPerson = 35_000_000;
  const hotelMultiplier = hotelTier === 'raffles' ? 22_000_000 : hotelTier === 'dar_altawhid' ? 18_000_000 : 14_000_000;
  const flightCost = flightTier === 'first' ? 42_000_000 : flightTier === 'business' ? 24_000_000 : 8_000_000;
  const carPerGroup = carType === 'gmc' ? 18_000_000 : carType === 'sprinter' ? 22_000_000 : 16_000_000;
  const addOnsPerPerson = (includeLounge ? 3_500_000 : 0) + (includeBulletTrain ? 2_800_000 : 0) + (includeTaifTour ? 2_000_000 : 0);

  const estimatedTotalPerPerson = baseCostPerPerson + (durationDays * 1_200_000) + hotelMultiplier + flightCost + addOnsPerPerson + (carPerGroup / Math.max(1, pilgrims));
  const estimatedGrandTotal = estimatedTotalPerPerson * pilgrims;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) return;

    const quoteSummary = {
      pilgrims,
      durationDays,
      hotelTier,
      flightTier,
      carType,
      includeLounge,
      includeBulletTrain,
      includeTaifTour,
      mutawwifLang,
      estimatedPerPerson: estimatedTotalPerPerson,
      estimatedTotal: estimatedGrandTotal,
      name,
      whatsapp,
      email,
      specialNotes
    };

    if (onSubmitQuote) {
      onSubmitQuote(quoteSummary);
    }
    const msg = `Halo Admin VIP Al-Ghanim, saya merancang paket Umroh Custom (Private/Bespoke):%0ANama: ${encodeURIComponent(name)}%0ANo. WhatsApp: ${encodeURIComponent(whatsapp)}%0AJumlah Jamaah: ${pilgrims} Orang%0ADurasi: ${durationDays} Hari%0AHotel: ${hotelTier}%0APenerbangan: ${flightTier}%0ATransportasi: ${carType}%0AEstimasi Total: Rp ${(estimatedGrandTotal / 1_000_000).toFixed(1)} Juta%0ACatatan: ${encodeURIComponent(specialNotes || '-')}`;
    window.open(`https://wa.me/628131670218?text=${msg}`, '_blank');
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-8 text-[#1A1A1A] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#A67C52] text-white">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#A67C52] text-white uppercase tracking-wider">
                  Bespoke VIP Customizer
                </span>
                <span className="text-xs text-[#666666]">Privasi &amp; Fleksibilitas Total</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-0.5">
                Rancang Perjalanan Umroh Custom
              </h2>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full hover:bg-gray-200 text-[#666666] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-6 flex-1 flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="max-w-md">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A] mb-2">Permintaan Penawaran Terkirim</h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                Jazakallahu khairan, <span className="text-[#1A1A1A] font-semibold">{name}</span>. Tim Kurator VIP ALGHANIM akan menghubungi Anda melalui WhatsApp <span className="text-[#A67C52] font-semibold">{whatsapp}</span> dalam kurun waktu maks. 1 jam kerja untuk menyusun proposal formal.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F5F5] border border-gray-200 text-xs text-left w-full max-w-md space-y-1.5">
              <p><span className="text-[#666666]">Estimasi Jamaah:</span> <span className="text-[#1A1A1A] font-semibold">{pilgrims} Orang ({durationDays} Hari)</span></p>
              <p><span className="text-[#666666]">Estimasi Total Anggaran:</span> <span className="font-serif-luxury text-[#A67C52] font-bold">Rp {(estimatedGrandTotal / 1_000_000).toFixed(1)} Juta</span></p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="bg-[#A67C52] hover:bg-[#8E653E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md transition-all"
            >
              Selesai &amp; Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6 bg-white">
            {/* Step 1: Pilgrims & Duration */}
            <div className="p-5 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-4">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#A67C52]" />
                1. Jumlah Jamaah &amp; Durasi Waktu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#666666] block mb-1.5 font-medium">
                    Jumlah Anggota Keluarga / Jamaah ({pilgrims} Orang)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={pilgrims}
                      onChange={(e) => setPilgrims(Number(e.target.value))}
                      className="w-full accent-[#A67C52] cursor-pointer"
                    />
                    <span className="font-serif-luxury text-lg font-bold text-[#1A1A1A] min-w-[3rem] text-right">
                      {pilgrims} org
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#666666] block mb-1.5 font-medium">
                    Pilihan Durasi Hari ({durationDays} Hari)
                  </label>
                  <div className="flex items-center gap-2">
                    {[9, 12, 14, 16, 21].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setDurationDays(d)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                          durationDays === d
                            ? 'bg-[#A67C52] text-white'
                            : 'bg-white text-[#555555] border border-gray-200 hover:border-[#A67C52]'
                        }`}
                      >
                        {d}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Hotel & Flight */}
            <div className="p-5 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-4">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#A67C52]" />
                2. Pilihan Hotel Bintang 5 &amp; Penerbangan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#666666] block mb-1.5 font-medium">Hotel Makkah (Front Row Ka'bah)</label>
                  <div className="space-y-2">
                    {[
                      { id: 'raffles', name: 'Raffles Makkah Palace / Dar Al Ghufran (Kaaba View Suite)', tag: 'Ultra Luxury' },
                      { id: 'fairmont', name: 'Fairmont Makkah Clock Royal Tower (Signature Room)', tag: 'Favorite' },
                      { id: 'dar_altawhid', name: 'Dar Al Tawhid InterContinental Makkah (Plaza Level)', tag: 'Exclusive' },
                    ].map((h) => (
                      <button
                        type="button"
                        key={h.id}
                        onClick={() => setHotelTier(h.id as any)}
                        className={`w-full p-3 rounded-lg text-left text-xs border transition-all cursor-pointer flex items-center justify-between ${
                          hotelTier === h.id
                            ? 'bg-white border-2 border-[#A67C52] text-[#1A1A1A] shadow-sm'
                            : 'bg-white border-gray-200 text-[#555555] hover:border-[#A67C52]'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{h.name}</p>
                          <span className="text-[10px] text-[#666666]">Bintang 5 Diamond • Akses Pelataran &lt;1 Menit</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#F5F5F5] text-[#A67C52] font-semibold">{h.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#666666] block mb-1.5 font-medium">Kelas Tiket Pesawat</label>
                  <div className="space-y-2">
                    {[
                      { id: 'business', name: 'Business Class Direct (Saudia / Garuda)', desc: 'Lie-flat bed, VIP Lounge CGK & JED' },
                      { id: 'first', name: 'First Class / Private Suite', desc: 'Layanan VIP Chauffeur & Private Chef' },
                      { id: 'economy_plus', name: 'Premium Economy Direct', desc: 'Ekstra ruang kaki & Prioritas check-in' },
                    ].map((f) => (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => setFlightTier(f.id as any)}
                        className={`w-full p-3 rounded-lg text-left text-xs border transition-all cursor-pointer flex items-center justify-between ${
                          flightTier === f.id
                            ? 'bg-white border-2 border-[#A67C52] text-[#1A1A1A] shadow-sm'
                            : 'bg-white border-gray-200 text-[#555555] hover:border-[#A67C52]'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{f.name}</p>
                          <span className="text-[10px] text-[#666666]">{f.desc}</span>
                        </div>
                        {flightTier === f.id && <Check className="w-4 h-4 text-[#A67C52]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: VIP Ground Transport & Mutawwif */}
            <div className="p-5 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-4">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <Car className="w-5 h-5 text-[#A67C52]" />
                3. Kendaraan VIP &amp; Layanan Tambahan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'gmc', title: 'GMC Yukon XL VIP', desc: 'Kapasitas 1-4 Pax eksklusif' },
                  { id: 'alphard', title: 'Toyota Alphard VIP', desc: 'Kenyamanan suspensi mewah' },
                  { id: 'sprinter', title: 'Mercedes Sprinter VIP', desc: 'Kapasitas 5-10 Pax + Luggage' },
                ].map((car) => (
                  <button
                    type="button"
                    key={car.id}
                    onClick={() => setCarType(car.id as any)}
                    className={`p-3 rounded-lg text-left text-xs border transition-all cursor-pointer ${
                      carType === car.id
                        ? 'bg-white border-2 border-[#A67C52] text-[#1A1A1A] shadow-sm'
                        : 'bg-white border-gray-200 text-[#555555] hover:border-[#A67C52]'
                    }`}
                  >
                    <p className="font-bold text-[#1A1A1A]">{car.title}</p>
                    <p className="text-[11px] text-[#666666] mt-0.5">{car.desc}</p>
                  </button>
                ))}
              </div>

              {/* VIP Checkboxes */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-xs text-[#555555] cursor-pointer bg-white p-2.5 rounded-lg border border-gray-200 hover:border-[#A67C52]">
                  <input
                    type="checkbox"
                    checked={includeLounge}
                    onChange={(e) => setIncludeLounge(e.target.checked)}
                    className="accent-[#A67C52]"
                  />
                  <span>Executive CIP Lounge Bandara</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#555555] cursor-pointer bg-white p-2.5 rounded-lg border border-gray-200 hover:border-[#A67C52]">
                  <input
                    type="checkbox"
                    checked={includeBulletTrain}
                    onChange={(e) => setIncludeBulletTrain(e.target.checked)}
                    className="accent-[#A67C52]"
                  />
                  <span>Haramain Speed Train VIP</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#555555] cursor-pointer bg-white p-2.5 rounded-lg border border-gray-200 hover:border-[#A67C52]">
                  <input
                    type="checkbox"
                    checked={includeTaifTour}
                    onChange={(e) => setIncludeTaifTour(e.target.checked)}
                    className="accent-[#A67C52]"
                  />
                  <span>Private Taif / Cable Car Tour</span>
                </label>
              </div>
            </div>

            {/* Step 4: Contact & Calculation Preview */}
            <div className="p-5 rounded-xl bg-[#F5F5F5] border border-gray-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
                <div>
                  <span className="text-xs text-[#666666]">Estimasi Anggaran VIP:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#A67C52]">
                      Rp {(estimatedTotalPerPerson / 1_000_000).toFixed(1)} Jt
                    </span>
                    <span className="text-xs text-[#666666]">/ orang (Total {pilgrims} Pax: ~Rp {(estimatedGrandTotal / 1_000_000).toFixed(1)} Jt)</span>
                  </div>
                </div>
                <span className="text-[11px] px-3 py-1 rounded bg-white text-[#A67C52] border border-gray-200 font-semibold">
                  *Harga pasti disesuaikan tanggal riil
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#666666] block mb-1">Nama Lengkap Pemesan *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: H. Bambang Subagyo"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] text-xs focus:border-[#A67C52] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#666666] block mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] text-xs focus:border-[#A67C52] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#666666] block mb-1">Alamat Email (Opsional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="bambang@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] text-xs focus:border-[#A67C52] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#666666] block mb-1">Catatan Khusus / Rencana Tanggal Keberangkatan</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Contoh: Keberangkatan liburan akhir tahun, butuh kursi roda untuk ibunda, menu makanan khusus."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-[#1A1A1A] text-xs focus:border-[#A67C52] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
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
                  <Send className="w-4 h-4" />
                  Kirim Permintaan Proposal VIP
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
