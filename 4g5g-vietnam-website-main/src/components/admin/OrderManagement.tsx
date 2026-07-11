'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadOrders();
    
    // Lắng nghe event khi có đơn hàng mới được tạo
    const handleOrdersUpdated = () => {
      loadOrders();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('ordersUpdated', handleOrdersUpdated);
    }
    
    // Auto-refresh mỗi 5 giây để đồng bộ dữ liệu
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('ordersUpdated', handleOrdersUpdated);
      }
      clearInterval(interval);
    };
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
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });

      if (response.ok) {
        loadOrders();
      }
    } catch (error) {
      alert('Lỗi khi cập nhật');
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h2>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tất cả' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Khách Hàng</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gói Cước</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Số Tiền</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Thanh Toán</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const orderId = order.orderId || order.id || 'N/A';
                const amount = order.amount || order.price || 0;
                const packageName = order.packageName || order.planName || 'N/A';
                const customerName = order.customerName || order.name || 'N/A';
                const customerPhone = order.customerPhone || order.phone || 'N/A';
                return (
                <tr key={orderId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{orderId.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm">
                    <div>{customerName}</div>
                    <div className="text-xs text-gray-500">{customerPhone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{packageName}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {amount.toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.paymentMethod === 'momo'
                        ? 'bg-pink-500/20 text-pink-400'
                        : order.paymentMethod === 'bank'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.paymentMethod === 'momo' ? 'MoMo' : order.paymentMethod === 'bank' ? 'Chuyển Khoản' : 'ZaloPay'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(orderId, e.target.value as Order['status'])}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Chờ thanh toán</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
