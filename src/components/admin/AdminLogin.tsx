'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, User, Lock, LogIn, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('adminAuth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          if (parsed.isAuthenticated && parsed.expiresAt > Date.now()) {
            onLogin();
          }
        } catch (e) {
          localStorage.removeItem('adminAuth');
        }
      }
    }
  }, [onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const authData = {
          isAuthenticated: true,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000),
          loginTime: Date.now(),
        };
        localStorage.setItem('adminAuth', JSON.stringify(authData));
        window.dispatchEvent(new Event('adminLoggedIn'));
        onLogin();
      } else {
        setError(data.error || 'Tên đăng nhập hoặc mật khẩu không đúng');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Lỗi kết nối. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="app-bg relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-brand-500/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-accent/25 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-strong rounded-3xl p-7 shadow-card sm:p-8">
          <div className="mb-7 text-center">
            <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow-blue">
              <ShieldCheck className="h-7 w-7 text-white" strokeWidth={1.8} />
              <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-accent/70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gradient sm:text-3xl">
              Đăng nhập Admin
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Nhập thông tin đăng nhập để truy cập trang quản trị
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-username"
                className="mb-1.5 block text-sm font-medium text-text-secondary"
              >
                Tên đăng nhập
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-secondary">
                  <User className="h-4 w-4" strokeWidth={2} />
                </span>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white/5 py-2.5 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  placeholder="Nhập tên đăng nhập"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-medium text-text-secondary"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-secondary">
                  <Lock className="h-4 w-4" strokeWidth={2} />
                </span>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white/5 py-2.5 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3">
                <p className="flex items-center gap-2 text-sm text-red-300">
                  <AlertCircle className="h-4 w-4" strokeWidth={2} />
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" strokeWidth={2} />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-secondary">
            <Sparkles className="h-3 w-3 text-brand-300" strokeWidth={2} />
            Truy cập bảo mật · Phiên 24 giờ
          </div>
        </div>
      </div>
    </div>
  );
}
