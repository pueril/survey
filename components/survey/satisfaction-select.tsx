'use client';

import { motion } from 'framer-motion';

interface SatisfactionSelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const options = [
  { value: 'Muy satisfecho', emoji: '🤩', color: 'bg-green-500' },
  { value: 'satisfecho', emoji: '😊', color: 'bg-green-400' },
  { value: 'Neutral', emoji: '😐', color: 'bg-yellow-500' },
  { value: 'Insatisfecho', emoji: '🙁', color: 'bg-orange-500' },
  { value: 'Muy insatisfecho', emoji: '😡', color: 'bg-red-500' },
];

export function SatisfactionSelect({ value, onChange, label }: SatisfactionSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(option.value)}
              className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
                isSelected
                  ? `${option.color} text-white shadow-lg ring-2 ring-offset-2 ring-${option.color.split('-')[1]}-400`
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="text-xs font-medium text-center">
                {option.value}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
