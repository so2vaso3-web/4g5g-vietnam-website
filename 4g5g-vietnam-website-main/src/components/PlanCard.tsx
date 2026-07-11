'use client';

import { useState, useRef, useEffect } from 'react';
import { Package } from '@/types';
import PaymentModal from './PaymentModal';

interface PlanCardProps {
  pkg: Package;
  isInCompareList?: boolean;
  onToggleCompare?: (planId: string) => void;
}

export default function PlanCard({ pkg, isInCompareList = false, onToggleCompare }: PlanCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [carrierLogos, setCarrierLogos] = useState<Record<string, string>>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const carrierNames: Record<string, string> = {
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

  // Load carrier logos from settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('ul') ||
      target.closest('li') ||
      target.closest('.more-features-link')
    ) {
      return;
    }
    setShowPaymentModal(true);
  };

  const handleMoreFeatures = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowFeaturesModal(true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowPaymentModal(true);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleCompare) {
      onToggleCompare(pkg.id);
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={handleCardClick}
        className={`card-modern group relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-soft-lg hover:-translate-y-2 h-full flex flex-col ${
          isInCompareList ? 'ring-2 ring-primary-blue bg-blue-50' : 'bg-white'
        }`}
      >
        {/* Premium glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/5 to-accent-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        
        {/* Badge */}
        {pkg.badge && (
          <div className="absolute top-4 right-4 z-20">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-vietnam font-bold text-white text-sm ${
              pkg.badge === 'HOT' 
                ? 'bg-gradient-primary shadow-soft-blue' 
                : pkg.badge === 'BEST VALUE'
                ? 'bg-gradient-secondary'
                : 'bg-accent-teal'
            }`}>
              {pkg.badge === 'TIẾT KIỆM' && <i className="fas fa-tag"></i>}
              {pkg.badge === 'BEST VALUE' && <i className="fas fa-star"></i>}
              {pkg.badge === 'PREMIUM' && <i className="fas fa-crown"></i>}
              {pkg.badge === 'NEW' && <i className="fas fa-sparkles"></i>}
              {pkg.badge === 'HOT' && <i className="fas fa-fire"></i>}
              {pkg.badge}
            </span>
          </div>
        )}
        
        {/* Compare indicator */}
        {isInCompareList && (
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-accent-teal text-white font-vietnam font-bold text-sm shadow-soft">
              <i className="fas fa-check-circle"></i>
              <span>So Sánh</span>
            </span>
          </div>
        )}

        {/* Content */}
        <div className="mb-6 flex-1">
          {/* Carrier */}
          <div className="mb-4">
            {carrierLogos[pkg.carrier] ? (
              <div className="inline-flex bg-light-gray rounded-lg p-2 border border-medium-gray">
                <img
                  src={carrierLogos[pkg.carrier]}
                  alt={carrierNames[pkg.carrier] || pkg.carrier}
                  className="h-6 w-auto object-contain"
                />
              </div>
            ) : (
              <div className="text-sm font-vietnam font-bold text-primary-blue uppercase tracking-wider">
                {carrierNames[pkg.carrier] || pkg.carrier}
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="text-xl font-vietnam font-bold text-dark-gray mb-2 line-clamp-2">
            {pkg.name}
          </h3>

          {/* Description */}
          {pkg.description && (
            <p className="text-sm text-text-light mb-4 line-clamp-2 leading-relaxed">
              {pkg.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-6 pb-6 border-b border-medium-gray">
            <div className="flex items-baseline gap-2 mb-2">
              {pkg.originalPrice && (
                <span className="text-sm text-text-light line-through">
                  {pkg.originalPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
              <span className="text-3xl font-vietnam font-900 gradient-text-primary">
                {pkg.price.toLocaleString('vi-VN')}₫
              </span>
              <span className="text-text-light">/{pkg.validity || 'tháng'}</span>
            </div>
            {pkg.originalPrice && (
              <span className="inline-block text-sm font-vietnam font-bold text-white bg-gradient-primary px-3 py-1 rounded-lg">
                -{Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Features list */}
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3 text-dark-gray">
              <i className="fas fa-check-circle text-accent-teal text-lg flex-shrink-0 mt-0.5"></i>
              <span className="font-vietnam font-medium text-base">{pkg.data} Data</span>
            </li>
            <li className="flex items-start gap-3 text-dark-gray">
              <i className="fas fa-check-circle text-accent-teal text-lg flex-shrink-0 mt-0.5"></i>
              <span className="font-vietnam font-medium text-base">Tốc độ {pkg.speed}</span>
            </li>
            {pkg.hotspot && (
              <li className="flex items-start gap-3 text-dark-gray">
                <i className="fas fa-check-circle text-accent-teal text-lg flex-shrink-0 mt-0.5"></i>
                <span className="font-vietnam font-medium text-base">Phát WiFi Miễn Phí</span>
              </li>
            )}
            {pkg.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-dark-gray">
                <i className="fas fa-check-circle text-accent-teal text-lg flex-shrink-0 mt-0.5"></i>
                <span className="font-vietnam text-base line-clamp-2">{feature}</span>
              </li>
            ))}
          </ul>

          {/* More features link */}
          {pkg.features.length > 3 && (
            <button
              className="more-features-link text-primary-blue hover:text-secondary-blue transition-colors text-sm font-vietnam font-bold flex items-center gap-2 mb-6 group"
              onClick={handleMoreFeatures}
            >
              <i className="fas fa-ellipsis-h group-hover:scale-110 transition-transform"></i>
              <span>+{pkg.features.length - 3} tính năng khác</span>
              <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={handleBuyNow}
            className="flex-1 px-6 py-3.5 bg-gradient-primary text-white rounded-xl font-vietnam font-bold text-base hover:shadow-soft-blue transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
          >
            <i className="fas fa-shopping-cart group-hover:scale-110 transition-transform"></i>
            <span>Mua Ngay</span>
          </button>
          <button
            onClick={handleCompare}
            className={`px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center font-vietnam font-bold ${
              isInCompareList
                ? 'bg-gradient-secondary text-white shadow-soft'
                : 'bg-light-gray border-2 border-primary-blue/20 text-primary-blue hover:bg-primary-blue/10 hover:border-primary-blue/50'
            }`}
            title={isInCompareList ? 'Xóa khỏi So Sánh' : 'Thêm vào So Sánh'}
          >
            <i className={`fas ${isInCompareList ? 'fa-check-circle' : 'fa-balance-scale'}`}></i>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showPaymentModal && (
        <PaymentModal pkg={pkg} onClose={() => setShowPaymentModal(false)} />
      )}

      {showFeaturesModal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowFeaturesModal(false)}
        >
          <div 
            className="card-modern max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-vietnam font-bold gradient-text-primary">
                Tất Cả Tính Năng
              </h3>
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="p-2 rounded-lg hover:bg-light-gray transition-colors"
              >
                <i className="fas fa-times text-xl text-dark-gray"></i>
              </button>
            </div>
            
            {/* Package info */}
            <div className="mb-6 pb-6 border-b border-medium-gray">
              <div className="mb-3">
                {carrierLogos[pkg.carrier] ? (
                  <div className="inline-flex bg-light-gray rounded-lg p-2 border border-medium-gray">
                    <img
                      src={carrierLogos[pkg.carrier]}
                      alt={carrierNames[pkg.carrier] || pkg.carrier}
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-sm font-vietnam font-bold text-primary-blue uppercase">
                    {carrierNames[pkg.carrier] || pkg.carrier}
                  </div>
                )}
              </div>
              <h4 className="text-xl font-vietnam font-bold text-dark-gray mb-3">{pkg.name}</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-vietnam font-900 gradient-text-primary">
                  {pkg.price.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-text-light">/{pkg.validity || 'tháng'}</span>
              </div>
            </div>

            {/* Full features list */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-dark-gray">
                <i className="fas fa-check-circle text-accent-teal text-xl flex-shrink-0"></i>
                <span className="font-vietnam font-medium text-lg">{pkg.data} Data</span>
              </div>
              <div className="flex items-start gap-3 text-dark-gray">
                <i className="fas fa-check-circle text-accent-teal text-xl flex-shrink-0"></i>
                <span className="font-vietnam font-medium text-lg">Tốc độ {pkg.speed}</span>
              </div>
              {pkg.hotspot && (
                <div className="flex items-start gap-3 text-dark-gray">
                  <i className="fas fa-check-circle text-accent-teal text-xl flex-shrink-0"></i>
                  <span className="font-vietnam font-medium text-lg">Phát WiFi Miễn Phí</span>
                </div>
              )}
              {pkg.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 text-dark-gray">
                  <i className="fas fa-check-circle text-accent-teal text-xl flex-shrink-0"></i>
                  <span className="font-vietnam text-lg">{feature}</span>
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowFeaturesModal(false)}
              className="w-full px-6 py-3 bg-gradient-primary text-white rounded-xl font-vietnam font-bold text-lg hover:shadow-soft-blue transition-all hover:scale-105"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

