'use client';

import { useState, useEffect } from 'react';
import { Package } from '@/types';
import { defaultPackages } from '@/lib/data';
import { savePackagesToServer, notifyPackagesUpdated } from '@/lib/usePackages';
import Toast from '@/components/Toast';

export default function PackageManagement() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [editingPackage, setEditingPackage] = useState<Partial<Package> & { period?: 'month' | 'year' } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCarrier, setFilterCarrier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'carrier' | 'data'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const loadPackages = async (force = false) => {
    if (hasLocalChanges && !force) {
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        const response = await fetch('/api/packages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.packages) && data.packages.length > 0) {
            setPackages(data.packages);
            localStorage.setItem('packages', JSON.stringify(data.packages));
            setInitialLoad(false);
            setHasLocalChanges(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading packages from server:', error);
      }

      if (initialLoad) {
        const saved = localStorage.getItem('packages');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPackages(parsed);
              setInitialLoad(false);
              setHasLocalChanges(false);
              return;
            }
          } catch (e) {
            console.error('Error loading packages from localStorage:', e);
          }
        }

        setPackages(defaultPackages);
        localStorage.setItem('packages', JSON.stringify(defaultPackages));
        setInitialLoad(false);
        setHasLocalChanges(false);
      }
    }
  };

  useEffect(() => {
    loadPackages(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handlePackagesUpdated = () => {
      if (!hasLocalChanges && !showForm) {
        loadPackages(true);
      }
    };
    window.addEventListener('packagesUpdated', handlePackagesUpdated);
    
    return () => {
      window.removeEventListener('packagesUpdated', handlePackagesUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLocalChanges, showForm]);

  // Ensure modal is always visible when opened
  useEffect(() => {
    if (showForm && editingPackage) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      // Scroll to top immediately
      window.scrollTo(0, 0);
      // Focus modal after a brief delay to ensure it's rendered
      setTimeout(() => {
        const modal = document.querySelector('[data-modal="package-form"]');
        if (modal) {
          (modal as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          (modal as HTMLElement).focus();
        }
      }, 50);
    } else {
      // Unlock body scroll when modal closes
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [showForm, editingPackage]);

  const savePackages = async (updatedPackages: Package[]) => {
    // Update local state immediately
    setPackages(updatedPackages);
    setHasLocalChanges(false);
    
    // Save to localStorage immediately
    localStorage.setItem('packages', JSON.stringify(updatedPackages));
    
    // Save to server
    const success = await savePackagesToServer(updatedPackages);
    
    if (success) {
      setToast({ message: 'Đã lưu gói cước thành công! Tất cả thiết bị và người dùng sẽ thấy cập nhật trong vòng 5 giây.', type: 'success' });
      // Don't reload immediately - keep the current state
      // Only reload after a longer delay to ensure server has updated
      setTimeout(() => {
        // Only reload if user hasn't made more changes
        if (!hasLocalChanges) {
          loadPackages(true);
        }
      }, 3000);
    } else {
      // Even if server save fails, keep the local state
      setToast({ message: 'Đã lưu vào cache local, nhưng không thể lưu lên server. Vui lòng thử lại hoặc kiểm tra kết nối.', type: 'warning' });
      notifyPackagesUpdated();
    }
  };

  const handleDelete = (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (window.confirm(`Bạn có chắc chắn muốn xóa gói cước "${pkg?.name}"?`)) {
      const updated = packages.filter(p => p.id !== id);
      savePackages(updated);
      setToast({ message: `Đã xóa gói cước "${pkg?.name}"!`, type: 'success' });
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage({ ...pkg });
    setShowForm(true);
    setHasLocalChanges(true);
  };

  const handleAdd = () => {
    setEditingPackage({
      id: `pkg-${Date.now()}`,
      carrier: 'Viettel',
      name: '',
      price: 0,
      data: '',
      speed: '4G',
      validity: '30 ngày',
      features: [],
    });
    setShowForm(true);
    setHasLocalChanges(true);
  };

  const handleSave = () => {
    if (!editingPackage) return;

    if (!editingPackage.name || editingPackage.name.trim() === '') {
      setToast({ message: 'Vui lòng điền tên gói cước!', type: 'error' });
      return;
    }

    if (!editingPackage.price || editingPackage.price <= 0) {
      setToast({ message: 'Vui lòng nhập giá hợp lệ (lớn hơn 0)!', type: 'error' });
      return;
    }

    if (!editingPackage.id || editingPackage.id.trim() === '') {
      setToast({ message: 'Vui lòng nhập ID cho gói cước!', type: 'error' });
      return;
    }

    // Ensure price is a number
    const price = typeof editingPackage.price === 'number' 
      ? editingPackage.price 
      : parseFloat(String(editingPackage.price)) || 0;
    
    const originalPrice = editingPackage.originalPrice 
      ? (typeof editingPackage.originalPrice === 'number' 
          ? editingPackage.originalPrice 
          : parseFloat(String(editingPackage.originalPrice)) || undefined)
      : undefined;

    const pkg: Package = {
      id: editingPackage.id.trim(),
      name: editingPackage.name.trim(),
      carrier: editingPackage.carrier || 'Viettel',
      price: price,
      data: editingPackage.data || '',
      speed: editingPackage.speed || '4G',
      validity: editingPackage.validity || '30 ngày',
      callMinutes: editingPackage.callMinutes,
      sms: editingPackage.sms,
      hotspot: editingPackage.hotspot,
      features: editingPackage.features || [],
      badge: editingPackage.badge,
      description: editingPackage.description,
      originalPrice: originalPrice,
    };

    // Find existing package to determine if it's an update or new
    const existingIndex = packages.findIndex(p => p.id === pkg.id);
    const isUpdate = existingIndex >= 0;
    
    const updated = isUpdate
      ? packages.map((p, index) => index === existingIndex ? pkg : p)
      : [...packages, pkg];

    // Close modal first
    setShowForm(false);
    setEditingPackage(null);
    
    // Save packages
    savePackages(updated);
    
    console.log('✅ Package saved:', {
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      isUpdate,
      totalPackages: updated.length
    });
  };

  const carriers = ['Viettel', 'Vinaphone', 'MobiFone', 'Vietnamobile', 'Gmobile', 'iTel', 'Wintel', 'VNSKY', 'Local'];
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

  // Filter and sort packages
  const filteredAndSortedPackages = packages
    .filter(pkg => {
      // Filter by carrier
      if (filterCarrier !== 'all' && pkg.carrier !== filterCarrier) return false;
      
      // Filter by search term
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          pkg.id.toLowerCase().includes(search) ||
          pkg.name.toLowerCase().includes(search) ||
          pkg.carrier.toLowerCase().includes(search) ||
          pkg.data.toLowerCase().includes(search) ||
          (pkg.badge && pkg.badge.toLowerCase().includes(search))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'carrier':
          aValue = a.carrier.toLowerCase();
          bValue = b.carrier.toLowerCase();
          break;
        case 'data':
          aValue = a.data.toLowerCase();
          bValue = b.data.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Quản Lý Gói Cước</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              const json = JSON.stringify(packages, null, 2);
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `packages_${new Date().toISOString().split('T')[0]}.json`;
              link.click();
              URL.revokeObjectURL(url);
              setToast({ message: 'Đã xuất file JSON thành công!', type: 'success' });
            }}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-download"></i>
            <span>Xuất JSON</span>
          </button>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = async (event) => {
                    try {
                      if (!event.target?.result) return;
                      const imported = JSON.parse(event.target.result as string);
                      if (Array.isArray(imported)) {
                        if (confirm(`Bạn có chắc chắn muốn import ${imported.length} gói cước? Gói cước hiện tại sẽ bị thay thế.`)) {
                          setPackages(imported);
                          localStorage.setItem('packages', JSON.stringify(imported));
                          const success = await savePackagesToServer(imported);
                          if (success) {
                            setToast({ message: 'Đã import thành công! Tất cả thiết bị và người dùng sẽ thấy cập nhật trong vòng 5 giây.', type: 'success' });
                          } else {
                            setToast({ message: 'Đã import vào cache local, nhưng không thể lưu lên server. Vui lòng thử lại.', type: 'warning' });
                            notifyPackagesUpdated();
                          }
                        }
                      } else {
                        setToast({ message: 'File không hợp lệ! Vui lòng chọn file JSON đúng định dạng.', type: 'error' });
                      }
                    } catch (error) {
                      setToast({ message: 'Lỗi đọc file! Vui lòng kiểm tra file và thử lại.', type: 'error' });
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-upload"></i>
            <span>Import JSON</span>
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            <span>Thêm Gói Mới</span>
          </button>
        </div>
      </div>

      {showForm && editingPackage && (
        <div 
          data-modal="package-form"
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setEditingPackage(null);
              document.body.style.overflow = '';
            }
          }}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto'
          }}
        >
          <div 
            className="bg-[#1a1f3a] rounded-2xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxHeight: '90vh', 
              overflowY: 'auto',
              margin: 'auto'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {packages.find(p => p.id === editingPackage.id) ? 'Sửa' : 'Thêm'} Gói Cước
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPackage(null);
                  document.body.style.overflow = '';
                }}
                className="text-gray-400 hover:text-white text-2xl transition-colors w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">ID *</label>
                <input
                  type="text"
                  value={editingPackage.id || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, id: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm"
                  placeholder="viettel-4g-30gb"
                  disabled={!!packages.find(p => p.id === editingPackage.id)}
                />
                <small className="text-gray-400 text-xs block mt-1">
                  ID là duy nhất, không thể thay đổi khi đang sửa gói cước có sẵn.
                </small>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Nhà Mạng *</label>
                <select
                  value={editingPackage.carrier || 'Viettel'}
                  onChange={(e) => setEditingPackage({ ...editingPackage, carrier: e.target.value as any })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  {carriers.map(c => (
                    <option key={c} value={c}>{carrierNames[c]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Tên Gói *</label>
                <input
                  type="text"
                  value={editingPackage.name || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="Viettel 4G 30GB"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold">Giá (VND) *</label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={editingPackage.price || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 0 : parseFloat(value);
                      setEditingPackage({ ...editingPackage, price: isNaN(numValue) ? 0 : numValue });
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setEditingPackage({ ...editingPackage, price: value });
                    }}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Nhập giá (VND)"
                  />
                  {editingPackage.price && editingPackage.price > 0 && (
                    <small className="text-gray-400 text-xs block mt-1">
                      {editingPackage.price.toLocaleString('vi-VN')} ₫
                    </small>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Giá Gốc (VND, tùy chọn)</label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={editingPackage.originalPrice || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setEditingPackage({ ...editingPackage, originalPrice: undefined });
                      } else {
                        const numValue = parseFloat(value);
                        setEditingPackage({ ...editingPackage, originalPrice: isNaN(numValue) ? undefined : numValue });
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setEditingPackage({ ...editingPackage, originalPrice: undefined });
                      } else {
                        const numValue = parseFloat(value) || undefined;
                        setEditingPackage({ ...editingPackage, originalPrice: numValue });
                      }
                    }}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Nếu có khuyến mãi"
                  />
                  {editingPackage.originalPrice && editingPackage.originalPrice > 0 && (
                    <small className="text-gray-400 text-xs block mt-1">
                      {editingPackage.originalPrice.toLocaleString('vi-VN')} ₫
                    </small>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-semibold">Data</label>
                  <input
                    type="text"
                    value={editingPackage.data || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, data: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="30GB"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Tốc Độ</label>
                  <input
                    type="text"
                    value={editingPackage.speed || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, speed: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="4G"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Thời Hạn</label>
                  <input
                    type="text"
                    value={editingPackage.validity || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, validity: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="30 ngày"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold">Phút Gọi (tùy chọn)</label>
                  <input
                    type="text"
                    value={editingPackage.callMinutes || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, callMinutes: e.target.value || undefined })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="100 phút"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">SMS (tùy chọn)</label>
                  <input
                    type="text"
                    value={editingPackage.sms || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, sms: e.target.value || undefined })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="100 SMS"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={editingPackage.hotspot || false}
                    onChange={(e) => setEditingPackage({ ...editingPackage, hotspot: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Hỗ trợ phát WiFi (Hotspot)</span>
                </label>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Tính Năng (mỗi dòng một tính năng)</label>
                <textarea
                  value={(editingPackage.features || []).join('\n')}
                  onChange={(e) => setEditingPackage({ ...editingPackage, features: e.target.value.split('\n').filter(f => f.trim()) })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  rows={5}
                  placeholder="4G tốc độ cao&#10;Phát wifi&#10;Không giới hạn tốc độ"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Badge (tùy chọn)</label>
                <input
                  type="text"
                  value={editingPackage.badge || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value || undefined })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="Hot, Mới, Khuyến mãi"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Mô Tả (tùy chọn)</label>
                <textarea
                  value={editingPackage.description || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value || undefined })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  rows={3}
                  placeholder="Mô tả chi tiết về gói cước"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
              <button
                onClick={() => { 
                  if (window.confirm('Bạn có chắc chắn muốn hủy? Thay đổi chưa được lưu sẽ bị mất.')) {
                    setShowForm(false);
                    setEditingPackage(null);
                    document.body.style.overflow = '';
                  }
                }}
                className="flex-1 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleSave();
                  document.body.style.overflow = '';
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-semibold"
              >
                <i className="fas fa-save mr-2"></i>Lưu Gói Cước
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              <i className="fas fa-search mr-2"></i>Tìm Kiếm
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo ID, tên gói, nhà mạng, data, badge..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filter by Carrier */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              <i className="fas fa-filter mr-2"></i>Lọc Nhà Mạng
            </label>
            <select
              value={filterCarrier}
              onChange={(e) => setFilterCarrier(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả nhà mạng</option>
              {carriers.map(c => (
                <option key={c} value={c}>{carrierNames[c]}</option>
              ))}
            </select>
          </div>
          
          {/* Sort */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              <i className="fas fa-sort mr-2"></i>Sắp Xếp
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Theo tên</option>
                <option value="price">Theo giá</option>
                <option value="carrier">Theo nhà mạng</option>
                <option value="data">Theo data</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
              >
                <i className={`fas fa-sort-${sortOrder === 'asc' ? 'amount-down' : 'amount-up'}`}></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-sm text-gray-400">
            Hiển thị <strong className="text-white">{filteredAndSortedPackages.length}</strong> / <strong className="text-white">{packages.length}</strong> gói cước
            {searchTerm && ` (tìm kiếm: "${searchTerm}")`}
            {filterCarrier !== 'all' && ` (nhà mạng: ${carrierNames[filterCarrier]})`}
          </span>
        </div>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <i className="fas fa-box text-4xl mb-4 opacity-50"></i>
          <p>Chưa có gói cước nào. Hãy thêm gói cước mới!</p>
        </div>
      ) : filteredAndSortedPackages.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <i className="fas fa-search text-4xl mb-4 opacity-50"></i>
          <p>Không tìm thấy gói cước nào phù hợp với bộ lọc.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCarrier('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-4 font-semibold">ID</th>
                <th className="text-left p-4 font-semibold">Nhà Mạng</th>
                <th className="text-left p-4 font-semibold">Tên Gói</th>
                <th className="text-left p-4 font-semibold">Giá</th>
                <th className="text-left p-4 font-semibold">Data</th>
                <th className="text-left p-4 font-semibold">Tốc Độ</th>
                <th className="text-left p-4 font-semibold">Thời Hạn</th>
                <th className="text-left p-4 font-semibold">Badge</th>
                <th className="text-left p-4 font-semibold">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPackages.map((pkg, index) => (
                <tr 
                  key={pkg.id} 
                  className={`border-b border-white/5 hover:bg-white/10 transition-colors ${
                    index % 2 === 0 ? 'bg-white/2' : ''
                  }`}
                >
                  <td className="p-4 text-gray-300 font-mono text-sm">{pkg.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{carrierNames[pkg.carrier] || pkg.carrier}</div>
                    <div className="text-xs text-gray-400 capitalize">{pkg.carrier}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{pkg.name}</div>
                    {pkg.description && (
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{pkg.description}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-green-400">{pkg.price.toLocaleString('vi-VN')} ₫</div>
                    {pkg.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">{pkg.originalPrice.toLocaleString('vi-VN')} ₫</div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm font-semibold">
                      {pkg.data}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm font-semibold">
                      {pkg.speed}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{pkg.validity}</td>
                  <td className="p-4">
                    {pkg.badge && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-semibold">
                        {pkg.badge}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="px-3 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
                        title="Sửa gói cước"
                      >
                        <i className="fas fa-edit mr-1"></i>Sửa
                      </button>
                      <button
                        onClick={() => {
                          const duplicate = { ...pkg, id: `pkg-${Date.now()}` };
                          savePackages([...packages, duplicate]);
                          setToast({ message: `Đã nhân đôi gói cước "${pkg.name}"!`, type: 'success' });
                        }}
                        className="px-3 py-1.5 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
                        title="Nhân đôi gói cước"
                      >
                        <i className="fas fa-copy mr-1"></i>Nhân Đôi
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="px-3 py-1.5 bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
                        title="Xóa gói cước"
                      >
                        <i className="fas fa-trash mr-1"></i>Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
