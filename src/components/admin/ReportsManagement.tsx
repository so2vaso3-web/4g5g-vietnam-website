'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';

export default function ReportsManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        // Đảm bảo data là array
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('API returned non-array data:', data);
          setOrders([]);
        }
      } else {
        // Nếu API lỗi, thử load từ localStorage
        if (typeof window !== 'undefined') {
          const localOrders = localStorage.getItem('orders');
          if (localOrders) {
            try {
              const parsed = JSON.parse(localOrders);
              setOrders(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
              setOrders([]);
            }
          } else {
            setOrders([]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        const localOrders = localStorage.getItem('orders');
        if (localOrders) {
          try {
            const parsed = JSON.parse(localOrders);
            setOrders(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            setOrders([]);
          }
        } else {
          setOrders([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return (date: string) => {
          const d = new Date(date);
          return d.toDateString() === now.toDateString();
        };
      case 'week':
        return (date: string) => {
          const d = new Date(date);
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return d >= weekAgo;
        };
      case 'month':
        return (date: string) => {
          const d = new Date(date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        };
      case 'year':
        return (date: string) => {
          const d = new Date(date);
          return d.getFullYear() === now.getFullYear();
        };
      default:
        return () => true;
    }
  };

  // Đảm bảo orders là array trước khi filter
  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = safeOrders.filter(o => o && o.createdAt && getDateFilter()(o.createdAt));
  const completedOrders = filteredOrders.filter(o => o.status === 'completed');
  const pendingOrders = filteredOrders.filter(o => o.status === 'pending');
  const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled');

  const revenue = completedOrders.reduce((sum, o) => sum + (o.amount || o.price || 0), 0);
  const averageOrderValue = completedOrders.length > 0 ? revenue / completedOrders.length : 0;

  const ordersByMethod = filteredOrders.reduce((acc, o) => {
    if (!o) return acc;
    const method = o.paymentMethod || 'unknown';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ordersByCarrier = filteredOrders.reduce((acc, o) => {
    if (!o) return acc;
    const carrier = o.carrier || 'unknown';
    acc[carrier] = (acc[carrier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exportReport = () => {
    const report = {
      period: dateRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalOrders: filteredOrders.length,
        completedOrders: completedOrders.length,
        pendingOrders: pendingOrders.length,
        cancelledOrders: cancelledOrders.length,
        revenue: revenue,
        averageOrderValue: averageOrderValue
      },
      ordersByMethod,
      ordersByCarrier,
      orders: filteredOrders
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-400"></i>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="fas fa-chart-bar text-blue-400"></i>
          Báo Cáo & Thống Kê
        </h2>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="today">Hôm Nay</option>
            <option value="week">7 Ngày Qua</option>
            <option value="month">Tháng Này</option>
            <option value="year">Năm Nay</option>
            <option value="all">Tất Cả</option>
          </select>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg transition-all flex items-center gap-2"
          >
            <i className="fas fa-download"></i>
            <span>Xuất Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Tổng Đơn Hàng</div>
          <div className="text-2xl font-bold">{filteredOrders.length}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Đã Hoàn Thành</div>
          <div className="text-2xl font-bold text-green-400">{completedOrders.length}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Đang Chờ</div>
          <div className="text-2xl font-bold text-yellow-400">{pendingOrders.length}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Doanh Thu</div>
          <div className="text-2xl font-bold text-blue-400">{revenue.toLocaleString('vi-VN')}₫</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Giá Trị Đơn Trung Bình</div>
          <div className="text-xl font-bold">{averageOrderValue.toLocaleString('vi-VN')}₫</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Tỷ Lệ Hoàn Thành</div>
          <div className="text-xl font-bold">
            {filteredOrders.length > 0 
              ? ((completedOrders.length / filteredOrders.length) * 100).toFixed(1) 
              : 0}%
          </div>
        </div>
      </div>

      {/* Orders by Payment Method */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">Đơn Hàng Theo Phương Thức Thanh Toán</h3>
        <div className="space-y-3">
          {Object.entries(ordersByMethod).length > 0 ? (
            Object.entries(ordersByMethod).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="capitalize">{method === 'bank' ? 'Chuyển Khoản' : method === 'momo' ? 'MoMo' : method === 'zalopay' ? 'ZaloPay' : method}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${filteredOrders.length > 0 ? (count / filteredOrders.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold w-12 text-right">{count}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">Chưa có dữ liệu</div>
          )}
        </div>
      </div>

      {/* Orders by Carrier */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">Đơn Hàng Theo Nhà Mạng</h3>
        <div className="space-y-3">
          {Object.entries(ordersByCarrier).length > 0 ? (
            Object.entries(ordersByCarrier)
              .sort((a, b) => b[1] - a[1])
              .map(([carrier, count]) => (
                <div key={carrier} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{carrier}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full" 
                        style={{ width: `${filteredOrders.length > 0 ? (count / filteredOrders.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold w-12 text-right">{count}</span>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-gray-400 py-4">Chưa có dữ liệu</div>
          )}
        </div>
      </div>
    </div>
  );
}

