import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocs,
  setDoc,
  deleteField
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { JamaahProgressItem, InquiryItem, PartnerRegistrationItem, PackageScheduleItem, PromoBannerItem, GalleryPhotoItem, TestimonialItem } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import { 
  INITIAL_JAMAAH_DATA, 
  INITIAL_INQUIRIES_DATA, 
  INITIAL_PARTNER_REGISTRATIONS, 
  DETAILED_SCHEDULES,
  INITIAL_PROMO_BANNERS,
  GALLERY_DATA,
  TESTIMONIALS_DATA
} from '../data/packagesData';

// Collection References
const JAMAAH_COLLECTION = 'jamaah';
const INQUIRIES_COLLECTION = 'inquiries';
const PARTNERS_COLLECTION = 'partners_registrations';
const PACKAGES_COLLECTION = 'packages';
const BANNERS_COLLECTION = 'promo_banners';
const GALLERY_COLLECTION = 'gallery';
const TESTIMONIALS_COLLECTION = 'testimonials';

let isSeedingInProgress = false;


/**
 * Utility to strip undefined fields recursively so Firestore never throws
 * "Unsupported field value: undefined" errors, while safely preserving
 * Firestore FieldValues (serverTimestamp, deleteField, etc.) and Dates.
 */
export function sanitizeFirestorePayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (!obj || typeof obj !== 'object') return obj;
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      // Check if value is a Firestore FieldValue or Timestamp or Date
      const isSpecialFirebaseType = 
        value !== null && 
        typeof value === 'object' && 
        (
          '_methodName' in value || 
          typeof (value as any).isEqual === 'function' ||
          value.constructor?.name === 'FieldValue' || 
          value.constructor?.name === 'FieldValueImpl' || 
          value.constructor?.name === 'Timestamp' ||
          'toMillis' in value ||
          'seconds' in value ||
          value instanceof Date
        );

      if (isSpecialFirebaseType) {
        result[key] = value;
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = sanitizeFirestorePayload(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Robust Timestamp Parser to Milliseconds (supports Firestore Timestamp, ISO string, ID string)
 */
export function parseTimestampToMillis(val: any): number {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  // Firestore Timestamp instance
  if (typeof val === 'object' && val !== null && 'seconds' in val) {
    return val.seconds * 1000;
  }
  // Standard parseable ISO string or Date object
  if (val instanceof Date) return val.getTime();
  const parsed = new Date(val).getTime();
  if (!isNaN(parsed) && parsed > 0) {
    return parsed;
  }
  // Custom format parsing: "DD-MM-YYYY, HH.mm" or "YYYY-MM-DD HH:mm"
  if (typeof val === 'string') {
    const dmyMatch = val.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[,\s]+(\d{1,2})[:.](\d{1,2}))?/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      const hour = dmyMatch[4] ? parseInt(dmyMatch[4], 10) : 0;
      const minute = dmyMatch[5] ? parseInt(dmyMatch[5], 10) : 0;
      const d = new Date(year, month, day, hour, minute);
      if (!isNaN(d.getTime())) return d.getTime();
    }
  }
  return 0;
}

/**
 * Format timestamp to pleasant Indonesian string (e.g. "Hari ini, 14:23 WIB", "Kemarin, 17:15", "30 Agu 2026, 14:23")
 */
export function formatDateTimeFriendly(val: any): string {
  const millis = parseTimestampToMillis(val);
  if (!millis) return typeof val === 'string' && val.trim() ? val : 'Baru saja';

  const date = new Date(millis);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

  if (isToday) {
    return `Hari ini, ${timeStr} WIB`;
  }
  if (isYesterday) {
    return `Kemarin, ${timeStr} WIB`;
  }

  const dateStr = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  return `${dateStr}, ${timeStr} WIB`;
}

/**
 * Check if activity is recent (within N hours)
 */
