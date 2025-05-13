'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Routine {
  id: string;
  name: string;
  completed: boolean;
  date: string;
}

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState<any>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    const initTranslation = async () => {
      const { t: translation } = await useTranslation('ko', 'common');
      setT(translation);
    };
    initTranslation();
  }, []);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('routines');
    if (saved) setRoutines(JSON.parse(saved));
  }, []);

  if (!mounted || !t) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-gray-600 dark:text-gray-300">Loading...</div>
    </div>;
  }

  const completedRoutines = routines.filter(routine => routine.completed);
  const groupedRoutines = completedRoutines.reduce((acc, routine) => {
    const date = routine.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(routine);
    return acc;
  }, {} as Record<string, Routine[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 dark:text-white mb-8"
        >
          {t('history')}
        </motion.h1>

        {Object.entries(groupedRoutines).length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 dark:text-gray-400"
          >
            {t('noHistory')}
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedRoutines).map(([date, routines], index) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {format(new Date(date), 'PPP', { locale: ko })}
                </h2>
                <div className="space-y-3">
                  {routines.map(routine => (
                    <div
                      key={routine.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-200">{routine.name}</span>
                      <span className="text-green-500">✓</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 