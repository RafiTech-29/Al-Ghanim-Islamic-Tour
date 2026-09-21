import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIZED_PACKAGES } from '../data/packageCategories';
import { subscribeToPackages } from '../lib/firestoreService';
import { PackageScheduleItem } from '../types';
import { Layers, Edit2 } from 'lucide-react';

interface FullPackageInfo {
  name: string;
  defaultPrice: string;
  duration: string;
  departureDate?: string;
  airline?: string;
  hotelMakkah?: string;
  hotelMadinah?: string;
}

interface PackageCategorySelectorProps {
  value: string;
  onChange: (packageName: string) => void;
  onAutoSetPrice?: (price: string) => void;
  onSelectFullPackage?: (pkg: FullPackageInfo) => void;
  label?: string;
  className?: string;
}

const CATEGORY_TABS = ['Reguler', 'Ramadhan', 'Plus Wisata', 'Haji Resmi'] as const;
type CategoryTab = typeof CATEGORY_TABS[number];

export const PackageCategorySelector: React.FC<PackageCategorySelectorProps> = ({
  value,
  onChange,
  onAutoSetPrice,
  onSelectFullPackage,
  label = 'Pilih Paket Ibadah',
  className = ''
}) => {
  const [livePackages, setLivePackages] = useState<PackageScheduleItem[]>([]);
  const [isManualInput, setIsManualInput] = useState<boolean>(false);

  // Subscribe to real-time Firestore packages so CMS additions & edits immediately reflect
  useEffect(() => {
    const unsub = subscribeToPackages((items) => {
      if (items && items.length > 0) {
        setLivePackages(items);
      }
    });
    return () => unsub();
  }, []);

  // Organize live packages + fallback into 4 clean category buckets
  const packagesByCategory = useMemo(() => {
    const map: Record<CategoryTab, FullPackageInfo[]> = {
      'Reguler': [],
      'Ramadhan': [],
      'Plus Wisata': [],
      'Haji Resmi': []
    };

    if (livePackages.length > 0) {
      livePackages.forEach((pkg) => {
        const cat = (pkg.category || '').toLowerCase();
        const title = (pkg.title || '').toLowerCase();

        let targetTab: CategoryTab = 'Reguler';
        if (cat.includes('ramadhan') || title.includes('ramadhan') || title.includes('lailatul')) {
          targetTab = 'Ramadhan';
        } else if (cat.includes('wisata') || cat.includes('halal') || title.includes('wisata') || title.includes('turki') || title.includes('dubai') || title.includes('plus')) {
          targetTab = 'Plus Wisata';
        } else if (cat.includes('haji') || title.includes('haji')) {
          targetTab = 'Haji Resmi';
        } else {
          targetTab = 'Reguler';
        }

        map[targetTab].push({
          name: pkg.title,
          defaultPrice: pkg.price || 'Rp 28.000.000',
          duration: pkg.duration || '9 Hari',
          departureDate: pkg.departureDate,
          airline: pkg.airline,
          hotelMakkah: pkg.hotelMakkah,
          hotelMadinah: pkg.hotelMadinah
        });
      });
    }

    // Ensure each category has options by populating from CATEGORIZED_PACKAGES if empty or complementary
    CATEGORY_TABS.forEach((tab) => {
      if (map[tab].length === 0) {
        const staticCat = CATEGORIZED_PACKAGES.find((c) => c.badge === tab);
        if (staticCat) {
          map[tab] = staticCat.packages.map((p) => ({
            name: p.name,
            defaultPrice: p.defaultPrice,
            duration: p.duration
          }));
        }
      }
    });

    return map;
  }, [livePackages]);

  // Determine initial category from value
  const detectInitialCategory = (): CategoryTab => {
    if (!value) return 'Reguler';
    for (const tab of CATEGORY_TABS) {
      if (packagesByCategory[tab]?.some((p) => p.name === value)) {
        return tab;
      }
    }
    return 'Reguler';
  };

  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('Reguler');

  // Update selected tab if current value belongs to another category
  useEffect(() => {
    if (value) {
      for (const tab of CATEGORY_TABS) {
        if (packagesByCategory[tab]?.some((p) => p.name === value)) {
          setSelectedCategory(tab);
          break;
        }
      }
    }
  }, [value, packagesByCategory]);

  const activeCategoryPackages = packagesByCategory[selectedCategory] || [];

  const handleSelectPackage = (packageName: string) => {
    onChange(packageName);
    const found = activeCategoryPackages.find((p) => p.name === packageName) 
      || (Object.values(packagesByCategory).flat() as FullPackageInfo[]).find((p) => p.name === packageName);
    
    if (found) {
      if (onAutoSetPrice) {
        onAutoSetPrice(found.defaultPrice);
      }
      if (onSelectFullPackage) {
        onSelectFullPackage(found);
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="font-bold text-[#1A1A1A] text-xs flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#A67C52]" />
          <span>{label} *</span>
          {livePackages.length > 0 && (
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold inline-flex items-center gap-1 border border-emerald-200">
              <span>Real-time CMS</span>
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={() => setIsManualInput(!isManualInput)}
          className="text-[11px] font-semibold text-[#A67C52] hover:text-[#8E653E] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit2 className="w-3 h-3" />
          <span>{isManualInput ? 'Pilih Kategori' : 'Ketik Manual'}</span>
        </button>
      </div>

      {isManualInput ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ketik nama paket kustom..."
          className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52]"
        />
      ) : (
        <div className="space-y-2">
          {/* 4 Clean Categories strictly within bounds: Reguler, Ramadhan, Plus Wisata, Haji Resmi */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-gray-100/90 rounded-xl border border-gray-200/80">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  const pkgs = packagesByCategory[cat] || [];
                  if (pkgs.length > 0) {
                    handleSelectPackage(pkgs[0].name);
                  }
                }}
                className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer truncate ${
                  selectedCategory === cat
                    ? 'bg-[#A67C52] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Categorized Dropdown Selector */}
          <select
            value={value}
            onChange={(e) => handleSelectPackage(e.target.value)}
            className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1A1A1A] outline-none focus:border-[#A67C52] cursor-pointer font-medium"
          >
            <option value="" disabled>
              -- Pilih Paket {selectedCategory} ({activeCategoryPackages.length} Pilihan) --
            </option>
            {activeCategoryPackages.map((pkg, idx) => (
              <option key={`${pkg.name}-${idx}`} value={pkg.name}>
                {pkg.name} ({pkg.duration}) • {pkg.defaultPrice}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
