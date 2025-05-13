'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { FaPalette } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

interface BackgroundLayoutProps {
  children: React.ReactNode;
}

const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({ children }) => {
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout; 