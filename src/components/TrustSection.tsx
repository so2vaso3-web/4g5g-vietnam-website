'use client';

import { ShieldCheck, Users, Trophy, Clock, Lock, CheckCircle, BadgeCheck, Gem, Globe } from 'lucide-react';

export default function TrustSection() {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Thanh Toán An Toàn',
      description: 'Mã hóa SSL 256-bit',
      color: 'from-blue-500 to-cyan-500',
      iconColor: 'text-white',
      ringColor: 'ring-blue-400/40',
    },
    {
      icon: Globe,
      title: '50,000+ Khách Hàng',
      description: 'Được tin dùng bởi hàng nghìn người',
      color: 'from-brand-500 to-accent',
      iconColor: 'text-white',
      ringColor: 'ring-brand-400/40',
    },
    {
      icon: Trophy,
      title: 'Giải Thưởng',
      description: 'Dịch Vụ Tốt Nhất 2025',
      color: 'from-amber-500 to-orange-500',
      iconColor: 'text-white',
      ringColor: 'ring-amber-400/40',
    },
    {
      icon: Clock,
      title: 'Hỗ Trợ 24/7',
      description: 'Luôn sẵn sàng hỗ trợ',
      color: 'from-emerald-500 to-teal-500',
      iconColor: 'text-white',
      ringColor: 'ring-emerald-400/40',
    },
  ];

  return (
    <section className="py-20 px-4 bg-bg-base/50 relative">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="section-eyebrow inline-flex items-center gap-2 mb-4">
            <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
            <span>Đáng tin cậy</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Đáng Tin Cậy & An Toàn
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Bảo mật dữ liệu và sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-bg-elevated/50 rounded-2xl p-6 border border-border hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div
                  className={`relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} mb-4 shadow-lg ring-2 ${item.ringColor} transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-blue`}
                >
                  <Icon className={`h-7 w-7 ${item.iconColor}`} strokeWidth={2} />
                </div>
                <h3 className="relative text-base font-bold mb-2 text-text-primary group-hover:text-brand-300 transition-colors">{item.title}</h3>
                <p className="relative text-sm text-text-secondary">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Trust Badges - hiện đại */}
        <div className="mt-12 pt-12 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            <div className="group flex items-center gap-2.5 text-text-secondary hover:text-brand-300 transition-colors">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/30 sm:h-10 sm:w-10">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </span>
              <span className="text-sm font-medium">Bảo Mật SSL</span>
            </div>
            <div className="group flex items-center gap-2.5 text-text-secondary hover:text-emerald-300 transition-colors">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 sm:h-10 sm:w-10">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </span>
              <span className="text-sm font-medium">Tuân Thủ PCI</span>
            </div>
            <div className="group flex items-center gap-2.5 text-text-secondary hover:text-purple-300 transition-colors">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/30 sm:h-10 sm:w-10">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </span>
              <span className="text-sm font-medium">Dữ Liệu Được Bảo Vệ</span>
            </div>
            <div className="group flex items-center gap-2.5 text-text-secondary hover:text-amber-300 transition-colors">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30 sm:h-10 sm:w-10">
                <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </span>
              <span className="text-sm font-medium">Đối Tác Được Chứng Nhận</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
