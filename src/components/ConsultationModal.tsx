import { useState, FormEvent } from 'react';
import { 
  X, 
  PhoneCall, 
  CheckCircle2, 
  Send,
  Phone
} from 'lucide-react';
import { addInquiryToFirestore } from '../lib/firestoreService';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage?: string;
  initialTopic?: string;
}

export const ConsultationModal = ({ isOpen, onClose, defaultPackage, initialTopic }: ConsultationModalProps) => {
  const currentTopic = initialTopic || defaultPackage || 'Konsultasi Layanan Umroh & Haji';
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refCode, setRefCode] = useState('');

  const handleResetAndClose = () => {
    setName('');
    setPhone('');
    setNotes('');
    setIsSubmitted(false);
    setIsSubmitting(false);
    setRefCode('');
    onClose();
  };

  if (!isOpen) return null;

  const handleSendWA = () => {
    const msg = `Halo Tim Konsultan Al-Ghanim, saya ingin berkonsultasi seputar umroh/haji:
*No. Registrasi:* ${refCode || 'REG-KONSULTASI'}
*Nama Calon Jamaah:* ${name}
*No. WhatsApp:* ${phone}
*Topik / Minat:* ${currentTopic}${notes ? `\n*Pertanyaan / Catatan:* ${notes}` : ''}

Mohon informasi dan panduannya. Terima kasih.`;

    window.open(`https://wa.me/628131670218?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const code = `REF/AG-${Date.now().toString().slice(-6)}/${new Date().getFullYear()}`;
    setRefCode(code);

    try {
      await addInquiryToFirestore({
        name: name.trim(),
        phone: phone.trim(),
        type: 'Konsultasi Layanan',
        packageInterest: currentTopic,
        message: `[${code}]\nPesan: ${notes.trim() ? notes.trim() : 'Permohonan konsultasi cepat via website.'}`,
        status: 'Baru'
      });
    } catch (err) {
      console.warn('Could not save to firestore:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden text-[#1A1A1A] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F8F6F2]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#A67C52] text-white">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#A67C52]/15 text-[#8E653E] font-bold uppercase tracking-wider">
                Konsultasi Cepat
              </span>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-0.5">
                Konsultasi Umroh &amp; Haji
              </h2>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full hover:bg-gray-200 text-[#666666] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 flex flex-col items-center justify-center bg-white animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="max-w-sm space-y-1">
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#A67C52]/15 text-[#A67C52] font-bold uppercase tracking-wider">
                No. Registrasi: {refCode}
              </span>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A] pt-2">Pendaftaran Terkirim</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Jazakallahu khairan, <span className="text-[#1A1A1A] font-semibold">{name}</span>. Konsultan Al-Ghanim siap membantu Anda. Klik tombol hijau di bawah untuk langsung terhubung via WhatsApp.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-gray-200 text-xs text-left w-full max-w-sm space-y-1">
              <p><span className="text-gray-500">Nama:</span> <span className="text-gray-900 font-semibold">{name}</span></p>
              <p><span className="text-gray-500">WhatsApp:</span> <span className="text-[#A67C52] font-semibold">{phone}</span></p>
              <p><span className="text-gray-500">Topik:</span> <span className="text-gray-800">{currentTopic}</span></p>
            </div>

            {/* Action Button: WhatsApp */}
            <div className="w-full max-w-sm pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSendWA}
                className="w-full py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Lanjutkan Chat WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Selesai &amp; Tutup
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
            <p className="text-xs text-gray-600 leading-relaxed">
              Cukup masukkan nama dan nomor WhatsApp Anda. Konsultan resmi Al-Ghanim akan segera menghubungi dan memberikan penjelasan lengkap.
            </p>

            <div className="space-y-3.5">
              {/* Kolom 1: Nama Lengkap */}
              <div>
                <label className="text-xs text-gray-700 block mb-1 font-semibold">
                  Nama Lengkap Calon Jamaah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: H. Suparman / Ibu Aminah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8F6F2] border border-gray-200 focus:border-[#A67C52] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all"
                />
              </div>

              {/* Kolom 2: Nomor WhatsApp */}
              <div>
                <label className="text-xs text-gray-700 block mb-1 font-semibold">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8F6F2] border border-gray-200 focus:border-[#A67C52] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-all"
                />
              </div>

              {/* Pertanyaan / Catatan Singkat (Opsional) */}
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">
                  Pertanyaan Singkat (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Ingin tanya paket promo Ramadhan atau jadwal keberangkatan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#F8F6F2] border border-gray-200 focus:border-[#A67C52] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#A67C52] hover:bg-[#8E653E] py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim Data...' : 'Mulai Konsultasi'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
