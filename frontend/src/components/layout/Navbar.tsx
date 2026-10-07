import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ClipboardCheck, FileText, Languages, Forklift  } from 'lucide-react';
import { setLanguage } from '../../localization/i18n';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === 'ar' ? 'ar' : 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  };

  const navItems = [
    { to: '/', label: t('nav.inspect'), icon: ClipboardCheck },
    { to: '/reports', label: t('nav.reports'), icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#8B1E2D] flex items-center justify-center text-white shadow-md shadow-[#8B1E2D]/20 shrink-0">
              <Forklift  className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-[#1F2429] tracking-tight leading-tight truncate">
                {t('appName')}
              </h1>
              <p className="text-xs text-[#5A646E] hidden sm:block truncate">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center bg-[#F1F4F8] p-1.5 rounded-2xl border border-slate-200/70">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#8B1E2D] text-white shadow-xs'
                        : 'text-[#5A646E] hover:text-[#1F2429] hover:bg-white/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#EBF0F5] hover:bg-[#DEE4EC] text-[#1F2429] border border-slate-200 transition-all shrink-0"
          >
            <Languages className="w-4 h-4 text-[#8B1E2D]" />
            <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
