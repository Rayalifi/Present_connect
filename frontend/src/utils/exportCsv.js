export function exportAttendanceToCsv(attendanceList, filename = 'riwayat_absensi_himatif.csv') {
  if (!attendanceList || !attendanceList.length) {
    alert('Tidak ada data absensi untuk diekspor.');
    return;
  }

  const headers = ['No', 'Tanggal', 'Waktu', 'NIM', 'Nama Lengkap', 'Angkatan', 'Departemen', 'UID RFID', 'Status'];

  const rows = attendanceList.map((item, index) => [
    index + 1,
    `"${item.attendance_date || ''}"`,
    `"${item.attendance_time || ''}"`,
    `"${item.nim || ''}"`,
    `"${(item.name || '').replace(/"/g, '""')}"`,
    `"${item.generation || ''}"`,
    `"${item.department || ''}"`,
    `"${item.uid_rfid || ''}"`,
    `"${item.status || 'Hadir'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
