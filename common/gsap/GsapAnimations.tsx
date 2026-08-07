'use client';

import React, { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  // Optimize GSAP defaults for 60fps hardware acceleration
  gsap.config({ force3D: true });
}

interface GsapRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
}

export function GsapReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
}: GsapRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let fromVars: gsap.TweenVars = { opacity: 0, force3D: true };
    if (direction === 'up') fromVars.y = 30;
    if (direction === 'down') fromVars.y = -30;
    if (direction === 'left') fromVars.x = 30;
    if (direction === 'right') fromVars.x = -30;
    if (direction === 'scale') fromVars.scale = 0.94;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        fromVars,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, elRef);

    return () => ctx.revert();
  }, [direction, delay, duration]);

  return (
    <div ref={elRef} className={`will-change-transform transform-gpu ${className}`}>
      {children}
    </div>
  );
}

export function GsapStagger({
  children,
  staggerAmount = 0.08,
  className = '',
}: {
  children: ReactNode;
  staggerAmount?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = Array.from(container.children);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 25, scale: 0.97, force3D: true },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: staggerAmount,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [staggerAmount]);

  return (
    <div ref={containerRef} className={`will-change-transform transform-gpu ${className}`}>
      {children}
    </div>
  );
}

export function GsapTextSplit({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = container.querySelectorAll('.gsap-word');
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          opacity: 0,
          y: 20,
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.04,
          delay,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: container,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay, text]);

  const wordList = text.split(' ');

  return (
    <h2
      ref={containerRef}
      className={`inline-flex flex-wrap gap-x-[0.3em] gap-y-[0.1em] ${className}`}
    >
      {wordList.map((word, index) => (
        <span key={`${word}-${index}`} className="gsap-word inline-block will-change-transform transform-gpu">
          {word}
        </span>
      ))}
    </h2>
  );
}

export function GsapCard3DTilt({
  children,
  className = '',
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Only enable mouse tilt on fine pointer devices (desktops) to prevent mobile touch lag
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true,
          overwrite: 'auto',
        });
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power3.out',
        force3D: true,
        overwrite: 'auto',
      });
    };

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt]);

  return (
    <div ref={cardRef} className={`will-change-transform transform-gpu ${className}`}>
      {children}
    </div>
  );
}

export function GsapMagnetic({
  children,
  strength = 0.3,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const moveX = (e.clientX - centerX) * strength;
        const moveY = (e.clientY - centerY) * strength;

        gsap.to(el, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true,
          overwrite: 'auto',
        });
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        force3D: true,
        overwrite: 'auto',
      });
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform transform-gpu ${className}`}>
      {children}
    </div>
  );
}
