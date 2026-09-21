import React from 'react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '628131670218',
  defaultMessage = 'Halo Admin ALGHANIM, saya ingin konsultasi paket Umroh/Haji.'
}) => {
  const encodedMessage = encodeURIComponent(defaultMessage);
  const waUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

  return (
    <aside 
      id="floating-whatsapp-widget"
      aria-label="WhatsApp Floating Widget"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-end pointer-events-auto select-none"
    >
      {/* WhatsApp Floating Action Button - Clean Logo Only */}
      <a
        id="btn-floating-whatsapp"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi WhatsApp ALGHANIM"
        className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-[0_8px_25px_rgba(37,211,102,0.5)] transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        {/* WhatsApp Official Vector Icon */}
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.815 2.796.815 3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.767-5.768-5.767zm7.553 5.766c-.002 4.167-3.39 7.554-7.553 7.554-1.282 0-2.482-.324-3.535-.893l-4.496 1.179 1.202-4.387c-.675-1.127-1.054-2.443-1.053-3.844.002-4.167 3.39-7.555 7.554-7.555 4.164 0 7.553 3.388 7.553 7.555zm1.416 0c0-4.945-4.024-8.97-8.969-8.97-4.947 0-8.97 4.025-8.97 8.97 0 1.58.414 3.064 1.139 4.359l-1.488 5.433 5.568-1.461c1.238.675 2.658 1.059 4.17 1.059 4.945 0 8.97-4.025 8.97-8.97zm-5.114 2.235c-.179-.089-1.059-.523-1.223-.583-.165-.06-.285-.089-.404.089-.12.18-.464.584-.569.704-.105.12-.21.135-.389.045-.18-.089-.759-.28-1.446-.892-.534-.476-.895-1.064-1-1.244-.105-.179-.011-.277.078-.366.082-.081.18-.21.27-.315.09-.105.12-.179.18-.299.06-.12.03-.225-.015-.315-.045-.09-.405-.975-.555-1.335-.146-.35-.295-.302-.405-.308-.105-.005-.225-.006-.345-.006-.12 0-.315.045-.48.225-.165.18-.63.615-.63 1.5 0 .885.645 1.74 1.335 2.43.69.69 1.545 1.335 2.43 1.335.885 0 1.32-.465 1.5-.63.18-.165.225-.36.225-.48 0-.12-.015-.24-.006-.345z"/>
        </svg>
      </a>
    </aside>
  );
};
