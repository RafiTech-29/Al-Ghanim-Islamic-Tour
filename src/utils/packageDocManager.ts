import { jsPDF } from 'jspdf';
import { PackageScheduleItem } from '../types';

/**
 * Checks if a package has a custom Flyer uploaded or linked by the Admin
 */
export function isCustomFlyerAvailable(pkg: PackageScheduleItem | null | undefined): boolean {
  if (!pkg) return false;
  return Boolean(pkg.flyerUrl && pkg.flyerUrl.trim().length > 5);
}

/**
 * Checks if a package has a custom Itinerary PDF uploaded or linked by the Admin
 */
export function isCustomItineraryAvailable(pkg: PackageScheduleItem | null | undefined): boolean {
  if (!pkg) return false;
  return Boolean(pkg.itineraryPdfUrl && pkg.itineraryPdfUrl.trim().length > 5);
}

/**
 * Downloads or opens a custom file or URL
 */
function downloadOrOpenFile(url: string, filename: string): boolean {
  try {
    const trimmed = url.trim();
    if (trimmed.startsWith('data:')) {
      // Data URL (Base64 file)
      const link = document.createElement('a');
      link.href = trimmed;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } else {
      // External Web URL (Canva, Google Drive, Cloud Storage)
      const win = window.open(trimmed, '_blank', 'noopener,noreferrer');
      if (!win) {
        // Fallback if popup blocker is active
        const link = document.createElement('a');
        link.href = trimmed;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      return true;
    }
  } catch (err) {
    console.error('Failed to open or download file:', err);
    return false;
  }
}

/**
 * Handles Itinerary download or open for any package:
 * 1. Prioritizes the Admin's custom uploaded/linked PDF
 * 2. Seamlessly falls back to auto-generating an official Alghanim Itinerary PDF
 */
export async function downloadOrOpenPackageItinerary(
  pkg: PackageScheduleItem,
  onNotice?: (msg: string) => void
): Promise<void> {
  const safeTitle = pkg.title.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const filename = `Itinerary_${safeTitle}_AlGhanim.pdf`;

  // 1. If Admin has uploaded or linked a custom Itinerary PDF
  if (isCustomItineraryAvailable(pkg)) {
    if (onNotice) onNotice(`Membuka Dokumen Itinerary Resmi ${pkg.title}...`);
    const success = downloadOrOpenFile(pkg.itineraryPdfUrl!, filename);
    if (success) return;
  }

  // 2. Fallback: Auto-generate an official PDF Itinerary via jsPDF
  if (onNotice) onNotice(`Menyiapkan Dokumen PDF Itinerary ${pkg.title}...`);

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const goldColor = [166, 124, 82]; // #A67C52
    const darkColor = [26, 26, 26];

    // Header Banner
    doc.setFillColor(248, 246, 240);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setFontSize(14);
    doc.text('AL-GHANIM ISLAMIC TOUR', 14, 15);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('PT. AL-GHANIMAH BERKAH BERSAMA | IZIN RESMI PPIU KEMENAG RI NO. 1030 TAHUN 2019', 14, 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    const splitTitle = doc.splitTextToSize(`ITINERARY: ${pkg.title.toUpperCase()}`, 182);
    doc.text(splitTitle, 14, 27);

    const titleOffset = splitTitle.length > 1 ? (splitTitle.length - 1) * 4 : 0;
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 110);
    doc.text(`Keberangkatan: ${pkg.departureDate} | Durasi: ${pkg.duration} | Maskapai: ${pkg.airline}`, 14, 33 + titleOffset, { maxWidth: 182 });

    // Flight Schedule Box
    let currentY = 44 + titleOffset;
    if (pkg.flightSchedules && pkg.flightSchedules.length > 0) {
      doc.setFillColor(242, 244, 248);
      doc.roundedRect(14, currentY, 182, 22, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('JADWAL PENERBANGAN (FLIGHT SCHEDULE):', 18, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      pkg.flightSchedules.forEach((flight, idx) => {
        const lineY = currentY + 11 + (idx * 5);
        if (lineY <= currentY + 19) {
          const timeStr = flight.time || (flight.departureTime ? `${flight.departureTime} - ${flight.arrivalTime || ''}` : '');
          doc.text(`• ${flight.route}: ${flight.flightNo} ${timeStr ? `(${timeStr})` : ''}`, 18, lineY);
        }
      });
      currentY += 26;
    }

    // Hotel Box
    doc.setFillColor(250, 249, 246);
    doc.roundedRect(14, currentY, 182, 22, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('AKOMODASI HOTEL:', 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`• Makkah: ${pkg.hotelMakkah}`, 18, currentY + 12);
    doc.text(`• Madinah: ${pkg.hotelMadinah}`, 18, currentY + 17);
    currentY += 27;

    // Day-by-Day Itinerary Rundown
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('RUNDOWN PERJALANAN IBADAH:', 14, currentY);
    currentY += 6;

    const days = (pkg.itineraryDays && pkg.itineraryDays.length > 0) ? pkg.itineraryDays : [
      { day: 1, title: 'Keberangkatan Menuju Tanah Suci', desc: 'Berkumpul di Bandara Soekarno Hatta 4 jam sebelum terbang. Penerbangan menuju Madinah / Jeddah.' },
      { day: 2, title: 'Tiba di Madinah Al-Munawwarah', desc: 'Check-in hotel, istirahat, dan memperbanyak ibadah di Masjid Nabawi serta ziarah Raudhah as-Syarifah.' },
      { day: 3, title: 'Ziarah Kota Madinah', desc: 'Ziarah Masjid Quba, Kebun Kurma, Jabal Uhud, dan Masjid Qiblatain bersama Muthawwif berpengalaman.' },
      { day: 4, title: 'Ibadah & Manasik Pemantapan', desc: 'Memperbanyak ibadah di Masjid Nabawi. Pengarahan manasik umroh dan persiapan keberangkatan ke Makkah.' },
      { day: 5, title: 'Perjalanan ke Makkah & Umroh Pertama', desc: 'Mengambil Miqat di Bir Ali, niat ihram. Perjalanan ke Makkah menggunakan Kereta Cepat Haramain / Bus Executive. Melaksanakan Thawaf, Sa\'i, dan Tahallul.' },
      { day: 6, title: 'Ibadah Sunnah di Masjidil Haram', desc: 'Memperbanyak thawaf sunnah, tilawah Al-Qur\'an, dan ibadah mandiri di depan Ka\'bah.' },
      { day: 7, title: 'Ziarah Kota Makkah (City Tour)', desc: 'Ziarah Jabal Tsur, Padang Arafah, Jabal Rahmah, Muzdalifah, dan Mina. Mengambil miqat di Ji\'ranah untuk umroh kedua (opsional).' },
      { day: 8, title: 'Thawaf Wada\' & Persiapan Pulang', desc: 'Melaksanakan Thawaf Wada\' (perpisahan). Check-out hotel menuju Bandara Internasional King Abdulaziz Jeddah.' },
      { day: 9, title: 'Tiba Kembali di Indonesia', desc: 'Tiba di Bandara Soekarno-Hatta Jakarta. Selesai program ibadah dengan predikat Umroh Maqbullah wa Mabrurah, insya Allah.' }
    ];

    days.forEach((item) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 18;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text(`HARI ${item.day}: ${item.title.toUpperCase()}`, 14, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(70, 70, 70);
      const splitDesc = doc.splitTextToSize(item.desc, 182);
      doc.text(splitDesc, 14, currentY + 4);
      currentY += 6 + (splitDesc.length * 3.5);
    });

    // Footer Note
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text('*Jadwal dan rute sewaktu-waktu dapat disesuaikan dengan kondisi operasional di Tanah Suci tanpa mengurangi esensi ibadah.', 14, 287, { maxWidth: 182 });

    doc.save(filename);
  } catch (e) {
    console.error('Failed to generate Itinerary PDF:', e);
    window.print();
  }
}

/**
 * Handles Flyer download or open for any package:
 * 1. Prioritizes the Admin's custom uploaded/linked Flyer (PDF or high-res image)
 * 2. Seamlessly falls back to auto-generating an official Alghanim Flyer PDF
 */
export async function downloadOrOpenPackageFlyer(
  pkg: PackageScheduleItem,
  onNotice?: (msg: string) => void
): Promise<void> {
  const safeTitle = pkg.title.replace(/[^a-zA-Z0-9_\-]/g, '_');

  // 1. If Admin has uploaded or linked a custom Flyer
  if (isCustomFlyerAvailable(pkg)) {
    const url = pkg.flyerUrl!.trim();
    const isPdf = url.startsWith('data:application/pdf') || url.toLowerCase().includes('.pdf');
    const filename = `Flyer_${safeTitle}_AlGhanim.${isPdf ? 'pdf' : 'png'}`;

    if (onNotice) onNotice(`Membuka Brosur Flyer Resmi ${pkg.title}...`);
    const success = downloadOrOpenFile(url, filename);
    if (success) return;
  }

  // 2. Fallback: Auto-generate an official PDF Flyer via jsPDF
  if (onNotice) onNotice(`Menyiapkan Dokumen PDF Flyer Brosur ${pkg.title}...`);

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const filename = `Flyer_${safeTitle}_AlGhanim.pdf`;
    const goldColor = [197, 160, 89]; // #C5A059
    const darkColor = [43, 27, 18];  // Deep bronze brown

    // Header Banner
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 0, 210, 36, 'F');

    // Golden Line
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.rect(0, 36, 210, 2.5, 'F');

    // Company Name & Legalitas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('ALGHANIM ISLAMIC TOUR', 14, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(224, 184, 128);
    doc.text('IZIN PPIU KEMENAG RI NO. 1030 TAHUN 2019 • AKREDITASI A', 14, 22);
    doc.setTextColor(220, 220, 220);
    doc.text('Jl. Sudirman Copong, Sukamentri, Garut & Menara Kadin Lt. 24 Jakarta Selatan', 14, 28);

    // Flyer Title Box
    const splitTitle = doc.splitTextToSize(pkg.title.toUpperCase(), 174);
    const titleExtra = Math.min((splitTitle.length - 1) * 4, 8);
    const titleBoxH = 26 + titleExtra;
    
    doc.setFillColor(248, 246, 242);
    doc.roundedRect(14, 42, 182, titleBoxH, 2.5, 2.5, 'F');
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(14, 42, 182, titleBoxH, 2.5, 2.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(splitTitle, 105, 50, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(`Jadwal: ${pkg.departureDate}  |  Durasi: ${pkg.duration}  |  Penerbangan: ${pkg.airline}`, 105, 58 + titleExtra, { align: 'center' });

    // Pricing Section
    let currentY = 44 + titleBoxH + 4;
    doc.setFillColor(254, 252, 248);
    doc.roundedRect(14, currentY, 182, 34, 2.5, 2.5, 'F');
    doc.setDrawColor(220, 210, 190);
    doc.roundedRect(14, currentY, 182, 34, 2.5, 2.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('PILIHAN BIAYA & TIPE KAMAR (ALL-IN):', 20, currentY + 8);

    const quadPrice = pkg.quadPrice || pkg.priceQuad || pkg.price;
    const triplePrice = pkg.triplePrice || pkg.priceTriple || '-';
    const doublePrice = pkg.doublePrice || pkg.priceDouble || '-';

    // 3 Pricing Columns
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(18, currentY + 12, 54, 18, 2, 2, 'F');
    doc.roundedRect(78, currentY + 12, 54, 18, 2, 2, 'F');
    doc.roundedRect(138, currentY + 12, 54, 18, 2, 2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text('QUAD (Sekamar Ber-4)', 45, currentY + 17, { align: 'center' });
    doc.text('TRIPLE (Sekamar Ber-3)', 105, currentY + 17, { align: 'center' });
    doc.text('DOUBLE (Sekamar Ber-2)', 165, currentY + 17, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text(quadPrice, 45, currentY + 25, { align: 'center' });
    doc.text(triplePrice, 105, currentY + 25, { align: 'center' });
    doc.text(doublePrice, 165, currentY + 25, { align: 'center' });

    // Hotel & Flight Specifications
    currentY += 40;
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(14, currentY, 182, 30, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('FASILITAS HOTEL & TRANSPORTASI:', 20, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    doc.text(`• Hotel Makkah  : ${pkg.hotelMakkah}`, 20, currentY + 14);
    doc.text(`• Hotel Madinah : ${pkg.hotelMadinah}`, 20, currentY + 20);
    doc.text(`• Maskapai PP    : ${pkg.airline}`, 20, currentY + 26);

    // Keunggulan & Fasilitas Utama
    currentY += 36;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('KEUNGGULAN & FASILITAS TERMASUK:', 14, currentY);

    const highlights = (pkg.programHighlights && pkg.programHighlights.length > 0)
      ? pkg.programHighlights
      : [
          'Tiket Pesawat Internasional PP Maskapai Ternama',
          'Visa Umroh Resmi Kemenag RI & Asuransi Perjalanan',
          'Akomodasi Hotel Nyaman Dekat Masjidil Haram & Nabawi',
          'Makan 3x Sehari Fullboard Menu Masakan Indonesia',
          'Bimbingan Manasik Umroh Lengkap Sesuai Sunnah',
          'Free Air Zam-zam 5 Liter Resmi Berbarcode & Perlengkapan Koper Eksklusif'
        ];

    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);

    highlights.slice(0, 7).forEach((highlight) => {
      doc.text(`✓ ${highlight}`, 18, currentY + 3);
      currentY += 5.5;
    });

    // Inclusions & Exclusions Summary
    currentY += 4;
    doc.setFillColor(248, 250, 248);
    doc.roundedRect(14, currentY, 88, 38, 2, 2, 'F');
    doc.setFillColor(252, 248, 248);
    doc.roundedRect(108, currentY, 88, 38, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(34, 110, 50);
    doc.text('BIAYA SUDAH TERMASUK:', 18, currentY + 6);

    doc.setTextColor(180, 50, 50);
    doc.text('BIAYA TIDAK TERMASUK:', 112, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);

    const incs = ['Tiket Pesawat PP', 'Visa Umroh & Asuransi', 'Hotel Makkah & Madinah', 'Makan 3x Sehari Fullboard', 'Muthawwif & Tour Leader', 'Air Zam-zam 5L'];
    incs.forEach((item, i) => {
      doc.text(`• ${item}`, 18, currentY + 11 + (i * 4.2));
    });

    const excs = ['Pembuatan Paspor Pribadi', 'Vaksinasi Meningitis / ICV', 'Keperluan Pribadi (Laundry, Pulsa)', 'Kelebihan Bagasi Pesawat'];
    excs.forEach((item, i) => {
      doc.text(`• ${item}`, 112, currentY + 11 + (i * 4.2));
    });

    // Footer Contact & Registration Bar
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 275, 210, 22, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('KONSULTASI & PENDAFTARAN RESMI AL-GHANIM:', 14, 283);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(224, 184, 128);
    doc.text('WhatsApp: 0813-1670-218  |  Website: alghanimtour.com', 14, 289);
    doc.setTextColor(200, 200, 200);
    doc.text('Garut: Jl. Sudirman Copong • Jakarta: Menara Kadin Lt. 24', 14, 293);

    doc.save(filename);
  } catch (e) {
    console.error('Failed to generate Flyer PDF:', e);
    window.print();
  }
}
