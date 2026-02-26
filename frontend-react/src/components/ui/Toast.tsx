import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import type { ToastItem } from '../../types/adapter';
interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}
const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
};
const colors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};
const iconColors = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500'
};
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-in ${colors[toast.type]}`}>

            <Icon
              size={20}
              className={`flex-shrink-0 mt-0.5 ${iconColors[toast.type]}`} />

            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">

              <X size={16} />
            </button>
          </div>);

      })}
    </div>);

}