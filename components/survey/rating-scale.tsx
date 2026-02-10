'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface RatingScaleProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const emojis = [
  '😞',
  '🙁',
  '😕',
  '😐',
  '🙂',
  '😊',
  '😍',
];

const labels = [
  'Muy malo',
  'Malo',
  'Regular',
  'Aceptable',
  'Bueno',
  'Muy bueno',
  'Excelente',
];

export function RatingScale({ value, onChange, label }: RatingScaleProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label}
      </label>
      <div className="flex gap-2 justify-center items-center flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7].map((rating) => {
          const isSelected = value === rating;
          const isHovered = hoveredValue === rating;
          const displayValue = hoveredValue || value;

          return (
            <motion.button
              key={rating}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(rating)}
              onMouseEnter={() => setHoveredValue(rating)}
              onMouseLeave={() => setHoveredValue(null)}
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                isSelected
                  ? 'bg-blue-600 shadow-lg ring-2 ring-blue-400 ring-offset-2'
                  : isHovered
                  ? 'bg-blue-100 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 shadow-sm'
              }`}
            >
              <span>{emojis[rating - 1]}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 px-2">
        <span className="text-xs text-slate-500">1</span>
        <span className="text-xs text-slate-500">7</span>
      </div>
      {(hoveredValue || value > 0) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm font-medium text-blue-600 mt-2"
        >
          {labels[(hoveredValue || value) - 1]}
        </motion.p>
      )}
    </div>
  );
}
