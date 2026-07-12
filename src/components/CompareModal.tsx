'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Scale, Database, Gauge, Wifi, X, Trash2 } from 'lucide-react';
import Modal from './ui/Modal';
import { Button } from './ui/Button';
import { Package } from '@/types';

interface CompareModalProps {
  packages: Package[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

const CARRIER_NAMES: Record<string, string> = {
  Viettel: 'Viettel',
  Vinaphone: 'Vinaphone',
  MobiFone: 'MobiFone',
  Vietnamobile: 'Vietnamobile',
  Gmobile: 'Gmobile',
  iTel: 'iTel',
  Wintel: 'Wintel',
  VNSKY: 'VNSKY',
  Local: 'Local',
};

export default function CompareModal({ packages, onClose, onRemove }: CompareModalProps) {
  const [carrierLogos, setCarrierLogos] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const settings = localStorage.getItem('adminSettings');
    if (!settings) return;
    try {
      const parsed = JSON.parse(settings);
      if (parsed.carrierLogos) setCarrierLogos(parsed.carrierLogos);
    } catch {
      /* noop */
    }
  }, []);

  if (packages.length === 0) return null;

  const allFeatures = Array.from(new Set(packages.flatMap((p) => p.features)));

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/30">
            <Scale className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span>So sánh gói cước</span>
        </div>
      }
      description={`Đang so sánh ${packages.length} gói cước`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-[160px] bg-bg-elevated/80 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary backdrop-blur-md">
                Tiêu chí
              </th>
              {packages.map((pkg) => (
                <th
                  key={pkg.id}
                  className="min-w-[180px] border-b border-border px-3 py-3 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {carrierLogos[pkg.carrier] ? (
                        <div className="mb-2 inline-block rounded-md border border-border bg-white p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={carrierLogos[pkg.carrier]}
                            alt={CARRIER_NAMES[pkg.carrier] || pkg.carrier}
                            className="h-5 w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                          {CARRIER_NAMES[pkg.carrier] || pkg.carrier}
                        </div>
                      )}
                      <div className="line-clamp-2 text-sm font-bold text-text-primary">
                        {pkg.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(pkg.id)}
                      aria-label="Xóa khỏi so sánh"
                      className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr>
              <td className="sticky left-0 z-10 min-w-[160px] bg-bg-elevated/80 px-3 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary backdrop-blur-md">
                Giá
              </td>
              {packages.map((pkg) => (
                <td
                  key={pkg.id}
                  className="border-b border-border px-3 py-3 align-top"
                >
                  <div className="text-base font-bold text-gradient">
                    {pkg.price.toLocaleString('vi-VN')}₫
                  </div>
                  <div className="mt-0.5 text-[11px] text-text-secondary">
                    /{pkg.validity || 'tháng'}
                  </div>
                </td>
              ))}
            </tr>

            {/* Data */}
            <tr>
              <td className="sticky left-0 z-10 min-w-[160px] bg-bg-elevated/80 px-3 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary backdrop-blur-md">
                Dung lượng
              </td>
              {packages.map((pkg) => (
                <td
                  key={pkg.id}
                  className="border-b border-border px-3 py-3 text-sm text-text-primary"
                >
                  <div className="inline-flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-brand-300" strokeWidth={2} />
                    {pkg.data}
                  </div>
                </td>
              ))}
            </tr>

            {/* Speed */}
            <tr>
              <td className="sticky left-0 z-10 min-w-[160px] bg-bg-elevated/80 px-3 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary backdrop-blur-md">
                Tốc độ
              </td>
              {packages.map((pkg) => (
                <td
                  key={pkg.id}
                  className="border-b border-border px-3 py-3 text-sm text-text-primary"
                >
                  <div className="inline-flex items-center gap-2">
                    <Gauge className="h-3.5 w-3.5 text-accent-400" strokeWidth={2} />
                    {pkg.speed}
                  </div>
                </td>
              ))}
            </tr>

            {/* Hotspot */}
            <tr>
              <td className="sticky left-0 z-10 min-w-[160px] bg-bg-elevated/80 px-3 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary backdrop-blur-md">
                Phát WiFi
              </td>
              {packages.map((pkg) => (
                <td
                  key={pkg.id}
                  className="border-b border-border px-3 py-3"
                >
                  {pkg.hotspot ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                      <span className="text-sm">Có</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-text-secondary">
                      <XCircle className="h-4 w-4" strokeWidth={2} />
                      <span className="text-sm">Không</span>
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Features */}
            {allFeatures.map((feature, idx) => (
              <tr key={idx}>
                <td className="sticky left-0 z-10 min-w-[160px] bg-bg-elevated/80 px-3 py-3 text-xs text-text-secondary backdrop-blur-md">
                  {feature}
                </td>
                {packages.map((pkg) => (
                  <td
                    key={pkg.id}
                    className="border-b border-border px-3 py-3"
                  >
                    {pkg.features.includes(feature) ? (
                      <CheckCircle2
                        className="h-4 w-4 text-emerald-400"
                        strokeWidth={2.2}
                      />
                    ) : (
                      <XCircle
                        className="h-4 w-4 text-text-secondary/60"
                        strokeWidth={2}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
