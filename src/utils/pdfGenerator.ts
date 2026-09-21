import { jsPDF } from 'jspdf';
import { JamaahProgressItem } from '../types';

export interface ConsultationPDFData {
  fullName: string;
  phone: string;
  email?: string;
  programType: string;
  jamaahCount: string;
  message?: string;
  ktp?: string;
  nik?: string;
  roomType?: string;
  targetMonth?: string;
  refCode?: string;
  // Dynamic package specifications from Admin CMS
  price?: string;
  airline?: string;
  hotelMakkah?: string;
  hotelMadinah?: string;
  makkahDistance?: string;
  duration?: string;
  departureDate?: string;
  programHighlights?: string[];
}

/**
 * Generates an official, beautifully styled PDF Brochure & Consultation Summary
 * for the Jamaah directly in the browser.
 */
export const generateConsultationBrochurePDF = (data: ConsultationPDFData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [166, 124, 82]; // #A67C52
  const darkColor = [26, 26, 26]; // #1A1A1A
  const grayColor = [100, 100, 100];
  const lightBg = [245, 245, 245];
  const goldColor = [197, 160, 89]; // #C5A059

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const refNumber = `REF/AG-${Date.now().toString().slice(-6)}/${new Date().getFullYear()}`;

  // Top Header Accent Bar
  doc.setFillColor(166, 124, 82);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Header Title & Branding
  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ALGHANIM ISLAMIC TOUR', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(166, 124, 82);
  doc.text('INSTAGRAM RESMI: @ALGHANIMISLAMICTOUR', 14, 23);

  // Legalities Info
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('Izin Resmi Kemenag RI: PPIU No. 1030 Tahun 2019 • Akreditasi "A" BAN-PPIU', 14, 28);
  doc.text('Kantor Garut: Jl. Sudirman Copong Garut, Sukamentri, Garut 44116 • WA: 0813-1670-218', 14, 32);

  // Right Header Meta Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(pageWidth - 68, 12, 54, 22, 2, 2, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7.5);
  doc.text('No. Referensi:', pageWidth - 65, 17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text(refNumber, pageWidth - 65, 22);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Tanggal: ${today}`, pageWidth - 65, 27);
  doc.text('Status: Terdaftar Resmi', pageWidth - 65, 31);

  // Divider line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(14, 37, pageWidth - 14, 37);

  // Title Banner: Rincian Rencana Perjalanan Ibadah
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, 42, pageWidth - 28, 14, 2, 2, 'F');
  doc.setDrawColor(166, 124, 82);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, 42, pageWidth - 28, 14, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text('BUKTI PENDAFTARAN SEAT & ESTIMASI PERJALANAN IBADAH', 18, 51);

  // Section 1: Data Calon Jamaah
  let currentY = 64;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('1. DATA CALON JAMAAH / KOORDINATOR', 14, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(225, 225, 225);
  doc.roundedRect(14, currentY, pageWidth - 28, 42, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);

  // Row 1: Nama Lengkap
  doc.text('Nama Lengkap', 18, currentY + 6);
  doc.text(':', 55, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(data.fullName || 'Tamu Allah', 58, currentY + 6);

  // Row 2: NIK / No. KTP
  const nikValue = data.ktp || data.nik;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('NIK / No. KTP', 18, currentY + 12);
  doc.text(':', 55, currentY + 12);
  if (nikValue && nikValue.trim().length > 0 && nikValue !== 'Belum diisi') {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(nikValue.trim(), 58, currentY + 12);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('- (Opsional / Dilengkapi Saat Pendaftaran)', 58, currentY + 12);
  }

  // Row 3: Nomor WhatsApp
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Nomor WhatsApp', 18, currentY + 18);
  doc.text(':', 55, currentY + 18);
  doc.setTextColor(26, 26, 26);
  doc.text(data.phone || '-', 58, currentY + 18);

  // Row 4: Email Pemesan
  doc.setTextColor(80, 80, 80);
  doc.text('Email Pemesan', 18, currentY + 24);
  doc.text(':', 55, currentY + 24);
  if (data.email && data.email.trim().length > 0 && data.email !== '-') {
    doc.setTextColor(26, 26, 26);
    doc.text(data.email.trim(), 58, currentY + 24);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('- (Konfirmasi via WhatsApp)', 58, currentY + 24);
  }

  // Row 5: Program & Kamar
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Program & Kamar', 18, currentY + 30);
  doc.text(':', 55, currentY + 30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  const roomText = data.roomType ? ` • ${data.roomType}` : '';
  const timeText = data.targetMonth ? ` • ${data.targetMonth}` : '';
  doc.text(`${data.programType}${roomText} (${data.jamaahCount})${timeText}`, 58, currentY + 30, { maxWidth: pageWidth - 76 });

  // Row 6: Estimasi Biaya Paket (Dynamic from CMS)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Estimasi Biaya', 18, currentY + 36);
  doc.text(':', 55, currentY + 36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  if (data.price && data.price.trim().length > 0) {
    doc.text(`${data.price} per Jamaah (Garansi Transparansi Resmi)`, 58, currentY + 36, { maxWidth: pageWidth - 76 });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.text('Sesuai Pilihan Kamar & Konfirmasi Invoice', 58, currentY + 36, { maxWidth: pageWidth - 76 });
  }

  // Section 2: Spesifikasi Paket & Fasilitas
  currentY += 48;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('2. SPESIFIKASI FASILITAS & STANDAR PELAYANAN (SACRED LUXURY)', 14, currentY);

  currentY += 4;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(14, currentY, pageWidth - 28, 52, 2, 2, 'FD');

  const facilities = [
    ['Penerbangan', (data.airline || 'Direct Saudia Airlines / Garuda Indonesia (CGK-JED/MED)').slice(0, 75)],
    ['Hotel Makkah', (data.hotelMakkah ? `${data.hotelMakkah}${data.makkahDistance ? ` (${data.makkahDistance})` : ''}` : 'Bintang 5/4 Ring 1 Dekat Masjidil Haram (Swissotel/setaraf)').slice(0, 75)],
    ['Hotel Madinah', (data.hotelMadinah || 'Bintang 4/5 Dekat Masjid Nabawi (Dallah Taibah/setaraf)').slice(0, 75)],
    ['Durasi & Jadwal', `${data.duration || '9 Hari'} • Jadwal: ${data.departureDate || data.targetMonth || 'Bulan Terdekat'}`.slice(0, 75)],
    ['Konsumsi', 'Fullboard 3x Sehari Masakan Khas Nusantara (Higienis & Halal)'],
    ['Transportasi', 'Bus Pariwisata Eksekutif VIP AC & Berpendingin Khusus Saudi'],
    ['Bimbingan', 'Muthawwif & Asatidz Ahlus Sunnah + Tour Leader Standby 24 Jam'],
    ['Handling & Gift', 'Free Air Zam-zam 5 Liter, Handling Bandara Soetta & Saudi']
  ];

  let itemY = currentY + 6;
  facilities.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(166, 124, 82);
    doc.text(`• ${label}`, 18, itemY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`:  ${value}`, 48, itemY, { maxWidth: pageWidth - 66 });
    itemY += 5.8;
  });

  // Section 3: Perlengkapan Eksklusif & Catatan Khusus
  currentY += 58;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('3. PERLENGKAPAN JAMAAH & CATATAN KHUSUS', 14, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(225, 225, 225);
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const customHighlights = data.programHighlights && data.programHighlights.length > 0 
    ? data.programHighlights.slice(0, 3).join(' • ')
    : 'Koper Fiber 24", Tas Paspor, Kain Ihram/Mukena, Batik Seragam Resmi, Syal & Buku Doa';

  const splitHighlights = doc.splitTextToSize(`Perlengkapan Lengkap: ${customHighlights}`, pageWidth - 36);
  doc.text(splitHighlights[0] || '', 18, currentY + 6);
  doc.text(
    'Batik Seragam Resmi Al-Ghanim, Syal Identitas, Buku Doa Manasik, dan ID Card Barcode.',
    18,
    currentY + 11
  );

  if (data.message && data.message.trim().length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(166, 124, 82);
    doc.text('Permintaan Khusus:', 18, currentY + 18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`"${data.message.slice(0, 85)}"`, 50, currentY + 18, { maxWidth: pageWidth - 70 });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('Permintaan Khusus: Standard Sacred Luxury Service (Konfirmasi via WhatsApp).', 18, currentY + 18);
  }

  // Section 4: Prosedur Verifikasi & Prosedur Pembayaran Resmi
  currentY += 34;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, currentY, (pageWidth - 28) / 2 - 2, 34, 2, 2, 'F');
  doc.roundedRect(14 + (pageWidth - 28) / 2 + 2, currentY, (pageWidth - 28) / 2 - 2, 34, 2, 2, 'F');

  // Left Box: Prosedur Pembayaran & Invoice Resmi
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(166, 124, 82);
  doc.text('PROSEDUR INVOICE & PEMBAYARAN', 18, currentY + 7);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Pembayaran DP & Pelunasan hanya sah via:', 18, currentY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('Invoice Resmi Terbitan Finance ALGHANIM', 18, currentY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Rekening resmi PT tertera pada lembar tagihan.', 18, currentY + 23);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(180, 50, 50);
  doc.text('*Dilarang mentransfer ke rekening selain atas nama PT resmi', 18, currentY + 29);

  // Right Box: Verifikasi & Kontak Cabang Garut
  const rightBoxX = 14 + (pageWidth - 28) / 2 + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(166, 124, 82);
  doc.text('LAYANAN RESMI CABANG GARUT', rightBoxX, currentY + 7);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Jl. Sudirman Copong Garut', rightBoxX, currentY + 13);
  doc.text('Sukamentri, Kec. Garut Kota, Garut 44116', rightBoxX, currentY + 17);
  doc.setFont('helvetica', 'bold');
  doc.text('Hotline WhatsApp: 0813-1670-218', rightBoxX, currentY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Google Maps: share.google/fsqwRYJHLHFaiESVm', rightBoxX, currentY + 27);

  // Footer Signature & Stamp Note
  currentY += 40;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, currentY, pageWidth - 14, currentY);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(
    'Dokumen ini diterbitkan secara digital oleh Sistem Informasi Terpadu ALGHANIM Islamic Tour Garut.',
    14,
    currentY + 5
  );
  doc.text(
    'Bawa dokumen ini atau tunjukkan file digital saat melakukan pendaftaran langsung di kantor cabang.',
    14,
    currentY + 9
  );

  // Save the PDF
  const sanitizedName = (data.fullName || 'Jamaah').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Bukti_Pendaftaran_Umroh_ALGHANIM_${sanitizedName}.pdf`);
};

