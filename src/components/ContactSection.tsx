'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import Reveal from './ui/Reveal';

const CONTACTS = [
  {
    icon: Mail,
    label: 'Email',
    color: 'text-brand-300',
    bg: 'bg-brand-500/15 ring-brand-400/20',
    render: (info: any) => ({
      type: 'link',
      href: `mailto:${info.email}`,
      value: info.email,
    }),
  },
  {
    icon: Phone,
    label: 'Điện thoại',
    color: 'text-purple-300',
    bg: 'bg-purple-500/15 ring-purple-400/20',
    render: (info: any) => ({
      type: 'link',
      href: `tel:${info.phone.replace(/\D/g, '')}`,
      value: info.phone,
    }),
  },
  {
    icon: MapPin,
    label: 'Địa chỉ',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/15 ring-emerald-400/20',
    render: (info: any) => ({ type: 'text', value: info.address }),
  },
  {
    icon: Clock,
    label: 'Giờ làm việc',
    color: 'text-amber-300',
    bg: 'bg-amber-500/15 ring-amber-400/20',
    render: (info: any) => ({ type: 'text', value: info.businessHours }),
  },
];

export default function ContactSection() {
  const [content, setContent] = useState({
    title: 'Liên hệ',
    content: 'Liên hệ với chúng tôi để được hỗ trợ hoặc giải đáp thắc mắc.',
  });
  const [contactInfo, setContactInfo] = useState({
    email: 'support@mangvietnam.com',
    phone: '1900-xxxx',
    address: 'Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố',
    businessHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadContent = () => {
      const websiteContent = localStorage.getItem('websiteContent');
      if (websiteContent) {
        try {
          const parsed = JSON.parse(websiteContent);
          if (parsed.contact) setContent(parsed.contact);
        } catch {
          /* noop */
        }
      }

      const settings = localStorage.getItem('adminSettings');
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          setContactInfo({
            email: parsed.contactEmail || 'support@mangvietnam.com',
            phone: parsed.contactPhone || '1900-xxxx',
            address:
              parsed.address ||
              'Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố',
            businessHours: parsed.businessHours || 'Thứ 2 - Thứ 6: 8:00 - 17:00',
          });
        } catch {
          /* noop */
        }
      }
    };

    loadContent();
    window.addEventListener('storage', loadContent);

    const handleSettingsUpdate = () => loadContent();
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('settings-sync');
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'settingsUpdated') loadContent();
      };
    } catch {
      /* noop */
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
              loadContent();
            }
          }
        }
      } catch {
        /* ignore */
      }
    };

    const handleForceSync = async () => syncFromServer();
    window.addEventListener('forceSettingsSync', handleForceSync);

    syncFromServer();
    const serverSyncInterval = setInterval(syncFromServer, 1000);
    const interval = setInterval(loadContent, 200);

    return () => {
      window.removeEventListener('storage', loadContent);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('forceSettingsSync', handleForceSync);
      if (broadcastChannel) broadcastChannel.close();
      clearInterval(interval);
      clearInterval(serverSyncInterval);
    };
  }, []);

  return (
    <section id="contact" className="relative py-20 sm:py-24">
      <div className="container-app relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.2} />
              Kết nối với chúng tôi
            </span>
            <h2 className="section-title mt-5">
              <span className="text-gradient">{content.title}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
              {content.content}
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {CONTACTS.map((c) => {
              const Icon = c.icon;
              const { type, href, value } = c.render(contactInfo);
              const body = (
                <>
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${c.bg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-5 w-5 ${c.color}`} strokeWidth={1.8} />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
                    {c.label}
                  </div>
                  <div className="mt-1.5 break-words text-sm font-semibold text-text-primary transition-colors group-hover:text-brand-300 sm:text-base">
                    {value}
                  </div>
                </>
              );

              const cardClass =
                'group relative overflow-hidden rounded-2xl border border-border bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-card-hover sm:p-6';

              return type === 'link' ? (
                <a key={c.label} href={href} className={cardClass}>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-brand-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="relative">{body}</div>
                </a>
              ) : (
                <div key={c.label} className={cardClass}>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-brand-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="relative">{body}</div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
