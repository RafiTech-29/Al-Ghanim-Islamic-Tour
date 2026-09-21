import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Award, 
  Instagram, 
  Facebook, 
  Send as TelegramIcon,
  Navigation,
  ArrowUp,
  X,
  CheckCircle2,
  ExternalLink,
  Lock,
  FileText
} from 'lucide-react';
import { AlGhanimLogo } from './AlGhanimLogo';
import { NavTabType } from './Navbar';
import jabalUhudRealImg from '../assets/images/jabal_uhud_real_1789544121355.jpg';
import thawafKaabaRealImg from '../assets/images/thawaf_kaaba_real_1789579638381.jpg';
import kajianNabawiRealImg from '../assets/images/jamaah_kajian_nabawi_real_1789632646013.jpg';
import keluargaIhramRealImg from '../assets/images/keluarga_ihram_real_1789579677801.jpg';
import bandaraDepatureRealImg from '../assets/images/bandara_depature_real_1789579694803.jpg';

interface FooterProps {
  onNavClick: (tab: NavTabType) => void;
  onOpenLegal?: () => void;
  onOpenOffices?: (city: 'garut' | 'bandung') => void;
  onSelectServiceCategory?: (cat: string) => void;
  onOpenRegulation?: (tab?: 'kurs' | 'musim' | 'visa' | 'kalkulator') => void;
}

