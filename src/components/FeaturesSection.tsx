'use client';

import { Rocket, Wifi, BadgePercent, RefreshCcw, ShieldCheck, Headphones } from 'lucide-react';
import Reveal from './ui/Reveal';

const FEATURES = [
  {
    icon: Rocket,
    title: 'Kích hoạt siêu nhanh',
    description:
      'Kích hoạt gói cước của bạn trong vài phút, không phải vài giờ. Thiết lập tức thì và truy cập ngay vào mạng tốc độ cao.',
    accent: 'from-orange-500/25 to-amber-500/15',
    ring: 'ring-orange-400/20',
    iconText: 'text-orange-300',
  },
  {
    icon: Wifi,
    title: 'Sẵn sàng 4G & 5G',
    description:
      'Truy cập mạng 4G và 5G mới nhất từ tất cả các nhà mạng lớn. Trải nghiệm tốc độ internet cực nhanh.',
    accent: 'from-brand-500/25 to-accent/15',
    ring: 'ring-brand-400/30',
    iconText: 'text-brand-300',
  },
  {
    icon: BadgePercent,
    title: 'Giá tốt nhất đảm bảo',
    description:
      'So sánh giá từ tất cả các nhà mạng và tiết kiệm lên đến 50% hóa đơn hàng tháng. Chúng tôi cung cấp các gói tốt nhất.',
    accent: 'from-emerald-500/25 to-cyan-500/15',
    ring: 'ring-emerald-400/20',
    iconText: 'text-emerald-300',
  },
  {
    icon: RefreshCcw,
    title: 'Thay đổi gói dễ dàng',
    description:
      'Chuyển đổi gói cước hoặc nhà mạng bất cứ lúc nào không có phí ẩn. Nâng cấp hoặc hạ cấp theo nhu cầu của bạn.',
    accent: 'from-purple-500/25 to-pink-500/15',
    ring: 'ring-purple-400/20',
    iconText: 'text-purple-300',
  },
  {
    icon: ShieldCheck,
    title: '100% an toàn',
    description:
      'Thông tin thanh toán và cá nhân của bạn được bảo vệ bằng mã hóa cấp ngân hàng. Chúng tôi không bao giờ chia sẻ dữ liệu của bạn.',
    accent: 'from-red-500/25 to-rose-500/15',
    ring: 'ring-red-400/20',
    iconText: 'text-red-300',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ chuyên nghiệp',
    description:
      'Đội ngũ chuyên gia mạng của chúng tôi sẵn sàng 24/7 để giúp bạn chọn gói cước hoàn hảo và giải quyết mọi vấn đề.',
    accent: 'from-indigo-500/25 to-purple-500/15',
    ring: 'ring-indigo-400/20',
    iconText: 'text-indigo-300',
  },
];

const CERTS = [
  {
    title: 'Đối tác được chứng nhận',
    desc: 'Nhà phân phối được ủy quyền cho tất cả các nhà mạng lớn Việt Nam',
    icon: ShieldCheck,
    color: 'text-brand-300',
    bg: 'bg-brand-500/10 border-brand-500/20',
  },
  {
    title: 'Nhà phân phối chính thức',
    desc: 'Được ủy quyền chính thức để bán gói cước từ các nhà mạng lớn',
    icon: BadgePercent,
    color: 'text-accent-400',
    bg: 'bg-accent/10 border-accent/20',
  },
  {
    title: 'Giao dịch an toàn',
    desc: 'Xử lý thanh toán tuân thủ PCI DSS',
    icon: ShieldCheck,
    color: 'text-purple-300',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    title: 'Đảm bảo hoàn tiền',
    desc: 'Đảm bảo hài lòng 30 ngày cho tất cả các gói cước',
    icon: RefreshCcw,
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="container-app relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
              Tại sao chọn chúng tôi
            </span>
            <h2 className="section-title mt-5">
              <span className="text-gradient">Một nền tảng, mọi nhà mạng</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary">
              Chúng tôi không chỉ là nhà phân phối — chúng tôi là đối tác đáng tin cậy của bạn
              trong việc tìm gói cước di động hoàn hảo phù hợp với lối sống và ngân sách của bạn.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={idx * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-card-hover sm:p-7">
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} ring-1 ${feature.ring} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-6 w-6 ${feature.iconText}`} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-base font-bold text-text-primary sm:text-lg">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Certifications row */}
        <Reveal delay={120}>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {CERTS.map((cert) => {
                const Icon = cert.icon;
                return (
                  <div
                    key={cert.title}
                    className={`group rounded-2xl border ${cert.bg} p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-bg-base/40 ${cert.color} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <h4 className="text-sm font-bold text-text-primary sm:text-base">
                        {cert.title}
                      </h4>
                    </div>
                    <p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
                      {cert.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
