import React from 'react';
import { MainAppNavbar } from './MainAppNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const location = useLocation();

  return <div className="min-h-screen bg-slate-50 flex flex-col">
      <MainAppNavbar />
      <main className="flex-1 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} 49FLASHMONEY. All rights reserved.
          </p>
          <p className="mt-2">
            Licensed and regulated. Please play responsibly.
          </p>
        </div>
      </footer>
    </div>;
}