// 8 Gallery Photos for 2 rows x 4 columns grid
const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Thawaf Jamaah di Depan Ka'bah",
    url: thawafKaabaRealImg
  },
  {
    id: 2,
    title: "Kubah Hijau & Payung Masjid Nabawi",
    url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Bimbingan Ibadah & Kajian Jamaah",
    url: kajianNabawiRealImg
  },
  {
    id: 4,
    title: "Ziarah Jabal Uhud & Kota Madinah",
    url: jabalUhudRealImg
  },
  {
    id: 5,
    title: "Keluarga Jamaah Berpakaian Ihram",
    url: keluargaIhramRealImg
  },
  {
    id: 6,
    title: "Keberangkatan di Bandara Internasional",
    url: bandaraDepatureRealImg
  },
  {
    id: 7,
    title: "Wisata Sejarah Jabal Rahmah Arafah",
    url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    title: "Suasana Pelataran Masjidil Haram Makkah",
    url: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=600&q=80"
  }
];

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenLegal, onOpenRegulation }) => {
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<{ url: string; title: string } | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<'disclaimer' | 'privacy' | null>(null);

  return (
    <>
      <footer id="footer-section" className="w-full font-sans-luxury bg-[#2B2B2B] text-[#D9D9D9] relative overflow-hidden">
        {/* =========================================================================
            BAGIAN ATAS: Background Soft Charcoal (#2B2B2B), Teks Medium Gray (#D9D9D9)
            GRID 3 KOLOM: Brand Profile (Kiri) | Kantor Pusat & Kontak (Tengah) | Gallery (Kanan)
        ========================================================================== */}
        <div className="py-8 sm:py-10 px-4 sm:px-8 border-t border-[#3D3D3D] relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* ===================================================================
                KOLOM 1 (KIRI - 4/12): Brand Profile
            ==================================================================== */}
            <div className="lg:col-span-4 space-y-3">
              {/* Logo Teks/Gambar "ALGHANIM Islamic Tour" */}
              <div 
                className="cursor-pointer inline-block"
                onClick={() => onNavClick('beranda')}
                title="Kembali ke Beranda ALGHANIM"
              >
                <AlGhanimLogo theme="dark" size="sm" showLegalBadge={false} />
              </div>

              {/* Deskripsi Singkat dengan Filosofi Satu Naungan */}
              <p className="text-xs text-[#D9D9D9] leading-relaxed">
                PT. Al-Ghanimah Berkah Bersama (ALGHANIM Islamic Tour) hadir di bawah naungan bersama <strong>Mandala 525 Islamic Tour</strong>. Dua pilihan dengan satu tujuan mulia: membantu lebih banyak jamaah mewujudkan niat menuju Tanah Suci dengan pilihan hemat, amanah, dan terpercaya.
              </p>

              {/* Legalitas / Izin Resmi (Dipadatkan) */}
              <div className="p-2.5 sm:p-3 rounded-lg bg-[#333333] border border-[#444444] shadow-xs space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#DFC386] font-bold text-[11px] uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                  <span>Izin Resmi Kemenag RI</span>
                </div>
                <p className="text-[11px] text-[#D9D9D9] font-medium leading-tight">
                  <strong className="text-white">PPIU No. 1030 Thn. 2019</strong> • PIHK Terdaftar • Akreditasi "A"
                </p>
              </div>

              {/* Barisan Badge Sertifikasi / Akreditasi (Padat) */}
              <div className="space-y-1.5 pt-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#A0A0A0]">
                  Sertifikasi &amp; Asosiasi Resmi:
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#333333] border border-[#444444] text-[10px] font-bold text-white shadow-2xs flex items-center gap-1">
                    <Award className="w-3 h-3 text-[#C5A059]" />
                    KAN
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#333333] border border-[#C5A059]/50 text-[10px] font-bold text-[#DFC386] shadow-2xs">
                    Akreditasi "A"
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#333333] border border-[#444444] text-[10px] font-bold text-white shadow-2xs">
                    SAPUHI
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#333333] border border-[#444444] text-[10px] font-bold text-white shadow-2xs">
                    Kemenag RI
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#333333] border border-[#444444] text-[10px] font-bold text-white shadow-2xs">
                    ISO 9001:2015
                  </span>
                </div>
              </div>
            </div>

            {/* ===================================================================
                KOLOM 2 (TENGAH - 4/12): Kantor Pusat & Kontak
            ==================================================================== */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="font-serif-luxury text-sm sm:text-base font-extrabold uppercase tracking-wider text-white border-b-2 border-[#C5A059] pb-1 inline-block">
                KANTOR PUSAT
              </h3>

              {/* Alamat Lengkap */}
              <div className="space-y-1 text-xs text-[#D9D9D9] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <p>
                    Jl. Sudirman Copong Garut, Sukamentri, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44116
                  </p>
                </div>
                <a
                  href="https://share.google/fsqwRYJHLHFaiESVm"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#DFC386] hover:underline pl-6.5 font-medium"
                >
                  <span>Lihat Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Kontak Telepon & Email */}
              <div className="space-y-1.5 text-xs text-[#D9D9D9]">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                  <span>
                    Telp: <strong className="text-white font-semibold">(0262) 4890731</strong> / <strong className="text-white font-semibold">0813-1670-218</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                  <span>
                    Email: <a href="mailto:cs@alghanimtour.com" className="text-white hover:text-[#DFC386] font-semibold underline underline-offset-2 transition-colors">cs@alghanimtour.com</a>
                  </span>
                </div>
              </div>

              {/* Tombol: DISCLAIMER, KEBIJAKAN PRIVASI & REGULASI VISA (Dipadatkan) */}
              <div className="pt-1 flex flex-col gap-1.5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal('disclaimer')}
                    className="flex-1 py-1.5 px-2 rounded-md bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs transition-all text-center cursor-pointer border border-[#555555]"
                  >
                    DISCLAIMER
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLegalModal('privacy')}
                    className="flex-1 py-1.5 px-2 rounded-md bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs transition-all text-center cursor-pointer border border-[#555555]"
                  >
                    KEBIJAKAN PRIVASI
                  </button>
                </div>
                {onOpenRegulation && (
                  <button
                    type="button"
                    onClick={() => onOpenRegulation('visa')}
                    className="w-full py-2 px-3 rounded-md bg-[#C5A059] hover:bg-[#B38E46] active:scale-[0.98] text-white text-[11px] font-bold uppercase tracking-wider shadow-2xs transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>REGULASI VISA, PASPOR &amp; KURS VALAS</span>
                  </button>
                )}
              </div>
            </div>

            {/* ===================================================================
                KOLOM 3 (KANAN - 4/12): Gallery (2 baris x 4 kolom)
            ==================================================================== */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between border-b-2 border-[#C5A059] pb-1">
                <h3 className="font-serif-luxury text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                  GALLERY
                </h3>
                <button
                  onClick={() => onNavClick('testimoni-galeri')}
                  className="text-[11px] text-[#DFC386] hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Lihat Semua →
                </button>
              </div>

              {/* Grid 2 Baris x 4 Kolom = 8 Foto Thumbnail */}
              <div className="grid grid-cols-4 gap-1.5">
                {GALLERY_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedGalleryImg(item)}
                    title={item.title}
                    className="relative aspect-square rounded-md overflow-hidden border border-[#444444] bg-[#242424] shadow-2xs group cursor-pointer"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-1 py-0.5 rounded">
                        Perbesar
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#A0A0A0] italic">
                Dokumentasi nyata kegiatan ibadah &amp; ziarah jamaah ALGHANIM di Tanah Suci.
              </p>
            </div>

          </div>
        </div>

        {/* =========================================================================
            SUB-FOOTER: Background Charcoal Pekat (#1F1F1F)
            Sisi Kiri: Teks Copyright © Copyright 2026 | alghanim.co.id
            Sisi Kanan: Barisan Ikon Sosial Media (Facebook, Instagram, Telegram, TikTok, Location Map)
        ========================================================================== */}
        <div className="bg-[#1F1F1F] text-[#D9D9D9] py-4 px-4 sm:px-8 border-t border-[#333333] relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            
            {/* Sisi Kiri: Copyright Resmi */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[#A0A0A0]">
              <span>© 2026 All Rights Reserved by PT. Al-Ghanimah Berkah Bersama</span>
            </div>

            {/* Sisi Kanan: Barisan Ikon Sosial Media */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                title="Facebook ALGHANIM"
                className="w-8 h-8 rounded-full bg-[#333333] hover:bg-[#C5A059] text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/alghanimislamictour"
                target="_blank"
                rel="noreferrer"
                title="Instagram @alghanimislamictour"
                className="w-8 h-8 rounded-full bg-[#333333] hover:bg-[#C5A059] text-gray-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/alghanimtour"
                target="_blank"
                rel="noreferrer"
                title="Telegram Official ALGHANIM"
                className="w-8 h-8 rounded-full bg-[#333333] hover:bg-[#C5A059] text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <TelegramIcon className="w-4 h-4" />
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@alghanimislamictour"
                target="_blank"
                rel="noreferrer"
                title="TikTok ALGHANIM"
                className="w-8 h-8 rounded-full bg-[#333333] hover:bg-[#C5A059] text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-sm font-bold text-xs"
              >
                ♪
              </a>

              {/* Location Map */}
              <a
                href="https://share.google/fsqwRYJHLHFaiESVm"
                target="_blank"
                rel="noreferrer"
                title="Petunjuk Lokasi Google Maps Kantor Garut"
                className="w-8 h-8 rounded-full bg-[#333333] hover:bg-[#C5A059] text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <Navigation className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

      </footer>

      {/* =========================================================================
          MODAL DISCLAIMER
      ========================================================================== */}
      {activeLegalModal === 'disclaimer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white text-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif-luxury text-xl font-bold uppercase tracking-wide text-gray-900">
                  DISCLAIMER
                </h3>
              </div>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>PT Al-Ghanim Tour &amp; Travel</strong> adalah Penyelenggara Perjalanan Ibadah Umrah (PPIU) resmi berizin Kementerian Agama Republik Indonesia dengan nomor izin <strong>SK PPIU No. U.412 Tahun 2021</strong>.
              </p>
              <p>
                Informasi jadwal keberangkatan, harga paket, fasilitas hotel, dan maskapai penerbangan yang tercantum pada situs ini dapat mengalami penyesuaian mengikuti regulasi resmi Otoritas Penerbangan, Kebijakan Kementerian Haji &amp; Umrah Kerajaan Arab Saudi, dan fluktuasi kurs mata uang asing.
              </p>
              <p>
                Seluruh data pemesanan dan transaksi pembayaran jamaah wajib dilakukan melalui rekening resmi atas nama <strong>PT Al-Ghanim Tour &amp; Travel</strong> untuk menjamin keamanan dan keabsahan pendaftaran ibadah.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200 text-right">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL KEBIJAKAN PRIVASI
      ========================================================================== */}
      {activeLegalModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white text-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif-luxury text-xl font-bold uppercase tracking-wide text-gray-900">
                  KEBIJAKAN PRIVASI
                </h3>
              </div>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <p>
                Privasi dan kerahasiaan data pribadi para tamu Allah adalah prioritas mutlak bagi <strong>PT Al-Ghanim Tour &amp; Travel</strong>.
              </p>
              <p>
                <strong>1. Pengumpulan Data:</strong> Kami mengumpulkan data seperti nama lengkap, nomor paspor, foto identitas, nomor telepon/WhatsApp, dan dokumen kelengkapan mahram semata-mata untuk penerbitan tiket penerbangan, pendaftaran SISKOPATUH Kemenag RI, pemesanan hotel, dan penerbitan Visa Umroh resmi Muassasah Arab Saudi.
              </p>
              <p>
                <strong>2. Keamanan Data:</strong> Kami tidak pernah menjual, memperjualbelikan, atau mendistribusikan data pribadi jamaah kepada pihak ketiga mana pun di luar keperluan operasional ibadah resmi.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200 text-right">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 rounded-lg bg-[#C5A059] hover:bg-[#B38E46] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Tutup Kebijakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL LIGHTBOX GALLERY PREVIEW
      ========================================================================== */}
      {selectedGalleryImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedGalleryImg(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-[#161616] rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#111] flex items-center justify-between text-white border-b border-gray-800">
              <h4 className="text-sm font-bold">{selectedGalleryImg.title}</h4>
              <button
                onClick={() => setSelectedGalleryImg(null)}
                className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedGalleryImg.url}
                alt={selectedGalleryImg.title}
                className="w-full h-auto max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
