export function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function formatTimeIndo(timeStr) {
  if (!timeStr) return '-';
  // If full ISO string
  if (timeStr.includes('T')) {
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timeStr;
    }
  }
  return timeStr;
}

export function formatDateTimeIndo(dateTimeStr) {
  if (!dateTimeStr) return '-';
  try {
    const d = new Date(dateTimeStr);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return dateTimeStr;
  }
}
