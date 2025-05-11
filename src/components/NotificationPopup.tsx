'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationPopupProps {
  routine: {
    id: string;
    title: string;
    message: string;
  };
  onClose: () => void;
}

export default function NotificationPopup({ routine, onClose }: NotificationPopupProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 애니메이션 완료 후 닫기
    }, 5000); // 5초 후 자동으로 사라짐

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      router.push('/today');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div
            onClick={handleClick}
            className="bg-card-bg border border-card-border rounded-lg shadow-lg p-4 cursor-pointer hover:bg-card-border transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary">{routine.title}</h3>
                {routine.message && (
                  <p className="text-sm text-secondary mt-1">{routine.message}</p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="text-tertiary hover:text-primary"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 