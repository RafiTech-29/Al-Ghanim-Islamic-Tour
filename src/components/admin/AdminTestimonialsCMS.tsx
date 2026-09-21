import React, { useState } from 'react';
import { 
  Star, 
  Trash2, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Plus, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  Send,
  HeartHandshake,
  UserCheck
} from 'lucide-react';
import { TestimonialItem } from '../../types';

interface AdminTestimonialsCMSProps {
  testimonials: TestimonialItem[];
  onAddTestimonial: (item: Omit<TestimonialItem, 'id'>) => Promise<string>;
  onUpdateTestimonial: (id: string, updates: Partial<TestimonialItem>) => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const AdminTestimonialsCMS: React.FC<AdminTestimonialsCMSProps> = ({
  testimonials,
  onAddTestimonial,
  onUpdateTestimonial,
  onDeleteTestimonial,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'hidden' | 'stars5'>('all');
  
  // Reply State
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('Manajemen ALGHANIM Cabang Garut');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<TestimonialItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Manual Testimonial Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    city: 'Garut',
    packageTaken: 'Umroh Reguler Syawal 1448 H (9 Hari)',
    rating: 5,
    comment: '',
    nij: '',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  });
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  // Statistics
  const totalCount = testimonials.length;
  const approvedCount = testimonials.filter(t => t.status !== 'hidden').length;
  const hiddenCount = testimonials.filter(t => t.status === 'hidden').length;
  const avgRating = totalCount > 0 
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  // Filtering
  const filteredList = testimonials.filter((t) => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.packageTaken || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.nij || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'approved') return t.status !== 'hidden';
    if (filterStatus === 'hidden') return t.status === 'hidden';
    if (filterStatus === 'stars5') return (t.rating || 5) === 5;
    return true;
  });

  // Handle Toggle Hide/Show
  const handleToggleHide = async (t: TestimonialItem) => {
    const newStatus = t.status === 'hidden' ? 'approved' : 'hidden';
    try {
      await onUpdateTestimonial(t.id, { status: newStatus });
      onShowToast(newStatus === 'hidden' 
        ? `Ulasan dari ${t.name} telah disembunyikan dari publik.` 
        : `Ulasan dari ${t.name} kini tampil di publik.`);
    } catch (err) {
      console.error(err);
      onShowToast('Gagal mengubah status ulasan.');
    }
  };

  // Handle Submit Reply
  const handleOpenReply = (t: TestimonialItem) => {
    setReplyingId(t.id);
    setReplyText(t.adminReply?.replyText || `Jazakumullah khairan katsiran Bpk/Ibu ${t.name} atas amanah dan ulasannya. Semoga ibadah umrohnya mabrur dan penuh keberkahan. Aamiin ya Rabbal 'Alamin.`);
  };

  const handleSaveReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      setIsSubmittingReply(true);
      const nowFormatted = new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });

      await onUpdateTestimonial(id, {
        adminReply: {
          replyText: replyText.trim(),
          repliedAt: nowFormatted,
          repliedBy: replyAuthor.trim() || 'Manajemen ALGHANIM'
        }
      });
      setReplyingId(null);
      setReplyText('');
      onShowToast('Balasan resmi admin berhasil disimpan dan tampil di website!');
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menyimpan balasan.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (id: string) => {
    try {
      await onUpdateTestimonial(id, { adminReply: undefined });
      onShowToast('Balasan admin berhasil dihapus.');
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menghapus balasan.');
    }
  };

  // Handle Delete Testimonial
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsDeleting(true);
      await onDeleteTestimonial(deleteConfirm.id);
      onShowToast(`Testimoni dari "${deleteConfirm.name}" berhasil dihapus permanen.`);
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menghapus ulasan.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Add Manual Testimonial
  const handleSaveManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !manualForm.comment.trim()) {
      onShowToast('Nama dan isi ulasan wajib diisi.');
      return;
    }

    try {
      setIsSubmittingManual(true);
      await onAddTestimonial({
        name: manualForm.name.trim(),
        city: manualForm.city.trim() || 'Garut',
        packageTaken: manualForm.packageTaken,
        rating: manualForm.rating,
        comment: manualForm.comment.trim(),
        nij: manualForm.nij.trim() || undefined,
        isVerified: Boolean(manualForm.nij.trim()),
        status: 'approved',
        date: manualForm.date,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
      });
      setIsAddModalOpen(false);
      setManualForm({
        name: '',
        city: 'Garut',
        packageTaken: 'Umroh Reguler Syawal 1448 H (9 Hari)',
        rating: 5,
        comment: '',
        nij: '',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      });
      onShowToast('Testimoni jamaah berhasil ditambahkan!');
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menambahkan testimoni.');
    } finally {
      setIsSubmittingManual(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Stat Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#1A1A1A] flex items-center gap-2">
            <Star className="w-6 h-6 text-[#A67C52] fill-[#A67C52]" />
            Manajemen Ulasan &amp; Testimoni Jamaah
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pantau ulasan masuk dari jamaah, balas ulasan secara resmi, dan moderasi (sembunyikan / hapus komentar negatif / spam).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A67C52] hover:bg-[#8d6641] text-white text-xs font-bold transition-all shadow-md shadow-[#A67C52]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Ulasan Manual</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Total Ulasan
          </div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-1">
            {totalCount}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Semua data masuk</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm">
          <div className="text-[11px] font-semibold text-[#A67C52] uppercase tracking-wider">
            Rating Rata-Rata
          </div>
          <div className="text-2xl font-bold text-[#A67C52] mt-1 flex items-center gap-1.5">
            <span>{avgRating}</span>
            <Star className="w-5 h-5 fill-[#A67C52] text-[#A67C52]" />
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Skala kepuasan 1-5</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-sm">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
            Tayang Publik
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {approvedCount}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Aktif di web</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-sm">
          <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
            Disembunyikan
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {hiddenCount}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Moderasi / hate comment</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, paket, kota, isi ulasan..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#A67C52]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-[#1A1A1A] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'approved'
                ? 'bg-emerald-700 text-white'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Tayang ({approvedCount})
          </button>
          <button
            onClick={() => setFilterStatus('hidden')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'hidden'
                ? 'bg-rose-600 text-white'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            Disembunyikan ({hiddenCount})
          </button>
          <button
            onClick={() => setFilterStatus('stars5')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'stars5'
                ? 'bg-amber-600 text-white'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            ★ 5 Bintang
          </button>
        </div>
      </div>

      {/* Testimonials List */}
      {filteredList.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-700">Tidak ada ulasan yang cocok</h3>
          <p className="text-xs text-gray-500">
            Coba ubah kata kunci pencarian atau filter status ulasan.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-sm space-y-4 ${
                t.status === 'hidden'
                  ? 'border-rose-200 bg-rose-50/20'
                  : 'border-gray-200 hover:border-[#A67C52]/60'
              }`}
            >
              {/* Header: User Info + Rating + Badges + Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 border border-[#A67C52] text-[#A67C52] font-bold text-sm flex items-center justify-center shrink-0">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-[#1A1A1A]">{t.name}</h4>
                      {t.isVerified || t.nij ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Terverifikasi Resmi
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          Jamaah Umum
                        </span>
                      )}
                      {t.status === 'hidden' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                          <EyeOff className="w-3 h-3" />
                          Disembunyikan (Tidak Tayang)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <Eye className="w-3 h-3" />
                          Tayang di Website
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {t.city} • <span className="font-medium text-[#A67C52]">{t.packageTaken}</span> • <span className="text-gray-400">{t.date}</span>
                    </div>
                  </div>
                </div>

                {/* Stars and Moderation Quick Action */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-0.5 text-[#A67C52]">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#A67C52] text-[#A67C52]" />
                    ))}
                    <span className="text-xs font-bold text-[#1A1A1A] ml-1.5">
                      {(t.rating || 5).toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 border-l border-gray-200 pl-3">
                    {/* Toggle Hide */}
                    <button
                      onClick={() => handleToggleHide(t)}
                      className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        t.status === 'hidden'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                      title={t.status === 'hidden' ? 'Tampilkan ke publik' : 'Sembunyikan dari publik'}
                    >
                      {t.status === 'hidden' ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>

                    {/* Reply Button */}
                    <button
                      onClick={() => handleOpenReply(t)}
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                      title="Balas ulasan ini"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    {/* Delete Permanently */}
                    <button
                      onClick={() => setDeleteConfirm(t)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Hapus permanen (spam / hate comment)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment Body */}
              <div className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed italic bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                "{t.comment}"
              </div>

              {/* Official Admin Reply (if already present) */}
              {t.adminReply && t.adminReply.replyText && replyingId !== t.id && (
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#A67C52]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t.adminReply.repliedBy || 'Tanggapan Manajemen ALGHANIM'}
                      <span className="text-gray-400 font-normal">({t.adminReply.repliedAt})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenReply(t)}
                        className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Edit Balasan
                      </button>
                      <button
                        onClick={() => handleDeleteReply(t.id)}
                        className="text-[10px] text-rose-600 hover:underline font-semibold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    "{t.adminReply.replyText}"
                  </p>
                </div>
              )}

              {/* Inline Reply Editor */}
              {replyingId === t.id && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                      Tulis Balasan Resmi Manajemen ALGHANIM
                    </span>
                    <button
                      onClick={() => setReplyingId(null)}
                      className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                        Identitas Pembalas
                      </label>
                      <input
                        type="text"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        placeholder="Contoh: Manajemen ALGHANIM Cabang Garut"
                        className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                      Isi Balasan
                    </label>
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Tulis tanggapan atau ucapan doa untuk jamaah..."
                      className="w-full px-3 py-2 rounded-lg border border-blue-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyingId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-white/50 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={isSubmittingReply || !replyText.trim()}
                      onClick={() => handleSaveReply(t.id)}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isSubmittingReply ? 'Menyimpan...' : 'Kirim Balasan Resmi'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-[#1A1A1A]">Hapus Ulasan Permanen?</h3>
              <p className="text-xs text-gray-500">
                Anda akan menghapus ulasan dari <strong className="text-gray-800">{deleteConfirm.name}</strong> secara permanen. Tindakan ini cocok untuk membersihkan ujaran kebencian atau komentar spam.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 italic border border-gray-200">
              "{deleteConfirm.comment}"
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Manual Testimonial */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif-luxury text-[#1A1A1A]">
                  Input Testimoni Jamaah (Manual)
                </h3>
                <p className="text-xs text-gray-500">
                  Masukkan testimoni jamaah alumni dari pesan WhatsApp, formulir fisik, atau buku tamu kantor.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nama Jamaah *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    placeholder="Contoh: Hj. Siti Nurjanah"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#A67C52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kota Asal
                  </label>
                  <input
                    type="text"
                    value={manualForm.city}
                    onChange={(e) => setManualForm({ ...manualForm, city: e.target.value })}
                    placeholder="Contoh: Garut"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Paket Yang Diambil
                  </label>
                  <input
                    type="text"
                    value={manualForm.packageTaken}
                    onChange={(e) => setManualForm({ ...manualForm, packageTaken: e.target.value })}
                    placeholder="Contoh: Umroh Reguler 9 Hari"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#A67C52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Rating Bintang (1-5)
                  </label>
                  <select
                    value={manualForm.rating}
                    onChange={(e) => setManualForm({ ...manualForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#A67C52] bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Sangat Puas)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Puas)</option>
                    <option value={3}>⭐⭐⭐ (3 - Cukup)</option>
                    <option value={2}>⭐⭐ (2 - Kurang)</option>
                    <option value={1}>⭐ (1 - Buruk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  NIJ Jamaah (Opsional untuk tanda verifikasi)
                </label>
                <input
                  type="text"
                  value={manualForm.nij}
                  onChange={(e) => setManualForm({ ...manualForm, nij: e.target.value })}
                  placeholder="Contoh: AG-2026-8802"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Isi Testimoni &amp; Pengalaman *
                </label>
                <textarea
                  required
                  rows={3}
                  value={manualForm.comment}
                  onChange={(e) => setManualForm({ ...manualForm, comment: e.target.value })}
                  placeholder="Pengalaman ibadah, kepuasan hotel, bimbingan manasik, dan muthawwif..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingManual}
                  className="px-5 py-2 rounded-xl bg-[#A67C52] hover:bg-[#8d6641] text-white text-xs font-bold transition-all shadow-md shadow-[#A67C52]/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingManual ? 'Menyimpan...' : 'Simpan Testimoni'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
