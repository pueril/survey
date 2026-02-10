'use client';

import { motion } from 'framer-motion';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export function TextInput({ value, onChange, label, placeholder, required = false }: TextInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label} {!required && <span className="text-slate-500">(opcional)</span>}
      </label>
      <motion.textarea
        whileFocus={{ scale: 1.01 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Escribe tu respuesta aquí...'}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-slate-700 placeholder:text-slate-400"
      />
      <div className="flex justify-end mt-2">
        <span className="text-xs text-slate-500">{value.length} caracteres</span>
      </div>
    </div>
  );
}
