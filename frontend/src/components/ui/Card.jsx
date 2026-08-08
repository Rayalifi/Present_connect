import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  ...props
}) {
  return (
    <div
      className={`rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-6 transition-all duration-300 ${
        hoverEffect ? 'hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5' : ''
      } ${glow ? 'border-cyan-500/30 shadow-glow-cyan' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div>
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
