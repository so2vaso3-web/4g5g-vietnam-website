'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, Zap, Headphones, Info } from 'lucide-react';
import Reveal from './ui/Reveal';

export default function AboutSection() {
  const [content, setContent] = useState({
    title: 'Về chúng tôi',
    content:
      'Chúng tôi cung cấp các gói cước di động tốt nhất từ các nhà mạng lớn Việt Nam với giá cả cạnh tranh.',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const websiteContent = localStorage.getItem('websiteContent');
    if (!websiteContent) return;
    try {
      const parsed = JSON.parse(websiteContent);
      if (parsed.about) setContent(parsed.about);
    } catch {
      /* noop */
    }
  }, []);

  return (
    <section id="about" className="relative py-20 sm:py-24">
      <div className="container-app relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">
              <Info className="h-3.5 w-3.5" strokeWidth={2.2} />
              Câu chuyện của chúng tôi
            </span>
            <h2 className="section-title mt-5">
              <span className="text-gradient">{content.title}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary">
              {content.content}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-border bg-white/[0.03] p-6 sm:p-8 md:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
            />

            <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <p className="text-sm leading-relaxed text-text-secondary sm:text-base md:text-lg">
                  Với hơn{' '}
                  <span className="font-bold text-text-primary">5 năm kinh nghiệm</span> trong
                  ngành mạng di động, chúng tôi đã giúp hàng nghìn khách hàng tìm được gói cước
                  hoàn hảo với giá tốt nhất. Là nhà phân phối được ủy quyền cho tất cả các nhà
                  mạng lớn Việt Nam, chúng tôi kết hợp sức mạnh của quan hệ đối tác trực tiếp
                  với dịch vụ khách hàng không thể đánh bại để mang lại trải nghiệm liền mạch
                  từ lựa chọn đến kích hoạt.
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-3 gap-3 lg:gap-4">
                  {[
                    { value: '2019', label: 'Thành lập', color: 'text-brand-300' },
                    { value: '50 tỷ+', label: 'Khách hàng tiết kiệm', color: 'text-purple-300' },
                    { value: '4.9★', label: 'Đánh giá TB', color: 'text-amber-300' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="glass rounded-2xl px-3 py-4 text-center transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <div className={`text-lg font-extrabold ${stat.color} sm:text-2xl`}>
                        {stat.value}
                      </div>
                      <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-text-secondary sm:text-xs">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Three pillars */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {[
            {
              icon: ShieldCheck,
              title: 'An toàn',
              desc: 'Giao dịch an toàn và bảo mật với xử lý thanh toán được mã hóa',
              color: 'text-brand-300',
              bg: 'from-brand-500/20 to-brand-500/5',
            },
            {
              icon: Zap,
              title: 'Nhanh',
              desc: 'Kích hoạt và thiết lập nhanh chóng — kết nối trong vài phút',
              color: 'text-purple-300',
              bg: 'from-purple-500/20 to-purple-500/5',
            },
            {
              icon: Headphones,
              title: 'Hỗ trợ',
              desc: 'Hỗ trợ khách hàng 24/7 để giúp bạn với mọi câu hỏi',
              color: 'text-pink-300',
              bg: 'from-pink-500/20 to-pink-500/5',
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={idx * 80}>
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-white/[0.03] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-card-hover sm:p-8">
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pillar.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div
                      className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-base/40 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-6 w-6 ${pillar.color}`} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-base font-bold text-text-primary sm:text-lg">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
