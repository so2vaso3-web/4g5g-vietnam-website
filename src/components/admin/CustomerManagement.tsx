'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';
import AlertModal from '@/components/AlertModal';

interface Customer {
  email: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'orders' | 'spent' | 'lastOrder'>('lastOrder');
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', type: 'success' as 'info' | 'success' | 'warning' | 'error' });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      let orders: Order[] = [];
      
      // Thử load từ API
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          orders = Array.isArray(data) ? data : [];
        }
      } catch (apiError) {
        console.error('API error, using localStorage:', apiError);
      }
      
      // Fallback to localStorage nếu API lỗi hoặc không có data
      if (orders.length === 0 && typeof window !== 'undefined') {
        const localOrders = localStorage.getItem('orders');
        if (localOrders) {
          try {
            const parsed = JSON.parse(localOrders);
            orders = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            orders = [];
          }
        }
      }
        
      // Group orders by customer email
      const customerMap = new Map<string, Customer>();
        
      orders.forEach(order => {
        if (!order) return;
        const email = order.customerEmail || order.email || 'unknown';
        const name = order.customerName || order.name || 'Không có tên';
        const phone = order.customerPhone || order.phone || 'N/A';
        
        if (!customerMap.has(email)) {
          customerMap.set(email, {
            email,
            name,
            phone,
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.createdAt,
            orders: []
          });
        }
        
        const customer = customerMap.get(email)!;
        customer.totalOrders++;
        customer.totalSpent += order.amount || order.price || 0;
        customer.orders.push(order);
        
        // Update last order date
        if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.createdAt;
        }
      });
      
      const customersList = Array.from(customerMap.values());
      setCustomers(customersList);
    } catch (error) {
      console.error('Error loading customers:', error);
      setAlertModal({ isOpen: true, message: 'Lỗi khi tải danh sách khách hàng!', type: 'error' });
    }
  };

  const filteredCustomers = customers
    .filter(customer => 
      customer.name.toLowerCase().includes(filter.toLowerCase()) ||
      customer.email.toLowerCase().includes(filter.toLowerCase()) ||
      customer.phone.includes(filter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'orders':
          return b.totalOrders - a.totalOrders;
        case 'spent':
          return b.totalSpent - a.totalSpent;
        case 'lastOrder':
          return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
        default:
          return 0;
      }
    });

  const exportCustomers = () => {
    try {
      const data = filteredCustomers.map(c => ({
        email: c.email,
        name: c.name,
        phone: c.phone,
        totalOrders: c.totalOrders,
        totalSpent: c.totalSpent,
        lastOrderDate: c.lastOrderDate
      }));

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setAlertModal({ isOpen: true, message: 'Đã xuất danh sách khách hàng thành công!', type: 'success' });
    } catch (error) {
      setAlertModal({ isOpen: true, message: 'Lỗi khi xuất dữ liệu!', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <i className="fas fa-users text-blue-400"></i>
          Quản Lý Khách Hàng
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportCustomers}
            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg transition-all flex items-center gap-2"
          >
            <i className="fas fa-download"></i>
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Tổng Khách Hàng</div>
          <div className="text-2xl font-bold">{customers.length}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Tổng Đơn Hàng</div>
          <div className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Tổng Doanh Thu</div>
          <div className="text-2xl font-bold">{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('vi-VN')}₫</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-1">Khách Hàng Mới (30 ngày)</div>
          <div className="text-2xl font-bold">
            {customers.filter(c => {
              const daysAgo = (Date.now() - new Date(c.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24);
              return daysAgo <= 30;
            }).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="lastOrder">Mới nhất</option>
            <option value="name">Tên A-Z</option>
            <option value="orders">Nhiều đơn nhất</option>
            <option value="spent">Chi tiêu nhiều nhất</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Khách Hàng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Số Điện Thoại</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Số Đơn</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Tổng Chi Tiêu</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Đơn Cuối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{customer.name}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{customer.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{customer.phone}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-semibold">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {customer.totalSpent.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(customer.lastOrderDate).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Không tìm thấy khách hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </div>
  );
}

