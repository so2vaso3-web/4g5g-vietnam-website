import { CheckoutStep, STEPS } from './types';

interface Props {
  step: CheckoutStep;
  success?: boolean;
}

export default function StepIndicator({ step, success = false }: Props) {
  const currentIndex = success ? 4 : STEPS.findIndex((s) => s.id === step) + 1;
  const progress = Math.min(100, Math.max(8, (currentIndex / STEPS.length) * 100));

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
        <span className="text-white/90">
          {success ? 'Hoàn tất' : `Bước ${currentIndex} / ${STEPS.length}`}
        </span>
        <span className="truncate text-right text-white/60">
          {success ? 'Đơn hàng đã được ghi nhận' : STEPS[Math.min(currentIndex - 1, STEPS.length - 1)].title}
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10 sm:h-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-400 via-cyan-300 to-emerald-300 shadow-[0_0_18px_rgba(34,211,238,0.45)] transition-[width] duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%] animate-shimmer-bg opacity-60" />
      </div>
      <ol className="hidden grid-cols-3 gap-2 sm:grid">
        {STEPS.map((item) => {
          const reached = currentIndex >= item.index;
          return (
            <li
              key={item.id}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                reached
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-white/5 bg-white/0 text-white/40'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  reached
                    ? 'bg-gradient-to-br from-brand-500 to-cyan-400 text-white shadow-[0_0_12px_rgba(37,99,235,0.45)]'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {item.index}
              </span>
              <span className="truncate">{item.title}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}