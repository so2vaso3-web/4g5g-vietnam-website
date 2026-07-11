'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [websiteName, setWebsiteName] = useState('Mạng Việt Nam');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const checkAdminAuth = () => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('adminSession');
      setIsAdmin(!!adminSession);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const loadWebsiteName = () => {
        const settings = localStorage.getItem('adminSettings');
        if (settings) {
          try {
            const parsed = JSON.parse(settings);
            if (parsed.websiteName && parsed.websiteName !== 'US Mobile Networks') {
              setWebsiteName(parsed.websiteName);
            } else {
              if (parsed.websiteName === 'US Mobile Networks') {
                parsed.websiteName = 'Mạng Việt Nam';
                localStorage.setItem('adminSettings', JSON.stringify(parsed));
              }
              setWebsiteName('Mạng Việt Nam');
            }
          } catch (e) {
            console.error('Error parsing admin settings:', e);
          }
        }
      };

      loadWebsiteName();
      window.addEventListener('storage', loadWebsiteName);
      
      const handleSettingsUpdate = () => {
        loadWebsiteName();
      };
      window.addEventListener('settingsUpdated', handleSettingsUpdate);
      
      checkAdminAuth();
      const authInterval = setInterval(checkAdminAuth, 60000);
      
      window.addEventListener('adminLoggedIn', checkAdminAuth);
      window.addEventListener('adminLoggedOut', checkAdminAuth);

      // Handle scroll event
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('storage', loadWebsiteName);
        window.removeEventListener('settingsUpdated', handleSettingsUpdate);
        window.removeEventListener('adminLoggedIn', checkAdminAuth);
        window.removeEventListener('adminLoggedOut', checkAdminAuth);
        window.removeEventListener('scroll', handleScroll);
        clearInterval(authInterval);
      };
    }
  }, []);

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-soft border-b border-medium-gray' 
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold">
              <i className="fas fa-signal"></i>
            </div>
            <span className={`font-vietnam font-900 ${isScrolled ? 'text-dark-gray' : 'text-white'} transition-colors`}>
              {websiteName}
            </span>
          </Link>

          <div className={`hidden md:flex items-center gap-8 ${isScrolled ? 'text-dark-gray' : 'text-white'}`}>
            <Link href="#home" className={`font-medium hover:text-primary-blue transition-colors ${isScrolled ? '' : 'hover:text-secondary-blue'}`}>
              Trang Chủ
            </Link>
            <Link href="#plans" className={`font-medium hover:text-primary-blue transition-colors ${isScrolled ? '' : 'hover:text-secondary-blue'}`}>
              Gói Cước
            </Link>
            <Link href="#about" className={`font-medium hover:text-primary-blue transition-colors ${isScrolled ? '' : 'hover:text-secondary-blue'}`}>
              Giới Thiệu
            </Link>
            <Link href="#contact" className={`font-medium hover:text-primary-blue transition-colors ${isScrolled ? '' : 'hover:text-secondary-blue'}`}>
              Liên Hệ
            </Link>
            {isAdmin && (
              <Link href="/admin" className="px-6 py-2.5 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-soft-blue transition-all hover:scale-105">
                Admin
              </Link>
            )}
          </div>

          <button
            className={`md:hidden text-2xl transition-colors ${isScrolled ? 'text-dark-gray' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-6 flex flex-col gap-4 pb-4 bg-white rounded-2xl p-4 shadow-soft">
            <Link href="#home" className="font-medium text-dark-gray hover:text-primary-blue transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Trang Chủ
            </Link>
            <Link href="#plans" className="font-medium text-dark-gray hover:text-primary-blue transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Gói Cước
            </Link>
            <Link href="#about" className="font-medium text-dark-gray hover:text-primary-blue transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Giới Thiệu
            </Link>
            <Link href="#contact" className="font-medium text-dark-gray hover:text-primary-blue transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Liên Hệ
            </Link>
            {isAdmin && (
              <Link href="/admin" className="px-6 py-2.5 bg-gradient-primary text-white rounded-lg font-semibold text-center hover:shadow-soft-blue transition-all">
                Admin
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
