'use client';

import { type ReactNode } from 'react';

type ShimmerButtonProps = {
  href: string;
  text: string;
  icon: ReactNode;
  target?: string;
  download?: boolean | string;
};

export default function ShimmerButton({ href, text, icon, target, download }: ShimmerButtonProps) {
  const customCss = `
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }

    @keyframes glow-pulse {
      0%,
      100% {
        opacity: 0.65;
        transform: scale(0.98);
      }
      50% {
        opacity: 1;
        transform: scale(1.03);
      }
    }
  `;

  return (
    <div className="inline-flex items-center justify-center font-sans">
      <style>{customCss}</style>
      <a
        href={href}
        target={target}
        download={download}
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1.5px]"
      >

        <div
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[28px] blur-xl"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(47,98,255,0.85) 0%, rgba(47,98,255,0.45) 40%, rgba(47,98,255,0) 75%)',
            animation: 'glow-pulse 2.4s ease-in-out infinite',
            padding: '16px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background:
              'conic-gradient(from var(--angle), rgba(47,98,255,0.08), rgba(84,189,255,0.98), rgba(47,98,255,0.16), rgba(163,102,255,0.95), rgba(47,98,255,0.08))',
            animation: 'shimmer-spin 2s linear infinite',
            filter: 'saturate(1.4) brightness(1.2)',
            padding: '1.5px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <span className="relative z-10 inline-flex h-14 w-full items-center justify-center gap-3 rounded-[11px] border border-[#c7d5ff]/80 bg-transparent px-6 text-lg font-semibold text-white shadow-[0_0_24px_rgba(56,120,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.18)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-transparent group-hover:shadow-[0_0_32px_rgba(77,140,255,0.52),0_14px_30px_rgba(18,34,90,0.45)]">
          {text}
          {icon}
        </span>
      </a>
    </div>
  );
}