/**
 * Generates an official Paspor Recommendation Letter (Surat Rekomendasi Paspor Kemenag) in PDF
 */
export const generatePassportRecommendationPDF = (jamaah: JamaahProgressItem) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Header Letterhead
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 26);
  doc.text('PT. AL-GHANIMAH BERKAH BERSAMA', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('ALGHANIM ISLAMIC TOUR & TRAVEL', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Izin Penyelenggara Perjalanan Ibadah Umrah (PPIU) No. 1030 Tahun 2019 Kemenag RI', pageWidth / 2, 30, { align: 'center' });
  doc.text('Kantor Garut: Jl. Sudirman Copong, Garut 44116 • Telp/WA: 0813-1670-218', pageWidth / 2, 34, { align: 'center' });

  // Double Line
  doc.setLineWidth(0.8);
  doc.setDrawColor(26, 26, 26);
  doc.line(18, 38, pageWidth - 18, 38);
  doc.setLineWidth(0.2);
  doc.line(18, 39.5, pageWidth - 18, 39.5);

  // Letter Meta
  let y = 48;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 26, 26);

  doc.text(`Nomor     : ${jamaah.nij}/REK-PASPOR/${new Date().getFullYear()}`, 18, y);
  doc.text(`Lampiran  : 1 (Satu) Berkas`, 18, y + 5);
  doc.text(`Perihal   : Permohonan Pembuatan / Perpanjangan Paspor Umroh`, 18, y + 10);

  doc.text(`Garut, ${today}`, pageWidth - 55, y);

  y += 20;
  doc.text('Kepada Yth.', 18, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Kepala Kantor Imigrasi Republik Indonesia', 18, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text('Di Tempat', 18, y + 10);

  y += 18;
  doc.text('Assalamu\'alaikum Warahmatullahi Wabarakatuh,', 18, y);

  y += 6;
  const intro = 'Dengan hormat, bersama surat ini kami dari Penyelenggara Perjalanan Ibadah Umrah (PPIU) PT. Al-Ghanimah Berkah Bersama (ALGHANIM Islamic Tour) menerangkan bahwa:';
  doc.text(doc.splitTextToSize(intro, pageWidth - 36), 18, y);

  y += 12;
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(18, y, pageWidth - 36, 42, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Nama Lengkap', 22, y + 8);
  doc.text(':', 60, y + 8);
  doc.text(jamaah.fullName, 63, y + 8, { maxWidth: pageWidth - 85 });

  doc.setFont('helvetica', 'normal');
  doc.text('Nomor Induk KTP', 22, y + 15);
  doc.text(':', 60, y + 15);
  doc.text(jamaah.ktp || '-', 63, y + 15);

  doc.text('Nomor Induk Jamaah (NIJ)', 22, y + 22);
  doc.text(':', 60, y + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text(jamaah.nij, 63, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 26, 26);
  doc.text('Paket / Rencana Berangkat', 22, y + 29);
  doc.text(':', 60, y + 29);
  doc.text(`${jamaah.packageName} (Jadwal: ${jamaah.departureDate})`, 63, y + 29, { maxWidth: pageWidth - 85 });

  doc.text('Status Pembayaran', 22, y + 36);
  doc.text(':', 60, y + 36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 120, 50);
  doc.text(`${jamaah.paymentStatus} (Telah Terdaftar Resmi di Sistem ALGHANIM)`, 63, y + 36, { maxWidth: pageWidth - 85 });

  y += 50;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 26, 26);
  const bodyText = 'Adalah benar jamaah yang telah terdaftar dan terkonfirmasi untuk menunaikan Ibadah Umroh ke Tanah Suci (Makkah & Madinah) bersama biro perjalanan kami. Sehubungan dengan hal tersebut, kami memohon bantuan Bapak/Ibu Kepala Kantor Imigrasi agar dapat memberikan fasilitas penerbitan Paspor Republik Indonesia untuk yang bersangkutan.';
  doc.text(doc.splitTextToSize(bodyText, pageWidth - 36), 18, y);

  y += 20;
  const outro = 'Demikian surat rekomendasi ini kami sampaikan dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerjasama yang baik, kami ucapkan terima kasih.';
  doc.text(doc.splitTextToSize(outro, pageWidth - 36), 18, y);

  y += 18;
  doc.text('Wassalamu\'alaikum Warahmatullahi Wabarakatuh.', 18, y);

  // Signatures
  y += 14;
  const signX = pageWidth - 75;
  doc.setFont('helvetica', 'bold');
  doc.text('Pimpinan Cabang / Manajemen', signX, y);
  doc.text('PT. Al-Ghanimah Berkah Bersama', signX, y + 4);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(166, 124, 82);
  doc.text('[Dokumen Resmi Berizin PPIU]', signX, y + 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('( Direksi PT. Al-Ghanimah Berkah Bersama )', signX, y + 28);

  // Save
  doc.save(`Surat_Rekomendasi_Paspor_ALGHANIM_${jamaah.nij}.pdf`);
};

/**
 * Generates an official Kartu Tanda Jamaah & Progres Tracking PDF
 */
export const generateJamaahTrackingCardPDF = (jamaah: JamaahProgressItem) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Header Banner
  doc.setFillColor(166, 124, 82);
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('KARTU STATUS & TRANSPARANSI JAMAAH', 14, 12);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('ALGHANIM ISLAMIC TOUR • PPIU NO. 1030 THN. 2019 • INSTAGRAM: @ALGHANIMISLAMICTOUR', 14, 18);

  // Jamaah Card Box
  let y = 34;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, y, pageWidth - 28, 44, 2, 2, 'F');
  doc.setDrawColor(166, 124, 82);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, y, pageWidth - 28, 44, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 26);
  doc.text(jamaah.fullName, 20, y + 10, { maxWidth: pageWidth - 48 });

  doc.setFontSize(9);
  doc.setTextColor(166, 124, 82);
  doc.text(`Nomor Induk Jamaah (NIJ): ${jamaah.nij}`, 20, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8.5);
  doc.text(`No. KTP: ${jamaah.ktp} • No. WhatsApp: ${jamaah.phone}`, 20, y + 24, { maxWidth: pageWidth - 48 });
  doc.text(`Paket: ${jamaah.packageName} (${jamaah.duration})`, 20, y + 30, { maxWidth: pageWidth - 48 });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(`Jadwal Keberangkatan: ${jamaah.departureDate} (${jamaah.airline})`, 20, y + 37, { maxWidth: pageWidth - 48 });

  // Progress Milestone Box
  y += 50;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(166, 124, 82);
  doc.text(`STATUS PROGRES SAAT INI: TAHAP ${jamaah.progressStep} DARI 5`, 14, y);

  y += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, y, pageWidth - 28, 52, 2, 2, 'FD');

  const steps = [
    { step: 1, title: 'Pembayaran DP & Registrasi', status: jamaah.progressStep >= 1 ? 'SELESAI (TERVERIFIKASI)' : 'Menunggu' },
    { step: 2, title: 'Kelengkapan Dokumen & Paspor', status: jamaah.progressStep >= 2 ? 'SELESAI' : jamaah.passportStatus },
    { step: 3, title: 'Pelunasan Biaya & Manasik', status: jamaah.progressStep >= 3 ? 'LUNAS (TERVERIFIKASI)' : jamaah.paymentStatus },
    { step: 4, title: 'Penerbitan Visa & Tiket Pesawat', status: jamaah.progressStep >= 4 ? 'TERBIT RESMI' : jamaah.visaStatus },
    { step: 5, title: 'Keberangkatan Menuju Baitullah', status: jamaah.progressStep >= 5 ? 'SIAP BERANGKAT' : 'Menunggu Jadwal' }
  ];

  let stepY = y + 7;
  steps.forEach((s) => {
    const isDone = jamaah.progressStep >= s.step;
    
    // Draw clean visual vector checkmark circle for completed steps
    if (isDone) {
      // Green circle
      doc.setFillColor(20, 140, 60);
      doc.circle(20, stepY - 1.2, 2.8, 'F');
      
      // White checkmark vector lines inside circle
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.6);
      doc.line(18.8, stepY - 1.2, 19.8, stepY - 0.2);
      doc.line(19.8, stepY - 0.2, 21.4, stepY - 2.4);
    } else {
      // Grey outline circle for pending steps
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.4);
      doc.circle(20, stepY - 1.2, 2.8, 'S');
    }

    // Step Title & Label
    doc.setFont('helvetica', isDone ? 'bold' : 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(isDone ? 26 : 100, isDone ? 26 : 100, isDone ? 26 : 100);
    doc.text(`Step ${s.step}: ${s.title}`, 26, stepY);

    // Status Label Tag
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (isDone) {
      doc.setTextColor(20, 140, 60);
      doc.text(`[✓ ${s.status}]`, 128, stepY);
    } else {
      doc.setTextColor(130, 130, 130);
      doc.text(`[ ${s.status} ]`, 128, stepY);
    }
    
    stepY += 9;
  });

  // Financial & Hotel Info
  y += 54;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, y, pageWidth - 28, 38, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(166, 124, 82);
  doc.text('RINCIAN AKOMODASI & FINANSIAL', 20, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Hotel Makkah: ${jamaah.hotelMakkah}`, 20, y + 14, { maxWidth: pageWidth - 48 });
  doc.text(`Hotel Madinah: ${jamaah.hotelMadinah}`, 20, y + 20, { maxWidth: pageWidth - 48 });
  doc.text(`Pembimbing Ibadah: ${jamaah.muthawifName} (WA: ${jamaah.muthawifPhone})`, 20, y + 26, { maxWidth: pageWidth - 48 });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(`Total Biaya: ${jamaah.totalAmount} • DP Masuk: ${jamaah.dpAmount} • Sisa: ${jamaah.remainingAmount}`, 20, y + 32, { maxWidth: pageWidth - 48 });

  // Footer & Location
  y += 44;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Kantor Cabang Garut: Jl. Sudirman Copong, Sukamentri, Garut • Maps: share.google/fsqwRYJHLHFaiESVm', 14, y);
  doc.text(`Diunduh pada: ${today} melalui Portal Transparansi ALGHANIM Islamic Tour`, 14, y + 5);

  // Save
  doc.save(`Status_Jamaah_ALGHANIM_${jamaah.nij}.pdf`);
};

/**
 * Generates official PDF Guide & Scheme for Partnership Programs
 * (Kantor Cabang Resmi, Keagenan Resmi Travel, Marketer / Syiar Baitullah)
 */
export const generatePartnershipProgramPDF = (programTitle: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const refCode = `MITRA/AG-${Date.now().toString().slice(-5)}/${new Date().getFullYear()}`;

  // Top Accent Bar
  doc.setFillColor(166, 124, 82);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Header Title
  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('ALGHANIM ISLAMIC TOUR & TRAVEL', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('INSTAGRAM RESMI: @ALGHANIMISLAMICTOUR', 14, 23);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('PT. Al-Ghanimah Berkah Bersama • PPIU Kemenag RI No. 1030 Thn. 2019 (Akreditasi A)', 14, 28);
  doc.text('Pusat Layanan Garut: Jl. Sudirman Copong Garut, Sukamentri • WA: 0813-1670-218', 14, 32);

  // Right Meta
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(pageWidth - 68, 12, 54, 22, 2, 2, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7.5);
  doc.text('Kode Dokumen:', pageWidth - 65, 17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text(refCode, pageWidth - 65, 22);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Terbit: ${today}`, pageWidth - 65, 27);
  doc.text('Klasifikasi: Kemitraan', pageWidth - 65, 31);

  // Divider line
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 37, pageWidth - 14, 37);

  // Title Banner
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, 42, pageWidth - 28, 14, 2, 2, 'F');
  doc.setDrawColor(166, 124, 82);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, 42, pageWidth - 28, 14, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text(`PROPOSAL & SKEMA HAK EKSKLUSIF: ${programTitle.toUpperCase()}`, 18, 51);

  let currentY = 64;

  // Specific Program Details
  let roleDesc = '';
  let commissionScheme = '';
  let facilitiesList: string[] = [];
  let targetAudience = '';

  if (programTitle.toLowerCase().includes('cabang')) {
    roleDesc = 'Program pembukaan representasi kantor resmi ALGHANIM di wilayah Kota/Kabupaten pilihan Anda dengan hak penuh penerbitan invoice, booking seat terintegrasi, dan legalitas cabang.';
    commissionScheme = 'Bagi hasil margin paket tertinggi (Rp 2.500.000 - Rp 3.500.000 / jamaah) + Bonus Free 1 Tour Leader per 25-30 jamaah + Royalty fee berkala.';
    targetAudience = 'Pengusaha Muslim, Yayasan Pendidikan, Pondok Pesantren, & KBIHU.';
    facilitiesList = [
      'Hak penggunaan nama dagang & izin PPIU No. 1030 Thn. 2019 di lokasi cabang',
      'Plang nama kantor akrilik eksklusif + Spanduk resmi + Brosur cetak berkala',
      'Akses sistem software booking terpusat, kuota tiket & manifes hotel real-time',
      'Pelatihan operasional staf cabang, standard operating procedure (SOP), dan manajemen',
      'Pendampingan manasik akbar di kota cabang oleh ustadz pembimbing resmi'
    ];
  } else if (programTitle.toLowerCase().includes('agen')) {
    roleDesc = 'Program kemitraan keagenan resmi terverifikasi untuk biro tour lokal, majelis, dan tokoh masyarakat dengan sertifikat agen serta fasilitas promosi komprehensif.';
    commissionScheme = 'Komisi menarik Rp 1.500.000 - Rp 2.000.000 / jamaah yang melunasi pendaftaran + Bonus reward Umroh gratis per akumulasi 15-20 jamaah.';
    targetAudience = 'Biro Tour & Travel Lokal, KBIHU, Koperasi, Asatidz, & Tokoh Masyarakat.';
    facilitiesList = [
      'Sertifikat Keagenan Resmi Al-Ghanim & ID Card Partner Terverifikasi',
      'Spanduk ukuran 3x1 meter, X-Banner display kantor, dan 200 lembar brosur fisik',
      'Akses konsultasi VIP langsung ke tim handling & ticketing ALGHANIM Pusat/Garut',
      'Bahan promosi harian (Foto/Video Makkah-Madinah, flyer program, copywriting WA)',
      'Training product knowledge dan tips syiar closing umroh secara online/offline'
    ];
  } else {
    // Marketer / Syiar Baitullah
    roleDesc = 'Program kemitraan syiar perorangan tanpa modal awal, memudahkan siapapun mengajak keluarga, rekan, dan jamaah untuk beribadah ke Tanah Suci.';
    commissionScheme = 'Ujroh Syiar Rp 1.000.000 - Rp 1.500.000 / jamaah (cair 1x24 jam setelah jamaah menyelesaikan administrasi) + Tabungan Poin Umroh.';
    targetAudience = 'Ustadz/ah, Pengurus DKM, Majelis Taklim, Karyawan, Alumni Jamaah, & Umum.';
    facilitiesList = [
      'Pendaftaran 100% Gratis tanpa biaya registrasi & tanpa target bulanan yang mengikat',
      'Materi konten harian siap share (Poster digital Instagram, status WhatsApp, video reels)',
      'Bimbingan langsung via Grup Komunitas Syiar WhatsApp bersama mentor berpengalaman',
      'Layanan konsultasi closing dibantu langsung oleh tim Customer Care & Admin Garut',
      'Peluang berangkat umroh gratis melalui program akumulasi poin syiar berkah'
    ];
  }

  // Section 1: Ringkasan Program
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('1. DESKRIPSI & SASARAN PROGRAM', 14, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, currentY, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(doc.splitTextToSize(roleDesc, pageWidth - 36), 18, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('Target Mitra Utama:', 18, currentY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 26, 26);
  doc.text(targetAudience, 52, currentY + 22, { maxWidth: pageWidth - 70 });

  // Section 2: Skema Ujroh & Komisi
  currentY += 35;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('2. SKEMA UJROH, KOMISI & REWARD BERKAH', 14, currentY);

  currentY += 4;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(doc.splitTextToSize(`• ${commissionScheme}`, pageWidth - 36), 18, currentY + 7);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('*Pencairan komisi dilakukan secara transparan melalui transfer resmi Bank Syariah Indonesia (BSI).', 18, currentY + 19, { maxWidth: pageWidth - 36 });

  // Section 3: Fasilitas & Marketing Kit
  currentY += 31;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('3. FASILITAS, PERLENGKAPAN & MARKETING KIT MITRA', 14, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, currentY, pageWidth - 28, 42, 2, 2, 'FD');

  let facY = currentY + 6;
  facilitiesList.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(166, 124, 82);
    doc.text('[✓]', 18, facY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    const splitItem = doc.splitTextToSize(item, pageWidth - 46);
    doc.text(splitItem, 25, facY);
    facY += Math.max(6.5, splitItem.length * 4.2);
  });

  // Section 4: Alur Pendaftaran & Verifikasi
  currentY += 49;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('4. CARA REGISTRASI & KONTAK LAYANAN MITRA', 14, currentY);

  currentY += 4;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, currentY, pageWidth - 28, 30, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text('1. Isi formulir pendaftaran di website ALGHANIM (Tab Kemitraan) atau kirim data via WhatsApp.', 18, currentY + 6);
  doc.text('2. Tim Divisi Kemitraan akan melakukan verifikasi identitas & perjanjian kerjasama (MOU).', 18, currentY + 12);
  doc.text('3. Anda menerima Starter Pack Marketing Kit & Link Dashboard untuk mulai mensyiarkan paket.', 18, currentY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('Hotline Kemitraan: 0813-1670-218 • Kantor Garut: Jl. Sudirman Copong, Sukamentri', 18, currentY + 25);

  // Footer
  currentY += 36;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, currentY, pageWidth - 14, currentY);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Dokumen Panduan Kemitraan Resmi • PT. Al-Ghanimah Berkah Bersama (ALGHANIM Islamic Tour).', 14, currentY + 5);
  doc.text(`Tautan Peta Kantor: share.google/fsqwRYJHLHFaiESVm`, 14, currentY + 9);

  const cleanName = programTitle.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Panduan_Kemitraan_ALGHANIM_${cleanName}.pdf`);
};

/**
 * Generates the complete Comprehensive Marketing Kit PDF
 */
export const generateFullMarketingKitPDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Header Banner
  doc.setFillColor(166, 124, 82);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('MARKETING KIT & PANDUAN SYIAR BAITULLAH', 14, 13);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('ALGHANIM ISLAMIC TOUR • PPIU NO. 1030 THN. 2019 • INSTAGRAM: @ALGHANIMISLAMICTOUR', 14, 20);

  let y = 36;

  // Overview Box
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(14, y, pageWidth - 28, 32, 2, 2, 'F');
  doc.setDrawColor(166, 124, 82);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, y, pageWidth - 28, 32, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text('Buku Panduan Syiar, Standar Pelayanan, & Materi Promosi', 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const textIntro = 'Buku saku ini memuat seluruh materi penting untuk mempermudah mitra menyampaikan informasi paket Umroh & Haji ALGHANIM kepada calon jamaah secara profesional, amanah, dan terpercaya sesuai bimbingan Sunnah.';
  doc.text(doc.splitTextToSize(textIntro, pageWidth - 40), 20, y + 15);

  // 1. Keunggulan Sacred Luxury
  y += 38;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(166, 124, 82);
  doc.text('1. KEUNGGULAN UTAMA PRODUK UMROH ALGHANIM (POINT OF SALES)', 14, y);

  y += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, y, pageWidth - 28, 44, 2, 2, 'FD');

  const usps = [
    'Legalitas Aman: Izin Resmi PPIU No. 1030 Thn. 2019 terdaftar di SISKOPATUH Kemenag RI.',
    'Penerbangan Direct: Tanpa transit panjang menggunakan Saudia Airlines / Garuda Indonesia.',
    'Hotel Ring 1: Jarak sangat dekat ke Masjidil Haram (Makkah) & Masjid Nabawi (Madinah).',
    'Transparansi Pasca DP: Jamaah dapat memantau status visa, tiket, dan paspor via Portal Digital.',
    'Bimbingan Sesuai Sunnah: Muthawwif berkompeten lulusan universitas Islam di Madinah/Makkah.'
  ];

  let uspY = y + 7;
  usps.forEach((usp, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(166, 124, 82);
    doc.text(`${i + 1}.`, 18, uspY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(usp, 24, uspY);
    uspY += 7;
  });

  // 2. Daftar Aset Promosi
  y += 50;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(166, 124, 82);
  doc.text('2. ASET PROMOSI YANG DAPAT DIAKSES MITRA', 14, y);

  y += 4;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(14, y, pageWidth - 28, 40, 2, 2, 'FD');

  const assets = [
    ['Spanduk & Banner', 'Desain file cetak ukuran 3x1m dan X-Banner display kantor perwakilan.'],
    ['Flyer & Brosur PDF', 'Brosur paket Umroh Reguler, VIP, dan Haji Plus terupdate setiap musim.'],
    ['Konten WA & Medsos', 'Template foto/video testimoni jamaah dan copywriting siap broadcast.'],
    ['Formulir Registrasi', 'Draft formulir pendaftaran fisik dan link registrasi online terintegrasi.']
  ];

  let assetY = y + 7;
  assets.forEach(([title, desc]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(26, 26, 26);
    doc.text(`• ${title}`, 18, assetY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.text(`:  ${desc}`, 55, assetY, { maxWidth: pageWidth - 72 });
    assetY += 7;
  });

  // 3. Kontak Support & Kantor Garut
  y += 46;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(166, 124, 82);
  doc.text('PUSAT BANTUAN & PENDAMPINGAN MITRA CABANG GARUT', 20, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  doc.text('Alamat Kantor: Jl. Sudirman Copong Garut, Sukamentri, Garut 44116', 20, y + 14);
  doc.text('WhatsApp Mitra: 0813-1670-218 • Instagram: @alghanimislamictour', 20, y + 20);
  doc.setFont('helvetica', 'bold');
  doc.text('Google Maps: share.google/fsqwRYJHLHFaiESVm', 20, y + 26);

  // Footer
  y += 36;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, y, pageWidth - 14, y);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(`Dokumen Marketing Kit Resmi ALGHANIM • Diterbitkan pada ${today}`, 14, y + 5);

  doc.save('Marketing_Kit_Lengkap_ALGHANIM_Islamic_Tour.pdf');
};

export interface BadalUmrohPDFData {
  deceasedName: string;
  gender: 'bin' | 'binti';
  parentOrWali?: string;
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  address?: string;
}

/**
 * Generates an official Receipt & Covenant Document for Badal Umroh (Tanda Terima & Akad Badal Umroh)
 */
export const generateBadalUmrohReceiptPDF = (data: BadalUmrohPDFData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const refCode = `BADAL/AG-${Date.now().toString().slice(-6)}/${new Date().getFullYear()}`;

  // Top Header Accent Bar
  doc.setFillColor(166, 124, 82);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Header Title & Branding
  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('ALGHANIM ISLAMIC TOUR', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('PROGRAM BADAL UMROH AMANAH & SYAR\'I', 14, 23);

  // Legalities Info
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('PT. Al-Ghanimah Berkah Bersama • PPIU No. 1030 Thn. 2019 Kemenag RI (Akreditasi A)', 14, 28);
  doc.text('Pusat Layanan Garut: Jl. Sudirman Copong, Sukamentri • WA: 0813-1670-218', 14, 32);

  // Right Header Meta Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(pageWidth - 68, 12, 54, 22, 2, 2, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7.5);
  doc.text('No. Akad Registrasi:', pageWidth - 65, 17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text(refCode, pageWidth - 65, 22);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Tanggal: ${today}`, pageWidth - 65, 27);
  doc.text('Status: Terdaftar Resmi', pageWidth - 65, 31);

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(14, 37, pageWidth - 14, 37);

  // Banner Title
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, 42, pageWidth - 28, 14, 2, 2, 'F');
  doc.setDrawColor(166, 124, 82);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, 42, pageWidth - 28, 14, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text('TANDA TERIMA & RINGKASAN AKAD BADAL UMROH', 18, 51);

  // Section 1: Data Jiwa yang Dibadalkan
  let currentY = 64;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('1. DATA JIWA YANG DIBADALKAN (ALMARHUM / SAKIT BERAT)', 14, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(225, 225, 225);
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, 'FD');

  const fullNameWithBin = `${data.deceasedName} ${data.gender === 'bin' ? 'Bin' : 'Binti'} ${data.parentOrWali || '-'}`;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Nama Lengkap', 18, currentY + 7);
  doc.text(':', 55, currentY + 7);
  doc.setTextColor(26, 26, 26);
  doc.text(fullNameWithBin, 58, currentY + 7, { maxWidth: pageWidth - 76 });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Status Badal', 18, currentY + 14);
  doc.text(':', 55, currentY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('1 Jiwa Khusus (1 Muthawwif Mukim Makkah untuk 1 Orang)', 58, currentY + 14, { maxWidth: pageWidth - 76 });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Biaya Paket', 18, currentY + 21);
  doc.text(':', 55, currentY + 21);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('Rp 2.500.000 (Dua Juta Lima Ratus Ribu Rupiah)', 58, currentY + 21);

  // Section 2: Data Pemesan / Wali Keluarga
  currentY += 34;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('2. DATA PEMESAN / WALI KELUARGA', 14, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(225, 225, 225);
  doc.roundedRect(14, currentY, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);

  doc.text('Nama Pemesan', 18, currentY + 7);
  doc.text(':', 55, currentY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(data.senderName || '-', 58, currentY + 7, { maxWidth: pageWidth - 76 });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('No. WhatsApp', 18, currentY + 14);
  doc.text(':', 55, currentY + 14);
  doc.setTextColor(26, 26, 26);
  doc.text(data.senderPhone || '-', 58, currentY + 14);

  doc.setTextColor(80, 80, 80);
  doc.text('Email Pemesan', 18, currentY + 21);
  doc.text(':', 55, currentY + 21);
  if (data.senderEmail && data.senderEmail.trim().length > 0) {
    doc.setTextColor(26, 26, 26);
    doc.text(data.senderEmail.trim(), 58, currentY + 21, { maxWidth: pageWidth - 76 });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('- (Konfirmasi via WhatsApp)', 58, currentY + 21);
  }

  // Section 3: Hak Fasilitas & Bukti Pelaksanaan
  currentY += 38;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('3. FASILITAS & BUKTI PELAKSANAAN RESMI', 14, currentY);

  currentY += 4;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(14, currentY, pageWidth - 28, 38, 2, 2, 'FD');

  const deliverables = [
    ['Pelaksana Badal', 'Muthawwif / Mahasiswa Mukim Makkah yang amanah & berakidah Sunnah'],
    ['Dokumentasi Video', 'Video niat ihram atas nama almarhum/ah & pelaksanaan thawaf/sa\'i'],
    ['Sertifikat Resmi', 'Piagam / Sertifikat Badal Umroh berbingkai tanda tangan resmi'],
    ['Oleh-oleh Suci', 'Free Air Zam-zam 5 Liter & Souvenir diantar ke alamat keluarga'],
    ['Alamat Kirim', data.address ? data.address.slice(0, 75) : 'Alamat domisili konfirmasi via WhatsApp']
  ];

  let delivY = currentY + 6;
  deliverables.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(166, 124, 82);
    doc.text(`• ${label}`, 18, delivY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`:  ${val}`, 50, delivY, { maxWidth: pageWidth - 68 });
    delivY += 6;
  });

  // Section 4: Rekening Resmi Pembayaran & Validitas
  currentY += 46;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, currentY, (pageWidth - 28) / 2 - 2, 32, 2, 2, 'F');
  doc.roundedRect(14 + (pageWidth - 28) / 2 + 2, currentY, (pageWidth - 28) / 2 - 2, 32, 2, 2, 'F');

  // Left Box: Prosedur Pembayaran Akad
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(166, 124, 82);
  doc.text('PROSEDUR PEMBAYARAN AKAD', 18, currentY + 7);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Pembayaran akad badal sah via:', 18, currentY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('Invoice Resmi Tim Finance ALGHANIM', 18, currentY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Rekening PT tertera pada lembar invoice.', 18, currentY + 23);

  // Right Box: Kontak Konfirmasi
  const rightBoxX = 14 + (pageWidth - 28) / 2 + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(166, 124, 82);
  doc.text('HOTLINE KONFIRMASI BADAL', rightBoxX, currentY + 7);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Admin Layanan Badal Garut:', rightBoxX, currentY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('WhatsApp: 0813-1670-218', rightBoxX, currentY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Jl. Sudirman Copong, Sukamentri, Garut', rightBoxX, currentY + 23);

  // Footer
  currentY += 38;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, currentY, pageWidth - 14, currentY);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(
    'Dokumen ini merupakan tanda terima pendaftaran resmi Program Badal Umroh PT. Al-Ghanimah Berkah Bersama.',
    14,
    currentY + 5
  );
  doc.text(
    'Kirimkan bukti pendaftaran ini via WhatsApp 0813-1670-218 untuk penjadwalan dan konfirmasi muthawwif pelaksana.',
    14,
    currentY + 9
  );

  const cleanName = (data.deceasedName || 'Badal').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Tanda_Terima_Badal_Umroh_ALGHANIM_${cleanName}.pdf`);
};

/**
 * Generates an official "Lembar Tanda Terima Registrasi & Bukti NIJ Jamaah (PDF)"
 * Simple, clean, and contains only confirmed registration data.
 */
export const generateJamaahRegistrationSlipPDF = (jamaah: JamaahProgressItem) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Top Luxury Accent Bar
  doc.setFillColor(166, 124, 82); // #A67C52
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Letterhead Title & Branding
  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PT. AL-GHANIMAH BERKAH BERSAMA', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('ALGHANIM ISLAMIC TOUR & TRAVEL • CABANG GARUT', 14, 20);

  // Legalities Info
  doc.setTextColor(90, 90, 90);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Izin PPIU Kemenag RI No. 1030 Tahun 2019 • Akreditasi "A"', 14, 24.5);
  doc.text('Kantor Operasional: Jl. Sudirman Copong, Sukamentri, Garut • Hotline WA: 0813-1670-218', 14, 28.5);

  // Right Header Meta Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(pageWidth - 70, 10, 56, 20, 2, 2, 'F');
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(7);
  doc.text('No. Tanda Terima:', pageWidth - 67, 14.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.setFontSize(8.5);
  doc.text(`REG/${jamaah.nij}`, pageWidth - 67, 19.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(7);
  doc.text(`Tanggal: ${today}`, pageWidth - 67, 24.5);
  doc.text('Status: Terdaftar di Cloud', pageWidth - 67, 28.5);

  // Divider line
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.4);
  doc.line(14, 32, pageWidth - 14, 32);

  // Banner: LEMBAR TANDA TERIMA REGISTRASI & BUKTI NIJ JAMAAH
  doc.setFillColor(26, 26, 26);
  doc.roundedRect(14, 35, pageWidth - 28, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('TANDA TERIMA REGISTRASI & BUKTI NOMOR INDUK JAMAAH (NIJ)', pageWidth / 2, 42.5, { align: 'center' });

  // HIGHLIGHT BOX: NOMOR INDUK JAMAAH (NIJ) & PETUNJUK TRACKING
  let currentY = 50;
  doc.setFillColor(250, 246, 240); // Soft cream gold
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'F');
  doc.setDrawColor(166, 124, 82);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'S');

  doc.setTextColor(166, 124, 82);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('NOMOR INDUK JAMAAH (NIJ) RESMI:', 20, currentY + 6.5);

  doc.setFontSize(14);
  doc.setTextColor(26, 26, 26);
  doc.text(jamaah.nij, 20, currentY + 14);

  // Payment badge on the right
  const badgeColor = jamaah.paymentStatus === 'Lunas' ? [20, 140, 60] : [190, 110, 20];
  doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  doc.roundedRect(pageWidth - 75, currentY + 4, 55, 7, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`STATUS: ${jamaah.paymentStatus.toUpperCase()}`, pageWidth - 47.5, currentY + 8.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Gunakan nomor NIJ ini untuk memantau progres ibadah Anda pada menu Portal Jamaah di website.', 20, currentY + 19);

  // SECTION 1: DATA IDENTITAS & PENDAFTARAN JAMAAH
  currentY += 26;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('1. DATA PENDAFTARAN JAMAAH', 14, currentY);

  currentY += 3;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  // Increase box height from 38 to 46 mm for generous breathing room
  doc.roundedRect(14, currentY, pageWidth - 28, 46, 2, 2, 'FD');

  const halfWidth = (pageWidth - 28) / 2;
  doc.setFontSize(8);
  
  // Left Column (Identitas Jamaah)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Nama Lengkap (KTP)', 18, currentY + 6.5);
  doc.text(':', 58, currentY + 6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(jamaah.fullName, 61, currentY + 6.5, { maxWidth: halfWidth - 50 });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Nomor NIK / KTP', 18, currentY + 13);
  doc.text(':', 58, currentY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(26, 26, 26);
  doc.text(jamaah.ktp || '-', 61, currentY + 13);

  doc.setTextColor(100, 100, 100);
  doc.text('Nomor WhatsApp / HP', 18, currentY + 19.5);
  doc.text(':', 58, currentY + 19.5);
  doc.setTextColor(26, 26, 26);
  doc.text(jamaah.phone || '-', 61, currentY + 19.5);

  doc.setTextColor(100, 100, 100);
  doc.text('Tanggal Lahir', 18, currentY + 26);
  doc.text(':', 58, currentY + 26);
  doc.setTextColor(26, 26, 26);
  doc.text(jamaah.birthDate || '-', 61, currentY + 26);

  // Right Column (Paket & Keberangkatan)
  const col2X = 14 + halfWidth + 4;
  doc.setTextColor(100, 100, 100);
  doc.text('Paket Yang Dipilih', col2X, currentY + 6.5);
  doc.text(':', col2X + 32, currentY + 6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(jamaah.packageName, col2X + 35, currentY + 6.5, { maxWidth: halfWidth - 40 });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Rencana Keberangkatan', col2X, currentY + 13);
  doc.text(':', col2X + 32, currentY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text(jamaah.departureDate, col2X + 35, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Status Tahapan', col2X, currentY + 19.5);
  doc.text(':', col2X + 32, currentY + 19.5);
  doc.setTextColor(26, 26, 26);
  doc.text(`Tahap ${jamaah.progressStep || 1} dari 5: ${jamaah.passportStatus || 'Registrasi'}`, col2X + 35, currentY + 19.5, { maxWidth: halfWidth - 40 });

  doc.setTextColor(100, 100, 100);
  doc.text('Kantor Pelayanan', col2X, currentY + 26);
  doc.text(':', col2X + 32, currentY + 26);
  doc.setTextColor(26, 26, 26);
  doc.text('Cabang Garut', col2X + 35, currentY + 26);

  // Subtle divider between 2-column info and full-width notes
  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.3);
  doc.line(18, currentY + 31.5, pageWidth - 18, currentY + 31.5);

  // Full-width Catatan Registrasi Row (prevents text overflow and line breakage outside box)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(7.5);
  doc.text('Catatan Registrasi', 18, currentY + 37.5);
  doc.text(':', 58, currentY + 37.5);
  doc.setTextColor(40, 40, 40);
  doc.text(jamaah.notes || 'Pendaftaran resmi via Kantor Al-Ghanim Cabang Garut.', 61, currentY + 37.5, {
    maxWidth: pageWidth - 82
  });

  // SECTION 2: RINCIAN PEMBAYARAN & FINANSIAL
  currentY += 50;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(166, 124, 82);
  doc.text('2. TANDA TERIMA PEMBAYARAN / BOOKING SEAT', 14, currentY);

  currentY += 3;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'FD');

  // Box Split 3 items
  const colW = (pageWidth - 28) / 3;
  
  // Box 1: Total
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Total Biaya Paket:', 18, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(26, 26, 26);
  doc.text(jamaah.totalAmount || 'Rp 31.500.000', 18, currentY + 13.5);

  // Box 2: DP Masuk
  const col2FinX = 14 + colW + 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Jumlah DP Masuk (Terbayar):', col2FinX, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(20, 140, 60);
  doc.text(jamaah.dpAmount || 'Rp 10.000.000', col2FinX, currentY + 13.5);

  // Box 3: Sisa Pelunasan
  const col3FinX = 14 + (colW * 2) + 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Sisa Pelunasan:', col3FinX, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(166, 124, 82);
  doc.text(jamaah.remainingAmount || 'Rp 21.500.000', col3FinX, currentY + 13.5);

  // Rekening Transfer Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('*Pembayaran cicilan dan pelunasan hanya ditransfer via Invoice Resmi Finance ALGHANIM.', 18, currentY + 20);

  // SECTION 3: CARA TRACKING PROGRES MANDIRI DI WEBSITE
  currentY += 28;
  doc.setFillColor(248, 248, 248);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(166, 124, 82);
  doc.text('PETUNJUK TRANSPARANSI & CARA CEK PROGRES IBADAH (LIVE TRACKING):', 18, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text('1. Buka website resmi ALGHANIM di browser HP atau Komputer Anda.', 18, currentY + 11.5);
  doc.text(`2. Pilih menu "Portal Jamaah", lalu ketikkan Nomor NIJ Anda (${jamaah.nij}) atau Nomor WhatsApp Anda.`, 18, currentY + 16);

  // Footer Disclaimer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text('Dokumen ini dicetak secara sah dan otomatis oleh Sistem Informasi Operasional PT. Al-Ghanimah Berkah Bersama.', pageWidth / 2, 285, { align: 'center' });

  const cleanName = (jamaah.fullName || 'Jamaah').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Lembar_Registrasi_NIJ_${jamaah.nij}_${cleanName}.pdf`);
};

