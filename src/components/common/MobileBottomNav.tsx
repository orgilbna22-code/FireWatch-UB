import React from 'react';
import { ActiveTab, Language } from '../../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  onOpenMenu: () => void;
  isMenuOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  language,
  onOpenMenu,
  isMenuOpen,
}) => {
  const isMn = language === 'mn';

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'landing', label: isMn ? 'Эхлэл' : 'Home', icon: '🏠' },
    { id: 'map', label: isMn ? 'Газрын зураг' : 'Map', icon: '🗺️' },
    { id: 'explorer', label: isMn ? 'Шинжилгээ' : 'Explorer', icon: '📊' },
    { id: 'personal', label: isMn ? 'Хувийн' : 'Personal', icon: '👤' },
  ];

  return (
    <nav
      aria-label="Гар утасны үндсэн навигаци"
      className="fixed bottom-0 left-0 right-0 z-[1100] lg:hidden bg-white/95 backdrop-blur-xl border-t border-black/[0.08] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id && !isMenuOpen;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all relative ${
                isActive ? 'text-[#FF633C]' : 'text-[#72778A] hover:text-[#0B124D]'
              }`}
            >
              {isActive && (
                <span className="absolute top-1 w-6 h-1 rounded-full bg-[#FF633C]" />
              )}
              <span className={`text-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                  isActive ? 'font-bold text-[#0B124D]' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* 5th button: Menu Drawer Trigger */}
        <button
          onClick={onOpenMenu}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all relative ${
            isMenuOpen ? 'text-[#0B124D]' : 'text-[#72778A] hover:text-[#0B124D]'
          }`}
        >
          {isMenuOpen && (
            <span className="absolute top-1 w-6 h-1 rounded-full bg-[#0B124D]" />
          )}
          <div className="w-6 h-6 flex items-center justify-center text-lg">
            {isMenuOpen ? '✕' : '☰'}
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-medium ${
              isMenuOpen ? 'font-bold text-[#0B124D]' : ''
            }`}
          >
            {isMn ? 'Бүх цэс' : 'Menu'}
          </span>
        </button>
      </div>
    </nav>
  );
};
