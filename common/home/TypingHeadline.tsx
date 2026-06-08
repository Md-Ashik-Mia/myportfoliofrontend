'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const FULL_TEXT = "Hey! I'm Md Ashik Mia";
const FIRST_LINE = 'Hey!';
const SECOND_LINE = "I'm";

function AuroraText({ children }: { children: string }) {
  return (
    <span className="relative inline-block align-baseline">
      <span className="sr-only">{children}</span>
      <span className="animate-aurora-text bg-size-[200%_auto] bg-clip-text text-transparent" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export default function TypingHeadline() {
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const timer = window.setTimeout(() => {
        setTypedLength(FULL_TEXT.length);
      }, 0);

      return () => window.clearTimeout(timer);
    }

    const state = { value: 0 };

    const timeline = gsap.timeline({ repeat: -1 });

    timeline.to(state, {
      value: FULL_TEXT.length,
      duration: 2.8,
      ease: 'none',
      onUpdate: () => {
        setTypedLength(Math.round(state.value));
      },
    });

    timeline.to({}, { duration: 1.0 });

    timeline.to(state, {
      value: 0,
      duration: 1.8,
      ease: 'none',
      onUpdate: () => {
        setTypedLength(Math.round(state.value));
      },
    });

    timeline.to({}, { duration: 0.55 });

    return () => {
      timeline.kill();
    };
  }, []);

  const cursorLine =
    typedLength <= FIRST_LINE.length ? 1 : typedLength <= FIRST_LINE.length + 1 + SECOND_LINE.length ? 2 : 3;

  useEffect(() => {
    const cursor = document.querySelector('[data-typing-cursor]');
    if (!cursor) {
      return;
    }

    const blinkTween = gsap.to(cursor, {
      opacity: 0,
      duration: 0.55,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });

    return () => {
      blinkTween.kill();
    };
  }, []);

  const firstLineVisible = FULL_TEXT.slice(0, Math.min(typedLength, FIRST_LINE.length));
  const secondLineStart = FIRST_LINE.length + 1;
  const secondLineVisible =
    typedLength > secondLineStart
      ? FULL_TEXT.slice(secondLineStart, Math.min(typedLength, secondLineStart + SECOND_LINE.length))
      : '';
  const thirdLineStart = secondLineStart + SECOND_LINE.length + 1;
  const thirdLineVisible = typedLength > thirdLineStart ? FULL_TEXT.slice(thirdLineStart, typedLength) : '';

  return (
    <>
      <style>{`
        @keyframes auroraText {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

        .animate-aurora-text {
          background-image: linear-gradient(135deg, #38bdf8, #3b82f6, #ec4899, #38bdf8);
          animation: auroraText 7s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-aurora-text {
            animation: none;
          }
        }
      `}</style>

      <h1 className="max-w-[12ch] text-5xl font-extrabold leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-[4.8rem]">
        <span className="block text-white/95">
          {firstLineVisible}
          {cursorLine === 1 ? (
            <span data-typing-cursor className="ml-1 inline-block text-[#7fb0ff]">
              |
            </span>
          ) : null}
        </span>

        <span className="block text-white/95">
          {secondLineVisible}
          {cursorLine === 2 ? (
            <span data-typing-cursor className="ml-1 inline-block text-[#7fb0ff]">
              |
            </span>
          ) : null}
        </span>

        <span className="block">
          {thirdLineVisible ? <AuroraText>{thirdLineVisible}</AuroraText> : null}
          {cursorLine === 3 ? (
            <span data-typing-cursor className="ml-1 inline-block text-[#7fb0ff]">
              |
            </span>
          ) : null}
        </span>
      </h1>
    </>
  );
}