/**
 * Generates an official Buku Panduan & Doa Umroh PDF
 */
export const generateBukuPanduanDoaPDF = (jamaahName?: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header accent
  doc.setFillColor(166, 124, 82);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Title
  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ALGHANIM ISLAMIC TOUR', 14, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Buku Saku Panduan Manasik & Doa-Doa Pilihan Ibadah Umroh', 14, 24);

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 28, pageWidth - 14, 28);

  // Box Jamaah
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(14, 32, pageWidth - 28, 16, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(166, 124, 82);
  doc.text('BUKU PANDUAN RESMI CALON JAMAAH UMROH', 18, 38);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Diterbitkan Khusus Untuk: ${jamaahName || 'Jamaah Al-Ghanim'} | Edisi Manasik & Tanah Suci 1448 H`, 18, 44);

  let curY = 54;
  const sections = [
    {
      title: '1. Niat Ihram Umroh di Miqat',
      arab: 'Labbaikallohumma \'umratan (لَبَّيْكَ اللَّهُمَّ عُمْرَةً)',
      arti: '"Aku sambut panggilan-Mu ya Allah untuk berumroh."'
    },
    {
      title: '2. Bacaan Talbiyah',
      arab: 'Labbaikallohumma labbaik, labbaika laa syariika laka labbaik...',
      arti: '"Aku datang memenuhi panggilan-Mu ya Allah, tiada sekutu bagi-Mu..."'
    },
    {
      title: '3. Doa Saat Memulai Thawaf (Di Garis Hajar Aswad)',
      arab: 'Bismillahi Allahu Akbar (بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ)',
      arti: '"Dengan menyebut nama Allah, dan Allah Maha Besar."'
    },
    {
      title: '4. Doa Antara Rukun Yamani dan Hajar Aswad',
      arab: 'Robbanaa aatinaa fid dunyaa hasanah wa fil aakhiroti hasanah wa qinaa \'adzaaban naar',
      arti: '"Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa api neraka."'
    },
    {
      title: '5. Doa di Bukit Shafa dan Marwah (Saat Sa\'i)',
      arab: 'Innash-shofaa wal marwata min sya\'aa-irillah...',
      arti: '"Sesungguhnya Shafa dan Marwah merupakan sebagian syiar (agama) Allah..."'
    }
  ];

  sections.forEach((sec) => {
    const splitArab = doc.splitTextToSize(sec.arab, pageWidth - 32);
    const splitArti = doc.splitTextToSize(sec.arti, pageWidth - 32);
    const secHeight = 5 + (splitArab.length * 4.2) + 2 + (splitArti.length * 3.8) + 6;

    if (curY + secHeight > 275) {
      doc.addPage();
      curY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(26, 26, 26);
    doc.text(sec.title, 14, curY, { maxWidth: pageWidth - 28 });
    curY += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(166, 124, 82);
    doc.text(splitArab, 18, curY);
    curY += (splitArab.length * 4.2) + 1;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.text(splitArti, 18, curY);
    curY += (splitArti.length * 3.8) + 5;
  });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text('PT. Al-Ghanimah Berkah Bersama | www.alghanimtour.com | CS Garut: 0813-1670-218', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Buku_Panduan_Doa_Umroh_ALGHANIM.pdf`);
};