export function isRecentActivity(val: any, hours = 48): boolean {
  const millis = parseTimestampToMillis(val);
  if (!millis) return false;
  return Date.now() - millis < hours * 60 * 60 * 1000;
}

/**
 * Seed initial real data to Firestore if collection is empty
 */
export async function seedInitialFirestoreData() {
  if (isSeedingInProgress) return;
  isSeedingInProgress = true;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('alghanim_demo_cleared');
  }

  try {
    // 1. Seed Jamaah
    const jamaahSnap = await getDocs(collection(db, JAMAAH_COLLECTION));
    const activeJamaah = jamaahSnap.docs.filter(d => !d.data()?.isDeleted);
    if (jamaahSnap.empty || activeJamaah.length === 0) {
      for (const item of INITIAL_JAMAAH_DATA) {
        await setDoc(doc(db, JAMAAH_COLLECTION, item.id), sanitizeFirestorePayload({
          ...item,
          isDeleted: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }), { merge: true });
      }
    }

    // 2. Seed Inquiries
    const inquiriesSnap = await getDocs(collection(db, INQUIRIES_COLLECTION));
    if (inquiriesSnap.empty) {
      for (const item of INITIAL_INQUIRIES_DATA) {
        await setDoc(doc(db, INQUIRIES_COLLECTION, item.id), sanitizeFirestorePayload({
          ...item,
          createdAt: item.createdAt || new Date().toISOString()
        }));
      }
    }

    // 3. Seed Partner Registrations
    const partnersSnap = await getDocs(collection(db, PARTNERS_COLLECTION));
    if (partnersSnap.empty) {
      for (const item of INITIAL_PARTNER_REGISTRATIONS) {
        await setDoc(doc(db, PARTNERS_COLLECTION, item.id), sanitizeFirestorePayload({
          ...item,
          createdAt: item.createdAt || new Date().toISOString()
        }));
      }
    }

    // 4. Seed Packages
    const packagesSnap = await getDocs(collection(db, PACKAGES_COLLECTION));
    if (packagesSnap.empty) {
      for (const item of DETAILED_SCHEDULES) {
        await setDoc(doc(db, PACKAGES_COLLECTION, item.id), sanitizeFirestorePayload({
          ...item,
          createdAt: serverTimestamp()
        }));
      }
    }

    // 5. Seed Promo Banners
    const bannersSnap = await getDocs(collection(db, BANNERS_COLLECTION));
    if (bannersSnap.empty) {
      for (const item of INITIAL_PROMO_BANNERS) {
        await setDoc(doc(db, BANNERS_COLLECTION, item.id), sanitizeFirestorePayload({
          ...item,
          createdAt: serverTimestamp()
        }));
      }
    }

    // 6. Seed Gallery Real Documentation
    const gallerySnap = await getDocs(collection(db, GALLERY_COLLECTION));
    if (gallerySnap.empty) {
      for (const item of GALLERY_DATA) {
        await setDoc(doc(db, GALLERY_COLLECTION, item.id), sanitizeFirestorePayload({
          ...item,
          createdAt: serverTimestamp()
        }));
      }
    }

    // 7. Seed Testimonials & Rating
    const testimonialsSnap = await getDocs(collection(db, TESTIMONIALS_COLLECTION));
    if (testimonialsSnap.empty) {
      for (const item of TESTIMONIALS_DATA) {
        await setDoc(doc(db, TESTIMONIALS_COLLECTION, item.id), sanitizeFirestorePayload({
          ...item,
          status: 'approved',
          isVerified: true,
          createdTimestamp: Date.now() - Math.floor(Math.random() * 30) * 86400000,
          createdAt: serverTimestamp()
        }));
      }
    }
  } catch (error) {
    console.warn('Initial Firestore seed notice:', error);
  } finally {
    isSeedingInProgress = false;
  }
}


// ---------------- JAMAAH REALTIME SYNC ----------------

