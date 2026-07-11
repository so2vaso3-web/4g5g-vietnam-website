'use client';

import { useState, useEffect } from 'react';
import PlanCard from './PlanCard';
import CompareModal from './CompareModal';
import AlertModal from './AlertModal';
import { Package } from '@/types';
import { defaultPackages } from '@/lib/data';

export default function PlansSection() {
  const [packages, setPackages] = useState<Package[]>(defaultPackages);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', type: 'warning' as 'info' | 'success' | 'warning' | 'error' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load packages from server/localStorage
      const loadPackages = async () => {
        try {
          // Try to load from server first
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
              console.log('✅ Loaded packages from server:', data.packages.length);
              return;
            }
          }
        } catch (error) {
          console.error('Error loading packages from server:', error);
        }

        // Fallback: Load from localStorage
        try {
          const saved = localStorage.getItem('packages');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPackages(parsed);
              console.log('✅ Loaded packages from localStorage:', parsed.length);
              return;
            }
          }
        } catch (e) {
          console.error('Error loading from localStorage:', e);
        }

        // Final fallback: Use defaults
        setPackages(defaultPackages);
        console.log('⚠️ Using default packages');
      };

      loadPackages();

      // Listen for packages updated event
      const handlePackagesUpdated = () => {
        console.log('🔄 Packages updated event received, reloading...');
        loadPackages();
      };

      window.addEventListener('packagesUpdated', handlePackagesUpdated);
      
      // Listen for storage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'packages') {
          console.log('🔄 Storage changed, reloading packages...');
          loadPackages();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);

      // Polling: Check for updates every 5 seconds
      const pollInterval = setInterval(() => {
        loadPackages();
      }, 5000);
      
      // Listen for carrier filter events from CarrierSection
      const handleFilterByCarrier = (event: Event) => {
        const customEvent = event as CustomEvent;
        const carrier = customEvent.detail?.carrier;
        const validCarriers = ['Viettel', 'Vinaphone', 'MobiFone', 'Vietnamobile', 'Gmobile', 'iTel', 'Wintel', 'VNSKY', 'Local'];
        if (carrier && validCarriers.includes(carrier)) {
          setFilter(carrier);
        }
      };
      
      window.addEventListener('filterByCarrier', handleFilterByCarrier);
      
      return () => {
        clearInterval(pollInterval);
        window.removeEventListener('packagesUpdated', handlePackagesUpdated);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('filterByCarrier', handleFilterByCarrier);
      };
    }
  }, []);

  const filteredAndSortedPackages = packages
    .filter(pkg => {
      if (filter === 'all') return true;
      if (filter === 'annual') return pkg.validity?.includes('năm') || pkg.validity?.includes('year');
      return pkg.carrier === filter;
    })
    .filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.carrier.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  const carriers = ['Viettel', 'Vinaphone', 'MobiFone', 'Vietnamobile', 'Gmobile', 'iTel', 'Wintel', 'VNSKY', 'Local'];

  const handleToggleCompare = (planId: string) => {
    setCompareList(prev => {
      if (prev.includes(planId)) {
        const newList = prev.filter(id => id !== planId);
        if (newList.length === 0) {
          setShowCompareModal(false);
        }
        return newList;
      } else {
        if (prev.length >= 4) {
          setAlertModal({ isOpen: true, message: 'Bạn chỉ có thể so sánh tối đa 4 gói cước cùng lúc!', type: 'warning' });
          return prev;
        }
        return [...prev, planId];
      }
    });
  };

  const handleRemoveFromCompare = (planId: string) => {
    setCompareList(prev => {
      const newList = prev.filter(id => id !== planId);
      if (newList.length === 0) {
        setShowCompareModal(false);
      }
      return newList;
    });
  };

  const comparePackages = packages.filter(pkg => compareList.includes(pkg.id));

  return (
    <section id="plans" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-white via-light-gray to-white">
      {/* Compare Button - Fixed */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-6 py-4 bg-gradient-primary text-white rounded-2xl font-vietnam font-bold shadow-soft-blue hover:shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-3 min-h-[56px] group animate-bounce"
          >
            <i className="fas fa-balance-scale text-xl group-hover:rotate-12 transition-transform"></i>
            <span>So Sánh ({compareList.length})</span>
          </button>
        </div>
      )}

      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-light-gray text-primary-blue font-vietnam font-bold text-sm mb-4">
            <i className="fas fa-mobile-alt"></i>
            Các Gói Cước
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-vietnam font-900 mb-6 text-dark-gray">
            Chọn Gói Cước <span className="gradient-text-primary">Phù Hợp</span>
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            So sánh các gói cước từ 9 nhà mạng hàng đầu Việt Nam. Tìm gói cước tốt nhất cho nhu cầu của bạn.
          </p>
        </div>

        {/* Filters and controls */}
        <div className="mb-12 space-y-6">
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-vietnam font-bold min-h-[48px] ${
                filter === 'all' 
                  ? 'bg-gradient-primary text-white shadow-soft-blue' 
                  : 'bg-light-gray text-dark-gray hover:bg-medium-gray border border-medium-gray hover:border-primary-blue'
              }`}
            >
              ✨ Tất Cả Gói
            </button>
            {carriers.map(carrier => (
              <button
                key={carrier}
                onClick={() => setFilter(carrier)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-vietnam font-bold min-h-[48px] ${
                  filter === carrier 
                    ? 'bg-gradient-primary text-white shadow-soft-blue' 
                    : 'bg-light-gray text-dark-gray hover:bg-medium-gray border border-medium-gray hover:border-primary-blue'
                }`}
              >
                {carrier}
              </button>
            ))}
            <button
              onClick={() => setFilter('annual')}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-vietnam font-bold min-h-[48px] ${
                filter === 'annual' 
                  ? 'bg-gradient-secondary text-white shadow-soft-teal' 
                  : 'bg-light-gray text-dark-gray hover:bg-medium-gray border border-medium-gray hover:border-primary-blue'
              }`}
            >
              <i className="fas fa-calendar-alt mr-2"></i>
              Gói Năm
            </button>
          </div>

          {/* Search and sort */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative w-full sm:w-auto sm:min-w-[320px]">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-light"></i>
              <input
                type="text"
                placeholder="Tìm kiếm gói cước..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-dark-gray placeholder-text-light border border-medium-gray focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/30 transition-all font-vietnam"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'name')}
              className="w-full sm:w-auto sm:min-w-[240px] px-4 py-3.5 rounded-xl bg-white text-dark-gray border border-medium-gray focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/30 transition-all cursor-pointer font-vietnam font-medium"
            >
              <option value="price">📊 Sắp xếp theo Giá</option>
              <option value="name">📝 Sắp xếp theo Tên</option>
            </select>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAndSortedPackages.length > 0 ? (
            filteredAndSortedPackages.map(pkg => (
              <PlanCard
                key={pkg.id}
                pkg={pkg}
                isInCompareList={compareList.includes(pkg.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 px-4">
              <div className="inline-flex w-16 h-16 rounded-full bg-light-gray items-center justify-center mb-6">
                <i className="fas fa-search text-3xl text-text-light"></i>
              </div>
              <p className="text-lg text-text-light font-vietnam mb-2">Không tìm thấy gói cước nào</p>
              <p className="text-sm text-text-light">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn</p>
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

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <AlertModal
          message={alertModal.message}
          type={alertModal.type}
          onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        />
      )}
    </section>
  );
}

