'use client';

import { useEffect, useState } from 'react';
import {
  Boxes,
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Mail,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Download,
  Upload,
  ArrowRight,
  Zap,
  Info,
  Settings as SettingsIcon,
  History,
  TrendingDown,
} from 'lucide-react';
import AlertModal from '@/components/AlertModal';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' });
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    momoOrders: 0,
    zalopayOrders: 0,
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    unreadMessages: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);

  const loadStats = async () => {
    if (typeof window !== 'undefined') {
      let packages: any[] = [];
      let orders: any[] = [];

      try {
        const packagesResponse = await fetch('/api/packages');
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          packages = Array.isArray(packagesData.packages) ? packagesData.packages : [];
          localStorage.setItem('packages', JSON.stringify(packages));
        } else {
          const packagesData = localStorage.getItem('packages');
          if (packagesData) {
            const parsed = JSON.parse(packagesData);
            packages = Array.isArray(parsed) ? parsed : [];
          }
        }
      } catch (e) {
        console.error('Error loading packages from API:', e);
        try {
          const packagesData = localStorage.getItem('packages');
          if (packagesData) {
            const parsed = JSON.parse(packagesData);
            packages = Array.isArray(parsed) ? parsed : [];
          }
        } catch (parseError) {
          console.error('Error parsing packages:', parseError);
          packages = [];
        }
      }

      try {
        const ordersResponse = await fetch('/api/orders');
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          orders = Array.isArray(ordersData.orders) ? ordersData.orders : [];
          localStorage.setItem('orders', JSON.stringify(orders));
        } else {
          const ordersData = localStorage.getItem('orders');
          if (ordersData) {
            const parsed = JSON.parse(ordersData);
            orders = Array.isArray(parsed) ? parsed : [];
          }
        }
      } catch (e) {
        console.error('Error loading orders from API:', e);
        try {
          const ordersData = localStorage.getItem('orders');
          if (ordersData) {
            const parsed = JSON.parse(ordersData);
            orders = Array.isArray(parsed) ? parsed : [];
          }
        } catch (parseError) {
          console.error('Error parsing orders:', parseError);
          orders = [];
        }
      }

      setOrders(orders);
      setPackages(packages);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const monthlyOrders = orders.filter((o: any) => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear && o.status === 'completed';
      });

      const completedOrders = orders.filter((o: any) => o.status === 'completed');
      const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.amount || o.price || 0), 0);
      const monthlyRevenue = monthlyOrders.reduce((sum: number, o: any) => sum + (o.amount || o.price || 0), 0);

      let visits: any[] = [];
      let uniqueVisitors: any[] = [];
      let chatMessages: any[] = [];

      try {
        const visitsData = localStorage.getItem('visitorStats');
        if (visitsData) {
          const parsed = JSON.parse(visitsData);
          visits = Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        visits = [];
      }

      try {
        const uniqueVisitorsData = localStorage.getItem('uniqueVisitors');
        if (uniqueVisitorsData) {
          const parsed = JSON.parse(uniqueVisitorsData);
          uniqueVisitors = Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        uniqueVisitors = [];
      }

      const today = new Date().toISOString().split('T')[0];
      const todayVisits = visits.filter((v: any) => v && v.date === today).length;

      try {
        const chatMessagesData = localStorage.getItem('chatMessages');
        if (chatMessagesData) {
          const parsed = JSON.parse(chatMessagesData);
          chatMessages = Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        chatMessages = [];
      }

      const unreadMessages = chatMessages.filter((m: any) => m && !m.read && !m.isAdmin).length;

      setStats({
        totalPackages: packages.length || 0,
        totalOrders: orders.length || 0,
        pendingOrders: orders.filter((o: any) => o.status === 'pending').length || 0,
        completedOrders: completedOrders.length || 0,
        cancelledOrders: orders.filter((o: any) => o.status === 'cancelled').length || 0,
        totalRevenue,
        monthlyRevenue,
        momoOrders: orders.filter((o: any) => o.paymentMethod === 'momo').length || 0,
        zalopayOrders: orders.filter((o: any) => o.paymentMethod === 'zalopay').length || 0,
        totalVisits: visits.length || 0,
        uniqueVisitors: uniqueVisitors.length || 0,
        todayVisits: todayVisits || 0,
        unreadMessages: unreadMessages || 0,
      });
    }
  };

  useEffect(() => {
    loadStats().catch(console.error);
    const interval = setInterval(() => {
      loadStats().catch(console.error);
    }, 5000);

    const handleOrdersUpdated = () => {
      loadStats().catch(console.error);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('ordersUpdated', handleOrdersUpdated);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('ordersUpdated', handleOrdersUpdated);
      }
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateGrowth = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? '100.0' : '0.0';
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getPreviousMonthRevenue = () => {
    if (typeof window !== 'undefined') {
      let orders: any[] = [];
      try {
        const ordersData = localStorage.getItem('orders');
        if (ordersData) {
          const parsed = JSON.parse(ordersData);
          orders = Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        orders = [];
      }
      const now = new Date();
      const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const previousYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      const previousMonthOrders = (Array.isArray(orders) ? orders : []).filter((o: any) => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === previousMonth &&
               orderDate.getFullYear() === previousYear &&
               o.status === 'completed';
      });

      return previousMonthOrders.reduce((sum: number, o: any) => sum + (o.amount || o.price || 0), 0);
    }
    return 0;
  };

  const previousMonthRevenue = getPreviousMonthRevenue();
  const revenueGrowth = calculateGrowth(stats.monthlyRevenue, previousMonthRevenue);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gradient sm:text-2xl md:text-3xl">
            Bảng điều khiển
          </h2>
          <p className="text-xs text-text-secondary sm:text-sm">
            Tổng quan về website và đơn hàng
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            variant="success"
            size="md"
            leftIcon={<Download className="h-4 w-4" strokeWidth={2} />}
            className="flex-1 !text-sm sm:flex-none"
            onClick={() => {
              const data = {
                packages: JSON.parse(localStorage.getItem('packages') || '[]'),
                orders: JSON.parse(localStorage.getItem('orders') || '[]'),
                settings: JSON.parse(localStorage.getItem('adminSettings') || '{}'),
                content: JSON.parse(localStorage.getItem('websiteContent') || '{}'),
                exportedAt: new Date().toISOString(),
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setAlertModal({ isOpen: true, message: 'Đã xuất backup thành công!', type: 'success' });
            }}
          >
            Xuất backup
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Upload className="h-4 w-4" strokeWidth={2} />}
            className="flex-1 !text-sm sm:flex-none"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      if (!event.target?.result) return;
                      const data = JSON.parse(event.target.result as string);
                      if (data.packages) localStorage.setItem('packages', JSON.stringify(data.packages));
                      if (data.orders) localStorage.setItem('orders', JSON.stringify(data.orders));
                      if (data.settings) localStorage.setItem('adminSettings', JSON.stringify(data.settings));
                      if (data.content) localStorage.setItem('websiteContent', JSON.stringify(data.content));
                      setAlertModal({ isOpen: true, message: 'Đã khôi phục backup thành công! Vui lòng refresh trang.', type: 'success' });
                      setTimeout(() => window.location.reload(), 1500);
                    } catch (err) {
                      setAlertModal({ isOpen: true, message: 'Lỗi: File backup không hợp lệ!', type: 'error' });
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
          >
            Khôi phục
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={Boxes} label="Tổng gói cước" value={stats.totalPackages} sub="Hiện có trong hệ thống" color="brand" />
        <StatCard icon={ShoppingCart} label="Tổng đơn hàng" value={stats.totalOrders} sub="Tất cả các đơn hàng" color="purple" />
        <StatCard icon={Clock} label="Đơn chờ xử lý" value={stats.pendingOrders} sub="Cần xử lý ngay" color="amber" />
        <StatCard
          icon={CheckCircle2}
          label="Đơn hoàn thành"
          value={stats.completedOrders}
          sub={`${stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}% tổng đơn`}
          color="emerald"
        />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Lượt truy cập"
          value={stats.uniqueVisitors}
          sub={`${stats.todayVisits} hôm nay · ${stats.totalVisits} tổng`}
          color="indigo"
          valueSize="md"
        />
        <StatCard
          icon={Mail}
          label="Tin nhắn chưa đọc"
          value={stats.unreadMessages}
          sub="Cần phản hồi"
          color="cyan"
          valueSize="md"
        />
        <StatCard icon={XCircle} label="Đơn đã hủy" value={stats.cancelledOrders} sub="Không thành công" color="red" />
        <StatCard
          icon={DollarSign}
          label="Tổng doanh thu"
          value={formatCurrency(stats.totalRevenue)}
          sub="Tất cả thời gian"
          color="emerald"
          valueSize="md"
        />
        <StatCard
          icon={Calendar}
          label="Doanh thu tháng này"
          value={formatCurrency(stats.monthlyRevenue)}
          sub={
            <span className="inline-flex items-center gap-1">
              {parseFloat(revenueGrowth) > 0 ? (
                <TrendingUp className="h-3 w-3" strokeWidth={2.2} />
              ) : parseFloat(revenueGrowth) < 0 ? (
                <TrendingDown className="h-3 w-3" strokeWidth={2.2} />
              ) : null}
              So với tháng trước
            </span>
          }
          color="cyan"
          valueSize="md"
        />
        <StatCard
          icon={CreditCard}
          label="Phương thức thanh toán"
          customValue={
            <div className="space-y-1 text-right">
              <div className="inline-flex items-center gap-2 rounded-md bg-pink-500/20 px-2 py-1 text-[11px] font-bold text-pink-300">
                {stats.momoOrders} MoMo
              </div>
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/20 px-2 py-1 text-[11px] font-bold text-emerald-300">
                {stats.zalopayOrders} ZaloPay
              </div>
            </div>
          }
          sub="MoMo & ZaloPay"
          color="pink"
        />
      </div>

      {/* Recent orders */}
      <div className="glass mb-6 rounded-2xl p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <History className="h-5 w-5 text-brand-300" strokeWidth={2} />
            Đơn hàng gần đây
          </h3>
          <button
            type="button"
            onClick={() => {
              const tab = document.querySelector('[data-tab="orders"]') as HTMLElement | null;
              if (tab) tab.click();
            }}
            className="inline-flex items-center gap-1 text-sm text-brand-300 transition-colors hover:text-brand-200"
          >
            Xem tất cả
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                {['Mã đơn', 'Khách hàng', 'Gói cước', 'Giá', 'Thanh toán', 'Trạng thái', 'Ngày'].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                let recentOrders: any[] = [];
                try {
                  const ordersData = localStorage.getItem('orders');
                  if (ordersData) {
                    const parsed = JSON.parse(ordersData);
                    recentOrders = Array.isArray(parsed) ? parsed : [];
                  }
                } catch (e) {
                  recentOrders = [];
                }
                recentOrders = recentOrders
                  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5);
                if (recentOrders.length === 0) {
                  return (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-text-secondary">
                        Chưa có đơn hàng nào
                      </td>
                    </tr>
                  );
                }
                return (Array.isArray(recentOrders) ? recentOrders : []).map((order: any) => (
                  <tr
                    key={order.id || order.orderId}
                    className="border-b border-border transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-3 py-3 font-mono text-xs text-text-secondary">
                      {order.id || order.orderId}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <div className="font-medium text-text-primary">
                        {order.customerName || order.name || 'N/A'}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {order.customerEmail || order.email || ''}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <div className="font-medium text-text-primary">
                        {order.packageName || order.planName}
                      </div>
                      <div className="text-xs capitalize text-text-secondary">
                        {order.carrier}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm font-bold text-text-primary">
                      {formatCurrency(order.amount || order.price || 0)}
                    </td>
                    <td className="px-3 py-3">
                      <PaymentBadge method={order.paymentMethod} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-3 py-3 text-xs text-text-secondary">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Quick actions */}
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Zap className="h-5 w-5 text-amber-300" strokeWidth={2} />
            Thao tác nhanh
          </h3>
          <div className="space-y-3">
            {[
              { tab: 'packages', label: 'Thêm gói cước mới', icon: Boxes, color: 'brand' },
              { tab: 'orders', label: 'Xem đơn hàng', icon: ShoppingCart, color: 'purple' },
              { tab: 'settings', label: 'Cài đặt hệ thống', icon: SettingsIcon, color: 'emerald' },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.tab}
                  type="button"
                  onClick={() => {
                    const tab = document.querySelector(`[data-tab="${q.tab}"]`) as HTMLElement | null;
                    if (tab) tab.click();
                  }}
                  className="group flex w-full items-center justify-between rounded-xl border border-border bg-white/[0.03] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-brand-300 transition-transform group-hover:scale-110" strokeWidth={2} />
                    <span className="font-semibold text-text-primary">{q.label}</span>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-text-secondary transition-all group-hover:translate-x-1 group-hover:text-brand-300"
                    strokeWidth={2}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Usage guide */}
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Info className="h-5 w-5 text-brand-300" strokeWidth={2} />
            Hướng dẫn sử dụng
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-text-secondary">
            Sử dụng menu bên trên để quản lý toàn bộ website và đơn hàng của bạn.
          </p>
          <div className="space-y-2 text-sm">
            {[
              { t: 'Quản lý gói cước:', d: 'Thêm, sửa, xóa các gói cước' },
              { t: 'Quản lý đơn hàng:', d: 'Xem và cập nhật trạng thái đơn hàng' },
              { t: 'Quản lý nội dung:', d: 'Chỉnh sửa nội dung website' },
              { t: 'Cài đặt:', d: 'Cấu hình MoMo, ZaloPay, và các thiết lập khác' },
            ].map((row) => (
              <div
                key={row.t}
                className="flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-white/[0.03]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-400" strokeWidth={2.2} />
                <div className="text-text-secondary">
                  <span className="font-semibold text-text-primary">{row.t}</span> {row.d}
                </div>
              </div>
            ))}
          </div>
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

// ---------- Local helpers ----------

type ColorKey = 'brand' | 'purple' | 'amber' | 'emerald' | 'indigo' | 'cyan' | 'red' | 'pink';

const COLOR_CLASSES: Record<
  ColorKey,
  { ring: string; iconBg: string; iconText: string }
> = {
  brand: { ring: 'ring-brand-400/30', iconBg: 'bg-brand-500/15', iconText: 'text-brand-300' },
  purple: { ring: 'ring-purple-400/30', iconBg: 'bg-purple-500/15', iconText: 'text-purple-300' },
  amber: { ring: 'ring-amber-400/30', iconBg: 'bg-amber-500/15', iconText: 'text-amber-300' },
  emerald: { ring: 'ring-emerald-400/30', iconBg: 'bg-emerald-500/15', iconText: 'text-emerald-300' },
  indigo: { ring: 'ring-indigo-400/30', iconBg: 'bg-indigo-500/15', iconText: 'text-indigo-300' },
  cyan: { ring: 'ring-cyan-400/30', iconBg: 'bg-cyan-500/15', iconText: 'text-cyan-300' },
  red: { ring: 'ring-red-400/30', iconBg: 'bg-red-500/15', iconText: 'text-red-300' },
  pink: { ring: 'ring-pink-400/30', iconBg: 'bg-pink-500/15', iconText: 'text-pink-300' },
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  customValue,
  valueSize = 'lg',
}: {
  icon: any;
  label: string;
  value?: number | string;
  customValue?: React.ReactNode;
  sub?: React.ReactNode;
  color: ColorKey;
  valueSize?: 'md' | 'lg';
}) {
  const c = COLOR_CLASSES[color];
  return (
    <div className="group glass rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${c.ring} ${c.iconBg} ${c.iconText} transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        {customValue ? (
          <div>{customValue}</div>
        ) : (
          <span
            className={`font-extrabold text-text-primary ${
              valueSize === 'md' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
            }`}
          >
            {value}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-text-secondary sm:text-sm">{label}</p>
      {sub && <p className="mt-1 text-[11px] text-text-secondary">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Chờ xử lý', cls: 'bg-amber-500/15 text-amber-300 border border-amber-400/30' },
    completed: { label: 'Hoàn thành', cls: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30' },
    cancelled: { label: 'Đã hủy', cls: 'bg-red-500/15 text-red-300 border border-red-400/30' },
  };
  const c = map[status] ?? { label: status, cls: 'bg-white/5 text-text-secondary border border-border' };
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-xs ${c.cls}`}>
      {c.label}
    </span>
  );
}

function PaymentBadge({ method }: { method: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    momo: { label: 'MoMo', cls: 'bg-pink-500/15 text-pink-300' },
    bank: { label: 'Chuyển khoản', cls: 'bg-emerald-500/15 text-emerald-300' },
    zalopay: { label: 'ZaloPay', cls: 'bg-brand-500/15 text-brand-300' },
    paypal: { label: 'PayPal', cls: 'bg-sky-500/15 text-sky-300' },
    crypto: { label: 'Crypto', cls: 'bg-amber-500/15 text-amber-300' },
  };
  const c = map[method] ?? { label: method, cls: 'bg-white/5 text-text-secondary' };
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-xs ${c.cls}`}>
      {c.label}
    </span>
  );
}
