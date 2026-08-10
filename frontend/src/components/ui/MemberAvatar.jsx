import React, { useState, useEffect } from 'react';
import { getPhotoUrl } from '../../utils/constants';

export function MemberAvatar({
  photo,
  name = 'Anggota',
  className = 'w-10 h-10 rounded-xl',
  alt,
  size = 'md'
}) {
  const [hasError, setHasError] = useState(false);
  const photoUrl = getPhotoUrl(photo);

  useEffect(() => {
    setHasError(false);
  }, [photo]);

  // Extract up to 2 uppercase initials from the member's name
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : 'A';

  // If photo is empty or failed to load, display styled fallback avatar with initials
  if (!photoUrl || hasError) {
    return (
      <div
        className={`${className} flex items-center justify-center font-bold text-cyan-300 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 shadow-inner shrink-0 select-none overflow-hidden`}
        title={name}
      >
        <span className={size === 'lg' ? 'text-2xl font-black' : size === 'sm' ? 'text-[10px]' : 'text-xs'}>
          {initials || 'H'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={alt || name}
      className={`${className} object-cover border border-slate-700 bg-slate-800 shrink-0`}
      onError={() => setHasError(true)}
    />
  );
}
