'use client';

import { useState } from 'react';
import AlertModal from '@/components/AlertModal';
import ConfirmModal from '@/components/ConfirmModal';

export default function DataManagement() {
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', type: 'success' as 'info' | 'success' | 'warning' | 'error' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {}, type: 'warning' as 'info' | 'warning' | 'danger', confirmText: 'Xác Nhận', cancelText: 'Hủy' });

  const exportData = (type: 'all' | 'orders' | 'packages' | 'settings') => {
    try {
      let data: any = {};
      
      if (type === 'all' || type === 'orders') {
        const orders = localStorage.getItem('orders');
        if (orders) data.orders = JSON.parse(orders);
      }
      
      if (type === 'all' || type === 'packages') {
        const packages = localStorage.getItem('packages');
        if (packages) data.packages = JSON.parse(packages);
      }
      
      if (type === 'all' || type === 'settings') {
        const settings = localStorage.getItem('adminSettings');
        if (settings) data.settings = JSON.parse(settings);
        const content = localStorage.getItem('websiteContent');
        if (content) data.content = JSON.parse(content);
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${type}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setAlertModal({ isOpen: true, message: `Đã xuất dữ liệu ${type === 'all' ? 'tất cả' : type} thành công!`, type: 'success' });
    } catch (error) {
      console.error('Export error:', error);
      setAlertModal({ isOpen: true, message: 'Lỗi khi xuất dữ liệu!', type: 'error' });
    }
  };

  const importData = (type: 'all' | 'orders' | 'packages' | 'settings') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          setConfirmModal({
            isOpen: true,
            message: `Bạn có chắc chắn muốn nhập dữ liệu ${type === 'all' ? 'tất cả' : type}? Dữ liệu cũ sẽ bị ghi đè!`,
            type: 'warning',
            confirmText: 'Nhập Dữ Liệu',
            cancelText: 'Hủy',
            onConfirm: () => {
              if (type === 'all' || type === 'orders') {
                if (data.orders) {
                  localStorage.setItem('orders', JSON.stringify(data.orders));
                }
              }
              
              if (type === 'all' || type === 'packages') {
                if (data.packages) {
                  localStorage.setItem('packages', JSON.stringify(data.packages));
                }
              }
              
              if (type === 'all' || type === 'settings') {
                if (data.settings) {
                  localStorage.setItem('adminSettings', JSON.stringify(data.settings));
                }
                if (data.content) {
                  localStorage.setItem('websiteContent', JSON.stringify(data.content));
                }
              }
              
              setAlertModal({ isOpen: true, message: `Đã nhập dữ liệu ${type === 'all' ? 'tất cả' : type} thành công! Vui lòng refresh trang.`, type: 'success' });
              setConfirmModal({ ...confirmModal, isOpen: false });
            }
          });
        } catch (error) {
          console.error('Import error:', error);
          setAlertModal({ isOpen: true, message: 'Lỗi khi đọc file! Vui lòng kiểm tra định dạng file.', type: 'error' });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const backupAll = () => {
    exportData('all');
  };

  const restoreAll = () => {
    importData('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="fas fa-database text-blue-400"></i>
          Quản Lý Dữ Liệu
        </h2>
      </div>

      {/* Backup & Restore */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">
          <i className="fas fa-cloud-download-alt mr-2 text-green-400"></i>
          Sao Lưu & Khôi Phục
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={backupAll}
            className="px-6 py-4 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-download text-green-400 text-xl"></i>
            <div className="text-left">
              <div className="font-semibold">Sao Lưu Tất Cả</div>
              <div className="text-sm text-gray-400">Xuất toàn bộ dữ liệu</div>
            </div>
          </button>
          <button
            onClick={restoreAll}
            className="px-6 py-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-upload text-blue-400 text-xl"></i>
            <div className="text-left">
              <div className="font-semibold">Khôi Phục Tất Cả</div>
              <div className="text-sm text-gray-400">Nhập dữ liệu từ file</div>
            </div>
          </button>
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">
          <i className="fas fa-file-export mr-2 text-purple-400"></i>
          Xuất Dữ Liệu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => exportData('orders')}
            className="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg transition-all flex flex-col items-center gap-2"
          >
            <i className="fas fa-shopping-cart text-purple-400 text-2xl"></i>
            <span className="font-semibold">Đơn Hàng</span>
          </button>
          <button
            onClick={() => exportData('packages')}
            className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg transition-all flex flex-col items-center gap-2"
          >
            <i className="fas fa-box text-blue-400 text-2xl"></i>
            <span className="font-semibold">Gói Cước</span>
          </button>
          <button
            onClick={() => exportData('settings')}
            className="px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-lg transition-all flex flex-col items-center gap-2"
          >
            <i className="fas fa-cog text-yellow-400 text-2xl"></i>
            <span className="font-semibold">Cài Đặt</span>
          </button>
          <button
            onClick={() => exportData('all')}
            className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg transition-all flex flex-col items-center gap-2"
          >
            <i className="fas fa-database text-green-400 text-2xl"></i>
            <span className="font-semibold">Tất Cả</span>
          </button>
        </div>
      </div>

      {/* Import Data */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">
          <i className="fas fa-file-import mr-2 text-orange-400"></i>
          Nhập Dữ Liệu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => importData('orders')}
            className="px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 rounded-lg transition-all flex flex-col items-center gap-2"
          >
            <i className="fas fa-shopping-cart text-orange-400 text-2xl"></i>
            <span className="font-semibold">Đơn Hàng</span>
          </button>
          <button
            onClick={() => importData('packages')}
            className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg transition-all flex flex-col items-center gap-2"
          >
            <i className="fas fa-box text-blue-400 text-2xl"></i>
            <span className="font-semibold">Gói Cước</span>
          </button>
          <button
            onClick={() => importData('settings')}
            className="px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-lg transition-all flex flex-col items-center gap-2"
          >
            <i className="fas fa-cog text-yellow-400 text-2xl"></i>
            <span className="font-semibold">Cài Đặt</span>
          </button>
          <button
            onClick={() => importData('all')}
            className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg transition-all flex flex-col items-center gap-2"
          >
            <i className="fas fa-database text-green-400 text-2xl"></i>
            <span className="font-semibold">Tất Cả</span>
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-exclamation-triangle text-yellow-400 text-xl mt-1"></i>
          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">Lưu Ý Quan Trọng</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Sao lưu dữ liệu thường xuyên để tránh mất mát</li>
              <li>• Khi nhập dữ liệu, dữ liệu cũ sẽ bị ghi đè</li>
              <li>• Kiểm tra file trước khi nhập để đảm bảo đúng định dạng</li>
              <li>• Nên tạo backup trước khi nhập dữ liệu mới</li>
            </ul>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  );
}








