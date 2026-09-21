import { useState, useMemo, FormEvent } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Building2, 
  Plane, 
  FileText, 
  MessageCircle,
  Search,
  Send,
  CreditCard,
  GraduationCap
} from 'lucide-react';
import { FAQ_DATA, OFFICIAL_WA_LINK, OFFICIAL_WA_NUMBER } from '../data/packagesData';

interface FAQSectionProps {
  onOpenConsultation?: (title?: string) => void;
}

export const FAQSection = ({ onOpenConsultation }: FAQSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [customSubmitted, setCustomSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: 'Semua Pertanyaan' },
    { id: 'profil', label: 'Profil & Legalitas' },
    { id: 'paket', label: 'Paket & Hotel' },
    { id: 'dokumen', label: 'Syarat & Paspor' },
    { id: 'pembayaran', label: 'DP & Biaya' },
    { id: 'manasik', label: 'Manasik' }
  ];

  // Search Algorithm
  const filteredFAQs = useMemo(() => {
    const rawQuery = searchQuery.toLowerCase().trim();
    if (!rawQuery) {
      if (activeCategory === 'all') return FAQ_DATA;
      return FAQ_DATA.filter(item => item.category === activeCategory);
    }

    const searchTokens = rawQuery.split(/\s+/).filter(t => t.length > 0);

    return FAQ_DATA.filter((item) => {
      const questionText = item.question.toLowerCase();
      const answerText = item.answer.toLowerCase();
      const categoryText = item.category.toLowerCase();
      const fullCorpus = `${questionText} ${answerText} ${categoryText}`;

      const matchesAllTokens = searchTokens.every(token => fullCorpus.includes(token));
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

      return matchesAllTokens && (activeCategory === 'all' || matchesCategory || searchTokens.length > 0);
    });
  }, [activeCategory, searchQuery]);

  const toggleAccordion = (idx: number) => {
    setOpenIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const waMsg = `Halo Admin ALGHANIM, saya ingin menanyakan hal seputar umroh/haji:%0A%0A"${encodeURIComponent(customQuestion)}"`;
    window.open(`https://wa.me/628131670218?text=${waMsg}`, '_blank');
    setCustomSubmitted(true);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'profil': return 'Legalitas';
      case 'paket': return 'Paket & Fasilitas';
      case 'dokumen': return 'Syarat Dokumen';
      case 'pembayaran': return 'DP & Pelunasan';
      case 'manasik': return 'Manasik Ibadah';
      default: return 'Informasi';
    }
  };

  return (
    <section id="faq-section" className="py-10 sm:py-16 md:py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-10 bg-white text-[#1A1A1A] scroll-mt-24 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#A67C52] bg-[#F5F5F5] px-3.5 py-1 rounded-full border border-gray-200 inline-block shadow-sm">
          Pusat Informasi &amp; Panduan
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
          Tanya Jawab (FAQ)
        </h1>
        <p className="text-[#555555] text-xs sm:text-base leading-relaxed">
          Informasi seputar izin resmi Kemenag, pendaftaran DP, dokumen paspor, hingga jadwal manasik ALGHANIM.
        </p>
      </div>

      {/* Clean Responsive Search Box */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Cari pertanyaan (misal: paspor, dp, hotel, manasik, garut)..."
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val.trim().length > 0) {
                setOpenIndices([]);
              }
            }}
            className="w-full bg-[#F9F9F9] border border-gray-200 focus:border-[#A67C52] rounded-2xl px-5 py-3.5 pl-11 pr-10 text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none shadow-sm transition-all"
          />
          <Search className="w-4 h-4 text-[#A67C52] absolute left-4" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setOpenIndices([]);
              }}
              className="absolute right-4 text-xs font-bold text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded-full bg-gray-200 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id && !searchQuery;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery('');
                setOpenIndices([]);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#A67C52] text-white shadow-sm font-bold'
                  : 'bg-[#F5F5F5] text-[#444] hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'bg-white border-[#A67C52] shadow-sm' 
                  : 'bg-[#F9F9F9] border-gray-200 hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-[#A67C52]/10 text-[#A67C52]">
                      {getCategoryLabel(faq.category)}
                    </span>
                  </div>
                  <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-[#1A1A1A] leading-snug">
                    {faq.question}
                  </h3>
                </div>

                <div className={`w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#1A1A1A] flex-shrink-0 transition-transform duration-200 mt-0.5 ${isOpen ? 'rotate-180 bg-[#A67C52] text-white border-[#A67C52]' : ''}`}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 text-xs sm:text-sm text-[#444444] leading-relaxed border-t border-gray-100 pt-3.5 whitespace-pre-line bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredFAQs.length === 0 && (
          <div className="p-8 text-center bg-[#F9F9F9] rounded-2xl border border-gray-200 text-[#444444] space-y-3">
            <HelpCircle className="w-10 h-10 text-[#A67C52] mx-auto opacity-70" />
            <div>
              <h4 className="font-serif-luxury text-base font-bold text-[#1A1A1A]">
                Pertanyaan "{searchQuery}" Belum Ditemukan
              </h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Silakan hubungi konsultan kami di Kantor Garut &amp; Bandung via WhatsApp.
              </p>
            </div>

            <form onSubmit={handleCustomSubmit} className="max-w-md mx-auto space-y-2 pt-1">
              <input
                type="text"
                placeholder="Tulis pertanyaan Anda di sini..."
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#A67C52]"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#A67C52] hover:bg-[#8E653E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tanyakan via WhatsApp</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Clean Consultation Footer */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#2B2B2B] text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#DFC386]">
            Konsultasi Gratis
          </span>
          <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold">
            Punya Pertanyaan Lain Seputar Ibadah Umroh?
          </h3>
          <p className="text-xs text-gray-300">
            Konsultan kami siap membantu di Kantor Cabang Garut (Jl. Sudirman Copong) &amp; Bandung.
          </p>
        </div>

        <button
          onClick={() => onOpenConsultation ? onOpenConsultation('Konsultasi FAQ') : window.open(OFFICIAL_WA_LINK, '_blank')}
          className="px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all flex-shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Hubungi Konsultan</span>
        </button>
      </div>
    </section>
  );
};
