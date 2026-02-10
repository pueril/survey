'use client';

import { motion } from 'framer-motion';

interface YesNoToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  label: string;
}

export function YesNoToggle({ value, onChange, label }: YesNoToggleProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label}
      </label>
      <div className="flex gap-4 justify-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(true)}
          className={`flex-1 max-w-xs py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all ${
            value === true
              ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-400 ring-offset-2'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm'
          }`}
        >
          <span className="text-2xl">✅</span>
          <span className="font-semibold">Sí</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(false)}
          className={`flex-1 max-w-xs py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all ${
            value === false
              ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400 ring-offset-2'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm'
          }`}
        >
          <span className="text-2xl">❌</span>
          <span className="font-semibold">No</span>
        </motion.button>
      </div>
    </div>
  );
}