export function subscribeToJamaah(callback: (items: JamaahProgressItem[]) => void) {
  const q = query(collection(db, JAMAAH_COLLECTION));
  
  let hasInitialized = false;

  return onSnapshot(q, async (snapshot) => {
    const isDemoCleared = typeof window !== 'undefined' && localStorage.getItem('alghanim_demo_cleared') === 'true';

    if (!snapshot.empty) {
      hasInitialized = true;
      const items: JamaahProgressItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<JamaahProgressItem, 'id'>;
        if (!data.isDeleted) {
          items.push({ id: docSnap.id, ...data });
        }
      });
      // Sort newest at the top (descending timestamp)
      items.sort((a, b) => {
        const timeA = parseTimestampToMillis(a.createdAt) || (a as any).createdTimestamp || 0;
        const timeB = parseTimestampToMillis(b.createdAt) || (b as any).createdTimestamp || 0;
        return timeB - timeA;
      });
      callback(items);
    } else {
      if (!hasInitialized && !isDemoCleared) {
        hasInitialized = true;
        // Auto seed so docs exist with real IDs
        await seedInitialFirestoreData();
        callback(INITIAL_JAMAAH_DATA);
      } else {
        // If collection was cleared or emptied by user delete action
        callback([]);
      }
    }
  }, (error) => {
    console.warn('Firestore subscription error (jamaah), falling back to local state:', error);
    const isDemoCleared = typeof window !== 'undefined' && localStorage.getItem('alghanim_demo_cleared') === 'true';
    callback(isDemoCleared ? [] : INITIAL_JAMAAH_DATA);
  });
}

export async function deleteAllDemoJamaahFromFirestore() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('alghanim_demo_cleared', 'true');
  }
  try {
    const snap = await getDocs(collection(db, JAMAAH_COLLECTION));
    if (!snap.empty) {
      const deletePromises = snap.docs.map((docSnap) =>
        setDoc(doc(db, JAMAAH_COLLECTION, docSnap.id), {
          isDeleted: true,
          deletedAt: serverTimestamp()
        }, { merge: true })
      );
      await Promise.all(deletePromises);
    }
  } catch (error) {
    console.error('Error soft-deleting all jamaah from Firestore:', error);
    // Even if Firestore network call has issues, local flag is set so UI stays clean
  }
}

export async function reloadDemoJamaahToFirestore(): Promise<JamaahProgressItem[]> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('alghanim_demo_cleared');
  }
  try {
    for (const item of INITIAL_JAMAAH_DATA) {
      const docRef = doc(db, JAMAAH_COLLECTION, item.id);
      await setDoc(docRef, sanitizeFirestorePayload({
        ...item,
        isDeleted: false,
        createdAt: item.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      }), { merge: true });
    }
    return INITIAL_JAMAAH_DATA;
  } catch (error) {
    console.error('Error reloading demo jamaah into Firestore:', error);
    return INITIAL_JAMAAH_DATA;
  }
}

