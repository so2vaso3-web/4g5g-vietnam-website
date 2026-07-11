'use client';

import { useEffect, useState } from 'react';

export default function CarrierSection() {
  const [carrierLogos, setCarrierLogos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadLogos = () => {
        const settings = localStorage.getItem('adminSettings');
        if (settings) {
          try {
            const parsed = JSON.parse(settings);
            if (parsed.carrierLogos) {
              setCarrierLogos(parsed.carrierLogos);
            }
          } catch (e) {
            console.error('Error loading carrier logos:', e);
          }
        }
      };
      
      // Load immediately
      loadLogos();
      
      // Listen for storage changes (when admin updates settings)
      window.addEventListener('storage', loadLogos);
      
      // Also listen for custom event when settings are saved
      const handleSettingsUpdate = () => {
        loadLogos();
      };
      window.addEventListener('settingsUpdated', handleSettingsUpdate);
      
      // Use BroadcastChannel to sync across tabs/windows
      let broadcastChannel: BroadcastChannel | null = null;
      try {
        broadcastChannel = new BroadcastChannel('settings-sync');
        broadcastChannel.onmessage = (event) => {
          if (event.data.type === 'settingsUpdated') {
            loadLogos();
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
                loadLogos();
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
      const interval = setInterval(loadLogos, 200);
      
      return () => {
        window.removeEventListener('storage', loadLogos);
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

  const carriers = [
    { key: 'Viettel', name: 'Viettel', color: 'text-red-500' },
    { key: 'Vinaphone', name: 'Vinaphone', color: 'text-blue-400' },
    { key: 'MobiFone', name: 'MobiFone', color: 'text-pink-400' },
    { key: 'Vietnamobile', name: 'Vietnamobile', color: 'text-blue-500' },
    { key: 'Gmobile', name: 'Gmobile', color: 'text-green-400' },
    { key: 'iTel', name: 'iTel', color: 'text-green-500' },
    { key: 'Wintel', name: 'Wintel', color: 'text-purple-400' },
    { key: 'VNSKY', name: 'VNSKY', color: 'text-cyan-400' },
    { key: 'Local', name: 'Local', color: 'text-yellow-400' },
  ];

  const handleCarrierClick = (carrierKey: string) => {
    // Dispatch custom event to trigger filter in PlansSection
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('filterByCarrier', { detail: { carrier: carrierKey } }));
      
      // Scroll to plans section smoothly
      const plansSection = document.getElementById('plans');
      if (plansSection) {
        plansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="py-12 px-4 bg-white relative -mt-4">
      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
          Các Nhà Mạng Của Chúng Tôi
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Hợp tác với các nhà mạng hàng đầu tại Việt Nam
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {carriers.map(carrier => (
            <div
              key={carrier.key}
              onClick={() => handleCarrierClick(carrier.key)}
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="flex flex-col items-center justify-center text-center">
                {carrierLogos[carrier.key] ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={carrierLogos[carrier.key]}
                      alt={carrier.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300"
                      style={{ filter: 'none', maxWidth: '100%', height: 'auto' }}
                    />
                  </>
                ) : (
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:bg-gray-50 transition-all duration-300 ${carrier.color}`}>
                    <i className="fas fa-signal text-xl sm:text-2xl md:text-3xl"></i>
                  </div>
                )}
                <h3 className="font-bold text-xs sm:text-sm md:text-lg text-gray-800 group-hover:text-blue-600 transition-colors">{carrier.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

