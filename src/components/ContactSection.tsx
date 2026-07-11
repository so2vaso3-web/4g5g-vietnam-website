'use client';

import { useEffect, useState } from 'react';

export default function ContactSection() {
  const [content, setContent] = useState({
    title: 'Liên Hệ',
    content: 'Liên hệ với chúng tôi để được hỗ trợ hoặc giải đáp thắc mắc.',
  });
  const [contactInfo, setContactInfo] = useState({ 
    email: 'support@mangvietnam.com', 
    phone: '1900-xxxx',
    address: 'Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố',
    businessHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadContent = () => {
        const websiteContent = localStorage.getItem('websiteContent');
        if (websiteContent) {
          try {
            const parsed = JSON.parse(websiteContent);
            if (parsed.contact) {
              setContent(parsed.contact);
            }
          } catch (e) {
            console.error('Error parsing website content:', e);
          }
        }

        const settings = localStorage.getItem('adminSettings');
        if (settings) {
          try {
            const parsed = JSON.parse(settings);
            setContactInfo({
              email: parsed.contactEmail || 'support@mangvietnam.com',
              phone: parsed.contactPhone || '1900-xxxx',
              address: parsed.address || 'Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố',
              businessHours: parsed.businessHours || 'Thứ 2 - Thứ 6: 8:00 - 17:00',
            });
          } catch (e) {
            console.error('Error loading contact info:', e);
          }
        }
      };

      // Load immediately
      loadContent();

      // Listen for storage changes (when admin updates settings)
      window.addEventListener('storage', loadContent);
      
      // Also listen for custom event when settings are saved
      const handleSettingsUpdate = () => {
        loadContent();
      };
      window.addEventListener('settingsUpdated', handleSettingsUpdate);
      
      // Use BroadcastChannel to sync across tabs/windows
      let broadcastChannel: BroadcastChannel | null = null;
      try {
        broadcastChannel = new BroadcastChannel('settings-sync');
        broadcastChannel.onmessage = (event) => {
          if (event.data.type === 'settingsUpdated') {
            loadContent();
          }
        };
      } catch (e) {
        console.log('BroadcastChannel not supported');
      }
      
      // Also sync from server for cross-device sync
      const syncFromServer = async () => {
        try {
          const response = await fetch('/api/settings');
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.settings) {
              const serverSettings = JSON.stringify(data.settings);
              const currentSettings = localStorage.getItem('adminSettings');
              
              // Only update if server has newer settings
              if (!currentSettings || currentSettings !== serverSettings) {
                localStorage.setItem('adminSettings', serverSettings);
                loadContent();
              }
            }
          }
        } catch (error) {
          // Ignore errors, will retry on next interval
        }
      };
      
      // Listen for force sync event (when admin saves)
      const handleForceSync = async () => {
        await syncFromServer();
      };
      window.addEventListener('forceSettingsSync', handleForceSync);
      
      // Sync from server immediately and then periodically
      syncFromServer();
      const serverSyncInterval = setInterval(syncFromServer, 1000); // Check every 1 second for faster sync
      
      // Also check periodically in case settings are updated in the same tab
      const interval = setInterval(loadContent, 200);

      return () => {
        window.removeEventListener('storage', loadContent);
        window.removeEventListener('settingsUpdated', handleSettingsUpdate);
        window.removeEventListener('forceSettingsSync', handleForceSync);
        if (broadcastChannel) {
          broadcastChannel.close();
        }
        clearInterval(interval);
        clearInterval(serverSyncInterval);
      };
    }
  }, []);

  return (
    <section id="contact" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-light-gray to-white">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-vietnam font-900 mb-6 text-dark-gray">
            {content.title}
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto leading-relaxed">
            {content.content}
          </p>
        </div>

        {/* Contact info cards */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Email */}
          <div className="card-modern group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-envelope text-2xl text-primary-blue"></i>
            </div>
            <h3 className="text-lg font-vietnam font-bold text-dark-gray mb-3">
              Email
            </h3>
            <a 
              href={`mailto:${contactInfo.email}`} 
              className="text-text-light hover:text-primary-blue transition-colors break-all"
            >
              {contactInfo.email}
            </a>
          </div>

          {/* Phone */}
          <div className="card-modern group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-blue/20 to-accent-teal/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-phone text-2xl text-secondary-blue"></i>
            </div>
            <h3 className="text-lg font-vietnam font-bold text-dark-gray mb-3">
              Điện Thoại
            </h3>
            <a 
              href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
              className="text-text-light hover:text-secondary-blue transition-colors"
            >
              {contactInfo.phone}
            </a>
          </div>

          {/* Address */}
          <div className="card-modern group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-teal/20 to-primary-blue/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-map-marker-alt text-2xl text-accent-teal"></i>
            </div>
            <h3 className="text-lg font-vietnam font-bold text-dark-gray mb-3">
              Địa Chỉ
            </h3>
            <p className="text-text-light leading-relaxed">
              {contactInfo.address}
            </p>
          </div>

          {/* Business hours */}
          <div className="card-modern group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-blue/20 to-secondary-blue/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-clock text-2xl text-primary-blue"></i>
            </div>
            <h3 className="text-lg font-vietnam font-bold text-dark-gray mb-3">
              Giờ Làm Việc
            </h3>
            <p className="text-text-light leading-relaxed">
              {contactInfo.businessHours}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-text-light mb-6">Hãy liên hệ với chúng tôi ngay hôm nay</p>
          <a
            href={`mailto:${contactInfo.email}`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white rounded-2xl font-vietnam font-bold hover:shadow-soft-blue transition-all hover:scale-105"
          >
            <i className="fas fa-envelope"></i>
            <span>Gửi Email Cho Chúng Tôi</span>
          </a>
        </div>
      </div>
    </section>
  );
}