export async function addJamaahToFirestore(jamaah: Omit<JamaahProgressItem, 'id'>): Promise<string> {
  try {
    const now = new Date();
    const docRef = await addDoc(collection(db, JAMAAH_COLLECTION), sanitizeFirestorePayload({
      ...jamaah,
      createdAt: serverTimestamp(),
      createdTimestamp: now.getTime(),
      createdAtFormatted: now.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
    return docRef.id;
  } catch (error) {
    console.error('Error adding jamaah to Firestore:', error);
    throw error;
  }
}

export async function updateJamaahInFirestore(id: string, updates: Partial<JamaahProgressItem>) {
  try {
    const docRef = doc(db, JAMAAH_COLLECTION, id);
    const cleaned = sanitizeFirestorePayload({
      ...updates,
      id,
      updatedAt: serverTimestamp()
    });
    delete cleaned.id;
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Error updating jamaah in Firestore:', error);
    throw error;
  }
}

export async function deleteJamaahFromFirestore(id: string) {
  try {
    const docRef = doc(db, JAMAAH_COLLECTION, id);
    await setDoc(docRef, {
      isDeleted: true,
      deletedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error soft-deleting jamaah from Firestore:', error);
    throw error;
  }
}

// ---------------- INQUIRIES & PERTANYAAN REALTIME SYNC ----------------

export function subscribeToInquiries(callback: (items: InquiryItem[]) => void) {
  const q = query(collection(db, INQUIRIES_COLLECTION));
  let hasInitialized = false;

  return onSnapshot(q, async (snapshot) => {
    const isDemoCleared = typeof window !== 'undefined' && localStorage.getItem('alghanim_demo_cleared') === 'true';

    if (!snapshot.empty) {
      hasInitialized = true;
      const items: InquiryItem[] = [];
      snapshot.forEach((docSnap) => {
        // Exclude legacy mock/dummy inquiries
        if (['inq-1', 'inq-2', 'inq-3', 'inq-4'].includes(docSnap.id)) {
          return;
        }
        const data = docSnap.data() as Omit<InquiryItem, 'id'>;
        if (!data.isDeleted) {
          items.push({ 
            id: docSnap.id, 
            ...data 
          });
        }
      });
      // Sort newest first (highest timestamp on top)
      items.sort((a, b) => {
        const timeA = parseTimestampToMillis((a as any).timestampISO || (a as any).timestamp || a.createdAt);
        const timeB = parseTimestampToMillis((b as any).timestampISO || (b as any).timestamp || b.createdAt);
        return timeB - timeA;
      });
      callback(items);
    } else {
      if (!hasInitialized && !isDemoCleared) {
        hasInitialized = true;
        await seedInitialFirestoreData();
        const initialSorted = [...INITIAL_INQUIRIES_DATA].sort((a, b) => {
          return parseTimestampToMillis(b.createdAt) - parseTimestampToMillis(a.createdAt);
        });
        callback(initialSorted);
      } else {
        callback([]);
      }
    }
  }, (error) => {
    console.warn('Firestore subscription error (inquiries), falling back to local state:', error);
    const isDemoCleared = typeof window !== 'undefined' && localStorage.getItem('alghanim_demo_cleared') === 'true';
    if (isDemoCleared) {
      callback([]);
    } else {
      const initialSorted = [...INITIAL_INQUIRIES_DATA].sort((a, b) => {
        return parseTimestampToMillis(b.createdAt) - parseTimestampToMillis(a.createdAt);
      });
      callback(initialSorted);
    }
  });
}

export async function addInquiryToFirestore(inquiry: Omit<InquiryItem, 'id' | 'createdAt'>): Promise<string> {
  try {
    const now = new Date();
    const isoString = now.toISOString();
    const createdAtStr = now.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-');

    const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), sanitizeFirestorePayload({
      ...inquiry,
      createdAt: createdAtStr,
      timestampISO: isoString,
      timestamp: serverTimestamp()
    }));
    return docRef.id;
  } catch (error) {
    console.error('Error adding inquiry to Firestore:', error);
    throw error;
  }
}

export async function updateInquiryStatusInFirestore(id: string, status: 'Baru' | 'Dihubungi' | 'Selesai') {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    await setDoc(docRef, sanitizeFirestorePayload({ id, status, updatedAt: serverTimestamp() }), { merge: true });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    throw error;
  }
}

export async function updateInquiryInFirestore(id: string, updates: Partial<InquiryItem>) {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    const cleaned = sanitizeFirestorePayload({ ...updates, id, updatedAt: serverTimestamp() });
    delete cleaned.id;
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Error updating inquiry in Firestore:', error);
    throw error;
  }
}

export async function deleteInquiryFromFirestore(id: string) {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    await setDoc(docRef, {
      isDeleted: true,
      deletedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error soft-deleting inquiry from Firestore:', error);
    throw error;
  }
}

export async function deleteMultipleInquiriesFromFirestore(ids: string[]) {
  try {
    for (const id of ids) {
      const docRef = doc(db, INQUIRIES_COLLECTION, id);
      await setDoc(docRef, {
        isDeleted: true,
        deletedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error batch soft-deleting inquiries from Firestore:', error);
    throw error;
  }
}

export async function deleteAllInquiriesFromFirestore(filterStatus?: 'Selesai' | 'all') {
  try {
    const snap = await getDocs(collection(db, INQUIRIES_COLLECTION));
    for (const docSnap of snap.docs) {
      if (!filterStatus || filterStatus === 'all' || docSnap.data().status === filterStatus) {
        await setDoc(doc(db, INQUIRIES_COLLECTION, docSnap.id), {
          isDeleted: true,
          deletedAt: serverTimestamp()
        }, { merge: true });
      }
    }
  } catch (error) {
    console.error('Error soft-deleting all inquiries from Firestore:', error);
    throw error;
  }
}

// ---------------- PARTNERSHIP REGISTRATIONS REALTIME SYNC ----------------

export function subscribeToPartnerRegistrations(callback: (items: PartnerRegistrationItem[]) => void) {
  const q = query(collection(db, PARTNERS_COLLECTION));
  let hasInitialized = false;

  return onSnapshot(q, async (snapshot) => {
    if (!snapshot.empty) {
      hasInitialized = true;
      const items: PartnerRegistrationItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<PartnerRegistrationItem, 'id'>;
        if (!data.isDeleted) {
          items.push({ 
            id: docSnap.id, 
            ...data 
          });
        }
      });
      items.sort((a, b) => {
        const timeA = parseTimestampToMillis((a as any).timestampISO || (a as any).timestamp || a.createdAt);
        const timeB = parseTimestampToMillis((b as any).timestampISO || (b as any).timestamp || b.createdAt);
        return timeB - timeA;
      });
      callback(items);
    } else {
      if (!hasInitialized) {
        hasInitialized = true;
        await seedInitialFirestoreData();
        const initialSorted = [...INITIAL_PARTNER_REGISTRATIONS].sort((a, b) => {
          return parseTimestampToMillis(b.createdAt) - parseTimestampToMillis(a.createdAt);
        });
        callback(initialSorted);
      } else {
        callback([]);
      }
    }
  }, (error) => {
    console.warn('Firestore subscription error (partners), falling back to local state:', error);
    const initialSorted = [...INITIAL_PARTNER_REGISTRATIONS].sort((a, b) => {
      return parseTimestampToMillis(b.createdAt) - parseTimestampToMillis(a.createdAt);
    });
    callback(initialSorted);
  });
}

export async function addPartnerRegistrationToFirestore(partner: Omit<PartnerRegistrationItem, 'id' | 'createdAt'>): Promise<string> {
  try {
    const now = new Date();
    const isoString = now.toISOString();
    const createdAtStr = now.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-');

    const docRef = await addDoc(collection(db, PARTNERS_COLLECTION), sanitizeFirestorePayload({
      ...partner,
      createdAt: createdAtStr,
      timestampISO: isoString,
      timestamp: serverTimestamp()
    }));
    return docRef.id;
  } catch (error) {
    console.error('Error adding partner registration to Firestore:', error);
    throw error;
  }
}

export async function updatePartnerStatusInFirestore(id: string, status: 'Menunggu Verifikasi' | 'Disetujui' | 'Dihubungi') {
  try {
    const docRef = doc(db, PARTNERS_COLLECTION, id);
    await setDoc(docRef, sanitizeFirestorePayload({ id, status, updatedAt: serverTimestamp() }), { merge: true });
  } catch (error) {
    console.error('Error updating partner status:', error);
    throw error;
  }
}

export async function updatePartnerInFirestore(id: string, updates: Partial<PartnerRegistrationItem>) {
  try {
    const docRef = doc(db, PARTNERS_COLLECTION, id);
    const cleaned = sanitizeFirestorePayload({ ...updates, id, updatedAt: serverTimestamp() });
    delete cleaned.id;
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Error updating partner in Firestore:', error);
    throw error;
  }
}

export async function deletePartnerFromFirestore(id: string) {
  try {
    const docRef = doc(db, PARTNERS_COLLECTION, id);
    await setDoc(docRef, {
      isDeleted: true,
      deletedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error soft-deleting partner from Firestore:', error);
    throw error;
  }
}

// ---------------- PACKAGES REALTIME SYNC (CMS) ----------------

export function subscribeToPackages(callback: (items: PackageScheduleItem[]) => void) {
  const q = query(collection(db, PACKAGES_COLLECTION));
  let hasInitialized = false;

  return onSnapshot(q, async (snapshot) => {
    if (!snapshot.empty) {
      hasInitialized = true;
      const items: PackageScheduleItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<PackageScheduleItem, 'id'>;
        if (!data.isDeleted) {
          items.push({ id: docSnap.id, ...data });
        }
      });
      callback(items);
    } else {
      if (!hasInitialized) {
        hasInitialized = true;
        callback(DETAILED_SCHEDULES);
        await seedInitialFirestoreData();
      } else {
        callback([]);
      }
    }
  }, (err) => {
    console.warn('Firestore packages subscription fallback to local cache:', err);
    callback(DETAILED_SCHEDULES);
  });
}

export async function addPackageToFirestore(pkg: Omit<PackageScheduleItem, 'id'> & { id?: string }): Promise<string> {
  try {
    const docId = pkg.id || `pkg-${Date.now()}`;
    const docRef = doc(db, PACKAGES_COLLECTION, docId);
    const cleaned = sanitizeFirestorePayload({
      ...pkg,
      id: docId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    await setDoc(docRef, cleaned, { merge: true });
    return docId;
  } catch (error) {
    console.error('Error adding package to Firestore:', error);
    throw error;
  }
}

export async function updatePackageInFirestore(id: string, updates: Partial<PackageScheduleItem> | Record<string, any>) {
  try {
    const docRef = doc(db, PACKAGES_COLLECTION, id);
    const updatesCopy: Record<string, any> = { ...updates };

    // Explicitly delete field in Firestore when set to empty string or null
    if (updatesCopy.flyerUrl === '' || updatesCopy.flyerUrl === null) {
      updatesCopy.flyerUrl = deleteField();
    }
    if (updatesCopy.itineraryPdfUrl === '' || updatesCopy.itineraryPdfUrl === null) {
      updatesCopy.itineraryPdfUrl = deleteField();
    }

    const cleaned = sanitizeFirestorePayload({
      ...updatesCopy,
      id,
      updatedAt: serverTimestamp()
    });
    delete cleaned.id;
    // Using setDoc with merge: true guarantees that if document doesn't exist yet, it is created without throwing No Document error
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Error updating package in Firestore:', error);
    throw error;
  }
}

export async function deletePackageDocumentFieldInFirestore(id: string, fieldName: 'flyerUrl' | 'itineraryPdfUrl') {
  try {
    const docRef = doc(db, PACKAGES_COLLECTION, id);
    await setDoc(docRef, {
      [fieldName]: deleteField(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error(`Error deleting ${fieldName} from package in Firestore:`, error);
    throw error;
  }
}

export async function deletePackageFromFirestore(id: string) {
  try {
    const docRef = doc(db, PACKAGES_COLLECTION, id);
    await setDoc(docRef, {
      isDeleted: true,
      deletedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error soft-deleting package from Firestore:', error);
    throw error;
  }
}

// ---------------- PROMO BANNERS REALTIME SYNC (CMS) ----------------

export function subscribeToPromoBanners(callback: (items: PromoBannerItem[]) => void) {
  const q = query(collection(db, BANNERS_COLLECTION));
  let hasInitialized = false;

  return onSnapshot(q, async (snapshot) => {
    if (!snapshot.empty) {
      hasInitialized = true;
      const items: PromoBannerItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<PromoBannerItem, 'id'>;
        if (!data.isDeleted) {
          items.push({ id: docSnap.id, ...data });
        }
      });
      callback(items);
    } else {
      if (!hasInitialized) {
        hasInitialized = true;
        callback(INITIAL_PROMO_BANNERS);
        await seedInitialFirestoreData();
      } else {
        callback([]);
      }
    }
  }, (err) => {
    console.warn('Firestore banners subscription fallback to local cache:', err);
    callback(INITIAL_PROMO_BANNERS);
  });
}

export async function addPromoBannerToFirestore(banner: Omit<PromoBannerItem, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, BANNERS_COLLECTION), sanitizeFirestorePayload({
      ...banner,
      createdAt: serverTimestamp()
    }));
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, BANNERS_COLLECTION);
    throw error;
  }
}

export async function updatePromoBannerInFirestore(id: string, updates: Partial<PromoBannerItem>) {
  try {
    const docRef = doc(db, BANNERS_COLLECTION, id);
    const cleaned = sanitizeFirestorePayload({ ...updates, id, updatedAt: serverTimestamp() });
    delete cleaned.id;
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${BANNERS_COLLECTION}/${id}`);
    throw error;
  }
}

export async function deletePromoBannerFromFirestore(id: string) {
  try {
    const docRef = doc(db, BANNERS_COLLECTION, id);
    await setDoc(docRef, {
      isDeleted: true,
      deletedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${BANNERS_COLLECTION}/${id}`);
    throw error;
  }
}

// ---------------- GALLERY & REAL DOCUMENTATION SYNC (CMS) ----------------

export function subscribeToGallery(callback: (items: GalleryPhotoItem[]) => void) {
  const q = query(collection(db, GALLERY_COLLECTION));
  let hasInitialized = false;

  return onSnapshot(q, async (snapshot) => {
    if (!snapshot.empty) {
      hasInitialized = true;
      const items: GalleryPhotoItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<GalleryPhotoItem, 'id'>;
        if (!data.isDeleted) {
          items.push({ id: docSnap.id, ...data });
        }
      });
      callback(items);
    } else {
      if (!hasInitialized) {
        hasInitialized = true;
        callback(GALLERY_DATA);
        await seedInitialFirestoreData();
      } else {
        callback([]);
      }
    }
  }, (err) => {
    console.warn('Firestore gallery subscription fallback to local cache:', err);
    callback(GALLERY_DATA);
  });
}

export async function addGalleryItemToFirestore(item: Omit<GalleryPhotoItem, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, GALLERY_COLLECTION), sanitizeFirestorePayload({
      ...item,
      createdAt: serverTimestamp()
    }));
    return docRef.id;
  } catch (error) {
    console.error('Error adding gallery item to Firestore:', error);
    throw error;
  }
}