/**
 * Generates an official Itinerary Perjalanan Umroh PDF
 */
export const generateItineraryUmrohPDF = (jamaah?: JamaahProgressItem) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header accent
  doc.setFillColor(166, 124, 82);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Title
  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ALGHANIM ISLAMIC TOUR', 14, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  doc.text(`Official Travel Itinerary | ${jamaah?.packageName || 'Paket Umroh Reguler 9 Hari'}`, 14, 24, { maxWidth: pageWidth - 28 });

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 28, pageWidth - 14, 28);

  // Meta box
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(14, 32, pageWidth - 28, 18, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(166, 124, 82);
  doc.text(`JAMAAH: ${jamaah?.fullName || 'Bpk/Ibu Jamaah'} (NIJ: ${jamaah?.nij || 'AG-2026-001'})`, 18, 38, { maxWidth: pageWidth - 36 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`Rencana Keberangkatan: ${jamaah?.departureDate || '24 April 2027'} | Maskapai: ${jamaah?.airline || 'Saudia Airlines (SV-819 Direct)'}`, 18, 44, { maxWidth: pageWidth - 36 });

  let curY = 56;
  const days = [
    { day: 'Hari 01', route: 'Jakarta - Jeddah - Madinah', desc: 'Kumpul Bandara Soekarno-Hatta T3, briefing pelepasan, penerbangan menuju Jeddah/Madinah, check-in hotel Madinah.' },
    { day: 'Hari 02', route: 'Madinah Al-Munawwarah', desc: 'Ziarah ke Raudhah Syarifah, Makam Rasulullah SAW, Abu Bakar RA, dan Umar RA. Tausiyah adab Madinah.' },
    { day: 'Hari 03', route: 'Ziarah Kota Madinah', desc: 'Ziarah Masjid Quba, Kebun Kurma, Jabal Uhud, Masjid Qiblatain, dan Khandaq bersama Muthawwif.' },
    { day: 'Hari 04', route: 'Madinah - Makkah Al-Mukarramah', desc: 'Persiapan ihram di hotel, menuju Miqat Masjid Bir Ali untuk niat umroh, perjalanan Kereta Cepat Haramain menuju Makkah. Pelaksanaan Umroh ke-1.' },
    { day: 'Hari 05', route: 'Makkah Al-Mukarramah', desc: 'Memperbanyak ibadah wajib dan sunnah di Masjidil Haram, kajian tematik ibadah bersama pembimbing.' },
    { day: 'Hari 06', route: 'Ziarah Kota Makkah', desc: 'Ziarah Padang Arafah, Jabal Rahmah, Muzdalifah, Mina, Jabal Tsur, dan Jabal Nur (Gua Hira).' },
    { day: 'Hari 07', route: 'Makkah Al-Mukarramah (City Tour Thaif)', desc: 'Ziarah kota sejuk Thaif, Masjid Abdullah bin Abbas, Teleferic cable car, pabrik minyak wangi mawar.' },
    { day: 'Hari 08', route: 'Thawaf Wada\' - Jeddah - Jakarta', desc: 'Pelaksanaan Thawaf Wada\', check-out hotel Makkah, Corniche City Tour Jeddah, transfer ke Bandara Jeddah.' },
    { day: 'Hari 09', route: 'Tiba di Bandara Jakarta (CGK)', desc: 'InsyaAllah tiba di Indonesia dengan selamat, penyerahan air Zamzam 5 liter, kembali ke Garut/domisili.' }
  ];

  days.forEach((d) => {
    const wrapped = doc.splitTextToSize(d.desc, pageWidth - 32);
    const dayHeight = 5 + (wrapped.length * 4) + 3;

    if (curY + dayHeight > 275) {
      doc.addPage();
      curY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(166, 124, 82);
    doc.text(`${d.day}: ${d.route}`, 14, curY, { maxWidth: pageWidth - 28 });
    curY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    doc.text(wrapped, 18, curY);
    curY += (wrapped.length * 4) + 3;
  });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.text('PT. Al-Ghanimah Berkah Bersama | Dokumen Resmi Perjalanan Umroh | Hubungi Tim Muthawwif: 0813-1670-218', pageWidth / 2, 285, { align: 'center' });

  doc.save(`Itinerary_Perjalanan_Umroh_ALGHANIM.pdf`);
};


