import { Plane, Building2, Shield, HeartHandshake, Award, BookOpen, Compass, Users } from 'lucide-react';

interface ServicesSectionProps {
  onOpenConsultation: () => void;
  onOpenCustomQuote: () => void;
  onOpenTabungan: () => void;
}

export const ServicesSection = ({
  onOpenConsultation,
  onOpenCustomQuote,
  onOpenTabungan
}: ServicesSectionProps) => {
  const services = [
    {
      icon: Compass,
      title: 'Bimbingan Manasik Sunnah',
      desc: 'Bimbingan intensif manasik teori & praktik sebelum keberangkatan, dipandu asatidz lulusan Madinah & Timur Tengah sesuai sunnah Rasulullah SAW.'
    },
    {
      icon: Award,
      title: 'Bespoke Private Umroh (VIP)',
      desc: 'Pengaturan perjalanan ibadah privat untuk keluarga besar dan korporat dengan jadwal bebas, hotel front-row Ka\'bah, dan kendaraan VIP.'
    },
    {
      icon: Building2,
      title: 'Reservasi Hotel Front Row',
      desc: 'Jaminan kamar hotel bintang 5 terbaik di kompleks Clock Tower Makkah dan pelataran Nabawi dengan akses lift langsung tanpa perlu transportasi jauh.'
    },
    {
      icon: Plane,
      title: 'Tiket Penerbangan Direct',
      desc: 'Kerjasama resmi dengan maskapai terbaik Garuda Indonesia dan Saudia Airlines tanpa transit, memastikan jamaah tidak lelah di perjalanan.'
    },
    {
      icon: Shield,
      title: 'Perlindungan & Asuransi Syariah',
      desc: 'Proteksi menyeluruh meliputi asuransi kesehatan internasional, pendampingan medis 24 jam, dan penanganan darurat di Tanah Suci.'
    },
    {
      icon: HeartHandshake,
      title: 'Program Tabungan Rencana Umroh',
      desc: 'Solusi kemudahan beribadah dengan menabung terencana menggunakan akad syariah terpercaya di bank syariah nasional terkemuka.'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8e9192]">
          Layanan Komprehensif
        </span>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#dcdcdc] mt-2 mb-4">
          Dedikasi Penuh untuk Kenyamanan Ibadah Anda
        </h2>
        <p className="text-[#c4c7c7] text-sm sm:text-base leading-relaxed">
          Setiap aspek perjalanan ibadah dirancang dengan standar kualitas tertinggi, transparansi biaya, dan bimbingan penuh kasih sayang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-8 rounded-xl border border-[#444748] hover:border-[#8e9192] transition-all duration-300 silver-glow flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#201f1f] border border-[#8e9192]/30 flex items-center justify-center text-[#dcdcdc] mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-white mb-3">
                  {srv.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#c4c7c7] leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#444748] flex flex-col md:flex-row items-center justify-between gap-6 silver-glow">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-white">Butuh Konsultasi Paket Ibadah Khusus?</h3>
          <p className="text-sm text-[#8e9192] mt-1">Konsultan kami siap membantu merencanakan perjalanan keluarga Anda.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenCustomQuote}
            className="btn-outline-silver px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#dcdcdc] cursor-pointer"
          >
            Custom VIP
          </button>
          <button
            onClick={onOpenConsultation}
            className="bg-[#dcdcdc] text-[#131313] hover:bg-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors shadow-md"
          >
            Hubungi Konsultan
          </button>
        </div>
      </div>
    </section>
  );
};
