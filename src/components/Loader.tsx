import React from 'react';

interface LoaderProps {
  type?: 'spinner' | 'table' | 'cards';
  count?: number;
}

export const Loader: React.FC<LoaderProps> = ({ type = 'spinner', count = 3 }) => {
  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-heading font-medium text-slate-500 animate-pulse">
          Loading resources...
        </p>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full space-y-4 animate-pulse">
        {/* Table Header skeleton */}
        <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
        {/* Table Rows skeleton */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex space-x-4 py-3 border-b border-slate-100">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-6 bg-slate-100 rounded w-1/6"></div>
            <div className="h-6 bg-slate-100 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/12"></div>
            <div className="h-6 bg-slate-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    );
  }

  // Cards type
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-6 bg-slate-300 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded w-5/6"></div>
            <div className="h-3 bg-slate-100 rounded w-2/3"></div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-50">
            <div className="h-8 bg-slate-200 rounded-xl w-20"></div>
            <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
