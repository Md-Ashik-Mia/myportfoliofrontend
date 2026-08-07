'use client';

import React, { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GsapRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: number;
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
    if (direction === 'up') fromVars.y = 40;
    if (direction === 'down') fromVars.y = -40;
    if (direction === 'left') fromVars.x = 40;
    if (direction === 'right') fromVars.x = -40;
    if (direction === 'scale') fromVars.scale = 0.9;

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
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, elRef);

    return () => ctx.revert();
  }, [direction, delay, duration]);

  return (
    <div ref={elRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

export function GsapStagger({
  children,
  staggerAmount = 0.1,
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

    const targets = container.children;
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 35, scale: 0.95, force3D: true },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: staggerAmount,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: container,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [staggerAmount]);

  return (
    <div ref={containerRef} className={`will-change-transform ${className}`}>
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

    const handleMouseMove = (e: MouseEvent) => {
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
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        force3D: true,
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
