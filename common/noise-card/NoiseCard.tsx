'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface NoiseCardProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
  noiseOpacity?: number;
  grainSize?: number;
  bgColor?: string;
}

export default function NoiseCard({
  children,
  className = '',
  animated = false,
  noiseOpacity = 0.08,
  grainSize = 1,
  bgColor = 'bg-[#07111f]',
}: NoiseCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;

    const drawNoise = () => {
      const { width, height } = canvas;
      if (width === 0 || height === 0) return;

      if (grainSize === 1) {
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        const opacity = Math.floor(noiseOpacity * 255);

        for (let index = 0; index < data.length; index += 4) {
          const randomValue = Math.floor(Math.random() * 255);
          data[index] = randomValue;
          data[index + 1] = randomValue;
          data[index + 2] = randomValue;
          data[index + 3] = opacity;
        }

        ctx.putImageData(imageData, 0, 0);
      } else {
        ctx.clearRect(0, 0, width, height);
        for (let y = 0; y < height; y += grainSize) {
          for (let x = 0; x < width; x += grainSize) {
            const randomValue = Math.floor(Math.random() * 255);
            ctx.fillStyle = `rgba(${randomValue}, ${randomValue}, ${randomValue}, ${noiseOpacity})`;
            ctx.fillRect(x, y, grainSize, grainSize);
          }
        }
      }
    };

    const loop = () => {
      drawNoise();
      animationFrameId = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = Math.max(1, Math.floor(width));
        canvas.height = Math.max(1, Math.floor(height));
        drawNoise();
      }
    });

    resizeObserver.observe(container);

    if (animated) {
      loop();
    } else {
      drawNoise();
    }

    return () => {
      if (animated) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
    };
  }, [animated, noiseOpacity, grainSize]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${bgColor} ${className}`}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
