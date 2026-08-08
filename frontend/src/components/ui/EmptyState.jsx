import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = FolderOpen,
  title = 'Belum Ada Data',
  description = 'Tidak ada catatan yang ditemukan untuk kriteria pencarian ini.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 ${className}`}>
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-slate-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8 text-cyan-400/80" />
      </div>
      <h4 className="text-base font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingSpinner({ text = 'Memuat data...', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin`} />
      </div>
      {text && <p className="mt-3 text-xs font-medium text-slate-400 animate-pulse">{text}</p>}
    </div>
  );
}
