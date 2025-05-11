'use client';

import { useState, useEffect } from 'react';
import { FaPalette } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

interface BackgroundLayoutProps {
  children: React.ReactNode;
}

export default function BackgroundLayout({ children }: BackgroundLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [backgroundImages, setBackgroundImages] = useState<Record<string, string>>({});
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const savedBackgrounds = localStorage.getItem('backgroundImages');
    if (savedBackgrounds) setBackgroundImages(JSON.parse(savedBackgrounds));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('backgroundImages', JSON.stringify(backgroundImages));
    }
  }, [backgroundImages, mounted]);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImages(prev => ({
          ...prev,
          [pathname]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const currentBackground = backgroundImages[pathname] || '';

  return (
    <div 
      className="min-h-screen bg-background text-primary relative"
      style={{
        backgroundImage: mounted && currentBackground ? `url(${currentBackground})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 배경화면 오버레이 */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* 배경화면 변경 버튼 */}
      {mounted && (
        <div className="fixed top-4 right-4 z-50">
          <label className="p-2 rounded-lg bg-card-bg text-secondary hover:bg-card-border cursor-pointer transition-colors duration-200">
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundChange}
              className="hidden"
            />
            <FaPalette className="text-xl" />
          </label>
        </div>
      )}

      {/* 컨텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 