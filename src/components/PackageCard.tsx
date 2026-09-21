import { 
  Plane, 
  Building2, 
  UtensilsCrossed, 
  Droplets, 
  Clock, 
  Car, 
  Star, 
  UserCheck, 
  Landmark, 
  Sliders, 
  ShieldCheck, 
  CalendarCheck,
  PiggyBank
} from 'lucide-react';
import { PackageItem } from '../types';

interface PackageCardProps {
  key?: string;
  pkg: PackageItem;
  onAction: (pkgId: string) => void;
}

export const PackageCard = ({ pkg, onAction }: PackageCardProps) => {
  const renderIcon = (iconName: string) => {
    const iconClass = "w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5";
    switch (iconName) {
      case 'flight':
        return <Plane className={iconClass} />;
      case 'hotel':
        return <Building2 className={iconClass} />;
      case 'utensils':
        return <UtensilsCrossed className={iconClass} />;
      case 'droplet':
        return <Droplets className={iconClass} />;
      case 'clock':
        return <Clock className={iconClass} />;
      case 'car':
        return <Car className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'user':
        return <UserCheck className={iconClass} />;
      case 'building':
        return <Landmark className={iconClass} />;
      case 'sliders':
        return <Sliders className={iconClass} />;
      case 'shield-check':
        return <ShieldCheck className={iconClass} />;
      case 'calendar-check':
        return <CalendarCheck className={iconClass} />;
      default:
        return <Star className={iconClass} />;
    }
  };

  return (
    <article className="card-soft-luxury rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1.5 relative h-full bg-white border border-[#EBEBEB] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-5px_rgba(197,160,89,0.15)]">
      {/* Top Visual Area */}
      {pkg.image ? (
        <div className="relative aspect-[4/3] sm:h-60 overflow-hidden bg-gray-950 flex items-center justify-center">
          <img
            src={pkg.image}
            alt={pkg.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
          {pkg.badge && (
            <div
              className={`absolute top-4 left-4 px-3 py-1 rounded-full backdrop-blur-md z-10 shadow-sm ${
                pkg.badge.variant === 'premium'
                  ? 'bg-[#C5A059] text-white font-bold'
                  : 'bg-white/95 text-[#2B2B2B] border border-[#EBEBEB] font-semibold'
              }`}
            >
              <span className="font-sans-luxury text-xs uppercase tracking-wider">
                {pkg.badge.text}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-60 overflow-hidden bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] flex items-center justify-center border-b border-[#EBEBEB]">
          {pkg.bgPattern && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url('${pkg.bgPattern}')` }}
            />
          )}
          {/* Central Savings Emblem */}
          <div className="relative z-10 flex flex-col items-center justify-center p-6 rounded-full bg-white shadow-md border border-[#EBEBEB] group-hover:scale-110 transition-transform duration-500">
            <PiggyBank className="w-14 h-14 text-[#C5A059] stroke-[1.5]" />
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between relative z-10">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#2B2B2B] mb-2 tracking-tight group-hover:text-[#C5A059] transition-colors">
            {pkg.title}
          </h2>
          <p className="font-sans-luxury text-xs sm:text-sm text-[#6E6E6E] mb-5 leading-relaxed">
            {pkg.description}
          </p>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 mb-6 pb-4 border-b border-[#EBEBEB]">
            <span className="font-sans-luxury text-xs text-[#6E6E6E] font-medium">{pkg.pricePrefix}</span>
            <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#C5A059] leading-none">
              {pkg.priceAmount}
              {pkg.priceSuffix && (
                <span className="font-sans-luxury text-sm text-[#6E6E6E] ml-1 font-normal">{pkg.priceSuffix}</span>
              )}
            </span>
          </div>

          {/* Feature Checklist */}
          <ul className="space-y-3 mb-6">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2B2B2B]">
                {renderIcon(feature.icon)}
                <span className="font-sans-luxury font-normal leading-relaxed">
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        {pkg.buttonVariant === 'filled' ? (
          <button
            onClick={() => onAction(pkg.id)}
            className="w-full bg-[#C5A059] hover:bg-[#B38E46] text-white font-sans-luxury py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-[#C5A059]/25 active:scale-[0.98] cursor-pointer mt-auto"
          >
            {pkg.buttonText}
          </button>
        ) : (
          <button
            onClick={() => onAction(pkg.id)}
            className="w-full py-3 rounded-xl font-sans-luxury text-xs font-bold uppercase tracking-wider text-[#2B2B2B] hover:text-white mt-auto transition-all duration-300 active:scale-[0.98] cursor-pointer border border-[#EBEBEB] hover:border-[#C5A059] bg-[#FAFAFA] hover:bg-[#C5A059]"
          >
            {pkg.buttonText}
          </button>
        )}
      </div>
    </article>
  );
};