export async function updateGalleryItemInFirestore(id: string, updates: Partial<GalleryPhotoItem>) {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, id);
    const cleaned = sanitizeFirestorePayload({ ...updates, id, updatedAt: serverTimestamp() });
    delete cleaned.id;
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Error updating gallery item in Firestore:', error);
    throw error;
  }
}

export async function deleteGalleryItemFromFirestore(id: string) {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, id);
    await setDoc(docRef, {
      isDeleted: true,
      deletedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error soft-deleting gallery item from Firestore:', error);
    throw error;
  }
}

export async function restoreDefaultGalleryToFirestore() {
  try {
    for (const item of GALLERY_DATA) {
      await setDoc(doc(db, GALLERY_COLLECTION, item.id), sanitizeFirestorePayload({
        ...item,
        isDeleted: false,
        updatedAt: serverTimestamp()
      }), { merge: true });
    }
  } catch (error) {
    console.error('Error restoring default gallery to Firestore:', error);
    throw error;
  }
}

// ---------------- ADMIN AUTH & CREDENTIALS PERSISTENCE (FIRESTORE) ----------------
const SETTINGS_COLLECTION = 'settings';
const ADMIN_AUTH_DOC = 'admin_auth';

export interface AdminAuthConfig {
  customPassword?: string;
  adminName?: string;
  adminPhone?: string;
  updatedAt?: any;
  lastChangedBy?: string;
}

