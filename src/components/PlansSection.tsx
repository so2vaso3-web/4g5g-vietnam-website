'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Scale, SearchX, CalendarDays } from 'lucide-react';
import PlanCard from './PlanCard';
import CompareModal from './CompareModal';
import AlertModal from './AlertModal';
import { Package } from '@/types';
import { defaultPackages } from '@/lib/data';
import EmptyState from './ui/EmptyState';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

export default function PlansSection() {
  const [packages, setPackages] = useState<Package[]>(defaultPackages);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: '',
    type: 'warning' as 'info' | 'success' | 'warning' | 'error',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadPackages = async () => {
      try {
        const response = await fetch(`/api/packages?t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.packages) && data.packages.length > 0) {
            setPackages(data.packages);
            localStorage.setItem('packages', JSON.stringify(data.packages));
            return;
          }
        }
      } catch {
        /* ignore, fallback */
      }

      try {
        const saved = localStorage.getItem('packages');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPackages(parsed);
            return;
          }
        }
      } catch {
        /* ignore */
      }
      setPackages(defaultPackages);
    };

    loadPackages();

    const handlePackagesUpdated = () => loadPackages();
    window.addEventListener('packagesUpdated', handlePackagesUpdated);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'packages') loadPackages();
    };
    window.addEventListener('storage', handleStorageChange);

    const pollInterval = setInterval(loadPackages, 5000);

    const handleFilterByCarrier = (event: Event) => {
      const customEvent = event as CustomEvent;
      const carrier = customEvent.detail?.carrier;
      const validCarriers = [
        'Viettel',
        'Vinaphone',
        'MobiFone',
        'Vietnamobile',
        'Gmobile',
        'iTel',
        'Wintel',
        'VNSKY',
        'Local',
      ];
      if (carrier && validCarriers.includes(carrier)) setFilter(carrier);
    };
    window.addEventListener('filterByCarrier', handleFilterByCarrier);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('packagesUpdated', handlePackagesUpdated);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('filterByCarrier', handleFilterByCarrier);
    };
  }, []);

  const filteredAndSortedPackages = packages
    .filter((pkg) => {
      if (filter === 'all') return true;
      if (filter === 'annual')
        return pkg.validity?.includes('năm') || pkg.validity?.includes('year');
      return pkg.carrier === filter;
    })
    .filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.carrier.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  const carriers = [
    'Viettel',
    'Vinaphone',
    'MobiFone',
    'Vietnamobile',
    'Gmobile',
    'iTel',
    'Wintel',
    'VNSKY',
    'Local',
  ];

  const handleToggleCompare = (planId: string) => {
    setCompareList((prev) => {
      if (prev.includes(planId)) {
        const newList = prev.filter((id) => id !== planId);
        if (newList.length === 0) setShowCompareModal(false);
        return newList;
      }
      if (prev.length >= 4) {
        setAlertModal({
          isOpen: true,
          message: 'Bạn chỉ có thể so sánh tối đa 4 gói cước cùng lúc!',
          type: 'warning',
        });
        return prev;
      }
      return [...prev, planId];
    });
  };

  const handleRemoveFromCompare = (planId: string) => {
    setCompareList((prev) => {
      const newList = prev.filter((id) => id !== planId);
      if (newList.length === 0) setShowCompareModal(false);
      return newList;
    });
  };

  const comparePackages = packages.filter((pkg) => compareList.includes(pkg.id));

  return (
    <section id="plans" className="relative py-20 sm:py-24">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-500/5 to-transparent"
      />

      {/* Compare floating button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setShowCompareModal(true)}
            className="btn btn-primary animate-fade-in-up !h-12 !rounded-2xl !px-5 shadow-glow-blue"
          >
            <Scale className="h-4 w-4" strokeWidth={2} />
            So sánh ({compareList.length})
            {compareList.length >= 2 && (
              <span className="ml-1 rounded-md bg-white/15 px-1.5 py-0.5 text-[11px] font-bold">
                Xem
              </span>
            )}
          </button>
        </div>
      )}

      <div className="container-app relative">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2.2} />
            Danh mục gói cước
          </span>
          <h2 className="section-title mt-5">
            <span className="text-gradient">Chọn gói cước của bạn</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
            Lọc theo nhà mạng, tìm kiếm theo tên, sắp xếp theo giá — chọn gói phù hợp nhất với
            nhu cầu của bạn.
          </p>
        </div>

        {/* Filters + Search */}
        <div className="mt-10 space-y-4">
          {/* Carrier chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={[
                'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
                filter === 'all'
                  ? 'border border-brand-400/40 bg-gradient-brand text-white shadow-glow-blue'
                  : 'border border-border bg-white/5 text-text-secondary hover:border-border-strong hover:text-text-primary',
              ].join(' ')}
            >
              Tất cả gói
            </button>
            {carriers.map((carrier) => (
              <button
                key={carrier}
                type="button"
                onClick={() => setFilter(carrier)}
                className={[
                  'rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200',
                  filter === carrier
                    ? 'border-brand-400/40 bg-gradient-brand text-white shadow-glow-blue'
                    : 'border-border bg-white/5 text-text-secondary hover:border-border-strong hover:text-text-primary',
                ].join(' ')}
              >
                {carrier}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFilter('annual')}
              className={[
                'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200',
                filter === 'annual'
                  ? 'border-emerald-400/40 bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#04111a] shadow-[0_8px_30px_-8px_rgba(34,197,94,0.55)]'
                  : 'border-border bg-white/5 text-text-secondary hover:border-border-strong hover:text-text-primary',
              ].join(' ')}
            >
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
              Gói năm
            </button>
          </div>

          {/* Search + Sort */}
          <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-3 sm:flex-row">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm gói cước..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4" strokeWidth={2} />}
              />
            </div>
            <div className="sm:w-56">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'name')}
                leftIcon={<ArrowUpDown className="h-4 w-4" strokeWidth={2} />}
              >
                <option value="price">Sắp xếp theo Giá</option>
                <option value="name">Sắp xếp theo Tên</option>
              </Select>
            </div>
          </div>

          {/* Result count */}
          <div className="text-center text-xs uppercase tracking-wider text-text-secondary">
            Hiển thị{' '}
            <span className="font-bold text-text-primary">
              {filteredAndSortedPackages.length}
            </span>{' '}
            / {packages.length} gói cước
          </div>
        </div>

        {/* Plans grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {filteredAndSortedPackages.length > 0 ? (
            filteredAndSortedPackages.map((pkg) => (
              <PlanCard
                key={pkg.id}
                pkg={pkg}
                isInCompareList={compareList.includes(pkg.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon={<SearchX className="h-7 w-7" strokeWidth={1.8} />}
                title="Không tìm thấy gói cước nào"
                description="Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn."
              />
            </div>
          )}
        </div>
      </div>

      {/* Compare Modal */}
      {showCompareModal && comparePackages.length > 0 && (
        <CompareModal
          packages={comparePackages}
          onClose={() => setShowCompareModal(false)}
          onRemove={handleRemoveFromCompare}
        />
      )}

      {/* Alert modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </section>
  );
}
