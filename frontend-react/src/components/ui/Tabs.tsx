import React from 'react';
import { cn } from '../../utils/cn';
interface TabsProps {
  tabs: {
    id: string;
    label: string;
  }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}
export function Tabs({
  tabs,
  activeTab,
  onChange,
  className
}: TabsProps) {
  return <div className={cn('border-b border-slate-200', className)}>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map(tab => <button key={tab.id} onClick={() => onChange(tab.id)} className={cn('whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors', activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700')} aria-current={activeTab === tab.id ? 'page' : undefined}>
            {tab.label}
          </button>)}
      </nav>
    </div>;
}

