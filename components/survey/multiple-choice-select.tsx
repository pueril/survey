'use client';

import { motion } from 'framer-motion';

interface MultipleChoiceSelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: string[];
}

export function MultipleChoiceSelect({ value, onChange, label, options }: MultipleChoiceSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = value === option;

          return (
            <motion.button
              key={index}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option)}
              className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400 ring-offset-2'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-white' : 'border-slate-400'
                }`}
              >
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-white" />
                )}
              </div>
              <span className="font-medium">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
