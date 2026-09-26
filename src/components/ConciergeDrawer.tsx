import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Compass, 
  HeartHandshake,
  Phone,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage } from '../types';
import { OFFICIAL_WA_LINK } from '../data/packagesData';
import { addInquiryToFirestore } from '../lib/firestoreService';

interface ConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

export const ConciergeDrawer = ({ isOpen, onClose, onOpenConsultation }: ConciergeDrawerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Assalamu\'alaikum warahmatullah. Selamat datang di Spiritual Concierge resmi ALGHANIM & Mandala 525 Garut.\n\nSaya siap memberikan informasi akurat mengenai pendaftaran Umroh & Haji, biaya paket, syarat paspor, hotel bintang 5, hingga simulasi tabungan syariah. Ada yang bisa saya bantu hari ini?',
      timestamp: 'Baru saja'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [showContactPrompt, setShowContactPrompt] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    { label: '📍 Kantor Mandala Garut', query: 'Di mana lokasi kantor Al-Ghanim Mandala di Garut dan nomor kontaknya?' },
    { label: '📝 Cara & Syarat Daftar', query: 'Bagaimana cara dan syarat mendaftar Umroh di Al-Ghanim?' },
    { label: '🕋 Pilihan Paket & Biaya', query: 'Apa saja paket Umroh yang tersedia dan berapa rincian biayanya?' },
    { label: '💰 Tabungan Umroh Syariah', query: 'Bagaimana sistem Tabungan Umroh Syariah dan berapa setoran awalnya?' },
    { label: '🤲 Program Badal Umroh', query: 'Bagaimana prosedur dan biaya Program Badal Umroh amanah?' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const detectPackageInterest = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('mitra') || lower.includes('agen') || lower.includes('keagenan') || lower.includes('syiar') || lower.includes('kerjasama') || lower.includes('reseller')) {
      return 'Kemitraan & Keagenan Syiar';
    } else if (lower.includes('badal') || lower.includes('almarhum')) {
      return 'Badal Umroh Amanah';
    } else if (lower.includes('tabung') || lower.includes('cicil') || lower.includes('nabung')) {
      return 'Tabungan Umroh Syariah';
    } else if (lower.includes('haji') || lower.includes('furoda') || lower.includes('mujamalah')) {
      return 'Haji Khusus / Furoda';
    } else if (lower.includes('vip') || lower.includes('bintang 5')) {
      return 'Umroh VIP Bintang 5';
    } else if (lower.includes('garut') || lower.includes('copong') || lower.includes('mandala')) {
      return 'Kantor Mandala 525 Garut';
    } else if (lower.includes('bandung')) {
      return 'Kantor Cabang Bandung';
    } else if (lower.includes('jakarta')) {
      return 'Kantor Pusat Jakarta';
    } else if (lower.includes('syarat') || lower.includes('paspor') || lower.includes('visa') || lower.includes('dokumen')) {
      return 'Persyaratan & Dokumen Paspor';
    } else if (lower.includes('harga') || lower.includes('biaya') || lower.includes('paket') || lower.includes('daftar umroh')) {
      return 'Paket Umroh & Pendaftaran';
    }
    return 'Konsultasi Tanya AI';
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // 1. Catat pertanyaan ke database Cloud Firestore (Log Admin "Tanya AI") secara otomatis
    try {
      const phoneMatch = text.match(/(08\d{8,12}|\+62\d{8,12})/);
      const extractedPhone = phoneMatch ? phoneMatch[0] : (userPhone || '-');
      const senderDisplayName = userName.trim() ? userName.trim() : (extractedPhone !== '-' ? `Pengguna (${extractedPhone})` : 'Calon Jamaah (Tanya AI)');
      const detectedCategory = detectPackageInterest(text);

      await addInquiryToFirestore({
        name: senderDisplayName,
        phone: extractedPhone,
        email: '',
        type: 'Tanya AI',
        packageInterest: detectedCategory,
        message: text.trim(),
        status: 'Baru'
      });
    } catch (dbErr) {
      console.warn('Notice: Firestore logging for Tanya AI:', dbErr);
    }

    // 2. Kirim ke API Gemini backend
    try {
      const res = await fetch('/api/concierge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: updatedHistory.map((m) => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botReply = data.reply || 'Mohon maaf, asisten AI sedang menyiapkan jawaban. Silakan hubungi kami via WhatsApp 0813-1670-218.';
        
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (err) {
      console.warn('Direct AI chat fallback:', err);
      // Fallback context-aware response
      let fallbackReply = '';
      const lower = text.toLowerCase();
      
      if (lower.includes('garut') || lower.includes('copong') || lower.includes('mandala')) {
        fallbackReply = `**Kantor Operasional Garut (Mandala Umroh):**\n\n📍 **Alamat:** Jl. Sudirman Copong Garut, Sukamentri, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44116\n📞 **Hotline / WA:** 0813-1670-218 / (0262) 4890731\n⏰ **Jam Buka:** Senin – Sabtu: 09.00 – 17.00 WIB\n🏢 **Layanan:** Customer Service & Tim Operasional Mandala 525\n\n*Anda dipersilakan berkunjung langsung untuk konsultasi tatap muka atau pengecekan paspor.*`;
      } else if (lower.includes('daftar') || lower.includes('cara') || lower.includes('gimana')) {
        fallbackReply = `**Langkah Pendaftaran Umroh di ALGHANIM:**\n\n1. **Pilih Paket:** Tentukan program (Reguler 9/12 hari, VIP, atau Tabungan).\n2. **Setor DP Seat:** Minimal Rp 5 - 10 Juta untuk mengunci nomor porsi penerbangan.\n3. **Serahkan Dokumen:** Paspor asli (min. 7 bulan), copy KTP, KK, pasfoto 4x6 latar putih.\n4. **Manasik Sunnah:** Ikuti bimbingan manasik intensif di Garut / Bandung.\n5. **Pelunasan & Berangkat:** Pelunasan H-30 sebelum keberangkatan.\n\n*Untuk pendaftaran langsung, silakan ke kantor Garut (Copong) atau hubungi WhatsApp resmi di **0813-1670-218**.*`;
      } else if (lower.includes('harga') || lower.includes('biaya') || lower.includes('paket')) {
        fallbackReply = `**Pilihan Paket Ibadah ALGHANIM:**\n\n• **Umroh Reguler (9 Hari):** Mulai Rp 28,9 Jt (Direct Saudia/Garuda, Bintang 4/5 50m ke Haram)\n• **Umroh Jum'atain (12 Hari):** Rp 34,5 Jt (2x Shalat Jum'at di Makkah & Madinah)\n• **Umroh Custom VIP:** Jadwal bebas, mobil GMC Yukon/Alphard, kamar Suite View Ka'bah\n• **Tabungan Umroh:** Setoran awal Rp 5 Jt, cicilan mulai Rp 800rb/bln bebas bunga\n• **Badal Umroh Amanah:** Rp 2,5 Jt / Jiwa (Sertifikat + Video Dokumentasi + Zamzam 5L)`;
      } else {
        fallbackReply = `Terima kasih atas pertanyaannya. Tim konsultan ALGHANIM (Mandala 525 Garut) siap memberikan pelayanan ibadah yang nyaman, amanah, dan terjangkau.\n\nAnda dapat berkonsultasi langsung dengan konsultan kami melalui WhatsApp di **0813-1670-218** atau mengunjungi kantor resmi kami di Garut (Jl. Sudirman Copong), Bandung, atau Jakarta.`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone) return;

    try {
      // Find last user question for context instead of dumping long raw bot markdown
      const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
      const topicContext = lastUserMsg ? lastUserMsg.text : 'Konsultasi Paket & Informasi Umroh';
      const cleanSenderName = userName.trim() || 'Pengunjung Web (Minta Dihubungi)';

      await addInquiryToFirestore({
        name: cleanSenderName,
        phone: userPhone.trim(),
        email: '',
        type: 'Tanya AI',
        packageInterest: detectPackageInterest(topicContext),
        message: `Permintaan follow up langsung via AI Concierge. Pertanyaan: "${topicContext}".`,
        status: 'Baru'
      });
      setContactSaved(true);
      setShowContactPrompt(false);
    } catch (err) {
      console.warn('Error saving contact prompt:', err);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: 'Assalamu\'alaikum warahmatullah. Percakapan telah direset. Silakan tanyakan hal baru seputar paket umroh, biaya, syarat paspor, manasik, atau lokasi kantor ALGHANIM Garut & Bandung.',
        timestamp: 'Baru saja'
      }
    ]);
    setContactSaved(false);
    setShowContactPrompt(false);
    setUserName('');
    setUserPhone('');
    setInputText('');
  };

  const handleResetContactOnly = () => {
    setContactSaved(false);
    setShowContactPrompt(true);
    setUserName('');
    setUserPhone('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-gray-200 shadow-2xl flex flex-col text-[#1A1A1A] animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F8F7F5]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#A67C52] text-white shadow-sm flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">Spiritual Concierge</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Online</span>
            </div>
            <p className="text-[11px] text-[#666666]">AI Konsultasi ALGHANIM &amp; Mandala 525 Garut</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            title="Reset Chat &amp; Kontak Ulang"
            className="p-2 rounded-full hover:bg-gray-200 text-[#666666] hover:text-[#1A1A1A] transition-colors cursor-pointer flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-[#666666] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Optional Contact Banner */}
      {!contactSaved && (
        <div className="bg-[#A67C52]/10 border-b border-[#A67C52]/20 px-4 py-2.5 flex items-center justify-between text-xs transition-all">
          <span className="text-[#A67C52] font-semibold text-[11px]">
            {showContactPrompt ? 'Masukkan nomor WhatsApp agar staf kami dapat menghubungi:' : 'Ingin dihubungi langsung oleh konsultan Garut?'}
          </span>
          <button
            onClick={() => setShowContactPrompt(!showContactPrompt)}
            className="text-[11px] font-bold text-[#A67C52] hover:underline cursor-pointer ml-2 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-md border border-[#A67C52]/30"
          >
            {showContactPrompt ? 'Tutup Form' : 'Isi No. WA'}
          </button>
        </div>
      )}

      {showContactPrompt && !contactSaved && (
        <form onSubmit={handleSaveContact} className="p-3.5 bg-[#FAF8F5] border-b border-gray-200 space-y-2.5 text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nama Anda (Opsional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-[#1A1A1A] outline-none text-xs focus:border-[#A67C52]"
            />
            <input
              type="tel"
              required
              placeholder="Nomor WhatsApp *"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-[#1A1A1A] outline-none text-xs focus:border-[#A67C52]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Simpan Kontak &amp; Minta Dihubungi
            </button>
            <button
              type="button"
              onClick={() => setShowContactPrompt(false)}
              className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {contactSaved && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-[11px]">Kontak tersimpan di sistem admin.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetContactOnly}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer whitespace-nowrap"
              title="Kirim nomor lain atau perbarui nomor kontak"
            >
              Ganti Kontak
            </button>
            <button
              onClick={() => setContactSaved(false)}
              className="text-emerald-500 hover:text-emerald-700 p-0.5 cursor-pointer"
              title="Tutup banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F7F5]/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#A67C52] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                <Compass className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#A67C52] text-white font-medium rounded-tr-none shadow-sm'
                  : 'bg-white text-[#1A1A1A] border border-gray-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line space-y-1">
                {msg.text.split('\n').map((line, lIdx) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={lIdx} className="font-bold text-[#A67C52] mt-1.5 first:mt-0">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  if (line.includes('**')) {
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={lIdx}>
                        {parts.map((p, pIdx) => {
                          if (p.startsWith('**') && p.endsWith('**')) {
                            return <strong key={pIdx} className="font-bold text-[#1A1A1A]">{p.replace(/\*\*/g, '')}</strong>;
                          }
                          return p;
                        })}
                      </p>
                    );
                  }
                  return <p key={lIdx}>{line}</p>;
                })}
              </div>

              <span
                className={`text-[10px] block mt-1.5 ${
                  msg.sender === 'user' ? 'text-white/80 text-right' : 'text-[#888888]'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center flex-shrink-0 mt-1 font-bold text-xs shadow-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 justify-start items-center text-[#666666] text-xs pl-9">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-gray-500 ml-1">AI sedang menganalisis data Al-Ghanim...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Buttons */}
      <div className="p-3 bg-white border-t border-gray-200">
        <p className="text-[10px] uppercase font-bold text-[#666666] tracking-wider mb-2 px-1 flex items-center justify-between">
          <span>Pertanyaan Cepat:</span>
          <span className="text-[#A67C52]">Klik untuk bertanya</span>
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {starterPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              disabled={isTyping}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-[#F8F7F5] border border-gray-200 hover:border-[#A67C52] hover:bg-[#A67C52] hover:text-white text-[#444444] transition-all cursor-pointer whitespace-nowrap text-left"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-gray-200 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder="Tulis pertanyaan seputar Umroh, kantor Garut, harga..."
            className="flex-1 px-4 py-2.5 rounded-full bg-[#F8F7F5] border border-gray-200 text-[#1A1A1A] text-xs focus:border-[#A67C52] focus:outline-none placeholder-[#888888]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-full bg-[#A67C52] text-white hover:bg-[#8E653E] disabled:opacity-40 transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between pt-1">
          <a
            href={OFFICIAL_WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-[#25D366] hover:underline flex items-center gap-1 font-bold"
          >
            <Phone className="w-3 h-3" />
            WhatsApp: 0813-1670-218
          </a>

          {onOpenConsultation && (
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="text-[11px] text-[#A67C52] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <HeartHandshake className="w-3 h-3" />
              Form Konsultasi Privat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
