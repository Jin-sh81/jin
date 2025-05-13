'use client';

import { useState } from 'react';

interface RepeatSettingsProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const DAYS = [
  { value: 'monday', label: '월' },
  { value: 'tuesday', label: '화' },
  { value: 'wednesday', label: '수' },
  { value: 'thursday', label: '목' },
  { value: 'friday', label: '금' },
  { value: 'saturday', label: '토' },
  { value: 'sunday', label: '일' },
];

export default function RepeatSettings({ value, onChange }: RepeatSettingsProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(value);

  const handleDayClick = (day: string) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newSelectedDays);
    onChange(newSelectedDays);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        반복 요일
      </label>
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => handleDayClick(day.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedDays.includes(day.value)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>
    </div>
  );
} 