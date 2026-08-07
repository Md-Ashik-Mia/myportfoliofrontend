"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraView from '../auroratext/Auroratext';
import { GsapReveal, GsapStagger } from '../gsap/GsapAnimations';

// --- TypeScript Interfaces ---
interface GalleryItem {
  _id?: string;
  id?: number;
  type: 'image' | 'video';
  mediaUrl: string;
  title: string;
  subtitle: string;
}

interface GridItemProps {
  item: GalleryItem;
}

// --- Curated Achievements Mock Data ---
const initialItems: GalleryItem[] = [
  {
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
    title: 'National Hackathon Winner',
    subtitle: 'National ICT Division Event',
  },
  {
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-keyboard-hands-typing-close-up-1033-large.mp4',
    title: 'MERN Stack App Demo',
    subtitle: 'Interactive UI Dashboard Development',
  },
  {
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop',
    title: 'Best Innovator Award',
    subtitle: 'TechCon Conference 2025',
  },
  {
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-40482-large.mp4',
    title: 'Live Coding Workshop',
    subtitle: 'Performance Tuning & Next.js SSR',
  },
  {
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    title: 'Graduation Day',
    subtitle: 'BSc in Computer Science & Engineering',
  },
];

// --- GridItem Component ---
const GridItem: React.FC<GridItemProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (item.type === 'video' && videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch((err) => {
          console.log('Autoplay play interrupted:', err);
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, item.type]);

  return (
    <motion.div
      className="mb-6 break-inside-avoid relative cursor-pointer overflow-hidden rounded-[22px] border border-[#164962] bg-[#0A0C11]/25"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {item.type === 'video' ? (
        <div className="relative w-full h-full aspect-video sm:aspect-square md:aspect-[4/3] lg:aspect-[3/4]">
          <video
            ref={videoRef}
            src={item.mediaUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded-[20px]"
          />
        </div>
      ) : (
        <img
          src={item.mediaUrl}
          alt={item.title}
          className="w-full h-auto object-cover rounded-[20px] max-h-[500px]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/400x300/101f30/ffffff?text=Image+Not+Found`;
          }}
        />
      )}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-[20px]"
          >
            <div className="p-6 h-full flex flex-col justify-end">
              <div>
                <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                  {item.subtitle}
                </span>
                <p className="text-white font-bold text-lg md:text-xl mt-1 select-none">
                  {item.title}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- MasonryGrid Component ---
const MasonryGrid: React.FC<{ items: GalleryItem[] }> = ({ items }) => {
  return (
    <GsapStagger
      className="columns-1 gap-6 sm:columns-2 lg:columns-3 w-full"
    >
      {items.map((item, index) => (
        <GridItem key={item._id || item.id || index} item={item} />
      ))}
    </GsapStagger>
  );
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// --- Main Gallery Component ---
export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery`);
        if (response.ok) {
          const json = await response.json();
          if (json.data && json.data.length > 0) {
            setItems(json.data);
          } else {
            setItems(initialItems);
          }
        } else {
          setItems(initialItems);
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        setItems(initialItems);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen py-24 flex flex-col items-center justify-center">
      <GsapReveal direction="up">
        <AuroraView normaltext="G" highlighttext="allary" />
      </GsapReveal>
      
      <GsapReveal direction="up" delay={0.15}>
        <p className="text-white/45 text-center text-sm sm:text-base max-w-[60ch] mt-4 px-4 mb-16">
          Moments, achievements, workshops, and milestones captured along my journey.
        </p>
      </GsapReveal>
      
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-[1400px]">
        <main>
          <MasonryGrid items={items} />
        </main>
      </div>
    </div>
  );
}
