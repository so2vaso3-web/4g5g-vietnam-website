'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  LogOut,
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  FileEdit,
  Settings,
  MessagesSquare,
  Users,
  BarChart3,
  Database,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import PackageManagement from '@/components/admin/PackageManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import ContentManagement from '@/components/admin/ContentManagement';
import SettingsManagement from '@/components/admin/SettingsManagement';
import ChatManagement from '@/components/admin/ChatManagement';
import CustomerManagement from '@/components/admin/CustomerManagement';
import DataManagement from '@/components/admin/DataManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';

type TabKey =
  | 'dashboard'
  | 'packages'
  | 'orders'
  | 'content'
  | 'settings'
  | 'chat'
  | 'customers'
  | 'data'
  | 'reports';

const TABS: Array<{ key: TabKey; label: string; icon: any }> = [
  { key: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { key: 'packages', label: 'Quản lý gói cước', icon: Boxes },
  { key: 'orders', label: 'Quản lý đơn hàng', icon: ShoppingCart },
  { key: 'content', label: 'Quản lý nội dung', icon: FileEdit },
  { key: 'settings', label: 'Cài đặt', icon: Settings },
  { key: 'chat', label: 'Tin nhắn chat', icon: MessagesSquare },
  { key: 'customers', label: 'Khách hàng', icon: Users },
  { key: 'reports', label: 'Báo cáo', icon: BarChart3 },
  { key: 'data', label: 'Dữ liệu', icon: Database },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<TabKey>('dashboard');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const checkAuth = () => {
      if (typeof window !== 'undefined' && isMounted) {
        try {
          const authData = localStorage.getItem('adminAuth');
          if (authData) {
            try {
              const parsed = JSON.parse(authData);
              if (parsed.isAuthenticated && parsed.expiresAt && parsed.expiresAt > Date.now()) {
                if (isMounted) setIsAuthenticated(true);
              } else {
                localStorage.removeItem('adminAuth');
                if (isMounted) setIsAuthenticated(false);
              }
            } catch (e) {
              console.error('Error parsing auth data:', e);
              localStorage.removeItem('adminAuth');
              if (isMounted) setIsAuthenticated(false);
            }
          } else {
            if (isMounted) setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error checking auth:', error);
          if (isMounted) setIsAuthenticated(false);
        } finally {
          if (isMounted) setCheckingAuth(false);
        }
      } else {
        if (isMounted) {
          setCheckingAuth(false);
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();

    timeoutId = setTimeout(() => {
      if (isMounted) setCheckingAuth(false);
    }, 2000);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('adminLoggedOut'));
    }
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="app-bg flex min-h-screen items-center justify-center text-text-primary">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-brand-300" strokeWidth={2} />
          <p className="text-base text-text-secondary">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="app-bg relative min-h-screen overflow-hidden text-text-primary">
      {/* Decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="container-app relative z-10 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-3xl border border-border bg-white/[0.04] p-5 backdrop-blur-md sm:mb-8 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand shadow-glow-blue">
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={1.8} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-gradient sm:text-2xl md:text-3xl">
                Admin Panel
              </h1>
              <p className="text-xs text-text-secondary sm:text-sm">
                Quản lý website và đơn hàng
              </p>
            </div>
          </div>
          <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
            <Link
              href="/"
              className="btn btn-secondary flex-1 !text-sm sm:flex-none"
            >
              <Home className="h-4 w-4" strokeWidth={2} />
              Về trang web
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-danger flex-1 !text-sm sm:flex-none"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-3xl border border-border bg-white/[0.04] p-2.5 backdrop-blur-md sm:mb-8 sm:gap-2.5 sm:p-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = currentPage === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                data-tab={tab.key}
                onClick={() => setCurrentPage(tab.key)}
                className={[
                  'group relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 sm:text-sm',
                  active
                    ? 'bg-gradient-brand text-white shadow-glow-blue'
                    : 'border border-transparent text-text-secondary hover:border-border-strong hover:bg-white/5 hover:text-text-primary',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.key === 'chat' &&
                  typeof window !== 'undefined' &&
                  (() => {
                    const chatMessages = JSON.parse(
                      localStorage.getItem('chatMessages') || '[]',
                    );
                    const unreadCount = chatMessages.filter(
                      (m: any) => !m.read && !m.isAdmin,
                    ).length;
                    if (unreadCount > 0) {
                      return (
                        <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      );
                    }
                    return null;
                  })()}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="rounded-3xl border border-border bg-white/[0.03] p-4 backdrop-blur-md sm:p-6 md:p-8">
          {currentPage === 'dashboard' && <AdminDashboard />}
          {currentPage === 'packages' && <PackageManagement />}
          {currentPage === 'orders' && <OrderManagement />}
          {currentPage === 'content' && <ContentManagement />}
          {currentPage === 'settings' && <SettingsManagement />}
          {currentPage === 'chat' && <ChatManagement />}
          {currentPage === 'customers' && <CustomerManagement />}
          {currentPage === 'reports' && <ReportsManagement />}
          {currentPage === 'data' && <DataManagement />}
        </div>
      </div>
    </div>
  );
}