export const DEFAULT_ADMIN_PASSWORDS = ['alghanim2026', 'garut525', 'admin'];

export function subscribeToAdminAuth(callback: (config: AdminAuthConfig | null) => void) {
  const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_AUTH_DOC);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as AdminAuthConfig);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn('Firestore admin auth subscription error:', err);
    callback(null);
  });
}

export async function updateAdminAuthInFirestore(
  newPassword: string,
  adminName: string = 'Admin ALGHANIM',
  adminPhone: string = '0813-1670-218'
) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_AUTH_DOC);
    await setDoc(docRef, sanitizeFirestorePayload({
      customPassword: newPassword,
      adminName: adminName || 'Admin ALGHANIM',
      adminPhone: adminPhone || '0813-1670-218',
      updatedAt: serverTimestamp(),
      lastChangedBy: adminName || 'Admin'
    }), { merge: true });
  } catch (error) {
    console.error('Error saving admin password to Firestore:', error);
    throw error;
  }
}

// ---------------- TESTIMONIALS & RATING REALTIME SYNC (JAMAAH & ADMIN) ----------------

export function subscribeToTestimonials(callback: (items: TestimonialItem[]) => void) {
  const q = query(collection(db, TESTIMONIALS_COLLECTION));
  let hasInitialized = false;

  return onSnapshot(q, async (snapshot) => {
    if (!snapshot.empty) {
      hasInitialized = true;
      const items: TestimonialItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<TestimonialItem, 'id'>;
        if (!data.isDeleted) {
          items.push({ id: docSnap.id, ...data });
        }
      });
      // Sort newest at the top
      items.sort((a, b) => {
        const timeA = parseTimestampToMillis(a.createdAt) || (a as any).createdTimestamp || 0;
        const timeB = parseTimestampToMillis(b.createdAt) || (b as any).createdTimestamp || 0;
        return timeB - timeA;
      });
      callback(items);
    } else {
      if (!hasInitialized) {
        hasInitialized = true;
        callback(TESTIMONIALS_DATA);
        await seedInitialFirestoreData();
      } else {
        callback([]);
      }
    }
  }, (err) => {
    console.warn('Firestore testimonials subscription fallback to local cache:', err);
    callback(TESTIMONIALS_DATA);
  });
}

export async function addTestimonialToFirestore(item: Omit<TestimonialItem, 'id'>): Promise<string> {
  try {
    const now = new Date();
    const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), sanitizeFirestorePayload({
      ...item,
      status: item.status || 'approved',
      isVerified: item.isVerified !== undefined ? item.isVerified : Boolean(item.nij),
      createdTimestamp: now.getTime(),
      createdAt: serverTimestamp(),
      date: item.date || now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }));
    return docRef.id;
  } catch (error) {
    console.error('Error adding testimonial to Firestore:', error);
    throw error;
  }
}

export async function updateTestimonialInFirestore(id: string, updates: Partial<TestimonialItem>) {
  try {
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    const cleaned = sanitizeFirestorePayload({ ...updates, id, updatedAt: serverTimestamp() });
    delete cleaned.id;
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Error updating testimonial in Firestore:', error);
    throw error;
  }
}

export async function deleteTestimonialFromFirestore(id: string) {
  try {
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await setDoc(docRef, {
      isDeleted: true,
      deletedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error soft-deleting testimonial from Firestore:', error);
    throw error;
  }
}


