'use client';

import { useEffect, useState } from 'react';
import { Signal, TowerControl, Radio, Waves, Antenna } from 'lucide-react';
import Reveal from './ui/Reveal';

const CARRIERS = [
  { key: 'Viettel', name: 'Viettel', accent: 'from-red-500/30 to-orange-500/20', text: 'text-red-300' },
  { key: 'Vinaphone', name: 'Vinaphone', accent: 'from-blue-500/30 to-cyan-500/20', text: 'text-blue-300' },
  { key: 'MobiFone', name: 'MobiFone', accent: 'from-pink-500/30 to-rose-500/20', text: 'text-pink-300' },
  { key: 'Vietnamobile', name: 'Vietnamobile', accent: 'from-sky-500/30 to-indigo-500/20', text: 'text-sky-300' },
  { key: 'Gmobile', name: 'Gmobile', accent: 'from-emerald-500/30 to-green-500/20', text: 'text-emerald-300' },
  { key: 'iTel', name: 'iTel', accent: 'from-lime-500/30 to-green-500/20', text: 'text-lime-300' },
  { key: 'Wintel', name: 'Wintel', accent: 'from-purple-500/30 to-fuchsia-500/20', text: 'text-purple-300' },
  { key: 'VNSKY', name: 'VNSKY', accent: 'from-cyan-500/30 to-teal-500/20', text: 'text-cyan-300' },
  { key: 'Local', name: 'Local', accent: 'from-amber-500/30 to-orange-500/20', text: 'text-amber-300' },
];

export default function CarrierSection() {
  const [carrierLogos, setCarrierLogos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLogos = () => {
      const settings = localStorage.getItem('adminSettings');
      if (!settings) return;
      try {
        const parsed = JSON.parse(settings);
        if (parsed.carrierLogos) setCarrierLogos(parsed.carrierLogos);
      } catch {
        /* noop */
      }
    };

    loadLogos();
    window.addEventListener('storage', loadLogos);
    const handleSettingsUpdate = () => loadLogos();
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('settings-sync');
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'settingsUpdated') loadLogos();
      };
    } catch {
      /* BroadcastChannel not supported */
    }

    const syncFromServer = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            const serverSettings = JSON.stringify(data.settings);
            const currentSettings = localStorage.getItem('adminSettings');
            if (!currentSettings || currentSettings !== serverSettings) {
              localStorage.setItem('adminSettings', serverSettings);
              loadLogos();
            }
          }
        }
      } catch {
        /* ignore */
      }
    };

    const handleForceSync = async () => {
      await syncFromServer();
    };
    window.addEventListener('forceSettingsSync', handleForceSync);

    syncFromServer();
    const serverSyncInterval = setInterval(syncFromServer, 1000);
    const interval = setInterval(loadLogos, 200);

    return () => {
      window.removeEventListener('storage', loadLogos);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('forceSettingsSync', handleForceSync);
      if (broadcastChannel) broadcastChannel.close();
      clearInterval(interval);
      clearInterval(serverSyncInterval);
    };
  }, []);

  const handleCarrierClick = (carrierKey: string) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('filterByCarrier', { detail: { carrier: carrierKey } }),
    );
    document
      .getElementById('plans')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative py-20 sm:py-24">
      <div className="container-app relative z-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">
              <Signal className="h-3.5 w-3.5" strokeWidth={2.2} />
              Đối tác chiến lược
            </span>
            <h2 className="section-title mt-5">
              <span className="text-gradient">Các nhà mạng của chúng tôi</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
              Hợp tác chính thức với 9 nhà mạng hàng đầu Việt Nam — phủ sóng toàn quốc,
              giá cạnh tranh, kích hoạt tức thì.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-9 lg:gap-3">
          {CARRIERS.map((carrier, idx) => (
            <Reveal key={carrier.key} delay={idx * 60}>
              <button
                type="button"
                onClick={() => handleCarrierClick(carrier.key)}
                className="group relative w-full overflow-hidden rounded-2xl border border-border bg-white/[0.03] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:bg-white/[0.06] hover:shadow-card-hover sm:p-5"
              >
                {/* Accent gradient overlay */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${carrier.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative">
                  <div
                    className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-bg-base/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-blue sm:h-16 sm:w-16`}
                  >
                    {carrierLogos[carrier.key] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={carrierLogos[carrier.key]}
                        alt={carrier.name}
                        className="h-8 w-8 object-contain sm:h-10 sm:w-10"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    ) : (
                      <Signal
                        className={`h-6 w-6 ${carrier.text} sm:h-7 sm:w-7`}
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  <div className="text-xs font-semibold text-text-primary transition-colors group-hover:text-text-primary sm:text-sm">
                    {carrier.name}
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
